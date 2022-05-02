import { Item } from '../schema'

export type PostItemRegisterRequest = {
	categoryId: number
	name: string
	description: string
	price: number
	priceUnit: string
	address: string
	postalCode: string
	startDate: string
	endDate: string
	images: File[]
}

export type PostItemRegisterResponse = Item
