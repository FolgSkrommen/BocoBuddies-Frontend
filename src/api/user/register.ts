import { User } from '../schema'

/**
 * TOKEN
 */
export type PostUserRegisterRequest = {
	firstName: string
	lastName: string
	username: string
	email: string
	password: string
	address: string
	postalCode: string
	phoneNumber: string
	profilePicture?: string
}

export type PostUserRegisterResponse = User
