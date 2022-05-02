import { boolean } from 'yup'
import { Item } from '../schema'
/**
 * "/search/" + searchWord,
 */
export type GetItemSearchRequest = {
	categories?: number[]
	sort: string
	amount: number
	offset: number
	userId?: number
	active?: boolean
	loan?: boolean
}

/**
 * Husk å endre i backend!
 */
export type GetItemSearchResponse = Item[]
