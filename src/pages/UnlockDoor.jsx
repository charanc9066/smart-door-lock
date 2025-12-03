import React from "react";
import { startAuthentication } from "@simplewebauthn/browser";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function UnlockDoor() {
  const navigate = useNavigate();

  const unlock = async () => {
    try {
      if (!auth.currentUser) {
        return alert("You must login first!");
      }

      // 1️⃣ Fetch stored credential
      const snap = await getDoc(doc(db, "devices", auth.currentUser.uid));
      if (!snap.exists()) return alert("No fingerprint registered!");

      const saved = snap.data();

      // Convert base64url rawId ➝ Uint8Array
      const rawId = Uint8Array.from(
        atob(saved.rawId.replace(/-/g, "+").replace(/_/g, "/")),
        (c) => c.charCodeAt(0)
      );

      // 2️⃣ Create authentication data
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const options = {
        challenge,
        rpId: import.meta.env.VITE_RP_ID,
        allowCredentials: [
          {
            id: rawId,
            type: "public-key",
          },
        ],
        userVerification: "required",
      };

      console.log("Auth Options:", options);

      // 3️⃣ Perform fingerprint scan
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
      <button className="btn-secondary" onClick={() => navigate("/dashboard")}>Back</button>
    </div>
  );
}

