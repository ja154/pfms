
import React, { useState, useEffect, useCallback } from 'react';
import { generateFarmIdeas } from '../../services/geminiService';

const IdeaSidebar: React.FC = () => {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newIdeas = await generateFarmIdeas();
      setIdeas(newIdeas);
    } catch (err) {
      setError('Failed to fetch ideas.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  return (
    <aside className="w-[220px] bg-white p-4 border-l border-slate-200">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 pt-4 pl-2">
          <h3 className="text-lg font-bold text-slate-900">Farm Ideas</h3>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse"></div>)}
            </div>
          ) : error ? (
            <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>
          ) : (
            <ul className="space-y-3">
              {ideas.map((idea, index) => (
                <li key={index} className="p-3 bg-slate-100 rounded-lg text-sm text-slate-700 border border-slate-200">
                  {idea}
                </li>
              ))}
            </ul>
          )}
        </div>
         <div className="mt-4 pt-4 border-t border-slate-200">
              <button onClick={fetchIdeas} disabled={isLoading} className="w-full px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors">
                  <span>{isLoading ? 'Generating...' : 'New Ideas'}</span>
              </button>
          </div>
      </div>
    </aside>
  );
};

export default IdeaSidebar;