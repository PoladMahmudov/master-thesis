import { BaseContract } from '../base.contract';
import { TableResponse } from '../table.response';
import { AssurerRequest } from './assurer.request';
import { ResourceStruct, ReportStruct, VoteStruct } from './structs';
import { PublishAction, PostAction, VoteAction, UnvoteAction, ExpireAction, CleanAction } from './actions';
import { getRpc } from '../configuration/configuration-storage';

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
        const rpc = await getRpc();
        return await rpc.get_table_rows(
            new AssurerRequest(resourceHash, ResourceStruct.TABLE_NAME, 'sha256'));
    }

    /**
     * Find reports for given resource
     * @param resourceHash is a sha256 string parameter
     * @returns rows array with either empty or reports value
     */
    public async findReports(resourceHash: string): Promise<TableResponse<ReportStruct>> {
        const rpc = await getRpc();
        return await rpc.get_table_rows(
            new AssurerRequest(resourceHash, ReportStruct.TABLE_NAME, 'sha256'));
    }

    /**
     * Find votes for given report
     * @param reportId 
     * @returns rows array with either empty or vote values
     */
    public async findVotes(reportId: number): Promise<TableResponse<VoteStruct>> {
        const rpc = await getRpc();
        return await rpc.get_table_rows(
            new AssurerRequest('' + reportId, VoteStruct.TABLE_NAME));
    }

    /**
     * Publish a resource
     * @param action
     */
    public async publish(action: PublishAction): Promise<void> {
        this.validate(action);
        return this.transact<PublishAction>(action, PublishAction.NAME);
    }

    /**
     * Post a report
     * @param action
     */
    public async post(action: PostAction): Promise<void> {
        this.validate(action);
        return this.transact<PostAction>(action, PostAction.NAME);
    }

    /**
     * Vote for a report
     * @param action
     */
    public async vote(action: VoteAction): Promise<void> {
        this.validate(action);
        return this.transact<VoteAction>(action, VoteAction.NAME);
    }

    /**
     * Unvote for a report by action
     * @param action 
     */
    public async unvote(action: UnvoteAction): Promise<void> {
        this.validate(action);
        return this.transact<UnvoteAction>(action, UnvoteAction.NAME);
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
        return this.transact<ExpireAction>(action, ExpireAction.NAME);
    }

    /**
     * Clean a report data
     * @param action 
     */
    public async clean(action: CleanAction): Promise<void> {
        this.validate(action);
        return this.transact<CleanAction>(action, CleanAction.NAME);
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