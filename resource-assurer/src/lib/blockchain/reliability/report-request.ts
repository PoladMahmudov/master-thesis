export class ReportRequest {    
    json = true;
    code = 'reliability';
    scope = '';
    table = 'reports';
    upper_bound: string;
    lower_bound: string;
    key_type = 'sha256';
    index_position = 2;

    constructor(resourceHash: string) {
        this.upper_bound = resourceHash;
        this.lower_bound = resourceHash;
    }
}