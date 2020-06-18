import * as tf from '@tensorflow/tfjs';
import { convertToOneHot, asyncForEach } from './utils';
import { Tensor2D } from '@tensorflow/tfjs';


export type Evaluation <T> = (lhs: T, rhs: T, desired ? : T) => number

interface INetwork <T> {
    actions: Array <T> ;
    next(action: T): T
    train(action: T, evaluate: Evaluation <T> ): void
}

export class Network <T> implements INetwork <T> {

    model: tf.Sequential;

    private _lock = false;
    
    get lock(): boolean {
        return this._lock; 
    }
    
    constructor(public actions: Array < T > ) {
        const layers = {
            layers: [
                tf.layers.dense({
                    units: this.actions.length,
                    inputShape: [this.actions.length],
                    useBias: false,
                    kernelInitializer: 'heNormal'
                }),
            ]
        }
        this.model = tf.sequential(layers)
        this.model.compile({
            loss: 'meanSquaredError',
            optimizer: 'sgd'
        });

    }

    next(action: T): T {

        const intMove = convertToOneHot(this.actions, action);
        const xs = tf.tensor2d(intMove, [1, this.actions.length]);
        const logits = ( < Tensor2D > this.model.predict(xs)).arraySync()[0]; // Value prediction

        return this.actions[logits.indexOf(Math.max(...logits))];
    }

    train(action: T, evaluate: Evaluation <T> ) {
        if (this.lock) {
            return
        }
        this._lock = true

        const intMove = convertToOneHot(this.actions, action);
        const xs = tf.tensor2d(intMove, [1, this.actions.length]);

        const logits = (this.model.predict(xs) as Tensor2D).arraySync()[0];

        const index = Math.floor((Math.random() * this.actions.length) + 0); // Random action index

        const evaluation = evaluate(action, this.actions[index]); // Reward calculation

        logits[index] = logits[index] + evaluation;

        console.log(`For ${action} trained ${this.actions[index]} with reward ${evaluation}`)

        const ys = tf.tensor2d(logits, [1, this.actions.length]);

        this.model.fit(xs, ys).then(() => this._lock = false);
    }

    parallelTrain(action: T, evaluate: Evaluation <T> ) {
        if (this.lock) {
            return
        }
        this._lock = true

        const intMove = convertToOneHot(this.actions, action);
        const xs = tf.tensor2d(intMove, [1, this.actions.length]);

        const logits = (this.model.predict(xs) as Tensor2D).arraySync()[0];

        
        asyncForEach(this.actions, (_, index: number) => {
            const evaluation = evaluate(action, this.actions[index]); // Reward calculation

            logits[index] = logits[index] + evaluation;

            console.log(`For ${action} trained ${this.actions[index]} with reward ${evaluation}`)

            const ys = tf.tensor2d(logits, [1, this.actions.length]);

            return this.model.fit(xs, ys);
        }).then(() => this._lock = false);

    }
}