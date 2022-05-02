import { Item, Loan, User } from '../schema'

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
export type PostLoanRequest = Loan
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
