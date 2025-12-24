/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // Log ดูข้อมูลที่ส่งเข้ามา (ช่วยในการตรวจสอบเวลาเกิดปัญหา)
    console.log("Received event:", JSON.stringify(event, null, 2));
    
    try {
        // 1. แกะข้อมูลจากหน้าเว็บที่ส่งมา
        const body = JSON.parse(event.body);
        
        // 2. เตรียมข้อมูลออเดอร์ (เชื่อมกับ Table "Orders" ของคุณ)
        const orderData = {
            id: Date.now().toString() + "-" + Math.random().toString(36).substr(2, 5), // สร้าง ID แบบไม่ซ้ำ
            customerEmail: event.requestContext.authorizer.claims.email || 'guest', // ดึงเมลจาก Cognito
            serviceName: body.serviceName || 'General Service',
            totalPrice: body.totalPrice || 0,
            status: 'PENDING', // สถานะเริ่มต้นคือรอชำระเงิน
            createdAt: new Date().toISOString()
        };

        const params = {
            TableName: "Orders", // ชื่อตารางใน DynamoDB ของคุณ
            Item: orderData
        };

        // 3. บันทึกลงฐานข้อมูล
        await dynamo.put(params).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // อนุญาตให้หน้าเว็บเรียกใช้ได้
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ 
                message: "สร้างคำสั่งซื้อสำเร็จ!", 
                orderId: orderData.id 
            }),
        };
    } catch (err) {
        console.error("Error:", err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ error: "เกิดข้อผิดพลาดในการสร้างออเดอร์: " + err.message }),
        };
    }
};