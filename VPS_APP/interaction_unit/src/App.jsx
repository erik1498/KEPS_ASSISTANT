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

const JurnalUmumPage = React.lazy(() => import('./page/bukuBesar/jurnalUmum/JurnalUmum.page'));
const NeracaSaldoPage = React.lazy(() => import('./page/laporan/neracaSaldo/NeracaSaldo.page'));
const HistoryAkunPage = React.lazy(() => import('./page/bukuBesar/historyAkun/HistoryAkun.page'));
const LabaRugiPage = React.lazy(() => import('./page/laporan/labaRugi/LabaRugi.page'));
const NeracaPage = React.lazy(() => import('./page/laporan/neraca/Neraca.page'));
const KodeAkunPage = React.lazy(() => import('./page/perusahaan/kodeAkun/KodeAkun.page'));
const PerubahanModalPage = React.lazy(() => import('./page/laporan/perubahanModal/PerubahanModal.page'));
const Dashboard2Page = React.lazy(() => import('./page/dashboard/Dashboard2.page'));

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
