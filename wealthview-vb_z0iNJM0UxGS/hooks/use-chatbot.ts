"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { Message } from "@/lib/types"
import { usePiNetworkAuthentication } from "./use-pi-network-authentication"
import { APP_CONFIG, BACKEND_URLS } from "@/lib/app-config"
import { type LanguageCode, detectLanguage, translateText } from "@/lib/languages"

// Helper function to create messages
const createMessage = (text: Message["text"], sender: Message["sender"], id?: Message["id"]): Message => ({
  id: id || Date.now().toString(),
  text,
  sender,
  timestamp: new Date(),
})

export const useChatbot = () => {
  const { isAuthenticated, authMessage, piAccessToken } = usePiNetworkAuthentication()

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en")

  const [messages, setMessages] = useState<Message[]>([createMessage(APP_CONFIG.WELCOME_MESSAGE, "ai", "1")])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const translateWelcomeMessage = async () => {
      if (selectedLanguage !== "en") {
        const translatedText = await translateText(APP_CONFIG.WELCOME_MESSAGE, "en", selectedLanguage)
        setMessages([
          {
            ...createMessage(translatedText, "ai", "1"),
            language: selectedLanguage,
            originalText: APP_CONFIG.WELCOME_MESSAGE,
            isTranslated: true,
          },
        ])
      } else {
        setMessages([createMessage(APP_CONFIG.WELCOME_MESSAGE, "ai", "1")])
      }
    }
    translateWelcomeMessage()
  }, [selectedLanguage])

  const showThinking = () => {
    const thinkingMessage = createMessage("Thinking... (0)", "ai", "thinking")
    setMessages((prev) => [...prev, thinkingMessage])

    let seconds = 0
    thinkingTimerRef.current = setInterval(() => {
      seconds += 1
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === "thinking" ? { ...msg, text: `Thinking... (${seconds})` } : msg)),
      )
    }, 1000)
  }

  const hideThinking = () => {
    if (thinkingTimerRef.current) {
      clearInterval(thinkingTimerRef.current)
      thinkingTimerRef.current = null
    }
    setMessages((prev) => prev.filter((msg) => msg.id !== "thinking"))
  }

  const sendMessage = async () => {
    if (!piAccessToken || !input.trim()) return

    const detectedLanguage = detectLanguage(input.trim())
    const userMessage: Message = {
      ...createMessage(input.trim(), "user"),
      language: detectedLanguage,
    }

    setMessages((prev) => [...prev, userMessage])

    let messageToSend = userMessage.text
    if (detectedLanguage !== "en") {
      messageToSend = await translateText(userMessage.text, detectedLanguage, "en")
    }

    setInput("")
    setIsLoading(true)

    showThinking()

    try {
      const response = await fetch(BACKEND_URLS.CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: piAccessToken,
        },
        body: JSON.stringify({ message: messageToSend }),
      })

      hideThinking()

      if (response.status === 429) {
        const errorData = await response.json()
        const errorText =
          errorData.error_type === "daily_limit_exceeded"
            ? errorData.error
            : "Too many requests. Please try again later."

        const translatedError =
          selectedLanguage !== "en" ? await translateText(errorText, "en", selectedLanguage) : errorText

        const errorMessage: Message = {
          ...createMessage(translatedError, "ai"),
          language: selectedLanguage,
          originalText: errorText,
          isTranslated: selectedLanguage !== "en",
        }
        setMessages((prev) => [...prev, errorMessage])
        return
      }

      const data = await response.json()

      if (data.messages && Array.isArray(data.messages)) {
        const aiMsg = data.messages.reverse().find((m: any) => m.sender === "ai")
        const aiResponseText = aiMsg ? aiMsg.text : "No AI response received."

        const translatedResponse =
          selectedLanguage !== "en" ? await translateText(aiResponseText, "en", selectedLanguage) : aiResponseText

        const botMessage: Message = {
          ...createMessage(translatedResponse, "ai"),
          language: selectedLanguage,
          originalText: aiResponseText,
          isTranslated: selectedLanguage !== "en",
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        const errorText = "No response from backend."
        const translatedError =
          selectedLanguage !== "en" ? await translateText(errorText, "en", selectedLanguage) : errorText

        const errorMessage: Message = {
          ...createMessage(translatedError, "ai"),
          language: selectedLanguage,
          originalText: errorText,
          isTranslated: selectedLanguage !== "en",
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      hideThinking()
      const errorText = "Error contacting backend."
      const translatedError =
        selectedLanguage !== "en" ? await translateText(errorText, "en", selectedLanguage) : errorText

      const errorMessage: Message = {
        ...createMessage(translatedError, "ai"),
        language: selectedLanguage,
        originalText: errorText,
        isTranslated: selectedLanguage !== "en",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const loadMessages = (messages: Message[]) => {
    setMessages(messages)
  }

  const clearChat = () => {
    setMessages([createMessage(APP_CONFIG.WELCOME_MESSAGE, "ai", "1")])
  }

  // Cleanup function
  useEffect(() => {
    return () => {
      if (thinkingTimerRef.current) {
        clearInterval(thinkingTimerRef.current)
      }
    }
  }, [])

  return {
    // State
    messages,
    input,
    isLoading,
    isAuthenticated,
    authMessage,
    selectedLanguage,
    setSelectedLanguage,

    // Actions
    sendMessage,
    handleKeyPress,
    handleInputChange,
    loadMessages,
    clearChat,
  }
}
