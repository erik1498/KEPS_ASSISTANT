import { FaBook, FaBuilding, FaDotCircle, FaExchangeAlt, FaFileCsv, FaRegChartBar, FaThLarge, FaToolbox } from "react-icons/fa";
import NavigationLink from "./NavigationLink";
import { useEffect } from "react";
import { useState } from "react";
import NavigationLinkParent from "./NavigationLinkParent";
import { getCookie, getRolesInCookie } from "../../helper/cookies.helper";
import FormSelect from "../form/FormSelect";
import { useDataContext } from "../../context/dataContext.context";
import { yearList } from "../../config/objectList.config";
import { getBulanList } from "../../helper/date.helper";

const Navigasi = ({
    setNavigateOpen = () => { },
    navigateOpen,
    closeAllDetailByParent = () => { }
}) => {

    const { data, setData } = useDataContext()

    const [tahun, setTahun] = useState(data.tahun)
    const [sideBars, setSideBars] = useState([])

    useEffect(() => {
        let sidebarArr = window.location.pathname.split("/").slice(1)
        sidebarArr = sidebarArr.map(item => {
            return (item.charAt(0).toUpperCase() + item.slice(1)).replace(/([A-Z])/g, ' $1').trim()
        })
        setSideBars(sidebarArr)
    }, [])

    const _closeAllDetail = (e, isDetails) => {
        let elementSelected = e
        if (!isDetails) {
            elementSelected = e.target.localName == "summary" ? e.target.parentNode : e.target
        }
        const details = document.getElementsByTagName("details")
        for (let index = 0; index < details.length; index++) {
            const element = details[index];
            if (element != elementSelected) {
                element.open = false
            }
        }
        const newDetails = document.getElementsByTagName("details")
        for (let index = 0; index < newDetails.length; index++) {
            const element = newDetails[index];
            setNavigateOpen(x => x = true)
            if (element.open) {
                setNavigateOpen(x => x = false)
                index = newDetails.length
            }
        }
    }

    return <>
        <div className="top-36 h-[40vh] bg-blue-900 rounded-box left-0 right-0 fixed -z-0 shadow-inner">
        </div>
        <div className="sticky top-0 z-[100]">
            <div className="bg-white px-8 py-5 grid grid-cols-4">
                <div className="col-span-2 flex uppercase text-blue-900">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-xl font-bold">{getCookie("perusahaan")}</h1>
                        <p className="text-xs bg-blue-900 w-max text-white font-bold px-3 py-1 rounded-md">Keps Assistant | Friend of Your Business Progress</p>
                    </div>
                </div>
                <div className="col-span-2 flex justify-end uppercase text-blue-900">
                    <div className="flex flex-col gap-y-2 items-end">
                        <h1 className="text-xl font-bold">{getCookie("name")}</h1>
                        <div className="flex items-center gap-x-2 text-green-900 w-max font-bold py-1 rounded-md">
                            <FaDotCircle size={14} />
                            <p className="text-xs">Online</p>
                        </div>
                    </div>
                </div>
            </div>
            <ul className="menu z-50 menu-horizontal bg-white text-blue-900 px-2 w-full border-t-2 border-blue-900 shadow-2xl">
                {
                    getRolesInCookie("Dashboard") ? <>
                        <li>
                            <NavigationLink
                                icon={<FaThLarge />}
                                label={"Dashboard"}
                                to={"/dashboard"}
                                addClass={"mr-2 ml-6"}
                            />
                        </li>
                    </> : <></>
                }
                {
                    getRolesInCookie("Perusahaan") ? <>
                        <li>
                            <details onClick={(e) => _closeAllDetail(e)}>
                                <NavigationLinkParent
                                    Icon={<FaBuilding size={15} />}
                                    parentName={"Perusahaan"}
                                    sideBars={sideBars[0]}
                                />
                                <ul className="menu z-50 bg-base-200 rounded-box w-56">
                                    {
                                        getRolesInCookie("Perusahaan_Master") ? <>
                                            <li>
                                                <p className="font-bold pointer-events-none">Master</p>
                                                <ul>
                                                    {
                                                        getRolesInCookie("Perusahaan_Master_KodeAkun") ? <>
                                                            <li>
                                                                <NavigationLink to="/perusahaan/kodeAkun" addClass={"my-1"} label={"Kode Akun"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Perusahaan_Master_Customer") ? <>
                                                            <li>
                                                                <NavigationLink to="/perusahaan/customer" addClass={"my-1"} label={"Data Customer"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Perusahaan_Master_Supplier") ? <>
                                                            <li>
                                                                <NavigationLink to="/perusahaan/supplier" addClass={"my-1"} label={"Data Supplier"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Perusahaan_Master_Pegawai") ? <>
                                                            <li>
                                                                <NavigationLink to="/perusahaan/pegawai" addClass={"my-1"} label={"Data Pegawai"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                </ul>
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Perusahaan_Cabang") ? <>
                                            <li>
                                                <NavigationLink to="/perusahaan/cabang" addClass={"my-1"} label={"Cabang"} />
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Perusahaan_Divisi") ? <>
                                            <li>
                                                <NavigationLink to="/perusahaan/divisi" addClass={"my-1"} label={"Divisi"} />
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Perusahaan_Jabatan") ? <>
                                            <li>
                                                <NavigationLink to="/perusahaan/jabatan" addClass={"my-1"} label={"Jabatan"} />
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Perusahaan_TipePembayaran") ? <>
                                            <li>
                                                <NavigationLink to="/perusahaan/tipePembayaran" addClass={"my-1"} label={"Tipe Pembayaran"} />
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Perusahaan_SyaratPembayaran") ? <>
                                            <li>
                                                <NavigationLink to="/perusahaan/syaratPembayaran" addClass={"my-1"} label={"Syarat Pembayaran"} />
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Perusahaan_StatusTanggungan") ? <>
                                            <li>
                                                <NavigationLink to="/perusahaan/statusTanggungan" addClass={"my-1"} label={"Status Tanggungan"} />
                                            </li>
                                        </> : <></>
                                    }
                                </ul>
                            </details>
                        </li>
                    </> : <></>
                }
                {
                    getRolesInCookie("Transaksi") ? <>
                        <li>
                            <details onClick={(e) => _closeAllDetail(e)}>
                                <NavigationLinkParent
                                    Icon={<FaExchangeAlt size={15} />}
                                    parentName={"Transaksi"}
                                    sideBars={sideBars[0]}
                                />
                                <ul className="menu z-50 bg-base-200 rounded-box w-56">
                                    {
                                        getRolesInCookie("Transaksi_KasDanBank") ? <>
                                            <li>
                                                <p className="font-bold pointer-events-none">Kas & Bank</p>
                                                <ul>
                                                    <li>
                                                        <NavigationLink to="/transaksi/kasDanBank/kas" addClass={"my-1"} label={"Transaksi Kas"} />
                                                    </li>
                                                    <li>
                                                        <NavigationLink to="/transaksi/kasDanBank/bank" addClass={"my-1"} label={"Transaksi Bank"} />
                                                    </li>
                                                </ul>
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Transaksi_Penjualan") ? <>
                                            <li>
                                                <p className="font-bold pointer-events-none">Penjualan</p>
                                                <ul>
                                                    {
                                                        getRolesInCookie("Transaksi_Penjualan_Barang") ? <>
                                                            <li>
                                                                <NavigationLink to="/transaksi/penjualan/barang" addClass={"my-1"} label={"Barang"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Transaksi_Penjualan_Jasa") ? <>
                                                            <li>
                                                                <NavigationLink to="/transaksi/penjualan/jasa" addClass={"my-1"} label={"Jasa"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Transaksi_Laporan_Penjualan_Barang") ? <>
                                                            <li>
                                                                <NavigationLink to="/transaksi/penjualan/laporan_penjualan_barang" addClass={"my-1"} label={"Laporan Barang"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                </ul>
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Transaksi_Pembelian") ? <>
                                            <li>
                                                <p className="font-bold pointer-events-none">Pembelian</p>
                                                <ul>
                                                    {
                                                        getRolesInCookie("Transaksi_Pembelian_Barang") ? <>
                                                            <li>
                                                                <NavigationLink to="/transaksi/pembelian/barang" addClass={"my-1"} label={"Barang"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                </ul>
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Transaksi_Payroll") ? <>
                                            <li>
                                                <p className="font-bold pointer-events-none">Payroll</p>
                                                <ul>
                                                    {
                                                        getRolesInCookie("Transaksi_Payroll_PendapatanPegawai") ? <>
                                                            <li>
                                                                <NavigationLink to="/transaksi/payroll/pendapatanPegawai" addClass={"my-1"} label={"Pendapatan Pegawai"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Transaksi_Payroll_PotonganPegawai") ? <>
                                                            <li>
                                                                <NavigationLink to="/transaksi/payroll/potonganPegawai" addClass={"my-1"} label={"Potongan Pegawai"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Transaksi_Payroll_SlipGajiPegawai") ? <>
                                                            <li>
                                                                <NavigationLink to="/transaksi/payroll/slipGajiPegawai" addClass={"my-1"} label={"Slip Gaji Pegawai"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                </ul>
                                            </li>
                                        </> : <></>
                                    }
                                </ul>
                            </details>
                        </li>
                    </> : <></>
                }
                {
                    getRolesInCookie("AsetTetapDanPerlengkapan") ? <>
                        <li>
                            <details onClick={(e) => _closeAllDetail(e)}>
                                <NavigationLinkParent
                                    Icon={<FaToolbox size={15} />}
                                    parentName={"Aset Tetap Dan Perlengkapan"}
                                    sideBars={sideBars[0]}
                                />
                                <ul className="menu z-50 bg-base-200 rounded-box w-56">
                                    {
                                        getRolesInCookie("AsetTetapDanPerlengkapan_Aset") ? <>
                                            <li>
                                                <p className="font-bold pointer-events-none">Aset Tetap</p>
                                                <ul>
                                                    {
                                                        getRolesInCookie("AsetTetapDanPerlengkapan_Aset_DaftarAset") ? <>
                                                            <li>
                                                                <NavigationLink to="/asetTetapDanPerlengkapan/asetTetap/daftarAset" addClass={"my-1"} label={"Daftar Aset"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("AsetTetapDanPerlengkapan_Aset_KategoriAset") ? <>
                                                            <li>
                                                                <NavigationLink to="/asetTetapDanPerlengkapan/asetTetap/kategoriAset" addClass={"my-1"} label={"Kategori Aset"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("AsetTetapDanPerlengkapan_Aset_KelompokAset") ? <>
                                                            <li>
                                                                <NavigationLink to="/asetTetapDanPerlengkapan/asetTetap/kelompokAset" addClass={"my-1"} label={"Kelompok Aset"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                </ul>
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("AsetTetapDanPerlengkapan_Perlengkapan") ? <>
                                            <li>
                                                <p className="font-bold pointer-events-none">Perlengkapan</p>
                                                <ul>
                                                    {
                                                        getRolesInCookie("AsetTetapDanPerlengkapan_Perlengkapan_DaftarPerlengkapan") ? <>
                                                            <li>
                                                                <NavigationLink to="/asetTetapDanPerlengkapan/perlengkapan/daftarPerlengkapan" addClass={"my-1"} label={"Daftar Perlengkapan"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("AsetTetapDanPerlengkapan_Perlengkapan_KategoriPerlengkapan") ? <>
                                                            <li>
                                                                <NavigationLink to="/asetTetapDanPerlengkapan/perlengkapan/kategoriPerlengkapan" addClass={"my-1"} label={"Kategori Perlengkapan"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                </ul>
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("AsetTetapDanPerlengkapan_Penyusutan") ? <>
                                            <li>
                                                <p className="font-bold pointer-events-none">Penyusutan</p>
                                                <ul>
                                                    {
                                                        getRolesInCookie("AsetTetapDanPerlengkapan_Penyusutan_MetodePenyusutan") ? <>
                                                            <li>
                                                                <NavigationLink to="/asetTetapDanPerlengkapan/penyusutan/metodePenyusutan" addClass={"my-1"} label={"Metode Penyusutan"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("AsetTetapDanPerlengkapan_Penyusutan_PersentasePenyusutan") ? <>
                                                            <li>
                                                                <NavigationLink to="/asetTetapDanPerlengkapan/penyusutan/persentasePenyusutan" addClass={"my-1"} label={"Persentase Penyusutan"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("AsetTetapDanPerlengkapan_Penyusutan_HitunganPenyusutan") ? <>
                                                            <li>
                                                                <NavigationLink to="/asetTetapDanPerlengkapan/penyusutan/hitunganPenyusutan" addClass={"my-1"} label={"Hitungan Penyusutan"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("AsetTetapDanPerlengkapan_Penyusutan_JurnalPenyusutan") ? <>
                                                            <li>
                                                                <NavigationLink to="/asetTetapDanPerlengkapan/penyusutan/jurnalPenyusutan" addClass={"my-1"} label={"Jurnal Penyusutan"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                </ul>
                                            </li>
                                        </> : <></>
                                    }
                                </ul>
                            </details>
                        </li>
                    </> : <></>
                }
                {
                    getRolesInCookie("Persediaan") ? <>
                        <li>
                            <details onClick={(e) => _closeAllDetail(e)}>
                                <NavigationLinkParent
                                    Icon={<FaToolbox size={15} />}
                                    parentName={"Persediaan"}
                                    sideBars={sideBars[0]}
                                />
                                <ul className="menu z-50 bg-base-200 rounded-box w-max max-h-[60vh] no-scrollbar">
                                    {
                                        getRolesInCookie("Persediaan_Barang") ? <>
                                            <li>
                                                <p className="font-bold pointer-events-none">Barang</p>
                                                <ul>
                                                    {
                                                        getRolesInCookie("Persediaan_Barang_DaftarBarang") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/barang/daftarBarang" addClass={"my-1"} label={"Daftar Barang"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Barang_SatuanBarang") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/barang/satuanBarang" addClass={"my-1"} label={"Satuan Barang"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Barang_KategoriBarang") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/barang/kategoriBarang" addClass={"my-1"} label={"Kategori Barang"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Barang_Jenis_Barang") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/barang/jenisBarang" addClass={"my-1"} label={"Jenis Barang"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Barang_JenisPenjualanBarang") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/barang/jenisPenjualanBarang" addClass={"my-1"} label={"Jenis Penjualan"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Barang_TransferBarang") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/barang/transferBarang" addClass={"my-1"} label={"Transfer Barang"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Barang_KonversiBarang") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/barang/konversiBarang" addClass={"my-1"} label={"Konversi Barang"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                </ul>
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Persediaan_Jasa") ? <>
                                            <li>
                                                <p className="font-bold pointer-events-none">Jasa</p>
                                                <ul>
                                                    {
                                                        getRolesInCookie("Persediaan_Jasa_DaftarJasa") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/jasa/daftarJasa" addClass={"my-1"} label={"Daftar Jasa"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Jasa_SatuanJasa") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/jasa/satuanJasa" addClass={"my-1"} label={"Satuan Jasa"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Jasa_KategoriJasa") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/jasa/kategoriJasa" addClass={"my-1"} label={"Kategori Jasa"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Jasa_JenisJasa") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/jasa/jenisJasa" addClass={"my-1"} label={"Jenis Jasa"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Jasa_JenisPenjualanJasa") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/jasa/jenisPenjualanJasa" addClass={"my-1"} label={"Jenis Penjualan"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                </ul>
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Persediaan_Opname") ? <>
                                            <li>
                                                <p className="font-bold pointer-events-none">Opname</p>
                                                <ul>
                                                    {
                                                        getRolesInCookie("Persediaan_Opname_PerintahStokOpname") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/opname/perintahStokOpname" addClass={"my-1"} label={"Perintah Stok Opname"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Opname_HasilStokOpname") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/opname/hasilStokOpname" addClass={"my-1"} label={"Hasil Stok Opname"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Opname_PenyesuaianPersediaan") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/opname/penyesuaianPersediaan" addClass={"my-1"} label={"Penyesuaian Persediaan"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Opname_JurnalStokOpname") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/opname/jurnalStokOpname" addClass={"my-1"} label={"Jurnal Stok Opname"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                </ul>
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Persediaan_Gudang") ? <>
                                            <li>
                                                <p className="font-bold pointer-events-none">Gudang</p>
                                                <ul>
                                                    {
                                                        getRolesInCookie("Persediaan_Gudang_DaftarGudang") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/gudang/daftarGudang" addClass={"my-1"} label={"Daftar Gudang"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Gudang_JenisGudang") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/gudang/jenisGudang" addClass={"my-1"} label={"Jenis Gudang"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                    {
                                                        getRolesInCookie("Persediaan_Gudang_KategoriGudang") ? <>
                                                            <li>
                                                                <NavigationLink to="/persediaan/gudang/kategoriGudang" addClass={"my-1"} label={"Kategori Gudang"} />
                                                            </li>
                                                        </> : <></>
                                                    }
                                                </ul>
                                            </li>
                                        </> : <></>
                                    }
                                </ul>
                            </details>
                        </li>
                    </> : <></>
                }
                {
                    getRolesInCookie("BukuBesar") ? <>
                        <li>
                            <details onClick={(e) => _closeAllDetail(e)}>
                                <NavigationLinkParent
                                    Icon={<FaBook size={15} />}
                                    parentName={"Buku Besar"}
                                    sideBars={sideBars[0]}
                                />
                                <ul className="menu z-50 bg-gray-100 rounded-md w-full">
                                    {
                                        getRolesInCookie("BukuBesar_JurnalUmum") ? <>
                                            <li>
                                                <NavigationLink to="/bukuBesar/jurnalUmum" addClass={"my-1"} label={"Jurnal Umum"} />
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("BukuBesar_HistoryAkun") ? <>
                                            <li>
                                                <NavigationLink to="/bukuBesar/historyAkun" addClass={"my-1"} label={"History Akun"} />
                                            </li>
                                        </> : <></>
                                    }
                                </ul>
                            </details>
                        </li>
                    </> : <></>
                }
                {
                    getRolesInCookie("Laporan") ? <>
                        <li>
                            <details onClick={(e) => _closeAllDetail(e)}>
                                <NavigationLinkParent
                                    Icon={<FaRegChartBar size={15} />}
                                    parentName={"Laporan"}
                                    sideBars={sideBars[0]}
                                />
                                <ul className="menu z-50 bg-gray-100 rounded-md w-max">
                                    {
                                        getRolesInCookie("Laporan_NeracaSaldo") ? <>
                                            <li>
                                                <NavigationLink to="/laporan/neracaSaldo" addClass={"my-1"} label={"Neraca Saldo"} />
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Laporan_LabaRugi") ? <>
                                            <li>
                                                <NavigationLink to="/laporan/labaRugi" addClass={"my-1"} label={"Laba Rugi"} />
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Laporan_Neraca") ? <>
                                            <li>
                                                <NavigationLink to="/laporan/neraca" addClass={"my-1"} label={"Neraca"} />
                                            </li>
                                        </> : <></>
                                    }
                                    {
                                        getRolesInCookie("Laporan_PerubahanModal") ? <>
                                            <li>
                                                <NavigationLink to="/laporan/perubahanModal" addClass={"my-1"} label={"Perubahan Modal"} />
                                            </li>
                                        </> : <></>
                                    }
                                </ul>
                            </details>
                        </li>
                    </> : <></>
                }
                {
                    getRolesInCookie("AktivitasDokumen") ? <>
                        <li>
                            <NavigationLink
                                icon={<FaFileCsv />}
                                label={"Aktivitas Dokumen"}
                                to={"/aktivitasDokumen"}
                                addClass={"ml-2"}
                            />
                        </li>
                    </> : <></>
                }
            </ul>
            <div className="flex justify-between relative py-3 px-8 bg-blue-900 z-100">
                {
                    navigateOpen ? <div
                        className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-60 z-40 cursor-pointer"
                        onClick={() => closeAllDetailByParent()}
                    ></div> : <></>
                }
                <div className="text-sm text-white breadcrumbs">
                    <ul>
                        {
                            sideBars.map(item => {
                                return <>
                                    <li>
                                        <p>{item}</p>
                                    </li>
                                </>
                            })
                        }
                    </ul>
                </div>
                <FormSelect
                    optionsDataList={yearList()}
                    optionsLabel={"value"}
                    optionsValue={"value"}
                    selectValue={{
                        label: tahun,
                        value: tahun
                    }}
                    onchange={(e) => {
                        let dataCopy = data
                        dataCopy.tahun = e.value
                        dataCopy.dashboard = {
                            overview: getBulanList().map(i => i = {
                                jurnal: null,
                                neracaSaldo: null,
                                labaRugi: null,
                                neraca: null,
                                perubahanModal: null,
                            }),
                            penjualan: [],
                            pembelian: [],
                            biaya: []
                        }
                        setData(dataCopy)
                        setTahun(e.value)
                    }}
                    addClass={`w-max px-1 bg-white font-bold rounded-md z-30`}
                />
            </div>
        </div>
    </>
}

export default Navigasi;