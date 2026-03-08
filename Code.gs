/**
 * SISTEM SUKAN SEKOLAH (GAS) - PRODUCTION BACKEND
 * Repositori: msrab1979-ai/sukan-sekolah
 * PATCH v2.1 — Fix semua fungsi AdminSetup + tbl structures
 *
 * tbl_kategori     : id[0], kod[1], nama[2], jantina[3], kuota_individu[4],
 *                    kuota_kumpulan[5], kuota_terbuka[6], umin[7], umax[8],
 *                    warna[9], aktif[10]
 * tbl_acara_master : id[0], kod[1], nama[2], jenis[3], format[4],
 *                    guna_lorong[5], kategori[6], emoji[7], catatan[8], aktif[9]
 * tbl_rumah_sukan  : id[0], nama[1], warna[2], emas[3], perak[4], gangsa[5],
 *                    keempat[6], mata[7], kod[8], warna_teks[9], guru[10], pengurus[11]
 * tbl_users        : username[0], password[1], full_name[2], email[3], ?[4],
 *                    role[5], id_rumah[6], is_active[7]
 * tbl_settings     : key[0], value[1]
 */

// ═══════════════════════════════════════════════════════
// 1. ROUTING UTAMA
// ═══════════════════════════════════════════════════════
function doGet(e) {
  var page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'home';
  var template;
  try {
    if      (page === 'home')          template = HtmlService.createTemplateFromFile('Home');
    else if (page === 'login')         template = HtmlService.createTemplateFromFile('Login');
    else if (page === 'admin-setup')   template = HtmlService.createTemplateFromFile('AdminSetup');
    else if (page === 'admin-ops')     template = HtmlService.createTemplateFromFile('AdminOps');
    else if (page === 'admin-results') template = HtmlService.createTemplateFromFile('AdminResults');
    else if (page === 'pengurus')      template = HtmlService.createTemplateFromFile('Pengurus');
    else if (page === 'rumah')         template = HtmlService.createTemplateFromFile('Rumah');
    else if (page === 'pencatat')      template = HtmlService.createTemplateFromFile('Pencatat');
    else                               template = HtmlService.createTemplateFromFile('Home');

    template.roleUrl = (e && e.parameter && e.parameter.role) ? e.parameter.role : '';
    return template.evaluate()
      .setTitle('Sistem Sukan Tahunan - SK Sultan Ismail')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutput(
      '<h2 style="color:red;font-family:sans-serif;">Ralat: ' + err.message + '</h2>'
    );
  }
}

// ═══════════════════════════════════════════════════════
// 2. HELPER
// ═══════════════════════════════════════════════════════
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

function _ss() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function _sheet(name) {
  return _ss().getSheetByName(name);
}

function _uniqueId(prefix) {
  return (prefix || 'ID') + '-' + new Date().getTime();
}

// ═══════════════════════════════════════════════════════
// 3. LOGIN
// ═══════════════════════════════════════════════════════
function loginUser(payload) {
  return authenticateUser(payload.username, payload.password);
}

function handleLogin(payload) {
  if (payload && typeof payload === 'object') {
    return authenticateUser(payload.username, payload.password);
  }
  return { success: false, message: 'Format data login tidak sah.' };
}

function authenticateUser(username, password) {
  if (!username || !password) {
    return { success: false, message: 'Username dan kata laluan diperlukan.' };
  }
  var sheet = _sheet('tbl_users');
  if (!sheet) return { success: false, message: 'tbl_users tidak dijumpai!' };

  var data = sheet.getDataRange().getValues();
  // Struktur: username[0], password[1], full_name[2], email[3], ?[4], role[5], id_rumah[6], is_active[7]
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0]) continue;
    if (row[0].toString() === username.toString() &&
        row[1].toString() === password.toString()) {
      var isActive = (row[7] === true || row[7].toString().toUpperCase() === 'TRUE');
      if (!isActive) return { success: false, message: 'Akaun tidak aktif.' };
      return {
        success: true,
        user: {
          username : row[0],
          full_name: row[2],
          email    : row[3],
          role     : row[5],
          id_rumah : row[6]
        }
      };
    }
  }
  return { success: false, message: 'Username atau kata laluan salah.' };
}

