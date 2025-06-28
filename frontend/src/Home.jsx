import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip } from "lucide-react";
import { toast } from "sonner";

const LOCAL_KEY = "chat-messages";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const isFirstLoad = useRef(true);
  const scrollRef = useRef(null);

  

  
  // Load messages on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    console.log("Stored messages:", stored);
    if (stored) 
      try {
        setMessages(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse messages from localStorage", error);
      }
  }, []);

useEffect(() => {
  if (isFirstLoad.current) {
    isFirstLoad.current = false;
    return;
  }

  // ✅ Now it's safe to save updated messages
  localStorage.setItem(LOCAL_KEY, JSON.stringify(messages));

  scrollRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  const handleSend = async () => {
    if (!input.trim()) {
      toast.warning("Message cannot be empty");
      return;
    }
    const userMsg = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    console.log("messages", messages);
    setInput("");
    

    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: input.trim(),
      });

      const reply = await res.json(); // Use `res.json()` if server returns JSON

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply.response  },
      ]);
      console.log(messages);
      
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported.");
      return;
    }

    const loadingMsg = {
      role: "user",
      text: `Uploading file: ${file.name}...`,
      loading: true,
    };
    setMessages((prev) => [...prev, loadingMsg]);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("File", file);

    try {
      const res = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json(); // or res.json() if needed

      // Replace loading message
      setMessages((prev) => [
        ...prev.slice(0, -1), // remove last
        {
          role: "user",
          text: `📄 Uploaded file: ${file.name}`,
        },
        {
          role: "assistant",
          text: "File uploaded successfully.",
        },
      ]);
    } catch (err) {
      toast.error("File upload failed");
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          text: "❌ Failed to upload file.",
        },
      ]);
    } finally {
      setIsUploading(false);
    }
    
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isUploading) handleSend();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (<>
    <header className="bg-white shadow-md p-4">
      <h1 className="text-2xl font-bold text-center">UPLOAD AND ASK</h1>
    </header>
    <Card className="w-full max-w-full mx-auto p-4 rounded-2xl shadow-xl h-[80vh] flex flex-col">
      <CardContent className="flex flex-col flex-1 overflow-hidden p-0">
        <ScrollArea  className="flex-1 px-2 space-y-3 overflow-y-auto hide-scrollbar">
          
        
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[75%] p-3 rounded-xl p-3 m-4 font-bold shadow-md ${
                  msg.role === "user"
                    ? "!bg-white !text-black justify-end"
                    : "!bg-black text-white justify-start"
                }`}
              >
        <CardContent className="!p-0 text-sm whitespace-pre-wrap text-left">
          {msg.text}
        </CardContent>
    </Card>
  </div>
))}
        <div ref={scrollRef} />

        
      </ScrollArea>

        {/* Hidden file input */}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            onClick={triggerFileInput}
            variant="outline"
            className="rounded-xl px-3"
            disabled={isUploading}
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-xl"
            disabled={isUploading}
          />

          <Button
            onClick={handleSend}
            className="rounded-xl px-3"
            disabled={!input.trim() || isUploading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
    </>
  );
}
