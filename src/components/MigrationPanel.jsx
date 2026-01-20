import { useState, useContext } from 'react';
import { migrateLocalStorageToRedis } from '../utils/migrate';
import { AppContext } from '../context/AppContext';

const MigrationPanel = ({ onMigrationComplete }) => {
  const [migrating, setMigrating] = useState(false);
  const [result, setResult] = useState(null);
  const { isUsingRedis, dataSource } = useContext(AppContext);

  // Don't show panel if not using Redis (development mode)
  if (!isUsingRedis) {
    return (
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white mb-1">
              Local Storage Mode
            </h3>
            <p className="text-sm text-gray-500">
              Data is being stored locally. In production with Redis configured, data will sync across devices.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleMigrate = async () => {
    setMigrating(true);
    setResult(null);

    try {
      const migrationResult = await migrateLocalStorageToRedis();
      setResult(migrationResult);

      if (migrationResult.success && onMigrationComplete) {
        setTimeout(() => {
          onMigrationComplete();
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
      });
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 mb-8">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-white">
              Cloud Database Connected
            </h3>
            <span className="px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
              Redis Active
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Migrate your local data to sync across all devices
          </p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2 mb-3">
          <svg className="w-5 h-5 text-[#3b82f6] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-gray-400">
            <p className="mb-2">This will:</p>
            <ul className="space-y-1 list-disc list-inside text-gray-500">
              <li>Upload your localStorage data to Redis</li>
              <li>Enable sync across all your devices</li>
              <li>Keep your localStorage as backup</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={handleMigrate}
        disabled={migrating}
        className="w-full px-4 py-2.5 text-sm font-medium text-white bg-[#3b82f6] rounded-lg hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {migrating ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Migrating data...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Migrate to Cloud
          </>
        )}
      </button>

      {result && (
        <div className={`mt-4 p-3 rounded-lg ${
          result.success
            ? 'bg-green-500/10 border border-green-500/20'
            : 'bg-red-500/10 border border-red-500/20'
        }`}>
          <div className="flex items-start gap-2">
            {result.success ? (
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${result.success ? 'text-green-500' : 'text-red-500'}`}>
                {result.success ? 'Migration Successful!' : 'Migration Failed'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {result.message || result.error}
              </p>
              {result.success && (result.employees > 0 || result.skills > 0 || result.education > 0) && (
                <p className="text-xs text-gray-500 mt-2">
                  Page will reload in 2 seconds...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MigrationPanel;
