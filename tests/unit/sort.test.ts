import { sortByScoreAsc } from "@/utils/sort";

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
