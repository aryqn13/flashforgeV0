"use server"

interface Flashcard {
  id: string
  question: string
  answer: string
  type: "basic" | "multiple-choice" | "fill-blank"
  options?: string[]
  correctOption?: number
}

export async function generateFlashcards(notes: string): Promise<Flashcard[]> {
  try {
    if (!notes || notes.trim() === "") {
      throw new Error("Please provide some study notes to generate flashcards.")
    }

    // Limit the input size to prevent very large requests
    const limitedNotes = notes.slice(0, 10000)

    const prompt = `
      Generate flashcards from the following study notes. Create a mix of different card types:
      - Basic question and answer
      - Multiple choice questions with 4 options
      - Fill in the blank questions
      
      For each flashcard, extract key concepts and create effective questions that test understanding.
      
      Study notes:
      ${limitedNotes}
      
      Return the flashcards as a JSON array with the following structure:
      [
        {
          "id": "unique-id",
          "question": "Question text",
          "answer": "Answer text",
          "type": "basic" | "multiple-choice" | "fill-blank",
          "options": ["Option A", "Option B", "Option C", "Option D"], // Only for multiple-choice
          "correctOption": 0 // Index of correct option, only for multiple-choice
        }
      ]
      
      Generate 5-10 flashcards depending on the content length.
    `

    // In a production environment, you would use:
    // const { text } = await generateText({
    //   model: openai("gpt-4o"),
    //   prompt: prompt,
    //   temperature: 0.7,
    //   maxTokens: 2000,
    // });
    // return JSON.parse(text);

    // For demonstration purposes, we'll return mock data
    // This simulates the AI response
    return generateMockFlashcards(limitedNotes)
  } catch (error) {
    console.error("Error generating flashcards:", error)
    throw new Error("Failed to generate flashcards. Please try again later.")
  }
}

// Helper function to generate mock flashcards based on input text
function generateMockFlashcards(text: string): Flashcard[] {
  // Extract some words from the text to make the mock data more relevant
  const words = text.split(/\s+/).filter((word) => word.length > 4)
  const uniqueWords = [...new Set(words)].slice(0, 20)

  // Generate some basic flashcards
  const cards: Flashcard[] = [
    {
      id: "card-1",
      question: "What is the capital of France?",
      answer: "Paris",
      type: "basic",
    },
    {
      id: "card-2",
      question: "Which of the following is NOT a primary color?",
      answer: "Green is a secondary color formed by mixing blue and yellow.",
      type: "multiple-choice",
      options: ["Red", "Blue", "Green", "Yellow"],
      correctOption: 2,
    },
    {
      id: "card-3",
      question: "The process of plants making their own food using sunlight is called _______.",
      answer: "photosynthesis",
      type: "fill-blank",
    },
  ]

  // Add some cards based on the input text
  if (uniqueWords.length >= 5) {
    cards.push({
      id: "card-4",
      question: `What is the significance of "${uniqueWords[0]}" in the context of the study material?`,
      answer: `"${uniqueWords[0]}" is an important concept that relates to the main themes discussed in the material.`,
      type: "basic",
    })

    cards.push({
      id: "card-5",
      question: `Which of the following terms is most closely related to "${uniqueWords[1]}"?`,
      answer: `"${uniqueWords[2]}" is most closely related to "${uniqueWords[1]}" as they both address similar concepts.`,
      type: "multiple-choice",
      options: [uniqueWords[2], uniqueWords[3], uniqueWords[4], "None of the above"],
      correctOption: 0,
    })
  }

  return cards
}

