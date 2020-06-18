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

export const asyncForEach = async <T, V>(array: Array<T>, callback: (item: T, index: number, array: Array<T>) => Promise<V>) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}