# CRM Backend API

A RESTful backend API for a Customer Relationship Management (CRM) system.
Built with **Node.js**, **Express 4**, and **MongoDB (Mongoose)** — deployed on **Vercel**.

Supports full lead lifecycle management, sales agent tracking, tag organisation, comment threads, and analytics reports.

---

## 🔗 Live API

**Base URL:** `https://github.com/BrundaRachutaiah/CRM-backend.git`

---

## ⚡ Quick Start

```bash
git clone https://github.com/BrundaRachutaiah/CRM-backend.git
cd CRM-backend
npm install
```

Create a `.env` file in the root:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
VITE_API_FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
```

Start the server:

```bash
npm run dev       # development (nodemon)
npm start         # production
```

Server runs at `http://localhost:5000`

---

## 🛠️ Technologies

| Layer        | Tech                       |
|--------------|----------------------------|
| Runtime      | Node.js                    |
| Framework    | Express 4                  |
| Database     | MongoDB + Mongoose 9       |
| Config       | dotenv                     |
| CORS         | cors                       |
| Deployment   | Vercel (`@vercel/node`)    |

---

## 📁 Project Structure

```
CRM-backend-main/
├── src/
│   ├── config/
│   │   ├── db.js                      # MongoDB connection (lazy + cached)
│   │   └── env.js                     # dotenv loader
│   ├── controllers/
│   │   ├── lead.controller.js         # Lead CRUD + filtering
│   │   ├── salesAgent.controller.js   # Agent management
│   │   ├── comment.controller.js      # Lead comment threads
│   │   ├── tag.controller.js          # Tag management
│   │   └── report.controller.js       # Analytics reports
│   ├── middleware/
│   │   ├── auth.middleware.js         # Mock auth (x-agent-id header)
│   │   └── error.middleware.js        # Global error handler
│   ├── models/
│   │   ├── Lead.model.js
│   │   ├── SalesAgent.model.js
│   │   ├── Comment.model.js
│   │   └── Tag.model.js
│   ├── routes/
│   │   ├── lead.routes.js
│   │   ├── salesAgent.routes.js
│   │   ├── comment.routes.js
│   │   ├── tag.routes.js
│   │   └── report.routes.js
│   ├── utils/
│   │   └── response.util.js           # Shared success/error helpers
│   ├── app.js                         # Express app + middleware setup
│   └── server.js                      # Entry point
├── vercel.json
└── package.json
```

---

## 🌐 API Reference

### 👤 Sales Agents — `/api/agents`

#### `POST /api/agents`
Create a new sales agent.

**Request Body:**
```json
{ "name": "Alice Smith", "email": "alice@example.com" }
```

**Response `201`:**
```json
{
  "id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "createdAt": "2025-02-17T10:00:00.000Z"
}
```

---

#### `GET /api/agents`
Fetch all sales agents (sorted newest first).

**Response `200`:**
```json
[
  { "id": "...", "name": "Alice Smith", "email": "alice@example.com", "createdAt": "..." }
]
```

---

#### `DELETE /api/agents/:id`
Delete a sales agent by ID.

**Response `200`:**
```json
{ "success": true, "message": "Sales agent deleted successfully." }
```

---

### 🏷️ Tags — `/api/tags`

#### `POST /api/tags`
Create a new tag (name must be unique).

**Request Body:**
```json
{ "name": "VIP" }
```

**Response `201`:**
```json
{ "success": true, "message": "Tag created successfully", "data": { "_id": "...", "name": "VIP" } }
```

---

#### `GET /api/tags`
Fetch all tags.

**Response `200`:**
```json
{ "success": true, "count": 3, "data": [{ "_id": "...", "name": "VIP" }] }
```

---

### 📋 Leads — `/api/leads`

#### `POST /api/leads`
Create a new lead. Pass tag **names** (not IDs) — they are resolved automatically.

**Request Body:**
```json
{
  "name": "Rahul Verma",
  "source": "Website",
  "salesAgent": "64f1a2b3c4d5e6f7a8b9c0d1",
  "status": "New",
  "priority": "High",
  "timeToClose": 14,
  "tags": ["VIP", "Enterprise"]
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { "_id": "...", "name": "Rahul Verma", "status": "New", "..." }
}
```

---

#### `GET /api/leads`
Fetch all leads with optional filters (sorted newest first, populated with agent & tags).

**Query Parameters:**

