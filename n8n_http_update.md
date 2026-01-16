Updating n8n to Use the Local Server

Since your last node (HTTP Request) is correctly failing due to the placeholder URL, follow these steps to use the new update_server.js file and achieve a full success checkmark on all nodes.

1. Start the Local Server

Save the provided code as update_server.js.

Open your terminal/command prompt.

Navigate to the directory where you saved the file.

Run the server:

node update_server.js


The terminal should output: Local Order Update Server running at http://127.0.0.1:3000/

2. Update the n8n HTTP Request Node

Now that the local server is running, you must point the HTTP Request node to it.

Open your n8n workflow.

Click on the last node (the HTTP Request node for updating the status).

Locate the URL parameter.

Replace the placeholder URL (http://example.com/api/orders/{{$node["Set"].json.order_id}}) with the new local URL:

http://localhost:3000/api/orders/{{$node["Set"].json.order_id}}


Ensure: The Method is still set to PUT.

3. Final Testing (Complete Green Flow)

With the server running and the n8n node updated, you can perform the final test:

In n8n, click on the HTTP Request node.

Click the red "Execute step" button.

Expected Result:

n8n: The HTTP Request node will turn green. The Output panel will show the JSON response from your local server, confirming the update was successful (e.g., success: true).

Terminal: Your running update_server.js terminal will print the log:

--- RECEIVED UPDATE REQUEST ---
Order ID: ORD-1001
New Status: processing
...


This confirms the entire sequence—from webhook data to final API call—is working perfectly! Once you have the green checkmark, you can confidently activate your workflow.