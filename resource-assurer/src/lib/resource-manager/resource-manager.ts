import { AssurerContract } from '../blockchain/assurer/assurer.contract';
import { ResourceStruct, ReportStruct, VoteStruct } from '../blockchain/assurer/structs';
import { getResourceByHash, storeResource, Resource, Report, ResourceStateType, Vote } from './resource-storage';


const assurerContract = new AssurerContract();

/**
 * Refreshes resource by retrieving resource and its reports from blockchain.
 * Then store it in browser's extension storage.
 * 
 * @param hash 
 * @returns resource with reports
 */
export async function refreshResource(hash: string): Promise<Resource> {
    const resource = await getResourceByHash(hash);
    return fetchAndStoreResource(resource.tabId, resource.resourceHash, resource.resourceUrl);
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
export async function fetchAndStoreResource(tabId: number, hash: string, uri: string): Promise<Resource> {
    const resource = await fetchResource(tabId, hash, uri);
    storeResource(resource);
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
export async function fetchResource(tabId: number, hash: string, uri: string): Promise<Resource> {
    const resource = await fetchResourceStruct(hash);
    if (!resource) {
        return buildUnpublishedResource(tabId, hash, uri);
    }
    const reports = await fetchReportStructs(hash);
    return buildResource(tabId, resource, reports);
}

/**
 * Adds all votes to given reports.
 * 
 * @param reports 
 */
export async function fetchAndAddVotes(reports: Report[]): Promise<Report[]> {
    for (const report of reports) {
        const votes = buildVotes(await fetchVoteStructs(report.id));
        report.votes = votes;
    }
    return reports;
}

async function fetchResourceStruct(shaCode: string): Promise<ResourceStruct> {
    const response = await assurerContract.findResource(shaCode);
    return response.rows.length === 1 ? response.rows[0] : undefined;
}

async function fetchReportStructs(shaCode: string): Promise<ReadonlyArray<ReportStruct>> {
    const response = await assurerContract.findReports(shaCode);
    return response.rows;
}

async function fetchVoteStructs(reportId: number): Promise<ReadonlyArray<VoteStruct>> {
    const response = await assurerContract.findVotes(reportId);
    return response.rows;
}

function buildResource(tabId: number, resourceStruct: ResourceStruct, reportStructs: ReadonlyArray<ReportStruct>): Resource {
    const resourceState = reportStructs.length > 0 ? ResourceStateType.REPORTED : ResourceStateType.PUBLISHED;
    return {
        tabId: tabId,
        resourceHash: resourceStruct.hash,
        resourceUrl: resourceStruct.uri,
        resourceRepoUrl: resourceStruct.repo_uri,
        state: resourceState,
        owner: resourceStruct.user,
        reports: buildReports(reportStructs)
    };
}

function buildVotes(structs: ReadonlyArray<VoteStruct>): Vote[] {
    return structs.map(s => ({
        voter: s.voter,
        vote: s.vote === 1
    }));
}

function buildUnpublishedResource(tabId: number, hash: string, uri: string): Resource {
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

function buildReports(structs: ReadonlyArray<ReportStruct>): Report[] {
    return structs.map(struct => ({
        id: struct.id,
        owner: struct.user,
        reportUri: struct.report_uri,
        title: struct.title,
        description: struct.description,
        verdict: struct.verdict === 1,
        votes: [],
        createdOn: new Date(struct.created_on * 1000),
        expiresOn: new Date(struct.expires_on * 1000),
        positivesRatio: struct.ratio
    }));
}