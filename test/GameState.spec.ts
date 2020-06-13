import { GameState, Action } from '../src/GameState';

describe("GameState", () => {

    const game = new GameState()

    it("should evaluate true if PAPER -> SCISSOR", () => {
        const proposedValue = Action.PAPER
        game.value = Action.SCISSOR
        expect(game.evaluate(proposedValue)).toBeTruthy()
    })

    it("should evaluate false if ROCK -> ROCK", () => {
        const proposedValue = Action.ROCK
        game.value = Action.ROCK
        expect(game.evaluate(proposedValue)).toBeFalsy()
    })
});