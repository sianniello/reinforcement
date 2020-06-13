import { State } from "./State";


export enum Action {
    SCISSOR = "SCISSOR",
    ROCK    = "ROCK",
    PAPER   = "PAPER"
}

export class GameState implements State<Action> {
    states: Set<Action>;
    value: Action | undefined;
    private map: Map<Action, Action> = new Map([
        [Action.PAPER,      Action.SCISSOR],
        [Action.ROCK,       Action.PAPER],
        [Action.SCISSOR,    Action.ROCK]
    ]);
    constructor() {
        this.states = new Set(Object.values(Action).filter((a: string | number) => typeof a === 'string') as Action[]);
    }
    evaluate(v: Action): boolean {
        if (this.value === undefined) {
            return false;
        }
        return this.value === this.map.get(v.toUpperCase() as Action);
    }

}
