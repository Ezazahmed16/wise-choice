import { SendEmail } from "@/utility/EmailUtility";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        let { searchParams } = new URL(req.url);
        let email = searchParams.get('email');

        let code = (Math.floor(100000 + Math.random() * 900000)).toString();
        let EmailText = `Your OTP Code is=${code}`;
        let EmailSubject = "WISE-CHOICE Account Verification Code";
        await SendEmail(email, EmailText, EmailSubject)

        const prisma = new PrismaClient();
        const result = await prisma.users.upsert({
            where: { email: email },
            update: { otp: code },
            create: { email: email, otp: code }
        })

        return NextResponse.json({ status: "Success", message: result })
    } catch (error) {
        return NextResponse.json({ status: "Failed", message: error.message })
    }
}