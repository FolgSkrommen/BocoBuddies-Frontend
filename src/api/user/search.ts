import { User } from '../schema'

export type GetUserSearchRequest = {
	searchString: string
	page: number
	amount: number
}
export type GetUserSearchResponse = User[]
