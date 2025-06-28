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
## 🧠 How It Works

1. 📨 The user uploads a PDF from the frontend.
2. 📁 The backend stores the file on disk.
3. 🔍 The app then parses the PDF and generates a vector index using **LlamaIndex**.
4. 💬 A **chat engine** is created on top of this index, allowing the user to ask questions about the document.

On **startup**, the app:
- Scans the storage directory for existing PDFs
- Automatically parses and re-indexes them
- Makes them available for querying without requiring re-upload

### 📚 Models Used
- 🔤 **Embedding model**: `text-embedding-small-3` (from Azure OpenAI)
- 🤖 **LLM model**: `gpt-4o` (from Azure OpenAI)

These are integrated via LlamaIndex to provide context-aware document Q&A functionality.

---

## 🧱 Architecture Overview

```txt
[Frontend: React]
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
