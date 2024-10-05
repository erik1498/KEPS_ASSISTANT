import Joi from "joi"

export const rincianPengembalianDendaPenjualanBarangValidation = (payload) => {
    const schema = Joi.object({
        pengembalian_denda_penjualan_barang: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        rincian_pesanan_penjualan_barang: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        denda_yang_dikembalikan: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
    })

    return schema.validate(payload)
}