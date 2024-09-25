import { FaCheck, FaSave, FaSearch, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { apiCustomerCRUD, apiPesananPenjualanBarangCRUD } from "../../../../../service/endPointList.api"
import { formValidation } from "../../../../../helper/form.helper"
import PesananPenjualanBarangList from "./PenjualanBarangList"
import Pagination from "../../../../../component/general/Pagination"
import FormInput from "../../../../../component/form/FormInput"

const PenjualanBarangForm = ({
    setAddPenjualanBarang = () => { }
}) => {
    const [customerList, setCustomerList] = useState([])
    const [nomorPesananPenjualanBarang, setNomorPesananPenjualanBarang] = useState("")
    const [tanggalPesananPenjualanBarang, setTanggalPesananPenjualanBarang] = useState(getHariTanggalFull())
    const [customer, setCustomer] = useState()

    const [searchStatus, setSearchStatus] = useState(false)
    const [search, setSearch] = useState("")

    const [pagination, setPagination] = useState({
        page: 1,
        size: 2,
        count: 118,
        lastPage: 12
    })

    const [pesananPenjualanBarang, setPesananPenjualanBarang] = useState()

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

    const _savePesananPenjualan = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiPesananPenjualanBarangCRUD
                .custom("", "POST", null, {
                    data: {
                        nomor_pesanan_penjualan_barang: nomorPesananPenjualanBarang,
                        tanggal_pesanan_penjualan_barang: tanggalPesananPenjualanBarang,
                        customer: customer.uuid
                    }
                }).then(resData => {
                    setPesananPenjualanBarang(resData.data)
                })
        }
    }

    useEffect(() => {
        _getDataCustomer()
    }, [])

    return <>
        <div className="bg-white rounded-md shadow-2xl h-max overflow-scroll no-scrollbar relative">
            <div className="sticky top-0 py-5 px-6 h-max bg-white w-full z-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-4">Pesanan Penjualan Barang</h1>
                    <button
                        className="btn btn-sm bg-red-900 text-white border-none"
                        onClick={() => setAddPenjualanBarang()}
                    ><FaTimes /> Batalkan Transaksi
                    </button>
                </div>
                <form onSubmit={e => _savePesananPenjualan(e)}>
                    <div className="flex items-end gap-x-2">
                        <FormInputWithLabel
                            label={"Nomor Pesanan Penjualan Barang"}
                            type={"text"}
                            disabled={pesananPenjualanBarang}
                            addClassInput={pesananPenjualanBarang ? "border-none px-1" : ""}
                            onchange={(e) => {
                                setNomorPesananPenjualanBarang(e.target.value)
                            }}
                            others={
                                {
                                    value: nomorPesananPenjualanBarang,
                                    name: "nomorPesananPenjualanBarang",
                                    disabled: pesananPenjualanBarang
                                }
                            }
                        />
                        <FormInputWithLabel
                            label={"Tanggal Pesanan Penjualan Barang"}
                            type={"datetime-local"}
                            onchange={(e) => {
                                setTanggalPesananPenjualanBarang(e.target.value)
                            }}
                            disabled={pesananPenjualanBarang}
                            addClassInput={pesananPenjualanBarang ? "border-none px-1" : ""}
                            others={
                                {
                                    value: tanggalPesananPenjualanBarang,
                                    name: "tanggalPesananPenjualanBarang",
                                    disabled: pesananPenjualanBarang
                                }
                            }
                        />
                    </div>
                    {
                        customer ? <>
                            <div className="mt-5 px-3 py-4 border rounded-md relative">
                                <p className="text-md bg-blue-900 text-white w-max px-2 rounded-md font-bold mb-2">Detail Customer</p>
                                <p className="text-2xl font-bold">{customer.code} - {customer.name}</p>
                                <div className="mt-3 flex gap-x-10">
                                    <div>
                                        <p className="text-xs font-bold mb-1">Alamat Rumah</p>
                                        <p className="text-sm">{customer.alamat_rumah}</p>
                                    </div>
                                </div>
                                <div className="mt-5 flex gap-x-5">
                                    <div>
                                        <p className="text-xs font-bold mb-1">Alamat Kantor</p>
                                        <p className="text-sm">{customer.alamat_kantor}</p>
                                    </div>
                                </div>
                                <div className="mt-5 flex gap-x-10">
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
                                    pesananPenjualanBarang ? <></> : <>
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
                        !customer || pesananPenjualanBarang ? <></> :
                            <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
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
                                        <th>Nama Customer</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        customerList?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td width={400}>{item.name}</td>
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
            pesananPenjualanBarang ? <>
                <PesananPenjualanBarangList
                    pesananPenjualanBarang={pesananPenjualanBarang}
                    customer={customer}
                />
            </> : <></>
        }
    </>
}
export default PenjualanBarangForm