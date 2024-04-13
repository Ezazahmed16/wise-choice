import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        let { searchParams } = new URL(req.url);
        let id = parseInt(searchParams.get('id'))

        const prisma = new PrismaClient();
        const result = await prisma.product_reviews.findMany({
            where: { product_id: id },
            include: { customer_profiles: { select: {cus_name: true} } }
        });

        return NextResponse.json({ status: "Success", message: result })
    } catch (error) {
        return NextResponse.json({ status: "Failed", message: error })
    }
}