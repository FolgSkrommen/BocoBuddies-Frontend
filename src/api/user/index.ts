export interface UserParams {
	user: number
}

export interface UserResponse {
	id: number
	firstName: string
	lastName: string
	username: string
	email: string
	address: string
	postalCode: string
	phoneNumber: string
	profilePicture?: string
	verified: boolean
	trusted: boolean
	rating: number
}
