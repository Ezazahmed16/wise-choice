import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Cart List Create 
export async function POST(req, res) {
    try {
        let headerList = headers();
        let id = parseInt(headerList.get('id'));
        let reqBody = await req.json();
        reqBody.user_id = id;

        const prisma = new PrismaClient();
        const result = await prisma.product_carts.create({
            data: reqBody
        })

        return NextResponse.json({ ststus: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ ststus: 'Fail', data: error.toString() })
    }
}

// Cart List Update 
export async function POST(req, res) {
    try {
        let headerList = headers();
        let id = parseInt(headerList.get('id'));
        let reqBody = await req.json();

        const prisma = new PrismaClient();
        const result = await prisma.product_carts.updateMany({
            where: {
                AND: [
                    { id: reqBody['id'] },
                    { user_id: reqBody['íd'] }
                ]
            },
            data: { color: reqBody['color'], size: reqBody['size'], qty: reqBody['qty'] }
        })

        return NextResponse.json({ ststus: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ ststus: 'Fail', data: error.toString() })
    }
}

// Cart List Read 
export async function POST(req, res) {
    try {
        let headerList = headers();
        let id = parseInt(headerList.get('id'));

        const prisma = new PrismaClient();
        const result = await prisma.product_carts.findMany({
            where: {
                user_id: id
            },
            include: { products: true }
        })

        return NextResponse.json({ ststus: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ ststus: 'Fail', data: error.toString() })
    }
}


// Cart List Delete 
export async function POST(req, res) {
    try {
        let headerList = headers();
        let id = parseInt(headerList.get('id'));
        let reqBody = await req.json();

        const prisma = new PrismaClient();
        const result = await prisma.product_carts.deleteMany({
            where: {
                AND: [
                    { id: reqBody['id'] },
                    { user_id: id }
                ]
            }
        })

        return NextResponse.json({ ststus: 'Success', data: result })
    } catch (error) {
        return NextResponse.json({ ststus: 'Fail', data: error.toString() })
    }
}

