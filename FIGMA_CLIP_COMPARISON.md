# Figma Clip 布局对比

## Figma MCP 原始代码

### 夹子（Binder Clip）
```tsx
<div className="absolute top-24 -right-6 z-50 transition-all duration-500 ease-in-out peer-checked:translate-x-12 peer-checked:opacity-0 origin-center">
  <img 
    src={binderClipImg} 
    alt="Binder Clip" 
    className="w-24 h-auto object-contain rotate-[-90deg] drop-shadow-2xl"
  />
</div>
```

**Figma 规格：**
- 位置：`top-24` (96px), `-right-6` (-24px)
- 尺寸：`w-24` (96px), `h-auto`
- 旋转：`rotate-[-90deg]` = **-90度**
- 动画：`translate-x-12` (48px), `opacity-0`
- transformOrigin: `origin-center`

### 回形针（Paper Clip）
```tsx
<div className="absolute -top-[3rem] -left-2 z-50 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] peer-checked:-translate-y-16 peer-checked:-translate-x-12 peer-checked:rotate-[-60deg] peer-checked:opacity-0 origin-bottom-left">
  <img 
    src={paperClipImg} 
    alt="Paper Clip" 
    style={{ width: '5.125rem', height: '9.125rem' }}
    className="object-contain -rotate-[15deg] opacity-95 drop-shadow-lg"
  />
</div>
```

**Figma 规格：**
- 位置：`-top-[3rem]` (-48px), `-left-2` (-8px)
- 尺寸：`5.125rem` (82px) × `9.125rem` (146px)
- 旋转：`-rotate-[15deg]` = **-15度**
- 动画：`-translate-y-16` (-64px), `-translate-x-12` (-48px), `rotate-[-60deg]` = -60度, `opacity-0`
- transformOrigin: `origin-bottom-left`

---

## 当前代码实现

### 夹子（Binder Clip）
```tsx
<div style={{
  position: 'absolute',
  top: '50%',           // ❌ 应该是 96px (top-24)
  right: '-6%',         // ❌ 应该是 -24px (-right-6)
  transform: isOpen 
    ? 'translateY(-50%) translateX(12%) rotate(-90deg)' 
    : 'translateY(-50%) translateX(0) rotate(-90deg)',
  width: 'clamp(72px, 6rem, 120px)',  // ❌ 应该是 96px (w-24)
  height: 'clamp(72px, 6rem, 120px)', // ❌ 应该是 auto
}}>
  <img style={{
    width: '100%',
    height: '100%',
    // rotate(-90deg) ✅ 正确
  }} />
</div>
```

### 回形针（Paper Clip）
```tsx
<div style={{
  position: 'absolute',
  top: '-12%',          // ❌ 应该是 -48px (-top-[3rem])
  left: '-6%',          // ❌ 应该是 -8px (-left-2)
  transform: isOpen 
    ? 'translateY(-16%) translateX(-12%) rotate(-60deg)' 
    : 'translateY(0) translateX(0) rotate(-15deg)',  // ✅ -15度正确
  width: 'clamp(65px, 5.125rem, 100px)',   // ✅ 82px 正确
  height: 'clamp(117px, 9.125rem, 180px)', // ✅ 146px 正确
}}>
  <img style={{
    width: '100%',
    height: '100%',
    // rotate(-15deg) ✅ 正确
  }} />
</div>
```

---

## 需要修复的问题

1. **夹子位置**：应该使用固定像素值 `top: 96px, right: -24px`，而不是百分比
2. **夹子尺寸**：应该是 `width: 96px, height: auto`，而不是 clamp
3. **回形针位置**：应该使用固定像素值 `top: -48px, left: -8px`，而不是百分比
4. **动画值**：应该使用固定像素值，但考虑到自适应，可能需要混合方案


