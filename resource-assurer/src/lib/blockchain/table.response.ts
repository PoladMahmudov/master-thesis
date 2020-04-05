/** Response type with raws of struct */
export class TableResponse<S> {
    readonly rows: ReadonlyArray<S>;
    readonly more: boolean;
}