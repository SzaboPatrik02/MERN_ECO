// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//

Cypress.Commands.add('login', (email, password) => {
    cy.visit('http://localhost:3000/login');
    cy.get('[type="email"]').type(email);
    cy.get('[type="password"]').type(password);
    cy.get('button').click(); 
})

Cypress.Commands.add('signup', (email, username, password) => {
    cy.visit('http://localhost:3000/signup');
    cy.get('[type="email"]').type(email);
    cy.get('[type="text"]').type(username);
    cy.get('[type="password"]').type(password);
    cy.get('button').click(); 
})


// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })