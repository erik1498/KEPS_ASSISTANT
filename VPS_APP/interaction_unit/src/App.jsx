import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import perubahanModalPath from './path/laporan/perubahanModal.path';
import neracaPath from './path/laporan/neraca.path';
import labaRugiPath from './path/laporan/labaRugi.path';
import neracaSaldoPath from './path/laporan/neracaSaldo.path';
import historyAkunPath from './path/bukuBesar/historyAkun.path';
import jurnalUmumPath from './path/bukuBesar/jurnalUmum.path';
import kodeAkunPath from './path/perusahaan/kodeAkun.path';
import dashboardPath from './path/dashboard/dashboard.path';
import loginPath from './path/login.path';
import LoadingPage from './component/layout/LoadingPage';
import LoginPage from './page/Login.page';
import aktivitasDokumenPath from './path/aktivitasDokumen/aktivitasDokumen';
import cabangPath from './path/perusahaan/cabang.path';
import divisiPath from './path/perusahaan/divisi.path';
import jabatanPath from './path/perusahaan/jabatan.path';
import tipePembayaranPath from './path/perusahaan/tipePembayaran.path';
import syaratPembayaranPath from './path/perusahaan/syaratPembayaran.path';
import statusTanggunganPath from './path/perusahaan/statusTanggungan.path';
import customerPath from './path/perusahaan/customer.path';
import supplierPath from './path/perusahaan/supplier.path';
import pegawaiPath from './path/perusahaan/pegawai.path';
import satuanBarangPath from './path/persediaan/barang/satuanBarang.path';
import kategoriBarangPath from './path/persediaan/barang/kategoriBarang.path';
import jenisBarangPath from './path/persediaan/barang/jenisBarang.path';
import jenisPenjualanBarangPath from './path/persediaan/barang/jenisPenjualanBarang.path';
import satuanJasaPath from './path/persediaan/jasa/satuanJasa.path';
import kategoriJasaPath from './path/persediaan/jasa/kategoriJasa.path';
import jenisJasaPath from './path/persediaan/jasa/jenisJasa.path';
import jenisPenjualanJasaPath from './path/persediaan/jasa/jenisPenjualanJasa.path';
import kategoriGudangPath from './path/persediaan/gudang/kategoriGudang.path';
import jenisGudangPath from './path/persediaan/gudang/jenisGudang.path';
import kategoriAsetPath from './path/asetTetapDanPerlengkapan/asetTetap/kategoriAset.path';
import kelompokAsetPath from './path/asetTetapDanPerlengkapan/asetTetap/kelompokAset.path';
import kategoriPerlengkapanPath from './path/asetTetapDanPerlengkapan/perlengkapan/kategoriPerlengkapan.path';
import metodePenyusutanPath from './path/asetTetapDanPerlengkapan/penyusutan/metodePenyusutan.path';
import persentasePenyusutanPath from './path/asetTetapDanPerlengkapan/penyusutan/persentasePenyusutan.path';
import daftarBarangPath from './path/persediaan/barang/daftarBarang.path';
import daftarGudangPath from './path/persediaan/gudang/daftarGudang.path';
import daftarJasaPath from './path/persediaan/jasa/daftarJasa.path';
import kasPath from './path/transaksi/kasDanBank/kas.path';
import bankPath from './path/transaksi/kasDanBank/bank.path';
import pendapatanPegawaiPath from './path/transaksi/payroll/pendapatanPegawai.path';
import potonganPegawaiPath from './path/transaksi/payroll/potonganPegawai.path';
import slipGajiPegawaiPath from './path/transaksi/payroll/slipGajiPegawai.path';
import daftarAsetPath from './path/asetTetapDanPerlengkapan/asetTetap/daftarAset.path';
import daftarPerlengkapanPath from './path/asetTetapDanPerlengkapan/perlengkapan/daftarPerlengkapan.path';
import hitunganPenyusutanPath from './path/asetTetapDanPerlengkapan/penyusutan/hitunganPenyusutan.path';
import penjualanBarangPath from './path/transaksi/penjualan/penjualanBarang.path';
import penjualanJasaPath from './path/transaksi/penjualan/penjualanJasa.path';
import pembelianBarangPath from './path/transaksi/pembelian/pembelianBarang.path';
import transferBarangPath from './path/persediaan/barang/transferBarang.path';
import konversiBarangPath from './path/persediaan/barang/konversiBarang.path';
import perintahStokOpnamePath from './path/persediaan/opname/perintahStokOpname.path';
import hasilStokOpnamePath from './path/persediaan/opname/hasilStokOpname.path';
import penyesuaianPersediaanPath from './path/persediaan/opname/penyesuaianPersediaan.path';

