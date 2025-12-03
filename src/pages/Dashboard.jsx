import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();

  const logout = () => {
    signOut(auth);
    nav("/");
  };

  return (
    <div 
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <h1>Smart Door Lock Dashboard</h1>
      
      <button 
        onClick={() => nav("/register-device")}
        style={{ marginTop: 20, padding: "10px 20px" }}
      >
        Register Device
      </button>

      <button 
        onClick={() => nav("/unlock")}
        style={{ marginTop: 20, padding: "10px 20px" }}
      >
        Unlock Door
      </button>

      <button 
        onClick={logout}
        style={{
          marginTop: 40,
          padding: "10px 20px",
          background: "red",
          color: "white"
        }}
      >
        Logout
      </button>
    </div>
  );
}
