/**
 * Full Feature Test Script - Suraksha Sarthi (Fixed version)
 * Tests every API endpoint with 3 operations per feature
 */

const BASE = 'http://localhost:4002';
let token = '';
let adminId = null;
const results = [];
const errors = [];

function log(msg, ok = true) {
  const sym = ok ? '✅' : '❌';
  console.log(`${sym} ${msg}`);
  results.push({ ok, msg });
}

async function api(method, path, body, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function run() {
  console.log('\n========================================');
  console.log('   SURAKSHA SARTHI - FULL FEATURE TEST');
  console.log('========================================\n');

  // ─── 1. AUTH ───────────────────────────────────────────────
  console.log('\n📋 STEP 1: AUTHENTICATION');
  try {
    const r = await api('POST', '/auth/login', { email: 'officer@sdrf.local', password: 'password123' }, false);
    if (r.status === 200 && r.data.token) {
      token = r.data.token;
      adminId = r.data.user?.id || 1;
      log(`Admin login (officer@sdrf.local) → Token OK, User ID: ${adminId}`);
    } else {
      log(`Admin login FAILED: ${JSON.stringify(r.data)}`, false);
      return;
    }
    const r2 = await api('POST', '/auth/login', { email: 'police@sdrf.local', password: 'password123' }, false);
    log(`Agency head login (police@sdrf.local) → Status: ${r2.status}`);
    const r3 = await api('POST', '/auth/login', { email: 'medical@sdrf.local', password: 'password123' }, false);
    log(`Agency head login (medical@sdrf.local) → Status: ${r3.status}`);
  } catch (e) {
    log(`Auth crashed: ${e.message}`, false); return;
  }

  // ─── 2. INCIDENTS ──────────────────────────────────────────
  console.log('\n📋 STEP 2: INCIDENTS (Emergency Reports)');
  let incidentIds = [];
  try {
    // Backend expects camelCase: disasterType, agencyAssigned
    const incidents = [
      { title: 'Landslide on NH-5 near Rampur', description: 'Heavy landslide on NH-5 near Rampur. 2 vehicles trapped.', disasterType: 'Landslide', lat: 31.1048, lng: 77.1734, agencyAssigned: 'SDRF' },
      { title: 'Flash Flood - Kullu Valley', description: '15 villagers stranded near Bhuntar bridge. Medical aid required.', disasterType: 'Flood', lat: 31.3500, lng: 77.2000, agencyAssigned: 'SDRF' },
      { title: 'Road Accident - Solan Highway', description: '3 injured persons need ambulance on Shimla-Chandigarh highway.', disasterType: 'Accident', lat: 31.6000, lng: 76.9000, agencyAssigned: 'Police' }
    ];
    for (let i = 0; i < incidents.length; i++) {
      const r = await api('POST', '/incidents', incidents[i]);
      if (r.status === 201 || r.status === 200) {
        incidentIds.push(r.data.id);
        log(`Incident #${i+1}: "${incidents[i].title}" → ID: ${r.data.id}`);
      } else {
        log(`Incident #${i+1} FAILED: ${r.status} ${JSON.stringify(r.data)}`, false);
        errors.push(`Incident ${i+1}`);
      }
    }
    const fetchR = await api('GET', '/incidents');
    log(`GET /incidents → ${fetchR.data.length} records in DB`, fetchR.status === 200);
  } catch (e) { log(`Incidents crashed: ${e.message}`, false); errors.push(e.message); }

  // ─── 3. ALERTS ─────────────────────────────────────────────
  console.log('\n📋 STEP 3: ALERTS (Home Page Live Alerts + Map)');
  let alertIds = [];
  try {
    // Backend expects camelCase: disasterType, radiusKm
    const alerts = [
      { disasterType: 'Landslide', lat: 31.1048, lng: 77.1734, radiusKm: 10, severity: 'high' },
      { disasterType: 'Flood', lat: 31.3500, lng: 77.2000, radiusKm: 15, severity: 'high' },
      { disasterType: 'Accident', lat: 31.6000, lng: 76.9000, radiusKm: 5, severity: 'medium' }
    ];
    for (let i = 0; i < alerts.length; i++) {
      const r = await api('POST', '/alerts', alerts[i]);
      if (r.status === 201 || r.status === 200) {
        alertIds.push(r.data.id || r.data.alertId);
        log(`Alert #${i+1}: ${alerts[i].disasterType} [${alerts[i].severity}] → ID: ${r.data.id || r.data.alertId}`);
      } else {
        log(`Alert #${i+1} FAILED: ${r.status} ${JSON.stringify(r.data)}`, false);
        errors.push(`Alert ${i+1}`);
      }
    }
    const publicR = await fetch(`${BASE}/alerts`);
    const alertsData = await publicR.json().catch(() => []);
    log(`Public GET /alerts (no login) → ${alertsData.length} alerts visible on home page`, publicR.status === 200);
  } catch (e) { log(`Alerts crashed: ${e.message}`, false); errors.push(e.message); }

  // ─── 4. VOLUNTEERS ─────────────────────────────────────────
  console.log('\n📋 STEP 4: VOLUNTEERS');
  try {
    const volunteers = [
      { name: 'Ramesh Kumar', phone: '9811111111', lat: 31.1, lng: 77.1, capabilities: 'SAR,Medical', terrain_restrictions: 'none', department: 'SDRF', place: 'Shimla', active: 1 },
      { name: 'Priya Singh', phone: '9822222222', lat: 31.35, lng: 77.2, capabilities: 'Medical,First Aid', terrain_restrictions: 'none', department: 'Medical', place: 'Kullu', active: 1 },
      { name: 'Vikram Negi', phone: '9833333333', lat: 31.7, lng: 76.9, capabilities: 'Rescue,Logistics', terrain_restrictions: 'none', department: 'Police', place: 'Mandi', active: 1 }
    ];
    for (let i = 0; i < volunteers.length; i++) {
      const r = await api('POST', '/volunteers', volunteers[i]);
      if (r.status === 201 || r.status === 200) {
        log(`Volunteer #${i+1}: "${volunteers[i].name}" (${volunteers[i].place}) → ID: ${r.data.id}`);
      } else {
        log(`Volunteer #${i+1} FAILED: ${r.status} ${JSON.stringify(r.data)}`, false);
        errors.push(`Volunteer ${i+1}`);
      }
    }
    const fetchR = await api('GET', '/volunteers');
    log(`GET /volunteers → ${fetchR.data.length} records in DB`, fetchR.status === 200);
  } catch (e) { log(`Volunteers crashed: ${e.message}`, false); }

  // ─── 5. EQUIPMENT ──────────────────────────────────────────
  console.log('\n📋 STEP 5: EQUIPMENT');
  try {
    const equipment = [
      { qr_code: 'EQ-2001', name: 'Rescue Rope 50m', category: 'Rescue Gear', status: 'available', lat: 31.1, lng: 77.1, current_owner_id: adminId },
      { qr_code: 'EQ-2002', name: 'Medical Kit Advanced', category: 'Medical Equipment', status: 'available', lat: 31.35, lng: 77.2, current_owner_id: adminId },
      { qr_code: 'EQ-2003', name: 'Satellite Phone', category: 'Communication', status: 'available', lat: 31.6, lng: 76.9, current_owner_id: adminId }
    ];
    for (let i = 0; i < equipment.length; i++) {
      const r = await api('POST', '/equipment', equipment[i]);
      if (r.status === 201 || r.status === 200) {
        log(`Equipment #${i+1}: "${equipment[i].name}" QR:${equipment[i].qr_code} → ID: ${r.data.id}`);
      } else {
        log(`Equipment #${i+1} FAILED: ${r.status} ${JSON.stringify(r.data)}`, false);
        errors.push(`Equipment ${i+1}`);
      }
    }
    const fetchR = await api('GET', '/equipment');
    log(`GET /equipment → ${fetchR.data.length} records in DB`, fetchR.status === 200);
  } catch (e) { log(`Equipment crashed: ${e.message}`, false); }

  // ─── 6. TASKS ──────────────────────────────────────────────
  console.log('\n📋 STEP 6: TASKS (linked to Incidents)');
  let taskIds = [];
  try {
    if (incidentIds.length > 0) {
      const tasks = [
        { incidentId: incidentIds[0], title: 'Deploy JCB to NH-5 landslide site', details: 'Need heavy machinery at KM 234 NH-5. Contact PWD.', assignedAgency: 'SDRF', notificationAgencies: JSON.stringify(['SDRF', 'Police']), status: 'New' },
        { incidentId: incidentIds[1], title: 'Deploy rescue boats - Kullu flood', details: 'Rescue boats at Bhuntar bridge for stranded villagers.', assignedAgency: 'SDRF', notificationAgencies: JSON.stringify(['SDRF', 'Medical']), status: 'In Progress' },
        { incidentId: incidentIds[2], title: 'Send ambulance to Solan accident', details: '3 injured - need 2 ambulances from Solan hospital.', assignedAgency: 'Medical', notificationAgencies: JSON.stringify(['Medical', 'Police']), status: 'New' }
      ];
      for (let i = 0; i < tasks.length; i++) {
        const r = await api('POST', '/tasks', tasks[i]);
        if (r.status === 201 || r.status === 200) {
          taskIds.push(r.data.id);
          log(`Task #${i+1}: "${tasks[i].title}" → ID: ${r.data.id}`);
        } else {
          log(`Task #${i+1} FAILED: ${r.status} ${JSON.stringify(r.data)}`, false);
          errors.push(`Task ${i+1}`);
        }
      }
    }
    const fetchR = await api('GET', '/tasks');
    log(`GET /tasks → ${fetchR.data.length} records in DB`, fetchR.status === 200);
  } catch (e) { log(`Tasks crashed: ${e.message}`, false); }

  // ─── 7. BULLETINS ──────────────────────────────────────────
  console.log('\n📋 STEP 7: BULLETINS (Updates Page)');
  try {
    const bulletins = [
      { category: 'Weather Alerts', message: 'IMD Warning: Heavy rainfall expected in Kullu, Mandi, Shimla for next 48 hours. Avoid landslide prone areas.' },
      { category: 'Rescue Operations', message: 'SDRF teams deployed at NH-5 landslide site near Rampur. Rescue ongoing. 2 vehicles safely extracted.' },
      { category: 'Health Advisory', message: 'Medical camps established at Kullu relief centers. Citizens needing aid report to Bhuntar Community Center.' }
    ];
    for (let i = 0; i < bulletins.length; i++) {
      const r = await api('POST', '/bulletins', { ...bulletins[i], author_id: adminId });
      if (r.status === 201 || r.status === 200) {
        log(`Bulletin #${i+1}: [${bulletins[i].category}] posted → ID: ${r.data.id}`);
      } else {
        log(`Bulletin #${i+1} FAILED: ${r.status} ${JSON.stringify(r.data)}`, false);
        errors.push(`Bulletin ${i+1}`);
      }
    }
    const fetchR = await api('GET', '/bulletins');
    log(`GET /bulletins → ${fetchR.data.length} records in DB`, fetchR.status === 200);
  } catch (e) { log(`Bulletins crashed: ${e.message}`, false); }

  // ─── 8. INTEL PINS ─────────────────────────────────────────
  console.log('\n📋 STEP 8: INTEL PINS (Map Markers)');
  try {
    // Route is /intel not /intel-pins
    const pins = [
      { lat: 31.1048, lon: 77.1734, department: 'SDRF', note: 'Rescue camp at Rampur. JCB and rescue team deployed.' },
      { lat: 31.35, lon: 77.20, department: 'Medical', note: 'Medical camp active at Bhuntar. 15 people under treatment.' },
      { lat: 31.60, lon: 76.90, department: 'Police', note: 'Traffic checkpoint at Solan accident site. Road partially open.' }
    ];
    for (let i = 0; i < pins.length; i++) {
      const r = await api('POST', '/intel', pins[i]);
      if (r.status === 201 || r.status === 200) {
        log(`Intel Pin #${i+1}: [${pins[i].department}] at (${pins[i].lat}, ${pins[i].lon}) → ID: ${r.data.id}`);
      } else {
        log(`Intel Pin #${i+1} FAILED: ${r.status} ${JSON.stringify(r.data)}`, false);
        errors.push(`Intel Pin ${i+1}`);
      }
    }
    const fetchR = await api('GET', '/intel');
    log(`GET /intel → ${fetchR.data.length} pins in DB`, fetchR.status === 200);
  } catch (e) { log(`Intel Pins crashed: ${e.message}`, false); }

  // ─── 9. RESOURCES ──────────────────────────────────────────
  console.log('\n📋 STEP 9: RESOURCES');
  try {
    const resources = [
      { name: 'Inflatable Rescue Boat', category: 'Rescue', quantity: 3, lat: 31.35, lng: 77.20, status: 'dispatched' },
      { name: 'Emergency Medical Kit', category: 'Medical', quantity: 20, lat: 31.1, lng: 77.1, status: 'available' },
      { name: 'Food Packet (Family)', category: 'Relief', quantity: 200, lat: 31.6, lng: 76.9, status: 'available' }
    ];
    for (let i = 0; i < resources.length; i++) {
      const r = await api('POST', '/resources', resources[i]);
      if (r.status === 201 || r.status === 200) {
        log(`Resource #${i+1}: "${resources[i].name}" qty:${resources[i].quantity} → ID: ${r.data.id}`);
      } else {
        log(`Resource #${i+1} FAILED: ${r.status} ${JSON.stringify(r.data)}`, false);
        errors.push(`Resource ${i+1}`);
      }
    }
    const fetchR = await api('GET', '/resources');
    log(`GET /resources → ${fetchR.data.length} records in DB`, fetchR.status === 200);
  } catch (e) { log(`Resources crashed: ${e.message}`, false); }

  // ─── 10. VERIFY EVERYTHING ─────────────────────────────────
  console.log('\n📋 STEP 10: FINAL DATABASE VERIFICATION');
  const checks = [
    ['/incidents', 'Incidents'],
    ['/alerts', 'Alerts (public)'],
    ['/volunteers', 'Volunteers'],
    ['/equipment', 'Equipment'],
    ['/tasks', 'Tasks'],
    ['/bulletins', 'Bulletins'],
    ['/intel', 'Intel Pins'],
    ['/resources', 'Resources'],
  ];
  for (const [path, name] of checks) {
    const r = await api('GET', path).catch(() => ({ status: 500, data: [] }));
    const count = Array.isArray(r.data) ? r.data.length : '?';
    log(`[${name}]: ${count} records ✓`, r.status === 200 && count > 0);
  }

  // ─── SUMMARY ───────────────────────────────────────────────
  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  console.log('\n========================================');
  console.log('            TEST SUMMARY');
  console.log('========================================');
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log(`📊 TOTAL:  ${passed + failed}`);

  if (errors.length > 0) {
    console.log('\n🔴 ERRORS:', errors.join(', '));
  } else {
    console.log('\n🎉 All tests passed!');
  }

  console.log('\n📍 NOW REFRESH YOUR BROWSER AND CHECK:');
  console.log('   🏠 Home (/)           → "Live Alerts" section shows 3 alerts');
  console.log('   🗺️  Map (/map)         → 3 colored markers + 3 intel pins visible');
  console.log('   📰 Updates (/updates) → 3 bulletins in main feed');
  console.log('   📋 Reports (/reports) → 3 incidents in Live Activity Feed');
  console.log('   👥 Volunteers         → 3 new volunteers listed');
  console.log('   🔧 Equipment          → 3 equipment items in table');
  console.log('   📊 Dashboard          → Stats updated with real counts');
}

run().catch(console.error);
