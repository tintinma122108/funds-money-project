/**
 * 基金API服务
 * 支持多种数据源：天天基金、新浪财经等
 */

export interface FundInfo {
  fundCode: string;
  fundName: string;
  currentPrice: number; // 当前净值
  yesterdayPrice: number; // 昨日净值
  changePercent: number; // 涨跌幅
  changeAmount: number; // 涨跌额
  updateTime: string; // 更新时间
}

export interface FundSearchResult {
  fundCode: string;
  fundName: string;
  fundType: string; // 基金类型
}

/**
 * 方案1: 天天基金API（推荐）
 * 接口地址：http://fundgz.1234567.com.cn/js/{fundCode}.js
 * 返回格式：jsonpgz({...})
 */
async function fetchFromTianTian(fundCode: string): Promise<FundInfo | null> {
  try {
    const url = `http://fundgz.1234567.com.cn/js/${fundCode}.js`;
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Referer': 'http://fund.eastmoney.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      // Next.js fetch配置
      next: { revalidate: 0 },
    } as RequestInit);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    // 解析JSONP格式：jsonpgz({...})
    const jsonMatch = text.match(/jsonpgz\((.+)\)/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const data = JSON.parse(jsonMatch[1]);
    
    return {
      fundCode: data.fundcode || fundCode,
      fundName: data.name || '',
      currentPrice: parseFloat(data.gsz || data.dwjz || '0'),
      yesterdayPrice: parseFloat(data.dwjz || '0'),
      changePercent: parseFloat(data.gszzl || '0'),
      changeAmount: parseFloat(data.gsz) - parseFloat(data.dwjz || '0'),
      updateTime: data.gztime || new Date().toISOString(),
    };
  } catch (error) {
    console.error('TianTian API error:', error);
    return null;
  }
}

/**
 * 方案2: 新浪财经API（备用）
 * 接口地址：http://hq.sinajs.cn/list=f_{fundCode}
 * 返回格式：var hq_str_f_000001="基金名称,净值,日期,时间,累计净值,未知,未知,未知";
 */
async function fetchFromSina(fundCode: string): Promise<FundInfo | null> {
  try {
    const url = `http://hq.sinajs.cn/list=f_${fundCode}`;
    const response = await fetch(url, {
      cache: 'no-store',
      next: { revalidate: 0 },
    } as RequestInit);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    // 解析格式：var hq_str_f_000001="基金名称,净值,日期,时间,累计净值,...";
    const match = text.match(/="(.+)"/);
    if (!match) {
      throw new Error('Invalid response format');
    }

    const parts = match[1].split(',');
    const currentPrice = parseFloat(parts[1] || '0');
    const yesterdayPrice = currentPrice; // 新浪API不直接提供昨日净值，需要计算

    return {
      fundCode,
      fundName: parts[0] || '',
      currentPrice,
      yesterdayPrice,
      changePercent: 0, // 需要根据历史数据计算
      changeAmount: 0,
      updateTime: `${parts[2]} ${parts[3]}`,
    };
  } catch (error) {
    console.error('Sina API error:', error);
    return null;
  }
}

/**
 * 方案3: 东方财富API（备用）
 * 接口地址：https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo
 */
async function fetchFromEastMoney(fundCode: string): Promise<FundInfo | null> {
  try {
    const url = `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=1&FCODE=${fundCode}`;
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Referer': 'https://fund.eastmoney.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 0 },
    } as RequestInit);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.Datas || data.Datas.length === 0) {
      throw new Error('No data found');
    }

    const fund = data.Datas[0];
    const currentPrice = parseFloat(fund.NAV || '0');
    const yesterdayPrice = parseFloat(fund.ACCNAV || currentPrice);

    return {
      fundCode: fund.FCODE || fundCode,
      fundName: fund.SHORTNAME || '',
      currentPrice,
      yesterdayPrice,
      changePercent: parseFloat(fund.RZDF || '0'),
      changeAmount: currentPrice - yesterdayPrice,
      updateTime: fund.PDATE || new Date().toISOString(),
    };
  } catch (error) {
    console.error('EastMoney API error:', error);
    return null;
  }
}

/**
 * 获取基金信息（自动尝试多个数据源）
 */
export async function getFundInfo(fundCode: string): Promise<FundInfo | null> {
  // 尝试顺序：天天基金 -> 东方财富 -> 新浪财经
  let result = await fetchFromTianTian(fundCode);
  if (result) return result;

  result = await fetchFromEastMoney(fundCode);
  if (result) return result;

  result = await fetchFromSina(fundCode);
  return result;
}

/**
 * 批量获取基金信息
 */
export async function getMultipleFundInfo(fundCodes: string[]): Promise<Map<string, FundInfo>> {
  const results = new Map<string, FundInfo>();
  
  // 并发请求，但限制并发数
  const batchSize = 5;
  for (let i = 0; i < fundCodes.length; i += batchSize) {
    const batch = fundCodes.slice(i, i + batchSize);
    const promises = batch.map(async (code) => {
      const info = await getFundInfo(code);
      if (info) {
        results.set(code, info);
      }
    });
    await Promise.all(promises);
    
    // 避免请求过快，添加延迟
    if (i + batchSize < fundCodes.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return results;
}

/**
 * 搜索基金（示例实现，实际需要根据API调整）
 */
export async function searchFund(keyword: string): Promise<FundSearchResult[]> {
  try {
    // 这里可以使用天天基金的搜索接口
    // 示例：http://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key={keyword}
    const url = `http://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=${encodeURIComponent(keyword)}`;
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Referer': 'http://fund.eastmoney.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 0 },
    } as RequestInit);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.Datas) {
      return [];
    }

    return data.Datas.map((item: any) => ({
      fundCode: item.CODE || '',
      fundName: item.NAME || '',
      fundType: item.TYPE || '',
    }));
  } catch (error) {
    console.error('Fund search error:', error);
    return [];
  }
}

