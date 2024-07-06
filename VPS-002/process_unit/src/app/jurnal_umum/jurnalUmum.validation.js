import Joi from "joi"

export const jurnalUmumValidation = (payload) => {
    const schema = Joi.object({
        tanggal: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        bulan: Joi.required().messages({
            "any.required": "Harus Diisi",
        }),
        tahun: Joi.required().messages({
            "any.required": "Harus Diisi",
        }),
        waktu: Joi.required().messages({
            "any.required": "Harus Diisi",
        }),
        uraian: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        debet: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        kredit: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        kode_akun_uuid: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        bukti_transaksi: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        transaksi: Joi.required().messages({
            "any.required": "Harus Diisi",
        }),
        uuidList: Joi.required()
    })

    return schema.validate(payload)
}