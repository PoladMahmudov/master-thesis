import { BaseContract } from '../base.contract';
import { ResourceStruct } from './resource.struct';
import { TableResponse } from '../table-response';
import { AssurerRequest } from './assurer-request';
import { ReportStruct } from './report.struct';
import { VoteStruct } from './vote.struct';
import { PostAction } from './post.action';
import { PublishAction } from './publish.action';
import { VoteAction } from './vote.action';
import { UnvoteAction } from './unvote.action';
import { ExpireAction } from './expire.action';
import { CleanAction } from './clean.action';

export class AssurerContract extends BaseContract {

    public static readonly ASSURER_ACCOUNT = 'assurer';

    constructor() {
        super(AssurerContract.ASSURER_ACCOUNT);
    }

    /**
     * Find resource by hash
     * @param resourceHash is a sha256 string parameter
     * @returns rows array with either empty or single resource value
     */
    public async findResource(resourceHash: string): Promise<TableResponse<ResourceStruct>> {
        const rpc = await this.configuration.getRpc();
        return await rpc.get_table_rows(
            new AssurerRequest(resourceHash, ResourceStruct.TABLE_NAME, 'sha256'));
    }

    /**
     * Find reports for given resource
     * @param resourceHash is a sha256 string parameter
     * @returns rows array with either empty or reports value
     */
    public async findReports(resourceHash: string): Promise<TableResponse<ReportStruct>> {
        const rpc = await this.configuration.getRpc();
        return await rpc.get_table_rows(
            new AssurerRequest(resourceHash, ReportStruct.TABLE_NAME, 'sha256'));
    }

    /**
     * Find votes for given report
     * @param reportId 
     * @returns rows array with either empty or vote values
     */
    public async findVotes(reportId: number): Promise<TableResponse<VoteStruct>> {
        const rpc = await this.configuration.getRpc();
        return await rpc.get_table_rows(
            new AssurerRequest('' + reportId, VoteStruct.TABLE_NAME));
    }

    /**
     * Publish a resource
     * @param action
     */
    public async publish(action: PublishAction): Promise<void> {
        this.validate(action);
        return this.transact<PublishAction>(action);
    }

    /**
     * Post a report
     * @param action
     */
    public async post(action: PostAction): Promise<void> {
        this.validate(action);
        return this.transact<PostAction>(action);
    }

    /**
     * Vote for a report
     * @param action
     */
    public async vote(action: VoteAction): Promise<void> {
        this.validate(action);
        return this.transact<VoteAction>(action);
    }

    /**
     * Unvote for a report by action
     * @param action 
     */
    public async unvote(action: UnvoteAction): Promise<void> {
        this.validate(action);
        return this.transact<UnvoteAction>(action);
    }

    /**
     * Expire a report by action.
     * After expiration report cannot be voted anymore.
     * Later the clean action should be called to remove
     * remaining data after voting procedure.
     * 
     * @param action 
     */
    public async expire(action: ExpireAction): Promise<void> {
        this.validate(action);
        return this.transact<ExpireAction>(action);
    }

    /**
     * Clean a report data
     * @param action 
     */
    public async clean(action: CleanAction): Promise<void> {
        this.validate(action);
        return this.transact<CleanAction>(action);
    }

    private validate(o: any): void {
        Object.entries(o).forEach(field => {
            if (field[1] == null) {
                const msg = `${field[0]} is null`;
                console.error("Validation error: " + msg);
                throw msg;
            }
        });
    }
}