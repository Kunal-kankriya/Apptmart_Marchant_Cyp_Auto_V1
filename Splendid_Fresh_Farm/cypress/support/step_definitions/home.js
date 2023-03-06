import { Given, When } from "@badeball/cypress-cucumber-preprocessor";

Given('I navigate to splendid fresh farm Home page', ()=> {
    cy.visit("https://splendid.apptmart.com/home");
})
When('I click the profile icon',()=>{
    const newLocal = cy.wait(5000);
    cy.newLocal.get(".main-headers [alt='Profile-Icon']").click();
})