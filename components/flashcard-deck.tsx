"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface Flashcard {
  id: string
  question: string
  answer: string
  type: "basic" | "multiple-choice" | "fill-blank"
  options?: string[]
  correctOption?: number
}

interface FlashcardDeckProps {
  flashcards: Flashcard[]
}

export function FlashcardDeck({ flashcards }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const currentCard = flashcards[currentIndex]

  const handleNext = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1))
  }

  const handlePrevious = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1))
  }

  const handleFlip = () => {
    setFlipped((prev) => !prev)
  }

  if (!currentCard) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-center text-muted-foreground">No flashcards available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-full">
        <Card
          className={cn(
            "w-full cursor-pointer transition-all duration-500 transform-gpu",
            flipped ? "[transform:rotateY(180deg)]" : "",
          )}
          onClick={handleFlip}
        >
          <div className="relative min-h-[300px] perspective-1000">
            <CardContent
              className={cn(
                "absolute w-full h-full backface-hidden p-6 flex flex-col items-center justify-center text-center",
                flipped ? "invisible" : "visible",
              )}
            >
              <div className="absolute top-4 left-4 text-xs font-medium text-muted-foreground">
                Card {currentIndex + 1} of {flashcards.length}
              </div>
              <div className="absolute top-4 right-4 text-xs font-medium text-muted-foreground">
                {currentCard.type === "basic"
                  ? "Basic"
                  : currentCard.type === "multiple-choice"
                    ? "Multiple Choice"
                    : "Fill in the Blank"}
              </div>
              <h3 className="text-xl font-semibold mb-4">{currentCard.question}</h3>
              {currentCard.type === "multiple-choice" && currentCard.options && (
                <div className="grid gap-2 w-full max-w-md">
                  {currentCard.options.map((option, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 border rounded-md">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-sm font-medium">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-4 text-sm text-muted-foreground">Click to reveal answer</p>
            </CardContent>
            <CardContent
              className={cn(
                "absolute w-full h-full backface-hidden p-6 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)]",
                flipped ? "visible" : "invisible",
              )}
            >
              <h3 className="text-xl font-semibold mb-4 text-primary">Answer</h3>
              <p className="text-lg">{currentCard.answer}</p>
              {currentCard.type === "multiple-choice" && typeof currentCard.correctOption === "number" && (
                <div className="mt-4 font-medium">
                  Correct option: {String.fromCharCode(65 + currentCard.correctOption)}
                </div>
              )}
              <p className="mt-4 text-sm text-muted-foreground">Click to see question</p>
            </CardContent>
          </div>
        </Card>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setFlipped((prev) => !prev)}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

