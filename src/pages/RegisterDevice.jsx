import React from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function RegisterDevice() {
  const navigate = useNavigate();

  const registerFingerprint = async () => {
    try {
      if (!auth.currentUser) {
        alert("You must be logged in");
        return;
      }

      // Generate challenge
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const options = {
        challenge,
        rp: {
          name: "Smart Door Lock",
          id: import.meta.env.VITE_RP_ID,
        },

        user: {
          id: new TextEncoder().encode(auth.currentUser.uid),
          name: auth.currentUser.email,
          displayName: auth.currentUser.email,
        },

        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" },
        ],

        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },

        timeout: 60000,
      };

      console.log("WebAuthn Registration Options:", options);

      // This triggers fingerprint/Windows Hello
      const credential = await startRegistration(options);

      // Convert rawId (ArrayBuffer) → base64url
      const rawIdBase64url = btoa(
        String.fromCharCode(...new Uint8Array(credential.rawId))
      )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");

      // Store ONLY required fields
      await setDoc(doc(db, "devices", auth.currentUser.uid), {
        id: credential.id,               // string
        rawId: rawIdBase64url,           // base64url
        type: credential.type            // "public-key"
      });

      alert("Fingerprint Registered Successfully!");
      navigate("/dashboard");

    } catch (err) {
      console.error("WebAuthn Registration Failed:", err);
      alert("Registration Failed ❌");
    }
  };

  return (
    <div className="page">
      <h1>Register Fingerprint</h1>

      <button className="btn" onClick={registerFingerprint}>
        Register Fingerprint
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
