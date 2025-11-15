
import React from 'react';
import { InsightItem, OKR, ItemOkrMapping, ItemType } from '../types';
import ItemCard from './ItemCard';
import OKRPicker from './OKRPicker';
import { ChevronLeftIcon } from './icons';
import { ITEM_TYPE_STYLES } from '../constants';

interface ListViewProps {
  items: InsightItem[];
  okrs: OKR[];
  itemOkrMapping: ItemOkrMapping;
  onUpdateItem: (item: InsightItem) => void;
  onMapItemToOkr: (itemId: string, okrId: string) => void;
  onPromoteIdea: (idea: InsightItem) => void;
  onBack: () => void;
  onShowMap: () => void;
}

const ListView: React.FC<ListViewProps> = ({
  items,
  okrs,
  itemOkrMapping,
  onUpdateItem,
  onMapItemToOkr,
  onPromoteIdea,
  onBack,
  onShowMap,
}) => {

  const groupedItems = Object.values(ItemType).map(type => ({
    type,
    items: items.filter(item => item.type === type),
  }));

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <button onClick={onBack} className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors">
              <ChevronLeftIcon /> Back to Editor
          </button>
          <div className="flex items-center gap-2">
              <button onClick={() => {}} className="px-4 py-2 text-sm font-semibold rounded-md bg-indigo-500 text-white">List View</button>
              <button onClick={onShowMap} className="px-4 py-2 text-sm font-semibold rounded-md text-slate-300 hover:bg-slate-700">Map View</button>
          </div>
          <div className="w-full sm:w-auto">
              <OKRPicker okrs={okrs} itemOkrMapping={itemOkrMapping} onMapItemToOkr={onMapItemToOkr} items={items}/>
          </div>
      </div>
      
      <h2 className="text-3xl font-bold mb-6">Extracted Items</h2>

      <div className="space-y-8">
        {groupedItems.map(({ type, items: groupItems }) => {
          if (groupItems.length === 0) return null;
          const styles = ITEM_TYPE_STYLES[type];
          return (
            <div key={type}>
              <h3 className={`text-xl font-bold mb-4 text-${styles.name.toLowerCase()}-300 border-b-2 border-${styles.name.toLowerCase()}-500/50 pb-2`}>{styles.name}s</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {groupItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onUpdate={onUpdateItem}
                    onPromote={onPromoteIdea}
                    onStartDrag={(e, draggedItem) => {
                      e.dataTransfer.setData("application/insight-item", JSON.stringify(draggedItem));
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListView;
