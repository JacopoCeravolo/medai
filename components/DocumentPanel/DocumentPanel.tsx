export function DocumentPanel() {
  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Document Viewer</h2>
      </div>
      
      {/* Document Content */}
      <div className="flex-1 p-4">
        <div className="h-full bg-gray-50 rounded-md p-4">
          <div className="text-gray-600 text-sm mb-4">
            Current Document: untitled.txt
          </div>
          <div className="font-mono text-sm leading-relaxed text-gray-800">
            <p>Welcome to your document editor!</p>
            <p className="mt-2">This is the main document viewing area where you can see your content.</p>
            <p className="mt-2">Select a document from the history panel or create a new one in the edit panel.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
