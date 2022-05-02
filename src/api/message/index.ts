import { Message } from '../schema'

/**
 * TOKEN
 */
export type GetMessageRequest = {
	chatId: number
}

export type GetMessageResponse = {
	userId: number
	messages: Message[]
}

/**
 * TOKEN
 */
export type PostMessageRequest = {
	chatId: number
	message: string
	senderId: number
}

export type PostMessageResponse = Message
