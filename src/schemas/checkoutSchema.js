import joi from "joi"

const adressSchema = joi.object({
    titleAddress: joi.string().required(),
    address: joi.string().required(),
    CPF: joi.string().pattern(/^[0-9]{3}[0-9]{3}[0-9]{3}[0-9]{2}$/, "CPF inválido").required()
})

const cardSchema = joi.object({
    cardNumber: joi.number().integer().positive().min(999999999999999).max(9999999999999990).required(),
    cardName: joi.string().required(),
    validity: joi.date().required()
})

export { adressSchema, cardSchema }