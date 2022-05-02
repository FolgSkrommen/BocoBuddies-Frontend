import { Chat } from '../schema'

/**
 * TOKEN
 */
export type GetChatRequest = {
	chatId: number
}
export type GetChatResponse = Chat

export type PutChatRequest = Chat
export type PutChatResponse = null

/**
 * TOKEN
 */
export type PostChatRequest = Chat
export type PostChatResponse = Chat
