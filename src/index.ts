import './styles.scss'
import { Network } from "./Network";
import { getElementById, getElementByName, getElementByClass } from "./documentElement";
import { plotProbs } from './plot';


const actions = ["SCISSOR", "PAPER", "ROCK"];

const net = new Network(actions);

const setMyMove = (v: string) => {
    getElementById('pText').innerHTML = "My Move: " + v;
}

const setAgentMove = (v: string) => {
    getElementById('oText').innerHTML = "Agent Move: " + net.next(v);
}

const onButtonClick = (e: any) => {
    setMyMove(e.target.value);
    setAgentMove(e.target.value)
}

getElementByClass<HTMLInputElement>('action-button').forEach((e: HTMLInputElement) =>
e.addEventListener('click', onButtonClick)
);


const evaluation = (l: string, r: string) => {
    const map = new Map([
        ["PAPER", "SCISSOR"],
        ["ROCK", "PAPER"],
        ["SCISSOR", "ROCK"]
    ]);
    return map.has(l) && map.get(l) === r
}


let i: number | undefined | NodeJS.Timeout;
getElementByName<HTMLFormElement>('phase-form').item(0).addEventListener('change', (e: any) => {
    const plot = plotProbs("plot", net)
    if (e.target.value === 'train') {
        i = setInterval(() => {
            const randomAction = net.actions[Math.floor(Math.random() * actions.length)];
            net.train(randomAction, evaluation);
            plot!();
        });
    } else if (e.target.value === 'evaluate' && i !== undefined) {
        clearInterval(i as NodeJS.Timeout);
    }
});