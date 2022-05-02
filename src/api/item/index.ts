import { Item, User } from '../schema'

/**
 * /item/{id}
 */
export type GetItemRequest = undefined

export type GetItemResponse = {
	item: Item
	lender: User
}