| Param        | Type   | Description                                          |
|--------------|--------|------------------------------------------------------|
| `status`     | String | Filter by status (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Closed`) |
| `source`     | String | Filter by source (`Website`, `Referral`, `Cold Call`, etc.) |
| `salesAgent` | String | Filter by agent ID or partial name match             |
| `tags`       | String | Comma-separated tag names, e.g. `VIP,Enterprise`     |

**Response `200`:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "name": "Rahul Verma",
      "source": "Website",
      "status": "New",
      "priority": "High",
      "timeToClose": 14,
      "salesAgent": { "_id": "...", "name": "Alice Smith", "email": "alice@example.com" },
      "tags": [{ "_id": "...", "name": "VIP" }]
    }
  ]
}
```

---

#### `GET /api/leads/:id`
Fetch a single lead by ID (populated with agent & tags).

**Response `200`:**
```json
{ "success": true, "data": { "_id": "...", "name": "Rahul Verma", "..." } }
```

---

#### `PATCH /api/leads/:id`
Update a lead. Setting `status` to `"Closed"` automatically sets `closedAt`. Setting it back clears `closedAt`.

**Request Body (partial update):**
```json
{ "status": "Closed", "priority": "Low" }
```

**Response `200`:**
```json
{ "success": true, "message": "Lead updated successfully", "data": { "..." } }
```

---

#### `DELETE /api/leads/:id`
Delete a lead by ID.

**Response `200`:**
```json
{ "success": true, "message": "Lead deleted successfully" }
```

---

### 💬 Comments — `/api/leads/:id/comments`

#### `POST /api/leads/:id/comments`
Add a comment to a lead. Pass `author` as a valid Sales Agent ID.

**Request Body:**
```json
{
  "commentText": "Followed up via email, awaiting response.",
  "author": "64f1a2b3c4d5e6f7a8b9c0d1"
}
```

**Response `201`:**
```json
{
  "id": "...",
  "commentText": "Followed up via email, awaiting response.",
  "author": "Alice Smith",
  "createdAt": "2025-02-17T11:00:00.000Z"
}
```

---

#### `GET /api/leads/:id/comments`
Fetch all comments for a lead (sorted newest first).

**Response `200`:**
```json
[
  {
    "id": "...",
    "commentText": "Followed up via email, awaiting response.",
    "author": "Alice Smith",
    "createdAt": "2025-02-17T11:00:00.000Z"
  }
]
```

---

### 📊 Reports — `/api/report`

#### `GET /api/report/last-week`
Returns all leads closed in the last 7 days.

**Response `200`:**
```json
[
  { "id": "...", "name": "Rahul Verma", "salesAgent": "Alice Smith", "closedAt": "2025-02-15T..." }
]
```

---

#### `GET /api/report/pipeline`
Returns the total number of leads currently in the pipeline (all statuses except `Closed`).

**Response `200`:**
```json
{ "totalLeadsInPipeline": 12 }
```

---

#### `GET /api/report/closed-by-agent`
Returns closed lead counts grouped by sales agent.

**Response `200`:**
```json
{
  "data": [
    { "salesAgent": "Alice Smith", "email": "alice@example.com", "closedLeads": 5 },
    { "salesAgent": "Bob Jones",   "email": "bob@example.com",   "closedLeads": 3 }
  ]
}
```

---

## 🗃️ Data Models

### Lead

| Field          | Type     | Required          | Notes                                                    |
|----------------|----------|-------------------|----------------------------------------------------------|
| `name`         | String   | ✅ Yes            |                                                          |
| `source`       | String   | ✅ Yes            | `Website`, `Referral`, `Cold Call`, `Advertisement`, `Email`, `Other` |
| `salesAgent`   | ObjectId | ✅ Yes            | Ref: `SalesAgent`                                        |
| `status`       | String   | —                 | Default: `New`. Options: `New`, `Contacted`, `Qualified`, `Proposal Sent`, `Closed` |
| `priority`     | String   | —                 | Default: `Medium`. Options: `High`, `Medium`, `Low`      |
| `timeToClose`  | Number   | ✅ Yes            | Min: 1 (days)                                            |
| `tags`         | [ObjectId] | —               | Ref: `Tag`                                               |
| `closedAt`     | Date     | —                 | Auto-set when status becomes `Closed`                    |
| `createdAt`    | Date     | —                 | Auto-set (timestamps)                                    |

### SalesAgent

| Field       | Type   | Required | Notes          |
|-------------|--------|----------|----------------|
| `name`      | String | ✅ Yes   |                |
| `email`     | String | ✅ Yes   | Must be unique |
| `createdAt` | Date   | —        | Auto-set       |

### Comment

| Field         | Type     | Required | Notes              |
|---------------|----------|----------|--------------------|
| `lead`        | ObjectId | ✅ Yes   | Ref: `Lead`        |
| `author`      | ObjectId | ✅ Yes   | Ref: `SalesAgent`  |
| `commentText` | String   | ✅ Yes   |                    |
| `createdAt`   | Date     | —        | Auto-set           |

### Tag

| Field       | Type   | Required | Notes          |
|-------------|--------|----------|----------------|
| `name`      | String | ✅ Yes   | Must be unique |
| `createdAt` | Date   | —        | Auto-set       |

---

## 🔐 Auth Middleware

Authentication is mocked via the `x-agent-id` request header. In production, replace with JWT verification.

```http
x-agent-id: <sales-agent-object-id>
```

---

## 🔧 Environment Variables

| Variable               | Required | Description                              |
|------------------------|----------|------------------------------------------|
| `MONGO_URI`            | ✅ Yes   | MongoDB connection string                |
| `PORT`                 | —        | Server port (default: `5000`)            |
| `VITE_API_FRONTEND_URL`| —        | Frontend origin for CORS                 |
| `CORS_ORIGINS`         | —        | Comma-separated list of allowed origins  |

---

## 📬 Contact

For bugs or feature requests, please open an issue or reach out at: `brundadr315@gmail.com`
