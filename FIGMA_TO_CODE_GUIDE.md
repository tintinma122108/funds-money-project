# Figma 1:1 还原指南

## 📋 当前技术栈

### 核心框架
- **Next.js 15.5.0** - React 全栈框架（使用 App Router）
- **React 19.1.0** - UI 库
- **TypeScript 5** - 类型安全

### 样式系统
- **Tailwind CSS 4** - 原子化 CSS 框架（主要样式方案）
- **CSS Modules** - 可选（当前未使用）
- **globals.css** - 全局样式和 CSS 变量

### UI 增强库
- **Framer Motion 11.0.0** - 动画库（用于数字动画、页面过渡）
- **Lucide React 0.400.0** - 图标库
- **clsx + tailwind-merge** - className 合并工具

### 开发工具
- **Turbopack** - Next.js 快速构建工具
- **ESLint** - 代码检查

---

## 🎯 Figma → 代码 1:1 还原方法

### 1. **间距系统（Spacing）**

#### Tailwind 的 4px 步进系统
```css
/* Tailwind 间距映射 */
0 = 0px
1 = 4px
2 = 8px
3 = 12px
4 = 16px
5 = 20px
6 = 24px
8 = 32px
10 = 40px
12 = 48px
16 = 64px
20 = 80px
```

#### Figma 间距转换规则
```javascript
// 如果 Figma 是 24px，直接使用 Tailwind 的 p-6 (24px)
// 不要使用绝对的 px 值，除非它是装饰性的细线

// ❌ 错误：使用绝对 px
className="p-[24px]"

// ✅ 正确：使用 Tailwind 阶梯值
className="p-6"  // 24px

// ✅ 装饰性细线可以使用绝对 px
className="border-[8px]"  // 装饰性边框
```

#### 视觉密度补偿（0.92x）
由于浏览器渲染与 Figma 存在差异，建议应用 0.92x 视觉紧凑化：
```javascript
// Figma: 24px → 代码: 24px * 0.92 = 22.08px ≈ 24px (p-6)
// Figma: 16px → 代码: 16px * 0.92 = 14.72px ≈ 16px (p-4)
// Figma: 12px → 代码: 12px * 0.92 = 11.04px ≈ 12px (p-3)
```

---

### 2. **盒模型统一（Box Model）**

#### 使用 Flexbox gap 属性
```jsx
// ❌ 错误：使用 margin 实现间距
<div className="flex">
  <div className="mr-4">Item 1</div>
  <div className="mr-4">Item 2</div>
</div>

// ✅ 正确：使用 gap 属性
<div className="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

#### 容器对齐
```jsx
// ✅ 确保容器使用 w-full，没有多余的外部 margin
<div className="w-full max-w-full overflow-x-hidden">
  {/* 内容 */}
</div>
```

---

### 3. **颜色系统（Colors）**

#### 直接使用 Figma 精确颜色
```jsx
// ✅ 使用精确的十六进制颜色
const redText = "text-[#e11d48]";  // Figma 红色
const greenText = "text-[#059669]"; // Figma 绿色

// ✅ 或使用 Tailwind 配置的颜色
className="bg-gray-50 text-gray-900"
```

#### 在 tailwind.config.ts 中扩展颜色
```typescript
theme: {
  extend: {
    colors: {
      'figma-red': '#e11d48',
      'figma-green': '#059669',
    }
  }
}
```

---

### 4. **字体系统（Typography）**

#### 字体大小映射
```javascript
// Tailwind 字体大小
text-xs   = 12px
text-sm   = 14px
text-base = 16px
text-lg   = 18px
text-xl   = 20px
text-2xl  = 24px
text-3xl  = 30px
text-4xl  = 36px
```

#### 行高和字间距
```jsx
// ✅ 显式设置行高和字间距
<span className="text-sm leading-tight tracking-wider">
  总资产 (CNY)
</span>

// leading-tight = line-height: 1.25
// tracking-wider = letter-spacing: 0.05em
```

---

### 5. **圆角系统（Border Radius）**

#### Tailwind 圆角值
```javascript
rounded-none = 0px
rounded-sm   = 2px
rounded      = 4px
rounded-md   = 6px
rounded-lg   = 8px
rounded-xl   = 12px
rounded-2xl   = 16px
rounded-3xl   = 24px
rounded-full  = 9999px
```

#### 装饰性圆角可以使用绝对 px
```jsx
// ✅ 装饰性圆角（如 AppViewport 的 50px）
className="rounded-[50px]"
```

---

### 6. **阴影系统（Shadows）**

#### 使用精确的阴影值
```jsx
// ✅ 直接使用 Figma 的阴影值
className="shadow-[0_8px_30px_rgb(0,0,0,0.04)]"

