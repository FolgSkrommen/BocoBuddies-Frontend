import { Review } from '../schema'

export type GetReviewRequest = {
	reviewId: number
}

export type GetReviewResponse = Review

/**
 * TOKEN
 */
export type PostReviewRequest = Review

export type PostReviewResponse = undefined
