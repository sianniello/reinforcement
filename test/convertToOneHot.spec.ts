import { convertToOneHot } from '../src/utils'

describe("convertToOneHot", () => {
    it("should return [1, 0, 0]", () => {
        const states = new Set(["ROCK", "PAPER", "SCISSORS"])
        const result = convertToOneHot(states, "ROCK")
        expect(result).toMatchObject([1, 0, 0])
    });

    it("should return [0, 1, 0]", () => {
        const states = new Set(["ROCK", "PAPER", "SCISSORS"])
        const result = convertToOneHot(states, "PAPER")
        expect(result).toMatchObject([0, 1, 0])
    });

    it("should return [0, 0, 1]", () => {
        const states = new Set(["ROCK", "PAPER", "SCISSORS"])
        const result = convertToOneHot(states, "SCISSORS")
        expect(result).toMatchObject([0, 0, 1])
    });
});