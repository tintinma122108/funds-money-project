/**
 * 验证「仅基金代码+份额+持有均价」方案的计算逻辑（不依赖真实 API）
 * 运行: node scripts/verify-fund-calc.mjs
 *
 * 预期：
 * - 当前市值 = 份额 × API 净值
 * - 持有成本 = 份额 × 持有均价
 * - 持有收益 = 当前市值 - 持有成本
 */

// 模拟一次计算（与 utils 中逻辑一致）
function simulateHolding(shares, purchasePrice, currentPriceFromApi, yesterdayPriceFromApi) {
  const holdingCost = shares * purchasePrice;
  const currentValue = shares * currentPriceFromApi;
  const holdingProfit = currentValue - holdingCost;
  const holdingProfitPercent = holdingCost > 0 ? (holdingProfit / holdingCost) * 100 : 0;
  return {
    currentValue,
    holdingCost,
    holdingProfit,
    holdingProfitPercent,
  };
}

console.log('=== 验证：仅 基金代码 + 持仓份额 + 持有均价，当前市值/持有收益由 API 计算 ===\n');

// 用例 1：正常
const r1 = simulateHolding(1000, 2.5, 2.6, 2.48);
console.log('用例 1：份额=1000, 持有均价=2.5, API净值=2.6');
console.log('  当前市值 = 1000 × 2.6 =', r1.currentValue, '(应为 2600)');
console.log('  持有成本 = 1000 × 2.5 =', r1.holdingCost, '(应为 2500)');
console.log('  持有收益 = 2600 - 2500 =', r1.holdingProfit, '(应为 100)');
console.log('  持有收益率 =', r1.holdingProfitPercent.toFixed(2) + '%', '(应为 4%)');
const ok1 = r1.currentValue === 2600 && r1.holdingCost === 2500 && r1.holdingProfit === 100;
console.log('  通过:', ok1 ? '是' : '否');

// 用例 2：亏损
const r2 = simulateHolding(500, 3.0, 2.8, 2.9);
console.log('\n用例 2：份额=500, 持有均价=3.0, API净值=2.8（亏损）');
console.log('  当前市值 = 500 × 2.8 =', r2.currentValue, '(应为 1400)');
console.log('  持有成本 = 500 × 3.0 =', r2.holdingCost, '(应为 1500)');
console.log('  持有收益 = 1400 - 1500 =', r2.holdingProfit, '(应为 -100)');
const ok2 = r2.currentValue === 1400 && r2.holdingCost === 1500 && r2.holdingProfit === -100;
console.log('  通过:', ok2 ? '是' : '否');

// 用例 3：持有均价作为 API 失败时的 fallback（逻辑：currentValue = shares × purchasePrice）
console.log('\n用例 3：API 失败时用持有均价暂代净值');
const r3 = simulateHolding(2000, 1.5, 1.5, 1.5); // currentPrice = purchasePrice
console.log('  当前市值 = 2000 × 1.5 =', r3.currentValue, '(应为 3000)');
console.log('  持有收益 = 3000 - 3000 =', r3.holdingProfit, '(应为 0，直到下次拉取到真实净值)');
const ok3 = r3.currentValue === 3000 && r3.holdingProfit === 0;
console.log('  通过:', ok3 ? '是' : '否');

const allOk = ok1 && ok2 && ok3;
console.log('\n=== 汇总:', allOk ? '全部通过，无数据错误' : '存在失败用例' + ' ===');
process.exit(allOk ? 0 : 1);
