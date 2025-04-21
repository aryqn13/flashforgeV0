"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, FileText, Loader2, Save, Sparkles } from "lucide-react"
import Link from "next/link"
import { FlashcardDeck } from "@/components/flashcard-deck"
import { generateFlashcards } from "@/lib/actions"
import { FileUploader } from "@/components/file-uploader"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

export default function CreatePage() {
  const [notes, setNotes] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [flashcards, setFlashcards] = useState([])
  const [activeTab, setActiveTab] = useState("input")
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!notes.trim()) {
      setError("Please enter some study notes or upload a document first.")
      return
    }

    setError("")
    setIsGenerating(true)
    try {
      const generatedCards = await generateFlashcards(notes)

      if (generatedCards.length === 0) {
        throw new Error("No flashcards could be generated. Please try with different content.")
      }

      setFlashcards(generatedCards)
      setActiveTab("review")
      toast({
        title: "Flashcards generated!",
        description: `Created ${generatedCards.length} flashcards from your notes.`,
      })
    } catch (error) {
      console.error("Failed to generate flashcards:", error)
      setError(error.message || "Failed to generate flashcards. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileContent = (content) => {
    setNotes(content)
    toast({
      title: "Document uploaded",
      description: "Your document has been processed and is ready for flashcard generation.",
    })
  }

  const handleSaveDeck = () => {
    if (flashcards.length === 0) return

    // In a real app, this would save to a database
    const deckData = JSON.stringify(flashcards)
    const blob = new Blob([deckData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "flashforge-deck.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Deck saved!",
      description: "Your flashcards have been saved to your device.",
    })
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>FlashForge</span>
          </Link>
        </div>
        <Button variant="outline" size="sm" disabled={flashcards.length === 0} onClick={handleSaveDeck}>
          <Save className="mr-2 h-4 w-4" />
          Save Deck
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Input Notes</TabsTrigger>
          <TabsTrigger value="review" disabled={flashcards.length === 0}>
            Review Flashcards
          </TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="mt-6">
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Flashcards</h1>
              <p className="text-muted-foreground mt-2">
                Paste your study notes below or upload a document, and our AI will transform them into effective
                flashcards.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h2 className="text-lg font-medium mb-2">Upload Document</h2>
                <FileUploader onContentExtracted={handleFileContent} />
              </div>
              <div>
                <h2 className="text-lg font-medium mb-2">Or Enter Text</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Supported formats: PDF, DOCX, TXT</span>
                </div>
              </div>
            </div>

            <Textarea
              placeholder="Paste your study notes here..."
              className="min-h-[300px] p-4 text-base"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handleGenerate} disabled={!notes.trim() || isGenerating} className="w-full sm:w-auto">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Flashcards
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="review" className="mt-6">
          <div className="grid gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Review Flashcards</h1>
              <p className="text-muted-foreground mt-2">
                Here are your AI-generated flashcards. Flip them to see the answers.
              </p>
            </div>
            {flashcards.length > 0 ? (
              <FlashcardDeck flashcards={flashcards} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No flashcards generated yet.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("input")}>
                    Go to Input
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

