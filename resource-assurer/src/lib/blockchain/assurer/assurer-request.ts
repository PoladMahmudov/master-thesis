export class AssurerRequest {    
    json = true;
    code = 'assurer';
    scope = 'assurer';
    table: string;
    upper_bound: string;
    lower_bound: string;
    key_type = 'sha256';
    index_position = 2;

    constructor(by: string, table: string) {
        this.upper_bound = by;
        this.lower_bound = by;
        this.table = table;
    }
}