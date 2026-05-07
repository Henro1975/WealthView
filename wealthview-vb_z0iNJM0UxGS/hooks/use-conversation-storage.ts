"use client"

import { useState, useEffect } from "react"
import type { Conversation, SearchFolder, Message } from "@/lib/types"

const STORAGE_KEYS = {
  CONVERSATIONS: "wealthview_conversations",
  FOLDERS: "wealthview_folders",
} as const

export const useConversationStorage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [folders, setFolders] = useState<SearchFolder[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedConversations = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)
        const savedFolders = localStorage.getItem(STORAGE_KEYS.FOLDERS)

        if (savedConversations) {
          const parsed = JSON.parse(savedConversations)
          // Convert date strings back to Date objects
          const withDates = parsed.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages: conv.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }))
          setConversations(withDates)
        }

        if (savedFolders) {
          const parsed = JSON.parse(savedFolders)
          const withDates = parsed.map((folder: any) => ({
            ...folder,
            createdAt: new Date(folder.createdAt),
          }))
          setFolders(withDates)
        }
      } catch (error) {
        console.error("Error loading saved data:", error)
      }
    }
    loadData()
  }, [])

  // Save conversations to localStorage
  const saveConversations = (convs: Conversation[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs))
      setConversations(convs)
    } catch (error) {
      console.error("Error saving conversations:", error)
    }
  }

  // Save folders to localStorage
  const saveFolders = (fldrs: SearchFolder[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(fldrs))
      setFolders(fldrs)
    } catch (error) {
      console.error("Error saving folders:", error)
    }
  }

  // Create a new conversation
  const createConversation = (title: string, messages: Message[], folderId?: string): Conversation => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title,
      messages,
      createdAt: new Date(),
      updatedAt: new Date(),
      folderId,
    }
    saveConversations([...conversations, newConversation])
    return newConversation
  }

  // Update an existing conversation
  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    const updated = conversations.map((conv) =>
      conv.id === id ? { ...conv, ...updates, updatedAt: new Date() } : conv,
    )
    saveConversations(updated)
  }

  // Delete a conversation
  const deleteConversation = (id: string) => {
    saveConversations(conversations.filter((conv) => conv.id !== id))
  }

  // Create a new folder
  const createFolder = (name: string, color?: string): SearchFolder => {
    const newFolder: SearchFolder = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
      conversationIds: [],
      color,
    }
    saveFolders([...folders, newFolder])
    return newFolder
  }

  // Update a folder
  const updateFolder = (id: string, updates: Partial<SearchFolder>) => {
    const updated = folders.map((folder) => (folder.id === id ? { ...folder, ...updates } : folder))
    saveFolders(updated)
  }

  // Delete a folder
  const deleteFolder = (id: string) => {
    // Remove folder reference from conversations
    const updatedConvs = conversations.map((conv) => (conv.folderId === id ? { ...conv, folderId: undefined } : conv))
    saveConversations(updatedConvs)
    saveFolders(folders.filter((folder) => folder.id !== id))
  }

  // Move conversation to folder
  const moveConversationToFolder = (conversationId: string, folderId?: string) => {
    updateConversation(conversationId, { folderId })

    // Update folder's conversation list
    if (folderId) {
      const folder = folders.find((f) => f.id === folderId)
      if (folder && !folder.conversationIds.includes(conversationId)) {
        updateFolder(folderId, {
          conversationIds: [...folder.conversationIds, conversationId],
        })
      }
    }
  }

  // Get conversations by folder
  const getConversationsByFolder = (folderId?: string): Conversation[] => {
    return conversations.filter((conv) => conv.folderId === folderId)
  }

  return {
    conversations,
    folders,
    createConversation,
    updateConversation,
    deleteConversation,
    createFolder,
    updateFolder,
    deleteFolder,
    moveConversationToFolder,
    getConversationsByFolder,
  }
}
