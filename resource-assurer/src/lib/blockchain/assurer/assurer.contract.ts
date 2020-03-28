import { BaseContract } from '../base.contract';
import { ResourceStruct } from './resource.struct';
import { TableResponse } from '../table-response';
import { AssurerRequest } from './assurer-request';
import { ReportStruct } from './report.struct';

export class AssurerContract extends BaseContract {

    public static readonly ASSURER_ACCOUNT = 'assurer';
    public static readonly RESOURCE_TABLE = 'resources';
    public static readonly REPORT_TABLE = 'reports';
    public static readonly PUBLISH_ACTION = 'publish';
    public static readonly POST_ACTION = 'post';

    constructor() {
        super(AssurerContract.ASSURER_ACCOUNT);
    }

    /**
     * Find resource by hash
     * @param resourceHash is a sha256 string parameter
     * @returns rows array with either empty or single resource value
     */
    public async findResource(resourceHash: string): Promise<TableResponse<ResourceStruct>> {
        return await this.rpc.get_table_rows(
            new AssurerRequest(resourceHash, AssurerContract.RESOURCE_TABLE));
    }

    /**
     * Find reports for given resource
     * @param resourceHash is a sha256 string parameter
     * @returns rows array with either empty or reports value
     */
    public async findReports(resourceHash: string): Promise<TableResponse<ReportStruct>> {
        return await this.rpc.get_table_rows(
            new AssurerRequest(resourceHash, AssurerContract.REPORT_TABLE));
    }

    /**
     * Publish resource by struct
     * @param struct is a raw contract structure of a resource
     */
    public async publish(struct: ResourceStruct): Promise<void> {
        return this.transact<ResourceStruct>(AssurerContract.PUBLISH_ACTION, struct);
    }

    /**
     * Post report by struct
     * @param struct is a raw contract structure of a report with review
     */
    public async post(struct: ReportStruct): Promise<void> {
        return this.transact<ReportStruct>(AssurerContract.POST_ACTION, struct);
    }
}