// ═══════════════════════════════════════════════════════
// 4. SETTINGS — FIX: return data bukan settings
// ═══════════════════════════════════════════════════════
function getSettings() {
  var sheet = _sheet('tbl_settings');
  var data = {};
  if (sheet) {
    sheet.getDataRange().getValues().forEach(function(r) {
      if (r[0]) data[r[0]] = r[1];
    });
  }
  // Default values
  var defaults = {
    nama_sekolah: 'SK Sultan Ismail',
    nama_pertandingan: 'Sukan Tahunan 2025',
    tahun: '2025', jenis_sekolah: 'rendah',
    tarikh_sukan: '', lokasi: '', tema: '',
    lorong_trek: '6', podium: '4', nama_format: 'penuh',
    pendaftaran_buka: true, paparan_awam: true, mod_penyelenggaraan: false,
    mata_1: 5, mata_2: 3, mata_3: 2, mata_4: 1, mata_5: 0, mata_6: 0,
    med_1: 'Johan', med_2: 'Naib Johan', med_3: 'Tempat Ke-3',
    tournament_name: 'Sukan Tahunan 2025', track_lanes: '6'
  };
  Object.keys(defaults).forEach(function(k) {
    if (data[k] === undefined || data[k] === '') data[k] = defaults[k];
  });
  // Boolean conversion
  ['pendaftaran_buka','paparan_awam','mod_penyelenggaraan'].forEach(function(k) {
    if (typeof data[k] === 'string') data[k] = (data[k].toString().toUpperCase() === 'TRUE');
  });
  // Number conversion
  ['mata_1','mata_2','mata_3','mata_4','mata_5','mata_6'].forEach(function(k) {
    data[k] = parseInt(data[k]) || 0;
  });
  return { success: true, data: data };  // ← FIX: return 'data' bukan 'settings'
}

// Alias — AdminOps/AdminResults guna getSettings() dengan key 'settings'
// Kedua-dua format disokong
function getSettingsCompat() {
  var r = getSettings();
  return { success: r.success, data: r.data, settings: r.data };
}

// FIX: saveSettings alias untuk updateSettings
function saveSettings(payload) {
  return updateSettings(payload);
}

function updateSettings(payload) {
  var sheet = _sheet('tbl_settings');
  if (!sheet) {
    sheet = _ss().insertSheet('tbl_settings');
    sheet.appendRow(['key', 'value']);
  }
  var s = payload || {};
  var data = sheet.getDataRange().getValues();
  Object.keys(s).forEach(function(key) {
    var found = false;
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(s[key]);
        data[i][1] = s[key]; // update local cache
        found = true; break;
      }
    }
    if (!found) {
      sheet.appendRow([key, s[key]]);
      data.push([key, s[key]]);
    }
  });
  return { success: true, message: 'Tetapan disimpan' };
}

// ═══════════════════════════════════════════════════════
// 5. DASHBOARD STATS
// ═══════════════════════════════════════════════════════
function getDashboardStats() {
  var ss = _ss();
  function count(name) {
    var s = ss.getSheetByName(name);
    return s ? Math.max(0, s.getLastRow() - 1) : 0;
  }
  return {
    success: true,
    data: {
      murid    : count('tbl_murid'),
      acara    : count('tbl_acara_master'),
      reg      : count('tbl_pendaftaran'),
      users    : count('tbl_users'),
      rumah    : count('tbl_rumah_sukan'),
      keputusan: count('tbl_keputusan')
    }
  };
}

function getDashboardOps() {
  var ss = _ss();
  function count(name) { var s = ss.getSheetByName(name); return s ? Math.max(0, s.getLastRow()-1) : 0; }
  var rumahSheet = _sheet('tbl_rumah_sukan');
  var rumahData = rumahSheet ? rumahSheet.getDataRange().getValues() : [];
  var regSheet = _sheet('tbl_pendaftaran');
  var regData = regSheet ? regSheet.getDataRange().getValues() : [];
  var rumahCount = {};
  for (var i = 1; i < regData.length; i++) {
    var r = regData[i][5]; // kolum id_rumah dalam tbl_pendaftaran
    if (r) rumahCount[r] = (rumahCount[r] || 0) + 1;
  }
  var rumah = [];
  for (var j = 1; j < rumahData.length; j++) {
    if (!rumahData[j][0]) continue;
    rumah.push({
      id_rumah: rumahData[j][0], nama_rumah: rumahData[j][1],
      warna: rumahData[j][2] || '#3B82F6',
      count: rumahCount[rumahData[j][0]] || 0
    });
  }
  return {
    success: true,
    data: { murid: count('tbl_murid'), pendaftaran: count('tbl_pendaftaran'), acara: count('tbl_acara_jana'), lorong: count('tbl_lorong') },
    rumah: rumah
  };
}

