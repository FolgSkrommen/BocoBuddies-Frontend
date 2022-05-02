import { FriendChat } from '../schema'

/**
 * TOKEN
 */
export type GetChatSearchRequest = {
	searchString: string
	page: number
	amount: number
}

export type GetChatSearchResponse = FriendChat[]
