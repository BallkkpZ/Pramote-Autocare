const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    
    try {
        // 1. แกะข้อมูลแบบปลอดภัย (รองรับทั้ง body ที่เป็น string และ object)
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        
        // 2. ดึง Email แบบปลอดภัย (ถ้าไม่มี Claims จะไม่พัง)
        let email = 'guest';
        if (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.claims) {
            email = event.requestContext.authorizer.claims.email || 'guest';
        }

        // 3. เตรียมข้อมูลออเดอร์
        const orderData = {
            orderId: Date.now().toString(), // ใช้ orderId ตามโครงสร้างมาตรฐาน
            customerEmail: email,
            serviceName: body.serviceName || 'General Service',
            totalPrice: body.totalPrice || 0,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            address: body.address || {} // เก็บข้อมูลที่อยู่จากหน้า Checkout มาด้วย
        };

        const params = {
            TableName: "Orders",
            Item: orderData
        };

        // 4. บันทึกลงฐานข้อมูล
        await dynamo.put(params).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ 
                message: "สร้างคำสั่งซื้อสำเร็จ!", 
                orderId: orderData.orderId 
            }),
        };
    } catch (err) {
        console.error("Error Detail:", err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ 
                error: "Cloud Error", 
                details: err.message 
            }),
        };
    }
};