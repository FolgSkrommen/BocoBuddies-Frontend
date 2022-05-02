import { Item, User } from '../schema'

export type GetItemRequest = {
	id: number
}

export type GetItemResponse = {
	item: Item
	lender: User
}
