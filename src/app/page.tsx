'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/start');
  }, [router]);

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuschia-100 mx-auto mb-4"></div>
        <p className="text-body text-text-secondary">加载中...</p>
      </div>
    </div>
  );
}