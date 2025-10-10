import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BrowseListings from './pages/BrowseListings';
import Admin from './components/Admin';
import ThemeSample from './components/ThemeSample';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<BrowseListings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/theme-sample" element={<ThemeSample />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
