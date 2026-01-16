# Secure Order Webhook → Status Update (n8n + Node.js)

A small end-to-end demo showing how to:

- Receive a **new order** via an **n8n Webhook**
- Validate requests with an **HMAC SHA-256 signature** (`X-Signature` header)
- Process/transform data in n8n
- Call an external API (mocked locally) to **update the order status** via **HTTP PUT**

This repo contains:

- `send_order.js` — sends a signed “new order” webhook request to n8n
- `update_server.js` — a local mock API server that receives order status updates
- `n8n_http_update.md` — notes for updating the final n8n HTTP Request node

## How it works (high-level)

1. `send_order.js` sends `POST` → your n8n webhook URL and includes `X-Signature`.
2. Your n8n workflow validates the signature (Function node) and extracts `order_id`.
3. n8n sends `PUT` → `http://localhost:3000/api/orders/{orderId}` with a JSON body containing the new status.
4. `update_server.js` prints the request and responds with a success JSON payload.

## Prerequisites

- Node.js (recommended: 16+)
- n8n running locally (Desktop app or self-hosted)

## Install

```bash
npm install
```

## Run the local mock API (order status update server)

In one terminal:

```bash
node update_server.js
```

Expected log:

- `Local Order Update Server running at http://127.0.0.1:3000/`

## Set up the n8n workflow

### 1) Webhook node

- Create a **Webhook** node in n8n
- Use a test webhook URL similar to:
  - `http://localhost:5678/webhook-test/webhook-test/new-order`

> Your exact URL may differ depending on n8n setup. Update `send_order.js` accordingly.

### 2) Signature validation (Function node)

Your workflow should validate the `X-Signature` header using the same secret as `send_order.js`:

- Secret in `send_order.js`: `my-demo-secret`

> Do not use this demo secret in production.

### 3) Final HTTP Request node (status update)

Configure your final HTTP Request node as:

- Method: `PUT`
- URL:

```text
http://localhost:3000/api/orders/{{$node["Set"].json.order_id}}
```

(Adjust the referenced node name/field if your workflow uses a different node than `Set`.)

See `n8n_http_update.md` for the exact guidance.

## Send a test order to n8n

In another terminal:

```bash
node send_order.js
```

Expected:

- `send_order.js` prints the webhook response status/body
- `update_server.js` prints something like:
  - `--- RECEIVED UPDATE REQUEST ---`
  - `Order ID: ORD-1001`
  - `New Status: ...`

## Configuration

Edit these values in `send_order.js` if needed:

- `webhookUrl` (your n8n webhook endpoint)
- `secret` (must match the secret used in your n8n Function node)

## Notes for GitHub

- This repo currently contains `node_modules/` locally. For GitHub, you typically **do not commit `node_modules`**.
- Add a `.gitignore` (at minimum: `node_modules/`) before pushing.

## License

ISC (as configured in `package.json`).

