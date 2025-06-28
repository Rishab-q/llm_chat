from http import client
from importlib import metadata
from operator import index
import os
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, UploadFile, Depends,File,Body,staticfiles
import fitz
from regex import D
from sympy import im, per
from mode import Pdfs, get_db,Base,engine
from sqlalchemy.orm import Session
from llama_index.core import VectorStoreIndex, Document,Settings,SimpleDirectoryReader
from llama_index.llms.azure_openai import AzureOpenAI
from llama_index.embeddings.azure_openai import AzureOpenAIEmbedding
import shutil
app=FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.on_event("startup")
def startup_event():
    
    
    Base.metadata.create_all(bind=engine)
    Settings.llm = AzureOpenAI(
        api_version=os.getenv("LLM_API_VERSION"),
        azure_endpoint=os.getenv("LLM_API_BASE"),
        api_key=os.getenv("LLM_API_KEY"),
        engine="gpt-4o",

    )

    Settings.embed_model = AzureOpenAIEmbedding(
        api_version=os.getenv("EMBEDDING_API_VERSION"),
        azure_endpoint=os.getenv("EMBEDDING_API_BASE"),
        api_key=os.getenv("EMBEDDING_API_KEY"),
        deployment_name="text-embedding-3-small",
        model="text-embedding-3-small",
    )
    if os.path.exists("uploads") and os.listdir("uploads"):
        docs = SimpleDirectoryReader("uploads").load_data()
    else:
        docs = []
    app.state.index = VectorStoreIndex.from_documents(docs)
    app.state.chat_engine = app.state.index.as_chat_engine(chat_mode="condense_question")
    

@app.post("/upload")
def Upload(File: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        
        file_path=os.path.join(UPLOAD_DIR, File.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(File.file, f)
        pdf_document = fitz.open(file_path)
        extracted_text = ""
        for page in pdf_document:
            extracted_text += page.get_text()
        pdf_document.close()
        
        doc=Document(text=extracted_text,metadata={"filename": File.filename})
        # Add the document to the index
        app.state.index.insert(doc)
        app.state.chat_engine = app.state.index.as_chat_engine(chat_mode="condense_question")
       
        
        pdf_record = Pdfs(filename=File.filename, extracted_text=extracted_text)
        db.add(pdf_record)
        db.commit()
        db.refresh(pdf_record)
        
        return {"filename": File.filename, "id": pdf_record.id}
    except Exception as e:
        return {"error": e.__str__()}
    
@app.post("/ask")
def Ask(questions:str=Body(...),db:Session=Depends(get_db)):
    doc_ids = app.state.index.docstore.docs.keys()
    print(list(doc_ids))  # All doc IDs in the index

    
    response = app.state.chat_engine.chat(questions)
    print(response.response)
    return {"response": response.response}

app.mount("/", staticfiles.StaticFiles(directory="frontend/dist", html=True), name="static")


    
    
    
    
   