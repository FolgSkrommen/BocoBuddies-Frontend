import { Review } from '../schema'

type GetReviewRequest = {
	reviewId: number
}

type GetReviewResponse = Review

type PostReviewRequest = Review

type PostReviewResponse = undefined
