# Figma 间距还原策略清单

## 🔍 当前实现问题分析

### 问题 1: Header 定位逻辑
- **当前状态**: Header 使用 `absolute` 定位，相对于 `main` 容器
- **问题**: `main` 在 AppViewport 的内容区域内，导致定位基准不一致
- **影响**: Header 可能无法正确固定在视窗顶部

### 问题 2: 主内容区域 padding-top
- **当前状态**: 使用 `pt-[180px]` 避开固定头部
- **问题**: 如果 Header 是 `absolute`，这个值可能不准确
- **影响**: 内容可能被 Header 遮挡或间距过大

### 问题 3: 卡片内边距
- **当前状态**: 已改为 `p-8` (32px)
- **问题**: 需要确认是否所有卡片都统一

---

## 📋 需要您定义的间距策略清单

请为以下每一项提供 Figma 中的精确数值和策略：

### 1. **Header（账户余额头部）定位策略**
```
问题：Header 应该如何定位？
选项：
  A. fixed - 相对于整个视口固定（会飞出容器）
  B. sticky - 在滚动容器内固定（推荐，在容器内）
  C. absolute - 相对于父容器绝对定位

Figma 中的行为：________________
您希望的策略：________________
```

### 2. **Header 高度**
```
Figma 中的 Header 总高度（包含状态栏）：_____px
Header 内容区域高度：_____px
状态栏高度：_____px
```

### 3. **主内容区域起始位置**
```
问题：主内容应该从哪个位置开始？
当前使用：pt-[180px]

Figma 中的实际值：_____px
计算方式：Header 高度 + 额外间距 = _____px
```

### 4. **页面左右内边距**
```
当前使用：px-6 (24px)
Figma 中的值：_____px
您的策略：使用 px-6 还是其他值？
```

### 5. **卡片内边距**
```
当前使用：p-8 (32px)
Figma 中的值：_____px
您的策略：统一使用 p-8 还是需要调整？
```

### 6. **卡片之间的间距**
```
当前使用：gap-4 (16px)
Figma 中的值：_____px
您的策略：________________
```

### 7. **Header 内部间距**
```
Header 顶部内边距（pt-14 = 56px）：Figma 值 _____px
Header 底部内边距（pb-6 = 24px）：Figma 值 _____px
Header 左右内边距（px-6 = 24px）：Figma 值 _____px
```

### 8. **卡片内部元素间距**
```
Row 1 (标题行) 底部间距（mb-4 = 16px）：Figma 值 _____px
Row 2 (涨幅行) 底部间距（mb-4 = 16px）：Figma 值 _____px
Grid 顶部间距（pt-3 = 12px）：Figma 值 _____px
Grid 内部 gap-x（gap-x-6 = 24px）：Figma 值 _____px
Grid 内部 gap-y（gap-y-3 = 12px）：Figma 值 _____px
```

### 9. **状态栏相关**
```
状态栏高度（h-11 = 44px）：Figma 值 _____px
状态栏左右内边距（px-8 = 32px）：Figma 值 _____px
Header 顶部 padding（pt-14 = 56px，包含状态栏）：Figma 值 _____px
```

### 10. **Home Indicator**
```
Home Indicator 高度（h-8 = 32px）：Figma 值 _____px
Home Indicator 底部 padding（pb-2 = 8px）：Figma 值 _____px
```

---

## 🎯 建议的解决方案

### 方案 A: Sticky Header（推荐）
```tsx
// Header 使用 sticky，在容器内固定
<div className="sticky top-0 z-40 ...">
// 主内容不需要额外 padding-top
<div className="px-6 pb-20 pt-4 ...">
```

### 方案 B: Fixed Header + 精确计算
```tsx
// Header 使用 fixed，但限制在容器内
<div className="fixed top-0 left-0 right-0 max-w-[393px] ...">
// 主内容使用精确计算的 padding-top
<div className="px-6 pb-20 pt-[精确值] ...">
```

### 方案 C: Absolute Header + 相对定位
```tsx
// Header 使用 absolute，相对于 AppViewport
<div className="absolute top-0 left-0 right-0 ...">
// 主内容使用精确计算的 padding-top
<div className="px-6 pb-20 pt-[精确值] ...">
```

---

## 📝 请提供以下信息

1. **Header 定位策略**：A / B / C（或您的方案）
2. **所有间距的 Figma 精确值**（填写上面的清单）
3. **是否有其他特殊要求**

收到您的策略后，我会立即实现并确保所有间距正确生效。


