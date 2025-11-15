
import React, { useState } from 'react';
import { InsightItem } from '../types';
import { ChevronLeftIcon } from './icons';

interface IdeaDetailViewProps {
  idea: InsightItem;
  onBack: () => void;
  onUpdate: (updatedIdea: InsightItem) => void;
}

const IdeaDetailView: React.FC<IdeaDetailViewProps> = ({ idea, onBack, onUpdate }) => {
  const [title, setTitle] = useState(idea.title);
  const [description, setDescription] = useState(idea.description);
  const [tags, setTags] = useState(idea.tags.join(', '));
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onUpdate({
      ...idea,
      title,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors mb-6">
            <ChevronLeftIcon /> Back to Map
        </button>

        <div className="bg-slate-800/50 rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-slate-100 mb-6">Idea Card</h2>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="idea-title" className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                    <input
                        id="idea-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 bg-slate-900/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-slate-100"
                    />
                </div>

                <div>
                    <label htmlFor="idea-desc" className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                    <textarea
                        id="idea-desc"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 bg-slate-900/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-slate-100 resize-y"
                    />
                </div>
                 <div>
                    <label htmlFor="idea-tags" className="block text-sm font-medium text-slate-400 mb-1">Tags (comma-separated)</label>
                    <input
                        id="idea-tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full p-3 bg-slate-900/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-slate-100"
                    />
                </div>
            </div>

            <div className="mt-8 flex justify-end items-center gap-4">
                {isSaved && <p className="text-green-400 animate-fade-in">Saved!</p>}
                <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </div>
    </div>
  );
};

export default IdeaDetailView;
