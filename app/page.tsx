"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, RefreshCw, MessageSquareIcon as MessageSquareQuestion, Plus } from "lucide-react"

export default function QuestionPage() {
  const [topic, setTopic] = useState<string>("")
  const [isTopicInputVisible, setIsTopicInputVisible] = useState<boolean>(false)
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null)
  const [questionToDisplay, setQuestionToDisplay] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const topicInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isTopicInputVisible && topicInputRef.current) {
      // Delay focus slightly to allow for CSS transition to complete
      const timer = setTimeout(() => {
        topicInputRef.current?.focus()
      }, 350) // Adjust timing if your transition duration changes
      return () => clearTimeout(timer)
    }
  }, [isTopicInputVisible])

  const fetchQuestion = async () => {
    setIsLoading(true)
    setError(null)

    if (questionToDisplay) {
      // Start fade-out for the old question
      setQuestionToDisplay(null)
      // Wait for fade-out animation to complete before fetching new question
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topic || undefined }), // Send topic only if it's not empty
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error: ${response.status}`)
      }

      const data = await response.json()
      setCurrentQuestion(data.question)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred.")
      }
      setCurrentQuestion(null) // Clear question on error
    } finally {
      setIsLoading(false)
    }
  }

  // Effect to handle fade-in of new question
  useEffect(() => {
    if (currentQuestion) {
      // This timeout ensures that if there was a fade-out,
      // the new question fades in after the old one is visually gone.
      // If no old question, it just fades in.
      const timer = setTimeout(
        () => {
          setQuestionToDisplay(currentQuestion)
        },
        questionToDisplay === null && currentQuestion !== null ? 50 : 0,
      ) // Small delay if it's not the first question
      return () => clearTimeout(timer)
    }
  }, [currentQuestion])

  const handleGeneratePress = () => {
    fetchQuestion()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <MessageSquareQuestion className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Question of the Day</CardTitle>
          <CardDescription className="text-md">Spark a conversation with your team!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center w-full space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Select Topic</span>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8 flex-shrink-0"
              onClick={() => {
                setIsTopicInputVisible(!isTopicInputVisible)
              }}
              aria-expanded={isTopicInputVisible}
              aria-label={isTopicInputVisible ? "Hide topic input" : "Show topic input"}
            >
              <Plus
                className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                  isTopicInputVisible ? "rotate-45" : "rotate-0"
                }`}
              />
            </Button>
            <div
              className={`flex-grow transition-all duration-300 ease-in-out overflow-hidden flex items-center ${
                isTopicInputVisible ? "max-w-xs opacity-100 ml-1" : "max-w-0 opacity-0"
              }`}
            >
              <Input
                ref={topicInputRef}
                type="text"
                placeholder="E.g., 'teamwork'"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-10" // Ensure input has a defined height for smooth transition
                aria-label="Question topic"
              />
            </div>
          </div>

          <Button onClick={handleGeneratePress} disabled={isLoading} className="w-full text-lg py-6" size="lg">
            {isLoading && !questionToDisplay ? ( // Show loader only if no question is currently displayed and loading
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            {currentQuestion ? "Generate New Question" : "Generate Question"}
          </Button>

          {error && <p className="text-center text-red-500 dark:text-red-400">{error}</p>}

          <div className="min-h-[120px] flex items-center justify-center">
            {isLoading && !questionToDisplay && (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Generating your question...</p>
              </div>
            )}
            {!isLoading && !questionToDisplay && !error && !currentQuestion && (
              <p className="text-center text-gray-500 dark:text-gray-400">Click "Generate Question" to start.</p>
            )}
            <div
              className={`transition-opacity duration-500 ease-in-out w-full ${
                questionToDisplay ? "opacity-100" : "opacity-0"
              }`}
            >
              {questionToDisplay && (
                <div className="text-center p-6 bg-slate-100 dark:bg-slate-800 rounded-lg shadow">
                  <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {questionToDisplay}
                  </p>
                  <div className="mt-6 flex justify-center">
                    <Button
                      onClick={handleGeneratePress}
                      variant="outline"
                      size="icon"
                      aria-label="Generate new question"
                      disabled={isLoading}
                      className="rounded-full"
                    >
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Powered by Vercel AI SDK</p>
      </footer>
    </div>
  )
}
