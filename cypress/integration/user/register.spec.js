/// <reference types="cypress" />
describe('Test Register user', () => {
	it('submits a register function', () => {
		cy.visit('http://localhost:3000/register')
		cy.get('[data-testid=username-input]').type('hans')
		cy.get('[data-testid=firstName-input]').type('Hans')
		cy.get('[data-testid=lastName-input]').type('Hansen')
		cy.get('[data-testid=email-input]').type(
			'hansemannen1233151535315@test.com'
		)
		cy.get('[data-testid=phoneNumber-input]').type('12345678')
		cy.get('[data-testid=address-input]').type('Hanseveien 2')
		cy.get('[data-testid=postalCode-input]').type('1234')
		cy.get('[data-testid=password-input]').type('12345678')
		cy.get('[data-testid=passwordCheck-input]').type('12345678')
		cy.get('[data-testid=submit-button]').should('not.be.disabled')
	})
})
