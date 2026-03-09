# 手写 loading 书写动画 — 如何提供路径数据

动画的**路径数据**只在一个地方维护，你只需替换该文件中的内容即可。

## 你要改的文件

- **`loadingMotionPaths.ts`**（与 `LoadingMotion.tsx` 同目录）

该文件顶部有详细注释，这里只做简要说明。

---

## 需要提供给我的两样东西

### 1. ViewBox

- 你的 SVG 里 `<svg viewBox="...">` 的完整值。
- 示例：`0 0 72 32` 或 `0 0 100 40`。
- **必须**和 path 的坐标系一致（来自同一份 SVG）。

### 2. Path 列表（按书写顺序）

- 每条是 **一个 path 的 `d` 属性内容**（不要带 `d="` 或外层引号）。
- 顺序 = 书写顺序：第 1 条先“写”，第 2 条接着写……
- 通常 7 条（l, o, a, d, i, n, g）或 8 条（若某个字母拆成两笔）。

**示例**（仅作格式参考）：

```text
M68 27 L68 5
M65 26 C63 28 62 27 62 25 ...
M57 17 L57 5 L51 5
...
```

你提供时可以是：

- 直接发「viewBox 字符串」+「每行一条 d」的文本，或  
- 已按 `loadingMotionPaths.ts` 里格式写好的 `LOADING_VIEWBOX` 和 `LOADING_PATH_DATA` 内容。

---

## 方式一：已有完整 SVG 文件时（推荐）

若你已有「手写 loading」的**完整 SVG**（含多个 `<path>`，可有 `<mask>`）：

1. 将 SVG 保存到项目里，例如 **`public/loading-source.svg`**。
2. 在项目根目录执行：
   ```bash
   node scripts/extract-loading-paths.mjs public/loading-source.svg
   ```
3. 脚本会**自动**从 SVG 中提取所有**顶层** `<path d="...">` 的 `d`（会忽略 `<mask>` 内的 path），并写入 `loadingMotionPaths.ts` 的 `LOADING_VIEWBOX` 与 `LOADING_PATH_DATA`。

这样无需手抄 path，且顺序与源 SVG 一致。

---

## 从哪里拿到 path 和 viewBox

1. **Figma**：选中手写“loading”的矢量/路径 → Copy as SVG 或导出 SVG → 在代码里找 `<path d="...">` 和 `<svg viewBox="...">`。
2. **Illustrator / 其他**：导出 SVG，用文本编辑器打开，同样复制每个 `<path d="...">` 里 `d` 的值，以及根 `<svg>` 的 `viewBox`。

若整段“loading”是**一条 path**：  
可以只放这一条（整词一起画出），或先在设计软件里按字母/笔画拆成多条再导出。

---

## 替换完成后

- 只改 `loadingMotionPaths.ts` 中的 `LOADING_VIEWBOX` 和 `LOADING_PATH_DATA`。
- 保存后刷新页面，书写动画会使用新路径，无需改 `LoadingMotion.tsx`。

若你已准备好 viewBox 和 path 列表，把内容贴给我，我可以按 `loadingMotionPaths.ts` 的格式帮你写好一版直接替换。
