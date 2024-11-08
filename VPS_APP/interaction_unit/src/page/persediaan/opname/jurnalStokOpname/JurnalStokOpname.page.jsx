import Wrap from "../../../../component/layout/Wrap"
import PageTitle from "../../../../component/general/PageTitle"
import { useEffect, useState } from "react"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { apiPerintahStokOpnameCRUD } from "../../../../service/endPointList.api"
import { showError } from "../../../../helper/form.helper"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { formatDate, getBulanByIndex } from "../../../../helper/date.helper"
import { normalizeDataJurnalPerintahStokOpname, normalizeDataJurnalUmum } from "../../../../helper/jurnalUmum.helper"
import JurnalStokOpnameRow from "./component/JurnalStokOpnameRow"
import { useDataContext } from "../../../../context/dataContext.context"
import DebetKreditStatusCard from "../../../../component/card/DebetKreditStatusCard"

const JurnalStokOpnamePage = () => {
    const dataContext = useDataContext()
    const { data } = dataContext

    const [isLoading, setIsLoading] = useState(false)

    const [perintahStokOpnameList, setPerintahStokOpnameList] = useState([])
    const [perintahStokOpname, setPerintahStokOpname] = useState(null)

    const [debet, setDebet] = useState(0)
    const [kredit, setKredit] = useState(0)

    const [jurnal, setJurnal] = useState([])

    const [validasi, setValidasi] = useState(false)

    const [jurnalNormalized, setJurnalNormalized] = useState([])

    const _getDataPerintahStokOpname = () => {
        setIsLoading(x => x = true)
        apiPerintahStokOpnameCRUD
            .custom(`?tahun=${data.tahun}`, "GET")
            .then(resData => {
                setIsLoading(x => x = false)
                setPerintahStokOpnameList(x => x = resData.data.entry)
            }).catch(err => {
                setIsLoading(x => x = false)
                showError(err)
            })
    }

    const _getDataFromPerintahStokOpname = () => {
        const perintahStokOpnameGet = perintahStokOpnameList.filter(x => x.uuid == perintahStokOpname?.value)
        return perintahStokOpnameGet.length > 0 ? perintahStokOpnameGet[0] : null
    }

    const _getDataJurnalPerintahStokOpname = () => {
        apiPerintahStokOpnameCRUD
            .custom(`/jurnal/${perintahStokOpname.value}`, "GET")
            .then(resData => {
                setJurnal(resData.data)
            }).catch(err => showError(err))
    }

    const normalizeData = async () => {

        const normalizedData = await normalizeDataJurnalUmum(normalizeDataJurnalPerintahStokOpname(jurnal))

        setDebet(normalizedData.totalDebet)
        setKredit(normalizedData.totalKredit)
        setJurnalNormalized(normalizedData?.returnData)
    }

    const _validasiPerintahStokOpname = () => {
        apiPerintahStokOpnameCRUD
            .custom("/validasi", "PUT", null, {
                data: {
                    validasi: !_getDataFromPerintahStokOpname()?.validasi,
                    perintah_stok_opname: _getDataFromPerintahStokOpname()?.uuid
                }
            }).then(() => {
                const index = perintahStokOpnameList.findIndex(x => x.uuid == _getDataFromPerintahStokOpname()?.uuid)
                const perintahStokOpnameListCopy = perintahStokOpnameList
                perintahStokOpnameListCopy[index].validasi = !_getDataFromPerintahStokOpname().validasi

                setValidasi(perintahStokOpnameListCopy[index].validasi)

                setPerintahStokOpnameList(x => x = perintahStokOpnameListCopy)

            }).catch(err => showError(err))
    }

    useEffect(() => {
        normalizeData()
    }, [jurnal])

    useEffect(() => {
        if (perintahStokOpname) {

            const perintahStokOpname = perintahStokOpnameList.filter(x => x.uuid == _getDataFromPerintahStokOpname()?.uuid)
            setValidasi(perintahStokOpname.at(0).validasi)

            _getDataJurnalPerintahStokOpname()
        }
    }, [perintahStokOpname])

    useEffect(() => {
        _getDataPerintahStokOpname()
    }, [])

    return <Wrap
        isLoading={isLoading}>
        <div>
            <PageTitle title="Jurnal Stok Opname" />
            <div className="bg-white rounded-md shadow-sm h-max">
                <div className="py-5 px-6 h-max w-full z-10">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-2">Perintah Stok Opname</h1>
                    </div>

                    <div className="flex gap-y-2">
                        <FormSelectWithLabel
                            label={"Perintah Stok Opname"}
                            optionsDataList={perintahStokOpnameList}
                            optionsLabel={"nomor_surat_perintah"}
                            optionsValue={"uuid"}
                            selectValue={perintahStokOpname}
                            onchange={(e) => {
                                setPerintahStokOpname(e)
                            }}
                            selectName={`perintahStokOpname`}
                        />
                        <FormInputWithLabel
                            label={"Pegawai Penanggung Jawab"}
                            disabled={true}
                            addClassInput="border-none px-1"
                            others={{
                                value: _getDataFromPerintahStokOpname()?.pegawai_penanggung_jawab_name
                            }}
                        />
                        <FormInputWithLabel
                            label={"Pegawai Pelaksana"}
                            disabled={true}
                            addClassInput="border-none px-1"
                            others={{
                                value: _getDataFromPerintahStokOpname()?.pegawai_pelaksana_name
                            }}
                        />
                    </div>
                    <div className="mt-5 flex gap-x-2">
                        <FormInputWithLabel
                            label={"Kategori Barang"}
                            disabled={true}
                            addClassInput="border-none px-1"
                            others={{
                                value: _getDataFromPerintahStokOpname()?.kategori_barang_name
                            }}
                        />
                        <FormInputWithLabel
                            label={"Gudang Asal"}
                            disabled={true}
                            addClassInput="border-none px-1"
                            others={{
                                value: _getDataFromPerintahStokOpname()?.daftar_gudang_name
                            }}
                        />
                        <FormInputWithLabel
                            label={"Tanggal Mulai"}
                            disabled={true}
                            addClassInput="border-none px-1"
                            others={{
                                value: formatDate(_getDataFromPerintahStokOpname()?.tanggal)
                            }}
                        />
                        <FormInputWithLabel
                            label={"Tanggal Selesai"}
                            disabled={true}
                            addClassInput="border-none px-1"
                            others={{
                                value: _getDataFromPerintahStokOpname()?.tanggal_selesai != "BELUM SELESAI" ? formatDate(_getDataFromPerintahStokOpname()?.tanggal_selesai) : "BELUM SELESAI"
                            }}
                        />
                        <FormInputWithLabel
                            label={"Bulan Transaksi"}
                            disabled={true}
                            addClassInput="border-none px-1"
                            others={{
                                value: getBulanByIndex(_getDataFromPerintahStokOpname()?.bulan_transaksi - 1)
                            }}
                        />
                    </div>
                    <div className="mt-5 flex">
                        {
                            validasi && perintahStokOpname ? <button
                                onClick={() => _validasiPerintahStokOpname()}
                                className="btn btn-sm bg-red-900 text-white">Batal Validasi</button>
                                : <button
                                    onClick={() => _validasiPerintahStokOpname()}
                                    className="btn btn-sm bg-green-900 text-white">Validasi</button>
                        }
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-6 gap-x-2 mt-2">
                <div className="col-span-1">
                    <DebetKreditStatusCard
                        debet={debet}
                        kredit={kredit}
                    />
                </div>
                <div className="col-span-5">
                    <div className="h-[65vh]">
                        <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                            {
                                jurnalNormalized.map((item, i) => {
                                    return <JurnalStokOpnameRow
                                        item={item}
                                        key={i}
                                        forPrint={false}
                                    />
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Wrap>
}
export default JurnalStokOpnamePage