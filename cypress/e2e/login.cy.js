describe('test login', () => {
  it('test the login email and passwordd', () => {
    cy.visit('http://localhost:3000/')
<<<<<<< HEAD
    cy.get(`[data-cy='button_named_about']`).should('be.visible').click({ force: true })

    cy.request(`http://localhost:3001/api/about`).then((response) => {
      // console.log(':::::::::', response)
      cy.get(`[data-cy='about_text']`).should('be.visible').should('include.text', response.body.aboutText)
    })

    cy.url().should('include', '/about')
=======
>>>>>>> 82d1b909680d028340e9709ad09161e1f22d790f
  })
})