const JurnalUmumPage = React.lazy(() => import('./page/bukuBesar/jurnalUmum/JurnalUmum.page'));
const NeracaSaldoPage = React.lazy(() => import('./page/laporan/neracaSaldo/NeracaSaldo.page'));
const HistoryAkunPage = React.lazy(() => import('./page/bukuBesar/historyAkun/HistoryAkun.page'));
const LabaRugiPage = React.lazy(() => import('./page/laporan/labaRugi/LabaRugi.page'));
const NeracaPage = React.lazy(() => import('./page/laporan/neraca/Neraca.page'));
const KodeAkunPage = React.lazy(() => import('./page/perusahaan/kodeAkun/KodeAkun.page'));
const PerubahanModalPage = React.lazy(() => import('./page/laporan/perubahanModal/PerubahanModal.page'));
const Dashboard2Page = React.lazy(() => import('./page/dashboard/Dashboard2.page'));
const AktivitasDokumenPage = React.lazy(() => import('./page/aktivitasDokumen/AktivitasDokumen.page'));
const CabangPage = React.lazy(() => import('./page/perusahaan/cabang/Cabang.page'))
const DivisiPage = React.lazy(() => import('./page/perusahaan/divisi/Divisi.page'))
const JabatanPage = React.lazy(() => import('./page/perusahaan/jabatan/Jabatan.page'))
const TipePembayaranPage = React.lazy(() => import('./page/perusahaan/tipePembayaran/TipePembayaran.page'))
const SyaratPembayaranPage = React.lazy(() => import('./page/perusahaan/syaratPembayaran/SyaratPembayaran.page'))
const StatusTanggunganPage = React.lazy(() => import('./page/perusahaan/statusTangungan/StatusTanggungan.page'))
const CustomerPage = React.lazy(() => import('./page/perusahaan/customer/Customer.page'))
const SupplierPage = React.lazy(() => import('./page/perusahaan/supplier/Supplier.page'))
const PegawaiPage = React.lazy(() => import('./page/perusahaan/pegawai/Pegawai.page'))
const SatuanBarangPage = React.lazy(() => import('./page/persediaan/barang/satuanBarang/SatuanBarang.page'))
const TransferBarangPage = React.lazy(() => import('./page/persediaan/barang/transferBarang/TransferBarang.page'))
const KonversiBarangPage = React.lazy(() => import('./page/persediaan/barang/konversiBarang/KonversiBarang.page'))
const KategoriBarangPage = React.lazy(() => import('./page/persediaan/barang/kategoriBarang/KategoriBarang.page'))
const JenisBarangPage = React.lazy(() => import('./page/persediaan/barang/jenisBarang/JenisBarang.page'))
const JenisPenjualanBarangPage = React.lazy(() => import('./page/persediaan/barang/jenisPenjualanBarang/JenisPenjualanBarang.page'))
const SatuanJasaPage = React.lazy(() => import('./page/persediaan/jasa/satuanJasa/SatuanJasa.page'))
const KategoriJasaPage = React.lazy(() => import('./page/persediaan/jasa/kategoriJasa/KategoriJasa.page'))
const JenisJasaPage = React.lazy(() => import('./page/persediaan/jasa/jenisJasa/JenisJasa.page'))
const JenisPenjualanJasaPage = React.lazy(() => import('./page/persediaan/jasa/jenisPenjualanJasa/JenisPenjualanJasa.page'))
const KategoriGudangPage = React.lazy(() => import('./page/persediaan/gudang/kategoriGudang/KategoriGudang.page'))
const JenisGudangPage = React.lazy(() => import('./page/persediaan/gudang/jenisGudang/JenisGudang.page'))
const DaftarAsetPage = React.lazy(() => import('./page/asetTetapDanPerlengkapan/asetTetap/daftarAset/DaftarAset.page'));
const KategoriAsetPage = React.lazy(() => import('./page/asetTetapDanPerlengkapan/asetTetap/kategoriAset/KategoriAset.page'))
const KelompokAsetPage = React.lazy(() => import('./page/asetTetapDanPerlengkapan/asetTetap/kelompokAset/KelompokAset.page'))
const DaftarPerlengkapanPage = React.lazy(() => import('./page/asetTetapDanPerlengkapan/perlengkapan/daftarPerlengkapan/DaftarPerlengkapan.page'))
const KategoriPerlengkapanPage = React.lazy(() => import('./page/asetTetapDanPerlengkapan/perlengkapan/kategoriPerlengkapan/KategoriPerlengkapan.page'))
const HitunganPenyusutanPage = React.lazy(() => import('./page/asetTetapDanPerlengkapan/penyusutan/hitunganPenyusutan/HitunganPenyusutanPage'))
const MetodePenyusutanPage = React.lazy(() => import('./page/asetTetapDanPerlengkapan/penyusutan/metodePenyusutan/MetodePenyusutan.page'))
const PersentasePenyusutanPage = React.lazy(() => import('./page/asetTetapDanPerlengkapan/penyusutan/persentasePenyusutan/PersentasePenyusutan.page'))
const DaftarBarangPage = React.lazy(() => import('./page/persediaan/barang/daftarBarang/DaftarBarang.page'))
const DaftarGudangPage = React.lazy(() => import('./page/persediaan/gudang/daftarGudang/DaftarGudang.page'))
const DaftarJasaPage = React.lazy(() => import('./page/persediaan/jasa/daftarJasa/DaftarJasa.page'))
const KasPage = React.lazy(() => import('./page/transaksi/kasDanBank/kas/KasPage'))
const BankPage = React.lazy(() => import('./page/transaksi/kasDanBank/bank/BankPage'))
const PendapatanPegawaiPage = React.lazy(() => import('./page/transaksi/payroll/pendapatanPegawai/PendapatanPegawaiPage'))
const PotonganPegawaiPage = React.lazy(() => import('./page/transaksi/payroll/potonganPegawai/PotonganPegawaiPage'))
const SlipGajiPegawaiPage = React.lazy(() => import('./page/transaksi/payroll/slipGajiPegawai/SlipGajiPegawaiPage'))
const PenjualanJasaPage = React.lazy(() => import('./page/transaksi/penjualan/penjualanJasa/PenjualanJasaPage'))
const PenjualanBarangPage = React.lazy(() => import('./page/transaksi/penjualan/penjualanBarang/PenjualanBarangPage'))
const PembelianBarangPage = React.lazy(() => import('./page/transaksi/pembelian/pembelianBarang/PembelianBarangPage'))
const PerintahStokOpnamePage = React.lazy(() => import('./page/persediaan/opname/perintahStokOpname/PerintahStokOpname.page'))
const HasilStokOpnamePage = React.lazy(() => import('./page/persediaan/opname/hasilStokOpname/HasilStokOpname.page'));
const PenyesuaianPersediaanPage  = React.lazy(() => import('./page/persediaan/opname/penyesuaianPersediaan/PenyesuaianPersediaan.page'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingPage />}>
        <Routes basename={loginPath.main}>
          <Route path={loginPath.main} element={<LoginPage />} />
        </Routes>
        <Routes basename={dashboardPath.main}>
          <Route path={dashboardPath.main} element={<Dashboard2Page />} />
        </Routes>
        <Routes basename={kodeAkunPath.main}>
          <Route path={kodeAkunPath.main} element={<KodeAkunPage />} />
        </Routes>
        <Routes basename={customerPath.main}>
          <Route path={customerPath.main} element={<CustomerPage />} />
        </Routes>
        <Routes basename={supplierPath.main}>
          <Route path={supplierPath.main} element={<SupplierPage />} />
        </Routes>
        <Routes basename={pegawaiPath.main}>
          <Route path={pegawaiPath.main} element={<PegawaiPage />} />
        </Routes>
        <Routes basename={cabangPath.main}>
          <Route path={cabangPath.main} element={<CabangPage />} />
        </Routes>
        <Routes basename={divisiPath.main}>
          <Route path={divisiPath.main} element={<DivisiPage />} />
        </Routes>
        <Routes basename={jabatanPath.main}>
          <Route path={jabatanPath.main} element={<JabatanPage />} />
        </Routes>
        <Routes basename={tipePembayaranPath.main}>
          <Route path={tipePembayaranPath.main} element={<TipePembayaranPage />} />
        </Routes>
        <Routes basename={syaratPembayaranPath.main}>
          <Route path={syaratPembayaranPath.main} element={<SyaratPembayaranPage />} />
        </Routes>
        <Routes basename={statusTanggunganPath.main}>
          <Route path={statusTanggunganPath.main} element={<StatusTanggunganPage />} />
        </Routes>
        <Routes basename={aktivitasDokumenPath.main}>
          <Route path={aktivitasDokumenPath.main} element={<AktivitasDokumenPage />} />
        </Routes>
        <Routes basename={daftarBarangPath.main}>
          <Route path={daftarBarangPath.main} element={<DaftarBarangPage />} />
        </Routes>
        <Routes basename={satuanBarangPath.main}>
          <Route path={satuanBarangPath.main} element={<SatuanBarangPage />} />
        </Routes>
        <Routes basename={transferBarangPath.main}>
          <Route path={transferBarangPath.main} element={<TransferBarangPage />} />
        </Routes>
        <Routes basename={konversiBarangPath.main}>
          <Route path={konversiBarangPath.main} element={<KonversiBarangPage />} />
        </Routes>
        <Routes basename={kategoriBarangPath.main}>
          <Route path={kategoriBarangPath.main} element={<KategoriBarangPage />} />
        </Routes>
        <Routes basename={jenisBarangPath.main}>
          <Route path={jenisBarangPath.main} element={<JenisBarangPage />} />
        </Routes>
        <Routes basename={jenisPenjualanBarangPath.main}>
          <Route path={jenisPenjualanBarangPath.main} element={<JenisPenjualanBarangPage />} />
        </Routes>
        <Routes basename={daftarJasaPath.main}>
          <Route path={daftarJasaPath.main} element={<DaftarJasaPage />} />
        </Routes>
        <Routes basename={satuanJasaPath.main}>
          <Route path={satuanJasaPath.main} element={<SatuanJasaPage />} />
        </Routes>
        <Routes basename={kategoriJasaPath.main}>
          <Route path={kategoriJasaPath.main} element={<KategoriJasaPage />} />
        </Routes>
        <Routes basename={jenisJasaPath.main}>
          <Route path={jenisJasaPath.main} element={<JenisJasaPage />} />
        </Routes>
        <Routes basename={jenisPenjualanJasaPath.main}>
          <Route path={jenisPenjualanJasaPath.main} element={<JenisPenjualanJasaPage />} />
        </Routes>
        <Routes basename={perintahStokOpnamePath.main}>
          <Route path={perintahStokOpnamePath.main} element={<PerintahStokOpnamePage />} />
        </Routes>
        <Routes basename={hasilStokOpnamePath.main}>
          <Route path={hasilStokOpnamePath.main} element={<HasilStokOpnamePage />} />
        </Routes>
        <Routes basename={penyesuaianPersediaanPath.main}>
          <Route path={penyesuaianPersediaanPath.main} element={<PenyesuaianPersediaanPage />} />
        </Routes>
        <Routes basename={kategoriGudangPath.main}>
          <Route path={kategoriGudangPath.main} element={<KategoriGudangPage />} />
        </Routes>
        <Routes basename={daftarGudangPath.main}>
          <Route path={daftarGudangPath.main} element={<DaftarGudangPage />} />
        </Routes>
        <Routes basename={jenisGudangPath.main}>
          <Route path={jenisGudangPath.main} element={<JenisGudangPage />} />
        </Routes>
        <Routes basename={daftarAsetPath.main}>
          <Route path={daftarAsetPath.main} element={<DaftarAsetPage />} />
        </Routes>
        <Routes basename={kategoriAsetPath.main}>
          <Route path={kategoriAsetPath.main} element={<KategoriAsetPage />} />
        </Routes>
        <Routes basename={kelompokAsetPath.main}>
          <Route path={kelompokAsetPath.main} element={<KelompokAsetPage />} />
        </Routes>
        <Routes basename={daftarPerlengkapanPath.main}>
          <Route path={daftarPerlengkapanPath.main} element={<DaftarPerlengkapanPage />} />
        </Routes>
        <Routes basename={kategoriPerlengkapanPath.main}>
          <Route path={kategoriPerlengkapanPath.main} element={<KategoriPerlengkapanPage />} />
        </Routes>
        <Routes basename={metodePenyusutanPath.main}>
          <Route path={metodePenyusutanPath.main} element={<MetodePenyusutanPage />} />
        </Routes>
        <Routes basename={hitunganPenyusutanPath.main}>
          <Route path={hitunganPenyusutanPath.main} element={<HitunganPenyusutanPage />} />
        </Routes>
        <Routes basename={persentasePenyusutanPath.main}>
          <Route path={persentasePenyusutanPath.main} element={<PersentasePenyusutanPage />} />
        </Routes>
        <Routes basename={jurnalUmumPath.main}>
          <Route path={jurnalUmumPath.main} element={<JurnalUmumPage />} />
        </Routes>
        <Routes basename={historyAkunPath.main}>
          <Route path={historyAkunPath.main} element={<HistoryAkunPage />} />
        </Routes>
        <Routes basename={neracaSaldoPath.main}>
          <Route path={neracaSaldoPath.main} element={<NeracaSaldoPage />} />
        </Routes>
        <Routes basename={labaRugiPath.main}>
          <Route path={labaRugiPath.main} element={<LabaRugiPage />} />
        </Routes>
        <Routes basename={neracaPath.main}>
          <Route path={neracaPath.main} element={<NeracaPage />} />
        </Routes>
        <Routes basename={perubahanModalPath.main}>
          <Route path={perubahanModalPath.main} element={<PerubahanModalPage />} />
        </Routes>
        <Routes basename={kasPath.main}>
          <Route path={kasPath.main} element={<KasPage />} />
        </Routes>
        <Routes basename={bankPath.main}>
          <Route path={bankPath.main} element={<BankPage />} />
        </Routes>
        <Routes basename={penjualanBarangPath.main}>
          <Route path={penjualanBarangPath.main} element={<PenjualanBarangPage />} />
        </Routes>
        <Routes basename={penjualanJasaPath.main}>
          <Route path={penjualanJasaPath.main} element={<PenjualanJasaPage />} />
        </Routes>
        <Routes basename={pembelianBarangPath.main}>
          <Route path={pembelianBarangPath.main} element={<PembelianBarangPage />} />
        </Routes>
        <Routes basename={pendapatanPegawaiPath.main}>
          <Route path={pendapatanPegawaiPath.main} element={<PendapatanPegawaiPage />} />
        </Routes>
        <Routes basename={potonganPegawaiPath.main}>
          <Route path={potonganPegawaiPath.main} element={<PotonganPegawaiPage />} />
        </Routes>
        <Routes basename={slipGajiPegawaiPath.main}>
          <Route path={slipGajiPegawaiPath.main} element={<SlipGajiPegawaiPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