// ═══════════════════════════════════════════════════════
// 6. RUMAH SUKAN CRUD
// tbl_rumah_sukan: id[0], nama[1], warna[2], emas[3], perak[4], gangsa[5],
//                  keempat[6], mata[7], kod[8], warna_teks[9], guru[10], pengurus[11]
// ═══════════════════════════════════════════════════════
function getRumah() {
  var sheet = _sheet('tbl_rumah_sukan');
  if (!sheet) return { success: false, message: 'tbl_rumah_sukan tiada' };
  var data = sheet.getDataRange().getValues();
  var rumah = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    rumah.push({
      id: data[i][0], id_rumah: data[i][0],
      nama: data[i][1], nama_rumah: data[i][1],
      warna: data[i][2] || '#EF4444',
      emas: parseInt(data[i][3]) || 0,
      perak: parseInt(data[i][4]) || 0,
      gangsa: parseInt(data[i][5]) || 0,
      keempat: parseInt(data[i][6]) || 0,
      mata: parseInt(data[i][7]) || 0,
      kod: data[i][8] || data[i][0],
      warna_teks: data[i][9] || '#ffffff',
      guru: data[i][10] || '',
      pengurus: data[i][11] || '',
      aktif: true
    });
  }
  return { success: true, data: rumah, rumah: rumah };
}

function createRumah(payload) {
  var sheet = _sheet('tbl_rumah_sukan');
  if (!sheet) {
    sheet = _ss().insertSheet('tbl_rumah_sukan');
    sheet.appendRow(['id','nama','warna','emas','perak','gangsa','keempat','mata','kod','warna_teks','guru','pengurus']);
  }
  var id = payload.id || _uniqueId('RMH');
  sheet.appendRow([id, payload.nama, payload.warna||'#EF4444', 0, 0, 0, 0, 0,
    payload.kod||id, payload.warna_teks||'#ffffff', payload.guru||'', payload.pengurus||'']);
  return { success: true, message: 'Rumah ditambah', data: { id: id } };
}

function updateRumah(payload) {
  var sheet = _sheet('tbl_rumah_sukan');
  if (!sheet) return { success: false, message: 'tbl_rumah_sukan tiada' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === payload.id.toString()) {
      sheet.getRange(i+1, 2, 1, 10).setValues([[
        payload.nama, payload.warna||data[i][2],
        data[i][3], data[i][4], data[i][5], data[i][6], data[i][7],
        payload.kod||data[i][8], payload.warna_teks||data[i][9],
        payload.guru||'', payload.pengurus||''
      ]]);
      return { success: true, message: 'Rumah dikemaskini' };
    }
  }
  return { success: false, message: 'Rumah tidak dijumpai' };
}

function deleteRumah(payload) {
  var sheet = _sheet('tbl_rumah_sukan');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === payload.id.toString()) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Rumah tidak dijumpai' };
}

// ═══════════════════════════════════════════════════════
// 7. KATEGORI CRUD
// tbl_kategori: id[0], kod[1], nama[2], jantina[3], kuota_individu[4],
//               kuota_kumpulan[5], kuota_terbuka[6], umin[7], umax[8],
//               warna[9], aktif[10]
// NOTE: kuota dibahagi kepada 3 jenis — individu, kumpulan, terbuka
// ═══════════════════════════════════════════════════════
function getKategori() {
  var sheet = _sheet('tbl_kategori');
  if (!sheet) return { success: false, message: 'tbl_kategori tiada' };
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    list.push({
      id: data[i][0], id_kategori: data[i][0],
      kod: data[i][1],
      nama: data[i][2], nama_kategori: data[i][2],
      jantina: data[i][3],
      kuota: parseInt(data[i][4]) || 3,           // backward compat
      kuota_individu: parseInt(data[i][4]) || 3,
      kuota_kumpulan: parseInt(data[i][5]) || 1,
      kuota_terbuka: parseInt(data[i][6]) || 0,
      umin: parseInt(data[i][7]) || 7,
      umax: parseInt(data[i][8]) || 12,
      warna: data[i][9] || '#4F8EF7',
      aktif: data[i][10] !== false && data[i][10].toString().toUpperCase() !== 'FALSE'
    });
  }
  return { success: true, data: list, kategori: list };
}

