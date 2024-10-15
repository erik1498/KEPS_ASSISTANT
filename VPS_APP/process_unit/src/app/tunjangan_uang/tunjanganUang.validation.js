import Joi from "joi"

export const tunjanganUangValidation = (payload) => {
    const schema = Joi.object({
        pegawai: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        periode: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        gaji: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        kode_akun_perkiraan: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        tanggal: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        bukti_transaksi: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        bonus: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        insentif: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        thr: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        bpjs_kesehatan: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        bpjs_kesehatan_persentase: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        jkk: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        jkk_persentase: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        jkm: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        jkm_persentase: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        jht: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        jht_persentase: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        jp: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        jp_persentase: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        bpjs_karyawan: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        bpjs_karyawan_persentase: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        jp_karyawan: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        jp_karyawan_persentase: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        jht_karyawan: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        jht_karyawan_persentase: Joi.number().required().messages({
            'number.base': "Harus Berupa Number",
            "number.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
    })

    return schema.validate(payload)
}