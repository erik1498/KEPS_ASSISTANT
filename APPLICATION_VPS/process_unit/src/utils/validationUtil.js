import Joi from "joi"

export const generateValidationMessage = (error) => {
    let errorMessageObject = []
    error.details.map((err) => {
        errorMessageObject.push({
            prop: err.path[0],
            message: err.message
        })
    })
    return errorMessageObject
}

export const bulanTahunValidation = (payload) => {
    console.log(payload)
    const schema = Joi.object({
        bulan: Joi.number().required().messages({
            'number.base': "Harus Berupa Angka",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        tahun: Joi.number().required().messages({
            'number.base': "Harus Berupa Angka",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        })
    })

    return schema.validate(payload)
}