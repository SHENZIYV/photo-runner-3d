import { createGameController } from "../../src/game/gameController";

describe("game controller", () => {
  function makeDeps() {
    const states: string[] = [];
    const results: number[] = [];
    return {
      states,
      results,
      deps: {
        render: { sync: () => undefined, reset: () => undefined },
        onState: (state: { phase: string }) => states.push(state.phase),
        onResult: (result: { score: number }) => results.push(result.score),
        loadBestScore: () => 0,
        saveBestScore: () => undefined,
      },
    };
  }

  it("starts, dispatches movement, and advances simulation", () => {
    const { deps } = makeDeps();
    const controller = createGameController(deps);

    controller.start("yang-hang");
    controller.dispatch({ type: "right" });
    controller.update(0.1);

    expect(controller.getState().phase).toBe("running");
    expect(controller.getState().lane).toBe(1);
    expect(controller.getState().distance).toBeGreaterThan(0);
  });

  it("ends a run, saves best score, and restarts the same character", () => {
    const { deps, results } = makeDeps();
    const controller = createGameController(deps);

    controller.start("yang-hang");
    controller.update(1);
    controller.collide();
    expect(controller.getState().phase).toBe("gameover");
    expect(results[0]).toBeGreaterThan(0);

    controller.restart();
    expect(controller.getState().phase).toBe("running");
    expect(controller.getState().characterId).toBe("yang-hang");
    expect(controller.getState().distance).toBe(0);
  });

  it("activates Yang Hang F1 sprint after energy is full", () => {
    const { deps } = makeDeps();
    const controller = createGameController(deps);

    controller.start("yang-hang");
    controller.collectEnergy(100);
    controller.dispatch({ type: "ability" });

    expect(controller.getState().sprintRemaining).toBe(4);
    expect(controller.getState().nitro).toBe(true);
  });

  it("toggles pause without advancing the run", () => {
    const { deps } = makeDeps();
    const controller = createGameController(deps);

    controller.start("yang-hang");
    controller.togglePause();
    controller.update(1);
    expect(controller.getState().phase).toBe("paused");
    expect(controller.getState().distance).toBe(0);

    controller.togglePause();
    controller.update(0.1);
    expect(controller.getState().phase).toBe("running");
    expect(controller.getState().distance).toBeGreaterThan(0);
  });
});
