"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, File, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { extractTextFromFile } from "@/lib/document-parser"

interface FileUploaderProps {
  onContentExtracted: (content: string) => void
}

export function FileUploader({ onContentExtracted }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const processFile = async (file) => {
    setError("")
    setIsProcessing(true)
    setProgress(10)

    try {
      // Check file type
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]

      if (!validTypes.includes(file.type)) {
        throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT file.")
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File is too large. Maximum size is 10MB.")
      }

      setProgress(30)

      // Extract text from file
      const text = await extractTextFromFile(file)

      setProgress(90)

      if (!text || text.trim() === "") {
        throw new Error("Could not extract text from the file. Please try another file or paste your notes directly.")
      }

      // Pass the extracted text to the parent component
      onContentExtracted(text)

      setProgress(100)
    } catch (err) {
      console.error("Error processing file:", err)
      setError(err.message || "Failed to process file. Please try again.")
    } finally {
      setIsProcessing(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="w-full">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
        className="hidden"
      />

      <Card
        className={`border-2 border-dashed ${
          isDragging ? "border-primary" : "border-muted-foreground/25"
        } hover:border-primary/50 transition-colors cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Upload className="h-6 w-6 text-primary" />
          </div>

          {isProcessing ? (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-center gap-2">
                <File className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Processing document...</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          ) : (
            <>
              <p className="font-medium mb-1">Upload a document</p>
              <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

