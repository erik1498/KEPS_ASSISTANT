import { useEffect, useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { apiDaftarAsetCRUD, apiHitunganPenyusutanCRUD } from "../../../../service/endPointList.api"
import { FaCheck, FaTimes } from "react-icons/fa"
import HitunganPenyusutanTable from "./component/HitunganPenyusutanTable"
import { showError } from "../../../../helper/form.helper"

const HitunganPenyusutanPage = () => {

    const [validasiStatus, setValidasiStatus] = useState(false)
    const [asetList, setAsetList] = useState([])
    const [aset, setAset] = useState()
    const [idAset, setIdAset] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [hitunganList, setHitunganList] = useState([])

    const _getDataAset = () => {
        apiDaftarAsetCRUD
            .custom("", "GET")
            .then(resData => {
                setAsetList(resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setAset({
                        label: resData.data.entry[0].name,
                        value: resData.data.entry[0].uuid,
                    })
                }
            })
    }

    const _getHitunganPenyusutan = () => {
        setValidasiStatus(false)
        apiHitunganPenyusutanCRUD.custom(`/${idAset}`, "GET")
            .then(resData => {
                setHitunganList(resData.data)
                if (resData.data.length > 0) {
                    if (resData.data[0]?.daftar_aset) {
                        setValidasiStatus(true)
                    }
                }
            })
    }

    const _validasiHitunganAset = () => {
        apiHitunganPenyusutanCRUD.custom(``, "POST", null, {
            data: {
                uuid: idAset
            }
        }).then(() => {
            _getHitunganPenyusutan()
        }).catch(err => showError(err))
    }

    const _batalValidasiHitunganAset = () => {
        apiHitunganPenyusutanCRUD
            .custom(`/${idAset}`, "DELETE")
            .then(() => {
                _getHitunganPenyusutan()
            }).catch(err => showError(err))
    }

    useEffect(() => {
        if (idAset) {
            _getHitunganPenyusutan()
        }
    }, [idAset])

    useEffect(() => {
        _getDataAset()
    }, [])

    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title="Hitungan Penyusutan" />
            <div className="bg-white rounded-md shadow-2xl h-max px-6 py-5">
                <div className="flex items-end gap-x-2 mb-5">
                    <FormSelectWithLabel
                        label={"Pilih Aset"}
                        optionsDataList={asetList}
                        optionsLabel={"name"}
                        optionsValue={"uuid"}
                        disabled={idAset}
                        selectValue={aset}
                        onchange={(e) => {
                            setAset(e)
                        }}
                        selectName={`aset`}
                    />
                    {
                        idAset ?
                            <>
                                <button
                                    className="btn btn-sm bg-red-800 text-white"
                                    onClick={() => setIdAset(null)}
                                >
                                    <FaTimes /> Reset Aset
                                </button>

                                {
                                    validasiStatus ? <button
                                        className="btn btn-sm bg-red-800 text-white"
                                        onClick={() => _batalValidasiHitunganAset(aset.value)}
                                    >
                                        <FaTimes /> Batal Validasi Hitungan Aset
                                    </button> : <button
                                        className="btn btn-sm bg-green-800 text-white"
                                        onClick={() => _validasiHitunganAset(aset.value)}
                                    >
                                        <FaCheck /> Validasi Hitungan Aset
                                    </button>
                                }
                            </>
                            :
                            <button
                                className="btn btn-sm bg-green-800 text-white"
                                onClick={() => setIdAset(aset.value)}
                            >
                                <FaCheck /> Pilih Aset
                            </button>
                    }
                </div>
            </div>
            {
                idAset ?
                    <>
                        <HitunganPenyusutanTable
                            hitunganList={hitunganList}
                            metodePenyusutanName={asetList?.filter(x => x.uuid == idAset).at(0).metode_penyusutan_name}
                        />
                    </>
                    :
                    <></>
            }
        </div>


    </Wrap>
}
export default HitunganPenyusutanPage