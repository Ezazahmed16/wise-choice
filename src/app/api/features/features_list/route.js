import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        let { searchParams } = new URL(req.url);
        let type = searchParams.get('type');

        const prisma = new PrismaClient();
        const result = await prisma.features.findMany()

        return NextResponse.json({ status: 'Success', data: result });
    } catch (error) {
        return NextResponse.json({ status: 'Failed', data: error });
    }
}