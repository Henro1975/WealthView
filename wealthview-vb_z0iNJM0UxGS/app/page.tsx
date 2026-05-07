"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, User, Bot } from "lucide-react"
import { useChatbot } from "@/hooks/use-chatbot"
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom"
import { APP_CONFIG, COLORS } from "@/lib/app-config"
import { OliveLogo } from "@/components/olive-logo"
import { LanguageSelector } from "@/components/language-selector"
import { useConversationStorage } from "@/hooks/use-conversation-storage"
import { ConversationSidebar } from "@/components/conversation-sidebar"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ChatBot() {
  const {
    messages,
    input,
    isLoading,
    isAuthenticated,
    authMessage,
    selectedLanguage,
    setSelectedLanguage,
    sendMessage,
    handleKeyPress,
    handleInputChange,
    loadMessages,
    clearChat,
  } = useChatbot()

  const {
    conversations,
    folders,
    createConversation,
    updateConversation,
    deleteConversation,
    createFolder,
    updateFolder,
    deleteFolder,
    moveConversationToFolder,
  } = useConversationStorage()

  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [conversationTitle, setConversationTitle] = useState("")

  const { bottomRef } = useScrollToBottom([messages])

  const handleSaveCurrentChat = () => {
    if (messages.length > 1) {
      setShowSaveDialog(true)
      // Auto-generate title from first user message
      const firstUserMessage = messages.find((m) => m.sender === "user")
      if (firstUserMessage) {
        setConversationTitle(firstUserMessage.text.slice(0, 50) + (firstUserMessage.text.length > 50 ? "..." : ""))
      }
    }
  }

  const handleConfirmSave = () => {
    if (conversationTitle.trim()) {
      createConversation(conversationTitle.trim(), messages)
      setShowSaveDialog(false)
      setConversationTitle("")
    }
  }

  const handleLoadConversation = (conversation: any) => {
    loadMessages(conversation.messages)
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-white/95 z-50 flex flex-col items-center justify-center">
        <OliveLogo className="w-16 h-16 mb-4" />
        <div className="text-xl font-semibold mb-4">{APP_CONFIG.NAME}</div>
        <div className="text-lg mb-4">{authMessage}</div>
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderBottomColor: COLORS.PRIMARY }}
        ></div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: COLORS.BACKGROUND }}>
      <ConversationSidebar
        conversations={conversations}
        folders={folders}
        onCreateFolder={createFolder}
        onDeleteFolder={deleteFolder}
        onUpdateFolder={updateFolder}
        onLoadConversation={handleLoadConversation}
        onDeleteConversation={deleteConversation}
        onMoveToFolder={moveConversationToFolder}
        onSaveCurrentChat={handleSaveCurrentChat}
      />

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Conversation</DialogTitle>
            <DialogDescription>Give this conversation a title to save it for later reference.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Enter conversation title"
            value={conversationTitle}
            onChange={(e) => setConversationTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleConfirmSave()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave} style={{ backgroundColor: COLORS.PRIMARY }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full max-w-md h-[600px] flex flex-col shadow-xl">
        <CardHeader className="text-white rounded-t-lg" style={{ backgroundColor: COLORS.PRIMARY }}>
          <CardTitle className="text-center">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10" />
              <div className="flex items-center gap-2">
                <OliveLogo className="w-10 h-10" />
              </div>
              <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
            </div>
            <div className="text-xl font-semibold">{APP_CONFIG.NAME}</div>
            {APP_CONFIG.DESCRIPTION && <div className="text-sm opacity-90 mt-1">{APP_CONFIG.DESCRIPTION}</div>}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                  message.sender === "user" ? "bg-gray-600" : ""
                }`}
                style={message.sender === "user" ? { backgroundColor: "#4b5563" } : { backgroundColor: COLORS.PRIMARY }}
              >
                {message.sender === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div
                className={`max-w-[70%] p-3 rounded-2xl ${
                  message.sender === "user"
                    ? "text-white"
                    : message.id === "thinking"
                      ? "bg-gray-100 text-gray-600 italic"
                      : "bg-gray-100 text-gray-800"
                }`}
                style={message.sender === "user" ? { backgroundColor: COLORS.PRIMARY } : {}}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
                {message.isTranslated && <div className="text-xs opacity-60 mt-1 italic">Translated</div>}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </CardContent>

        <CardFooter className="p-4 border-t">
          <div className="flex w-full gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 border-2"
              style={{
                borderColor: "#e5e7eb",
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="p-2 hover:opacity-90"
              style={{
                backgroundColor: COLORS.PRIMARY,
              }}
              size="icon"
            >
              <Send size={16} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
