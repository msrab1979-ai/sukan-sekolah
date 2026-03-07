/**
 * SISTEM SUKAN SEKOLAH (GAS) - PRODUCTION BACKEND
 * Repositori: msrab1979-ai/sukan-sekolah
 * Fix: Routing pages, handleLogin wrapper, authenticateUser
 */

// ═══════════════════════════════════════════════════════
// 1. ROUTING UTAMA
// ═══════════════════════════════════════════════════════
function doGet(e) {
  var page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'home';
  var template;

  try {
    // ✅ FIX: Routing lengkap semua pages
    if      (page === 'home')         template = HtmlService.createTemplateFromFile('Home');
    else if (page === 'login')        template = HtmlService.createTemplateFromFile('Login');
    else if (page === 'admin-setup')  template = HtmlService.createTemplateFromFile('AdminSetup');
    else if (page === 'admin-ops')    template = HtmlService.createTemplateFromFile('AdminOps');
    else if (page === 'admin-results')template = HtmlService.createTemplateFromFile('AdminResults');
    else if (page === 'pengurus')     template = HtmlService.createTemplateFromFile('Pengurus');
    else if (page === 'rumah')        template = HtmlService.createTemplateFromFile('Rumah');
    else if (page === 'pencatat')     template = HtmlService.createTemplateFromFile('Pencatat');
    else                              template = HtmlService.createTemplateFromFile('Home');

    template.roleUrl = (e && e.parameter && e.parameter.role) ? e.parameter.role : '';

    return template.evaluate()
      .setTitle('Sistem Sukan Tahunan - SK Sultan Ismail')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

  } catch (err) {
    return HtmlService.createHtmlOutput(
      '<h2 style="color:red;font-family:sans-serif;">Ralat memuatkan halaman: ' + err.message + '</h2>'
    );
  }
}

// ═══════════════════════════════════════════════════════
// 2. DAPATKAN URL SCRIPT (untuk navigasi dari iframe)
// ═══════════════════════════════════════════════════════
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

// ═══════════════════════════════════════════════════════
// 3. FUNGSI LOGIN
// ═══════════════════════════════════════════════════════

/**
 * handleLogin — dipanggil terus dari Login.html
 * WRAPPER kepada authenticateUser untuk compatibility lama
 * @param {Object} payload - { username, password }
 */
function handleLogin(payload) {
  // Sokong dua format panggilan:
  // 1. handleLogin({ username, password })  ← dari Login.html
  // 2. authenticateUser(username, password) ← panggilan terus
  if (payload && typeof payload === 'object') {
    return authenticateUser(payload.username, payload.password);
  }
  return { success: false, message: 'Format data login tidak sah.' };
}

/**
 * authenticateUser — semak kelayakan di tbl_users
 * @param {string} username
 * @param {string} password
 */
function authenticateUser(username, password) {
  if (!username || !password) {
    return { success: false, message: 'Nama pengguna dan kata laluan diperlukan.' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('tbl_users');

  if (!sheet) {
    return { success: false, message: 'Jadual tbl_users tidak dijumpai! Sila hubungi admin.' };
  }

  const data = sheet.getDataRange().getValues();
  // Struktur: username[0], password[1], full_name[2], email[3], role[4], id_rumah[5], is_active[6]

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0].toString() === username.toString() &&
        row[1].toString() === password.toString()) {

      // Semak status aktif
      var isActive = (row[7] === true || row[7].toString().toUpperCase() === 'TRUE');
      if (!isActive) {
        return { success: false, message: 'Akaun ini tidak aktif. Sila hubungi admin.' };
      }

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

  return { success: false, message: 'Nama Pengguna atau Kata Laluan tidak sah.' };
}

// ═══════════════════════════════════════════════════════
// 4. API ACARA
// ═══════════════════════════════════════════════════════
function getAcaraDetails(kodAcara) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_acara_master');
  if (!sheet) return { success: false, message: 'Jadual tbl_acara_master tiada!' };

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1].toString().toUpperCase() === kodAcara.toString().toUpperCase()) {
      return {
        success: true,
        data: {
          kod_acara     : data[i][1],
          nama_acara    : data[i][2],
          event_type    : data[i][4],
          requires_lanes: data[i][5],
          format        : data[i][7]
        }
      };
    }
  }
  return { success: false, message: 'Kod Acara tidak dijumpai.' };
}

