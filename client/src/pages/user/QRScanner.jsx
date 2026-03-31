import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner() {
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    let scanner;

    if (showScanner) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 1, qrbox: 250 },
        false
      );

      const onScanSuccess = async (decodedText) => {
        console.log("QR Scanned:", decodedText);

        try {
          const res = await fetch(
            "http://localhost:3000/api/attendance/mark",
            {
              method: "POST",
              credentials: "include", // 🔥 VERY IMPORTANT (send cookie)
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
        setShowScanner(false);
      };

      const onScanFailure = (error) => {
        console.warn(error);
      };

      scanner.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [showScanner]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Gym Attendance</h1>

      {!showScanner && (
        <button onClick={() => setShowScanner(true)}>
          Scan QR Code
        </button>
      )}

      {showScanner && (
        <div>
          <div id="reader" style={{ width: "300px", margin: "auto" }}></div>
          <button onClick={() => setShowScanner(false)}>
            Close Scanner
          </button>
        </div>
      )}
    </div>
  );
}

export default QRScanner;