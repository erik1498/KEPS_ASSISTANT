import Joi from "joi"

export const statusRiwayatAktivitasDokumenPegawaiPelaksanaValidation = (payload) => {
    const schema = Joi.object({
        status_riwayat_aktivitas_dokumen: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
        pegawai_pelaksana: Joi.string().required().messages({
            'string.base': "Harus Berupa Text",
            "string.empty": "Harus Diisi",
            "any.required": "Harus Diisi",
        }),
    })

    return schema.validate(payload)
}