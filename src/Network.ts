import * as tf from '@tensorflow/tfjs';
import { convertToOneHot, getMaxIndex } from './utils';
import { Tensor2D } from '@tensorflow/tfjs';

interface INetwork<T> {
    actions: Array<T>;
    next(action: T): T
    train(action: T, evaluate: (lhs: T, rhs: T) => boolean): void
}

export class Network<T> implements INetwork<T> {

    model: tf.Sequential;

    private lock = false;

    constructor(public actions: Array<T>) {
        const layers = {
            layers: [
                tf.layers.dense({units: this.actions.length, inputShape: [this.actions.length], useBias: false, kernelInitializer: 'heNormal'}),
            ]
        }
        this.model = tf.sequential(layers)
        this.model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
        
    }

    next(action: T): T {

        const intMove = convertToOneHot(this.actions, action);
        const xs = tf.tensor2d(intMove, [1, this.actions.length]);
        const logits = (<Tensor2D>this.model.predict(xs)).arraySync()[0];
            
        return this.actions[getMaxIndex(logits)];
    }

    train(action: T, evaluate: (lhs: T, rhs: T) => boolean) {
        if (this.lock) {
            return
        }
        this.lock = true

        const intMove = convertToOneHot(this.actions, action);
        const xs = tf.tensor2d(intMove, [1, this.actions.length]);
        const logits = (this.model.predict(xs) as Tensor2D).arraySync()[0];

        const index = Math.floor((Math.random() * this.actions.length) + 0);
        const evaluation = evaluate(action, this.actions[index]) ? 100 : -100;

        logits[index] = logits[index] + evaluation;

        console.log(`For ${action} train ${this.actions[index]} with ${evaluation}`)

        const ys = tf.tensor2d(logits, [1, this.actions.length]);

        this.model.fit(xs, ys).then(() => this.lock = false);
    }
}