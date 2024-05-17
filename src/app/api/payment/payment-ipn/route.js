import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        let { searchParams } = new URL(req.url)
        let tran_id = searchParams.get('tran_id');
        let reqBody = await req.json();

        const prisma = new PrismaClient();
        const result = await prisma.invoices.updateMany({
            where: {
                AND: [
                    { tran_id: tran_id }
                ]
            },
            data: { payment_status: reqBody['status'] }
        })

        return NextResponse.json({ status: 'Success', data: result })

    } catch (error) {
        return NextResponse.json({ status: 'Fail', data: error })
    }
}