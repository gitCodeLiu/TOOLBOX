import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExcelToChartPage from './tools/excel-to-chart/ExcelToChartPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools/excel-to-chart" element={<ExcelToChartPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
