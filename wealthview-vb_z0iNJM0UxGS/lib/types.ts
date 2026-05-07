export interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
  language?: string
  originalText?: string
  isTranslated?: boolean
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  folderId?: string
}

export interface SearchFolder {
  id: string
  name: string
  createdAt: Date
  conversationIds: string[]
  color?: string
}

export interface PiAuthResult {
  accessToken: string
  user: {
    uid: string
    username: string
  }
}

declare global {
  interface Window {
    Pi: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>
      authenticate: (scopes: string[]) => Promise<PiAuthResult>
    }
  }
}
