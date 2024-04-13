import { PrismaClient } from '@prisma/client';
import headers from 'next/headers'
import { NextResponse } from 'next/server';


export async function POST(req, res) {
    try {
        let headerList = headers();
        let id = parseInt(headerList.get('id'));
        let reqBody = await req.json();

        const prisma = new PrismaClient();
        const result = await prisma.customer_profiles.upsert({
            where: { user_id: id },
            update: reqBody,
            create: { ...reqBody, user_id: id }
        })

        return NextResponse.json({ status: 'Success', data: result })

    } catch (error) {
        return NextResponse.json({ status: 'fail', data: error.toString() })
    }
}

export async function GET(req, res) {
    try {
        let headerList = headers();
        let id = parseInt(headerList.get("id"));

        const prisma = new PrismaClient();
        const result = await prisma.customer_profiles.findUnique({
            where: { user_id: id }
        })

        return NextResponse.json({ status: 'Success', data: result });
    } catch (error) {
        return NextResponse.json({ status: 'fail', data: error });
    }
}