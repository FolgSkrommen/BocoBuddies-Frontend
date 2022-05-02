import { User } from '../schema'

export type PostUserLoginRequest = {
	email: string
	password: string
}

export type PostUserLoginResponse = {
	user: User
	token: string
}
