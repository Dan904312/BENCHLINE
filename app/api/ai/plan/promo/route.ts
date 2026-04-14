import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const validCode = process.env.PROMO_CODE || 'DEV100FREE100';

  if (code?.trim().toUpperCase() === validCode.toUpperCase()) {
    return NextResponse.json({
      success: true,
      discount: 100,
      months: 12,
      message: 'DEV promo applied — 12 months PRO free!',
    });
  }

  return NextResponse.json({ success: false, message: 'Invalid promo code.' });
}
