import { Given } from "@badeball/cypress-cucumber-preprocessor";
const fs = require('fs'); // import fs
const path = require('path'); // import path
const config_path = path.join(__dirname, '/configuration/config.json'); //join is a function like create method eg. dirname>cypress folder + path
const config_data = fs.readFileSync(config_path, 'utf8'); //fs useed to read write uppend like fileinputstream in java, readfilesync can read the file utf8-encoding format.
const data = JSON.parse(config_data)

Given('I navigate to splendid fresh farm login page', () => {
    cy.clearCookies()
    cy.visit(data.url);
})

// When('I click on profile icon', () => {
//     cy.get(".main-headers [alt='Profile-Icon']").click();
// })

// Then('I enter the mobile number', () => {
//     cy.get("input#mat-input-6").type(data.mobile_number);

// })


