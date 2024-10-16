import { FaCheck, FaSave, FaSearch, FaTimes } from "react-icons/fa"
import FormInputWithLabel from "../../../../../component/form/FormInputWithLabel"
import { useEffect, useState } from "react"
import { getHariTanggalFull } from "../../../../../helper/date.helper"
import { apiSupplierCRUD, apiPesananPembelianBarangCRUD } from "../../../../../service/endPointList.api"
import { formValidation, showError } from "../../../../../helper/form.helper"
import PesananPembelianBarangList from "./PembelianBarangList"
import Pagination from "../../../../../component/general/Pagination"
import FormInput from "../../../../../component/form/FormInput"
import FormSelectWithLabel from "../../../../../component/form/FormSelectWithLabel"
import FakturPembelianBarangForm from "./FakturPembelianBarangForm"

const PembelianBarangForm = ({
    setAddPembelianBarang = () => { }
}) => {
    const [tanggalTransaksiAkhir, setTanggalTransaksiAkhir] = useState(getHariTanggalFull())
    const [fakturStatus, setFakturStatus] = useState(false)
    const [ppnStatus, setPPNStatus] = useState(true)
    const [pilihPesananPembelianBarang, setPilihPesananPembelianBarang] = useState(false)
    const [pesananPembelianBarangListData, setPesananPembelianBarangListData] = useState([])
    const [pesananPembelianBarangSelected, setPesananPembelianBarangSelected] = useState(true)

    const [supplierList, setSupplierList] = useState([])
    const [nomorPesananPembelianBarang, setNomorPesananPembelianBarang] = useState("")
    const [tanggalPesananPembelianBarang, setTanggalPesananPembelianBarang] = useState(getHariTanggalFull())
    const [supplier, setSupplier] = useState()

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
        _getDataSupplier()
    }

    const setSize = (sizeSelected) => {
        let paginateCopy = pagination
        paginateCopy.size = sizeSelected
        paginateCopy.page = 1
        setPagination(paginateCopy)
        _getDataSupplier()
    }

    const [pesananPembelianBarang, setPesananPembelianBarang] = useState()

    const _getDataSupplier = (searchParam = "") => {
        if (searchParam == "") {
            setSearch(searchParam)
        }
        apiSupplierCRUD
            .custom(`?search=${searchParam}&page=${pagination.page}&size=${pagination.size}`, "GET")
            .then(resData => {
                setSearchStatus(searchParam.length < 1)
                setSupplierList(resData?.data?.entry)
                setPagination(resData?.data?.pagination)
            }).catch(err => {
                showError(err)
            })
    }

    const _savePesananPembelian = async (e) => {
        e.preventDefault()
        if (await formValidation(e.target)) {
            apiPesananPembelianBarangCRUD
                .custom(pesananPembelianBarangSelected ? `/${pesananPembelianBarangSelected.value}` : "", pesananPembelianBarangSelected ? "PUT" : `POST`, null, {
                    data: {
                        nomor_pesanan_pembelian_barang: nomorPesananPembelianBarang,
                        tanggal_pesanan_pembelian_barang: tanggalPesananPembelianBarang,
                        supplier: supplier.uuid
                    }
                }).then(resData => {
                    if (pesananPembelianBarangSelected) {
                        const pesananPembelianBarangSelectedGet = pesananPembelianBarangListData.filter(x => x.uuid == pesananPembelianBarangSelected.value)
                        setPesananPembelianBarang(pesananPembelianBarangSelectedGet[0])
                    } else {
                        setPesananPembelianBarang(resData.data)
                    }
                })
        }
    }

    useEffect(() => {
        if (pesananPembelianBarangSelected) {
            const pesananPembelianBarangSelectedGet = pesananPembelianBarangListData.filter(x => x.uuid == pesananPembelianBarangSelected.value)
            if (pesananPembelianBarangSelectedGet.length > 0) {
                const SupplierGet = supplierList.filter(x => x.uuid == pesananPembelianBarangSelectedGet[0].supplier)
                if (SupplierGet.length > 0) {
                    setSupplier(x => x = SupplierGet[0])
                    setTanggalPesananPembelianBarang(pesananPembelianBarangSelectedGet[0].tanggal_pesanan_pembelian_barang)
                    setNomorPesananPembelianBarang(pesananPembelianBarangSelectedGet[0].nomor_pesanan_pembelian_barang)
                }
            }
        }
    }, [pesananPembelianBarangSelected])

    useEffect(() => {
        if (pilihPesananPembelianBarang) {
            apiPesananPembelianBarangCRUD
                .custom("", "GET")
                .then(resData => {
                    setPesananPembelianBarangListData(x => x = resData.data.entry)
                    if (resData.data.entry.length > 0) {
                        setPesananPembelianBarangSelected(x => x = {
                            label: resData.data.entry[0].nomor_pesanan_pembelian_barang,
                            value: resData.data.entry[0].uuid
                        })
                    }
                }).catch(err => showError(err))
        } else {
            setNomorPesananPembelianBarang(x => x = "")
            setPesananPembelianBarangSelected(x => x = false)
            setTanggalPesananPembelianBarang(x => x = getHariTanggalFull())
            setSupplier(x => x = null)
        }
    }, [pilihPesananPembelianBarang])

    useEffect(() => {
        _getDataSupplier()
    }, [])

    return <>
        <div className="bg-white rounded-md shadow-sm h-max">
            <div className="py-5 px-6 h-max w-full z-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-extrabold w-max text-white px-2 rounded-md bg-blue-900 mb-2">Pesanan Pembelian Barang</h1>
                </div>
                <form onSubmit={e => _savePesananPembelian(e)}>
                    <div className="flex items-end gap-x-2">
                        <div className="flex items-end gap-x-2 w-full">
                            {
                                pilihPesananPembelianBarang && !pesananPembelianBarang ? <>
                                    <FormSelectWithLabel
                                        label={"Nomor Pesanan Pembelian Barang"}
                                        optionsDataList={pesananPembelianBarangListData}
                                        optionsLabel={"nomor_pesanan_pembelian_barang"}
                                        optionsValue={"uuid"}
                                        selectValue={pesananPembelianBarangSelected}
                                        onchange={(e) => {
                                            setPesananPembelianBarangSelected(e)
                                        }}
                                        selectName={`pesananPembelianBarangSelected`}
                                    />
                                </> : <>
                                    <FormInputWithLabel
                                        label={"Nomor Pesanan Pembelian Barang"}
                                        type={"text"}
                                        disabled={pesananPembelianBarang}
                                        addClassInput={pesananPembelianBarang ? "border-none px-1" : ""}
                                        onchange={(e) => {
                                            setNomorPesananPembelianBarang(e.target.value)
                                        }}
                                        others={
                                            {
                                                value: nomorPesananPembelianBarang,
                                                name: "nomorPesananPembelianBarang",
                                                disabled: pesananPembelianBarang
                                            }
                                        }
                                    />
                                </>
                            }
                            {
                                pesananPembelianBarang ? <></> : <>
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${pilihPesananPembelianBarang ? "bg-red-900" : "bg-blue-900"} text-white border-none`} onClick={() => {
                                            setPilihPesananPembelianBarang(x => x = !x)
                                        }}
                                    >
                                        {
                                            pilihPesananPembelianBarang ? <FaTimes /> : <FaSearch />
                                        }
                                        {
                                            pilihPesananPembelianBarang ? "Batal Pesanan Pembelian" : "Pilih Pesanan Pembelian"
                                        }
                                    </button>
                                </>
                            }
                        </div>
                        <FormInputWithLabel
                            label={"Tanggal Pesanan Pembelian Barang"}
                            type={"datetime-local"}
                            onchange={(e) => {
                                setTanggalPesananPembelianBarang(e.target.value)
                            }}
                            disabled={pesananPembelianBarang}
                            addClassInput={pesananPembelianBarang ? "border-none px-1" : ""}
                            others={
                                {
                                    value: tanggalPesananPembelianBarang,
                                    name: "tanggalPesananPembelianBarang",
                                    disabled: pesananPembelianBarang
                                }
                            }
                        />
                    </div>
                    {
                        supplier ? <>
                            <div className="mt-5 relative px-1">
                                <p className="font-bold text-sm mb-3">supplier Terpilih</p>
                                <p className="text-xl font-bold">{supplier.code} - {supplier.name}</p>
                                <div className="mt-3 flex gap-x-10">
                                    <div>
                                        <p className="text-xs font-bold mb-1">Alamat Rumah</p>
                                        <p className="text-sm">{supplier.alamat_rumah}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold mb-1">Alamat Kantor</p>
                                        <p className="text-sm">{supplier.alamat_kantor}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold mb-1">NPWP</p>
                                        <p className="text-sm">{supplier.npwp}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold mb-1">Nomor Telepon</p>
                                        <p className="text-sm">{supplier.no_telp}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold mb-1">Nomor Handphone</p>
                                        <p className="text-sm">{supplier.no_hp}</p>
                                    </div>
                                </div>
                                {
                                    pesananPembelianBarang ? <></> : <>
                                        <button
                                            className="absolute top-0 right-3 flex mt-3 py-1 px-2 gap-x-2 items-center font-bold text-xs rounded-md bg-red-800 text-white"
                                            onClick={() => {
                                                setSupplier(null)
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
                        supplier ? <>
                            {
                                pesananPembelianBarang ? <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPesananPembelianBarang(x => x = null)
                                            setSupplier(x => x = null)
                                            setPilihPesananPembelianBarang(x => x = false)
                                            setFakturStatus(x => x = false)
                                        }}
                                        className="btn btn-sm bg-red-800 mt-4 text-white"
                                    >
                                        <FaTimes /> Reset Pesanan Pembelian
                                    </button>
                                </> : <>
                                    <button className="btn btn-sm bg-green-800 mt-4 text-white"><FaSave /> Simpan</button>
                                </>
                            }
                        </> : <></>
                    }
                </form>
                {
                    !supplier ? <>
                        <div className="mt-5">
                            <div className="flex w-full items-center gap-x-2 mb-5">
                                <FormInput
                                    value={search}
                                    onchange={e => setSearch(e.target.value)}
                                    other={{
                                        placeholder: "Cari supplier"
                                    }}
                                />
                                {
                                    searchStatus ?
                                        <FaSearch onClick={() => { _getDataSupplier(search) }} className="cursor-pointer" />
                                        :
                                        <FaTimes onClick={() => _getDataSupplier("")} className="cursor-pointer" />
                                }
                            </div>
                            <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                    <tr className="sticky top-0 bg-white py-4 text-black">
                                        <th width={12}>No</th>
                                        <th>Kode supplier</th>
                                        <th>Nama supplier</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        supplierList?.map((item, i) => {
                                            return <>
                                                <tr key={i}>
                                                    <td>{i + 1}.</td>
                                                    <td width={400}>{item.code}</td>
                                                    <td width={400}>{item.name}</td>
                                                    <td>
                                                        <button
                                                            className="flex py-1 px-5 gap-x-2 items-center rounded-xl bg-green-800 text-white"
                                                            onClick={() => {
                                                                setSupplier(x => x = item)
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
            pesananPembelianBarang ? <>
                <PesananPembelianBarangList
                    pesananPembelianBarang={pesananPembelianBarang}
                    supplier={supplier}
                    fakturStatus={fakturStatus}
                    tanggalTransaksiAkhir={tanggalTransaksiAkhir}
                />
                <FakturPembelianBarangForm
                    pesananPembelianBarang={pesananPembelianBarang}
                    setFakturStatus={setFakturStatus}
                    fakturStatus={fakturStatus}
                    ppnStatus={ppnStatus}
                    setTanggalTransaksiAkhir={setTanggalTransaksiAkhir}
                />
            </> : <></>
        }
    </>
}
export default PembelianBarangForm