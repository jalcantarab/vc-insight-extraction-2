
import React, { useState } from 'react';
import { SparklesIcon } from './icons';

interface TranscriptEditorProps {
  onProcess: (transcript: string) => void;
  isLoading: boolean;
  error: string | null;
}

const TranscriptEditor: React.FC<TranscriptEditorProps> = ({ onProcess, isLoading, error }) => {
  const [transcript, setTranscript] = useState('');

  const handleProcessClick = () => {
    if (transcript.trim()) {
      onProcess(transcript);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center animate-fade-in">
      <div className="w-full bg-slate-800/50 rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-100 mb-2">Start with a Transcript</h2>
        <p className="text-center text-slate-400 mb-6">Paste a user interview, meeting notes, or any conversation below.</p>
        
        {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-center">
                <strong>Error:</strong> {error}
            </div>
        )}

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your transcript here..."
          className="w-full h-64 p-4 bg-slate-900/70 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-slate-300 placeholder-slate-500 resize-y"
          disabled={isLoading}
        />
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleProcessClick}
            disabled={isLoading || !transcript.trim()}
            className="group relative inline-flex items-center justify-center px-8 py-3 h-12 overflow-hidden rounded-full font-bold text-slate-100 shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
             <>
                <SparklesIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-125" />
                Process Transcript
            </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranscriptEditor;
