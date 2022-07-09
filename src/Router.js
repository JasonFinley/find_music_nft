import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Contractpage from './pages/Contractpage';
import Userpage from './pages/Userpage';
import Useruploadpage from './pages/Useruploadpage';
import Settingpage from './pages/Settingpage';
import Viewuserpage from './pages/Viewuserpage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/user" element={<Userpage />} />
        <Route path="/setting" element={<Settingpage />} />
        <Route path="/upload" element={<Useruploadpage />} />
        <Route path="/contract" element={<Contractpage />} />
        <Route path="/viewuser/:creatorAddress" element={<Viewuserpage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;