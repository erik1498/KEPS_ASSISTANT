import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiKategoriPerlengkapanCRUD, apiKodeAkunCRUD } from "../../../../../service/endPointList.api"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"

const KategoriPerlengkapanForm = ({
    setAddKategoriPerlengkapanEvent = () => { },
    kategoriPerlengkapanEdit,
    getData = () => { }
}) => {
    const [namaKategoriPerlengkapan, setNamaKategoriPerlengkapan] = useState(kategoriPerlengkapanEdit?.name ? kategoriPerlengkapanEdit.name : ``)
    const [kodeAkunPerkiraanKategoriPerlengkapan, setKodeAkunPerkiraanKategoriPerlengkapan] = useState(kategoriPerlengkapanEdit?.kode_akun_perkiraan ? kategoriPerlengkapanEdit.kode_akun_perkiraan : ``)
    
    const [kodeAkunPerkiraanKategoriPerlengkapanList, setKodeAkunPerkiraanKategoriPerlengkapanList] = useState([])

    const _getDataKodeAkunPerkiraan = () => {
        apiKodeAkunCRUD
            .custom(``, "GET")
            .then(resData => {
                setKodeAkunPerkiraanKategoriPerlengkapanList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (kategoriPerlengkapanEdit) {
                        initialDataFromEditObject({
                            editObject: kategoriPerlengkapanEdit.kode_akun_perkiraan,
                            dataList: resData.data.entry,
                            setState: setKodeAkunPerkiraanKategoriPerlengkapan,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setKodeAkunPerkiraanKategoriPerlengkapan({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _saveKategoriPerlengkapan = async () => {
        if (await formValidation()) {
            apiKategoriPerlengkapanCRUD
                .custom(`${kategoriPerlengkapanEdit?.uuid ? `/${kategoriPerlengkapanEdit.uuid}` : ``}`, kategoriPerlengkapanEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaKategoriPerlengkapan,
                        kode_akun_perkiraan: kodeAkunPerkiraanKategoriPerlengkapan.value,
                    }
                }).then(() => {
                    if (kategoriPerlengkapanEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddKategoriPerlengkapanEvent()
                    getData()
                }).catch(err => {
                    showError(err)
                })
        }
    }

    useEffect(() => {
        _getDataKodeAkunPerkiraan()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{kategoriPerlengkapanEdit ? `Edit` : `Tambahkan`} Kategori Perlengkapan</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddKategoriPerlengkapanEvent()}
                ><FaTimes /> Batalkan Kategori Perlengkapan
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Kategori Perlengkapan"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaKategoriPerlengkapan(e.target.value)
                    }}
                    others={
                        {
                            value: namaKategoriPerlengkapan,
                            name: "namaKategoriPerlengkapan"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Kode Akun "}
                    optionsDataList={kodeAkunPerkiraanKategoriPerlengkapanList}
                    optionsLabel={["code", "name"]}
                    optionsDelimiter={"-"}
                    optionsLabelIsArray={true}
                    optionsValue={"uuid"}
                    selectValue={kodeAkunPerkiraanKategoriPerlengkapan}
                    onchange={(e) => {
                        setKodeAkunPerkiraanKategoriPerlengkapan(e)
                    }}
                    selectName={`kodeAkunPerkiraanDaftarPerlengkapan`}
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveKategoriPerlengkapan()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default KategoriPerlengkapanForm