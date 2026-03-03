import { NextRequest, NextResponse } from 'next/server';
import { searchFund } from '@/app/fund-tracker/api/fundApi';

/**
 * GET /api/fund/search?keyword=易方达
 * 搜索基金
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');

    if (!keyword) {
      return NextResponse.json(
        { success: false, error: 'Missing keyword' },
        { status: 400 }
      );
    }

    const results = await searchFund(keyword);
    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('Fund search API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


