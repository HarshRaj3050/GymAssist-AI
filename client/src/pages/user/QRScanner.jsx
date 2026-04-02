import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner() {

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 0.5, qrbox: 250 },
      false
    );

    const onScanSuccess = async (decodedText) => {
      console.log("QR Scanned:", decodedText);

      try {
        const res = await fetch(
          "http://localhost:3000/api/attendance/mark",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          alert(`✅ ${data.message}`);
        } else {
          alert(`❌ ${data.message}`);
        }

      } catch (err) {
        console.error(err);
        alert("Server Error ❌");
      }

      scanner.clear();
    };

    const onScanFailure = (error) => {
      console.warn(error);
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Gym Attendance</h1>

      <div id="reader" style={{ width: "300px", margin: "auto" }}></div>
    </div>
  );
}

export default QRScanner;