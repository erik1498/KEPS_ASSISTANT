import { FaSave, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { formShowMessage, formValidation, showAlert } from "../../../../../helper/form.helper"
import { apiKelompokAsetCRUD, apiMetodePenyusutanCRUD, apiPersentasePenyusutanCRUD } from "../../../../../service/endPointList.api"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import { initialDataFromEditObject } from "../../../../../helper/select.helper"
import { inputOnlyNumber } from "../../../../../helper/actionEvent.helper"

const PersentasePenyusutanForm = ({
    setAddPersentasePenyusutanEvent = () => { },
    persentasePenyusutanEdit,
    getData = () => { }
}) => {
    const [metodePenyusutanList, setMetodePenyusutanList] = useState([])
    const [metodePenyusutan, setMetodePenyusutan] = useState(null)
    const [kelompokAsetList, setKelompokAsetList] = useState([])
    const [kelompokAset, setKelompokAset] = useState(null)
    const [namaMasaPenyusutan, setMasaPenyusutan] = useState(null)
    const [nilaiPersentasePenyusutan, setNilaiPersentasePenyusutan] = useState(persentasePenyusutanEdit?.persentase ? persentasePenyusutanEdit.persentase : 0)

    const _savePersentasePenyusutan = async () => {
        if (await formValidation()) {
            apiPersentasePenyusutanCRUD
                .custom(`${persentasePenyusutanEdit?.uuid ? `/${persentasePenyusutanEdit.uuid}` : ``}`, persentasePenyusutanEdit ? "PUT" : "POST", null, {
                    data: {
                        metode_penyusutan: metodePenyusutan.value,
                        kelompok_aset: kelompokAset.value,
                        persentase: nilaiPersentasePenyusutan
                    }
                }).then(() => {
                    if (persentasePenyusutanEdit) {
                        showAlert("Berhasil", "Data berhasil diupdate")
                    } else {
                        showAlert("Berhasil", "Data berhasil disimpan")
                    }
                    setAddPersentasePenyusutanEvent()
                    getData()
                }).catch(err => {
                    formShowMessage(JSON.parse(err.response.data.errorData))
                })
        }
    }

    const _getDataMetodePenyusutan = () => {
        apiMetodePenyusutanCRUD
            .custom(``, "GET")
            .then(resData => {
                setMetodePenyusutanList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (persentasePenyusutanEdit) {
                        initialDataFromEditObject({
                            editObject: persentasePenyusutanEdit.metode_penyusutan,
                            dataList: resData.data.entry,
                            setState: setMetodePenyusutan,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setMetodePenyusutan({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    const _getDataKelompokAset = () => {
        apiKelompokAsetCRUD
            .custom(``, "GET")
            .then(resData => {
                setKelompokAsetList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    if (persentasePenyusutanEdit) {
                        initialDataFromEditObject({
                            editObject: persentasePenyusutanEdit.kelompok_aset,
                            dataList: resData.data.entry,
                            setState: setKelompokAset,
                            labelKey: "name",
                            valueKey: "uuid",
                        })
                        return
                    }
                    setKelompokAset({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            }).catch(err => {
                showError(err)
            })
    }

    useEffect(() => {
        if (kelompokAset) {
            const kelompokAsetGet = kelompokAsetList.filter(x => x.uuid == kelompokAset.value)
            if (kelompokAsetGet.length > 0) {
                setMasaPenyusutan(x => x = `${kelompokAsetGet[0].masa_penyusutan} Tahun`)
            }
        }
    }, [kelompokAset])

    useEffect(() => {
        if (parseFloat(nilaiPersentasePenyusutan) > 100) {
            setNilaiPersentasePenyusutan(x => x = 100)
        }
    }, [nilaiPersentasePenyusutan])

    useEffect(() => {
        _getDataMetodePenyusutan()
        _getDataKelompokAset()
    }, [])

    return <>
        <div className="bg-white px-6 py-3 rounded-md shadow-2xl">
            <div className="mb-3 flex justify-between items-center">
                <h1 className="uppercase text-gray-600 font-bold">{persentasePenyusutanEdit ? `Edit` : `Tambahkan`} Persentase Penyusutan</h1>
                <button
                    className="btn btn-sm bg-red-900 text-white border-none"
                    onClick={() => setAddPersentasePenyusutanEvent()}
                ><FaTimes /> Batalkan Persentase Penyusutan
                </button>
            </div>
            <div className="flex gap-x-2">
                <FormSelectWithLabel
                    label={"Metode Penyusutan"}
                    optionsDataList={metodePenyusutanList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={metodePenyusutan}
                    onchange={(e) => {
                        setMetodePenyusutan(e)
                    }}
                    selectName={`metodePenyusutan`}
                />
                <FormSelectWithLabel
                    label={"Kelompok Aset"}
                    optionsDataList={kelompokAsetList}
                    optionsLabel={"name"}
                    optionsValue={"uuid"}
                    selectValue={kelompokAset}
                    onchange={(e) => {
                        setKelompokAset(e)
                    }}
                    selectName={`kelompokAset`}
                />
                <FormInputWithLabel
                    label={"Masa Penyusutan ( Tahun )"}
                    type={"text"}
                    disabled={true}
                    addClassInput="pointer-events-none border-none"
                    others={
                        {
                            value: namaMasaPenyusutan,
                            name: "namaMasaPenyusutan"
                        }
                    }
                />
                <FormInputWithLabel
                    label={"Persentase ( % )"}
                    type={"text"}
                    onchange={(e) => {
                        inputOnlyNumber(e, 100)
                        setNilaiPersentasePenyusutan(e.target.value)
                    }}
                    others={
                        {
                            value: nilaiPersentasePenyusutan,
                            name: "nilaiPersentasePenyusutan"
                        }
                    }
                />
            </div>
            <button className="btn btn-sm bg-green-800 mt-4 text-white"
                onClick={() => {
                    _savePersentasePenyusutan()
                }}
            ><FaSave /> Simpan</button>
        </div>
    </>
}
export default PersentasePenyusutanForm