function createKategori(payload) {
  var sheet = _sheet('tbl_kategori');
  if (!sheet) {
    sheet = _ss().insertSheet('tbl_kategori');
    sheet.appendRow(['id','kod','nama','jantina','kuota_individu','kuota_kumpulan','kuota_terbuka','umin','umax','warna','aktif']);
  }
  var id = payload.id || _uniqueId('KAT');
  sheet.appendRow([
    id, payload.kod||id, payload.nama, payload.jantina||'L',
    parseInt(payload.kuota_individu||payload.kuota) || 3,
    parseInt(payload.kuota_kumpulan) || 1,
    parseInt(payload.kuota_terbuka) || 0,
    parseInt(payload.umin) || 7,
    parseInt(payload.umax) || 12,
    payload.warna || '#4F8EF7', true
  ]);
  return { success: true, message: 'Kategori ditambah', data: { id: id } };
}

function updateKategori(payload) {
  var sheet = _sheet('tbl_kategori');
  if (!sheet) return { success: false, message: 'tbl_kategori tiada' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === payload.id.toString()) {
      sheet.getRange(i+1, 2, 1, 10).setValues([[
        payload.kod||data[i][1], payload.nama||data[i][2],
        payload.jantina||data[i][3],
        parseInt(payload.kuota_individu||payload.kuota) || parseInt(data[i][4]) || 3,
        parseInt(payload.kuota_kumpulan) || parseInt(data[i][5]) || 1,
        parseInt(payload.kuota_terbuka) || parseInt(data[i][6]) || 0,
        parseInt(payload.umin) || data[i][7],
        parseInt(payload.umax) || data[i][8],
        payload.warna||data[i][9],
        data[i][10]
      ]]);
      return { success: true, message: 'Kategori dikemaskini' };
    }
  }
  return { success: false, message: 'Kategori tidak dijumpai' };
}

function deleteKategori(payload) {
  var sheet = _sheet('tbl_kategori');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === payload.id.toString()) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Kategori tidak dijumpai' };
}

// ═══════════════════════════════════════════════════════
// 8. ACARA MASTER CRUD (AdminSetup — bukan tbl_acara_jana)
// tbl_acara_master: id[0], kod[1], nama[2], jenis[3], format[4],
//                   guna_lorong[5], kategori[6=JSON], emoji[7], catatan[8], aktif[9]
// ═══════════════════════════════════════════════════════
function getAcara() {
  var sheet = _sheet('tbl_acara_master');
  if (!sheet) return { success: true, data: [] };
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    var katArr = [];
    try { katArr = JSON.parse(data[i][6] || '[]'); } catch(e) {
      katArr = data[i][6] ? data[i][6].toString().split(',') : [];
    }
    list.push({
      id: data[i][0],
      kod: data[i][1],
      nama: data[i][2],
      jenis: data[i][3] || 'track',
      format: data[i][4] || 'final',
      lorong: data[i][5] === true || data[i][5] === 'TRUE',
      kategori: katArr,
      emoji: data[i][7] || '🏃',
      catatan: data[i][8] || '',
      aktif: data[i][9] !== false && data[i][9].toString().toUpperCase() !== 'FALSE'
    });
  }
  return { success: true, data: list };
}

function createAcara(payload) {
  var sheet = _sheet('tbl_acara_master');
  if (!sheet) {
    sheet = _ss().insertSheet('tbl_acara_master');
    sheet.appendRow(['id','kod','nama','jenis','format','guna_lorong','kategori','emoji','catatan','aktif']);
  }
  var id = payload.id || _uniqueId('ACR');
  var katJson = JSON.stringify(Array.isArray(payload.kategori) ? payload.kategori : []);
  sheet.appendRow([
    id, payload.kod||id, payload.nama,
    payload.jenis||'track', payload.format||'final',
    payload.lorong === true || payload.lorong === 'true',
    katJson, payload.emoji||'🏃', payload.catatan||'', true
  ]);
  return { success: true, message: 'Acara ditambah', data: { id: id } };
}

function updateAcara(payload) {
  var sheet = _sheet('tbl_acara_master');
  if (!sheet) return { success: false, message: 'tbl_acara_master tiada' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === payload.id.toString()) {
      var katJson = JSON.stringify(Array.isArray(payload.kategori) ? payload.kategori : []);
      sheet.getRange(i+1, 2, 1, 9).setValues([[
        payload.kod||data[i][1], payload.nama||data[i][2],
        payload.jenis||data[i][3], payload.format||data[i][4],
        payload.lorong === true || payload.lorong === 'true',
        katJson, payload.emoji||data[i][7], payload.catatan||data[i][8],
        data[i][9]
      ]]);
      return { success: true, message: 'Acara dikemaskini' };
    }
  }
  return { success: false, message: 'Acara tidak dijumpai' };
}

function deleteAcara(payload) {
  var sheet = _sheet('tbl_acara_master');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === payload.id.toString()) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Acara tidak dijumpai' };
}

