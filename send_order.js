// send_order.js
// Usage: node send_order.js
const crypto = require('crypto');
const fetch = require('node-fetch'); // if Node 18+, you can use global fetch

const webhookUrl = 'http://localhost:5678/webhook-test/webhook-test/new-order';
const secret = 'my-demo-secret'; // must match Function node secret
const order = {
  id: 'ORD-1001',
  total: 39.99,
  customer: { name: 'Ali Khan', email: 'rajaali8383679@gmail.com' }
};

const payload = JSON.stringify({ order });
const hmac = crypto.createHmac('sha256', secret).update(JSON.stringify(order)).digest('hex');

(async () => {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Signature': hmac // our Function node checks header X-Signature
    },
    body: payload
  });
  const text = await res.text();
  console.log('Webhook response status:', res.status);
  console.log('Response body:', text);
})();
