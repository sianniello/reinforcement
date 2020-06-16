import * as tf from '@tensorflow/tfjs';
import { convertToOneHot } from './utils';

//@ts-ignore
import * as Plotly from 'plotly.js/dist/plotly';

import { Tensor2D } from '@tensorflow/tfjs';
import { Network } from './Network';


export const plotProbs = <T>(divID: string, net: Network<T>) => {
	
	// Plot container initialization
	net.actions.forEach((a: T, i: number) => {
		const divElement = document.createElement("div")
		divElement.id = `div${i + 1}`
		divElement.setAttribute("class", "column")
		document.getElementById(divID)?.appendChild(divElement);
	});

	return () => {
		let moves = net.actions;
		const divs = moves.map((_: T, i: number) => `div${i + 1}`);
		let probs;
		let data: any;
		let xs;
		let logits;

		for(let i = 0; i < moves.length; i++){
			xs = tf.tensor2d(convertToOneHot(moves, moves[i]), [1, moves.length]);
			logits = (net.model.predict(xs) as Tensor2D).arraySync()[0];
			probs = tf.softmax(logits).arraySync();
			data = [
				{
					x: moves,
					y: probs,
					type:'bar'
				}
			];

			const layout = {
				title: 'What should I play against ' + moves[i] + '?',
				width: 450,
				height: 300

			};
			Plotly.newPlot(divs[i], data, layout);
		}
	}
}