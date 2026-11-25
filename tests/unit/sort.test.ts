import { byKarmaDesc, byNewest, byScoreAsc, byScoreDesc, sortByScoreAsc } from "@/utils/sort";

describe("comparators", () => {
  it("byScoreAsc sorts lowest score first", () => {
    expect([{ score: 3 }, { score: 1 }, { score: 2 }].sort(byScoreAsc)).toEqual([
      { score: 1 },
      { score: 2 },
      { score: 3 },
    ]);
  });

  it("byScoreDesc sorts highest score first", () => {
    expect([{ score: 3 }, { score: 1 }, { score: 2 }].sort(byScoreDesc)).toEqual([
      { score: 3 },
      { score: 2 },
      { score: 1 },
    ]);
  });

  it("byNewest sorts the latest time first", () => {
    expect([{ time: 100 }, { time: 300 }, { time: 200 }].sort(byNewest)).toEqual([
      { time: 300 },
      { time: 200 },
      { time: 100 },
    ]);
  });

  it("byKarmaDesc sorts highest karma first and unknown karma last", () => {
    const result = [{ karma: null }, { karma: 5 }, { karma: 50 }, { karma: null }].sort(
      byKarmaDesc,
    );
    expect(result.map((a) => a.karma)).toEqual([50, 5, null, null]);
  });
});

describe("sortByScoreAsc", () => {
  it("sorts lowest score first", () => {
    const result = sortByScoreAsc([{ score: 30 }, { score: 5 }, { score: 120 }, { score: 0 }]);
    expect(result.map((s) => s.score)).toEqual([0, 5, 30, 120]);
  });

  it("keeps the original order for equal scores", () => {
    const result = sortByScoreAsc([
      { id: "a", score: 10 },
      { id: "b", score: 5 },
      { id: "c", score: 10 },
    ]);
    expect(result.map((s) => s.id)).toEqual(["b", "a", "c"]);
  });

  it("returns a new array and leaves the input untouched", () => {
    const input = [{ score: 2 }, { score: 1 }];
    const result = sortByScoreAsc(input);
    expect(result).not.toBe(input);
    expect(input.map((s) => s.score)).toEqual([2, 1]);
  });

  it("handles an empty list", () => {
    expect(sortByScoreAsc([])).toEqual([]);
  });
});
