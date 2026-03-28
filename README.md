# 📊 CRM Backend API

A scalable backend API for a CRM (Customer Relationship Management) system that manages leads, comments, sales agents, tags, and reports.

Built using **Node.js**, **Express.js**, and **MongoDB** with modular architecture and RESTful APIs.

---

## 🚀 Features

### 📌 Leads Management

* Create, update, delete leads
* Fetch all leads with filters
* Get single lead details

### 💬 Comments

* Add comments to leads
* Fetch comments for a lead

### 🏷️ Tags

* Create tags
* Fetch all tags

### 👨‍💼 Sales Agents

* Add sales agents
* View all agents
* Delete agents

### 📊 Reports

* Last week report
* Pipeline report
* Closed deals by agent

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* CORS

---

## ⚡ Installation & Setup

```bash
git clone https://github.com/BrundaRachutaiah/CRM-backend.git
cd CRM-backend-main
npm install
```

---

## ▶️ Run the Server

```bash
node index.js
```

Server runs at:

```
http://localhost:5000
```

---

## 📡 API Reference

### 📌 Leads

POST /api/leads
Create a lead

GET /api/leads
Get all leads

GET /api/leads/:id
Get single lead

PATCH /api/leads/:id
Update lead

DELETE /api/leads/:id
Delete lead

---

### 💬 Comments

POST /api/leads/:id/comments
Add comment to a lead

GET /api/leads/:id/comments
Get comments by lead

---

### 🏷️ Tags

POST /api/tags
Create a tag

GET /api/tags
Get all tags

---

### 👨‍💼 Sales Agents

POST /api/agents
Create sales agent

GET /api/agents
Get all agents

DELETE /api/agents/:id
Delete agent

---

### 📊 Reports

GET /api/report/last-week
Get last week report

GET /api/report/pipeline
Get pipeline report

GET /api/report/closed-by-agent
Get closed deals by agent

---

## 📂 Project Structure

```
CRM-backend-main/
│── controllers/
│── routes/
│── models/
│── middleware/
│── config/
│── app.js
│── package.json
```

---

## 🌐 CORS Configuration

* Supports local frontend (Vite / React)
* Allows dynamic origins from `.env`

---

## 📬 Contact

For bugs or feature requests:

[brundadr315@gmail.com](mailto:brundadr315@gmail.com)

---

## ⭐ Future Improvements

* Authentication & authorization 🔐
* Role-based access control
* Dashboard analytics
* Notification system