// ═══════════════════════════════════════════════════════
// 5. API PESERTA
// ═══════════════════════════════════════════════════════
function getPesertaAcara(kodAcara) {
  // TODO: Query tbl_pendaftaran berdasarkan kodAcara
  // Buat masa ini return data simulasi
  return [
    { id: 'R1', nama: 'Rumah Merah - Ali bin Abu' },
    { id: 'R2', nama: 'Rumah Biru - Chong Wei' },
    { id: 'R3', nama: 'Rumah Kuning - Muthusamy' },
    { id: 'R4', nama: 'Rumah Hijau - Danial' }
  ];
}

// ═══════════════════════════════════════════════════════
// 6. SIMPAN KEPUTUSAN & KIRA MATA
// ═══════════════════════════════════════════════════════
function saveResultAndTally(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetRumah = ss.getSheetByName('tbl_rumah_sukan');
  if (!sheetRumah) return { success: false, message: 'Jadual tbl_rumah_sukan tiada!' };

  // Baca mata dinamik dari tbl_settings
  var m = {1:5, 2:3, 3:2, 4:1};
  var settingsSheet = ss.getSheetByName('tbl_settings');
  if (settingsSheet) {
    settingsSheet.getDataRange().getValues().forEach(function(r) {
      if (r[0]==='mata_1') m[1]=parseInt(r[1])||5;
      if (r[0]==='mata_2') m[2]=parseInt(r[1])||3;
      if (r[0]==='mata_3') m[3]=parseInt(r[1])||2;
      if (r[0]==='mata_4') m[4]=parseInt(r[1])||1;
    });
  }
  var pointsMap = {};
  if (payload.johan)      pointsMap[payload.johan]      = (pointsMap[payload.johan]||0)      + m[1];
  if (payload.naib_johan) pointsMap[payload.naib_johan] = (pointsMap[payload.naib_johan]||0) + m[2];
  if (payload.ketiga)     pointsMap[payload.ketiga]     = (pointsMap[payload.ketiga]||0)     + m[3];
  if (payload.keempat)    pointsMap[payload.keempat]    = (pointsMap[payload.keempat]||0)    + m[4];
  // Kemaskini tbl_rumah_sukan
  var dataRumah = sheetRumah.getDataRange().getValues();
  for (var i = 1; i < dataRumah.length; i++) {
    var idRumah = dataRumah[i][0].toString();
    if (pointsMap[idRumah]) {
      var currentMata = parseFloat(dataRumah[i][7]) || 0; // Kolum 7 = jumlah_mata
      sheetRumah.getRange(i + 1, 8).setValue(currentMata + pointsMap[idRumah]);
    }
  }

  // Simpan ke tbl_keputusan
  var sheetKeputusan = ss.getSheetByName('tbl_keputusan');
  if (sheetKeputusan) {
    sheetKeputusan.appendRow([
      'KEP-' + new Date().getTime(),
      payload.acara, 1,
      payload.johan,      'Emas',
      payload.naib_johan, 'Perak',
      payload.ketiga,     'Gangsa',
      payload.keempat,    'Keempat',
      true, true, false,
      'Masuk melalui Pencatat',
      new Date(), 'Pencatat', new Date(), 'Pencatat'
    ]);
  }

  return { success: true, message: 'Mata berjaya direkodkan.' };
}

