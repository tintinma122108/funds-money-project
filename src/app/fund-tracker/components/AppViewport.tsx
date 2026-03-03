'use client';

import React from 'react';

interface AppViewportProps {
  children: React.ReactNode;
}

export const AppViewport: React.FC<AppViewportProps> = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#e5e7eb',
      padding: '32px',
    }}>
      {/* 基于 iPhone 15 Pro 比例：393pt x 852pt */}
      <div style={{
        width: '393px',
        height: '852px',
        background: '#faf9f7',
        borderRadius: '50px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '8px solid #1e293b',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        
        {/* 系统状态栏 (Status Bar) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '32px',
          paddingRight: '32px',
          zIndex: 100,
          background: 'transparent',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>9:41</span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: '17px', height: '10px', border: '1px solid #111827', borderRadius: '2px' }} />
            <div style={{ width: '15px', height: '10px', background: '#111827', borderRadius: '1px' }} />
          </div>
        </div>
        
        {/* 动态渲染区 (Content Area) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {children}
        </div>
        
        {/* Home Indicator */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingBottom: '8px',
          flexShrink: 0,
          zIndex: 100,
          pointerEvents: 'none',
        }}>
          <div style={{ width: '134px', height: '5px', background: '#111827', borderRadius: '9999px', opacity: 0.2 }} />
        </div>
      </div>
    </div>
  );
};

