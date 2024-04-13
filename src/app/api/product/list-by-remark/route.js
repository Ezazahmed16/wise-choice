import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


export async function GET(req, res) {
    try {
        let { searchParams } = new URL(req.url);
        let remark = searchParams.get('remark');

        const prisma = new PrismaClient();
        const result = await prisma.products.findMany({
            where:{remark:remark }
        })
        console.log(result)
        return NextResponse.json({ status: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ status: 'Fail', data: error })
    }
}