// ═══════════════════════════════════════════════════════
// 7. STATISTIK ADMIN
// ═══════════════════════════════════════════════════════
function getAdminStats() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  function count(name) {
    var s = ss.getSheetByName(name);
    return s ? Math.max(0, s.getLastRow()-1) : 0;
  }
  return {
    users    : count('tbl_users'),
    acara    : count('tbl_acara_master'),
    murid    : count('tbl_murid'),
    reg      : count('tbl_pendaftaran'),
    rumah    : count('tbl_rumah_sukan'),
    keputusan: count('tbl_keputusan')
  };
}

function getDashboardStats() {
  return { success: true, data: getAdminStats() };
}

// ═══════════════════════════════════════════════════════
// API UNTUK ADMINOPS
// ═══════════════════════════════════════════════════════
function getRumah() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_rumah_sukan');
  if (!sheet) return { success: false, message: 'tbl_rumah_sukan tiada' };
  var data = sheet.getDataRange().getValues();
  var rumah = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    rumah.push({
      id_rumah: data[i][0], nama_rumah: data[i][1],
      warna: data[i][2] || '#3B82F6'
    });
  }
  return { success: true, rumah: rumah };
}

function getKategori() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_kategori');
  if (!sheet) return { success: false, message: 'tbl_kategori tiada' };
  var data = sheet.getDataRange().getValues();
  var kategori = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    kategori.push({
      id_kategori: data[i][0], nama_kategori: data[i][1]
    });
  }
  return { success: true, kategori: kategori };
}

function getSettings() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_settings');
  var settings = { tournament_name: 'Sukan Tahunan 2025', track_lanes: '8' };
  if (sheet) {
    var data = sheet.getDataRange().getValues();
    data.forEach(function(r) { if (r[0]) settings[r[0]] = r[1]; });
  }
  return { success: true, settings: settings };
}

function updateSettings(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_settings');
  if (!sheet) return { success: false, message: 'tbl_settings tiada' };
  var s = payload.settings || payload;
  var data = sheet.getDataRange().getValues();
  Object.keys(s).forEach(function(key) {
    var found = false;
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === key) {
        sheet.getRange(i+1, 2).setValue(s[key]);
        found = true; break;
      }
    }
    if (!found) sheet.appendRow([key, s[key]]);
  });
  return { success: true, message: 'Tetapan disimpan' };
}

function getDashboardOps() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  function count(name) {
    var s = ss.getSheetByName(name);
    return s ? Math.max(0, s.getLastRow()-1) : 0;
  }
  var rumahSheet = ss.getSheetByName('tbl_rumah_sukan');
  var rumahData = rumahSheet ? rumahSheet.getDataRange().getValues() : [];
  var regSheet = ss.getSheetByName('tbl_pendaftaran');
  var regData = regSheet ? regSheet.getDataRange().getValues() : [];
  
  var rumahCount = {};
  for (var i = 1; i < regData.length; i++) {
    var r = regData[i][4]; // kolum id_rumah
    rumahCount[r] = (rumahCount[r]||0) + 1;
  }
  
  var rumah = [];
  for (var j = 1; j < rumahData.length; j++) {
    if (!rumahData[j][0]) continue;
    rumah.push({
      id_rumah: rumahData[j][0], nama_rumah: rumahData[j][1],
      warna: rumahData[j][2]||'#3B82F6',
      count: rumahCount[rumahData[j][0]]||0
    });
  }
  
  return {
    success: true,
    data: {
      murid: count('tbl_murid'),
      pendaftaran: count('tbl_pendaftaran'),
      acara: count('tbl_acara_jana'),
      lorong: count('tbl_lorong')
    },
    rumah: rumah
  };
}

function getMurid(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_murid');
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_murid');
  if (!sheet) return { success: false, message: 'tbl_murid tiada' };
  var id = 'MRD-' + new Date().getTime();
  sheet.appendRow([id, payload.no_kp, payload.nama, payload.id_rumah,
    payload.id_kategori, payload.jantina, payload.tarikh_lahir,
    payload.kelas, payload.no_dada, new Date()]);
  return { success: true, message: 'Murid berjaya disimpan' };
}

