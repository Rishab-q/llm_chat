# 📄 Document Q&A App with LlamaIndex and FastAPI

This is a full-stack application that enables users to upload PDFs and ask questions based on their content. The project uses **LlamaIndex** for document indexing and retrieval, **FastAPI** for the backend, and **React.js** with **Clerk** authentication on the frontend.

---

## 🚀 Features

- 🔐 User authentication with [Clerk](https://clerk.dev)
- 📤 Upload PDFs via the frontend
- 🧠 Ask questions about the document contents
- ⚡ Real-time responses from a powerful LLM using [LlamaIndex](https://github.com/jerryjliu/llama_index)
- 🗃️ Metadata stored in SQLite/PostgreSQL
- 📁 Document storage on local disk or cloud (e.g., S3)

---

## 🏗️ Tech Stack

### Backend
- **FastAPI**
- **LlamaIndex**
- **LangChain** (optional/alternative for LLM pipelines)
- **Tesseract** (optional OCR for scanned PDFs)
- **PostgreSQL/SQLite**
- **Pydantic**
- **Uvicorn**

### Frontend
- **React.js** with [Vite](https://vitejs.dev/)
- **TailwindCSS** and [shadcn/ui](https://ui.shadcn.com/)
- **Clerk** for auth
- **Axios** or Fetch API for making API calls

---

## 🧱 Architecture Overview

```txt
[Frontend: React + Clerk]
       |
       v
[FastAPI Backend]
  |      |       |
  |   [Vector Store (LlamaIndex)]
  |   [PostgreSQL (Doc metadata)]
  |   [Local/Cloud File Storage]
  |
  v
[OpenAI / LLM API]
