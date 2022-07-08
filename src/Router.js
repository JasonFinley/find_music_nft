import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Contractpage from './pages/Contractpage';
import Userpage from './pages/Userpage';
import Useruploadpage from './pages/Useruploadpage';
import Settingpage from './pages/Settingpage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/user" element={<Userpage />} />
        <Route path="/setting" element={<Settingpage />} />
        <Route path="/upload" element={<Useruploadpage />} />
        <Route path="/contract" element={<Contractpage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;