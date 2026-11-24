import { NextRequest, NextResponse } from 'next/server';
import { verifyPincode } from '@/lib/pincode';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;
    const result = await verifyPincode(code);

    return NextResponse.json({
      success: result.valid && result.deliverable,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, valid: false, deliverable: false, error: 'Failed to verify PIN code' },
      { status: 500 }
    );
  }
}
