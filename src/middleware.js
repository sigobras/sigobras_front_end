import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export async function middleware(req) {
	const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
	if (!session) {
		const url = new URL('/', req.nextUrl.origin);
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ['/inicio/:path'],
};
