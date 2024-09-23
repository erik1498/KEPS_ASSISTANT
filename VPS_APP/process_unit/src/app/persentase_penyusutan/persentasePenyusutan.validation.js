import Joi from "joi"

export const persentasePenyusutanValidation = (payload) => {
    const schema = Joi.object({
        metode_penyusutan: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        kelompok_aset: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        persentase: Joi.number().max(100).required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
    })

    return schema.validate(payload)
}