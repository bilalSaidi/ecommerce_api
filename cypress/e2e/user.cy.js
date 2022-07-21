/// <reference types="Cypress" />


import users from "../fixtures/users.json"
describe('user endpoint ', () => {

  context("when i send Post/ Rgesiter User endpoint to register a user ", () => {
    it.skip("Then I should be able to create a new user with status 201 ", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env('APIBaseUrl')}/auth/register`,
        body: {
          "username": users.UserExistInDb1.username,
          "email": users.UserExistInDb1.email,
          "isAdmin": users.UserExistInDb1.isAdmin,
          "password": Cypress.env("password"),
          "retypepassword": Cypress.env("password")
        },
        failOnStatusCode: false
      })
        .then((response) => {
          expect(response.status).to.eq(201)

        })
    })
  })

  context("when i send Post/ Rgesiter User endpoint to register a user with existing account ", () => {
    it("Then I should be able to see an error message ", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env('APIBaseUrl')}/auth/register`,
        body: {
          "username": users.UserExistInDb1.username,
          "email": users.UserExistInDb1.email,
          "isAdmin": users.UserExistInDb1.isAdmin,
          "password": Cypress.env("password"),
          "retypepassword": Cypress.env("password")
        },
        failOnStatusCode: false
      })
        .then((response) => {
          expect(response.status).to.eq(500)
          expect(response.body).to.eq("Email Already Have An Acount")
        })
    })
  })

  context("when i send Post/ Login User endpoint to login with wrong email and correct password ", () => {
    it("Then I should be Unauthorized to access ", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env('APIBaseUrl')}/auth/login`,
        failOnStatusCode: false,
        body: {
          "email": users.UserNotExistInDb.email,
          "password": Cypress.env("password")
        },
        failOnStatusCode: false
      })
        .then((response) => {
          expect(response.status).to.eq(401)
          expect(response.body).to.eq("Wrong Credentials !")
        })
    })
  })

  context("when i send Post/ Login User endpoint to login with correct email and wrong password ", () => {
    it("Then I should be Unauthorized to access ", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env('APIBaseUrl')}/auth/login`,
        failOnStatusCode: false,
        body: {
          "email": users.UserExistInDb1.email,
          "password": "randompassword"
        },
        failOnStatusCode: false
      })
        .then((response) => {
          expect(response.status).to.eq(401)
          expect(response.body).to.eq("Wrong Credentials !")
        })
    })
  })

  context("when i send Post/ Login User endpoint to login with correct email and password ", () => {
    it("Then I should be authorized to access ", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env('APIBaseUrl')}/auth/login`,
        failOnStatusCode: false,
        body: {
          "email": users.UserExistInDb1.email,
          "password": Cypress.env("password")
        }
      })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.email).to.eq(users.UserExistInDb1.email)
          Cypress.env("AccessToken", response.body.accessToken)
          Cypress.env("id User", response.body._id)
        })
    })
  })

  context("when i send Get/SingleUser endpoint with correct user id  And Correct Access token", () => {
    it("Then I should be able to see user data and receive 200 status", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env('APIBaseUrl')}/user/${Cypress.env("id User")}`,
        headers: {
          token: `bearer ${Cypress.env("AccessToken")}`
        },
        failOnStatusCode: false
      })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body._id).to.eq(Cypress.env("id User"))
          expect(response.body.email).to.eq(users.UserExistInDb1.email)
        })
    })
  })

  context("when i send Get/SingleUser endpoint with correct user id  And No Access token", () => {
    it("Then I should be able to receive an error msg ", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env('APIBaseUrl')}/user/${Cypress.env("id User")}`,
        failOnStatusCode: false
      })
        .then((response) => {
          expect(response.status).to.eq(401)
          expect(response.body).to.eq("You are Not Authenticated")
        })
    })
  })


  context("When User UserExistInDb2  send Get/SingleUser endpoint for User UserExistInDb1  And  UserExistInDb2 not Admin  ", () => {
    it.skip("Given Register UserExistInDb2 ", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env('APIBaseUrl')}/auth/register`,
        body: {
          "username": users.UserExistInDb2.username,
          "email": users.UserExistInDb2.email,
          "isAdmin": users.UserExistInDb2.isAdmin,
          "password": Cypress.env("password"),
          "retypepassword": Cypress.env("password")
        },
        failOnStatusCode: false
      })
        .then((response) => {
          expect(response.status).to.eq(201)

        })
    })

    it("Given login  UserExistInDb2 ", () => {
      cy.request({
        method: "POST",
        url: `${Cypress.env('APIBaseUrl')}/auth/login`,
        failOnStatusCode: false,
        body: {
          "email": users.UserExistInDb2.email,
          "password": Cypress.env("password")
        }
      })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.email).to.eq(users.UserExistInDb2.email)
          Cypress.env("AccessToken2", response.body.accessToken)
          Cypress.env("id User2", response.body._id)
        })
    })

    it("then the user UserExistInDb2 should have a msg of permission missed ", () => {
      cy.request({
        method: "GET",
        url: `${Cypress.env('APIBaseUrl')}/user/${Cypress.env("id User")}`,
        headers: {
          token: `bearer ${Cypress.env("AccessToken2")}`
        },
        failOnStatusCode: false
      })
        .then((response) => {
          expect(response.status).to.eq(501)
          expect(response.body).to.eq("permission missed !")
        })
    })
  })
})