function updateMurid(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_murid');
  if (!sheet) return { success: false, message: 'tbl_murid tiada' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == payload.id_murid || data[i][1] == payload.no_kp) {
      sheet.getRange(i+1, 3, 1, 7).setValues([[
        payload.nama, payload.id_rumah, payload.id_kategori,
        payload.jantina, payload.tarikh_lahir, payload.kelas, payload.no_dada
      ]]);
      return { success: true, message: 'Murid dikemaskini' };
    }
  }
  return { success: false, message: 'Murid tidak dijumpai' };
}

function deleteMurid(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_murid');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == payload.id_murid || data[i][1] == payload.id_murid) {
      sheet.deleteRow(i+1);
      return { success: true, message: 'Murid dipadam' };
    }
  }
  return { success: false, message: 'Murid tidak dijumpai' };
}

function getPendaftaran(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_pendaftaran');
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_pendaftaran');
  if (!sheet) return { success: false, message: 'tbl_pendaftaran tiada' };
  
  // Cari info murid
  var muridSheet = ss.getSheetByName('tbl_murid');
  var nama = payload.no_kp;
  var idRumah = '', idKat = '';
  if (muridSheet) {
    var mData = muridSheet.getDataRange().getValues();
    for (var i = 1; i < mData.length; i++) {
      if (mData[i][1] == payload.no_kp) {
        nama = mData[i][2]; idRumah = mData[i][3]; idKat = mData[i][4]; break;
      }
    }
  }
  
  // Cari info acara
  var acaraSheet = ss.getSheetByName('tbl_acara_jana');
  var namaAcara = '', noAcara = payload.id_acara;
  if (acaraSheet) {
    var aData = acaraSheet.getDataRange().getValues();
    for (var j = 1; j < aData.length; j++) {
      if (aData[j][0] == payload.id_acara || aData[j][1] == payload.id_acara) {
        noAcara = aData[j][1]; namaAcara = aData[j][2]; break;
      }
    }
  }
  
  var id = 'REG-' + new Date().getTime();
  sheet.appendRow([id, payload.id_acara, noAcara, namaAcara,
    payload.no_kp, idRumah||payload.id_rumah, idKat||payload.id_kategori,
    nama, 'AKTIF', new Date()]);
  return { success: true, message: 'Pendaftaran berjaya' };
}

function deletePendaftaran(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_pendaftaran');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == payload.id_reg) {
      sheet.deleteRow(i+1);
      return { success: true };
    }
  }
  return { success: false, message: 'Rekod tidak dijumpai' };
}

function getAcaraJana(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_acara_jana');
  if (!sheet) return { success: true, acara: [], total: 0 };
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    list.push({
      id_acara: data[i][0], no_acara: data[i][1], nama_acara: data[i][2],
      id_kategori: data[i][3], jenis: data[i][4], format: data[i][5],
      guna_lorong: data[i][6]===true||data[i][6]==='TRUE'
    });
  }
  return { success: true, acara: list, total: list.length };
}

function simpanLorong(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('tbl_lorong');
  if (!sheet) {
    sheet = ss.insertSheet('tbl_lorong');
    sheet.appendRow(['id_lorong','id_acara','heat','lorong','no_kp','id_rumah','tarikh']);
  }
  // Padam rekod lama untuk acara+heat ini
  var data = sheet.getDataRange().getValues();
  for (var i = data.length; i >= 2; i--) {
    if (data[i-1][1]==payload.id_acara && data[i-1][2]==payload.heat) sheet.deleteRow(i);
  }
  // Insert baru
  payload.susunan.forEach(function(s) {
    sheet.appendRow(['LRG-'+new Date().getTime()+'-'+s.lorong,
      payload.id_acara, payload.heat, s.lorong, s.no_kp, s.id_rumah, new Date()]);
  });
  return { success: true, message: 'Lorong disimpan' };
}