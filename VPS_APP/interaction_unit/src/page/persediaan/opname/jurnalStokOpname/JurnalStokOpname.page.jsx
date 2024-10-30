import Wrap from "../../../../component/layout/Wrap"
import PageTitle from "../../../../component/general/PageTitle"
import { useEffect, useState } from "react"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { apiPerintahStokOpnameCRUD } from "../../../../service/endPointList.api"
import { showError } from "../../../../helper/form.helper"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { formatDate } from "../../../../helper/date.helper"
import { normalizeDataJurnalUmum } from "../../../../helper/jurnalUmum.helper"
import JurnalStokOpnameRow from "./component/JurnalStokOpnameRow"

const JurnalStokOpnamePage = () => {

    const [isLoading, setIsLoading] = useState(false)

    const [perintahStokOpnameList, setPerintahStokOpnameList] = useState([])
    const [perintahStokOpname, setPerintahStokOpname] = useState()

    const [jurnal, setJurnal] = useState([])

    const [jurnalNormalized, setJurnalNormalized] = useState([])

    const _getDataPerintahStokOpname = () => {
        setIsLoading(x => x = true)
        apiPerintahStokOpnameCRUD
            .custom("", "GET")
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
        let normalizedData = await normalizeDataJurnalUmum(jurnal.map(x => {
            x.waktu = x.waktu.split("T")[1].replace(".000", "")
            x.tanggal = x.tanggal.length > 2 ? new Date(x.tanggal).getDate() : x.tanggal
            return x
        }))
        setJurnalNormalized(normalizedData?.returnData)
    }

    useEffect(() => {
        normalizeData()
    }, [jurnal])

    useEffect(() => {
        if (perintahStokOpname) {
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

                    <div className="flex gap-x-2">
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
                                value: formatDate(_getDataFromPerintahStokOpname()?.tanggal_selesai)
                            }}
                        />
                    </div>
                </div>
            </div>


            <div className="bg-white rounded-md shadow-sm h-max mt-5">

                <div className="py-5 px-6 h-max w-full z-10">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-2">Jurnal Stok Opname</h1>
                    </div>
                    <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                        {
                            jurnalNormalized.map((item, i) => {
                                return <JurnalStokOpnameRow
                                    item={item}
                                    key={i}
                                    forPrint={true}
                                />
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    </Wrap>
}
export default JurnalStokOpnamePage