# 🌐 基金估值助手 - 访问地址

## ✅ 当前服务器状态

**开发服务器正在运行中！**

## 📱 访问地址

### 主要访问方式

#### 1. 本地访问（推荐）
```
http://localhost:3000/fund-tracker
```

#### 2. 本机IP访问（同一网络下的其他设备）
```
http://[你的IP地址]:3000/fund-tracker
```

**获取本机IP：**
- Mac: 系统设置 > 网络 > 查看IP地址
- 或在终端运行: `ifconfig | grep "inet " | grep -v 127.0.0.1`

#### 3. 移动设备访问（同一WiFi网络）
1. 确保手机和电脑连接同一WiFi
2. 在手机浏览器输入：`http://[电脑IP]:3000/fund-tracker`

## 🎯 页面地址列表

### 基金估值助手（主要功能）
```
http://localhost:3000/fund-tracker
```

### 其他页面
- **金融首页**: `http://localhost:3000/finance`
- **主页**: `http://localhost:3000`

## 🔧 更改端口

如果需要使用其他端口，可以：

### 方法1: 修改启动命令
```bash
cd /Users/maketintingreatagain/Desktop/cursor/haze-soup
npm run dev -- -p 3001
```

### 方法2: 修改package.json
```json
{
  "scripts": {
    "dev": "next dev --turbopack -p 3001"
  }
}
```

然后访问：`http://localhost:3001/fund-tracker`

## 📲 移动端访问

### 步骤：
1. **确保电脑和手机在同一WiFi网络**
2. **获取电脑IP地址**：
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
3. **在手机浏览器输入**：
   ```
   http://[电脑IP]:3000/fund-tracker
   ```
   例如：`http://192.168.1.100:3000/fund-tracker`

### 注意事项：
- 确保防火墙允许3000端口
- 确保电脑和手机在同一网络
- 如果无法访问，检查防火墙设置

## 🔒 防火墙设置

### Mac系统
1. 系统设置 > 网络 > 防火墙
2. 点击"选项"
3. 确保允许传入连接

### 或临时关闭防火墙测试
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
```

## 🌍 公网访问（可选）

如果需要从外网访问，可以使用：

### 1. ngrok（推荐）
```bash
# 安装ngrok
brew install ngrok

# 启动隧道
ngrok http 3000
```

会得到一个公网地址，例如：`https://abc123.ngrok.io/fund-tracker`

### 2. Cloudflare Tunnel
```bash
# 安装cloudflared
brew install cloudflared

# 启动隧道
cloudflared tunnel --url http://localhost:3000
```

## 📊 快速测试

### 测试服务器是否运行
```bash
curl http://localhost:3000
```

### 测试API
```bash
curl "http://localhost:3000/api/fund/price?code=000001"
```

## 🎯 推荐访问方式

**开发环境：**
- 使用 `http://localhost:3000/fund-tracker`

**测试移动端：**
- 使用本机IP地址访问

**分享给他人：**
- 使用ngrok或类似工具创建公网隧道

---

**当前访问地址：** http://localhost:3000/fund-tracker
**服务器状态：** ✅ 运行中


