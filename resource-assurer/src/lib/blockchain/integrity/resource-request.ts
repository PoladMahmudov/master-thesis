export class ResourceRequest {    
    json = true;
    code = 'integrity';
    scope = '';
    table = 'resources';
    upper_bound: string;
    lower_bound: string;
    key_type = 'sha256';
    index_position = 2;

    constructor(resourceHash: string) {
        this.upper_bound = resourceHash;
        this.lower_bound = resourceHash;
    }
}