# -*- mode: python ; coding: utf-8 -*-
"""安装器 / 卸载器回归测试。

背景（2026-08-29 上线前全检，安装→卸载闭环实测发现的 P0）：
    uninstall.exe 是 installer.exe 的逐字节副本，且它位于待卸载的目录中。
    Windows 禁止删除正在运行的 exe，于是：

      * 走注册表 UninstallString（即「添加/删除程序」点卸载）时，
        ``shutil.rmtree(dst)`` 在删到 uninstall.exe 时抛 PermissionError，
        未捕获的 traceback 同时打断了后续的快捷方式清理与 unregister_uninstall()，
        结果是「程序已残废、注册表条目还在、每次卸载都崩」的死锁状态；
      * 用户直接双击 uninstall.exe（不带参数）走的是**安装**分支 → 重装 → 同样崩溃。

    修复要点：
      1. do_uninstall 先清快捷方式与注册表，再删文件（失败时状态也自洽）；
      2. rmtree 放行「自身文件」与「因它而无法删除的安装目录」，残余交给
         脱离本进程的 .bat 延迟清理；
      3. 以卸载器身份启动（文件名 uninstall.exe）时默认进入卸载模式。

    本测试覆盖其中**不需要真实安装即可验证的不变量**，其余由手工 E2E 闭环保证。
"""
import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

installer = pytest.importorskip("installer", reason="installer 需要 winreg/ctypes（仅 Windows）")


class TestInvokedAsUninstaller:
    def test_setup_exe_is_not_uninstaller(self, monkeypatch):
        """以 D20-Setup-*.exe 身份启动时不应被判为卸载器。"""
        monkeypatch.setattr(sys, "argv", [r"C:\tmp\RolePlayer-Setup-3.0.0.exe"])
        monkeypatch.setattr(sys, "executable", r"C:\tmp\RolePlayer-Setup-3.0.0.exe")
        assert installer._invoked_as_uninstaller() is False

    def test_uninstall_exe_is_uninstaller(self, monkeypatch):
        """以 uninstall.exe 身份启动时必须判为卸载器，否则双击会触发重装。"""
        p = r"C:\Users\x\AppData\Local\Programs\RolePlayer\uninstall.exe"
        monkeypatch.setattr(sys, "argv", [p])
        monkeypatch.setattr(sys, "executable", p)
        assert installer._invoked_as_uninstaller() is True

    def test_argparse_prefers_explicit_install_flag(self):
        """--install 应能覆盖按文件名的自动判定（保留重装能力）。"""
        import argparse

        ap = argparse.ArgumentParser()
        ap.add_argument("--uninstall", action="store_true")
        ap.add_argument("--silent", action="store_true")
        ap.add_argument("--install", action="store_true")
        assert ap.parse_args(["--install"]).install is True
        assert ap.parse_args(["--install"]).uninstall is False


class TestCleanupBatInvariants:
    """延迟清理 .bat 的不变量。

    这些约束来自本机实测踩过的坑，写死在测试里防止后人无意破坏：
      * cmd 按 GBK 解读 .bat，且 if(...) / for(...) 的括号会被解析器误判为
        语句块边界（路径含 "(x86)" 时直接报「此时不应有 xxx」）→ 全篇零括号；
      * 必须用 CRLF 换行、UTF-8 无 BOM 以外还要注意首行 @echo off 不能失效。
    """

    def _lines(self, d=r"C:\Users\x\AppData\Local\Programs\D20",
               e=r"C:\Users\x\AppData\Local\Programs\RolePlayer\uninstall.exe"):
        return installer._cleanup_bat_lines(d, e)

    def test_no_parentheses_anywhere(self):
        """整个脚本（含注释）不得出现任何圆括号——cmd 括号配对误判铁律。"""
        content = "\n".join(self._lines())
        assert "(" not in content, "清理脚本出现了 '('，cmd 解析器会误判语句块边界"
        assert ")" not in content, "清理脚本出现了 ')'，cmd 解析器会误判语句块边界"

    def test_no_parentheses_even_with_x86_path(self):
        """路径含 (x86) 时仍不得引入括号（括号只能来自路径本身时也一样危险）。"""
        content = "\n".join(self._lines(
            r"C:\Program Files (x86)\D20",
            r"C:\Program Files (x86)\D20\uninstall.exe",
        ))
        # 路径自带括号是用户环境决定的，无法避免；但脚本**结构**必须不依赖括号。
        # 这里断言：脚本结构行（不含路径的行）零括号。
        for line in content.splitlines():
            stripped = line.replace(r"C:\Program Files (x86)\D20\uninstall.exe", "") \
                           .replace(r"C:\Program Files (x86)\D20", "")
            assert "(" not in stripped and ")" not in stripped, \
                f"脚本结构行引入了括号：{line}"

    def test_control_flow_uses_goto_labels(self):
        """循环与分支必须用 goto + 标签实现，不能用 if(...) 块。"""
        content = "\n".join(self._lines())
        assert ":wait" in content and "goto wait" in content, "延迟重试循环应基于 goto"
        assert ":rmdir" in content and ":done" in content

    def test_bat_is_gbk_encodable_and_crlf(self):
        """中文用户名路径必须能在 GBK 下往返（cmd 按 GBK 解读）。"""
        lines = self._lines(r"C:\Users\张三\AppData\Local\Programs\D20",
                            r"C:\Users\张三\AppData\Local\Programs\RolePlayer\uninstall.exe")
        content = "\r\n".join(lines)
        encoded = content.encode("gbk")
        assert encoded.decode("gbk") == content

    def test_targets_are_quoted(self):
        """路径含空格时必须加引号，否则 del/rmdir 会按空格截断。"""
        lines = self._lines(r"C:\Program Files\D20", r"C:\Program Files\D20\uninstall.exe")
        for line in lines:
            if "del /f /q " in line or "rmdir /s /q " in line:
                assert line.split(" ", 3)[-1].startswith('"'), f"路径未加引号：{line}"

    def test_script_deletes_itself_last(self):
        """清理脚本用完后应自删，避免 %TEMP% 堆积垃圾。"""
        assert self._lines()[-2].strip().startswith("del /f /q")
        assert "%~f0" in self._lines()[-2]


