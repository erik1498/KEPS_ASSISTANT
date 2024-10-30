import Wrap from "../../../../component/layout/Wrap"
import PageTitle from "../../../../component/general/PageTitle"
import { useEffect, useState } from "react"
import FormSelectWithLabel from "../../../../component/form/FormSelectWithLabel"
import { apiPerintahStokOpnameCRUD } from "../../../../service/endPointList.api"
import { showError } from "../../../../helper/form.helper"
import FormInputWithLabel from "../../../../component/form/FormInputWithLabel"
import { formatDate } from "../../../../helper/date.helper"

const JurnalStokOpnamePage = () => {

    const [isLoading, setIsLoading] = useState(false)

    const [perintahStokOpnameList, setPerintahStokOpnameList] = useState([])
    const [perintahStokOpname, setPerintahStokOpname] = useState()

    const [jurnal, setJurnal] = useState([])

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
                console.log(resData.data)
            }).catch(err => showError(err))
    }

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
                    <div className="overflow-x-auto h-[50vh] no-scrollbar pb-4">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr className="sticky top-0 bg-white py-4 text-black">
                                    <th width={12}>No</th>
                                    <th>Tanggal</th>
                                    <th>Nomor Penyesuaian Persediaan</th>
                                    <th>Pegawai Penanggung Jawab</th>
                                    <th>Pegawai Pelaksana</th>
                                    <th>Kategori Barang</th>
                                    <th>Gudang Asal</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    jurnal?.map((item, i) => {
                                        return <>
                                            <tr key={i}>
                                                <td>{i + 1}.</td>
                                                <td>{formatDate(item.tanggal, true)}</td>
                                                <td>{item.nomor_surat_perintah}</td>
                                                <td>{item.pegawai_penanggung_jawab_name}</td>
                                                <td>{item.pegawai_pelaksana_name}</td>
                                                <td>{item.kategori_barang_name}</td>
                                                <td>{item.daftar_gudang_name}</td>
                                            </tr>
                                        </>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Wrap>
}
export default JurnalStokOpnamePage