const supabase = require("../config/supabase");

class Authentication {
    constructor() {
        if (!Authentication.instance) {
            this.auth = supabase.auth
            Authentication.instance = this
        }

        return Authentication.instance
    }

    async signup(email, password) {
        const { data, error } = await this.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            console.log("Error while Signing up user: ", error);
            throw new Error("SignUp Error");
        }

        return data
    }

    async verifyOTP(email, token) {
        const { data } = await this.auth.verifyOtp({ email, token, type: 'signup' })
        return data
    }
}

const authentication = new Authentication()

module.exports = authentication;
