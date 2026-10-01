import { getQualityProfile } from "../../src/render/app/quality";

describe("mobile render quality", () => {
  it("selects a low-cost profile for a phone viewport", () => {
    expect(getQualityProfile({
      viewportWidth: 390,
      viewportHeight: 844,
      devicePixelRatio: 3,
      deviceMemory: 8,
      hardwareConcurrency: 8,
    })).toEqual({
      tier: "low",
      antialias: false,
      pixelRatio: 1.25,
      geometryDetail: 0.65,
      speedLineCount: 8,
    });
  });

  it("keeps a sharper profile for a capable desktop", () => {
    expect(getQualityProfile({
      viewportWidth: 1440,
      viewportHeight: 900,
      devicePixelRatio: 2,
      deviceMemory: 16,
      hardwareConcurrency: 12,
    })).toEqual({
      tier: "standard",
      antialias: true,
      pixelRatio: 2,
      geometryDetail: 1,
      speedLineCount: 16,
    });
  });

  it("falls back to low-cost rendering when hardware hints are weak", () => {
    expect(getQualityProfile({
      viewportWidth: 1280,
      viewportHeight: 720,
      devicePixelRatio: 1,
      deviceMemory: 2,
      hardwareConcurrency: 2,
    }).tier).toBe("low");
  });
});
