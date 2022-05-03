import { Item, User } from '../schema'

export type GetItemRequest = {
	itemId: number
}

export type GetItemResponse = {
	item: Item
	lender: User
}
