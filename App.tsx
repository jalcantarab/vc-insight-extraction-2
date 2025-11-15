
import React, { useState, useCallback } from 'react';
import { InsightItem, Relation, View, OKR, ItemOkrMapping, ItemType } from './types';
import { processTranscript } from './services/geminiService';
import TranscriptEditor from './components/TranscriptEditor';
import ListView from './components/ListView';
import MapView from './components/MapView';
import IdeaDetailView from './components/IdeaDetailView';
import { MOCK_OKRS, MOCK_ITEMS, MOCK_RELATIONS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<View>('editor');
  const [items, setItems] = useState<InsightItem[]>([]);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [okrs] = useState<OKR[]>(MOCK_OKRS);
  const [itemOkrMapping, setItemOkrMapping] = useState<ItemOkrMapping>({});
  const [selectedIdea, setSelectedIdea] = useState<InsightItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessTranscript = useCallback(async (transcript: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const useMockData = false; 
      if (useMockData) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          setItems(MOCK_ITEMS);
          setRelations(MOCK_RELATIONS);
      } else {
          const result = await processTranscript(transcript);
          if (result) {
            setItems(result.items);
            setRelations(result.relations);
          } else {
            throw new Error("Failed to process transcript or received empty result.");
          }
      }
      setView('insightsList');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateItem = useCallback((updatedItem: InsightItem) => {
    setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  }, []);

  const handleMapItemToOkr = useCallback((itemId: string, okrId: string) => {
    setItemOkrMapping(prevMapping => ({
      ...prevMapping,
      [itemId]: okrId
    }));
  }, []);

  const handlePromoteIdea = useCallback((idea: InsightItem) => {
    if(idea.type === ItemType.Idea) {
        setSelectedIdea(idea);
        setView('ideaDetail');
    }
  }, []);
  
  const handleBackToEditor = useCallback(() => {
    setView('editor');
    setItems([]);
    setRelations([]);
    setError(null);
  }, []);

  const handleShowList = useCallback(() => setView('insightsList'), []);
  const handleShowMap = useCallback(() => setView('insightsMap'), []);

  const handleBackToPreviousView = useCallback(() => {
    // A simple logic to go back to the list view from idea detail
    setView('insightsList');
    setSelectedIdea(null);
  }, []);


  const renderView = () => {
    switch (view) {
      case 'editor':
        return <TranscriptEditor onProcess={handleProcessTranscript} isLoading={isLoading} error={error} />;
      
      case 'insightsList':
        return (
          <ListView
            items={items}
            okrs={okrs}
            itemOkrMapping={itemOkrMapping}
            onUpdateItem={handleUpdateItem}
            onMapItemToOkr={handleMapItemToOkr}
            onPromoteIdea={handlePromoteIdea}
            onBack={handleBackToEditor}
            onShowMap={handleShowMap}
          />
        );

      case 'insightsMap':
        return (
            <MapView
                items={items}
                relations={relations}
                okrs={okrs}
                itemOkrMapping={itemOkrMapping}
                onUpdateItem={handleUpdateItem}
                onMapItemToOkr={handleMapItemToOkr}
                onPromoteIdea={handlePromoteIdea}
                onBack={handleBackToEditor}
                onShowList={handleShowList}
            />
        );

      case 'ideaDetail':
        return selectedIdea ? (
            <IdeaDetailView idea={selectedIdea} onBack={handleBackToPreviousView} onUpdate={handleUpdateItem} />
        ) : null;
      
      default:
        return <TranscriptEditor onProcess={handleProcessTranscript} isLoading={isLoading} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <header className="p-4 border-b border-slate-700/50 flex items-center justify-between sticky top-0 bg-slate-900/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-teal-400 rounded-lg"></div>
            <h1 className="text-xl font-bold text-slate-100">Transcript-Driven Insights Map</h1>
        </div>
      </header>
      <main className="p-4 sm:p-6 md:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
