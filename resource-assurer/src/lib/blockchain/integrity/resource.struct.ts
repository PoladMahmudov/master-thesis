import { Struct } from '../struct';

export class ResourceStruct implements Struct {
    id?: number;
    hash: string;
    uri: string;
    repo_uri: string;
    user: string;
}
