import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// GET Slider 
export async function GET(req, res) {
    try {
        const prisma = new PrismaClient();
        const result = await prisma.product_sliders.findMany();
        return NextResponse.json({ status: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ status: 'fail', data: error })
    }
}

// POST Slider 
export async function POST(req, res) {
    try {
        const reqBody = await req.json();
        const prisma = new PrismaClient();
        console.log(reqBody)
        const result = await prisma.product_sliders.create({
            data: reqBody
        });
        return NextResponse.json({ status: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ status: 'fail', data: error })
    }
}