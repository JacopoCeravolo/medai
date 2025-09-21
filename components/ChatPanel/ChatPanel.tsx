import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown, Send } from "lucide-react";

interface ChatPanelProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export function ChatPanel({ isExpanded, onToggleExpanded }: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ id: string; text: string; sender: "user" | "ai" }>
  >([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user" as const,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Simulate AI response (you can replace this with actual AI integration)
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: "Ciao! Come posso aiutarti con il tuo documento?",
        sender: "ai" as const,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-t">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-50 h-20 flex-shrink-0"
        onClick={onToggleExpanded}
      >
        <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scrivi un messaggio..."
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
