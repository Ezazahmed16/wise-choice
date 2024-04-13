import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// GET category-list 
export async function GET(req, res) {
    try {
        const prisma = new PrismaClient();
        const result = await prisma.categories.findMany();
        return NextResponse.json({ status: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ status: 'fail', data: error })
    }
}

// POST category-list 
export async function POST(req, res) {
    try {
        const reqBody = await req.json();
        const prisma = new PrismaClient();
        const result = await prisma.categories.create({
            data: reqBody
        });
        return NextResponse.json({ status: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ status: 'fail', data: error })
    }
}