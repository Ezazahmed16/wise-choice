import { NextResponse } from "next/server";
import { VerifyToken } from "./utility/JWTTokenHelpers";

export async function middleware(req, res) {
    try {
        let token = req.cookies.get('token');
        let payload = await VerifyToken(token['value']);

        const reqHeader = new Headers(req.headers);
        reqHeader.set('email'.payload['email']);
        reqHeader.set('email'.payload['id']);

        return NextResponse.next({
            request: {
                headers: reqHeader
            }
        })
    } catch (error) {
        if (req.url.startsWith('/api/')) {
            return NextResponse.json(
                { status: "fail", data: "Unauthorized" }, { status: 401 }
            )
        } else {
            res.redirect('/login')
        }
    }
}

export const config = {
    matcher: [
        '/api/cart/:path*',
        '/api/invoice/:path*',
        '/api/user/:path*',
        '/api/wish/:path*'
    ]
}