import './styles.scss'
import { Network } from "./Network";
import { getElementById, getElementByName, getElementByClass } from "./documentElement";
import { GameState, Action } from './GameState';




const phase = getElementByName<HTMLInputElement>('phase').item(0)

const game = new GameState();

const net = new Network(game.states)

const setMyMove = (v: Action) => {
    getElementById('pText').innerHTML = "My Move: " + v;
}

const setAgentMove = (v: Action) => {
    game.value = net.next(v)
    const evaluation = game.evaluate(v);
    if (phase.checked) {
        net.train(evaluation ? 100 : -100, v, () => console.log(`Trained: ${v}`, game.value, evaluation))
    }
    getElementById('oText').innerHTML = "Agent Move: " + game.value;
}

const onButtonClick = (e: any) => {
    setMyMove(e.target.value);
    setAgentMove(e.target.value)
}

getElementByClass<HTMLInputElement>('action-button').forEach((e: HTMLInputElement) =>
    e.addEventListener('click', onButtonClick)
);


let i: number | undefined;
getElementByName<HTMLFormElement>('phase-form').item(0).addEventListener('change', (e: any) => {
    console.log(e.target.value === 'train', i);
    if (e.target.value === 'train') {
        i = setInterval(() => onButtonClick({target: {value: Object.values(Action)[Math.floor(Math.random() * 3)]}}));
    } else if (e.target.value === 'evaluate' && i !== undefined) {
        clearInterval(i);
    }
});