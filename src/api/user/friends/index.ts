import { User } from '../../schema'

export type GetUserFriendsRequest = {
	userId: number
}

export type GetUserFriendsResponse = User[]

/**
 * Used for sending friend requests
 */
export type PostUserFriendsRequest = {
	userId: number
}

export type PostUserFriendsResponse = boolean

/**
 * Used for accepting friend requests
 */
export type PutUserFriendsRequest = {
	userId: number
}

export type PutUserFriendsResponse = boolean

/**
 * Used for deleting friend requests or declining friend requests
 */
export type DelUserFriendsRequest = {
	userId: number
}

export type DelUserFriendsResponse = boolean
