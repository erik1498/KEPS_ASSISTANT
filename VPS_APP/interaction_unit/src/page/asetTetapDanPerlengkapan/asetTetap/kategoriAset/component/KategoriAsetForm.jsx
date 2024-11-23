import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formValidation, showAlert, showError } from "../../../../../helper/form.helper"
import { apiKategoriAsetCRUD, apiKodeAkunCRUD } from "../../../../../service/endPointList.api"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"

const KategoriAsetForm = ({
    setAddKategoriAsetEvent = () => { },
    kategoriAsetEdit,
    getData = () => { }
}) => {
    const [namaKategoriAset, setNamaKategoriAset] = useState(kategoriAsetEdit?.name ? kategoriAsetEdit.name : ``)
    const [kodeAkunPerkiraanDebetKategoriAset, setKodeAkunPerkiraanDebetKategoriAset] = useState(kategoriAsetEdit?.kode_akun_perkiraan_debet ? kategoriAsetEdit.kode_akun_perkiraan_debet : ``)
    const [kodeAkunPerkiraanKreditKategoriAset, setKodeAkunPerkiraanKreditKategoriAset] = useState(kategoriAsetEdit?.kode_akun_perkiraan_kredit ? kategoriAsetEdit.kode_akun_perkiraan_kredit : ``)
    
    const [kodeAkunPerkiraanKategoriAsetList, setKodeAkunPerkiraanKategoriAsetList] = useState([])

    const _getDataKodeAkunPerkiraan = () => {
        apiKodeAkunCRUD
            .custom(``, "GET")
            .then(resData => {
                setKodeAkunPerkiraanKategoriAsetList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (kategoriAsetEdit) {
                        initialDataFromEditObject({
                            editObject: kategoriAsetEdit.kode_akun_perkiraan_debet,
                            dataList: resData.data.entry,
                            setState: setKodeAkunPerkiraanDebetKategoriAset,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        initialDataFromEditObject({
                            editObject: kategoriAsetEdit.kode_akun_perkiraan_kredit,
                            dataList: resData.data.entry,
                            setState: setKodeAkunPerkiraanKreditKategoriAset,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setKodeAkunPerkiraanDebetKategoriAset({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _saveKategoriAset = async () => {
        if (await formValidation()) {
            apiKategoriAsetCRUD
                .custom(`${kategoriAsetEdit?.uuid ? `/${kategoriAsetEdit.uuid}` : ``}`, kategoriAsetEdit ? "PUT" : "POST", null, {
                    data: {
                        name: namaKategoriAset,
                        kode_akun_perkiraan_debet: kodeAkunPerkiraanDebetKategoriAset.value,
                        kode_akun_perkiraan_kredit: kodeAkunPerkiraanKreditKategoriAset.value
                    }
                }).then(() => {
                    if (kategoriAsetEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddKategoriAsetEvent()
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
                <h1 className="uppercase text-gray-600 font-bold">{kategoriAsetEdit ? `Edit` : `Tambahkan`} Kategori Aset</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddKategoriAsetEvent()}
                ><FaTimes /> Batalkan Kategori Aset
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormInputWithLabel
                    label={"Nama Kategori Aset"}
                    type={"text"}
                    onchange={(e) => {
                        setNamaKategoriAset(e.target.value)
                    }}
                    others={
                        {
                            value: namaKategoriAset,
                            name: "namaKategoriAset"
                        }
                    }
                />
                <FormSelectWithLabel
                    label={"Kode Akun Debet"}
                    optionsDataList={kodeAkunPerkiraanKategoriAsetList}
                    optionsLabel={["code", "name"]}
                    optionsDelimiter={"-"}
                    optionsLabelIsArray={true}
                    optionsValue={"uuid"}
                    selectValue={kodeAkunPerkiraanDebetKategoriAset}
                    onchange={(e) => {
                        setKodeAkunPerkiraanDebetKategoriAset(e)
                    }}
                    selectName={`kodeAkunPerkiraanDebetDaftarAset`}
                />
                <FormSelectWithLabel
                    label={"Kode Akun Kredit"}
                    optionsDataList={kodeAkunPerkiraanKategoriAsetList}
                    optionsLabel={["code", "name"]}
                    optionsDelimiter={"-"}
                    optionsLabelIsArray={true}
                    optionsValue={"uuid"}
                    selectValue={kodeAkunPerkiraanKreditKategoriAset}
                    onchange={(e) => {
                        setKodeAkunPerkiraanKreditKategoriAset(e)
                    }}
                    selectName={`kodeAkunPerkiraanKreditDaftarAset`}
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _saveKategoriAset()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default KategoriAsetForm