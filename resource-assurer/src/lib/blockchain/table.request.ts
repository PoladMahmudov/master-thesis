export interface TableRequest {    
    readonly json: boolean;
    readonly code: string;
    readonly scope: string;
    readonly table: string;
    readonly upper_bound: string;
    readonly lower_bound: string;
    readonly key_type: string;
    readonly index_position: number;
    readonly limit: number;
}