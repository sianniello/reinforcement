/**
 * Converts a move into a one-hot vector.
 *
 * Params: Move
 * Return: One-Hot-Vector
 */


export const convertToOneHot = <T>(states: Set<T>, state: T) => {

    const index = [...states].indexOf(state);
    if (index === null) {
        throw new Error("State not defined")
    }

    const result = Array(states.size).fill(0)
    result[index] = 1;
    return result;

    // if(state == "ROCK")     return [1, 0, 0];
	// if(state == "PAPER")    return [0, 1, 0];
    // if(state == "SCISSORS") return [0, 0, 1];
    
}

/**
 * Choose the index of the maximum value from the array.
 *
 * Params: Array of values
 * Return: Index of the max value
 */
export const getMaxIndex = (values: number[]) => {
	let max = values[0];
	let index = 0;

	for(let i = 1; i<values.length; i++){
		if(values[i] > max){
			max = values[i];
			index = i;
		}
	}
	return index;
}