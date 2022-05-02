export interface User {
	id: number
	firstName: string
	lastName: string
	username: string
	email?: string
	address?: string
	postalCode?: string
	phoneNumber?: string
	profilePicture?: string
	verified: boolean
	trusted: boolean
	rating: number
}

export interface Review {
	loanId: number
	isOwner: boolean
	rating: number
	description: string
	date: string
}

export interface Message {
	senderId: number
	chatId: number
	message: string
	date: string
}

export interface Filter {
	name: string
	value: string
}

export interface FilterType {
	filterTypeId: number
	filterTypeName: string
	filterValues: Filter[]
}

export interface Position {
	lat: number
	lng: number
}

export interface Item {
	id: number
	name: string
	description: string
	price: number
	priceUnit: string
	postalCode: string
	address: string
	position: Position
	images: string[]
	availableFrom: string
	availableTo: string
	categories: string[]
	filters: Filter[]
}

export interface Loan {
	startDate: string
	endDate: string
	returned: boolean
	active: boolean
	creationDate: string
	chatId: number
	loanId: number
	price: number
}

export interface Category {
	categoryName: String
	categoryId: number
	superCategoryId?: number
	filterTypes?: FilterType[]
}

export interface Chat {
	chatId: number
	itemId: number
	chatName: string
	item?: Item
}

export interface FriendChat {
	chatId: number
	chatName: string
	members: User[]
}
