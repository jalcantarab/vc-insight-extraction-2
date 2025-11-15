
import React, { useState } from 'react';
import { OKR, ItemOkrMapping, InsightItem } from '../types';
import { PlusIcon } from './icons';

interface OKRPickerProps {
  okrs: OKR[];
  itemOkrMapping: ItemOkrMapping;
  onMapItemToOkr: (itemId: string, okrId: string) => void;
  items: InsightItem[];
}

const OKRPicker: React.FC<OKRPickerProps> = ({ okrs, itemOkrMapping, onMapItemToOkr, items }) => {
  const [isDraggingOver, setIsDraggingOver] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, okrId: string) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData("application/insight-item");
    if (itemData) {
      const item: InsightItem = JSON.parse(itemData);
      onMapItemToOkr(item.id, okrId);
    }
    setIsDraggingOver(null);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const getMappedItems = (okrId: string) => {
    return items.filter(item => itemOkrMapping[item.id] === okrId);
  }

  return (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
      <h3 className="text-lg font-bold mb-3 text-slate-200">OKRs</h3>
      <div className="space-y-3">
        {okrs.map(okr => (
          <div
            key={okr.id}
            onDrop={(e) => handleDrop(e, okr.id)}
            onDragOver={handleDragOver}
            onDragEnter={() => setIsDraggingOver(okr.id)}
            onDragLeave={() => setIsDraggingOver(null)}
            className={`p-3 rounded-lg border-2 border-dashed transition-colors ${isDraggingOver === okr.id ? 'bg-indigo-500/30 border-indigo-400' : 'bg-slate-900/50 border-slate-700'}`}
          >
            <p className="font-semibold text-slate-100">{okr.objective}</p>
            <div className="mt-2">
                {getMappedItems(okr.id).map(item => (
                    <div key={item.id} className="text-xs px-2 py-1 bg-slate-700 rounded-full inline-block mr-1 mb-1">{item.title}</div>
                ))}
                {getMappedItems(okr.id).length === 0 && (
                     <div className="text-xs text-slate-500 flex items-center gap-1">
                        <PlusIcon /> Drag an Insight or Idea here to map it.
                     </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OKRPicker;
