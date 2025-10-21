// Minimal App - Just to test if React works
import React from 'react';

function AppMinimal() {
  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#000' }}>
        ✅ React is Working!
      </h1>
      
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <h2>If you see this, React is rendering correctly.</h2>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default AppMinimal;

