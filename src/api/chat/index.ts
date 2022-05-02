import { Chat } from '../schema'

/**
 * TOKEN
 */
export type GetChatRequest = {
	chatId: number
}
export type GetChatResponse = Chat

export type PutChatRequest = Chat
export type PutChatResponse = undefined

/**
 * TOKEN
 */
export type PostChatRequest = {
	chatName: string
	itemId: number
	members: number[]
}
export type PostChatResponse = Chat
