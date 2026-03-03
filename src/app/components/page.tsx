'use client';

import { useState } from 'react';
import ButtonDocs from './components/ButtonDocs';

const components = [
  { id: 'button', name: 'Button', component: ButtonDocs },
  // 可以添加更多组件
];

export default function ComponentsPage() {
  const [activeTab, setActiveTab] = useState('button');

  const activeComponent = components.find(c => c.id === activeTab);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Components</h1>
            <p className="text-gray-600">Interactive component documentation and playground</p>
          </div>

          {/* Tabs */}
          <div className="px-8 border-t border-gray-200">
            <nav className="flex space-x-1 -mb-px">
              {components.map((component) => (
                <button
                  key={component.id}
                  onClick={() => setActiveTab(component.id)}
                  className={`
                    px-4 py-3 text-sm font-medium border-b-2 transition-colors
                    ${
                      activeTab === component.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {component.name}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {activeComponent && <activeComponent.component />}
        </main>
      </div>
    </div>
  );
}

