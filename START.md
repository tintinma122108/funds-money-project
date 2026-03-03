# 基金估值助手 - 启动指南

## 🚀 快速启动

### 1. 安装依赖（如果尚未安装）

```bash
cd /Users/maketintingreatagain/Desktop/cursor/haze-soup
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问应用

开发服务器启动后，在浏览器中访问：

**基金估值助手页面：**
```
http://localhost:3000/fund-tracker
```

**其他页面：**
- 金融首页：`http://localhost:3000/finance`
- 主页：`http://localhost:3000`

## 📱 功能说明

### 基金估值助手 (`/fund-tracker`)

1. **查看持仓总览**
   - 总持仓金额
   - 总浮动盈亏（百分比和金额）

2. **添加基金**
   - 点击右上角绿色"+"按钮
   - 上传基金持仓截图（当前为模拟识别）
   - 或手动添加基金代码

3. **实时更新**
   - 基金价格每30秒自动更新
   - 使用真实基金API获取数据

4. **基金列表**
   - 显示每只基金的详细信息
   - 持有金额、当前市值、浮动盈亏
   - 支持删除基金

## 🔧 配置说明

### 端口配置

默认端口：`3000`

如需修改端口，在 `package.json` 中修改：

```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 3001"
  }
}
```

### API配置

基金API已配置为自动切换多个数据源：
- 天天基金（主要）
- 东方财富（备用）
- 新浪财经（备用）

### 缓存配置

- 价格缓存时间：5分钟
- 更新频率：30秒

可在 `src/app/fund-tracker/utils.ts` 中调整。

## 🐛 常见问题

### 1. 端口被占用

如果3000端口被占用，可以：

```bash
# 查找占用端口的进程
lsof -ti:3000

# 杀死进程（替换PID）
kill -9 <PID>

# 或使用其他端口
npm run dev -- -p 3001
```

### 2. 依赖安装失败

```bash
# 清除缓存后重新安装
rm -rf node_modules package-lock.json
npm install
```

### 3. API请求失败

- 检查网络连接
- 确认基金代码格式正确（6位数字）
- 查看浏览器控制台错误信息

### 4. 页面无法访问

- 确认开发服务器正在运行
- 检查终端是否有错误信息
- 尝试清除浏览器缓存

## 📝 测试API

开发服务器启动后，可以测试API：

```bash
# 测试单个基金价格
curl "http://localhost:3000/api/fund/price?code=000001"

# 测试批量查询
curl "http://localhost:3000/api/fund/price?codes=000001,110022"

# 测试搜索
curl "http://localhost:3000/api/fund/search?keyword=易方达"
```

## 🎯 下一步

1. **接入真实OCR服务**
   - 替换 `recognizeFundFromImage` 函数
   - 接入腾讯云OCR或阿里云OCR

2. **添加更多功能**
   - 基金走势图表
   - 持仓分布分析
   - 历史收益统计

3. **优化性能**
   - 添加服务端缓存
   - 优化API请求频率
   - 实现增量更新

## 📞 技术支持

如有问题，请检查：
1. 终端错误日志
2. 浏览器控制台
3. Next.js开发服务器日志

---

**当前状态：** ✅ 开发服务器已启动
**访问地址：** http://localhost:3000/fund-tracker


