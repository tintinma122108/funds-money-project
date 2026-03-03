# Fund Tracker Assets

请将以下图片文件放置在此目录（`public/assets/fund-tracker/`）：

## 图片文件列表

1. **crumpled-ball.png** - 纸团图片 ✅ 已提供
   - Figma 尺寸：340px 宽度
   - 用途：AddFundModal 取消时的下落动画

2. **binder-clip.png** - 夹子图片 ✅ 已提供
   - Figma 尺寸：96px (w-24) 宽度，高度自动
   - 用途：FundHeader 右侧装饰，文件夹关闭时显示

3. **paper-clip.png** - 回形针图片 ✅ 已提供
   - Figma 尺寸：82px x 146px (5.125rem x 9.125rem)
   - 用途：FundHeader 左上角装饰，文件夹关闭时显示

## 图片路径

所有图片在代码中使用以下路径：
- 纸团：`/assets/fund-tracker/crumpled-ball.png`
- 夹子：`/assets/fund-tracker/binder-clip.png`
- 回形针：`/assets/fund-tracker/paper-clip.png`

## 尺寸说明

代码已根据 Figma 设计自动设置尺寸：
- 图片使用 `objectFit: 'contain'` 保持比例
- 宽度/高度已按 Figma 设计设置
- 图片会自动适应容器大小

## 使用说明

1. 将三张图片保存到 `public/assets/fund-tracker/` 目录
2. 确保文件名完全匹配（区分大小写）
3. 图片格式建议使用 PNG（支持透明背景）
4. 刷新页面后图片会自动加载

