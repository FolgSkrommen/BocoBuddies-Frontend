import { Item, Loan, User } from '../schema'
import { store } from '../../store'

/**
 * TOKEN
 */
export type PutLoanRequest = Loan
export type PutLoanResponse = Loan

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
	loanId?: number
	chatId: number
	item: number
	loaner: number
	start: string
	end: string
	active: boolean
	returned: boolean
	creationDate: string
	price: number
}
export type PostLoanResponse = Loan

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
