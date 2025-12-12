"use client";

import { useState, useEffect } from "react";
import { Loader2, RefreshCcw, Mail, CheckCircle, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function ContactMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      const json = await res.json();
      if (json.success) {
        setMessages(json.data);
      } else {
        toast.error("Failed to fetch messages");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this message?")) return;
      try {
          const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
          const json = await res.json();
          if (json.success) {
              toast.success("Message deleted");
              setMessages(prev => prev.filter(m => m._id !== id));
          } else {
              toast.error(json.message || "Failed to delete");
          }
      } catch(err) {
          toast.error("Error deleting message");
      }
  };

  const handleMarkRead = async (id: string, currentStatus: boolean) => {
      // Optimistic update
      setMessages(prev => prev.map(m => m._id === id ? { ...m, read: !currentStatus } : m));
      
      try {
           // We'll assume a PATCH endpoint or reuse POST/PUT if defined, but strict REST suggests PATCH. 
           // I'll add PATCH support to the route.
           const res = await fetch(`/api/contact?id=${id}`, { 
               method: "PATCH",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ read: !currentStatus })
           });
           if (!res.ok) throw new Error("Failed to update");
      } catch(err) {
          toast.error("Failed to update status");
          fetchMessages(); // Revert
      }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center bg-white p-4 sticky top-0 z-10 shadow-sm rounded-md">
        <h1 className="text-2xl font-bold text-gray-800">ইনবক্স (মেসেজ)</h1>
        <div className="space-x-2">
            <Button onClick={fetchMessages} variant="outline" size="sm">
            <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            রিফ্রেশ
            </Button>
            {/* Admin Email Info */}
            <Button variant="ghost" size="sm" className="text-xs text-gray-400" disabled>
                 Email Status: {process.env.EMAIL_USER ? "Configured" : "Not Configured (Check .env)"}
            </Button>
        </div>
      </div>

      {loading && messages.length === 0 ? (
         <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-green-600" /></div>
      ) : (
        <div className="space-y-4">
            {messages.length === 0 ? (
                <div className="text-center py-20 text-gray-500">কোনো মেসেজ নেই</div>
            ) : (
                messages.map((msg) => (
                    <div key={msg._id} className={`bg-white p-6 rounded-lg shadow-sm border transition-colors ${msg.read ? 'border-gray-100 opacity-75' : 'border-green-200 bg-green-50/10'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    {msg.subject}
                                    {!msg.read && <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                                    <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {msg.name} ({msg.email})</span>
                                    <span>•</span>
                                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {format(new Date(msg.createdAt), "PPp")}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{msg.phone}</span>
                                <div className="flex space-x-1">
                                    <Button variant="ghost" size="icon" className={msg.read ? "text-gray-400" : "text-green-600"} onClick={() => handleMarkRead(msg._id, msg.read)} title="Mark as Read/Unread">
                                        <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600" onClick={() => handleDelete(msg._id)} title="Delete Message">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">
                            {msg.message}
                        </div>
                    </div>
                ))
            )}
        </div>
      )}
    </div>
  );
}
