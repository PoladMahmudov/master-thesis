import { IntegrityContract } from 'src/lib/blockchain/integrity/integrity.contract';
import { ResourceStruct } from 'src/lib/blockchain/integrity/resource.struct';
import { Resource } from 'src/lib/storage/resource';
import { ReportStruct } from 'src/lib/blockchain/reliability/report.struct';
import { ReliabilityContract } from 'src/lib/blockchain/reliability/reliability.contract';
import { ResourceStateType } from 'src/lib/storage/resource-state.type';
import { Report } from 'src/lib/storage/report';

export class BackgroundHelper {

    private readonly integrityContract: IntegrityContract;
    private readonly reliabilityContract: ReliabilityContract;

    constructor() {
        this.integrityContract = new IntegrityContract();
        this.reliabilityContract = new ReliabilityContract();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    public async encodeSha256(data: ArrayBuffer[]): Promise<string> {
        // aggregate
        let buffer = await new Blob(data)['arrayBuffer']();
        // encrypt
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        // convert buffer to byte array
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        // convert bytes to hex string              
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        return hashHex;
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
        const response = await this.integrityContract.find(shaCode);
        return response.rows.length === 1 ? response.rows[0] : undefined;
    }

    private async getReportStructs(shaCode: string): Promise<ReportStruct[]> {
        const response = await this.reliabilityContract.find(shaCode);
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
            description: struct.description,
            verdict: struct.verdict
        }));
    }
}