// ✅ 或使用 Tailwind 预设
className="shadow-lg"
```

---

### 7. **布局系统（Layout）**

#### Flexbox 布局
```jsx
// ✅ 使用 Flexbox 和 gap
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// ✅ 使用 Grid 和 gap
<div className="grid grid-cols-2 gap-x-6 gap-y-3">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

#### 定位系统
```jsx
// ✅ 使用 relative/absolute/fixed
<div className="relative">
  <div className="absolute top-0 right-0">...</div>
</div>

// ✅ sticky 定位（用于固定头部）
<div className="sticky top-0 z-40">...</div>
```

---

## 🔍 1:1 还原检查清单

### ✅ 间距检查
- [ ] 所有间距使用 Tailwind 的 4px 步进系统
- [ ] 使用 `gap` 属性而不是 `margin` 实现间距
- [ ] 应用 0.92x 视觉紧凑化补偿

### ✅ 颜色检查
- [ ] 使用 Figma 精确的十六进制颜色值
- [ ] 背景色铺满容器（使用 `w-full`）

### ✅ 字体检查
- [ ] 字体大小映射到 Tailwind 阶梯值
- [ ] 显式设置 `leading-tight` 行高
- [ ] 设置 `tracking-wider` 或 `tracking-normal` 字间距

### ✅ 容器检查
- [ ] 容器使用 `w-full` 且没有多余的外部 margin
- [ ] 添加 `max-w-full overflow-x-hidden` 防止溢出
- [ ] 圆角使用 Tailwind 标准值（装饰性除外）

### ✅ 视觉回归检查
- [ ] 容器 max-width 不溢出
- [ ] 背景色铺满
- [ ] 按钮圆角半径正确
- [ ] 间距符合 App 密度

---

## 📝 实际示例

### FundHeader 组件
```jsx
// ✅ 正确的实现
<div className="sticky top-0 z-40 bg-gray-50/90 backdrop-blur-xl pb-4 pt-4 px-6 border-b border-gray-200/50 w-full">
  <div className="flex flex-col gap-4 w-full">
    <div className="flex flex-col gap-1.5 w-full">
      <span className="text-gray-500 text-sm font-normal tracking-wider leading-tight">
        总资产 (CNY)
      </span>
      <div className="flex items-baseline gap-2">
        <motion.div className="text-4xl font-medium text-gray-900 tracking-normal leading-tight tabular-nums">
          ¥<AnimatedNumber value={totalValue} />
        </motion.div>
      </div>
    </div>
  </div>
</div>
```

### FundListItem 组件
```jsx
// ✅ 正确的实现
<div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full">
  <div className="flex justify-between items-start gap-3 mb-4">
    <div className="flex items-center flex-wrap gap-2 flex-1 min-w-0">
      <h4 className="font-semibold text-gray-900 leading-tight text-base">
        {fund.fundName}
      </h4>
    </div>
  </div>
  <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-3 border-t border-gray-100">
    {/* 网格内容 */}
  </div>
</div>
```

---

## 🛠️ 工具推荐

### Figma 插件
- **Figma to Code** - 自动生成代码
- **Figma Tokens** - 导出设计令牌

### 浏览器扩展
- **Figma Dev Mode** - 查看精确的 CSS 值
- **Pesticide** - 可视化盒模型

### VS Code 扩展
- **Tailwind CSS IntelliSense** - Tailwind 自动补全
- **PostCSS Language Support** - CSS 支持

---

## 📚 参考资源

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Figma Dev Mode](https://help.figma.com/hc/en-us/articles/360055204534)

---

## 💡 最佳实践

1. **优先使用 Tailwind 预设值**，而不是绝对 px
2. **统一使用 gap 属性**，而不是 margin
3. **显式设置行高和字间距**，防止文字撑破布局
4. **应用视觉紧凑化补偿**（0.92x），确保浏览器渲染与 Figma 一致
5. **使用精确的颜色值**，直接从 Figma 复制十六进制颜色
6. **容器使用 w-full**，确保背景铺满
7. **添加 overflow-x-hidden**，防止水平溢出


