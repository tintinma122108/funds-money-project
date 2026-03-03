# 基金估值助手 APP - UI Token 设计令牌

> 本文档定义了基金估值助手应用的所有视觉设计令牌（Design Tokens），包括颜色、字体、间距、动画参数等。这些令牌是构建一致用户界面的基础。

---

## 1. 颜色系统 (Color System)

### 1.1 主色调 (Primary Colors)

#### 背景色 (Background)
```css
/* 主背景渐变 */
--bg-primary-start: #faf9f7;
--bg-primary-mid: #f5f3f0;
--bg-primary-end: #f0ebe5;

/* 卡片背景 */
--bg-card: #ffffff;
--bg-card-alt: #fbfaf8;  /* 总持仓卡片背景 */
--bg-card-paper: #f7f5f0;  /* 模态框纸张背景 */
```

#### 文字颜色 (Text Colors)
```css
/* 主要文字 */
--text-primary: #1a1a1a;
--text-primary-alt: #111827;
--text-secondary: #1c1917;

/* 辅助文字 */
--text-tertiary: #6b7280;
--text-quaternary: #a8a29e;
--text-placeholder: #78716c;
--text-disabled: #d6d3d1;
```

#### 收益颜色 (Profit/Loss Colors)
```css
/* 收益正数（红色系） */
--profit-primary: #e84e32;
--profit-secondary: #ef4444;
--profit-tertiary: #dc2626;

/* 收益负数（绿色系） */
--loss-primary: #3a6e5a;
--loss-secondary: #059669;
```

#### 边框颜色 (Border Colors)
```css
--border-primary: #e8e6e1;
--border-secondary: #e7e5e4;
--border-tertiary: #e5e5e5;
--border-quaternary: #d6d3d1;
--border-subtle: #f0f0f0;
```

#### 装饰颜色 (Decorative Colors)
```css
/* 按钮主色 */
--button-primary: #ea553a;
--button-primary-hover: #d64126;
--button-primary-text: #fbfaf8;

/* 纸张纹理颜色 */
--paper-texture: #d4d1cc;
--paper-noise-opacity: 0.03;  /* 纸张纹理叠加层透明度 */
--paper-fold-opacity: 0.02;   /* 纸张折痕透明度 */
```

### 1.2 颜色使用规范

