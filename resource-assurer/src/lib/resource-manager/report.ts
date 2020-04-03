import { Vote } from './vote';

export class Report {
    id: number;
    reportUri: string;
    description: string;
    title: string;
    verdict: boolean;
    owner?: string;
    votes: Vote[] = [];
}