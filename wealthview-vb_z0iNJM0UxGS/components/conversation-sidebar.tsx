"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Folder, Plus, MoreVertical, Trash2, Edit2, FolderOpen, MessageSquare, Save } from "lucide-react"
import type { Conversation, SearchFolder } from "@/lib/types"
import { COLORS } from "@/lib/app-config"

interface ConversationSidebarProps {
  conversations: Conversation[]
  folders: SearchFolder[]
  onCreateFolder: (name: string, color?: string) => void
  onDeleteFolder: (id: string) => void
  onUpdateFolder: (id: string, updates: Partial<SearchFolder>) => void
  onLoadConversation: (conversation: Conversation) => void
  onDeleteConversation: (id: string) => void
  onMoveToFolder: (conversationId: string, folderId?: string) => void
  onSaveCurrentChat: () => void
}

export function ConversationSidebar({
  conversations,
  folders,
  onCreateFolder,
  onDeleteFolder,
  onUpdateFolder,
  onLoadConversation,
  onDeleteConversation,
  onMoveToFolder,
  onSaveCurrentChat,
}: ConversationSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedColor, setSelectedColor] = useState(COLORS.PRIMARY)
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editFolderName, setEditFolderName] = useState("")

  const folderColors = ["#703D92", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), selectedColor)
      setNewFolderName("")
      setSelectedColor(COLORS.PRIMARY)
    }
  }

  const handleEditFolder = (folder: SearchFolder) => {
    setEditingFolderId(folder.id)
    setEditFolderName(folder.name)
  }

  const handleSaveEdit = () => {
    if (editingFolderId && editFolderName.trim()) {
      onUpdateFolder(editingFolderId, { name: editFolderName.trim() })
      setEditingFolderId(null)
      setEditFolderName("")
    }
  }

  const unfiledConversations = conversations.filter((conv) => !conv.folderId)

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50"
        style={{ backgroundColor: COLORS.PRIMARY }}
        size="sm"
      >
        <FolderOpen className="w-4 h-4 mr-2" />
        Saved Searches
      </Button>

      {isOpen && (
        <div className="fixed top-0 left-0 w-80 h-full bg-white border-r shadow-lg z-40 flex flex-col">
          <div className="p-4 border-b" style={{ backgroundColor: COLORS.PRIMARY }}>
            <div className="flex items-center justify-between text-white">
              <h2 className="text-lg font-semibold">Saved Searches</h2>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </div>

          <div className="p-4 border-b">
            <Button onClick={onSaveCurrentChat} className="w-full" style={{ backgroundColor: COLORS.PRIMARY }}>
              <Save className="w-4 h-4 mr-2" />
              Save Current Chat
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {/* Create New Folder */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    New Folder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>Organize your saved conversations into folders.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input
                      placeholder="Folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                    />
                    <div>
                      <p className="text-sm mb-2">Choose color:</p>
                      <div className="flex gap-2">
                        {folderColors.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "border-gray-900" : "border-gray-300"}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateFolder} style={{ backgroundColor: COLORS.PRIMARY }}>
                      Create Folder
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Folders */}
              {folders.map((folder) => (
                <div key={folder.id} className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    {editingFolderId === folder.id ? (
                      <Input
                        value={editFolderName}
                        onChange={(e) => setEditFolderName(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyPress={(e) => e.key === "Enter" && handleSaveEdit()}
                        autoFocus
                        className="h-8"
                      />
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Folder className="w-4 h-4" style={{ color: folder.color || COLORS.PRIMARY }} />
                          <span className="text-sm font-medium">{folder.name}</span>
                          <span className="text-xs text-gray-500">
                            ({conversations.filter((c) => c.folderId === folder.id).length})
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditFolder(folder)}>
                              <Edit2 className="w-4 h-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteFolder(folder.id)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>

                  {/* Conversations in this folder */}
                  <div className="ml-6 space-y-1">
                    {conversations
                      .filter((conv) => conv.folderId === folder.id)
                      .map((conv) => (
                        <div
                          key={conv.id}
                          className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer group"
                        >
                          <div className="flex items-center gap-2 flex-1" onClick={() => onLoadConversation(conv)}>
                            <MessageSquare className="w-3 h-3 text-gray-400" />
                            <span className="text-sm truncate">{conv.title}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100"
                            onClick={() => onDeleteConversation(conv.id)}
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              ))}

              {/* Unfiled Conversations */}
              {unfiledConversations.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2">
                    <Folder className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Unfiled</span>
                    <span className="text-xs text-gray-500">({unfiledConversations.length})</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {unfiledConversations.map((conv) => (
                      <div
                        key={conv.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 flex-1" onClick={() => onLoadConversation(conv)}>
                          <MessageSquare className="w-3 h-3 text-gray-400" />
                          <span className="text-sm truncate">{conv.title}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {folders.map((folder) => (
                              <DropdownMenuItem key={folder.id} onClick={() => onMoveToFolder(conv.id, folder.id)}>
                                <Folder className="w-3 h-3 mr-2" style={{ color: folder.color }} />
                                Move to {folder.name}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem onClick={() => onDeleteConversation(conv.id)} className="text-red-600">
                              <Trash2 className="w-3 h-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  )
}
