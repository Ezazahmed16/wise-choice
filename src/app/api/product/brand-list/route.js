import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// GET Brands 
export async function GET(req, res) {
    try {
        const prisma = new PrismaClient();
        const result = await prisma.brands.findMany();
        return NextResponse.json({ status: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ status: 'fail', data: error })
    }
}

// POST Brands 
export async function POST(req, res) {
    try {
        const reqBody = await req.json();
        const prisma = new PrismaClient();
        const result = await prisma.brands.create({
            data: reqBody
        });
        return NextResponse.json({ status: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ status: 'fail', data: error })
    }
}