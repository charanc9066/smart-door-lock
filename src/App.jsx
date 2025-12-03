import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RegisterDevice from "./pages/RegisterDevice.jsx";
import UnlockDoor from "./pages/UnlockDoor.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register-device" element={<RegisterDevice />} />
        <Route path="/unlock" element={<UnlockDoor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
