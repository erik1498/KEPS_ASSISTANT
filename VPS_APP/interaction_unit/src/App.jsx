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
const PegawaiPage  = React.lazy(() => import('./page/perusahaan/pegawai/Pegawai.page'))

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
