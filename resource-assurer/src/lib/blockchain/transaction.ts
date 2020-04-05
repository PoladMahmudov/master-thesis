import { Action } from './action';

export interface Transaction<A extends Action> {
    readonly actions: ReadonlyArray<ActionWrapper<A>>;
}

interface ActionWrapper<D> {
    readonly account: string,
    readonly name: string,
    readonly authorization: ReadonlyArray<Authorization>;
    readonly data: D;
}

interface Authorization {
    readonly actor: string;
    readonly permission: string;
}