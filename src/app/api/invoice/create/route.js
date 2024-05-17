import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        let headerList = headers();
        let id = parseInt(headerList.get('id'));
        let cus_email = headerList.get('email');

        const prisma = new PrismaClient();

        // Calculate Total 
        const cartproducts = await prisma.product_carts.findMany({
            where: {
                user_id: id
            },
            include: { products: true }
        })

        let totalAmmount = 0;
        cartproducts.forEach((element) => {
            let price;
            if (element['products']['discount']) {
                price = element['products']['discount_price']
            } else {
                price = element['products']['price']
            }

            totalAmmount += element['qty'] * price
        })

        let vat = totalAmmount * 0.05 //5% Vat
        let payable = totalAmmount + vat


        // Customer details and shipping details 
        let Profile = await prisma.customer_profiles.findUnique({
            where: { user_id: id }
        })
        let cus_details = `Name: ${Profile['cus_name']}, Email: ${cus_email}},  Address: ${Profile['cus_add']}, Phone: ${Profile['cus_phone']}`
        let ship_details = `Name: ${Profile['ship_name']}, City: ${Profile['ship_city']}},  Address: ${Profile['ship_add']}, Phone: ${Profile['ship_phone']}`

        // Transaction and ID
        let tran_id = (Math.floor(10000000 + Math.random() * 90000000)).toString();
        let val_id = "0";
        let delivary_status = "Pending";
        let payment_status = "Pending";

        // Invoice Create
        const createInvoice = await prisma.invoices.create({
            data: {
                total: totalAmmount,
                vat: vat,
                payable: payable,
                cus_details: cus_details,
                ship_details: ship_details,
                tran_id: tran_id,
                val_id: val_id,
                delivary_status: delivary_status,
                payment_status: payment_status,
                user_id: id
            }
        })

        // Create invouice Products 
        let invoice_id = createInvoice['id'];

        for (const element of cartproducts) {
            await prisma.invoice_products.create({
                data: {
                    invoice_id: invoice_id,
                    product_id: element['product_id'],
                    user_id: id,
                    qty: element['qty'],
                    sale_price: element['products']['discount'] ? ['products']['discount_price'] : element['products']['price'],
                    color: element['color'],
                    size: element['size']
                }
            })
        }

        // Remove Carts
        await prisma.product_carts.deleteMany({
            where: { user_id: id }
        })

        // Payment System SSL 
        let PaymentSettings = await prisma.sslcommerz_accounts.findFirst();

        const form = new FormData();

        form.append('store_id', PaymentSettings['store_id'])
        form.append('store_passwd', PaymentSettings['store_passwd'])
        form.append('total_amount', payable.toString())
        form.append('currency', PaymentSettings['currency'])
        form.append('tran_id', tran_id)

        form.append('success_url', `${PaymentSettings['success_url']}?tran_id= ${tran_id}`)
        form.append('fail_url', `${PaymentSettings['fail_url']}?tran_id= ${tran_id}`)
        form.append('cancel_url', `${PaymentSettings['cancel_url']}?tran_id= ${tran_id}`)
        form.append('ipn_url', `${PaymentSettings['ipn_url']}?tran_id= ${tran_id}`)

        form.append('cus_name', Profile['cus_name'])
        form.append('cus_email', cus_email)
        form.append('cus_add1', Profile['cus_add'])
        form.append('cus_add2', Profile['cus_add'])
        form.append('cus_city', Profile['cus_city'])
        form.append('cus_state', Profile['cus_state'])
        form.append('cus_postcode', Profile['cus_postcode'])
        form.append('cus_country', Profile['cus_country'])
        form.append('cus_phone', Profile['cus_phone'])
        form.append('cus_fax', Profile['cus_fax'])

        form.append('shipping_method', 'YES')
        form.append('ship_name', 'ship_name')
        form.append('ship_add1', 'ship_add')
        form.append('ship_add2', 'ship_add')
        form.append('ship_city', 'ship_city')
        form.append('ship_state', 'ship_state')
        form.append('ship_country', 'ship_country')
        form.append('ship_postcode', 'ship_postcode')

        form.append('product_name', 'According to invoice')
        form.append('product_category', 'According to invoice')
        form.append('product_profile', 'According to invoice')
        form.append('ship_amount', 'According to invoice')

        let SSLRes = await fetch(PaymentSettings['init_url'], {
            method: 'POST',
            body: form
        })

        let SSLResJson = await SSLRes.json();

        return NextResponse.json({ status: 'Success', data: SSLResJson })


    } catch (error) {
        return NextResponse.json({ status: 'Fail', data: error })
    }
}