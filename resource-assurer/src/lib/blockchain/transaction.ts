import { Action } from './action';

export interface Transaction<A extends Action> {
    actions: ActionWrapper<A>[];
}

interface ActionWrapper<D> {
    account: string,
    name: string,
    authorization: Authorization[],
    data: D;
}

interface Authorization {
    actor: string;
    permission: string;
}