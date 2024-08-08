import { useEffect, useState } from "react"
import FormSelectWithLabel from "../../../component/form/FormSelectWithLabel"
import { apiStatusRiwayatAktivitasDokumenPegawaiPelaksana } from "../../../service/endPointList.api"
import { formValidation } from "../../../helper/form.helper"
import { FaPlus, FaTimes } from "react-icons/fa"
import LoadingPage from "../../../component/layout/LoadingPage"
import { pegawaiList } from "../../../config/objectList.config"

const PegawaiPelaksana = ({
    idStatusRiwayatAktivitasDokumen
}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [pegawaiPelaksana, setPegawaiPelaksana] = useState()

    const [pegawaiPelaksanaList, setPegawaiPelaksanaList] = useState([])

    const getAllPegawaiPelaksana = () => {
        setIsLoading(x => x = true)
        apiStatusRiwayatAktivitasDokumenPegawaiPelaksana
            .custom(`/${idStatusRiwayatAktivitasDokumen}`, "GET")
            .then((res) => {
                setIsLoading(x => x = false)
                setPegawaiPelaksanaList(res.data.entry)
            })
    }

    const hapusPegawaiPelaksana = (uuid) => {
        setIsLoading(x => x = true)
        apiStatusRiwayatAktivitasDokumenPegawaiPelaksana
            .custom(`/${uuid}`, "DELETE")
            .then(() => {
                getAllPegawaiPelaksana()
            }).catch(err => console.log(err))
    }

    const simpanPegawaiPelaksana = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            setIsLoading(x => x = true)
            apiStatusRiwayatAktivitasDokumenPegawaiPelaksana
                .custom("", "POST", null, {
                    data: {
                        status_riwayat_aktivitas_dokumen: idStatusRiwayatAktivitasDokumen,
                        pegawai_pelaksana: pegawaiPelaksana.value
                    }
                }).then(res => {
                    getAllPegawaiPelaksana()
                })
        }
    }

    useEffect(() => {
        getAllPegawaiPelaksana()
    }, [])

    return isLoading ?
        <LoadingPage />
        :
        <>
            <form onSubmit={e => simpanPegawaiPelaksana(e)}>
                <div className="flex sticky bottom-0 bg-white py-3 w-max items-end gap-x-2">

                    <FormSelectWithLabel
                        label={"Staf Pelaksana"}
                        onchange={(e) => {
                            setPegawaiPelaksana(e)
                        }}
                        optionsDataList={pegawaiList}
                        optionsLabel={"nama"}
                        optionsValue={"nama"}
                        selectValue={pegawaiPelaksana}
                        selectName={"kodeAkunType"}
                    />

                    <button className="btn btn-sm bg-blue-800 mt-4 text-white"
                        type="submit">
                        <FaPlus /> Tambah Staf Pelaksana
                    </button>
                </div>
            </form>

            <div className="flex gap-x-2">
                {
                    pegawaiPelaksanaList.map((itemk, k) => {
                        return <div className="flex gap-x-3 items-center px-2 rounded-lg bg-gray-500">
                            <p className="px-4 py-1 text-sm font-bold text-white">
                                {itemk.pegawai_pelaksana}
                            </p>
                            <FaTimes
                                onClick={() => hapusPegawaiPelaksana(itemk.uuid)}
                                className="text-white cursor-pointer" size={20}
                            />
                        </div>
                    })
                }
            </div>
        </>
}
export default PegawaiPelaksana