import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Wish List POST 
export async function POST(req, res) {
    try {
        let headerList = headers();
        let id = parseInt(headerList.get('id'));
        let reqBody = await req.json();

        const prisma = new PrismaClient();
        const result = await prisma.product_wishes.create({
            data: {
                product_id: reqBody['product_id'],
                user_id: id
            }
        })

        return NextResponse.json({ ststus: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ ststus: 'Fail', data: error.toString() })
    }
}

// Wish List GET
export async function GET(req, res) {
    try {
        let headerList = headers();
        let id = parseInt(headerList.get('id'));

        const prisma = new PrismaClient();
        const result = await prisma.product_wishes.findMany({
            where: {
                user_id: id,
            },
            include: { products: true }
        })

        return NextResponse.json({ ststus: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ ststus: 'Fail', data: error.toString() })
    }
}

// Wish List DEL
export async function GET(req, res) {
    try {
        let headerList = headers();
        let id = parseInt(headerList.get('id'));
        let reqBody = await req.json();

        const prisma = new PrismaClient();
        const result = await prisma.product_wishes.delete({
            where: {
                AND: [
                    {product_id: reqBody['product_id']},
                    {user_id: id}
                ]
            },
            include: { products: true }
        })

        return NextResponse.json({ ststus: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ ststus: 'Fail', data: error.toString() })
    }
}