// ═══════════════════════════════════════════════════════
// 9. USERS CRUD
// tbl_users: username[0], password[1], full_name[2], email[3], ?[4],
//            role[5], id_rumah[6], is_active[7]
// ═══════════════════════════════════════════════════════
function getUsers() {
  var sheet = _sheet('tbl_users');
  if (!sheet) return { success: false, message: 'tbl_users tiada' };
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    list.push({
      id: data[i][0],       // username as id
      username: data[i][0],
      password: '',          // never expose
      full_name: data[i][2],
      email: data[i][3] || '',
      role: data[i][5] || '',
      id_rumah: data[i][6] || '',
      is_active: data[i][7] === true || data[i][7].toString().toUpperCase() === 'TRUE',
      last_login: null
    });
  }
  return { success: true, data: list };
}

function createUser(payload) {
  var sheet = _sheet('tbl_users');
  if (!sheet) return { success: false, message: 'tbl_users tiada' };
  // Check duplicate username
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === payload.username.toString()) {
      return { success: false, message: 'Username sudah wujud!' };
    }
  }
  if (!payload.password) return { success: false, message: 'Kata laluan diperlukan untuk pengguna baru' };
  sheet.appendRow([
    payload.username, payload.password, payload.full_name,
    payload.email||'', '', payload.role||'Pencatat',
    payload.id_rumah||'', true
  ]);
  return { success: true, message: 'Pengguna ditambah' };
}

function updateUser(payload) {
  var sheet = _sheet('tbl_users');
  if (!sheet) return { success: false, message: 'tbl_users tiada' };
  var data = sheet.getDataRange().getValues();
  // Find by username (used as id)
  var targetId = payload.id || payload.username;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === targetId.toString()) {
      // Only update provided fields
      if (payload.full_name !== undefined) sheet.getRange(i+1, 3).setValue(payload.full_name);
      if (payload.email !== undefined)     sheet.getRange(i+1, 4).setValue(payload.email);
      if (payload.role !== undefined)      sheet.getRange(i+1, 6).setValue(payload.role);
      if (payload.id_rumah !== undefined)  sheet.getRange(i+1, 7).setValue(payload.id_rumah);
      if (payload.is_active !== undefined) sheet.getRange(i+1, 8).setValue(payload.is_active);
      if (payload.password)                sheet.getRange(i+1, 2).setValue(payload.password);
      return { success: true, message: 'Pengguna dikemaskini' };
    }
  }
  return { success: false, message: 'Pengguna tidak dijumpai' };
}

function deleteUser(payload) {
  var sheet = _sheet('tbl_users');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  var targetId = payload.id || payload.username;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === targetId.toString()) {
      // Protect last admin
      if (data[i][5] === 'Admin') {
        var adminCount = data.filter(function(r,idx){ return idx>0 && r[5]==='Admin' && (r[7]===true||r[7].toString().toUpperCase()==='TRUE'); }).length;
        if (adminCount <= 1) return { success: false, message: 'Tidak boleh padam admin terakhir!' };
      }
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Pengguna tidak dijumpai' };
}

// ═══════════════════════════════════════════════════════
// 10. MURID CRUD
// tbl_murid: id[0], no_kp[1], nama[2], id_rumah[3], id_kategori[4],
//            jantina[5], tarikh_lahir[6], kelas[7], no_dada[8]
// ═══════════════════════════════════════════════════════
function getMurid(payload) {
  var sheet = _sheet('tbl_murid');
  if (!sheet) return { success: true, murid: [], total: 0 };
  var data = sheet.getDataRange().getValues();
  var murid = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    murid.push({
      id_murid: data[i][0], no_kp: data[i][1], nama: data[i][2],
      id_rumah: data[i][3], id_kategori: data[i][4],
      jantina: data[i][5], tarikh_lahir: data[i][6],
      kelas: data[i][7], no_dada: data[i][8]
    });
  }
  return { success: true, murid: murid, total: murid.length };
}

function saveMurid(payload) {
  var sheet = _sheet('tbl_murid');
  if (!sheet) return { success: false, message: 'tbl_murid tiada' };
  var id = _uniqueId('MRD');
  sheet.appendRow([id, payload.no_kp, payload.nama, payload.id_rumah,
    payload.id_kategori, payload.jantina, payload.tarikh_lahir||'',
    payload.kelas||'', payload.no_dada||'', new Date()]);
  return { success: true, message: 'Murid berjaya disimpan' };
}

