'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-h1 text-text-primary">样式测试页面</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 背景色测试 */}
          <div className="bg-background-secondary p-6 rounded-default">
            <h2 className="text-h2 text-text-primary mb-4">背景色测试</h2>
            <p className="text-body text-text-secondary">
              这是背景色测试卡片。应该显示深色背景。
            </p>
          </div>
          
          {/* 颜色测试 */}
          <div className="space-y-4">
            <div className="bg-fuschia-100 text-white p-4 rounded-default">
              Fuschia 主色
            </div>
            <div className="bg-iris-100 text-white p-4 rounded-default">
              Iris 主色
            </div>
            <div className="bg-success text-white p-4 rounded-default">
              成功色
            </div>
            <div className="bg-error text-white p-4 rounded-default">
              错误色
            </div>
          </div>
        </div>
        
        {/* 字体测试 */}
        <div className="bg-background-secondary p-6 rounded-default">
          <h2 className="text-h2 text-text-primary mb-4">字体测试</h2>
          <p className="text-h1 text-text-primary mb-2">Header 1 - 34px Bold</p>
          <p className="text-h2 text-text-primary mb-2">Header 2 - 20px Bold</p>
          <p className="text-body text-text-secondary">Body - 13px Regular</p>
        </div>
        
        {/* 按钮测试 */}
        <div className="space-y-4">
          <h2 className="text-h2 text-text-primary">按钮测试</h2>
          <div className="flex flex-wrap gap-4">
            <button className="bg-fuschia-100 text-white px-4 py-2 rounded-default hover:bg-fuschia-80 transition-default">
              主要按钮
            </button>
            <button className="bg-iris-100 text-white px-4 py-2 rounded-default hover:bg-iris-80 transition-default">
              次要按钮
            </button>
            <button className="bg-success text-white px-4 py-2 rounded-default hover:bg-success/90 transition-default">
              成功按钮
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
