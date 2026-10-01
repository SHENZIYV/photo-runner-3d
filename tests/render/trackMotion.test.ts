import { createTrack } from "../../src/render/world/track";

describe("track motion", () => {
  it("scrolls the world toward the chase camera", () => {
    const track = createTrack();

    track.scroll(0);
    const start = track.group.position.z;
    track.scroll(10);

    expect(track.group.position.z).toBeGreaterThan(start);
    track.dispose();
  });
});