function updateMurid(payload) {
  var sheet = _sheet('tbl_murid');
  if (!sheet) return { success: false, message: 'tbl_murid tiada' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == payload.id_murid || data[i][1] == payload.no_kp) {
      sheet.getRange(i+1, 3, 1, 7).setValues([[
        payload.nama, payload.id_rumah, payload.id_kategori,
        payload.jantina, payload.tarikh_lahir||'', payload.kelas||'', payload.no_dada||''
      ]]);
      return { success: true, message: 'Murid dikemaskini' };
    }
  }
  return { success: false, message: 'Murid tidak dijumpai' };
}

function deleteMurid(payload) {
  var sheet = _sheet('tbl_murid');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == payload.id_murid || data[i][1] == payload.id_murid) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Murid dipadam' };
    }
  }
  return { success: false, message: 'Murid tidak dijumpai' };
}

// ═══════════════════════════════════════════════════════
// 11. PENDAFTARAN CRUD
// tbl_pendaftaran: id[0], id_acara[1], no_acara[2], nama_acara[3],
//                  no_kp[4], id_rumah[5], id_kategori[6], nama_murid[7], status[8]
// ═══════════════════════════════════════════════════════
function getPendaftaran(payload) {
  var sheet = _sheet('tbl_pendaftaran');
  if (!sheet) return { success: true, pendaftaran: [], total: 0 };
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    list.push({
      id_reg: data[i][0], id_acara: data[i][1], no_acara: data[i][2],
      nama_acara: data[i][3], no_kp: data[i][4], id_rumah: data[i][5],
      id_kategori: data[i][6], nama_murid: data[i][7], status: data[i][8]||'AKTIF'
    });
  }
  return { success: true, pendaftaran: list, total: list.length };
}

function savePendaftaran(payload) {
  var sheet = _sheet('tbl_pendaftaran');
  if (!sheet) return { success: false, message: 'tbl_pendaftaran tiada' };
  // Lookup murid info
  var nama = payload.no_kp, idRumah = payload.id_rumah||'', idKat = payload.id_kategori||'';
  var muridSheet = _sheet('tbl_murid');
  if (muridSheet) {
    var mData = muridSheet.getDataRange().getValues();
    for (var i = 1; i < mData.length; i++) {
      if (mData[i][1] == payload.no_kp) {
        nama = mData[i][2]; idRumah = idRumah||mData[i][3]; idKat = idKat||mData[i][4]; break;
      }
    }
  }
  // Lookup acara info
  var noAcara = payload.id_acara, namaAcara = '';
  var acaraSheet = _sheet('tbl_acara_jana');
  if (acaraSheet) {
    var aData = acaraSheet.getDataRange().getValues();
    for (var j = 1; j < aData.length; j++) {
      if (aData[j][0] == payload.id_acara || aData[j][1] == payload.id_acara) {
        noAcara = aData[j][1]; namaAcara = aData[j][2]; break;
      }
    }
  }
  var id = _uniqueId('REG');
  sheet.appendRow([id, payload.id_acara, noAcara, namaAcara,
    payload.no_kp, idRumah, idKat, nama, 'AKTIF', new Date()]);
  return { success: true, message: 'Pendaftaran berjaya' };
}

function deletePendaftaran(payload) {
  var sheet = _sheet('tbl_pendaftaran');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == payload.id_reg) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Rekod tidak dijumpai' };
}

// ═══════════════════════════════════════════════════════
// 12. ACARA JANA (tbl_acara_jana — dijana dari tbl_acara_master)
// tbl_acara_jana: id[0], no_acara[1], nama_acara[2], id_kategori[3],
//                 jenis[4], format[5], guna_lorong[6]
// ═══════════════════════════════════════════════════════
function getAcaraJana(payload) {
  var sheet = _sheet('tbl_acara_jana');
  if (!sheet) return { success: true, acara: [], total: 0 };
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    list.push({
      id_acara: data[i][0], no_acara: data[i][1], nama_acara: data[i][2],
      id_kategori: data[i][3], kategori: data[i][3],
      jenis: data[i][4]||'TRACK', format: data[i][5]||'FINAL',
      guna_lorong: data[i][6] === true || data[i][6] === 'TRUE'
    });
  }
  return { success: true, acara: list, total: list.length };
}

