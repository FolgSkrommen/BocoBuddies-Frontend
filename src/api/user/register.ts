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
	postalcode: string
	phonenumber: string
	profilePicture?: string
}

export type PostUserRegisterResponse = User
