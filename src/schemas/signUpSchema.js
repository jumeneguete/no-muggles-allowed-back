import joi from 'joi'

const signUpSchema = joi.object({
    name: joi.string().alphanum().min(2).max(20).required(),
    lastName: joi.string().alphanum().min(2).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().min(3).max(20).required(),
    passwordConfirmation: joi.ref('password'),
})

export default signUpSchema;