import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, Loader2, MapPin, Plus, BookmarkPlus, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Location } from "@/lib/types";
import { useLocation } from "wouter";
import { useLocations } from "@/hooks/useLocations";
import { Link } from "wouter";

interface MentionedLocation {
  name: string;
  state: string;
  id: number;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  mentionedLocations?: MentionedLocation[];
}

// Helper function to clean AI responses
const cleanAIResponse = (text: string): string => {
  // Remove ```html and ``` markers from the beginning and end
  let cleaned = text.replace(/^```html\n|\n```$/g, '');
  // Also remove ```html that might be without newlines
  cleaned = cleaned.replace(/^```html/, '');
  // Remove any DOCTYPE, html, body tags if present
  cleaned = cleaned.replace(/<!DOCTYPE[^>]*>|<\/?html[^>]*>|<\/?body[^>]*>/g, '');
  return cleaned.trim();
};

interface AIChatbotProps {
  compareLocations?: Location[];
}

export default function AIChatbot({ compareLocations }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your CBP relocation assistant. Ask me anything about locations or relocation factors, and I'll help you find the information you need.",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [, setLocation] = useLocation();
  const { addToCompare, isInCompare } = useLocations();

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: generateId(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      // Prepare location IDs for comparison context if available
      const locationIds = compareLocations?.map(loc => loc.id) || [];
      
      // Send query to AI service
      const response = await axios.post("/api/ai/chat", {
        query: input,
        locationIds
      });
      
      // Add AI response to chat - clean the response first and include mentioned locations
      const aiMessage: Message = {
        id: generateId(),
        text: cleanAIResponse(response.data.response),
        sender: "ai",
        timestamp: new Date(),
        mentionedLocations: response.data.mentionedLocations || []
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  // Handle adding a location to comparison
  const handleAddToCompare = (locationId: number) => {
    addToCompare(locationId);
  };
  
  // Handle viewing a location's details
  const handleViewLocation = (locationId: number) => {
    setLocation(`/location/${locationId}`);
  };

  return (
    <Card className="w-full md:max-w-4xl mx-auto shadow-lg border-t-4 border-t-primary flex flex-col h-[650px] overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-2 bg-white">
            <AvatarImage src="/img/cbp-logo.png" alt="CBP Logo" />
            <AvatarFallback><Bot size={20} /></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>CBP Relocation Assistant</CardTitle>
            <CardDescription>
              Ask questions about locations, housing, or relocation factors
              {compareLocations && compareLocations.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-xs text-muted-foreground mr-1">Comparing:</span>
                  {compareLocations.map(location => (
                    <Badge key={location.id} variant="outline" className="text-xs">
                      {location.name}, {location.state}
                    </Badge>
                  ))}
                </div>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="flex-grow overflow-hidden pt-4">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${message.sender === "user" ? "max-w-[80%]" : "max-w-[95%] overflow-x-auto"} rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.sender === "ai" ? (
                    <>
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-table:w-full prose-table:my-2 prose-table:overflow-x-auto" dangerouslySetInnerHTML={{ __html: message.text }} />
                      
                      {/* Show recommended locations if any */}
                      {message.mentionedLocations && message.mentionedLocations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-medium mb-2">Mentioned Locations:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.mentionedLocations.map(location => (
                              <div key={location.id} className="flex gap-1 items-center bg-white rounded-lg border border-gray-200 p-1.5 shadow-sm">
                                <MapPin size={12} className="text-primary" />
                                <span className="text-xs font-medium">{location.name}, {location.state}</span>
                                <div className="flex gap-1 ml-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6" 
                                    title="Add to comparison"
                                    onClick={() => handleAddToCompare(location.id)}
                                    disabled={isInCompare(location.id)}
                                  >
                                    <Plus size={12} className={isInCompare(location.id) ? "text-muted-foreground" : "text-primary"} />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6" 
                                    title="View location details"
                                    onClick={() => handleViewLocation(location.id)}
                                  >
                                    <ExternalLink size={12} className="text-primary" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-muted flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="pt-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex w-full items-end gap-2"
        >
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about housing, schools, cost of living, climate..."
            className="min-h-10 flex-1 resize-none"
            rows={1}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={loading || !input.trim()}
          >
            <Send size={16} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}