// ═══════════════════════════════════════════════════════
// 13. UNDIAN LORONG
// ═══════════════════════════════════════════════════════
function simpanLorong(payload) {
  var sheet = _sheet('tbl_lorong');
  if (!sheet) {
    sheet = _ss().insertSheet('tbl_lorong');
    sheet.appendRow(['id_lorong','id_acara','heat','lorong','no_kp','id_rumah','tarikh']);
  }
  var data = sheet.getDataRange().getValues();
  for (var i = data.length; i >= 2; i--) {
    if (data[i-1][1] == payload.id_acara && data[i-1][2] == payload.heat) sheet.deleteRow(i);
  }
  payload.susunan.forEach(function(s) {
    sheet.appendRow([_uniqueId('LRG')+'-'+s.lorong,
      payload.id_acara, payload.heat, s.lorong, s.no_kp, s.id_rumah, new Date()]);
  });
  return { success: true, message: 'Lorong disimpan' };
}

// ═══════════════════════════════════════════════════════
// 14. MEDAL TALLY & KEPUTUSAN
// ═══════════════════════════════════════════════════════
function getMedalTally() {
  var sheet = _sheet('tbl_rumah_sukan');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  var rumah = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    rumah.push({
      id: data[i][0], nama: data[i][1], warna: data[i][2]||'#3B82F6',
      emas: parseInt(data[i][3])||0, perak: parseInt(data[i][4])||0,
      gangsa: parseInt(data[i][5])||0, keempat: parseInt(data[i][6])||0,
      mata: parseInt(data[i][7])||0
    });
  }
  rumah.sort(function(a,b){
    if (b.emas!==a.emas) return b.emas-a.emas;
    if (b.perak!==a.perak) return b.perak-a.perak;
    return b.mata-a.mata;
  });
  return { success: true, data: rumah };
}

function getPublishedResults() {
  var sheet = _sheet('tbl_keputusan');
  if (!sheet) return { success: true, data: [] };
  var data = sheet.getDataRange().getValues();
  var results = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    var published = (data[i][12] === true || data[i][12].toString() === 'TRUE');
    if (!published) continue;
    results.push({
      acara: data[i][1], kod: data[i][0], kategori: data[i][2], jenis: data[i][3]||'track',
      keputusan: [
        { rank:1, nama:data[i][4],  rumah:data[i][5],  masa:data[i][6]  },
        { rank:2, nama:data[i][7],  rumah:data[i][8],  masa:data[i][9]  },
        { rank:3, nama:data[i][10], rumah:data[i][11], masa:data[i][12] }
      ].filter(function(k){ return k.nama; })
    });
  }
  return { success: true, data: results };
}

function saveResultAndTally(payload) {
  var ss = _ss();
  var sheetRumah = _sheet('tbl_rumah_sukan');
  if (!sheetRumah) return { success: false, message: 'tbl_rumah_sukan tiada!' };
  var m = {1:5,2:3,3:2,4:1};
  var sRes = getSettings();
  if (sRes.success) {
    var d = sRes.data;
    m[1]=parseInt(d.mata_1)||5; m[2]=parseInt(d.mata_2)||3;
    m[3]=parseInt(d.mata_3)||2; m[4]=parseInt(d.mata_4)||1;
  }
  var pm = {};
  if (payload.johan)      pm[payload.johan]      = (pm[payload.johan]||0)      + m[1];
  if (payload.naib_johan) pm[payload.naib_johan] = (pm[payload.naib_johan]||0) + m[2];
  if (payload.ketiga)     pm[payload.ketiga]     = (pm[payload.ketiga]||0)     + m[3];
  if (payload.keempat)    pm[payload.keempat]    = (pm[payload.keempat]||0)    + m[4];
  var dataRumah = sheetRumah.getDataRange().getValues();
  for (var i = 1; i < dataRumah.length; i++) {
    var id = dataRumah[i][0].toString();
    if (pm[id]) {
      var cur = parseFloat(dataRumah[i][7])||0;
      sheetRumah.getRange(i+1,8).setValue(cur+pm[id]);
    }
  }
  var sheetKep = _sheet('tbl_keputusan');
  if (sheetKep) {
    sheetKep.appendRow([
      _uniqueId('KEP'), payload.acara, 1,
      payload.johan,'Emas', payload.naib_johan,'Perak',
      payload.ketiga,'Gangsa', payload.keempat,'Keempat',
      true, true, false, 'Pencatat', new Date(), 'Pencatat', new Date(), 'Pencatat'
    ]);
  }
  return { success: true, message: 'Mata berjaya direkodkan.' };
}

// ═══════════════════════════════════════════════════════
// 15. DEBUG / TEST (boleh hapus selepas stable)
// ═══════════════════════════════════════════════════════
function testLogin() {
  Logger.log(JSON.stringify(loginUser({username:'admin',password:'admin123'})));
}

