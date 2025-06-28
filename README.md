# 📄 Document Q&A App with LlamaIndex and FastAPI

This is a full-stack application that enables users to upload PDFs and ask questions based on their content. The project uses **LlamaIndex** for document indexing and retrieval, **FastAPI** for the backend, and **React.js** on the frontend.

---

## 🚀 Features

- 📤 Upload PDFs via the frontend
- 🧠 Ask questions about the document contents
- ⚡ Real-time responses from a powerful LLM using [LlamaIndex]
- 🗃️ Metadata stored in SQLite/PostgreSQL
- 📁 Document storage on local disk or cloud (e.g., S3)

---

## 🏗️ Tech Stack

### Backend
- **FastAPI**
- **LlamaIndex**
- **PostgreSQL/SQLite**
- **Uvicorn**

### Frontend
- **React.js** with [Vite](https://vitejs.dev/)
- **TailwindCSS** and [shadcn/ui](https://ui.shadcn.com/)

---

## 🧱 Architecture Overview

```txt
[Frontend: React + Clerk]
       |
       v
[FastAPI Backend]
  |      |       |
  |   [Vector Store (LlamaIndex)(In memory]
  |   [PostgreSQL (Doc metadata)]
  |   [Local/Cloud File Storage]
  |
  v
[OpenAI / LLM API]
