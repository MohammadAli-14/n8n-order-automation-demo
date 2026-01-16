/**
 * Local Order Status Update Server
 * * This simple Node.js script simulates an external e-commerce API endpoint
 * for updating an order's status.
 * * Instructions:
 * 1. Save this file as 'update_server.js'.
 * 2. Run it from your terminal using: node update_server.js
 * 3. Keep the server running while testing your n8n workflow.
 * 4. Configure the n8n HTTP Request node to use: http://localhost:3000/api/orders/
 */
const http = require('http');

const PORT = 3000;
const HOST = '127.0.0.1'; // Use localhost to ensure it runs locally

const server = http.createServer((req, res) => {
    // 1. Check if the request method is PUT (Required by n8n)
    if (req.method === 'PUT') {
        let body = '';
        
        // 2. Read the data sent in the request body
        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        // 3. Process the request once all data is received
        req.on('end', () => {
            // Extract the Order ID from the URL path (e.g., /api/orders/ORD-1001)
            const urlParts = req.url.split('/');
            const orderId = urlParts.length > 3 ? urlParts[3] : 'UNKNOWN_ORDER';

            // Parse the JSON body sent by n8n
            let requestBody;
            try {
                requestBody = JSON.parse(body);
            } catch (e) {
                requestBody = { status: 'Invalid JSON' };
            }

            // Simulate the update process
            console.log(`\n--- RECEIVED UPDATE REQUEST ---`);
            console.log(`Order ID: ${orderId}`);
            console.log(`New Status: ${requestBody.status}`);
            console.log(`Body received: ${body}`);

            // 4. Send a successful 200 response back to n8n
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                orderId: orderId,
                newStatus: requestBody.status,
                message: `Order ${orderId} status successfully updated to '${requestBody.status}'.`
            }));
        });
    } else {
        // Handle other methods (like GET) with a 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 Not Found. Server only accepts PUT requests to /api/orders/{id}`);
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Local Order Update Server running at http://${HOST}:${PORT}/`);
    console.log(`\nReady to receive PUT requests from n8n.`);
    console.log(`Example n8n URL: http://localhost:3000/api/orders/{{$node["Set"].json.order_id}}`);
    console.log(`\n--- Waiting for n8n to send data... ---`);
});