function debugAdminSetup() {
  try {
    var t = HtmlService.createTemplateFromFile('AdminSetup');
    var html = t.evaluate().getContent();
    Logger.log('OK Length: ' + html.length);
  } catch(e) {
    Logger.log('ERROR: ' + e.message);
  }
}

function debugServe() {
  var e = {parameter:{page:'admin-setup'}};
  var result = doGet(e);
  Logger.log(result.getContent().substring(0,200));
}

function testAllFunctions() {
  Logger.log('getSettings: ' + JSON.stringify(getSettings()).substring(0,100));
  Logger.log('getRumah: ' + JSON.stringify(getRumah()).substring(0,100));
  Logger.log('getKategori: ' + JSON.stringify(getKategori()).substring(0,100));
  Logger.log('getAcara: ' + JSON.stringify(getAcara()).substring(0,100));
  Logger.log('getUsers: ' + JSON.stringify(getUsers()).substring(0,100));
  Logger.log('getDashboardStats: ' + JSON.stringify(getDashboardStats()).substring(0,100));
}

function setupInitialData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── tbl_kategori ──────────────────────────────────────
  if (!ss.getSheetByName('tbl_kategori')) {
    var kat = ss.insertSheet('tbl_kategori');
    kat.appendRow(['id','kod','nama','jantina','kuota_individu','kuota_kumpulan','kuota_terbuka','umin','umax','warna','aktif']);
    kat.appendRow(['K1','L1','Lelaki Bawah 12','L',3,1,0,7,11,'#4F8EF7',true]);
    kat.appendRow(['K2','L2','Lelaki Bawah 15','L',3,1,0,12,14,'#10B981',true]);
    kat.appendRow(['K3','P1','Perempuan Bawah 12','P',3,1,0,7,11,'#EC4899',true]);
    kat.appendRow(['K4','P2','Perempuan Bawah 15','P',3,1,0,12,14,'#8B5CF6',true]);
    Logger.log('tbl_kategori: CREATED');
  } else {
    Logger.log('tbl_kategori: sudah ada');
  }

  // ── tbl_rumah_sukan ───────────────────────────────────
  var rumahSheet = ss.getSheetByName('tbl_rumah_sukan');
  if (!rumahSheet) {
    rumahSheet = ss.insertSheet('tbl_rumah_sukan');
    rumahSheet.appendRow(['id','nama','warna','emas','perak','gangsa','keempat','mata','kod','warna_teks','guru','pengurus']);
    Logger.log('tbl_rumah_sukan: CREATED (kosong)');
  }
  // Tambah 4 rumah default jika tiada data
  if (rumahSheet.getLastRow() <= 1) {
    rumahSheet.appendRow(['RMH-MERAH', 'MERAH',  '#EF4444', 0,0,0,0,0, 'MERAH',  '#ffffff','','']);
    rumahSheet.appendRow(['RMH-BIRU',  'BIRU',   '#3B82F6', 0,0,0,0,0, 'BIRU',   '#ffffff','','']);
    rumahSheet.appendRow(['RMH-HIJAU', 'HIJAU',  '#10B981', 0,0,0,0,0, 'HIJAU',  '#ffffff','','']);
    rumahSheet.appendRow(['RMH-KUNING','KUNING', '#EAB308', 0,0,0,0,0, 'KUNING', '#000000','','']);
    Logger.log('tbl_rumah_sukan: 4 rumah ditambah');
  } else {
    Logger.log('tbl_rumah_sukan: sudah ada data');
  }

  // ── tbl_acara_master ──────────────────────────────────
  if (!ss.getSheetByName('tbl_acara_master')) {
    var acara = ss.insertSheet('tbl_acara_master');
    acara.appendRow(['id','kod','nama','jenis','format','guna_lorong','kategori','emoji','catatan','aktif']);
    Logger.log('tbl_acara_master: CREATED (kosong — tambah acara dari AdminSetup)');
  } else {
    Logger.log('tbl_acara_master: sudah ada');
  }

  // ── tbl_settings defaults ─────────────────────────────
  var s = ss.getSheetByName('tbl_settings');
  if (s) {
    var existing = {};
    s.getDataRange().getValues().forEach(function(r){ if(r[0]) existing[r[0]]=true; });
    var defaults = [
      ['mata_1',5],['mata_2',3],['mata_3',2],['mata_4',1],
      ['lorong_trek',6],['podium',4]
    ];
    defaults.forEach(function(d){
      if(!existing[d[0]]) s.appendRow(d);
    });
    Logger.log('tbl_settings: defaults checked');
  }

  Logger.log('setupInitialData: SELESAI');
}