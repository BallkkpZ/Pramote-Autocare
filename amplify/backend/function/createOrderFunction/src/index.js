const AWS = require('aws-sdk');
// ระบุภูมิภาคให้ตรงกับตาราง Orders ของคุณ (Singapore)
const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'ap-southeast-1' });

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    
    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        
        let email = 'guest';
        if (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.claims) {
            email = event.requestContext.authorizer.claims.email || 'guest';
        }

        const orderData = {
            id: Date.now().toString() + "-" + Math.random().toString(36).substr(2, 4), 
            customerEmail: email,
            serviceName: body.serviceName || 'General Service',
            totalPrice: body.totalPrice || 0,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            address: body.address || {}
        };

        const params = {
            TableName: "Orders",
            Item: orderData
        };

        // ทำการบันทึกข้อมูล
        await dynamo.put(params).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ 
                message: "สร้างคำสั่งซื้อสำเร็จ!", 
                orderId: orderData.id 
            }),
        };
    } catch (err) {
        // ส่งรายละเอียดข้อผิดพลาดกลับไปยังหน้าบ้านเพื่อการตรวจสอบที่แม่นยำ
        console.error("Critical DynamoDB Error:", err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ 
                error: "Cloud Error", 
                message: err.message,
                code: err.code,
                awsRequestId: event.requestContext?.requestId
            }),
        };
    }
};