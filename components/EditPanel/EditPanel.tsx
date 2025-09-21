import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditPanel() {
  const [fileName, setFileName] = useState("untitled.txt");
  const [content, setContent] = useState("");

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving document:", fileName, content);
  };

  const handleNew = () => {
    setFileName("untitled.txt");
    setContent("");
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Editor</h2>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="filename" className="text-sm font-medium text-gray-700">
            File Name
          </Label>
          <Input
            id="filename"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2 flex-1 flex flex-col">
          <Label htmlFor="content" className="text-sm font-medium text-gray-700">
            Content
          </Label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing your document..."
            className="flex-1 w-full p-3 border border-gray-300 rounded-md resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1 bg-black text-white hover:bg-gray-800">
            Save Document
          </Button>
          <Button onClick={handleNew} variant="outline" className="border-gray-300">
            New
          </Button>
        </div>
      </div>
    </div>
  );
}
