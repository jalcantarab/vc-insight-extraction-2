
export enum ItemType {
    Signal = 'Signal',
    Insight = 'Insight',
    Opportunity = 'Opportunity',
    Idea = 'Idea'
}

export interface SourceSnippet {
    text: string;
    timestamp?: string;
}

export interface InsightItem {
    id: string;
    type: ItemType;
    title: string;
    description: string;
    confidence: number;
    sourceSnippet: string;
    tags: string[];
    accepted: boolean | null;
}

export interface Relation {
    sourceId: string;
    targetId: string;
}

export interface OKR {
    id: string;
    objective: string;
    keyResults: string[];
}

export interface ItemOkrMapping {
    [itemId: string]: string; // itemId -> okrId
}

export type View = 'editor' | 'insightsList' | 'insightsMap' | 'ideaDetail';
