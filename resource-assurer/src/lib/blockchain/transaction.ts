import { Struct } from './struct';

export interface Transaction<D extends Struct> {
    actions: Action<D>[];
}

interface Action<D> {
    account: string,
    name: string,
    authorization: Authorization[],
    data: D;
}

interface Authorization {
    actor: string;
    permission: string;
}