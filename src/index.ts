import './styles.scss'
import { Network, Evaluation } from "./Network";
import { getElementById, getElementByName, getElementByClass } from "./documentElement";
import { plotProbs } from './plot';


const actions = Array.from({length: 21}, (_, i: number) => i - 10);

const net = new Network(actions);

const setMyMove = (v: string) => {
    getElementById('pText').innerHTML = "My Move: " + v;
}

const setAgentMove = (v: string) => {
    getElementById('oText').innerHTML = "Agent Move: " + net.next(+v);
}

const onButtonClick = (e: any) => {
    setMyMove(e.target.value);
    setAgentMove(e.target.value)
}

getElementByClass<HTMLInputElement>('action-button').forEach((e: HTMLInputElement) =>
e.addEventListener('click', onButtonClick)
);


const evaluation: Evaluation<number> = (lhs: number, rhs: number, desired: number = 0) =>
    lhs + rhs === desired ? 100 : -100;



let i: number | undefined | NodeJS.Timeout;
const plot = plotProbs("plot", net)
let c = 0;
getElementByName<HTMLFormElement>('phase-form').item(0).addEventListener('change', (e: any) => {
    if (e.target.value === 'train') {
        i = setInterval(() => {
            if (net.lock) {
                return;
            }
            const randomAction = net.actions[c++ % net.actions.length];
            net.parallelTrain(randomAction, evaluation);
            plot!();
        });
    } else if (e.target.value === 'evaluate' && i !== undefined) {
        clearInterval(i as NodeJS.Timeout);
    }
});

getElementById('input-text').addEventListener('keyup', (e: KeyboardEvent) => {
    console.log(e);
    onButtonClick(e);
})