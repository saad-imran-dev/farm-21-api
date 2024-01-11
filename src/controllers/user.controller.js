const authentication = require("../utils/Authentication")
const userValidation = require("../validation/user.validation")
const userRepo = require("../data/user.repo")
const { ValidationError } = require('joi')
const { AuthApiError } = require("@supabase/supabase-js")

class userController {
    static async signup(req, res) {
        console.info("--> Signup User")

        try {
            const { email, password } = req.body

            await userValidation.signup.validateAsync(req.body)

            if (await userRepo.getUserWithEmail(email)) {
                return res.status(400).send("User already exists")
            }

            await authentication.signup(email, password)

            res.status(200).send("User signed up. Please verify user.")
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).send("Invalid inputs given")
            } else {
                res.sendStatus(500)
            }
            console.error(`Error: ${error}`)
        }
    }

    static async verify(req, res) {
        console.info("--> Verify User")

        try {
            const { email, token, name } = req.body

            await userValidation.verifyOTP.validateAsync(req.body)
            
            const data = await authentication.verifyOTP(email, token)
            if (!data.user) {
                throw new AuthApiError("Invalid Token")
            }

            await userRepo.createUser(data.user.id, name, email)

            res.status(200).send("User verified.")
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).send("Invalid inputs given")
            } else if (error instanceof AuthApiError) {
                res.status(400).send(error.message)
            } else {
                res.sendStatus(500)
            }
            console.error(`Error: ${error}`)
        }
    }
}

module.exports = userController
