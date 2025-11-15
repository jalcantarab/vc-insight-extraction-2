
import React, { useState, useRef, useEffect } from 'react';
import { InsightItem, ItemType } from '../types';
import { ITEM_TYPE_STYLES } from '../constants';
import { CheckIcon, XIcon, ArrowUpRightIcon, ClipboardIcon } from './icons';

interface ItemCardProps {
  item: InsightItem;
  onUpdate: (item: InsightItem) => void;
  onPromote?: (item: InsightItem) => void;
  isDraggable?: boolean;
  onStartDrag?: (e: React.DragEvent<HTMLDivElement>, item: InsightItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onUpdate, onPromote, isDraggable = true, onStartDrag }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [editedDesc, setEditedDesc] = useState(item.description);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      titleInputRef.current?.focus();
    }
  }, [isEditing]);
  
  const handleAccept = () => onUpdate({ ...item, accepted: true });
  const handleReject = () => onUpdate({ ...item, accepted: false });

  const handleEditToggle = () => {
    if (isEditing) {
      onUpdate({ ...item, title: editedTitle, description: editedDesc });
    }
    setIsEditing(!isEditing);
  };
  
  const handleCopyToClipboard = () => {
    const textToCopy = `Type: ${item.type}\nTitle: ${item.title}\nDescription: ${item.description}\nSource: "${item.sourceSnippet}"`;
    navigator.clipboard.writeText(textToCopy);
  };
  
  const cardStyles = ITEM_TYPE_STYLES[item.type];
  const acceptanceClass = item.accepted === true ? 'border-green-500/80' : item.accepted === false ? 'border-red-500/80 opacity-60' : `${cardStyles.border}/60`;

  const animationClass = item.accepted !== null ? 'transition-all duration-300 transform scale-105' : '';

  return (
    <div
      draggable={isDraggable && !isEditing}
      onDragStart={(e) => onStartDrag?.(e, item)}
      className={`group/card relative rounded-xl border p-4 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-slate-400/50 ${cardStyles.color} ${acceptanceClass} ${animationClass} animate-pop-in flex flex-col`}
    >
       <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
           <button onClick={handleCopyToClipboard} className="p-1 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300">
               <ClipboardIcon />
           </button>
       </div>

      <div className="flex-grow" onDoubleClick={handleEditToggle}>
        <div className="flex justify-between items-start mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${cardStyles.color} border ${cardStyles.border}`}>{cardStyles.name}</span>
        </div>
        
        {isEditing ? (
          <input
            ref={titleInputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleEditToggle}
            onKeyDown={(e) => e.key === 'Enter' && handleEditToggle()}
            className="w-full bg-transparent text-lg font-bold text-slate-100 outline-none border-b border-indigo-500"
          />
        ) : (
          <h4 className="text-lg font-bold text-slate-100">{item.title}</h4>
        )}
        
        {isEditing ? (
          <textarea
            value={editedDesc}
            onChange={(e) => setEditedDesc(e.target.value)}
            className="w-full bg-transparent text-slate-300 mt-1 outline-none border-b border-indigo-500 resize-none h-20"
          />
        ) : (
          <p className="text-slate-300 mt-1 text-sm">{item.description}</p>
        )}
        
        <div className="mt-3 group/source relative">
          <p className="text-xs text-slate-400 italic">Source: "{item.sourceSnippet}"</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/50">
          <div className="flex items-center">
             <div className="text-xs text-slate-400 mr-2">Confidence:</div>
             <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full ${cardStyles.border.replace('border-', 'bg-')} rounded-full`} style={{ width: `${item.confidence * 100}%` }}></div>
             </div>
          </div>

        <div className="flex items-center gap-2">
          {item.accepted === null && (
            <>
              <button onClick={handleReject} className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"><XIcon /></button>
              <button onClick={handleAccept} className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/40 text-green-300 transition-colors"><CheckIcon /></button>
            </>
          )}
          {item.type === ItemType.Idea && item.accepted && onPromote && (
            <button onClick={() => onPromote(item)} className="text-sm flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/30 hover:bg-indigo-500/50 text-indigo-200 border border-indigo-500/50 transition-colors">
              Promote <ArrowUpRightIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
