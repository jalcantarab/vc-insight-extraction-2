
import { OKR, InsightItem, Relation, ItemType } from './types';

export const ITEM_TYPE_STYLES: { [key in ItemType]: { color: string; border: string; name: string } } = {
  [ItemType.Signal]: { color: 'bg-signal/20', border: 'border-signal', name: 'Signal' },
  [ItemType.Insight]: { color: 'bg-insight/20', border: 'border-insight', name: 'Insight' },
  [ItemType.Opportunity]: { color: 'bg-opportunity/20', border: 'border-opportunity', name: 'Opportunity' },
  [ItemType.Idea]: { color: 'bg-idea/20', border: 'border-idea', name: 'Idea' },
};

export const MOCK_OKRS: OKR[] = [
  {
    id: 'okr-1',
    objective: 'Improve user engagement by 15% in Q3',
    keyResults: ['Increase DAU/MAU ratio to 50%', 'Increase average session duration by 2 minutes'],
  },
  {
    id: 'okr-2',
    objective: 'Expand market share in EMEA region',
    keyResults: ['Launch in 2 new countries', 'Achieve 10% user growth in EMEA'],
  },
    {
    id: 'okr-3',
    objective: 'Reduce customer churn by 5%',
    keyResults: ['Improve customer support satisfaction score to 95%', 'Implement proactive retention campaigns'],
  },
];


export const MOCK_ITEMS: InsightItem[] = [
  { id: 'signal-1', type: ItemType.Signal, title: 'Users struggle with filters', description: 'Multiple users mentioned difficulty finding the right filter options during the search process.', confidence: 0.9, sourceSnippet: '"I could never find the color filter, it was buried under advanced settings."', tags: ['ux', 'search'], accepted: null },
  { id: 'insight-1', type: ItemType.Insight, title: 'Filter discoverability is low', description: 'The current filter UI hides important options, leading to user frustration and incomplete searches.', confidence: 0.85, sourceSnippet: 'User feedback consistently points to discoverability issues.', tags: ['usability', 'friction'], accepted: null },
  { id: 'opportunity-1', type: ItemType.Opportunity, title: 'Simplify the search interface', description: 'Redesigning the search filter panel could significantly improve user success rates and satisfaction.', confidence: 0.92, sourceSnippet: 'From insight about filter discoverability', tags: ['design', 'search-ux'], accepted: null },
  { id: 'idea-1', type: ItemType.Idea, title: 'Prominent filter sidebar', description: 'Create a persistent, always-visible filter sidebar on the search results page.', confidence: 0.88, sourceSnippet: 'Derived from opportunity to simplify search', tags: ['feature', 'quick-win'], accepted: null },
  { id: 'idea-2', type: ItemType.Idea, title: 'AI-powered "smart filters"', description: 'Suggest relevant filters to users based on their search query using natural language processing.', confidence: 0.78, sourceSnippet: 'Alternative idea for improving search', tags: ['ai', 'long-term'], accepted: null }
];

export const MOCK_RELATIONS: Relation[] = [
  { sourceId: 'signal-1', targetId: 'insight-1' },
  { sourceId: 'insight-1', targetId: 'opportunity-1' },
  { sourceId: 'opportunity-1', targetId: 'idea-1' },
  { sourceId: 'opportunity-1', targetId: 'idea-2' }
];

