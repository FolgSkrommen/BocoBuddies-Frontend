import { Item, Loan, User } from '../schema'

/**
 * TOKEN
 */
export type PutLoanRequest = {
	loanId: number
	start: Date
	end: Date
	returned: boolean
	active: boolean
	item: number
	loaner: number
}

export type PutLoanResponse = {
	loanId: number
	start: Date
	end: Date
	returned: boolean
	active: boolean
	item: number
	loaner: number
}

/**
 * TOKEN
 */
export type DelLoanRequest = {
	loanId: number
}
export type DelLoanResponse = undefined

/**
 * TOKEN
 */
export type PostLoanRequest = {
	start: Date
	end: Date
	returned: boolean
	active: boolean
	item: number
	loaner: number
	chatId: number
}
export type PostLoanResponse = {
	loanId: number
	itemId: number
	loaner: number
	startTime: Date
	endTime: Date
	active: boolean
	returned: boolean
	creationDate: Date
}

/**
 * TOKEN
 */
export type GetLoanRequest = {
	loanId: number
	isLender: boolean
}
export type GetLoanResponse = {
	item: Item
	user: User
	loan: Loan
}
