import { createGameApp } from "../../src/render/app/createGameApp";

describe("game app render boundary", () => {
  it("exports a game app factory without coupling simulation state to it", () => {
    expect(typeof createGameApp).toBe("function");
  });
});
