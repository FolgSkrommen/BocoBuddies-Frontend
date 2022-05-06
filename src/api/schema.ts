export interface User {
	userId: number
	firstName: string
	lastName: string
	username: string
	email?: string
	address?: string
	postalCode?: string
	phoneNumber?: string
	profilePicture?: string
	friend?: boolean
	hasPendingInvite?: boolean
	verified: boolean
	trusted: boolean
	rating: number
}

export interface Review {
	reviewId: number
	loanId: number
	isOwner: boolean
	rating: number
	description: string
	date: string
	user: User
}

export interface Filter {
	id: number
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
	itemId: number
	name: string
	description: string
	price: number
	priceUnit: string
	postalCode: string
	address: string
	position: Position
	images: string[]
	active: boolean
	availableFrom: string
	availableTo: string
	categories: string[]
	filters: Filter[]
}

export interface Loan {
	loanId?: number
	itemId: number
	chatId: number
	loaner: number
	start: string
	end: string
	active: boolean
	returned: boolean
	creationDate: string
	price: number
}

export interface Category {
	categoryName: string
	categoryId: number
	superCategoryId?: number
	filterTypes?: FilterType[]
}

export interface Chat {
	chatId: number
	chatName: string
	item?: Item
	members?: User[]
	loan?: Loan
	user: User
}

export interface FriendChat {
	chatId: number
	chatName: string
	members: User[]
}

export interface Message {
	senderId: number
	message?: string
	type: string
	date: string
	receive: boolean
	chatId?: number
	start?: string
	stop?: string
	active?: boolean
	returned?: boolean
	price?: number
}

export interface Alternative {
	id: number
	alt: string
}
