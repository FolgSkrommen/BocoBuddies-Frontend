import { FriendChat } from '../schema'

/**
 * TOKEN
 */
export type GetSearchRequest = {
	searchString: string
	page: number
	amount: number
}

export type GetSearchResponse = FriendChat[]
