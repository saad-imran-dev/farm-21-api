const TestamonialService = require("../services/testamonial.service");
const testamonialValidation = require("../validation/testamonial.validation");
const validationHandler = require("../validation/validationHandler")

class TestamonialController {
    constructor() {
        this.service = new TestamonialService()
    }

    get = async (req, res) => {
        const { id } = req.params
        const testamonials = await this.service.get(id)
        res.send(testamonials)
    }

    getUser = async (req, res) => {
        const testamonials = await this.service.get(req.uid)
        res.send(testamonials)
    }

    create = async (req, res) => {
        await validationHandler(req.body, testamonialValidation.create)
        const { id } = req.params
        const { testamonial } = req.body
        const item = await this.service.create(testamonial, req.uid, id)
        res.send(item)
    }
}

const testamonialController = new TestamonialController()

module.exports = testamonialController