#### 收益/亏损显示
- **收益为正**：使用 `--profit-primary` (#e84e32) 或 `--profit-secondary` (#ef4444)
- **收益为负**：使用 `--loss-primary` (#3a6e5a) 或 `--loss-secondary` (#059669)

#### 文字层级
- **主要信息**：`--text-primary` 或 `--text-primary-alt`
- **次要信息**：`--text-tertiary`
- **辅助信息**：`--text-quaternary` 或 `--text-placeholder`

---

## 2. 字体系统 (Typography System)

### 2.1 字体族 (Font Families)

#### Slogan 字体
```css
--font-slogan: "Academy Engraved LET", serif;
```
- **用途**：页面主标题（Slogan），文案全大写：「FUND YOUR FORTUNE」；不写死行数，视窗足够宽时单行、变窄时按词自动换行；字号随视窗自适应（见 `--text-size-slogan`）
- **来源**：Academy Engraved LET（OnlineWebFonts CDN，Esselte Letraset Ltd.）
- **特点**：雕刻感衬线字体，经典标题风格

#### 数字字体 (Digital/Tech)
```css
--font-digital: 'Share Tech Mono', monospace;
```
- **用途**：所有数字数据展示
  - 总资产数字
  - 估值涨跌幅
  - 累计收益、当日盈亏
  - 持有金额、持有份额、持仓成本、持有收益、持有收益率
  - 基金代码
  - 输入框数字
- **来源**：Google Fonts
- **特点**：等宽字体，具有强烈的科技感和仪表盘质感，模拟液晶数值风格

#### 标签字体
```css
--font-label: system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
```
- **用途**：标签文字、辅助说明文字
- **特点**：系统默认字体，确保跨平台一致性

#### 标题字体
```css
--font-heading: 'Playfair Display', serif;
```
- **用途**：页面标题、卡片标题
- **特点**：衬线字体，斜体样式，优雅的视觉表现

### 2.2 字体特性 (Font Properties)

#### 数字字体特性
```css
/* 等宽数字 */
font-variant-numeric: tabular-nums;
font-feature-settings: 'tnum';

/* 字间距 */
letter-spacing: normal;  /* 数字使用正常字间距 */
```

#### 标签字体特性
```css
/* 字间距加宽 */
letter-spacing: 0.05em;  /* 或 tracking-wider */
font-weight: 500;
```

#### 字体嵌入方式
- 使用 Next.js `next/font/google` 自动优化加载
- 确保不同用户访问时显示一致的字体效果
- 自动处理字体子集化和预加载

### 2.3 字体大小规范

#### 标题大小
```css
--text-size-slogan: clamp(36px, 8vw, 72px);
--text-size-heading: clamp(20px, 4vw, 32px);
--text-size-subheading: 18px;
```

#### 数字大小
```css
--text-size-number-large: 48px;      /* 总资产 */
--text-size-number-medium: 36px;     /* 估值涨跌幅 */
--text-size-number-normal: 24px;     /* 累计收益、当日盈亏 */
--text-size-number-small: 18px;      /* 持有金额、持有份额等 */
--text-size-number-tiny: 14px;       /* 收益率等 */
```

#### 标签大小
```css
--text-size-label-large: 14px;
--text-size-label-medium: 12px;
--text-size-label-small: 10px;
```

---

## 3. 间距系统 (Spacing System)

### 3.1 基础间距单位
```css
--spacing-base: 4px;  /* 基础单位，所有间距都是4px的倍数 */
```

### 3.2 间距令牌

#### 页面布局间距
```css
--spacing-page-max-width: 1280px;
--spacing-page-padding-x: 32px;      /* 水平内边距（响应式） */
--spacing-page-padding-y: 32px;       /* 垂直内边距 */
```

#### 卡片间距
```css
--spacing-card-padding: 32px;         /* 卡片内边距 */
--spacing-card-gap: 24px;             /* 卡片之间的垂直间距 */
--spacing-card-grid-gap: 24px;        /* 卡片内部网格间距 */
```

#### 总持仓卡片间距
```css
--spacing-header-padding: 24px;
--spacing-header-min-height: 280px;
```

#### 组件内部间距
```css
--spacing-section-gap: 32px;         /* 区块之间的间距 */
--spacing-element-gap: 24px;          /* 元素之间的间距 */
--spacing-item-gap: 16px;             /* 列表项之间的间距 */
--spacing-tight-gap: 8px;             /* 紧密间距 */
```

### 3.3 间距使用规范

#### 信息层级间距
- **区块之间**：使用 `--spacing-section-gap` (32px)
- **相关元素之间**：使用 `--spacing-element-gap` (24px)
- **紧密相关元素**：使用 `--spacing-item-gap` (16px)
- **非常紧密的元素**：使用 `--spacing-tight-gap` (8px)

#### 响应式间距
- 使用 `clamp()` 函数实现响应式间距
- 示例：`padding: clamp(16px, 4vw, 32px)`

---

## 4. 动画参数 (Animation Tokens)

### 4.1 动画时长 (Duration)
```css
--animation-duration-fast: 0.2s;      /* 快速交互反馈 */
--animation-duration-normal: 0.3s;     /* 标准动画 */
--animation-duration-slow: 0.5s;      /* 慢速动画 */
--animation-duration-slower: 0.8s;     /* 更慢的动画 */
--animation-duration-slowest: 1.0s;    /* 最慢的动画 */
```

### 4.2 缓动函数 (Easing Functions)
```css
/* 标准缓动 */
--easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
--easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
--easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);

/* 特殊缓动 */
--easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* 弹性效果 */
--easing-smooth: cubic-bezier(0.23, 1, 0.32, 1);     /* 平滑效果 */
--easing-back: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* 回弹效果 */
```

### 4.3 动画类型 (Animation Types)

#### 数字滚动动画 (RollingNumber)
```css
--rolling-number-duration: 0.8s;
--rolling-number-easing: cubic-bezier(0.4, 0.0, 0.2, 1);
```

#### 卡片交互动画
```css
/* 悬停上浮 */
--card-hover-translate: -4px;
--card-hover-duration: 0.3s;
--card-hover-easing: ease-out;

/* 淡入淡出 */
--card-fade-duration: 0.3s;
```

#### 模态框动画
```css
/* 打开动画 */
--modal-open-duration: 0.4s;
--modal-open-easing: cubic-bezier(0.34, 1.56, 0.64, 1);

/* 关闭动画 */
--modal-close-duration: 0.5s;
--modal-close-easing: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* 取消动画（揉皱效果） */
--modal-cancel-duration: 0.8s;
--modal-cancel-easing: ease-in-out;
```

#### 总持仓卡片动画
```css
/* 3D翻转 */
--header-flip-duration: 0.7s;
--header-flip-easing: cubic-bezier(0.23, 1, 0.32, 1);
```

### 4.4 动画性能
```css
/* 硬件加速 */
will-change: transform, opacity;

/* 动画性能优化 */
transform: translateZ(0);
backface-visibility: hidden;
```

---

## 5. 阴影系统 (Shadow System)

### 5.1 阴影令牌
```css
/* 卡片阴影 */
--shadow-card: 
  0 2px 4px rgba(0, 0, 0, 0.12),
  0 8px 24px rgba(0, 0, 0, 0.08);

/* 模态框阴影 */
--shadow-modal: 
  20px 50px 60px rgba(0, 0, 0, 0.45),
  5px 15px 15px rgba(0, 0, 0, 0.2);

/* 按钮阴影 */
--shadow-button: 
  inset 0 1px 0 rgba(255, 255, 255, 0.3),
  inset 0 -1px 2px rgba(0, 0, 0, 0.2),
  0 1px 2px rgba(0, 0, 0, 0.2),
  0 0 0 1px rgba(0, 0, 0, 0.1),
  0 0 0 4px #e8e6e1,
  0 0 0 5px rgba(255, 255, 255, 0.6),
  0 1px 3px 4px rgba(0, 0, 0, 0.1),
  inset 0 0 8px rgba(0, 0, 0, 0.15);

/* 按钮悬停阴影 */
--shadow-button-hover: 
  0 15px 20px rgba(0, 0, 0, 0.15);

/* 按钮按下阴影 */
--shadow-button-active: 
  inset 0 2px 4px rgba(0, 0, 0, 0.3);
```

---

## 6. 圆角系统 (Border Radius)

```css
--radius-small: 4px;
--radius-medium: 8px;
--radius-large: 12px;
--radius-full: 9999px;  /* 胶囊按钮 */
```

---

## 7. 透明度系统 (Opacity)

```css
--opacity-disabled: 0.5;
--opacity-hover: 0.8;
--opacity-paper-texture: 0.03;  /* 纸张纹理 */
--opacity-paper-fold: 0.02;     /* 纸张折痕 */
--opacity-paper-noise: 0.04;    /* 纸张噪点 */
--opacity-backdrop: 0.6;        /* 背景遮罩 */
```

---

## 8. 响应式断点 (Breakpoints)

```css
/* 移动端 */
--breakpoint-mobile: 640px;

/* 平板 */
--breakpoint-tablet: 768px;

/* 桌面 */
--breakpoint-desktop: 1024px;

/* 大屏 */
--breakpoint-large: 1280px;
```

---

## 9. Z-Index 层级

```css
--z-base: 0;
--z-elevated: 10;
--z-modal-backdrop: 40;
--z-modal: 50;
--z-decorative: 50;  /* 装饰元素 */
```

---

## 10. 使用规范

### 10.1 Token 命名规范
- 使用 `--` 前缀表示 CSS 变量
- 使用 kebab-case 命名
- 按类别分组（color, font, spacing 等）

### 10.2 Token 引用方式
```css
/* 在 CSS 中使用 */
.element {
  color: var(--text-primary);
  padding: var(--spacing-card-padding);
  font-family: var(--font-digital);
}

/* 在 JavaScript/TypeScript 中使用 */
const style = {
  color: 'var(--text-primary)',
  padding: 'var(--spacing-card-padding)',
};
```

### 10.3 Token 维护原则
- **单一数据源**：所有视觉样式都从 Token 中获取
- **语义化命名**：Token 名称应该清晰表达用途
- **版本控制**：Token 变更需要记录版本号
- **向后兼容**：避免破坏性变更，优先使用新增 Token

---

**文档版本**：v1.0  
**最后更新**：2024年  
**维护人员**：设计团队


