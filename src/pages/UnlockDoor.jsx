import React from "react";
import { startAuthentication } from "@simplewebauthn/browser";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function UnlockDoor() {
  const navigate = useNavigate();

  const base64urlToArrayBuffer = (base64url) => {
    const pad = "=".repeat((4 - (base64url.length % 4)) % 4);
    const base64 = (base64url + pad).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    const buffer = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) buffer[i] = raw.charCodeAt(i);
    return buffer.buffer;
  };

  const unlock = async () => {
    try {
      if (!auth.currentUser) {
        return alert("You must login first!");
      }

      // Load stored fingerprint credential
      const snap = await getDoc(doc(db, "devices", auth.currentUser.uid));
      if (!snap.exists()) return alert("No fingerprint registered!");

      const saved = snap.data().credential;

      // REAL credential rawId (Base64URL)
      const rawIdBase64url = saved.rawId;

      // Convert → ArrayBuffer
      const rawIdBuffer = base64urlToArrayBuffer(rawIdBase64url);

      // Generate challenge
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const options = {
        challenge,
        rpId: import.meta.env.VITE_RP_ID,

        allowCredentials: [
          {
            id: rawIdBuffer, // MUST be ArrayBuffer
            type: "public-key",
          },
        ],

        userVerification: "required",
      };

      console.log("Auth Options:", options);

      await startAuthentication(options);

      alert("Door Unlocked ✔");

    } catch (err) {
      console.error("Unlock error:", err);
      alert("Unlock Failed ❌");
    }
  };

  return (
    <div className="page">
      <h1>Unlock Door</h1>

      <button className="btn" onClick={unlock}>
        Scan Fingerprint
      </button>

      <button
        className="btn-secondary"
        onClick={() => navigate("/dashboard")}
      >
        Back
      </button>
    </div>
  );
}
