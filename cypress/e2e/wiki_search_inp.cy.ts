describe('Wikipedia Search Input', () => {
    beforeEach(() => { cy.visit('/'); });

    it('validates search input behavior with valid search term', () => {
        const searchTerm = 'Cypress.io';
        cy.get('#searchInput')
            .should('be.visible').and('have.attr', 'placeholder', 'Search Wikipedia')
            .type(searchTerm).type('{enter}');

        cy.url().should('include', encodeURIComponent(searchTerm));
        cy.get('#firstHeading').should('contain', searchTerm);
    });

    it('handles special characters and spaces in search term', () => {
        const specialCharsTerm = 'Software Testing!@#$%^&*()_+=-`~[]\{}|;\':",./<>?';
        cy.get('#searchInput').type(specialCharsTerm).type('{enter}');

        cy.url().should('include', encodeURIComponent(specialCharsTerm));
    });

    it('trims leading and trailing spaces in search term', () => {
        const spacesTerm = '   Leading and trailing spaces   ';
        cy.get('#searchInput').type(spacesTerm).type('{enter}');

        cy.url().should('include', encodeURIComponent(spacesTerm.trim()));
    });

    it('handles empty search submission', () => {
        cy.get('#searchInput').type('{enter}');

        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('validates search input with very long search term', () => {
        const veryLongSearchTerm = 'a'.repeat(500);
        cy.get('#searchInput').type(veryLongSearchTerm).type('{enter}');

        cy.url().should('include', encodeURIComponent(veryLongSearchTerm.substring(0, 250)));
    });

    it('validates search input with numeric search term', () => {
        const numericSearchTerm = '1234567890';
        cy.get('#searchInput').type(numericSearchTerm).type('{enter}');

        cy.url().should('include', numericSearchTerm);
        cy.get('#firstHeading').should('contain', numericSearchTerm);
    });

    it('validates search input with mixed-case search term', () => {
        const mixedCaseSearchTerm = 'CyPrEsS.io';
        cy.get('#searchInput').type(mixedCaseSearchTerm).type('{enter}');

        cy.url().should('include', encodeURIComponent(mixedCaseSearchTerm.toLowerCase()));
        cy.get('#firstHeading').should('contain', mixedCaseSearchTerm);
    });

    it('validates search input with non-Latin characters search term', () => {
        const nonLatinSearchTerm = '你好世界';
        cy.get('#searchInput').type(nonLatinSearchTerm).type('{enter}');

        cy.url().should('include', encodeURIComponent(nonLatinSearchTerm));
        cy.get('#firstHeading').should('contain', nonLatinSearchTerm);
    });

    it('displays search suggestions', () => {
        const searchTerm = 'Cypress';
        cy.get('#searchInput').type(searchTerm, { delay: 100 });

        cy.get('.suggestions-results').should('be.visible');
        cy.get('.suggestions-results .suggestion-link').should('have.length.greaterThan', 0);
    });

    it('navigates to the selected search suggestion', () => {
        const searchTerm = 'Cypress';
        cy.get('#searchInput').type(searchTerm, { delay: 100 });

        cy.get('.suggestions-results .suggestion-link')
            .first().then(($suggestion) => {
                const suggestionText = $suggestion.text();
                cy.wrap($suggestion).click();

                cy.url().should('not.eq', Cypress.config().baseUrl + '/');
                cy.get('#firstHeading').should('contain', suggestionText);
            });
    });
});
