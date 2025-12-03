import React from "react";
import { startAuthentication } from "@simplewebauthn/browser";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Base64URL → Uint8Array
function base64urlToUint8Array(base64url) {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 2 ? "==" : base64.length % 4 === 3 ? "=" : "";
  const binary = atob(base64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export default function UnlockDoor() {
  const navigate = useNavigate();

  const unlock = async () => {
    try {
      if (!auth.currentUser) {
        return alert("You must login first!");
      }

      // Retrieve from Firestore
      const ref = doc(db, "devices", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) return alert("No fingerprint registered!");

      const saved = snap.data(); // { id, rawId, type }

      // Convert rawId back to Uint8Array
      const allowId = base64urlToUint8Array(saved.rawId);

      // Generate authentication challenge
      const challengeBytes = crypto.getRandomValues(new Uint8Array(32));
      const challengeBase64 = btoa(String.fromCharCode(...challengeBytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

      const options = {
        challenge: challengeBase64,
        rpId: import.meta.env.VITE_RP_ID,
        allowCredentials: [
          {
            id: allowId,
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

      <button className="btn" onClick={unlock}>Scan Fingerprint</button>

      <button
        className="btn-secondary"
        onClick={() => navigate("/dashboard")}
      >
        Back
      </button>
    </div>
  );
}
