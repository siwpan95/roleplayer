import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 浏览器扩展构建：以 index.html 为 popup 入口；public/ 下的 manifest.json、composition.yml
// 一并拷贝进 dist。base "./" 兼容 file:// 预览与 chrome-extension:// 加载。
//
// 代码分割：把体积最大的数据表（怪物/法术/魔法物/条件）、引擎、UI、第三方依赖拆成独立
// chunk，避免单 chunk 1.2MB。均为静态 import，vite 自动在 index.html 注入 modulepreload，
// 在 chrome-extension:// 与 file:// 下均可正常加载。
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: "index.html",
      },
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "vendor-react";
            return "vendor";
          }
          if (id.includes("src/engine/data_")) return "data";
          if (id.includes("src/engine")) return "engine";
          if (id.includes("src/ui") || id.includes("src/main.tsx")) return "ui";
          return undefined;
        },
      },
    },
  },
});
