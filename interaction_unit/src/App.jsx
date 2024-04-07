import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import jurnalUmumPath from './path/bukuBesar/jurnalUmum.path';
import JurnalUmumPage from './page/bukuBesar/jurnalUmum/JurnalUmum.page';
import neracaSaldoPath from './path/laporan/neracaSaldo.path';
import NeracaSaldoPage from './page/laporan/neracaSaldo/NeracaSaldo.page';
import historyAkunPath from './path/bukuBesar/historyAkun.path';
import HistoryAkunPage from './page/bukuBesar/historyAkun/HistoryAkun.page';
import labaRugiPath from './path/laporan/labaRugi.path';
import LabaRugiPage from './page/laporan/labaRugi/LabaRugi.page';
import neracaPath from './path/laporan/neraca.path';
import NeracaPage from './page/laporan/neraca/Neraca.page';
import kodeAkunPath from './path/perusahaan/kodeAkun.path';
import KodeAkunPage from './page/perusahaan/kodeAkun/KodeAkun.page';
import dashboardPath from './path/dashboard/dashboard.path';
import perubahanModalPath from './path/laporan/perubahanModal.path';
import PerubahanModalPage from './page/laporan/perubahanModal/PerubahanModal.page';
import loginPath from './path/login.path';
import LoginPage from './page/Login.page';
import Dashboard2Page from './page/dashboard/Dashboard2.page';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;
