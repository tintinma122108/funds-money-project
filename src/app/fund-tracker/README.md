# 基金估值助手 - API接入指南

## 概述

本应用已集成真实基金API，支持从多个数据源获取基金实时净值。当前支持的数据源包括：

1. **天天基金**（主要数据源）
2. **东方财富**（备用数据源）
3. **新浪财经**（备用数据源）

## API架构

### 1. 数据获取流程

```
前端组件 → Next.js API路由 → 基金数据源API
```

### 2. API路由

#### 获取基金价格
```
GET /api/fund/price?code=000001
GET /api/fund/price?codes=000001,110022,161725  // 批量查询
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "fundCode": "000001",
    "fundName": "华夏成长混合",
    "currentPrice": 1.2345,
    "yesterdayPrice": 1.2300,
    "changePercent": 0.37,
    "changeAmount": 0.0045,
    "updateTime": "2024-01-15 15:00:00"
  }
}
```

#### 搜索基金
```
GET /api/fund/search?keyword=易方达
```

**响应格式：**
```json
{
  "success": true,
  "data": [
    {
      "fundCode": "110022",
      "fundName": "易方达消费行业股票",
      "fundType": "股票型"
    }
  ]
}
```

## 数据源说明

### 天天基金API

**接口地址：** `http://fundgz.1234567.com.cn/js/{fundCode}.js`

**特点：**
- 免费使用
- 数据更新及时（交易日实时更新）
- 返回JSONP格式，需要解析

**示例：**
```javascript
// 请求
fetch('http://fundgz.1234567.com.cn/js/000001.js')

// 响应（JSONP格式）
jsonpgz({
  "fundcode": "000001",
  "name": "华夏成长混合",
  "jzrq": "2024-01-15",
  "dwjz": "1.2300",
  "gsz": "1.2345",
  "gszzl": "0.37",
  "gztime": "2024-01-15 15:00"
})
```

### 东方财富API

**接口地址：** `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo`

**特点：**
- 免费使用
- 需要设置Referer头
- 返回标准JSON格式

### 新浪财经API

**接口地址：** `http://hq.sinajs.cn/list=f_{fundCode}`

**特点：**
- 免费使用
- 数据格式简单
- 作为最后备用方案

## 缓存机制

为了减少API调用频率，系统实现了5分钟缓存机制：

- 相同基金代码在5分钟内的请求会使用缓存数据
- 缓存自动过期，确保数据及时性
- 批量查询时会智能合并请求

## 使用示例

### 在前端组件中获取基金价格

```typescript
import { getCurrentPrice, getFundName } from './utils';

// 获取单个基金价格
const price = await getCurrentPrice('000001');

// 获取基金名称
const name = await getFundName('000001');

// 批量获取价格
import { getMultipleFundPrices } from './utils';
const prices = await getMultipleFundPrices(['000001', '110022']);
```

### 在API路由中直接调用

```typescript
import { getFundInfo } from '@/app/fund-tracker/api/fundApi';

const fundInfo = await getFundInfo('000001');
```

## 错误处理

系统实现了多数据源自动切换机制：

1. 优先使用天天基金API
2. 如果失败，自动切换到东方财富API
3. 如果仍然失败，尝试新浪财经API
4. 所有数据源都失败时，返回null或使用缓存数据

## 注意事项

### 1. CORS问题

由于基金数据源API可能存在CORS限制，所有请求都通过Next.js API路由代理，避免跨域问题。

### 2. 请求频率限制

- 建议更新间隔：**30秒-5分钟**
- 避免过于频繁的请求，可能被数据源限制
- 系统已实现缓存机制，减少实际API调用

### 3. 数据准确性

- 基金净值通常在交易日15:00后更新
- 非交易日可能返回上一交易日的数据
- 建议在交易日使用以获得最新数据

### 4. 基金代码格式

- 使用6位数字基金代码（如：000001, 110022）
- 支持股票型、混合型、指数型等各类基金

## 扩展其他数据源

如果需要接入其他基金数据源，可以在 `fundApi.ts` 中添加新的函数：

```typescript
async function fetchFromNewSource(fundCode: string): Promise<FundInfo | null> {
  // 实现新的数据源获取逻辑
}

// 在 getFundInfo 函数中添加调用
export async function getFundInfo(fundCode: string): Promise<FundInfo | null> {
  // ... 现有代码
  result = await fetchFromNewSource(fundCode);
  return result;
}
```

## 测试

### 测试单个基金查询
```bash
curl "http://localhost:3000/api/fund/price?code=000001"
```

### 测试批量查询
```bash
curl "http://localhost:3000/api/fund/price?codes=000001,110022,161725"
```

### 测试搜索功能
```bash
curl "http://localhost:3000/api/fund/search?keyword=易方达"
```

## 常见问题

### Q: API返回404或数据为空？
A: 检查基金代码是否正确，某些基金可能已停止交易或代码有误。

### Q: 数据更新不及时？
A: 基金净值通常在交易日15:00后更新，非交易日不会更新。可以调整缓存时间。

### Q: 如何提高查询速度？
A: 使用批量查询接口，系统会自动合并请求并利用缓存。

### Q: 可以商用吗？
A: 这些免费API主要用于学习和个人项目。商用建议联系数据源方获取授权或使用付费API服务。


