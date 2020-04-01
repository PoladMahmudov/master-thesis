import { Struct } from '../struct';

export class ResourceStruct implements Struct {
    public static readonly TABLE_NAME = 'resources';

    id: number;
    hash: string;
    uri: string;
    repo_uri: string;
    user: string;

    getTableName(): string {
        return ResourceStruct.TABLE_NAME;
    }
}
