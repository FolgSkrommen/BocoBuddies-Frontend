import { Review } from '../schema'

export type GetReviewRequest = {
	reviewId: number
}

export type GetReviewResponse = Review

/**
 * TOKEN
 */
export type PostReviewRequest = {
	loanId: number
	isOwner: boolean
	rating: number
	description: string
	date: string
}

export type PostReviewResponse = undefined
