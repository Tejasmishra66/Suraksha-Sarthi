import React, { useState, useEffect } from 'react';
import { fetchEquipment, scanEquipment, uploadIncidentMedia } from '../api/client';

export default function EquipmentTracker() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [qrCodeData, setQrCodeData] = useState("");

  useEffect(() => {
    // Load the live equipment map data
    fetchEquipment().then(data => setEquipmentList(data)).catch(console.error);
  }, []);

  const handleScanSimulation = async (e) => {
    e.preventDefault();
    // Request precise GPS location to lock with the scan
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const payload = {
        action: 'dispatch',
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        sender_id: 1
      };
      
      try {
        await scanEquipment(qrCodeData, payload);
        alert("Equipment Scanned & Location Locked successfully!");
        // Refresh list
        const updated = await fetchEquipment();
        setEquipmentList(updated);
      } catch (err) {
        alert("Error scanning equipment");
      }
    });
  };

  // Fake-Proof Photo implementation
  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        timestamp: new Date().toISOString()
      }));

      // Example incidentId = 1
      await uploadIncidentMedia(1, formData);
      alert("Fake-Proof Photo uploaded with locked GPS coordinates!");
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Live Equipment Tracker & Fake-Proof Uploads</h2>
      
      {/* QR Code Scanner Form */}
      <form onSubmit={handleScanSimulation} style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Scan QR Code (e.g. EQ-1001)" 
          value={qrCodeData}
          onChange={(e) => setQrCodeData(e.target.value)}
          required
        />
        <button type="submit">Scan & Dispatch</button>
      </form>

      {/* Fake-Proof Photo Input (Capture="environment" forces camera on mobile) */}
      <h3>Capture Secure Incident Photo</h3>
      <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} />
    </div>
  );
}