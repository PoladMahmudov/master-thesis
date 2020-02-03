/** Response type with raws of struct */
export class TableResponse<S> {
    rows: S[];
    more: boolean;
}