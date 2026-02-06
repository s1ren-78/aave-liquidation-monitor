'use client';

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function Header({ lastUpdated, onRefresh, isRefreshing }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[var(--notion-border)]">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[var(--notion-text)]">Aave Monitor</h1>
          <p className="text-sm text-[var(--notion-muted)] mt-1">
            Real-time lending position overview on Ethereum
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-[var(--notion-muted)]">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 border border-[var(--notion-border)] bg-white text-[var(--notion-text)] rounded-md hover:bg-[#f3f2ef] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            <svg
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
}
