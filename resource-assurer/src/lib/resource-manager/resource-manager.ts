import { Resource } from './resource';
import { ResourceStruct } from '../blockchain/assurer/resource.struct';
import { ReportStruct } from '../blockchain/assurer/report.struct';
import { ResourceStateType } from './resource-state.type';
import { Report } from './report';
import { ResourceStorageHelper } from './resource-storage-helper';
import { AssurerContract } from '../blockchain/assurer/assurer.contract';

export class ResourceManager {

    private readonly assurerContract = new AssurerContract();
    private readonly storage = new ResourceStorageHelper();

    /**
     * Refreshes resource by retrieving resource and its reports from blockchain.
     * Then store it in browser's extension storage.
     * 
     * @param hash 
     * @returns resource with reports
     */
    public async refreshResource(hash: string): Promise<Resource> {
        const resource = await this.storage.getByHash(hash);
        return this.retrieveAndStoreResource(resource.tabId, resource.resourceHash, resource.resourceUrl);
    }

    /**
     * Retrieve resource and its reports from blockchain.
     * Then store it in browser's extension storage.
     * 
     * @param tabId tab ID of browser, where resource is downloaded
     * @param hash resource sha-2 encoded hash-code
     * @param uri host service, where resource is downloaded from
     * @returns resource with reports
     */
    public async retrieveAndStoreResource(tabId: number, hash: string, uri: string): Promise<Resource> {
        const resource = await this.getResource(tabId, hash, uri);
        this.storage.store(resource);
        return resource;
    }

    /**
     * Retrieve resource and its reports from blockchain.
     * 
     * @param tabId tab ID, where resource is downloaded
     * @param hash resource sha-2 hash-code
     * @param uri host service, where resource is downloaded from
     * @returns resource with reports
     */
    public async getResource(tabId: number, hash: string, uri: string): Promise<Resource> {
        const resource = await this.getResourceStruct(hash);
        if(!resource) {
            return this.buildUnpublishedResource(tabId, hash, uri);
        }
        const reports = await this.getReportStructs(hash);
        return this.buildResource(tabId, resource, reports);
    }

    private async getResourceStruct(shaCode: string): Promise<ResourceStruct | undefined> {
        const response = await this.assurerContract.findResource(shaCode);
        return response.rows.length === 1 ? response.rows[0] : undefined;
    }

    private async getReportStructs(shaCode: string): Promise<ReportStruct[]> {
        const response = await this.assurerContract.findReports(shaCode);
        return response.rows;
    }

    private buildResource(tabId: number, resourceStruct: ResourceStruct, reportStructs: ReportStruct[]): Resource {
        const resourceState = reportStructs.length > 0 ? ResourceStateType.REPORTED : ResourceStateType.PUBLISHED;
        return {
            tabId: tabId,
            resourceHash: resourceStruct.hash,
            resourceUrl: resourceStruct.uri,
            resourceRepoUrl: resourceStruct.repo_uri,
            state: resourceState,
            owner: resourceStruct.user,
            reports: this.buildReports(reportStructs)
        };
    }

    private buildUnpublishedResource(tabId: number, hash: string, uri: string): Resource {
        return {
            tabId: tabId,
            resourceHash: hash,
            resourceUrl: uri,
            state: ResourceStateType.UNPUBLISHED,
            resourceRepoUrl: undefined,
            owner: undefined,
            reports: []
        };
    }

    private buildReports(structs: ReportStruct[]): Report[] {
        return structs.map(struct => ({
            owner: struct.user,
            reportUri: struct.report_uri,
            title: struct.title,
            description: struct.description,
            verdict: struct.verdict
        }));
    }
}