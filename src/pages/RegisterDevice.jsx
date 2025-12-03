import React from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

// Helper: Convert ArrayBuffer → Base64URL
function bufferToBase64URL(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export default function RegisterDevice() {
  const navigate = useNavigate();

  const registerFingerprint = async () => {
    try {
      if (!auth.currentUser) {
        alert("You must be logged in");
        return;
      }

      // Generate proper challenge
      const challengeBytes = crypto.getRandomValues(new Uint8Array(32));
      const challengeBase64 = bufferToBase64URL(challengeBytes);

      const options = {
        challenge: challengeBase64,

        rp: {
          name: "Smart Door Lock",
          id: import.meta.env.VITE_RP_ID,
        },

        user: {
          id: bufferToBase64URL(
            new TextEncoder().encode(auth.currentUser.uid)
          ),
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

      // Create credential
      const credential = await startRegistration(options);

      // Save to Firestore
      await setDoc(doc(db, "devices", auth.currentUser.uid), {
        rawId: bufferToBase64URL(credential.rawId),
        cred: credential,
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

      <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
        Back
      </button>
    </div>
  );
}
