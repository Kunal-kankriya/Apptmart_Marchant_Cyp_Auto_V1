//pass inputProps to mInput Variable

export const loginViaUI = () => {
    cy.get('[data-testid="input-email-test-id"]', { timeout: LONGER_TIMEOUT_1_MINUTE })
      .click()
      .type(Cypress.env('USER_EMAIL'))
      .should('have.value', Cypress.env('USER_EMAIL'));
    cy.get('[data-testid="continue-button-test-id"]').click();
    cy.get('[data-testid="input-password-test-id"]').click().type(Cypress.env('USER_PASSWORD'), { timeout: 20000 });
    cy.get('[data-testid="sign-in-button-test-id"]').should('not.be.disabled');
    cy.intercept('POST', '/api/login').as('login');
    cy.get('[data-testid="sign-in-button-test-id"]').click().wait(3000);
    cy.wait('@login').then(({ response }) => {
      expect(response.body).to.have.property('auth');
      const accessToken = response.body.auth.access_token;
      Cypress.env('E2E_ACCESS_TOKEN', accessToken);
    });
    // check login successfull
    cy.get('[data-testid="analyses-div-test-id"]').should('be.visible').debug();
  
    const workspace = 'E2E';
    cy.get('[data-testid="org-profile"]').click();
    // TODO refactor below code
    cy.get('div.ws-item')
      .contains(workspace)
      .parents('div.ws-item')
      .then($item => {
        const classList = $item.attr('class').split(' ');
        cy.log(classList);
        if (classList.includes('current-ws')) {
          cy.log('Already in the desired workspace.');
          // check beow
          cy.reload();
          cy.wait(500);
        } else {
          cy.log(`Switch to workspace ${workspace}.`);
          $item.click();
          cy.wait(500);
        }
      });
    cy.get('[data-testid="analyses-button-test-id"]').should('be.visible').debug();
  };
  
  export const afterLoginAddSource = () => {
    // go to Data screen and check
    cy.get('div[data-testid="data-test-id"]').click();
    cy.get('div[data-testid="data-list-view"]').should('be.visible');
    cy.url({ timeout: SMALL_TIMEOUT }).should('contain', '/source');
  
    // go to add data set screen and check
    cy.get('[data-testid="new-dataset-button-test-id"]').click({ force: true });
  
    cy.url({ timeout: SMALL_TIMEOUT }).should('contain', '/source/add');
  };
  
  export const afterLoginUploadSource = () => {
    // go to Data screen and check
    cy.get('div[data-testid="data-test-id"]').click();
    cy.get('div[data-testid="data-list-view"]').should('be.visible');
    cy.url({ timeout: SMALL_TIMEOUT }).should('contain', '/source');
    cy.get('.MuiDataGrid-main').should('be.visible');
  
    // go to add data set screen and check
    cy.get('[data-testid="upload-test-id"]').should('not.be.disabled');
    cy.get('[data-testid="upload-test-id"]').click({ force: true });
    cy.url({ timeout: SMALL_TIMEOUT }).should('contain', '/source/upload');
  };
  
  export const checkSourceScreenWithNewData = title => {
    // check the screen if source screen and check the new data set is present
    cy.url().should('contain', '/source');
    cy.get('.MuiDataGrid-columnHeaderTitle')
      .contains(/^MODIFIED AT$/)
      .click();
    cy.get('.MuiDataGrid-columnHeaderTitle')
      .contains(/^MODIFIED AT$/)
      .click();
    cy.get('.first-cell', { timeout: SMALL_TIMEOUT }).should('contain', title);
  };
  
  export const deleteSource = title => {
    cy.get('input[placeholder="search"]').click().type(title, { timeout: SMALL_TIMEOUT }).should('have.value', title);
    // delete the new created data set
    cy.contains(title).parents('.MuiDataGrid-row').find('.MuiIconButton-root').click({ multiple: true, force: true });
    cy.get('li.MuiMenuItem-root').contains('Delete').click();
    // cy.get('.modal-content').find('input[type="text"]').type('DELETE');
    cy.get('[data-testid="confirm-button-test-id"]').should('not.be.disabled');
    cy.get('[data-testid="confirm-button-test-id"]').click();
  };
  
  export const createAnalysis = () => {
    cy.contains('Analyses').click({ force: true });
    //cy.get('[data-testid="analyses-div-test-id"]').click({ force: true });
  
    cy.get('[data-testid="new-analysis-button-test-id"]').should('be.visible');
    cy.get('[data-testid="new-analysis-button-test-id"]').click();
  
    cy.url().should('contain', '/app/flow/', { timeout: TIMEOUT_TO_EXPLICITLY_CHECK });
  
    // remane the analysis
    const now = new Date();
    const analysisName = `[E2E] ${now.toISOString()} - ephemeral`;
    cy.get('.flow-name-group').trigger('mouseover');
    cy.get('.flow-name-group').find('.edit-name-icon').click();
    cy.get('.flow-name-input').clear().type(analysisName);
    cy.get('.clickable-icon').contains('done').parent().click();
    // cy.get('[data-testid=clickable-icon]').contains('done').parent().click();
    // TODO remove wait below
    cy.wait(200);
    return analysisName;
  };
  
  export const createAnalysisInWorkSpace = workspace => {
    // go to Analyses page
    // cy.get('div[aria-describedby="org-profile"]').click({ force: true });
    cy.get('[data-testid="org-profile"]').click();
  
    // TODO refactor below code
    cy.get('div.ws-item')
      .contains(workspace)
      .parents('div.ws-item')
      .then($item => {
        const classList = $item.attr('class').split(' ');
        cy.log(classList);
        if (classList.includes('current-ws')) {
          cy.log('Already in the desired workspace.');
          cy.reload();
          cy.wait(500);
        } else {
          cy.log(`Switch to workspace ${workspace}.`);
          $item.click();
          cy.wait(500);
        }
      });
    cy.contains('Analyses').click({ force: true });
    //cy.get('[data-testid="analyses-div-test-id"]').click({ force: true });
  
    // click "New Analysis"
    cy.get('[data-testid="new-analysis-button-test-id"]').should('be.visible');
    cy.get('[data-testid="new-analysis-button-test-id"]').click();
    cy.url().should('contain', '/app/flow/', { timeout: TIMEOUT_TO_EXPLICITLY_CHECK });
  
    // remane the analysis
    //
    const now = new Date();
    const analysisName = `[E2E] ${now.toISOString()} - ephemeral`;
    cy.get('.flow-name-group').trigger('mouseover');
    cy.get('.flow-name-group').find('.edit-name-icon').click();
    cy.get('.flow-name-input').clear().type(analysisName);
    cy.get('.clickable-icon').contains('done').parent().click();
    // cy.get('[data-testid=clickable-icon]').contains('done').parent().click();
    cy.wait(WAIT_FOR_MUI_TO_RENDER_POPUP);
    return analysisName;
  };
  
  export const addSourceModuleWithName = source => {
    // open "Add source dataset" popove
    cy.get('[data-testid="add-dataset-test-id"]').eq(0).click();
    cy.get('[data-testid="add-dataset-div-test-id"]').should('be.visible');
  
    // search source dataset
    cy.get('[data-testid="search-source-input-id"]')
      .click()
      .type(source, { timeout: SMALL_TIMEOUT })
      .should('have.value', source);
  
    // add to the canvas
    //cy.get('.action-btns').find('button').click({ force: true });
    cy.get('span.material-icons').contains('add_circle_outline').first().click({ force: true });
    cy.wait(API_INTERCEPTOR_WAIT);
  };
  
  export const addModuleWithName = name => {
    cy.get('div[title="Add step"]').click({ force: true });
  
    const card = cy.get('div.name-label').contains(name, { timeout: SMALL_TIMEOUT });
  
    card.should('be.visible');
    card.parents('div.card').click();
    // TODO rather than waiting add proper condition to check whether module node is added or not
    cy.wait(API_INTERCEPTOR_WAIT);
  };
  
  export const addDestinationModule = () => {
    // open "Add destination" popover
    cy.get('[data-testid="add-destination-test-id"]').click({ force: true });
  
    cy.get('[data-testid="add-destination-div-test-id"]').should('be.visible');
  
    // choose CSV destination
    cy.get('[data-testid="search-destination-input-id"]').click().type('csv', { timeout: TIMEOUT_TO_EXPLICITLY_CHECK });
  
    cy.wait(200);
    cy.get('span.material-icons').contains('add_circle_outline').first().click({ force: true });
    cy.wait(API_INTERCEPTOR_WAIT);
  };
  
  export const addDestinationWithName = name => {
    // open "Add destination" popover
    cy.get('[data-testid="add-destination-test-id"]').click({ force: true });
    cy.get('[data-testid="add-destination-div-test-id"]').should('be.visible');
  
    // choose CSV destination
    cy.get('[data-testid="search-destination-input-id"]').click().type(name, { timeout: TIMEOUT_TO_EXPLICITLY_CHECK });
  
    cy.wait(2000);
    cy.get('span.material-icons').contains('add_circle_outline').first().click({ force: true });
    cy.wait(API_INTERCEPTOR_WAIT);
  };
  
  export const openConfigView = name => {
    const nodeName = 'div.react-flow__node-' + name.toLowerCase();
    cy.get(nodeName).click();
    cy.wait(200);
    // cy.get('div[title="expand"]').click();
    // cy.wait(200);
  };
  
  export const openNodeTab = name => {
    const nodeName = 'div.react-flow__node-' + name.toLowerCase();
    cy.get(nodeName).dblclick();
    cy.wait(200);
    // Remove the changes after review
    // cy.get('div.label-box').contains(name).parents('div.react-flow__node-edit').dblclick({ force: true });
    // cy.get('div.MuiDataGrid-columnHeaderTitle');
  };
  
  export const deleteAnalysis = name => {
    // Save the analysis
    // cy.get('.la-save').parent().click();
    // cy.wait(1000);
    cy.visit('/en/app/analysis');
    // cy.get('a[href="/en/app/analysis/"]').click();
  
    // delete the tests for analysis
    cy.contains('MODIFIED AT').parents('div.MuiDataGrid-columnHeaderTitleContainer').dblclick();
    cy.contains(name).parents('div.MuiDataGrid-row').find('.MuiIconButton-sizeMedium').click();
    cy.get('[data-testid="delete-analysis-test-id"]').eq(0).click();
    cy.get('[data-testid="confirm-button-test-id"]').should('not.be.disabled');
    cy.get('[data-testid="confirm-button-test-id"]').click();
  };
  
  export const WAIT_FOR_MUI_TO_RENDER_POPUP = 1000;
  export const API_INTERCEPTOR_WAIT = 2000;
  export const API_TO_FINISH_ITS_STUFF = 200;
  export const TIMEOUT_TO_EXPLICITLY_CHECK = 30000;
  export const LONGER_TIMEOUT_1_MINUTE = 60000;
  export const SMALL_TIMEOUT = 12000;
  