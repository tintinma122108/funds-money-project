'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonPropsState {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  children: string;
}

export default function ButtonDocs() {
  const [props, setProps] = useState<ButtonPropsState>({
    variant: 'primary',
    size: 'md',
    disabled: false,
    children: 'Button',
  });

  const [copiedCode, setCopiedCode] = useState(false);

  const generateCode = () => {
    const propsString = [
      props.variant !== 'primary' && `variant="${props.variant}"`,
      props.size !== 'md' && `size="${props.size}"`,
      props.disabled && 'disabled',
    ]
      .filter(Boolean)
      .join(' ');

    return `<Button${propsString ? ` ${propsString}` : ''}>
  ${props.children}
</Button>`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Overview */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
        <p className="text-gray-600 mb-4">
          The Button component is a versatile, accessible button element that supports multiple variants,
          sizes, and states. It's built with TypeScript and follows the design system specifications
          extracted from Figma.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Design Source:</strong> Extracted from Figma Design System
            <br />
            <strong>Figma Node ID:</strong> 21:17858
          </p>
        </div>
      </section>

      {/* Live Preview */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Live Preview</h2>
        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <div className="flex items-center justify-center min-h-[200px]">
            <Button
              variant={props.variant}
              size={props.size}
              disabled={props.disabled}
            >
              {props.children}
            </Button>
          </div>
        </div>
      </section>

      {/* Prop Manipulation */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Properties</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          {/* Variant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variant
            </label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {(['primary', 'secondary', 'success', 'error', 'warning', 'info'] as ButtonVariant[]).map((variant) => (
                <button
                  key={variant}
                  onClick={() => setProps({ ...props, variant })}
                  className={`
                    px-4 py-2 text-sm rounded-md border transition-colors
                    ${
                      props.variant === variant
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {variant}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Default: <code className="bg-gray-100 px-1 rounded">primary</code>
            </p>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['sm', 'md', 'lg'] as ButtonSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setProps({ ...props, size })}
                  className={`
                    px-4 py-2 text-sm rounded-md border transition-colors
                    ${
                      props.size === size
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Default: <code className="bg-gray-100 px-1 rounded">md</code>
            </p>
          </div>

          {/* Disabled */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={props.disabled}
                onChange={(e) => setProps({ ...props, disabled: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Disabled</span>
            </label>
            <p className="mt-1 text-xs text-gray-500">
              Default: <code className="bg-gray-100 px-1 rounded">false</code>
            </p>
          </div>

          {/* Children */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label Text
            </label>
            <input
              type="text"
              value={props.children}
              onChange={(e) => setProps({ ...props, children: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Button text"
            />
            <p className="mt-1 text-xs text-gray-500">
              Required prop. Accepts React.ReactNode
            </p>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Example</h2>
        <div className="bg-gray-900 rounded-lg p-4 relative">
          <button
            onClick={copyCode}
            className="absolute top-4 right-4 px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {copiedCode ? 'Copied!' : 'Copy'}
          </button>
          <pre className="text-sm text-gray-100 overflow-x-auto pr-16">
            <code>{generateCode()}</code>
          </pre>
        </div>
      </section>

      {/* Prop Documentation */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Props Documentation</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Default
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm text-blue-600">variant</code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-gray-600">
                    'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
                  </code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-gray-600">'primary'</code>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Visual style variant of the button. Each variant has distinct colors:
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li><strong>primary:</strong> Brand color (Fuschia #EF5DA8)</li>
                    <li><strong>secondary:</strong> Secondary color (Iris #5D5FEF)</li>
                    <li><strong>success:</strong> Green (#22C55E)</li>
                    <li><strong>error:</strong> Red (#EF4444)</li>
                    <li><strong>warning:</strong> Orange (#F59E0B)</li>
                    <li><strong>info:</strong> Purple (#A78BFA)</li>
                  </ul>
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm text-blue-600">size</code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-gray-600">'sm' | 'md' | 'lg'</code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-gray-600">'md'</code>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Size of the button:
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li><strong>sm:</strong> Height 32px, padding 12px, text 14px</li>
                    <li><strong>md:</strong> Height 40px, padding 16px, text 13px (body)</li>
                    <li><strong>lg:</strong> Height 48px, padding 24px, text 16px</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm text-blue-600">disabled</code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-gray-600">boolean</code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-gray-600">false</code>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  When true, the button is disabled and cannot be clicked. Applies opacity 50% and
                  disables pointer events. Inherited from HTML button element.
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm text-blue-600">children</code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-gray-600">React.ReactNode</code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-gray-600">-</code>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <strong>Required.</strong> The content to display inside the button. Can be text,
                  icons, or any React node.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm text-blue-600">...props</code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-gray-600">ButtonHTMLAttributes</code>
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm text-gray-600">-</code>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  All standard HTML button attributes are supported, including:
                  <code className="block mt-1 bg-gray-100 px-2 py-1 rounded text-xs">
                    onClick, onFocus, onBlur, type, aria-*, data-*, etc.
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Validation Rules */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Validation Rules & Constraints</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>children:</strong> Required prop. Must not be empty or null.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>variant:</strong> Must be one of the predefined variants. Invalid values will fall back to 'primary'.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>size:</strong> Must be one of 'sm', 'md', or 'lg'. Invalid values will fall back to 'md'.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Accessibility:</strong> Button automatically includes focus ring styles and keyboard navigation support.</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">•</span>
              <span><strong>Type Safety:</strong> Component uses TypeScript with strict typing. All props are validated at compile time.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Common Use Cases */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Use Cases</h2>
        <div className="space-y-6">
          {/* Primary Action */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Primary Action Button</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use for the main action on a page or in a form.
            </p>
            <div className="bg-gray-50 rounded p-4 mb-4">
              <Button variant="primary" size="md">
                Submit
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
              <code>{`<Button variant="primary" size="md">
  Submit
</Button>`}</code>
            </pre>
          </div>

          {/* Secondary Action */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Secondary Action Button</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use for secondary actions or alternatives to the primary action.
            </p>
            <div className="bg-gray-50 rounded p-4 mb-4">
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
              <code>{`<Button variant="secondary" size="md">
  Cancel
</Button>`}</code>
            </pre>
          </div>

          {/* Disabled State */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Disabled Button</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use when an action is temporarily unavailable.
            </p>
            <div className="bg-gray-50 rounded p-4 mb-4">
              <Button variant="primary" size="md" disabled>
                Processing...
              </Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
              <code>{`<Button variant="primary" size="md" disabled>
  Processing...
</Button>`}</code>
            </pre>
          </div>

          {/* Different Sizes */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Size Variations</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use different sizes based on visual hierarchy and available space.
            </p>
            <div className="bg-gray-50 rounded p-4 mb-4 flex items-center gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded text-sm overflow-x-auto">
              <code>{`<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="md">Medium</Button>
<Button variant="primary" size="lg">Large</Button>`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Component-Specific Features */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Component-Specific Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Forward Ref Support</h3>
            <p className="text-sm text-gray-600">
              The Button component uses React.forwardRef, allowing you to access the underlying
              DOM element for imperative operations or integration with third-party libraries.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom ClassNames</h3>
            <p className="text-sm text-gray-600">
              Supports custom className prop that merges with default styles using clsx and
              tailwind-merge for conflict resolution.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Focus Management</h3>
            <p className="text-sm text-gray-600">
              Includes built-in focus ring styles (ring-2, ring-offset-2) that match the button
              variant color for better accessibility.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">TypeScript Support</h3>
            <p className="text-sm text-gray-600">
              Fully typed with TypeScript. Extends ButtonHTMLAttributes for full HTML button
              compatibility while adding custom props.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

