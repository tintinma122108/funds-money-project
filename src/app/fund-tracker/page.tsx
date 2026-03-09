'use client';

import dynamic from 'next/dynamic';

const LOADING_BG = 'linear-gradient(to bottom, #faf9f7 0%, #f5f3f0 50%, #f0ebe5 100%)';

const FundTrackerClient = dynamic(
  () => import('./FundTrackerClient'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '100dvh',
          width: '100%',
          background: LOADING_BG,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 14,
          color: '#78716c',
        }}
      >
        加载中…
      </div>
    ),
  }
);

export default function FundTrackerPage() {
  return <FundTrackerClient />;
}
