// Simplified App to debug step by step
import React, { useState, useEffect } from 'react';
import { useAPI } from './hooks/useAPI';

function AppSimple() {
  const [debugInfo, setDebugInfo] = useState<string[]>(['🚀 App started']);

  // Call useAPI at top level (required by React hooks rules)
  let apiStatus = '⏳ Not initialized';
  let apiError = null;
  let apiTasks: any[] = [];
  let apiLoading = true;
  let hookError = null;

  try {
    const api = useAPI();
    apiStatus = '✅ useAPI hook called';
    apiError = api.error;
    apiTasks = api.tasks;
    apiLoading = api.loading;
  } catch (error: any) {
    apiStatus = `❌ useAPI failed: ${error.message}`;
    hookError = error.message;
  }

  // Log API status changes
  useEffect(() => {
    console.log('📦 useEffect running');
    console.log(`📊 API Status: loading=${apiLoading}, tasks=${apiTasks.length}, error=${apiError}`);

    setDebugInfo(prev => [
      ...prev,
      '📦 useEffect running',
      `📊 API Status: loading=${apiLoading}, tasks=${apiTasks.length}, error=${apiError || 'None'}`,
      hookError ? `❌ Hook Error: ${hookError}` : '✅ No hook errors'
    ]);
  }, [apiLoading, apiTasks.length, apiError, hookError]);

  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      background: 'linear-gradient(135deg, #F5F5F7 0%, #FFFFFF 50%, #F5F5F7 100%)',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1D1D1F', marginBottom: '20px' }}>
        🔍 Debug App - Step by Step
      </h1>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(40px)',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        marginBottom: '20px'
      }}>
        <h2>✅ React is working</h2>
        <h2>✅ Liquid Glass CSS is working</h2>
        <h2>✅ Gradient background is working</h2>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(40px)',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        marginBottom: '20px'
      }}>
        <h2>🔌 API Status</h2>
        <p><strong>Status:</strong> {apiStatus}</p>
        <p><strong>Loading:</strong> {apiLoading ? 'Yes' : 'No'}</p>
        <p><strong>Tasks:</strong> {apiTasks.length}</p>
        <p><strong>Error:</strong> {apiError || 'None'}</p>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(40px)',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h2>📝 Debug Log</h2>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {debugInfo.map((log, i) => (
            <div key={i} style={{ 
              padding: '5px 0', 
              borderBottom: '1px solid #e0e0e0',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AppSimple;

