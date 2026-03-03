'use client';

import { designTokens } from '@/styles/design-tokens';

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Design System Style Guide
              </h1>
              <p className="text-gray-600">
                Complete reference of all design tokens extracted from Figma
              </p>
            </div>
            <a
              href="/components"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Components →
            </a>
          </div>
        </header>

        {/* Colors Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Colors</h2>

          {/* Primary Colors */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4 text-gray-800">Primary Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(designTokens.colors.primary).map(([key, value]) => (
                <ColorSwatch key={key} name={key} color={value} />
              ))}
            </div>
          </div>

          {/* Secondary Colors */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4 text-gray-800">Secondary Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(designTokens.colors.secondary).map(([key, value]) => (
                <ColorSwatch key={key} name={key} color={value} />
              ))}
            </div>
          </div>

          {/* Buy/Sell Colors */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4 text-gray-800">Buy/Sell Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(designTokens.colors.buy).map(([key, value]) => (
                <ColorSwatch key={`buy-${key}`} name={`Buy ${key}`} color={value} />
              ))}
              {Object.entries(designTokens.colors.sell).map(([key, value]) => (
                <ColorSwatch key={`sell-${key}`} name={`Sell ${key}`} color={value} />
              ))}
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4 text-gray-800">Semantic Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(designTokens.colors.semantic).map(([key, value]) => (
                <ColorSwatch key={key} name={key} color={value} />
              ))}
            </div>
          </div>

          {/* Text Colors */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4 text-gray-800">Text Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(designTokens.colors.text).map(([key, value]) => (
                <ColorSwatch key={key} name={key} color={value} />
              ))}
            </div>
          </div>

          {/* Background Colors */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4 text-gray-800">Background Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(designTokens.colors.background).map(([key, value]) => (
                <ColorSwatch key={key} name={key} color={value} />
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4 text-gray-800">Color Palettes</h3>
            <div className="space-y-6">
              {(['red', 'blue', 'cyan', 'purple', 'orange', 'green', 'magenta', 'volcano'] as const).map((palette) => {
                const paletteColors = designTokens.colors[palette];
                if (!paletteColors || typeof paletteColors !== 'object') return null;
                return (
                  <div key={palette}>
                    <h4 className="text-lg font-medium mb-3 text-gray-700 capitalize">{palette}</h4>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {Object.entries(paletteColors as Record<string, string>).map(([key, value]) => (
                        <ColorSwatch key={`${palette}-${key}`} name={key} color={value} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Typography</h2>

          <div className="space-y-6">
            {Object.entries(designTokens.typography.fontSize).map(([key, value]) => (
              <div key={key} className="border-b border-gray-200 pb-4">
                <div className="flex items-baseline gap-4 mb-2">
                  <code className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {key}
                  </code>
                  <span className="text-xs text-gray-400">
                    {value.family} • {value.weight} • {value.size} / {value.lineHeight}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: value.family,
                    fontSize: value.size,
                    fontWeight: value.weight,
                    lineHeight: value.lineHeight,
                  }}
                  className="text-gray-900"
                >
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Spacing</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Object.entries(designTokens.spacing).map(([key, value]) => (
              <div key={key} className="text-center">
                <div
                  className="bg-blue-500 mx-auto mb-2"
                  style={{ width: value, height: value }}
                />
                <code className="text-xs text-gray-600">{key}</code>
                <div className="text-xs text-gray-400">{value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Border Radius</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Object.entries(designTokens.borderRadius).map(([key, value]) => (
              <div key={key} className="text-center">
                <div
                  className="bg-purple-500 mx-auto mb-2"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: value,
                  }}
                />
                <code className="text-xs text-gray-600">{key}</code>
                <div className="text-xs text-gray-400">{value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Shadows Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Shadows</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(designTokens.shadows).map(([key, value]) => {
              if (typeof value === 'object') return null;
              return (
                <div key={key} className="text-center">
                  <div
                    className="bg-white rounded-lg mb-2"
                    style={{
                      width: '120px',
                      height: '120px',
                      boxShadow: value,
                    }}
                  />
                  <code className="text-xs text-gray-600">{key}</code>
                </div>
              );
            })}
          </div>
        </section>

        {/* Breakpoints Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Breakpoints</h2>
          <div className="space-y-2">
            {Object.entries(designTokens.breakpoints).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-200">
                <code className="text-sm font-mono text-gray-700">{key}</code>
                <span className="text-sm text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ColorSwatch({ name, color }: { name: string; color: string }) {
  const isLight = color.includes('fff') || color.includes('ffffff') || color.includes('f5f6f6') || color.includes('e5e6e8');
  const textColor = isLight ? '#000' : '#fff';
  return (
    <div className="text-center">
      <div
        className="w-full h-24 rounded-lg mb-2 border border-gray-200"
        style={{ backgroundColor: color }}
      />
      <div className="text-xs" style={{ color: textColor }}>
        <div className="font-medium mb-1">{name}</div>
        <code className="text-gray-500 text-[10px]">{color}</code>
      </div>
    </div>
  );
}
