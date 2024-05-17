import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        let headerList = headers();
        let id = parseInt(headerList.get('id'));
        let reqBody = await req.json();

        const prisma = new PrismaClient();
        const result = await prisma.invoice_products.findMany({
            where: {
                AND: [
                    { invoice_id: reqBody['invoice_id'] },
                    { user_id: id }
                ]
            },
            include: { products: true }
        });

        return NextResponse.json({ status: 'success', data: result })
    } catch (error) {
        return NextResponse.json({ status: 'fail', data: error })
    }
}