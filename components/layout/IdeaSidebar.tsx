
import React, { useState, useEffect, useCallback } from 'react';
import { generateFarmIdeas } from '../../services/geminiService';

const IdeaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z"></path><path d="M20 13v-3a8 8 0 1 0-16 0v3"></path><path d="M20 13h-2c0-2.21-1.79-4-4-4s-4 1.79-4 4H8"></path><path d="M12 13v8"></path></svg>
);
const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v6h6"></path><path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path><path d="M21 22v-6h-6"></path><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path></svg>
);

const IdeaSidebar: React.FC = () => {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside className={`transition-all duration-300 bg-brand-green-50/50 border-l border-brand-green-200/80 ${isCollapsed ? 'w-12' : 'w-72'}`}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <IdeaIcon/>
              <h3 className="text-lg font-bold text-brand-green-800">Farm Ideas</h3>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-full hover:bg-brand-green-200 text-brand-green-700"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? '>>' : '<<'}
          </button>
        </div>

        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-brand-green-200 rounded-md"></div>)}
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <ul className="space-y-3">
                {ideas.map((idea, index) => (
                  <li key={index} className="p-3 bg-white rounded-lg shadow-sm border border-brand-green-100 text-sm text-brand-green-900">
                    {idea}
                  </li>
                ))}
              </ul>
            )}
             <div className="mt-4 text-center">
                <button onClick={fetchIdeas} disabled={isLoading} className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-white bg-brand-amber-500 rounded-lg hover:bg-brand-amber-600 disabled:bg-brand-amber-400 transition-all duration-300 shadow-md hover:shadow-glow-amber">
                    <RefreshIcon/>
                    <span>{isLoading ? 'Generating...' : 'New Ideas'}</span>
                </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default IdeaSidebar;