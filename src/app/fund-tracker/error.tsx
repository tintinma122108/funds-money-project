'use client';

import React from 'react';

export default function FundTrackerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'linear-gradient(to bottom, #faf9f7 0%, #f5f3f0 50%, #f0ebe5 100%)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 18, color: '#1c1917', marginBottom: 8 }}>
        页面加载出错
      </h1>
      <p style={{ fontSize: 14, color: '#78716c', marginBottom: 24, textAlign: 'center' }}>
        {error.message || '未知错误'}
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          padding: '12px 24px',
          background: '#1c1917',
          color: '#f7f5f0',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        重试
      </button>
    </div>
  );
}
