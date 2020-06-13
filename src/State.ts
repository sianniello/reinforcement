export interface State<T> {
    states: Set<T>;
    value: T | undefined;
    evaluate(v: T): boolean;
}
