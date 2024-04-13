import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"
import { CreateToken } from "@/utility/JWTTokenHelpers";

export async function POST(req, res) {
    try {
        let reqBody = await req.json();

        const prisma = new PrismaClient();
        const result = await prisma.users.findMany({ where: reqBody })

        if (result.length === 0) {
            return NextResponse.json({ status: "fail", data: "Invalid Verification Code" })
        }
        else {
            await prisma.users.update({
                where: { email: reqBody['email'] },
                data: { otp: "0" }
            });

            let token = await CreateToken(result[0]['email'], result[0]['id']);
            let expireDuration = new Date(Date.now() + 24 * 60 * 60 * 1000);
            const cookieString = `token=${token}; expires=${expireDuration.toUTCString()} ;path=/`;

            return NextResponse.json({ status: "success", data: token }, { status: 200, headers: { 'set-cookie': cookieString } })
        }
    }
    catch (e) {
        return NextResponse.json({ status: "fail", data: e.message })
    }
}