class TestShortcutContent:
    """快捷方式**内容**的回读验证。

    背景（2026-08-29，本次全检中最严重的一处隐藏缺陷）：
        installer.py 里 IShellLinkW 的 vtable 偏移被写成了 5/8/10/12，
        而真实偏移是 20=SetPath / 7=SetDescription / 9=SetWorkingDirectory /
        11=SetArguments。写错后：
          * 5=SetIDList 被当 SetPath 用 → 塞入伪造 IDList，Save 出 24KB~58KB
            的垃圾 .lnk（正常约 600 字节）；
          * 8=GetWorkingDirectory 与 10=GetArguments 实为 3 参数，却经 2 参数
            stdcall 指针调用 → 栈失衡，并向「被当作输出缓冲区的字符串」写入，
            破坏 Python 对象。
        叠加后果：快捷方式**从来就没写对过**（目标路径、参数全是错的），
        且 IPersistFile::Save 间歇抛 OSError(22, ..., -2147317563)。

    这些断言直接从磁盘回读 .lnk 并核对四个属性，能同时挡住「偏移写错」和
    「调用约定写错」两类回归——只看文件是否创建成功是抓不到的。
    """

    @staticmethod
    def _read_lnk(path):
        """用 IShellLink::Load + Get* 回读 .lnk，返回 (path, desc, workdir, args)。"""
        import ctypes
        from ctypes import POINTER, WINFUNCTYPE, byref, c_int, c_void_p, c_wchar_p

        ole32 = ctypes.windll.ole32
        ole32.CoInitialize(None)
        try:
            psl = c_void_p()
            assert ole32.CoCreateInstance(
                byref(installer._CLSID_ShellLink), None, 1,
                byref(installer._IID_IShellLinkW), byref(psl)) == 0
            vt = ctypes.cast(psl, POINTER(POINTER(c_void_p))).contents
            ppf = c_void_p()
            QI = WINFUNCTYPE(ctypes.c_long, c_void_p,
                             POINTER(installer._GUID), POINTER(c_void_p))(vt[0])
            assert QI(psl, byref(installer._IID_IPersistFile), byref(ppf)) == 0
            pfv = ctypes.cast(ppf, POINTER(POINTER(c_void_p))).contents
            # IPersistFile: 5=Load(LPCOLESTR, DWORD) 6=Save
            Load = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p, ctypes.c_ulong)(pfv[5])
            assert Load(ppf, path, 0) == 0, "IPersistFile::Load 失败"
            # IShellLinkW: 3=GetPath 6=GetDescription 8=GetWorkingDirectory 10=GetArguments
            GetPath = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p, c_int,
                                  c_void_p, ctypes.c_ulong)(vt[3])
            GetDesc = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p, c_int)(vt[6])
            GetWD = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p, c_int)(vt[8])
            GetArgs = WINFUNCTYPE(ctypes.c_long, c_void_p, c_wchar_p, c_int)(vt[10])
            b = [ctypes.create_unicode_buffer(1024) for _ in range(4)]
            GetPath(psl, b[0], 1024, None, 0)
            GetDesc(psl, b[1], 1024)
            GetWD(psl, b[2], 1024)
            GetArgs(psl, b[3], 1024)
            return tuple(x.value for x in b)
        finally:
            ole32.CoUninitialize()

    def test_shortcut_roundtrip(self, tmp_path):
        """创建后回读：目标路径 / 描述 / 工作目录 / 参数 必须逐项正确。"""
        target = sys.executable
        lp = str(tmp_path / "t.lnk")
        installer.make_shortcut(target, lp, "Role Player 跑团模拟器", "--uninstall")

        got_path, got_desc, got_wd, got_args = self._read_lnk(lp)
        assert got_path == target, f"目标路径错误：{got_path!r}"
        assert got_desc == "Role Player 跑团模拟器", f"描述错误：{got_desc!r}"
        assert got_wd == os.path.dirname(target), f"工作目录错误：{got_wd!r}"
        assert got_args == "--uninstall", f"参数错误：{got_args!r}"

    def test_shortcut_size_is_sane(self, tmp_path):
        """正常的 .lnk 约数百字节；vtable 偏移写错时会产出数万字节的垃圾。"""
        lp = str(tmp_path / "s.lnk")
        installer.make_shortcut(sys.executable, lp, "Role Player 跑团模拟器", "")
        size = os.path.getsize(lp)
        assert 100 < size < 8192, (
            f".lnk 大小 {size} 字节异常（正常约 600B；"
            "若达数万字节，多半是 IShellLinkW vtable 偏移又写错了）"
        )

    def test_shortcut_without_optional_args(self, tmp_path):
        """不传 description / arguments 时不应残留脏数据。"""
        lp = str(tmp_path / "n.lnk")
        installer.make_shortcut(sys.executable, lp)
        got_path, got_desc, _, got_args = self._read_lnk(lp)
        assert got_path == sys.executable
        assert got_args == ""
        assert got_desc == ""


class TestRunningSelf:
    def test_returns_absolute_path(self):
        p = installer._running_self()
        assert os.path.isabs(p), f"_running_self() 应返回绝对路径，实际：{p}"
