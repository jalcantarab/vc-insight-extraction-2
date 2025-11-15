
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InsightItem, Relation, ItemType } from '../types';
import ItemCard from './ItemCard';
import { ITEM_TYPE_STYLES } from '../constants';

interface CanvasMapProps {
  items: InsightItem[];
  relations: Relation[];
  onUpdateItem: (item: InsightItem) => void;
  onPromoteIdea: (idea: InsightItem) => void;
  onMapItemToOkr: (itemId: string, okrId: string) => void;
}

interface Position {
  x: number;
  y: number;
}

const CanvasMap: React.FC<CanvasMapProps> = ({ items, relations, onUpdateItem, onPromoteIdea }) => {
  const [positions, setPositions] = useState<{ [key: string]: Position }>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple auto-layout logic
    const newPositions: { [key: string]: Position } = {};
    const columns: { [key in ItemType]: InsightItem[] } = {
      [ItemType.Signal]: [],
      [ItemType.Insight]: [],
      [ItemType.Opportunity]: [],
      [ItemType.Idea]: [],
    };

    items.forEach(item => columns[item.type].push(item));
    
    const columnOrder = [ItemType.Signal, ItemType.Insight, ItemType.Opportunity, ItemType.Idea];
    const columnWidth = 320;
    const itemHeight = 220;

    columnOrder.forEach((type, colIndex) => {
      columns[type].forEach((item, rowIndex) => {
        newPositions[item.id] = {
          x: colIndex * columnWidth + 50,
          y: rowIndex * itemHeight + 50,
        };
      });
    });

    setPositions(newPositions);
  }, [items]);
  
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, itemId: string) => {
      if (!mapRef.current) return;
      const nodePos = positions[itemId];
      const mapBounds = mapRef.current.getBoundingClientRect();
      setDragging(itemId);
      setOffset({
        x: e.clientX - mapBounds.left - nodePos.x,
        y: e.clientY - mapBounds.top - nodePos.y,
      });
  }, [positions]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging && mapRef.current) {
        const mapBounds = mapRef.current.getBoundingClientRect();
        setPositions(prev => ({
            ...prev,
            [dragging]: {
            x: e.clientX - mapBounds.left - offset.x,
            y: e.clientY - mapBounds.top - offset.y,
            }
        }));
    }
  }, [dragging, offset]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const getNodeCenter = (itemId: string): Position => {
    const pos = positions[itemId] || { x: 0, y: 0 };
    // Approx node dimensions: width 288px (w-72), height ~200px
    return { x: pos.x + 144, y: pos.y + 100 };
  };

  return (
    <div
      ref={mapRef}
      className="w-full h-full bg-slate-800/50 rounded-2xl border border-slate-700 relative overflow-auto cursor-grab"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ minWidth: '1500px', minHeight: '1000px'}}>
        {relations.map((rel, index) => {
          const sourceCenter = getNodeCenter(rel.sourceId);
          const targetCenter = getNodeCenter(rel.targetId);
          const sourceItem = items.find(i => i.id === rel.sourceId);
          if (!sourceItem) return null;
          
          const strokeColor = ITEM_TYPE_STYLES[sourceItem.type].border;

          return (
            <line
              key={`${rel.sourceId}-${rel.targetId}-${index}`}
              x1={sourceCenter.x}
              y1={sourceCenter.y}
              x2={targetCenter.x}
              y2={targetCenter.y}
              className={`stroke-2 transition-all duration-300 ${strokeColor.replace('border-', 'stroke-')}/50`}
            />
          );
        })}
      </svg>

      {items.map(item => (
        <div
          key={item.id}
          className="absolute w-72 cursor-pointer"
          style={{
            left: `${positions[item.id]?.x || 0}px`,
            top: `${positions[item.id]?.y || 0}px`,
            transition: dragging === item.id ? 'none' : 'top 0.3s ease, left 0.3s ease',
          }}
          onMouseDown={(e) => handleMouseDown(e, item.id)}
        >
          <ItemCard
            item={item}
            onUpdate={onUpdateItem}
            onPromote={onPromoteIdea}
            isDraggable={false} // drag is handled by wrapper
          />
        </div>
      ))}
    </div>
  );
};

export default CanvasMap;
