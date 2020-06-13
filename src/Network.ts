import * as tf from '@tensorflow/tfjs';
import { convertToOneHot, getMaxIndex } from './utils';
import { Tensor2D } from '@tensorflow/tfjs';

interface INetwork<T> {
    next(action: T): T
    train(reward: number, action: T, callback: () => void): void
}

export class Network<T> implements INetwork<T> {

    private model: tf.Sequential;
    private actionSet: Set<T>

    private lock = false;

    constructor(actions: Iterable<T>) {
        this.actionSet = new Set(actions)
        const layers = {
            layers: [
                tf.layers.dense({units: this.actionSet.size, inputShape: [this.actionSet.size], useBias: false, kernelInitializer: 'heNormal'}),
            ]
        }
        this.model = tf.sequential(layers)
        this.model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
        
    }

    next(action: T): T {

        const intMove = convertToOneHot(this.actionSet, action)
        const xs = tf.tensor2d(intMove, [1, this.actionSet.size])
        const logits = (<Tensor2D>this.model.predict(xs)).arraySync()[0]
            
        const index = getMaxIndex(logits)
    
        return Array.from(this.actionSet)[index]
    }

    train(reward: number, action: T, callback?: () => void) {
        if (this.lock) {
            return
        }
        this.lock = true
        const intMove = convertToOneHot(this.actionSet, action);
        const xs = tf.tensor2d(intMove, [1, this.actionSet.size]);
        const logits = (this.model.predict(xs) as Tensor2D).arraySync()[0];

        const index = Math.floor((Math.random() * this.actionSet.size + 0))

        logits[index] = logits[index] + reward;

        const ys = tf.tensor2d(logits, [1, this.actionSet.size]);

        this.model.fit(xs, ys).then(() => {
            this.lock = false;
            callback? callback() : null;
        });
    }
}