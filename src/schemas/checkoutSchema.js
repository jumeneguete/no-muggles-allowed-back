import joi from "joi"

const adressSchema = joi.object({
    titleAddress: joi.string().required(),
    address: joi.string().required(),
    CPF: joi.string().pattern(/^[0-9]{3}[0-9]{3}[0-9]{3}[0-9]{2}$/, "CPF inválido").required()
})

export { adressSchema }