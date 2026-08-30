import traceback
from d20 import Character
from troupe import Simulator
from troupe.modules import get_module, available_modules
from troupe.render import render_status, render_world, render_party

print("modules:", available_modules())
try:
    sim = Simulator.quick(seed=7, ruleset="dnd5e",
                          module=get_module("border_shrine"), level=3, count=3)
    print("SIM BUILT. party=", len(sim.party), "places=", len(sim.ctx.world.places))
    res = sim.run(max_scenes=8, verbose=False)
    print("RUN DONE. scenes=", sim.ctx.state.scene_counter, "xp=", sim.ctx.state.total_xp,
          "chaos=", sim.ctx.state.chaos, "ending=", sim.ctx.state.ending)
    print("--- status ---")
    print(render_status(sim))
    print("--- world ---")
    print(render_world(sim))
    print("--- party ---")
    print(render_party(sim))
    sim.save("sim_save.json")
    sim2 = Simulator.load("sim_save.json")
    print("RELOAD OK. seed=", sim2.ctx.state.seed, "xp=", sim2.ctx.state.total_xp,
          "party=", len(sim2.party), "places=", len(sim2.ctx.world.places))
    simg = Simulator.quick(seed=3, ruleset="gurps", level=3, count=2)
    simg.run(max_scenes=4, verbose=False)
    print("GURPS RUN DONE. scenes=", simg.ctx.state.scene_counter, "xp=", simg.ctx.state.total_xp)
    print("ALL SMOKE OK")
except Exception:
    traceback.print_exc()
