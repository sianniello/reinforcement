/**
 * Converts a move into a one-hot vector.
 *
 * Params: Move
 * Return: One-Hot-Vector
 */
export const convertToOneHot = <T>(actions: Array<T>, action: T) => {

    const index = [...actions].indexOf(action);
    if (index === null) {
        throw new Error("State not defined")
    }

    const result = Array(actions.length).fill(0)
    result[index] = 1;
    return result;

}

/**
 * Choose the index of the maximum value from the array.
 *
 * Params: Array of values
 * Return: Index of the max value
 */
export const getMaxIndex = (values: number[]) => values.indexOf(Math.max(...values));