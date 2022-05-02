import { Review } from '../schema'

type GetReviewRequest = {
	reviewId: number
}

type GetReviewResponse = Review

/**
 * TOKEN
 */
type PostReviewRequest = Review

type PostReviewResponse = undefined
