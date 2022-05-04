import { Item } from '../schema'
/**
 * TOKEN
 */
export type PutItemRegisterRequest = {
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

	itemId: number
	active: boolean
}

export type PutItemRegisterResponse = undefined
