# Fund Tracker Images

请将以下图片文件放置在此目录（`public/images/`）：

## 图片文件列表

1. **crumpled-ball.png** - 纸团图片
   - Figma 尺寸：340px 宽度
   - 用途：AddFundModal 取消时的下落动画

2. **binder-clip.png** - 夹子图片
   - Figma 尺寸：96px 宽度，高度自动
   - 用途：FundHeader 右侧装饰，文件夹关闭时显示

3. **paper-clip.png** - 回形针图片
   - Figma 尺寸：82px x 146px
   - 用途：FundHeader 左上角装饰，文件夹关闭时显示

## 图片路径

所有图片在代码中使用以下路径（Next.js 会自动从 public 目录提供）：
- 纸团：`/images/crumpled-ball.png`
- 夹子：`/images/binder-clip.png`
- 回形针：`/images/paper-clip.png`

## 使用说明

1. 将三张图片保存到 `public/images/` 目录
2. 确保文件名完全匹配（区分大小写）
3. 图片格式建议使用 PNG（支持透明背景）
4. 保存后刷新页面，图片会自动加载

## 注意事项

- 如果图片加载失败，相关元素会自动隐藏，不会显示占位内容
- 图片路径使用绝对路径 `/images/xxx.png`，Next.js 会自动从 `public` 目录提供静态文件


