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
import daftarBarangPath from './path/persediaan/barang/daftarBarang.path';

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
const KategoriBarangPage = React.lazy(() => import('./page/persediaan/barang/kategoriBarang/KategoriBarang.page'))
const JenisBarangPage = React.lazy(() => import('./page/persediaan/barang/jenisBarang/JenisBarang.page'))
const JenisPenjualanBarangPage = React.lazy(() => import('./page/persediaan/barang/jenisPenjualanBarang/JenisPenjualanBarang.page'))
const SatuanJasaPage = React.lazy(() => import('./page/persediaan/jasa/satuanJasa/SatuanJasa.page'))
const KategoriJasaPage = React.lazy(() => import('./page/persediaan/jasa/kategoriJasa/KategoriJasa.page'))
const JenisJasaPage = React.lazy(() => import('./page/persediaan/jasa/jenisJasa/JenisJasa.page'))
const JenisPenjualanJasaPage = React.lazy(() => import('./page/persediaan/jasa/jenisPenjualanJasa/JenisPenjualanJasa.page'))
const KategoriGudangPage = React.lazy(() => import('./page/persediaan/gudang/kategoriGudang/KategoriGudang.page'))
const JenisGudangPage = React.lazy(() => import('./page/persediaan/gudang/jenisGudang/JenisGudang.page'))
const KategoriAsetPage = React.lazy(() => import('./page/asetTetapDanPerlengkapan/asetTetap/kategoriAset/KategoriAset.page'))
const KelompokAsetPage = React.lazy(() => import('./page/asetTetapDanPerlengkapan/asetTetap/kelompokAset/KelompokAset.page'))
const KategoriPerlengkapanPage = React.lazy(() => import('./page/asetTetapDanPerlengkapan/perlengkapan/kategoriPerlengkapan/KategoriPerlengkapan.page'))
const MetodePenyusutanPage = React.lazy(() => import('./page/asetTetapDanPerlengkapan/penyusutan/kategoriPerlengkapan/MetodePenyusutan.page'))
const DaftarBarangPage = React.lazy(() => import('./page/persediaan/barang/daftarBarang/DaftarBarang.page'))

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
        <Routes basename={kategoriBarangPath.main}>
          <Route path={kategoriBarangPath.main} element={<KategoriBarangPage />} />
        </Routes>
        <Routes basename={jenisBarangPath.main}>
          <Route path={jenisBarangPath.main} element={<JenisBarangPage />} />
        </Routes>
        <Routes basename={jenisPenjualanBarangPath.main}>
          <Route path={jenisPenjualanBarangPath.main} element={<JenisPenjualanBarangPage />} />
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
        <Routes basename={kategoriGudangPath.main}>
          <Route path={kategoriGudangPath.main} element={<KategoriGudangPage />} />
        </Routes>
        <Routes basename={jenisGudangPath.main}>
          <Route path={jenisGudangPath.main} element={<JenisGudangPage />} />
        </Routes>
        <Routes basename={kategoriAsetPath.main}>
          <Route path={kategoriAsetPath.main} element={<KategoriAsetPage />} />
        </Routes>
        <Routes basename={kelompokAsetPath.main}>
          <Route path={kelompokAsetPath.main} element={<KelompokAsetPage />} />
        </Routes>
        <Routes basename={kategoriPerlengkapanPath.main}>
          <Route path={kategoriPerlengkapanPath.main} element={<KategoriPerlengkapanPage />} />
        </Routes>
        <Routes basename={metodePenyusutanPath.main}>
          <Route path={metodePenyusutanPath.main} element={<MetodePenyusutanPage />} />
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
      </Suspense>
    </Router>
  );
}

export default App;
