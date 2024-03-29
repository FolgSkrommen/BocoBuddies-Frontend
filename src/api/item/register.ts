import { Item } from '../schema'
/**
 * TOKEN
 */
export type PostItemRegisterRequest = {
	name: string
	description: string
	price: number
	priceUnit: string
	address: string
	postalCode: string
	startDate: string
	endDate: string
	categoryId: number
	filterIdList: number[]
	images: File[]
}

export type PostItemRegisterResponse = Item
