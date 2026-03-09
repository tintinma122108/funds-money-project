import { NextRequest, NextResponse } from 'next/server';
import { getFundInfo, getMultipleFundInfo } from '@/app/fund-tracker/api/fundApi';

/**
 * GET /api/fund/price?code=000001
 * 获取单个基金价格
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const codes = searchParams.get('codes'); // 批量查询，逗号分隔

    if (codes) {
      const codeArray = codes.split(',').filter(Boolean);
      try {
        const results = await getMultipleFundInfo(codeArray);
        return NextResponse.json({
          success: true,
          data: Object.fromEntries(results),
        });
      } catch (e) {
        console.error('Fund price API getMultipleFundInfo error:', e);
        return NextResponse.json({ success: true, data: {} });
      }
    }
    if (code) {
      try {
        const fundInfo = await getFundInfo(code);
        if (!fundInfo) {
          return NextResponse.json(
            { success: false, error: 'Fund not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({
          success: true,
          data: fundInfo,
        });
      } catch (e) {
        console.error('Fund price API getFundInfo error:', e);
        return NextResponse.json(
          { success: false, error: 'Fund not found' },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { success: false, error: 'Missing fund code' },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error('Fund price API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}


