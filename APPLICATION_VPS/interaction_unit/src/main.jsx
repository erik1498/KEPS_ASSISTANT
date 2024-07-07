import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/theme/theme.scss';
import { DataProvider } from './context/dataContext.context.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <DataProvider>
      <App />
    </DataProvider>
);
