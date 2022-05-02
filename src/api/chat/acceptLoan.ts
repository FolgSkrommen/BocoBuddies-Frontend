export type WSAcceptLoanRequest = {
	startDate: string
	endDate: string
	returned: boolean
	active: boolean
	creationDate: string
	chatId: number
	loanId: number
}

export type WSAcceptLoanResponse = null
