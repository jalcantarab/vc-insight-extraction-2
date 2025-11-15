
import React from 'react';
import { InsightItem, Relation, OKR, ItemOkrMapping } from '../types';
import CanvasMap from './CanvasMap';
import OKRPicker from './OKRPicker';
import { ChevronLeftIcon } from './icons';

interface MapViewProps {
  items: InsightItem[];
  relations: Relation[];
  okrs: OKR[];
  itemOkrMapping: ItemOkrMapping;
  onUpdateItem: (item: InsightItem) => void;
  onMapItemToOkr: (itemId: string, okrId: string) => void;
  onPromoteIdea: (idea: InsightItem) => void;
  onBack: () => void;
  onShowList: () => void;
}

const MapView: React.FC<MapViewProps> = ({
  items,
  relations,
  okrs,
  itemOkrMapping,
  onUpdateItem,
  onMapItemToOkr,
  onPromoteIdea,
  onBack,
  onShowList,
}) => {
  return (
    <div className="animate-fade-in">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <button onClick={onBack} className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors">
                <ChevronLeftIcon /> Back to Editor
            </button>
            <div className="flex items-center gap-2">
                <button onClick={onShowList} className="px-4 py-2 text-sm font-semibold rounded-md text-slate-300 hover:bg-slate-700">List View</button>
                <button onClick={() => {}} className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-500 text-white">Map View</button>
            </div>
            <div className="w-full sm:w-auto">
                <OKRPicker okrs={okrs} itemOkrMapping={itemOkrMapping} onMapItemToOkr={onMapItemToOkr} items={items}/>
            </div>
        </div>
      
      <h2 className="text-3xl font-bold mb-4">Insights Map</h2>
      
      <div className="h-[70vh] w-full relative">
        <CanvasMap 
          items={items} 
          relations={relations} 
          onUpdateItem={onUpdateItem} 
          onPromoteIdea={onPromoteIdea}
          onMapItemToOkr={onMapItemToOkr}
        />
      </div>
    </div>
  );
};

export default MapView;
