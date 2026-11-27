import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getUserSession, USER_TOKEN_COOKIE_NAME } from '@/lib/auth';

/**
 * Endpoint for authenticated users to request immediate deletion of their account
 * and personal data upon request.
 */
export async function POST() {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }

    // Delete user from database.
    // Due to `onDelete: SetNull` on the Order model, financial order records
    // are retained anonymously for statutory tax compliance, while all personal
    // identifiers and password hashes are permanently erased.
    await prisma.user.delete({
      where: { id: session.id },
    });

    const response = NextResponse.json({
      success: true,
      message: 'Your account and personal details have been permanently deleted.',
    });

    // Clear session cookie
    response.cookies.set({
      name: USER_TOKEN_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    console.error('[Delete Account Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process account deletion request.' },
      { status: 500 }
    );
  }
}
