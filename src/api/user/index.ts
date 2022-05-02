import { User } from '../schema'

export type GetUserRequest = {
	user: number
}

export type GetUserResponse = User

/**
 * TOKEN
 */
export type DelUserRequest = {
	password: string
}

export type DelUserResponse = boolean

/**
 * TOKEN
 */
export type PutUserRequest = {
	firstName: string
	lastName: string
	username: string
	email: string
	password: string
	address: string
	postalcode: string
	phonenumber: string
	profilePicture?: string
}

export type PutUserResponse = User
