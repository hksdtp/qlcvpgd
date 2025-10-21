// Simple Test App to debug white screen
import React from 'react';

function AppTest() {
  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      background: 'linear-gradient(135deg, #F5F5F7 0%, #FFFFFF 50%, #F5F5F7 100%)',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#1D1D1F', marginBottom: '20px' }}>
        🎉 App Test - Working!
      </h1>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(40px)',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h2>✅ React is working</h2>
        <h2>✅ Liquid Glass CSS is working</h2>
        <h2>✅ Gradient background is working</h2>
        
        <div style={{ marginTop: '30px' }}>
          <h3>Next steps:</h3>
          <ol>
            <li>Check if useAPI hook works</li>
            <li>Check if API connection works</li>
            <li>Check if full App.tsx works</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default AppTest;

