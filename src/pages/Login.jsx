import { useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      nav("/dashboard");
    } catch (e) {
      alert(e.message);
    }
  };

  const emailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      nav("/dashboard");
    } catch (e) {
      alert(e.message);
    }
  };

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      alert("Registration Successful!");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", color:"white" }}>
      <h1>Smart Door Lock Login</h1>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPass(e.target.value)}
      /><br /><br />

      <button onClick={emailLogin}>Login</button>
      <button onClick={register} style={{ marginLeft: "10px" }}>Register</button>

      <br /><br />

      <button onClick={googleLogin}>Login with Google</button>
    </div>
  );
}
