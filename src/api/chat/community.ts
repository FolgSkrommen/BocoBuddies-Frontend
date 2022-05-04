import { Chat, FriendChat } from '../schema'

/**
 * TOKEN
 */
export type GetChatCommunityRequest = {
	chatId: number
}
export type GetChatCommunityResponse = FriendChat
