import { useEffect, useState } from "react"
import PageTitle from "../../../../component/general/PageTitle"
import Wrap from "../../../../component/layout/Wrap"
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa"
import BulanSelectedListCard from "../../../../component/card/BulanSelectedListCard"
import DebetKreditStatusCard from "../../../../component/card/DebetKreditStatusCard"
import KasRow from "./component/KasRow"
import { apiRincianTransaksiKasCRUD, apiTransaksiKasCRUD } from "../../../../service/endPointList.api"
import { useDataContext } from "../../../../context/dataContext.context"
import { showAlert, showDialog, showError } from "../../../../helper/form.helper"
import KasForm from "./component/KasForm"
import { normalizeDataJurnalUmum } from "../../../../helper/jurnalUmum.helper"
import CheckListBox from "../../../../component/general/CheckListBox"
import { TipeTransaksi } from "../../../../config/objectList.config"

const KasPage = () => {

    const dataContext = useDataContext()
    const { data, setData } = dataContext

    const [isLoading, setIsLoading] = useState(false)
    const [balanceStatus, setBalanceStatus] = useState(true)

    const [checkListBox, setCheckListBox] = useState(TipeTransaksi.map(x => x.value))

    const [search, setSearch] = useState("")
    const [bulan, setBulan] = useState(new Date().getMonth())

    const [daftarTransaksi, setDaftarTransaksi] = useState([])
    const [transaksiKas, setTransaksiKas] = useState([])
    const [transaksiSelected, setTransaksiSelected] = useState()

    const [debet, setDebet] = useState(0)
    const [kredit, setKredit] = useState(0)

    const [addTransaksi, setAddTransaksi] = useState(false)


    const _getData = (searchParam = "") => {
        setIsLoading(true)
        if (searchParam == "") {
            setSearch(searchParam)
        }
        apiTransaksiKasCRUD
            .custom(`/${bulan + 1}/${data.tahun}?search=${searchParam}`, "GET")
            .then(async (resData) => {
                setDaftarTransaksi(x => x = resData.data)
                setIsLoading(false)
            })
            .catch(err => {
                showError(err)
            })
    };

    const _deleteTransaksi = async (uuid) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data ini ?")) {
            apiRincianTransaksiKasCRUD
                .custom(`/${uuid}`, "DELETE")
                .then((data) => {
                    showAlert("Berhasil", "Transaksi berhasil dihapus")
                    _getData()
                }).catch(err => {
                    showError(err)
                    _getData()
                })
        }
    }

    const _deleteByBuktiTransaksi = async (item) => {
        if (await showDialog("Hapus", "Yakin ingin hapus data di bukti transaksi ini ?")) {
            setIsLoading(true)
            apiTransaksiKasCRUD
                .custom(`/${item.data[0][0].uuid}`, "DELETE")
                .then(() => {
                    showAlert("Berhasil", "Transaksi berhasil dihapus")
                    _getData()
                }).catch(err => {
                    showError(err)
                    _getData()
                })
        }
    }

    const _editTransaksi = async (item) => {
        setIsLoading(true)
        setTransaksiSelected(item.data[0][0].uuid)
        setAddTransaksi(true)
        setIsLoading(false)
    }

    const normalizeData = async () => {
        const dataFix = daftarTransaksi.filter(x => checkListBox.filter(i => i == x.type).length > 0)
        let normalizedData = await normalizeDataJurnalUmum(dataFix.map(x => {
            x.bulan = bulan + 1
            x.tahun = data.tahun
            x.waktu = x.waktu ? x.waktu : x.tanggal.split("T")[1].replace(".000", "")
            x.tanggal = x.tanggal.length > 2 ? new Date(x.tanggal).getDate() : x.tanggal
            return x
        }))
        setTransaksiKas(normalizedData.returnData)
        setDebet(normalizedData.totalDebet)
        setKredit(normalizedData.totalKredit)
    }

    useEffect(() => {
        normalizeData()
    }, [checkListBox, daftarTransaksi])

    useEffect(() => {
        _getData()
    }, [bulan])

    useEffect(() => {
        if (!addTransaksi) {
            _getData()
        }
    }, [addTransaksi])

    return <Wrap
        isLoading={isLoading}>
        <div>
            {
                addTransaksi ?
                    <KasForm
                        setAddTransaksiEvent={
                            () => setAddTransaksi(!addTransaksi)
                        }
                        transaksiSelected={transaksiSelected}
                        getData={_getData}
                    /> :
                    <>
                        <PageTitle title="Transaksi Kas" />
                        <div className="bg-white py-3 px-6 mb-3 rounded-md flex justify-between shadow-2xl">
                            <label className="input input-sm input-bordered flex items-center gap-2 bg-white">
                                <input type="text" className="grow bg-transparent" placeholder="Cari" value={search} onChange={(e) => setSearch(e.target.value)} />
                                {
                                    !balanceStatus ?
                                        <FaTimes className="cursor-pointer" onClick={() => {
                                            _getData("")
                                        }} /> :
                                        <FaSearch className="cursor-pointer" onClick={() => _getData(search)} />
                                }
                            </label>
                            <div>
                                <button className="btn btn-sm bg-blue-900 text-white border-none" onClick={() => {
                                    setTransaksiSelected(null)
                                    setAddTransaksi(true)
                                }}><FaPlus /> Tambah Transaksi</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-6">
                            <div className="col-span-1">
                                <BulanSelectedListCard
                                    bulan={bulan}
                                    setBulan={setBulan}
                                />
                                {
                                    balanceStatus ?
                                        <DebetKreditStatusCard
                                            debet={debet}
                                            kredit={kredit}
                                        /> : <></>
                                }
                            </div>
                            <div className="col-span-5">
                                <div className="h-[65vh] pl-2">
                                    <CheckListBox
                                        checkListBox={checkListBox}
                                        setCheckListBox={setCheckListBox}
                                        checkListBoxList={TipeTransaksi}
                                        label="Tipe Transaksi"
                                    />
                                    <div className="flex flex-col h-full overflow-y-scroll no-scrollbar w-full rounded-md">
                                        {
                                            transaksiKas.map((item, i) => {
                                                return <KasRow
                                                    deleteByBuktiTransaksi={_deleteByBuktiTransaksi}
                                                    deleteItem={_deleteTransaksi}
                                                    editItem={_editTransaksi}
                                                    item={item}
                                                    key={i}
                                                    balanceStatus={balanceStatus} />
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </div>
    </Wrap>
}
export default KasPage