import { Category } from '../schema'

export type GetSubcategoryRequest = {
	categoryId: number
}

export type GetSUbcategoriesResponse = Category[]
