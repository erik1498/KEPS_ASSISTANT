import { FaCheck, FaPen, FaSave, FaSearch, FaTimes, FaTrash } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { apiCustomerCRUD, apiPesananPenjualanJasaCRUD } from "../../../../../service/endPointList.api"
import { formValidation, showError } from "../../../../../helper/form.helper"
import PesananPenjualanJasaList from "./PenjualanJasaList"
import Pagination from "../../../../../component/general/Pagination"
import FormInput from "../../../../../component/form/FormInput"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FakturPenjualanJasaForm from "./FakturPenjualanJasaForm"
import { useDataContext } from "../../../../../context/dataContext.context"

const PenjualanJasaForm = ({
    setAddPenjualanJasa = () => { }
}) => {
    const dataContext = useDataContext()
    const { data } = dataContext

    const [tanggalTransaksiAkhir, setTanggalTransaksiAkhir] = useState(getHariTanggalFull())
    const [fakturStatus, setFakturStatus] = useState(false)
    const [ppnStatus, setPPNStatus] = useState(false)
    const [pilihPesananPenjualanJasa, setPilihPesananPenjualanJasa] = useState(false)
    const [editNomorPesananPenjualan, setEditNomorPesananPenjualan] = useState(false)
    const [pesananPenjualanJasaListData, setPesananPenjualanJasaListData] = useState([])
    const [pesananPenjualanJasaSelected, setPesananPenjualanJasaSelected] = useState(true)
    const [rincianPesananPenjualanJasa, setRincianPesananPenjualanJasa] = useState([])

    const [customerList, setCustomerList] = useState([])
    const [nomorPesananPenjualanJasa, setNomorPesananPenjualanJasa] = useState("")
    const [tanggalPesananPenjualanJasa, setTanggalPesananPenjualanJasa] = useState(getHariTanggalFull())
    const [customer, setCustomer] = useState()

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const [pagination, setPagination] = useState({
        page: 1,
        size: 2,
        count: 118,
        lastPage: 12
    })

    const paginateUpdatePage = ({ selected }) => {
        let paginateCopy = pagination
        paginateCopy.page = selected + 1
        setPagination(paginateCopy)
        _getDataCustomer()
    }

    const setSize = (sizeSelected) => {
        let paginateCopy = pagination
        paginateCopy.size = sizeSelected
        paginateCopy.page = 1
        setPagination(paginateCopy)
        _getDataCustomer()
    }

    const [pesananPenjualanJasa, setPesananPenjualanJasa] = useState()

    const _getDataCustomer = (searchParam = "") => {
        if (searchParam == "") {
            setSearch(searchParam)
        }
        apiCustomerCRUD
            .custom(`?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(resData => {
                setSearchStatus(searchParam.length < 1)
                setCustomerList(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
            }).catch(err => {
                showError(err)
            })
    }

    const _deletePesananPenjualan = () => {
        apiPesananPenjualanJasaCRUD
            .custom(`/${pesananPenjualanJasa.uuid}`, "DELETE")
            .then(resData => {
                setPesananPenjualanJasa(null)
                _getAllPesananPenjualanJasa()
            }).catch(err => showError(err))
    }

    const _savePesananPenjualan = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiPesananPenjualanJasaCRUD
                .custom(pesananPenjualanJasaSelected ? `/${pesananPenjualanJasaSelected.value}` : "", pesananPenjualanJasaSelected ? "PUT" : `POST`, null, {
                    data: {
                        nomor_pesanan_penjualan_jasa: nomorPesananPenjualanJasa,
                        tanggal_pesanan_penjualan_jasa: tanggalPesananPenjualanJasa,
                        customer: customer.uuid
                    }
                }).then(resData => {
                    if (pesananPenjualanJasaSelected) {
                        const pesananPenjualanJasaSelectedGet = pesananPenjualanJasaListData.filter(x => x.uuid == pesananPenjualanJasaSelected.value)
                        setPesananPenjualanJasa(pesananPenjualanJasaSelectedGet[0])
                    } else {
                        setPesananPenjualanJasa(resData.data)
                    }
                    setEditNomorPesananPenjualan(x => x = true)
                })
                .catch(err => {
                    showError(err)
                    if (pesananPenjualanJasaSelected) {
                        _setCustomer()
                        setEditNomorPesananPenjualan(x => x = true)
                        setPesananPenjualanJasa(pesananPenjualanJasaListData.filter(x => x.uuid == pesananPenjualanJasaSelected.value)[0])
                    }
                })
        }
    }

    const _setCustomer = () => {
        setCustomer(x => x = null)
        setTanggalPesananPenjualanJasa(x => x = getHariTanggalFull())
        setNomorPesananPenjualanJasa(x => x = null)
        const pesananPenjualanJasaSelectedGet = pesananPenjualanJasaListData.filter(x => x.uuid == pesananPenjualanJasaSelected.value)
        if (pesananPenjualanJasaSelectedGet.length > 0) {
            const customerGet = customerList.filter(x => x.uuid == pesananPenjualanJasaSelectedGet[0].customer)
            if (customerGet.length > 0) {
                setCustomer(x => x = customerGet[0])
                setTanggalPesananPenjualanJasa(pesananPenjualanJasaSelectedGet[0].tanggal_pesanan_penjualan_jasa)
                setNomorPesananPenjualanJasa(pesananPenjualanJasaSelectedGet[0].nomor_pesanan_penjualan_jasa)
            }
        }
    }

    useEffect(() => {
        if (pesananPenjualanJasaSelected) {
            _setCustomer()
        }
    }, [pesananPenjualanJasaSelected])

    const _getAllPesananPenjualanJasa = () => {
        apiPesananPenjualanJasaCRUD
            .custom(``, "GET")
            .then(resData => {
                setPesananPenjualanJasaListData(x => x = resData.data.entry)
                if (resData.data.entry.length > 0) {
                    setPesananPenjualanJasaSelected(x => x = {
                        label: resData.data.entry[0].nomor_pesanan_penjualan_jasa,
                        value: resData.data.entry[0].uuid
                    })
                }
            }).catch(err => showError(err))
    }

    useEffect(() => {
        if (pilihPesananPenjualanJasa) {
            _getAllPesananPenjualanJasa()
        } else {
            setNomorPesananPenjualanJasa(x => x = "")
            setPesananPenjualanJasaSelected(x => x = false)
            setTanggalPesananPenjualanJasa(x => x = getHariTanggalFull())
            setCustomer(x => x = null)
        }
    }, [pilihPesananPenjualanJasa])

    useEffect(() => {
        _getDataCustomer()
    }, [])

    return <>
        <div className="bg-white rounded-md shadow-sm h-max">
            <div className="py-5 px-6 h-max w-full z-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-2">Pesanan Penjualan Jasa</h1>
                </div>
                <form onSubmit={e => _savePesananPenjualan(e)}>
                    <div className="flex items-end gap-x-2">
                        <div className="flex items-end gap-x-2 w-full">
                            {
                                pilihPesananPenjualanJasa && !pesananPenjualanJasa ? <>
                                    <FormSelectWithLabel
                                        label={"Nomor Pesanan Penjualan Jasa"}
                                        optionsDataList={pesananPenjualanJasaListData}
                                        optionsLabel={"nomor_pesanan_penjualan_jasa"}
                                        optionsValue={"uuid"}
                                        selectValue={pesananPenjualanJasaSelected}
                                        onchange={(e) => {
                                            setPesananPenjualanJasaSelected(e)
                                        }}
                                        selectName={`pesananPenjualanJasaSelected`}
                                    />
                                </> : <>
                                    <FormInputWithLabel
                                        label={"Nomor Pesanan Penjualan Jasa"}
                                        type={"text"}
                                        disabled={pesananPenjualanJasa && editNomorPesananPenjualan}
                                        addClassInput={pesananPenjualanJasa && editNomorPesananPenjualan ? "border-none px-1" : ""}
                                        onchange={(e) => {
                                            setNomorPesananPenjualanJasa(e.target.value)
                                        }}
                                        others={
                                            {
                                                value: nomorPesananPenjualanJasa,
                                                name: "nomorPesananPenjualanJasa",
                                                disabled: pesananPenjualanJasa && editNomorPesananPenjualan
                                            }
                                        }
                                    />
                                </>
                            }
                            {
                                pesananPenjualanJasa ? <>
                                    {
                                        rincianPesananPenjualanJasa.length != 0 || fakturStatus ? <></> : <>
                                            <button
                                                type="button"
                                                className={`btn btn-sm ${editNomorPesananPenjualan ? "bg-yellow-400 hover:bg-yellow-400" : ""}`}
                                                onClick={() => {
                                                    setEditNomorPesananPenjualan(x => x = !x)
                                                }}
                                            >
                                                {editNomorPesananPenjualan ? <FaPen /> : <FaTimes />} {editNomorPesananPenjualan ? "Edit" : "Batal Edit"} Nomor Pesanan
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => _deletePesananPenjualan()}
                                                className="btn btn-sm bg-red-700 text-white">
                                                <FaTrash /> Hapus Nomor Pesanan
                                            </button>
                                        </>
                                    }
                                </> : <>
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${pilihPesananPenjualanJasa ? "bg-red-900" : "bg-blue-900"} text-white border-none`} onClick={() => {
                                            setPilihPesananPenjualanJasa(x => x = !x)
                                        }}
                                    >
                                        {
                                            pilihPesananPenjualanJasa ? <FaTimes /> : <FaSearch />
                                        }
                                        {
                                            pilihPesananPenjualanJasa ? "Batal Pesanan Penjualan" : "Pilih Pesanan Penjualan"
                                        }
                                    </button>
                                </>
                            }
                        </div>
                        <FormInputWithLabel
                            label={"Tanggal Pesanan Penjualan Jasa"}
                            type={"datetime-local"}
                            onchange={(e) => {
                                setTanggalPesananPenjualanJasa(e.target.value)
                            }}
                            disabled={pesananPenjualanJasa}
                            addClassInput={pesananPenjualanJasa ? "border-none px-1" : ""}
                            others={
                                {
                                    value: tanggalPesananPenjualanJasa,
                                    name: "tanggalPesananPenjualanJasa",
                                    disabled: pesananPenjualanJasa
                                }
                            }
                        />
                    </div>
                    {
                        customer ? <>
                            <div className="mt-5 relative px-1">
                                <p className="font-bold text-sm mb-3">Customer Terpilih</p>
                                <p className="text-xl font-bold">{customer.code} - {customer.name}</p>
                                <div className="mt-3 flex gap-x-10">
                                    <div>
                                        <p className="text-xs font-bold mb-1">Alamat Rumah</p>
                                        <p className="text-sm">{customer.alamat_rumah}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold mb-1">Alamat Kantor</p>
                                        <p className="text-sm">{customer.alamat_kantor}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold mb-1">NPWP</p>
                                        <p className="text-sm">{customer.npwp}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold mb-1">Nomor Telepon</p>
                                        <p className="text-sm">{customer.no_telp}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold mb-1">Nomor Handphone</p>
                                        <p className="text-sm">{customer.no_hp}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold mb-1">Kode Harga</p>
                                        <p className="text-sm">Harga {customer.kode_harga}</p>
                                    </div>
                                </div>
                                {
                                    pesananPenjualanJasa ? <></> : <>
                                        <button
                                            className="absolute top-0 right-3 flex mt-3 py-1 px-2 gap-x-2 items-center font-bold text-xs rounded-md bg-red-800 text-white"
                                            onClick={() => {
                                                setCustomer(null)
                                            }}
                                            type="button"
                                        >
                                            <FaTimes />
                                        </button>
                                    </>
                                }
                            </div>
                        </> : <></>
                    }
                    {
                        customer ? <>
                            {
                                pesananPenjualanJasa && editNomorPesananPenjualan ? <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPesananPenjualanJasa(x => x = null)
                                            setCustomer(x => x = null)
                                            setPilihPesananPenjualanJasa(x => x = false)
                                            setFakturStatus(x => x = false)
                                        }}
                                        className="btn btn-sm bg-red-800 mt-4 text-white"
                                    >
                                        <FaTimes /> Reset Pesanan Penjualan
                                    </button>
                                </> : <>
                                    <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
                                </>
                            }
                        </> : <></>
                    }
                </form>
                {
                    !customer ? <>
                        <div className="mt-5">
                            <div className="flex w-full items-center gap-x-2 mb-5">
                                <FormInput
                                    value={search}
                                    onchange={e => setSearch(e.target.value)}
                                    other={{
                                        placeholder: "Cari Customer"
                                    }}
                                />
                                {
                                    searchStatus ?
                                        <FaSearch onClick={() => { _getDataCustomer(search) }} className="cursor-pointer" />
                                        :
                                        <FaTimes onClick={() => _getDataCustomer("")} className="cursor-pointer" />
                                }
                            </div>
                            <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr className="sticky top-0 bg-white py-4 text-black">
                                        <th width={12}>No</th>
                                        <th>Kode Customer</th>
                                        <th>Nama Customer</th>
                                        <th>Kode Harga</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        customerList?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td width={400}>{item.code}</td>
                                                    <td width={400}>{item.name}</td>
                                                    <td width={400}>Harga {item.kode_harga}</td>
                                                    <td>
                                                        <button
                                                            className="flex py-1 px-5 gap-x-2 items-center rounded-xl bg-green-800 text-white"
                                                            onClick={() => {
                                                                setCustomer(x => x = item)
                                                            }}
                                                            type="button"
                                                        >
                                                            <FaCheck size={12.5} />
                                                            <p>Pilih</p>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </>
                                        })
                                    }
                                </tbody>
                            </table>
                            <Pagination
                                paginateUpdatePage={paginateUpdatePage}
                                paginate={pagination}
                                setSize={setSize}
                                shadow=""
                                sizeList={[2, 4, 6]}
                            />
                        </div>
                    </> : <></>
                }
            </div>
        </div>
        {
            pesananPenjualanJasa && editNomorPesananPenjualan ? <>
                <PesananPenjualanJasaList
                    pesananPenjualanJasa={pesananPenjualanJasa}
                    customer={customer}
                    fakturStatus={fakturStatus}
                    setPPNStatus={setPPNStatus}
                    tanggalTransaksiAkhir={tanggalTransaksiAkhir}
                    rincianPesananPenjualanJasa={rincianPesananPenjualanJasa}
                    setRincianPesananPenjualanJasa={setRincianPesananPenjualanJasa}
                />
                <FakturPenjualanJasaForm
                    pesananPenjualanJasa={pesananPenjualanJasa}
                    rincianPesananPenjualanJasa={rincianPesananPenjualanJasa}
                    setFakturStatus={setFakturStatus}
                    fakturStatus={fakturStatus}
                    ppnStatus={ppnStatus}
                    setTanggalTransaksiAkhir={setTanggalTransaksiAkhir}
                />
            </> : <></>
        }
    </>
}
export default PenjualanJasaForm