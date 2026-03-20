/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SISTEM SUKAN TAHUNAN — GAS BACKEND v3.0                       ║
 * ║  SK Sultan Ismail, Kemaman, Terengganu                         ║
 * ║  Schema: MUKTAMAD — jangan ubah column index                   ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  SCHEMA RUJUKAN (JANGAN UBAH TANPA KEMASKINI SEMUA FUNGSI)     ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  tbl_settings        : key[0], value[1]                        ║
 * ║  tbl_users           : username[0], password[1], full_name[2]  ║
 * ║                        email[3], phone[4], role[5]             ║
 * ║                        id_rumah[6], is_active[7], created_at[8]║
 * ║  tbl_rumah_sukan     : id[0], nama[1], warna[2], warna_teks[3] ║
 * ║                        kod[4], emas[5], perak[6], gangsa[7]    ║
 * ║                        keempat[8], mata[9], pengurus[10]       ║
 * ║                        created_at[11]                          ║
 * ║  tbl_kategori        : id[0], kod[1], nama[2], jantina[3]      ║
 * ║                        umin[4], umax[5], kuota_individu[6]     ║
 * ║                        kuota_kumpulan[7], warna[8], aktif[9]   ║
 * ║                        created_at[10]                          ║
 * ║  tbl_acara_master    : id[0], kod[1], nama[2], jenis[3]        ║
 * ║                        kategori_json[4], guna_lorong[5]        ║
 * ║                        jenis_pendaftaran[6], min_ahli[7]       ║
 * ║                        max_ahli[8], format_acara[9]            ║
 * ║                        top_n_final[10], emoji[11], catatan[12] ║
 * ║                        aktif[13], created_at[14]               ║
 * ║                        kuota_ind_rumah[15]                     ║
 * ║                        kuota_pasukan_rumah[16]                 ║
 * ║                        ahli_utama[17], ahli_simpanan[18]       ║
 * ║  tbl_acara_jana      : id_acara[0], no_acara[1], nama_acara[2] ║
 * ║                        id_kategori[3], id_master[4], jenis[5]  ║
 * ║                        guna_lorong[6], jenis_pendaftaran[7]    ║
 * ║                        min_ahli[8], max_ahli[9]                ║
 * ║                        format_acara[10], top_n_final[11]       ║
 * ║                        created_at[12], kuota_ind_rumah[13]     ║
 * ║                        kuota_pasukan_rumah[14]                 ║
 * ║                        ahli_utama[15], ahli_simpanan[16]       ║
 * ║  tbl_murid           : id[0], no_kp[1], nama[2], id_rumah[3]   ║
 * ║                        id_kategori[4], jantina[5]              ║
 * ║                        tarikh_lahir[6], kelas[7], no_dada[8]   ║
 * ║                        is_active[9], created_at[10]            ║
 * ║                        created_by[11]                          ║
 * ║  tbl_pendaftaran     : id_reg[0], id_acara[1], no_acara[2]     ║
 * ║                        nama_acara[3], no_kp[4], id_rumah[5]    ║
 * ║                        id_kategori[6], nama_murid[7]           ║
 * ║                        status[8], created_at[9], created_by[10]║
 * ║  tbl_pendaftaran_kumpulan: id_kumpulan[0], id_acara[1]         ║
 * ║                        no_acara[2], nama_acara[3], id_rumah[4] ║
 * ║                        id_kategori[5], nama_pasukan[6]         ║
 * ║                        ahli_json[7], bilangan_ahli[8]          ║
 * ║                        status[9], created_at[10], created_by[11]║
 * ║  tbl_heat            : id_heat[0], id_acara[1], jenis[2]       ║
 * ║                        no_heat[3], status[4], tarikh[5]        ║
 * ║                        masa_mula[6], catatan[7], created_at[8] ║
 * ║  tbl_peserta_heat    : id[0], id_heat[1], id_acara[2]          ║
 * ║                        no_kp[3], nama[4], id_rumah[5]          ║
 * ║                        id_kategori[6], lorong[7], giliran[8]   ║
 * ║                        status[9], source[10], created_at[11]   ║
 * ║  tbl_keputusan       : id[0], id_heat[1], id_acara[2]          ║
 * ║                        no_kp[3], nama[4], id_rumah[5]          ║
 * ║                        id_kategori[6], jenis[7], prestasi[8]   ║
 * ║                        unit[9], kedudukan[10], layak_final[11] ║
 * ║                        catatan[12], status[13], created_at[14] ║
 * ║  tbl_keputusan_akhir : id[0], id_acara[1], no_kp[2], nama[3]  ║
 * ║                        id_rumah[4], id_kategori[5]             ║
 * ║                        prestasi[6], unit[7], kedudukan[8]      ║
 * ║                        mata[9], status[10], created_at[11]     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ══════════════════════════════════════════════════════════════════
// M1 — CORE: ROUTING, HELPERS, SETTINGS, LOGIN
// ══════════════════════════════════════════════════════════════════

function doGet(e) {
  var page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'home';
  var template;
  try {
    var pageMap = {
      'home'                 : 'Home',
      'login'                : 'Login',
      'admin-setup'          : 'AdminSetup',
      'admin-ops'            : 'AdminOps',
      'admin-results'        : 'AdminResults',
      'pengurus'             : 'PendaftaranPengurus',
      'pendaftaran-pengurus' : 'PendaftaranPengurus',
      'urusetia'             : 'Urusetia',
      'pencatat'             : 'Pencatat',
      'rekod-acara'          : 'RekodAcara'
    };
    var fileName = pageMap[page] || 'Home';
    template = HtmlService.createTemplateFromFile(fileName);
    // Inject URL exec supaya redirect berfungsi dalam sandbox
    try { template.SCRIPT_URL = ScriptApp.getService().getUrl(); } catch(ex) { template.SCRIPT_URL = ''; }
    try { template.USERNAME = (e && e.parameter && e.parameter.u) ? e.parameter.u : ''; } catch(ex) { template.USERNAME = ''; }
    return template.evaluate()
      .setTitle('Sistem Sukan Tahunan — SK Sultan Ismail')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif;padding:30px;color:red">' +
      '<h2>Ralat Sistem</h2><p>' + err.message + '</p>' +
      '<a href="?page=home">← Kembali ke Utama</a></div>'
    );
  }
}

function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

// ── CORE HELPERS ──────────────────────────────────────────────────

function _ss() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function _sheet(name) {
  return _ss().getSheetByName(name);
}

function _uniqueId(prefix) {
  var now   = new Date();
  var rand  = Math.floor(Math.random() * 9000) + 1000;
  var ts    = now.getTime().toString().slice(-6);
  return (prefix || 'ID') + '-' + ts + rand;
}

function _ensureSheet(name, headers) {
  var s = _sheet(name);
  if (!s) {
    s = _ss().insertSheet(name);
    s.appendRow(headers);
    Logger.log('Sheet CREATED: ' + name);
  }
  return s;
}

function _boolVal(v) {
  if (v === true || v === 'TRUE' || v === 'true' || v === 1) return true;
  return false;
}

// ── SETTINGS ──────────────────────────────────────────────────────

var _SETTINGS_CACHE = null;

function getSettings() {
  var sheet = _sheet('tbl_settings');
  if (!sheet) return JSON.stringify({ success: false, data: {} });
  var rows = sheet.getDataRange().getValues();
  var data = {};
  for (var i = 0; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    var k = rows[i][0].toString();
    var v = rows[i][1];
    // auto-cast boolean strings
    if (v === 'true' || v === 'TRUE')   v = true;
    if (v === 'false' || v === 'FALSE') v = false;
    data[k] = v;
  }
  _SETTINGS_CACHE = data;
  return JSON.stringify({ success: true, data: data });
}

function getSetting(key) {
  if (!_SETTINGS_CACHE) getSettings();
  return (_SETTINGS_CACHE && _SETTINGS_CACHE[key] !== undefined)
    ? _SETTINGS_CACHE[key] : null;
}

function saveSetting(key, value) {
  var sheet = _ensureSheet('tbl_settings', ['key','value']);
  var data  = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      _SETTINGS_CACHE = null;
      return { success: true };
    }
  }
  sheet.appendRow([key, value]);
  _SETTINGS_CACHE = null;
  return { success: true };
}

function saveSettings(payload) {
  if (!payload || typeof payload !== 'object') return { success: false, message: 'Payload tiada' };
  var keys = Object.keys(payload);
  for (var i = 0; i < keys.length; i++) {
    saveSetting(keys[i], payload[keys[i]]);
  }
  return { success: true, message: keys.length + ' tetapan disimpan' };
}

// backward compat alias
function updateSettings(payload) { return saveSettings(payload); }
function getSettingsCompat()     { return getSettings(); }

// ── LOGIN ──────────────────────────────────────────────────────────
// tbl_users: username[0],password[1],full_name[2],email[3],phone[4],
//            role[5],id_rumah[6],is_active[7],created_at[8]

function loginUser(payload) {
  var username = (payload && payload.username) ? payload.username.toString().trim() : '';
  var password = (payload && payload.password) ? payload.password.toString() : '';
  if (!username || !password) {
    return { success: false, message: 'Username dan kata laluan diperlukan.' };
  }
  var sheet = _sheet('tbl_users');
  if (!sheet) return { success: false, message: 'tbl_users tidak dijumpai. Jalankan setupInitialData().' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    if (!r[0]) continue;
    if (r[0].toString().trim() === username && r[1].toString() === password) {
      if (!_boolVal(r[7])) return { success: false, message: 'Akaun tidak aktif. Hubungi Admin.' };
      var userData = {
        username  : r[0],
        full_name : r[2],
        email     : r[3],
        phone     : r[4],
        role      : r[5],
        id_rumah  : r[6]
      };
      saveSession(r[0], userData);
      return JSON.stringify({ success: true, user: userData });
    }
  }
  return JSON.stringify({ success: false, message: 'Username atau kata laluan salah.' });
}

// alias
function handleLogin(payload)      { return loginUser(payload); }
function authenticateUser(payload) { return loginUser(payload); }

// ── SESSION MANAGEMENT ─────────────────────────────────────────────
function saveSession(username, userData) {
  try {
    var cache = CacheService.getUserCache();
    var val = JSON.stringify({
      username  : userData.username,
      full_name : userData.full_name,
      role      : userData.role,
      id_rumah  : userData.id_rumah,
      email     : userData.email
    });
    cache.put('sukan_session_' + username, val, 21600); // 6 jam
  } catch(e) { Logger.log('saveSession error: ' + e); }
}

function getSession(payload) {
  try {
    var username = payload && payload.username
      ? payload.username.toString().trim() : '';
    if (!username) {
      return JSON.stringify({success: false, message: 'Username diperlukan'});
    }
    var cache = CacheService.getUserCache();
    var val = cache.get('sukan_session_' + username);
    if (!val) {
      return JSON.stringify({success: false, message: 'Sesi tamat. Log masuk semula.'});
    }
    return JSON.stringify({success: true, user: JSON.parse(val)});
  } catch(e) {
    return JSON.stringify({success: false, message: e.toString()});
  }
}

// Dipanggil oleh doGet untuk inject session ke PendaftaranPengurus
function getPengurusSessionData(username) {
  if (!username) return null;
  try {
    var cache = CacheService.getUserCache();
    var val = cache.get('sukan_session_' + username);
    if (!val) return null;
    var user = JSON.parse(val);
    // Ambil nama_rumah dan warna dari tbl_rumah_sukan
    if (user.id_rumah) {
      var rSheet = _sheet('tbl_rumah_sukan');
      if (rSheet) {
        var rData = rSheet.getDataRange().getValues();
        for (var i = 1; i < rData.length; i++) {
          if (rData[i][0] === user.id_rumah) {
            user.nama_rumah  = rData[i][1] || '';
            user.warna_rumah = rData[i][2] || '#666666';
            break;
          }
        }
      }
    }
    return user;
  } catch(e) { return null; }
}



// ══════════════════════════════════════════════════════════════════
// M2 — MASTER DATA: RUMAH, KATEGORI, ACARA MASTER, USERS
// ══════════════════════════════════════════════════════════════════

// ── RUMAH SUKAN ────────────────────────────────────────────────────
// tbl_rumah_sukan: id[0],nama[1],warna[2],warna_teks[3],kod[4],
//   emas[5],perak[6],gangsa[7],keempat[8],mata[9],pengurus[10],created_at[11]

function getRumah() {
  var sheet = _sheet('tbl_rumah_sukan');
  if (!sheet) return { success: false, message: 'tbl_rumah_sukan tiada' };
  var data  = sheet.getDataRange().getValues();
  var list  = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    list.push({
      id         : data[i][0],
      nama       : data[i][1],
      warna      : data[i][2] || '#666666',
      warna_teks : data[i][3] || '#ffffff',
      kod        : data[i][4] || '',
      emas       : parseInt(data[i][5])  || 0,
      perak      : parseInt(data[i][6])  || 0,
      gangsa     : parseInt(data[i][7])  || 0,
      keempat    : parseInt(data[i][8])  || 0,
      mata       : parseInt(data[i][9])  || 0,
      pengurus   : data[i][10] || '',
      created_at : data[i][11] ? data[i][11].toString() : ''
    });
  }
  return JSON.stringify({ success: true, data: list, total: list.length });
}

function createRumah(payload) {
  if (!payload || !payload.nama) return { success: false, message: 'Nama rumah diperlukan' };
  var sheet = _ensureSheet('tbl_rumah_sukan',
    ['id','nama','warna','warna_teks','kod','emas','perak','gangsa','keempat','mata','pengurus','created_at']);
  // semak duplikasi nama
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toString().toUpperCase() === payload.nama.toString().toUpperCase()) {
      return { success: false, message: 'Nama rumah sudah wujud: ' + payload.nama };
    }
  }
  var id = 'RMH-' + payload.nama.toString().toUpperCase().replace(/\s+/g, '-');
  sheet.appendRow([
    id,
    payload.nama.toString().toUpperCase(),
    payload.warna      || '#666666',
    payload.warna_teks || '#ffffff',
    payload.kod        || payload.nama.toString().substring(0,3).toUpperCase(),
    0, 0, 0, 0, 0,
    payload.pengurus   || '',
    new Date()
  ]);
  return { success: true, id: id, message: 'Rumah ' + payload.nama + ' berjaya ditambah' };
}

function updateRumah(payload) {
  if (!payload || !payload.id) return { success: false, message: 'ID rumah diperlukan' };
  var sheet = _sheet('tbl_rumah_sukan');
  if (!sheet) return { success: false, message: 'tbl_rumah_sukan tiada' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id) {
      if (payload.nama       !== undefined) sheet.getRange(i+1,2).setValue(payload.nama.toString().toUpperCase());
      if (payload.warna      !== undefined) sheet.getRange(i+1,3).setValue(payload.warna);
      if (payload.warna_teks !== undefined) sheet.getRange(i+1,4).setValue(payload.warna_teks);
      if (payload.kod        !== undefined) sheet.getRange(i+1,5).setValue(payload.kod);
      if (payload.pengurus   !== undefined) sheet.getRange(i+1,11).setValue(payload.pengurus);
      return { success: true, message: 'Rumah dikemaskini' };
    }
  }
  return { success: false, message: 'Rumah tidak dijumpai: ' + payload.id };
}

function deleteRumah(payload) {
  if (!payload || !payload.id) return { success: false, message: 'ID diperlukan' };
  var sheet = _sheet('tbl_rumah_sukan');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Rumah tidak dijumpai' };
}

// ── KATEGORI ───────────────────────────────────────────────────────
// tbl_kategori: id[0],kod[1],nama[2],jantina[3],umin[4],umax[5],
//   kuota_individu[6],kuota_kumpulan[7],warna[8],aktif[9],created_at[10]

function getKategori() {
  var sheet = _sheet('tbl_kategori');
  if (!sheet) return { success: false, message: 'tbl_kategori tiada' };
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    list.push({
      id              : data[i][0],
      kod             : data[i][1],
      nama            : data[i][2],
      jantina         : data[i][3] || 'L',
      umin            : parseInt(data[i][4]) || 7,
      umax            : parseInt(data[i][5]) || 12,
      kuota_individu  : parseInt(data[i][6]) || 3,
      kuota_kumpulan  : parseInt(data[i][7]) || 1,
      warna           : data[i][8] || '#4F8EF7',
      aktif           : data[i][9] !== false && data[i][9] !== 'FALSE',
      created_at      : data[i][10] ? data[i][10].toString() : ''
    });
  }
  return JSON.stringify({ success: true, data: list, total: list.length });
}

function createKategori(payload) {
  if (!payload || !payload.kod || !payload.nama) {
    return { success: false, message: 'Kod dan nama kategori diperlukan' };
  }
  var sheet = _ensureSheet('tbl_kategori',
    ['id','kod','nama','jantina','umin','umax','kuota_individu','kuota_kumpulan','warna','aktif','created_at']);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toString().toUpperCase() === payload.kod.toString().toUpperCase()) {
      return { success: false, message: 'Kod kategori sudah wujud: ' + payload.kod };
    }
  }
  var id = 'KAT-' + payload.kod.toString().toUpperCase();
  sheet.appendRow([
    id,
    payload.kod.toString().toUpperCase(),
    payload.nama,
    payload.jantina         || 'L',
    parseInt(payload.umin)  || 7,
    parseInt(payload.umax)  || 12,
    parseInt(payload.kuota_individu)  || 3,
    parseInt(payload.kuota_kumpulan)  || 1,
    payload.warna           || '#4F8EF7',
    true,
    new Date()
  ]);
  return { success: true, id: id, message: 'Kategori ' + payload.kod + ' berjaya ditambah' };
}

function updateKategori(payload) {
  if (!payload || !payload.id) return { success: false, message: 'ID kategori diperlukan' };
  var sheet = _sheet('tbl_kategori');
  if (!sheet) return { success: false, message: 'tbl_kategori tiada' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id) {
      if (payload.kod             !== undefined) sheet.getRange(i+1,2).setValue(payload.kod);
      if (payload.nama            !== undefined) sheet.getRange(i+1,3).setValue(payload.nama);
      if (payload.jantina         !== undefined) sheet.getRange(i+1,4).setValue(payload.jantina);
      if (payload.umin            !== undefined) sheet.getRange(i+1,5).setValue(parseInt(payload.umin)||7);
      if (payload.umax            !== undefined) sheet.getRange(i+1,6).setValue(parseInt(payload.umax)||12);
      if (payload.kuota_individu  !== undefined) sheet.getRange(i+1,7).setValue(parseInt(payload.kuota_individu)||3);
      if (payload.kuota_kumpulan  !== undefined) sheet.getRange(i+1,8).setValue(parseInt(payload.kuota_kumpulan)||1);
      if (payload.warna           !== undefined) sheet.getRange(i+1,9).setValue(payload.warna);
      if (payload.aktif           !== undefined) sheet.getRange(i+1,10).setValue(_boolVal(payload.aktif));
      return { success: true, message: 'Kategori dikemaskini' };
    }
  }
  return { success: false, message: 'Kategori tidak dijumpai' };
}

function deleteKategori(payload) {
  if (!payload || !payload.id) return { success: false, message: 'ID diperlukan' };
  var sheet = _sheet('tbl_kategori');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Kategori tidak dijumpai' };
}

// ── ACARA MASTER ───────────────────────────────────────────────────
// tbl_acara_master: id[0],kod[1],nama[2],jenis[3],kategori_json[4],
//   guna_lorong[5],jenis_pendaftaran[6],min_ahli[7],max_ahli[8],
//   format_acara[9],top_n_final[10],emoji[11],catatan[12],aktif[13],created_at[14]

function getAcara() {
  var sheet = _sheet('tbl_acara_master');
  if (!sheet) return JSON.stringify({ success: true, data: [] });
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    var katArr = [];
    try   { katArr = JSON.parse(data[i][4] || '[]'); }
    catch (e) { katArr = data[i][4] ? data[i][4].toString().split(',').map(function(k){ return k.trim(); }) : []; }
    list.push({
      id                  : data[i][0],
      kod                 : data[i][1],
      nama                : data[i][2],
      jenis               : (data[i][3] || 'TRACK').toUpperCase(),
      kategori            : katArr,
      guna_lorong         : _boolVal(data[i][5]),
      jenis_pendaftaran   : (data[i][6] || 'INDIVIDU').toUpperCase(),
      min_ahli            : parseInt(data[i][7]) || 1,
      max_ahli            : parseInt(data[i][8]) || 1,
      format_acara        : (data[i][9] || 'TERUS_FINAL').toUpperCase(),
      top_n_final         : parseInt(data[i][10]) || 8,
      emoji               : data[i][11] || '🏃',
      catatan             : data[i][12] || '',
      aktif               : data[i][13] !== false && data[i][13] !== 'FALSE',
      created_at          : data[i][14] ? data[i][14].toString() : '',
      kuota_ind_rumah     : isNaN(parseInt(data[i][15])) ? 2 : parseInt(data[i][15]),
      kuota_pasukan_rumah : isNaN(parseInt(data[i][16])) ? 1 : parseInt(data[i][16]),
      ahli_utama          : isNaN(parseInt(data[i][17])) ? 4 : parseInt(data[i][17]),
      ahli_simpanan       : isNaN(parseInt(data[i][18])) ? 0 : parseInt(data[i][18])
    });
  }
  return JSON.stringify({ success: true, data: list, total: list.length });
}

function createAcara(payload) {
  if (!payload || !payload.nama) return { success: false, message: 'Nama acara diperlukan' };
  var sheet = _ensureSheet('tbl_acara_master',
    ['id','kod','nama','jenis','kategori_json','guna_lorong',
     'jenis_pendaftaran','min_ahli','max_ahli','format_acara',
     'top_n_final','emoji','catatan','aktif','created_at',
     'kuota_ind_rumah','kuota_pasukan_rumah','ahli_utama','ahli_simpanan']);
  var id      = _uniqueId('ACR');
  var katJson = JSON.stringify(Array.isArray(payload.kategori) ? payload.kategori : []);
  var jenisPend = (payload.jenis_pendaftaran || 'INDIVIDU').toUpperCase();
  var minAhli = parseInt(payload.min_ahli) || (jenisPend === 'KUMPULAN' ? 4 : 1);
  var maxAhli = parseInt(payload.max_ahli) || (jenisPend === 'KUMPULAN' ? 4 : 1);
  var kuotaInd    = parseInt(payload.kuota_ind_rumah)     || (jenisPend === 'INDIVIDU' ? 2 : 0);
  var kuotaPasukan= parseInt(payload.kuota_pasukan_rumah) || (jenisPend === 'KUMPULAN' ? 1 : 0);
  var ahliUtama   = parseInt(payload.ahli_utama)          || (jenisPend === 'KUMPULAN' ? minAhli : 1);
  var ahliSimpanan= parseInt(payload.ahli_simpanan)       || 0;
  sheet.appendRow([
    id,
    payload.kod        || id,
    payload.nama,
    (payload.jenis     || 'TRACK').toUpperCase(),
    katJson,
    _boolVal(payload.guna_lorong),
    jenisPend,
    minAhli,
    maxAhli,
    (payload.format_acara || 'TERUS_FINAL').toUpperCase(),
    parseInt(payload.top_n_final) || 8,
    payload.emoji      || '🏃',
    payload.catatan    || '',
    true,
    new Date(),
    kuotaInd,
    kuotaPasukan,
    ahliUtama,
    ahliSimpanan
  ]);
  return JSON.stringify({ success: true, id: id, message: 'Acara master berjaya ditambah' });
}

function updateAcara(payload) {
  if (!payload || !payload.id) return { success: false, message: 'ID acara diperlukan' };
  var sheet = _sheet('tbl_acara_master');
  if (!sheet) return { success: false, message: 'tbl_acara_master tiada' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id) {
      var katJson = payload.kategori !== undefined
        ? JSON.stringify(Array.isArray(payload.kategori) ? payload.kategori : [])
        : data[i][4];
      // guna_lorong: terima 'lorong' ATAU 'guna_lorong' dari payload
      var gunaLorong = payload.guna_lorong !== undefined ? payload.guna_lorong
                     : payload.lorong      !== undefined ? payload.lorong
                     : data[i][5];
      // format_acara: terima 'format' ATAU 'format_acara'
      var formatAcara = (payload.format_acara || payload.format || data[i][9] || 'TERUS_FINAL').toUpperCase();
      // jenis_pendaftaran: auto dari kuota
      var jenisPend = (payload.jenis_pendaftaran || data[i][6] || 'INDIVIDU').toUpperCase();
      var kuotaInd     = isNaN(parseInt(payload.kuota_ind_rumah))     ? parseInt(data[i][15])||0 : parseInt(payload.kuota_ind_rumah);
      var kuotaPasukan = isNaN(parseInt(payload.kuota_pasukan_rumah)) ? parseInt(data[i][16])||0 : parseInt(payload.kuota_pasukan_rumah);
      var ahliUtama    = isNaN(parseInt(payload.ahli_utama))          ? parseInt(data[i][17])||0 : parseInt(payload.ahli_utama);
      var ahliSimpanan = isNaN(parseInt(payload.ahli_simpanan))       ? parseInt(data[i][18])||0 : parseInt(payload.ahli_simpanan);
      if (kuotaPasukan > 0 && kuotaInd === 0) jenisPend = 'KUMPULAN';
      if (kuotaInd > 0 && kuotaPasukan === 0) jenisPend = 'INDIVIDU';
      sheet.getRange(i+1, 2, 1, 18).setValues([[
        payload.kod  || data[i][1],                                                    // [1]  kod
        payload.nama || data[i][2],                                                    // [2]  nama
        (payload.jenis || data[i][3] || 'TRACK').toUpperCase(),                        // [3]  jenis
        katJson,                                                                       // [4]  kategori_json
        _boolVal(gunaLorong),                                                          // [5]  guna_lorong
        jenisPend,                                                                     // [6]  jenis_pendaftaran
        parseInt(payload.min_ahli !== undefined ? payload.min_ahli : data[i][7])||1,  // [7]  min_ahli
        parseInt(payload.max_ahli !== undefined ? payload.max_ahli : data[i][8])||1,  // [8]  max_ahli
        formatAcara,                                                                   // [9]  format_acara
        parseInt(payload.top_n_final !== undefined ? payload.top_n_final:data[i][10])||8, // [10] top_n_final
        payload.emoji   !== undefined ? payload.emoji   : data[i][11],                // [11] emoji
        payload.catatan !== undefined ? payload.catatan : data[i][12],                // [12] catatan
        payload.aktif   !== undefined ? _boolVal(payload.aktif) : data[i][13],        // [13] aktif
        data[i][14],                                                                   // [14] created_at — KEKAL
        kuotaInd,                                                                      // [15] kuota_ind_rumah
        kuotaPasukan,                                                                  // [16] kuota_pasukan_rumah
        ahliUtama,                                                                     // [17] ahli_utama
        ahliSimpanan                                                                   // [18] ahli_simpanan
      ]]);
      return JSON.stringify({ success: true, message: 'Acara master dikemaskini' });
    }
  }
  return { success: false, message: 'Acara tidak dijumpai: ' + payload.id };
}

function deleteAcaraMaster(payload) {
  if (!payload || !payload.id) return { success: false, message: 'ID diperlukan' };
  var sheet = _sheet('tbl_acara_master');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id) {
      sheet.deleteRow(i + 1);
      return JSON.stringify({ success: true });
    }
  }
  return JSON.stringify({ success: false, message: 'Acara tidak dijumpai' });
}

// ── USERS CRUD ─────────────────────────────────────────────────────
// tbl_users: username[0],password[1],full_name[2],email[3],phone[4],
//            role[5],id_rumah[6],is_active[7],created_at[8]

function getUsers() {
  var sheet = _sheet('tbl_users');
  if (!sheet) return { success: false, message: 'tbl_users tiada' };
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    list.push({
      username   : data[i][0],
      full_name  : data[i][2],
      email      : data[i][3],
      phone      : data[i][4],
      role       : data[i][5],
      id_rumah   : data[i][6],
      is_active  : _boolVal(data[i][7]),
      created_at : data[i][8] ? data[i][8].toString() : ''
      // password TIDAK dikembalikan
    });
  }
  return JSON.stringify({ success: true, data: list, users: list, total: list.length });
}

function createUser(payload) {
  if (!payload || !payload.username || !payload.password) {
    return { success: false, message: 'Username dan kata laluan diperlukan' };
  }
  var sheet = _ensureSheet('tbl_users',
    ['username','password','full_name','email','phone','role','id_rumah','is_active','created_at']);
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString() === payload.username.toString()) {
      return { success: false, message: 'Username "' + payload.username + '" sudah wujud' };
    }
  }
  sheet.appendRow([
    payload.username,
    payload.password,
    payload.full_name  || '',
    payload.email      || '',
    payload.phone      || '',
    payload.role       || 'Pencatat',
    payload.id_rumah   || '',
    true,
    new Date()
  ]);
  return { success: true, message: 'Pengguna "' + payload.username + '" berjaya ditambah' };
}

function updateUser(payload) {
  if (!payload || !payload.username) return { success: false, message: 'Username diperlukan' };
  var sheet = _sheet('tbl_users');
  if (!sheet) return { success: false, message: 'tbl_users tiada' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString() === payload.username.toString()) {
      if (payload.full_name  !== undefined) sheet.getRange(i+1,3).setValue(payload.full_name);
      if (payload.email      !== undefined) sheet.getRange(i+1,4).setValue(payload.email);
      if (payload.phone      !== undefined) sheet.getRange(i+1,5).setValue(payload.phone);
      if (payload.role       !== undefined) sheet.getRange(i+1,6).setValue(payload.role);
      if (payload.id_rumah   !== undefined) sheet.getRange(i+1,7).setValue(payload.id_rumah);
      if (payload.is_active  !== undefined) sheet.getRange(i+1,8).setValue(_boolVal(payload.is_active));
      if (payload.password   && payload.password.length >= 6) sheet.getRange(i+1,2).setValue(payload.password);
      return { success: true, message: 'Pengguna dikemaskini' };
    }
  }
  return { success: false, message: 'Pengguna tidak dijumpai: ' + payload.username };
}

function deleteUser(payload) {
  if (!payload || !payload.username) return { success: false, message: 'Username diperlukan' };
  if (payload.username === 'admin') return { success: false, message: 'Akaun admin tidak boleh dipadam' };
  var sheet = _sheet('tbl_users');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString() === payload.username.toString()) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Pengguna tidak dijumpai' };
}

// ══════════════════════════════════════════════════════════════════
// M3 — OPERASI: MURID, JANA ACARA, UNDIAN LORONG
// ══════════════════════════════════════════════════════════════════

// ── MURID CRUD ─────────────────────────────────────────────────────
// tbl_murid: id[0],no_kp[1],nama[2],id_rumah[3],id_kategori[4],
//   jantina[5],tarikh_lahir[6],kelas[7],no_dada[8],
//   is_active[9],created_at[10],created_by[11]


// ── IMPORT MURID CSV ──────────────────────────────────────────────────────
// Format CSV: no_kp, nama, darjah, kelas, nama_rumah
// Sistem auto-jana: jantina, tarikh_lahir, id_rumah, id_kategori
function importMuridCSV(payload) {
  try {
    if (!payload || !payload.csv) return JSON.stringify({ success: false, message: 'Data CSV tiada' });

    var ss     = SpreadsheetApp.getActiveSpreadsheet();
    var sheet  = _ensureSheet('tbl_murid',
      ['id','no_kp','nama','id_rumah','id_kategori','jantina','tarikh_lahir',
       'kelas','no_dada','is_active','created_at','created_by','darjah','nama_rumah']);

    // Bina rumah lookup: nama_rumah (uppercase) → id_rumah
    var rumahSheet = ss.getSheetByName('tbl_rumah_sukan');
    var rumahMap   = {};
    if (rumahSheet && rumahSheet.getLastRow() > 1) {
      var rd = rumahSheet.getRange(2, 1, rumahSheet.getLastRow()-1, 2).getValues();
      rd.forEach(function(r) {
        if (r[0] && r[1]) rumahMap[r[1].toString().toUpperCase().trim()] = r[0].toString();
      });
    }

    // Bina kategori lookup dari tarikh sukan
    var tarikh_sukan = getSetting('tarikh_sukan') || new Date().getFullYear() + '-08-01';
    var tSukan = new Date(tarikh_sukan);

    // Ambil senarai KP sedia ada untuk semak duplikat
    var existKP = {};
    if (sheet.getLastRow() > 1) {
      var ex = sheet.getRange(2, 2, sheet.getLastRow()-1, 1).getValues();
      ex.forEach(function(r) { if (r[0]) existKP[_normalizeKp(r[0])] = true; });
    }

    // Parse CSV
    var lines = payload.csv.split('\n').map(function(l){ return l.trim(); }).filter(Boolean);
    if (lines.length < 2) return JSON.stringify({ success: false, message: 'CSV kosong atau tiada data' });

    // Detect header — skip baris pertama jika ia header
    var firstCells = lines[0].split(',').map(function(c){ return c.trim().toLowerCase(); });
    var startRow   = (firstCells[0] === 'no_kp' || firstCells[0] === 'nokp' || isNaN(firstCells[0].replace(/\D/g,''))) ? 1 : 0;

    var count = 0, skipped = 0, errors = [];

    for (var i = startRow; i < lines.length; i++) {
      var cells = lines[i].split(',').map(function(c){ return c.trim(); });
      if (cells.length < 2) continue;

      // Kolum: no_kp[0], nama[1], darjah[2], kelas[3], nama_rumah[4]
      var rawKp      = cells[0] || '';
      var nama       = cells[1] || '';
      var darjah     = cells[2] || '';
      var kelas      = cells[3] || '';
      var namaRumah  = (cells[4] || '').toUpperCase().trim();

      if (!rawKp || !nama) { errors.push('Baris '+(i+1)+': KP atau nama kosong'); skipped++; continue; }

      var kp = _normalizeKp(rawKp);
      if (!kp) { errors.push('Baris '+(i+1)+': KP tidak sah ('+rawKp+')'); skipped++; continue; }
      if (existKP[kp]) { errors.push('Baris '+(i+1)+': KP sudah wujud ('+_formatKp(kp)+')'); skipped++; continue; }

      // Auto-jana dari KP
      var jantina    = _jantinaFromKp(kp);
      var tLahir     = _tarihLahirFromKp(kp);

      // Auto-kira umur pada tarikh sukan
      var idKat = '';
      if (tLahir) {
        var dob  = new Date(tLahir);
        var umur = tSukan.getFullYear() - dob.getFullYear();
        var katSheet2 = ss.getSheetByName('tbl_kategori');
        if (katSheet2 && katSheet2.getLastRow() > 1) {
          var kd = katSheet2.getRange(2, 1, katSheet2.getLastRow()-1, 6).getValues();
          for (var k = 0; k < kd.length; k++) {
            var kJantina = kd[k][3];
            var umin = parseInt(kd[k][4]);
            var umax = parseInt(kd[k][5]);
            if (kJantina === jantina && umur >= umin && umur <= umax) {
              idKat = kd[k][0]; break;
            }
          }
        }
      }

      // Lookup id_rumah
      var idRumah = rumahMap[namaRumah] || '';
      if (!idRumah && namaRumah) {
        errors.push('Baris '+(i+1)+': Rumah "'+namaRumah+'" tidak dijumpai — id_rumah kosong');
      }

      var id = _uniqueId('MRD');
      sheet.appendRow([
        id, kp, nama,                    // [0][1][2]
        idRumah, idKat,                  // [3][4]
        jantina, tLahir,                 // [5][6]
        kelas, '',                       // [7][8]
        true, new Date().toString(), 'import', // [9][10][11]
        '','','','','',                  // [12][13][14][15][16] kolum lama (kosong)
        darjah, namaRumah                // [17][18]
      ]);
      existKP[kp] = true;
      count++;
    }

    Logger.log('✅ importMuridCSV: ' + count + ' berjaya, ' + skipped + ' skip');
    return JSON.stringify({
      success : true,
      count   : count,
      skipped : skipped,
      errors  : errors.slice(0, 10),
      message : count + ' murid berjaya diimport' + (skipped > 0 ? ', ' + skipped + ' diskip' : '')
    });
  } catch(e) {
    Logger.log('❌ importMuridCSV error: ' + e.message);
    return JSON.stringify({ success: false, message: e.message });
  }
}

function getMurid(payload) {
  var sheet = _sheet('tbl_murid');
  if (!sheet) return JSON.stringify({ success: true, murid: [], total: 0 });
  var data  = sheet.getDataRange().getValues();
  var list  = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    if (data[i][9] !== '' && data[i][9] !== true && !_boolVal(data[i][9])) continue; // skip inactive (biar kosong)
    // filter by id_rumah ATAU nama_rumah (fallback untuk data lama)
    if (payload && payload.id_rumah) {
      var rowIdRumah   = (data[i][3] || '').toString().trim();
      var rowNamaRumah = (data[i][18] || '').toString().trim().toLowerCase();
      // Dapatkan nama_rumah dari payload untuk compare
      var payloadNama  = (payload.nama_rumah || '').toString().trim().toLowerCase();
      var idMatch   = rowIdRumah === payload.id_rumah;
      var namaMatch = payloadNama && rowNamaRumah === payloadNama;
      if (!idMatch && !namaMatch) continue;
    }
    // filter by id_kategori
    if (payload && payload.id_kategori && data[i][4] !== payload.id_kategori) continue;
    list.push({
      id           : data[i][0],
      no_kp        : data[i][1],
      nama         : data[i][2],
      id_rumah     : data[i][3],
      id_kategori  : data[i][4],
      jantina      : data[i][5],
      tarikh_lahir : data[i][6],
      kelas        : data[i][7],
      no_dada      : data[i][8],
      is_active    : _boolVal(data[i][9]),
      created_at   : data[i][10] ? data[i][10].toString() : '',
      created_by   : data[i][11] ? data[i][11].toString() : '',
      darjah       : data[i][17] ? data[i][17].toString() : '',
      nama_rumah   : data[i][18] ? data[i][18].toString() : ''
    });
  }
  return JSON.stringify({ success: true, murid: list, total: list.length });
}

function saveMurid(payload) {
  if (!payload || !payload.no_kp || !payload.nama) {
    return { success: false, message: 'No KP dan nama diperlukan' };
  }
  var kp = _normalizeKp(payload.no_kp);
  if (!kp) return { success: false, message: 'Format No KP tidak sah: ' + payload.no_kp };

  var sheet = _ensureSheet('tbl_murid',
    ['id','no_kp','nama','id_rumah','id_kategori','jantina','tarikh_lahir',
     'kelas','no_dada','is_active','created_at','created_by','darjah','nama_rumah']);
  // semak duplikasi KP
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] && _normalizeKp(data[i][1]) === kp) {
      return { success: false, message: 'No KP sudah wujud: ' + _formatKp(kp) };
    }
  }
  var jantina     = payload.jantina || _jantinaFromKp(kp);
  var tLahir      = payload.tarikh_lahir || _tarihLahirFromKp(kp);
  var id          = _uniqueId('MRD');
  sheet.appendRow([
    id, kp, payload.nama,
    payload.id_rumah    || '',
    payload.id_kategori || '',
    jantina, tLahir,
    payload.kelas       || '',
    payload.no_dada     || '',
    true,
    new Date(),
    payload.created_by  || 'admin',
    payload.darjah      || '',
    payload.nama_rumah  || ''
  ]);
  return { success: true, id: id, no_kp: kp, message: 'Murid berjaya ditambah' };
}

function updateMurid(payload) {
  if (!payload || !payload.id) return { success: false, message: 'ID murid diperlukan' };
  var sheet = _sheet('tbl_murid');
  if (!sheet) return { success: false, message: 'tbl_murid tiada' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id) {
      if (payload.nama         !== undefined) sheet.getRange(i+1,3).setValue(payload.nama);
      if (payload.id_rumah     !== undefined) sheet.getRange(i+1,4).setValue(payload.id_rumah);
      if (payload.id_kategori  !== undefined) sheet.getRange(i+1,5).setValue(payload.id_kategori);
      if (payload.jantina      !== undefined) sheet.getRange(i+1,6).setValue(payload.jantina);
      if (payload.tarikh_lahir !== undefined) sheet.getRange(i+1,7).setValue(payload.tarikh_lahir);
      if (payload.kelas        !== undefined) sheet.getRange(i+1,8).setValue(payload.kelas);
      if (payload.no_dada      !== undefined) sheet.getRange(i+1,9).setValue(payload.no_dada);
      if (payload.is_active    !== undefined) sheet.getRange(i+1,10).setValue(_boolVal(payload.is_active));
      return { success: true, message: 'Data murid dikemaskini' };
    }
  }
  return { success: false, message: 'Murid tidak dijumpai' };
}

function deleteMurid(payload) {
  if (!payload || !payload.id) return { success: false, message: 'ID diperlukan' };
  var sheet = _sheet('tbl_murid');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id) {
      // soft delete
      sheet.getRange(i+1, 10).setValue(false);
      return { success: true };
    }
  }
  return { success: false, message: 'Murid tidak dijumpai' };
}

// ── JANA ACARA ─────────────────────────────────────────────────────
// Jana tbl_acara_jana dari tbl_acara_master
// tbl_acara_jana: id_acara[0],no_acara[1],nama_acara[2],id_kategori[3],
//   id_master[4],jenis[5],guna_lorong[6],jenis_pendaftaran[7],
//   min_ahli[8],max_ahli[9],format_acara[10],top_n_final[11],created_at[12]

function getAcaraJana(payload) {
  var sheet = _sheet('tbl_acara_jana');
  if (!sheet) return JSON.stringify({ success: true, acara: [], total: 0 });
  var data = sheet.getDataRange().getValues();

  // Preload tbl_acara_master untuk fallback jenis_pendaftaran
  var masterMap = {};
  var mSheet = _sheet('tbl_acara_master');
  if (mSheet) {
    var mData = mSheet.getDataRange().getValues();
    for (var m = 1; m < mData.length; m++) {
      if (mData[m][0]) masterMap[mData[m][0]] = (mData[m][6] || 'INDIVIDU').toUpperCase();
    }
  }

  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    if (payload && payload.id_kategori && data[i][3] !== payload.id_kategori) continue;
    // jenis_pendaftaran: guna [7], fallback dari master jika kosong
    // Keutamaan: masterMap → min_ahli → nilai sheet → default INDIVIDU
    var jenisPend = masterMap[data[i][4]]
      || (parseInt(data[i][8]) >= 2 ? 'KUMPULAN' : '')
      || (data[i][7] || '').toString().trim().toUpperCase()
      || 'INDIVIDU';
    if (jenisPend === 'UNDEFINED') jenisPend = 'INDIVIDU';
    list.push({
      id_acara            : data[i][0],
      no_acara            : data[i][1],
      nama_acara          : data[i][2],
      id_kategori         : data[i][3],
      id_master           : data[i][4],
      jenis               : (data[i][5] || 'TRACK').toUpperCase(),
      guna_lorong         : _boolVal(data[i][6]),
      jenis_pendaftaran   : jenisPend,
      min_ahli            : parseInt(data[i][8])  || 1,
      max_ahli            : parseInt(data[i][9])  || 1,
      format_acara        : (data[i][10] || 'TERUS_FINAL').toUpperCase(),
      top_n_final         : parseInt(data[i][11]) || 8,
      created_at          : data[i][12] ? data[i][12].toString() : '',
      kuota_ind_rumah     : isNaN(parseInt(data[i][13])) ? 2 : parseInt(data[i][13]),
      kuota_pasukan_rumah : isNaN(parseInt(data[i][14])) ? 1 : parseInt(data[i][14]),
      ahli_utama          : isNaN(parseInt(data[i][15])) ? 4 : parseInt(data[i][15]),
      ahli_simpanan       : isNaN(parseInt(data[i][16])) ? 0 : parseInt(data[i][16])
    });
  }
  return JSON.stringify({ success: true, acara: list, total: list.length });
}

function janaAcara(payload) {
  if (!payload || !payload.id_master) return { success: false, message: 'id_master diperlukan' };
  var masterSheet = _sheet('tbl_acara_master');
  if (!masterSheet) return { success: false, message: 'tbl_acara_master tiada' };

  // baca master
  var mData = masterSheet.getDataRange().getValues();
  var master = null;
  for (var i = 1; i < mData.length; i++) {
    if (mData[i][0] === payload.id_master) {
      master = {
        id                  : mData[i][0],
        nama                : mData[i][2],
        jenis               : (mData[i][3] || 'TRACK').toUpperCase(),
        kategori_json       : mData[i][4] || '[]',
        guna_lorong         : _boolVal(mData[i][5]),
        jenis_pendaftaran   : (mData[i][6] || 'INDIVIDU').toUpperCase(),
        min_ahli            : parseInt(mData[i][7]) || 1,
        max_ahli            : parseInt(mData[i][8]) || 1,
        format_acara        : (mData[i][9] || 'TERUS_FINAL').toUpperCase(),
        top_n_final         : parseInt(mData[i][10]) || 8,
        kuota_ind_rumah     : isNaN(parseInt(mData[i][15])) ? 2 : parseInt(mData[i][15]),
        kuota_pasukan_rumah : isNaN(parseInt(mData[i][16])) ? 1 : parseInt(mData[i][16]),
        ahli_utama          : isNaN(parseInt(mData[i][17])) ? 4 : parseInt(mData[i][17]),
        ahli_simpanan       : isNaN(parseInt(mData[i][18])) ? 0 : parseInt(mData[i][18])
      };
      break;
    }
  }
  if (!master) return { success: false, message: 'Acara master tidak dijumpai: ' + payload.id_master };

  // parse kategori
  var katArr = [];
  try   { katArr = JSON.parse(master.kategori_json); }
  catch (e) { katArr = master.kategori_json.split(',').map(function(k){ return k.trim(); }); }
  if (payload.id_kategori) katArr = katArr.filter(function(k){ return k === payload.id_kategori; });
  if (!katArr.length) return { success: false, message: 'Tiada kategori untuk dijana' };

  var janaSheet = _ensureSheet('tbl_acara_jana',
    ['id_acara','no_acara','nama_acara','id_kategori','id_master','jenis',
     'guna_lorong','jenis_pendaftaran','min_ahli','max_ahli','format_acara','top_n_final','created_at',
     'kuota_ind_rumah','kuota_pasukan_rumah','ahli_utama','ahli_simpanan']);

  // cari no_acara terkini
  var existing = janaSheet.getDataRange().getValues();
  var maxNo = 0;
  for (var e = 1; e < existing.length; e++) {
    var n = parseInt((existing[e][1] || '0').toString().replace(/\D/g,''));
    if (n > maxNo) maxNo = n;
  }

  var created = [], skipped = [];
  var now = new Date();
  katArr.forEach(function(katId) {
    // semak duplikasi (id_master + id_kategori)
    for (var d = 1; d < existing.length; d++) {
      if (existing[d][4] === master.id && existing[d][3] === katId) {
        skipped.push(katId); return;
      }
    }
    maxNo++;
    var noAcara  = (maxNo < 10 ? '0' : '') + maxNo;
    var idAcara  = _uniqueId('ACR');
    var namaAcara = master.nama + ' (' + katId + ')';
    janaSheet.appendRow([
      idAcara, noAcara, namaAcara, katId, master.id,
      master.jenis, master.guna_lorong,
      master.jenis_pendaftaran, master.min_ahli, master.max_ahli,
      master.format_acara, master.top_n_final, now,
      master.kuota_ind_rumah, master.kuota_pasukan_rumah,
      master.ahli_utama, master.ahli_simpanan
    ]);
    created.push(katId);
  });

  return JSON.stringify({
    success : true,
    created : created.length,
    skipped : skipped.length,
    message : created.length + ' acara dijana' + (skipped.length ? ', ' + skipped.length + ' duplikasi dilangkau' : '')
  });
}

function janaSemuaAcara(payload) {
  var masterSheet = _sheet('tbl_acara_master');
  if (!masterSheet) return { success: false, message: 'tbl_acara_master tiada' };
  var mData = masterSheet.getDataRange().getValues();
  var totalCreated = 0, totalSkipped = 0;
  for (var i = 1; i < mData.length; i++) {
    if (!mData[i][0] || !_boolVal(mData[i][13])) continue; // skip inactive
    var res = janaAcara({ id_master: mData[i][0] });
    if (res.success) { totalCreated += res.created || 0; totalSkipped += res.skipped || 0; }
  }
  return JSON.stringify({ success: true, created: totalCreated, skipped: totalSkipped,
           message: totalCreated + ' acara dijana, ' + totalSkipped + ' dilangkau' });
}

function deleteAcara(payload) {
  if (!payload || !payload.id_acara) return { success: false, message: 'id_acara diperlukan' };
  var sheet = _sheet('tbl_acara_jana');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id_acara) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Acara jana tidak dijumpai' };
}

function deleteSemuaAcara() {
  var sheet = _sheet('tbl_acara_jana');
  if (!sheet) return { success: true, message: 'tbl_acara_jana tiada' };
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.deleteRows(2, lastRow - 1);
  return { success: true, message: 'Semua acara jana dipadam' };
}

// ── UNDIAN LORONG ─────────────────────────────────────────────────

function simpanLorong(payload) {
  if (!payload || !payload.id_heat || !payload.lorong) {
    return { success: false, message: 'id_heat dan lorong diperlukan' };
  }
  var sheet = _sheet('tbl_peserta_heat');
  if (!sheet) return { success: false, message: 'tbl_peserta_heat tiada' };
  var data  = sheet.getDataRange().getValues();
  var count = 0;
  payload.lorong.forEach(function(item) {
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === payload.id_heat && data[i][3] === item.no_kp) {
        sheet.getRange(i+1, 8).setValue(item.lorong);  // lorong[7] = col 8
        sheet.getRange(i+1, 9).setValue(item.giliran); // giliran[8] = col 9
        count++;
        break;
      }
    }
  });
  return { success: true, updated: count, message: count + ' lorong/giliran disimpan' };
}

// ══════════════════════════════════════════════════════════════════
// M4 — PENDAFTARAN: INDIVIDU + KUMPULAN (6 GATES EACH)
// ══════════════════════════════════════════════════════════════════

// ── HELPER: SEMAK UMUR ─────────────────────────────────────────────

function _hitungUmur(kp, tarikhSukan) {
  // Standard sukan sekolah Malaysia: umur = tahun_sukan - tahun_lahir (tahun sahaja)
  try {
    var yr2 = parseInt(kp.substring(0,2));
    // tahun: 00-24 = 2000+, 25-99 = 1900+
    var yr4 = yr2 <= 30 ? 2000 + yr2 : 1900 + yr2;
    var tahunSukan = tarikhSukan ? parseInt(tarikhSukan.substring(0,4)) : new Date().getFullYear();
    if (!tahunSukan || isNaN(tahunSukan)) return -1;
    return tahunSukan - yr4;
  } catch(e) {
    return -1;
  }
}

// ── PENDAFTARAN INDIVIDU ───────────────────────────────────────────
// tbl_pendaftaran: id_reg[0],id_acara[1],no_acara[2],nama_acara[3],
//   no_kp[4],id_rumah[5],id_kategori[6],nama_murid[7],
//   status[8],created_at[9],created_by[10]

function getPendaftaran(payload) {
  var sheet = _sheet('tbl_pendaftaran');
  if (!sheet) return JSON.stringify({ success: true, pendaftaran: [], total: 0 });
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    if (payload && payload.id_rumah && data[i][5] !== payload.id_rumah) continue;
    if (payload && payload.id_acara && data[i][1] !== payload.id_acara) continue;
    list.push({
      id_reg      : data[i][0],
      id_acara    : data[i][1],
      no_acara    : data[i][2],
      nama_acara  : data[i][3],
      no_kp       : data[i][4],
      id_rumah    : data[i][5],
      id_kategori : data[i][6],
      nama_murid  : data[i][7],
      status      : data[i][8] || 'AKTIF',
      created_at  : data[i][9] ? data[i][9].toString() : '',
      created_by  : data[i][10] ? data[i][10].toString() : ''
    });
  }
  return JSON.stringify({ success: true, pendaftaran: list, total: list.length });
}

function savePendaftaran(payload) {
  if (!payload || !payload.id_acara || !payload.no_kp) {
    return { success: false, message: 'id_acara dan no_kp diperlukan' };
  }

  var _sRaw = getSettings(); var settings = (typeof _sRaw==='string'?JSON.parse(_sRaw):_sRaw).data || {};
  var tarikhSukan = settings.tarikh_sukan || '';

  // ── GATE 1: Pendaftaran buka? ─────────────────────────────────
  if (settings.pendaftaran_buka === false) {
    return { success: false, message: 'Pendaftaran ditutup. Hubungi Admin.' };
  }

  // ── GATE 2: Semak acara — jenis_pendaftaran mesti INDIVIDU ────
  var acaraSheet = _sheet('tbl_acara_jana');
  var acara = null;
  if (acaraSheet) {
    var aData = acaraSheet.getDataRange().getValues();
    for (var a = 1; a < aData.length; a++) {
      if (aData[a][0] === payload.id_acara) {
        acara = {
          jenis_pendaftaran : (aData[a][7] || 'INDIVIDU').toUpperCase(),
          id_kategori       : aData[a][3],
          no_acara          : aData[a][1],
          nama_acara        : aData[a][2],
          kuota_ind_rumah   : parseInt(aData[a][13]) || 0
        };
        break;
      }
    }
  }
  if (!acara) return { success: false, message: 'Acara tidak dijumpai: ' + payload.id_acara };
  if (acara.jenis_pendaftaran === 'KUMPULAN') {
    return { success: false, message: 'Acara ini adalah acara KUMPULAN. Guna tab Pasukan/Relay.' };
  }

  // ── GATE 3: Lookup murid — verify wujud ──────────────────────
  var muridSheet = _sheet('tbl_murid');
  var murid = null;
  if (muridSheet) {
    var mData = muridSheet.getDataRange().getValues();
    for (var m = 1; m < mData.length; m++) {
      if (_normalizeKp(mData[m][1]) === _normalizeKp(payload.no_kp)) {
        murid = {
          id_rumah     : mData[m][3],
          id_kategori  : mData[m][4],
          jantina      : mData[m][5],
          nama         : mData[m][2],
          no_kp        : mData[m][1]
        };
        break;
      }
    }
  }
  if (!murid) return { success: false, message: 'Murid tidak dijumpai dalam sistem.' };

  // ── GATE 4: Murid mesti dari rumah yang sama ──────────────────
  if (payload.id_rumah && murid.id_rumah && murid.id_rumah !== payload.id_rumah) {
    return { success: false, message: 'Murid ini bukan dari rumah anda.' };
  }

  // ── GATE 5: Semak umur (MSS standard) ────────────────────────
  var katSheet = _sheet('tbl_kategori');
  if (katSheet) {
    var kData = katSheet.getDataRange().getValues();
    for (var k = 1; k < kData.length; k++) {
      if (kData[k][0] === acara.id_kategori || kData[k][1] === acara.id_kategori) {
        var umin  = parseInt(kData[k][4]) || 7;
        var umax  = parseInt(kData[k][5]) || 15;
        var jantKat = (kData[k][3] || 'L').toUpperCase();
        // semak jantina
        if (jantKat && murid.jantina && murid.jantina.toUpperCase() !== jantKat) {
          return { success: false, message: 'Jantina murid tidak sepadan dengan kategori acara.' };
        }
        // semak umur
        if (tarikhSukan) {
          var umur = _hitungUmur(murid.no_kp, tarikhSukan);
          if (umur >= 0 && (umur < umin || umur > umax)) {
            return { success: false, message: 'Umur murid (' + umur + ' tahun) tidak layak untuk kategori ini (had: ' + umin + '-' + umax + ' tahun).' };
          }
        }
        break;
      }
    }
  }

  // ── GATE 6: Semak kuota individu (dari acara → fallback kategori) ──
  var pdSheet = _ensureSheet('tbl_pendaftaran',
    ['id_reg','id_acara','no_acara','nama_acara','no_kp','id_rumah',
     'id_kategori','nama_murid','status','created_at','created_by']);
  var pdData    = pdSheet.getDataRange().getValues();
  // Kuota dari tbl_acara_jana[13] kuota_ind_rumah (dinamik per acara)
  var kuotaMax = acara.kuota_ind_rumah && acara.kuota_ind_rumah > 0
    ? acara.kuota_ind_rumah : 0;
  if (!kuotaMax && katSheet) {
    // Fallback: guna kuota_individu dari tbl_kategori
    var kd2 = katSheet.getDataRange().getValues();
    for (var k2 = 1; k2 < kd2.length; k2++) {
      if (kd2[k2][0] === acara.id_kategori) { kuotaMax = parseInt(kd2[k2][6]) || 2; break; }
    }
  }
  if (!kuotaMax) kuotaMax = 2; // absolute fallback
  var sudahDaftar = 0;
  for (var p = 1; p < pdData.length; p++) {
    if (pdData[p][1] === payload.id_acara &&
        pdData[p][5] === murid.id_rumah &&
        pdData[p][8] === 'AKTIF') {
      sudahDaftar++;
    }
    // semak duplikasi murid
    if (pdData[p][1] === payload.id_acara &&
        _normalizeKp(pdData[p][4]) === _normalizeKp(payload.no_kp) &&
        pdData[p][8] === 'AKTIF') {
      return { success: false, message: 'Murid sudah didaftarkan untuk acara ini.' };
    }
  }
  if (sudahDaftar >= kuotaMax) {
    return { success: false, message: 'Kuota penuh (' + sudahDaftar + '/' + kuotaMax + ') untuk acara ini.' };
  }

  // ── GATE 6b: Semak nama pasukan duplikasi ──────────────────────
  var namaPasukanBaru = (payload.nama_pasukan || '').trim().toUpperCase();
  if (namaPasukanBaru) {
    for (var pd3 = 1; pd3 < kData.length; pd3++) {
      if (kData[pd3][1] === payload.id_acara &&
          kData[pd3][4] === payload.id_rumah &&
          kData[pd3][9] === 'AKTIF' &&
          (kData[pd3][6] || '').trim().toUpperCase() === namaPasukanBaru) {
        return { success: false, message: 'Nama pasukan "' + payload.nama_pasukan + '" sudah wujud. Guna nama lain (cth: MERAH B).' };
      }
    }
  }

  // ── SIMPAN ────────────────────────────────────────────────────
  var id = _uniqueId('REG');
  pdSheet.appendRow([
    id,
    payload.id_acara,
    acara.no_acara,
    acara.nama_acara,
    murid.no_kp,
    murid.id_rumah,
    acara.id_kategori,
    murid.nama,
    'AKTIF',
    new Date(),
    payload.created_by || ''
  ]);
  return JSON.stringify({ success: true, id_reg: id, message: 'Pendaftaran berjaya.' });
}

function deletePendaftaran(payload) {
  if (!payload || !payload.id_reg) return { success: false, message: 'id_reg diperlukan' };
  // semak pendaftaran buka
  var _s = getSettings(); var settings = (typeof _s==='string'?JSON.parse(_s):_s).data || {};
  if (settings.pendaftaran_buka === false) {
    return { success: false, message: 'Pendaftaran ditutup — tidak boleh batal.' };
  }
  var sheet = _sheet('tbl_pendaftaran');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id_reg) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Rekod tidak dijumpai' };
}

// ── PENDAFTARAN KUMPULAN ───────────────────────────────────────────
// tbl_pendaftaran_kumpulan: id_kumpulan[0],id_acara[1],no_acara[2],
//   nama_acara[3],id_rumah[4],id_kategori[5],nama_pasukan[6],
//   ahli_json[7],bilangan_ahli[8],status[9],created_at[10],created_by[11]

function getKumpulan(payload) {
  var sheet = _sheet('tbl_pendaftaran_kumpulan');
  if (!sheet) return JSON.stringify({ success: true, kumpulan: [], total: 0 });
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    if (payload && payload.id_rumah && data[i][4] !== payload.id_rumah) continue;
    var ahli = data[i][7];
    try   { ahli = typeof ahli === 'string' ? JSON.parse(ahli) : ahli; }
    catch (e) { ahli = []; }
    list.push({
      id_kumpulan   : data[i][0],
      id_acara      : data[i][1],
      no_acara      : data[i][2],
      nama_acara    : data[i][3],
      id_rumah      : data[i][4],
      id_kategori   : data[i][5],
      nama_pasukan  : data[i][6],
      ahli_json     : ahli,
      bilangan_ahli : data[i][8],
      status        : data[i][9] || 'AKTIF',
      created_at    : data[i][10] ? data[i][10].toString() : '',
      created_by    : data[i][11] ? data[i][11].toString() : ''
    });
  }
  return JSON.stringify({ success: true, kumpulan: list, total: list.length });
}

function saveKumpulan(payload) {
  if (!payload || !payload.id_acara || !payload.id_rumah) {
    return { success: false, message: 'id_acara dan id_rumah diperlukan' };
  }

  var _sRaw = getSettings(); var settings = (typeof _sRaw==='string'?JSON.parse(_sRaw):_sRaw).data || {};
  var tarikhSukan = settings.tarikh_sukan || '';

  // ── GATE 1: Pendaftaran buka? ─────────────────────────────────
  if (settings.pendaftaran_buka === false) {
    return { success: false, message: 'Pendaftaran ditutup. Hubungi Admin.' };
  }

  // ── GATE 2: Semak acara — jenis_pendaftaran mesti KUMPULAN ───
  // Build masterMap dari tbl_acara_master (sumber kebenaran jenis_pendaftaran)
  var masterMapG2 = {};
  var mSheetG2 = _sheet('tbl_acara_master');
  if (mSheetG2) {
    var mDataG2 = mSheetG2.getDataRange().getValues();
    for (var mg2 = 1; mg2 < mDataG2.length; mg2++) {
      if (mDataG2[mg2][0]) {
        masterMapG2[mDataG2[mg2][0]] = (mDataG2[mg2][6] || '').toString().trim().toUpperCase();
      }
    }
  }
  var acaraSheet = _sheet('tbl_acara_jana');
  var acara = null;
  if (acaraSheet) {
    var aData = acaraSheet.getDataRange().getValues();
    for (var a = 1; a < aData.length; a++) {
      if (aData[a][0] === payload.id_acara) {
        // Keutamaan: masterMap → min_ahli → nilai sheet → INDIVIDU
        var jPendG2 = masterMapG2[aData[a][4]]
          || (parseInt(aData[a][8]) >= 2 ? 'KUMPULAN' : '')
          || (aData[a][7] || '').toString().trim().toUpperCase()
          || 'INDIVIDU';
        if (jPendG2 === 'UNDEFINED') jPendG2 = 'INDIVIDU';
        acara = {
          jenis_pendaftaran    : jPendG2,
          id_kategori          : aData[a][3],
          no_acara             : aData[a][1],
          nama_acara           : aData[a][2],
          min_ahli             : parseInt(aData[a][8])  || 4,
          max_ahli             : parseInt(aData[a][9])  || 4,
          kuota_pasukan_rumah  : parseInt(aData[a][14]) || 0,
          ahli_utama           : isNaN(parseInt(aData[a][15])) ? 4 : parseInt(aData[a][15]),
          ahli_simpanan        : parseInt(aData[a][16]) || 0
        };
        break;
      }
    }
  }
  if (!acara) return { success: false, message: 'Acara tidak dijumpai: ' + payload.id_acara };
  if (acara.jenis_pendaftaran !== 'KUMPULAN') {
    return { success: false, message: 'Acara ini adalah acara INDIVIDU. Guna tab Individu.' };
  }

  // ── GATE 3: Validate ahli utama + simpanan ──────────────────
  var ahli = payload.ahli_json;
  if (typeof ahli === 'string') { try { ahli = JSON.parse(ahli); } catch(e) { ahli = []; } }
  if (!Array.isArray(ahli) || ahli.length === 0) {
    return { success: false, message: 'Senarai ahli diperlukan.' };
  }
  // Kira utama vs simpanan
  var ahliUtama    = ahli.filter(function(a){ return a.status !== 'SIMPANAN'; });
  var ahliSimpanan = ahli.filter(function(a){ return a.status === 'SIMPANAN'; });
  var minUtama = acara.ahli_utama > 0 ? acara.ahli_utama : acara.min_ahli;
  var maxSimpanan = acara.ahli_simpanan || 0;
  if (ahliUtama.length < minUtama) {
    return { success: false, message: 'Ahli utama kurang. Diperlukan: ' + minUtama + ' orang.' };
  }
  if (ahliUtama.length > minUtama) {
    return { success: false, message: 'Ahli utama melebihi had. Maksimum: ' + minUtama + ' orang.' };
  }
  if (ahliSimpanan.length > maxSimpanan) {
    return { success: false, message: 'Ahli simpanan melebihi had. Maksimum: ' + maxSimpanan + ' orang.' };
  }

  // ── GATE 4: Semak setiap ahli — rumah, jantina, umur ─────────
  var muridSheet = _sheet('tbl_murid');
  var katSheet   = _sheet('tbl_kategori');
  var jantKat = 'L', umin = 7, umax = 15;
  if (katSheet) {
    var kd = katSheet.getDataRange().getValues();
    for (var k = 1; k < kd.length; k++) {
      if (kd[k][0] === acara.id_kategori || kd[k][1] === acara.id_kategori) {
        jantKat = (kd[k][3] || 'L').toUpperCase();
        umin    = parseInt(kd[k][4]) || 7;
        umax    = parseInt(kd[k][5]) || 15;
        break;
      }
    }
  }
  if (muridSheet) {
    var mAll = muridSheet.getDataRange().getValues();
    for (var ai = 0; ai < ahli.length; ai++) {
      var ahliKp = _normalizeKp(ahli[ai].no_kp || '');
      var found  = false;
      for (var mi = 1; mi < mAll.length; mi++) {
        if (_normalizeKp(mAll[mi][1]) === ahliKp) {
          found = true;
          // semak rumah
          if (mAll[mi][3] !== payload.id_rumah) {
            return { success: false, message: 'Ahli "' + (ahli[ai].nama || ahliKp) + '" bukan dari rumah ini.' };
          }
          // semak jantina
          if (jantKat && mAll[mi][5] && mAll[mi][5].toUpperCase() !== jantKat) {
            return { success: false, message: 'Ahli "' + (ahli[ai].nama || ahliKp) + '" — jantina tidak sepadan dengan kategori.' };
          }
          // semak umur
          if (tarikhSukan) {
            var umur = _hitungUmur(ahliKp, tarikhSukan);
            if (umur >= 0 && (umur < umin || umur > umax)) {
              return { success: false, message: 'Ahli "' + (ahli[ai].nama || ahliKp) + '" — umur (' + umur + ' tahun) tidak layak (had: ' + umin + '-' + umax + ').' };
            }
          }
          break;
        }
      }
      if (!found) return { success: false, message: 'Ahli "' + (ahli[ai].nama || ahliKp) + '" tidak dijumpai dalam sistem.' };
    }
  }

  // ── GATE 5: Semak kuota kumpulan (dari acara → fallback kategori) ──
  var kSheet = _ensureSheet('tbl_pendaftaran_kumpulan',
    ['id_kumpulan','id_acara','no_acara','nama_acara','id_rumah','id_kategori',
     'nama_pasukan','ahli_json','bilangan_ahli','status','created_at','created_by']);
  var kData = kSheet.getDataRange().getValues();
  // Kuota dari tbl_acara_jana[14] kuota_pasukan_rumah (dinamik per acara)
  var kuotaKump = acara.kuota_pasukan_rumah && acara.kuota_pasukan_rumah > 0
    ? acara.kuota_pasukan_rumah : 0;
  if (!kuotaKump && katSheet) {
    var kd2 = katSheet.getDataRange().getValues();
    for (var k2 = 1; k2 < kd2.length; k2++) {
      if (kd2[k2][0] === acara.id_kategori) { kuotaKump = parseInt(kd2[k2][7]) || 1; break; }
    }
  }
  if (!kuotaKump) kuotaKump = 1;
  var sudahKump = 0;
  for (var pd = 1; pd < kData.length; pd++) {
    if (kData[pd][1] === payload.id_acara && kData[pd][4] === payload.id_rumah && kData[pd][9] === 'AKTIF') {
      sudahKump++;
    }
  }
  if (sudahKump >= kuotaKump) {
    return { success: false, message: 'Kuota pasukan penuh (' + sudahKump + '/' + kuotaKump + ').' };
  }

  // ── GATE 6: Semak duplikasi ahli dalam acara yang sama ────────
  for (var pd2 = 1; pd2 < kData.length; pd2++) {
    if (kData[pd2][1] !== payload.id_acara || kData[pd2][9] !== 'AKTIF') continue;
    var ahliSedia = kData[pd2][7];
    try { ahliSedia = JSON.parse(ahliSedia); } catch(e) { ahliSedia = []; }
    if (!Array.isArray(ahliSedia)) continue;
    var kpSedia = ahliSedia.map(function(x){ return _normalizeKp(x.no_kp||''); });
    for (var ai2 = 0; ai2 < ahli.length; ai2++) {
      if (kpSedia.indexOf(_normalizeKp(ahli[ai2].no_kp||'')) !== -1) {
        return { success: false, message: 'Ahli "' + ahli[ai2].nama + '" sudah didaftarkan dalam pasukan lain untuk acara ini.' };
      }
    }
  }

  // ── SIMPAN ────────────────────────────────────────────────────
  var id       = _uniqueId('KMP');
  var ahliStr  = JSON.stringify(ahli);
  kSheet.appendRow([
    id,
    payload.id_acara,
    acara.no_acara,
    acara.nama_acara,
    payload.id_rumah,
    acara.id_kategori,
    payload.nama_pasukan || ('Pasukan ' + payload.id_rumah),
    ahliStr,
    ahli.length,
    'AKTIF',
    new Date(),
    payload.created_by || ''
  ]);
  return JSON.stringify({ success: true, id_kumpulan: id, message: 'Pasukan berjaya didaftarkan.' });
}

function deleteKumpulan(payload) {
  if (!payload || !payload.id_kumpulan) return { success: false, message: 'id_kumpulan diperlukan' };
  var _sk = getSettings(); var settings = (typeof _sk==='string'?JSON.parse(_sk):_sk).data || {};
  if (settings.pendaftaran_buka === false) {
    return { success: false, message: 'Pendaftaran ditutup — tidak boleh batal.' };
  }
  var sheet = _sheet('tbl_pendaftaran_kumpulan');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id_kumpulan) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Rekod tidak dijumpai' };
}

// ══════════════════════════════════════════════════════════════════
// M5 — HEAT, KEPUTUSAN, MEDAL TALLY
// ══════════════════════════════════════════════════════════════════

// ── HEAT ───────────────────────────────────────────────────────────
// tbl_heat: id_heat[0],id_acara[1],jenis[2],no_heat[3],status[4],
//   tarikh[5],masa_mula[6],catatan[7],created_at[8]

function getHeat(payload) {
  var sheet = _sheet('tbl_heat');
  if (!sheet) return JSON.stringify({ success: true, heat: [], peserta: [], total: 0 });
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    if (payload && payload.id_acara && data[i][1] !== payload.id_acara) continue;
    list.push({
      id_heat    : data[i][0],
      id_acara   : data[i][1],
      jenis      : data[i][2],
      no_heat    : data[i][3],
      status     : data[i][4] || 'BELUM',
      tarikh     : data[i][5],
      masa_mula  : data[i][6],
      catatan    : data[i][7],
      created_at : data[i][8] ? data[i][8].toString() : ''
    });
  }
  // Ambil peserta juga
  var pSheet = _sheet('tbl_peserta_heat');
  var pList = [];
  if (pSheet) {
    var pData = pSheet.getDataRange().getValues();
    for (var p = 1; p < pData.length; p++) {
      if (!pData[p][0]) continue;
      if (payload && payload.id_acara && pData[p][2] !== payload.id_acara) continue;
      pList.push({
        id: pData[p][0], id_heat: pData[p][1], id_acara: pData[p][2],
        no_kp: pData[p][3], nama: pData[p][4], id_rumah: pData[p][5],
        id_kategori: pData[p][6], lorong: pData[p][7], giliran: pData[p][8],
        status: pData[p][9]||'AKTIF', source: pData[p][10]
      });
    }
  }
  return JSON.stringify({ success: true, heat: list, heats: list, peserta: pList, total: list.length });
}

function janaHeat(payload) {
  if (!payload || !payload.id_acara) return { success: false, message: 'id_acara diperlukan' };
  var pdSheet = _sheet('tbl_pendaftaran');
  var kmSheet = _sheet('tbl_pendaftaran_kumpulan');
  var aSheet  = _sheet('tbl_acara_jana');
  if (!aSheet) return { success: false, message: 'tbl_acara_jana tiada' };

  // baca acara — guna masterMap untuk jenis_pendaftaran (sama seperti getAcaraJana)
  var masterMapJH = {};
  var mSheetJH = _sheet('tbl_acara_master');
  if (mSheetJH) {
    var mDataJH = mSheetJH.getDataRange().getValues();
    for (var mj = 1; mj < mDataJH.length; mj++) {
      if (mDataJH[mj][0]) masterMapJH[mDataJH[mj][0]] = (mDataJH[mj][6]||'INDIVIDU').toUpperCase();
    }
  }
  var aData = aSheet.getDataRange().getValues();
  var acara = null;
  for (var a = 1; a < aData.length; a++) {
    if (aData[a][0] === payload.id_acara) {
      var jPendJH = masterMapJH[aData[a][4]]
        || (parseInt(aData[a][8]) >= 2 ? 'KUMPULAN' : '')
        || (aData[a][7]||'').toString().trim().toUpperCase()
        || 'INDIVIDU';
      acara = { format_acara: (aData[a][10]||'TERUS_FINAL').toUpperCase(),
                top_n_final: parseInt(aData[a][11])||8,
                jenis_pendaftaran: jPendJH };
      break;
    }
  }

  if (!acara) return { success: false, message: 'Acara tidak dijumpai' };

  // kumpul peserta
  var pesertaList = [];
  if (acara.jenis_pendaftaran === 'INDIVIDU' && pdSheet) {
    var pdData = pdSheet.getDataRange().getValues();
    for (var p = 1; p < pdData.length; p++) {
      if (pdData[p][1] === payload.id_acara && pdData[p][8] === 'AKTIF') {
        pesertaList.push({ no_kp: pdData[p][4], nama: pdData[p][7], id_rumah: pdData[p][5], id_kategori: pdData[p][6], source: 'INDIVIDU' });
      }
    }
  } else if (kmSheet) {
    var kmData = kmSheet.getDataRange().getValues();
    for (var k = 1; k < kmData.length; k++) {
      if (kmData[k][1] === payload.id_acara && kmData[k][9] === 'AKTIF') {
        pesertaList.push({ no_kp: kmData[k][0], nama: kmData[k][6], id_rumah: kmData[k][4], id_kategori: kmData[k][5], source: 'KUMPULAN' });
      }
    }
  }
  if (!pesertaList.length) return { success: false, message: 'Tiada peserta didaftarkan untuk acara ini' };

  var lorong = parseInt(getSetting('lorong_trek')) || 6;
  var heatSheet = _ensureSheet('tbl_heat',
    ['id_heat','id_acara','jenis','no_heat','status','tarikh','masa_mula','catatan','created_at']);
    // Padam peserta heat lama untuk acara ini sebelum jana semula
  var phOld = _sheet('tbl_peserta_heat');
  if (phOld) {
    var phData = phOld.getDataRange().getValues();
    for (var pd = phData.length - 1; pd >= 1; pd--) {
      if (phData[pd][2] === payload.id_acara) phOld.deleteRow(pd + 1);
    }
  }
  // Void heat lama
  var htOld = _sheet('tbl_heat');
  if (htOld) {
    var htData = htOld.getDataRange().getValues();
    for (var hd = 1; hd < htData.length; hd++) {
      if (htData[hd][1] === payload.id_acara && htData[hd][4] !== 'SELESAI') {
        htOld.getRange(hd + 1, 5).setValue('VOID');
      }
    }
  }
  var phSheet   = _ensureSheet('tbl_peserta_heat',
    ['id','id_heat','id_acara','no_kp','nama','id_rumah','id_kategori','lorong','giliran','status','source','created_at']);

  var jenisHeat = 'SARINGAN';
  if (acara.format_acara === 'TERUS_FINAL') jenisHeat = 'FINAL';

  // bahagi kepada heats
  var bilanganHeat = Math.ceil(pesertaList.length / lorong);
  var now = new Date();
  var created = 0;

  for (var h = 0; h < bilanganHeat; h++) {
    var idHeat    = _uniqueId('HT');
    var noHeat    = h + 1;
    heatSheet.appendRow([idHeat, payload.id_acara, jenisHeat, noHeat, 'BELUM', payload.tarikh||'', payload.masa_mula||'', '', now]);

    var slice     = pesertaList.slice(h * lorong, (h + 1) * lorong);
    // random lorong assignment
    var lorongArr = [];
    for (var l = 1; l <= slice.length; l++) lorongArr.push(l);
    lorongArr.sort(function(){ return Math.random() - 0.5; });

    for (var s = 0; s < slice.length; s++) {
      var p2 = slice[s];
      phSheet.appendRow([
        _uniqueId('PH'), idHeat, payload.id_acara,
        p2.no_kp, p2.nama, p2.id_rumah, p2.id_kategori,
        lorongArr[s], s + 1, 'AKTIF', p2.source, now
      ]);
    }
    created++;
  }
  return JSON.stringify({ success: true, heat_created: created, peserta: pesertaList.length, format_used: jenisHeat, message: created + ' heat dijana' });
}

function updateHeatStatus(payload) {
  if (!payload || !payload.id_heat || !payload.status) return { success: false, message: 'id_heat dan status diperlukan' };
  var sheet = _sheet('tbl_heat');
  if (!sheet) return { success: false };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id_heat) {
      sheet.getRange(i+1, 5).setValue(payload.status); // status[4] = col 5
      return { success: true };
    }
  }
  return { success: false, message: 'Heat tidak dijumpai' };
}

function getPesertaHeat(payload) {
  if (!payload || !payload.id_heat) return { success: false, message: 'id_heat diperlukan' };
  var sheet = _sheet('tbl_peserta_heat');
  if (!sheet) return JSON.stringify({ success: true, peserta: [], total: 0 });
  var data  = sheet.getDataRange().getValues();
  var list  = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0] || data[i][1] !== payload.id_heat) continue;
    list.push({
      id          : data[i][0],
      id_heat     : data[i][1],
      id_acara    : data[i][2],
      no_kp       : data[i][3],
      nama        : data[i][4],
      id_rumah    : data[i][5],
      id_kategori : data[i][6],
      lorong      : data[i][7],
      giliran     : data[i][8],
      status      : data[i][9] || 'AKTIF',
      source      : data[i][10],
      created_at  : data[i][11] ? data[i][11].toString() : ''
    });
  }
  list.sort(function(a,b){ return (a.lorong||a.giliran||0) - (b.lorong||b.giliran||0); });
  return JSON.stringify({ success: true, peserta: list, total: list.length });
}

// ── KEPUTUSAN ──────────────────────────────────────────────────────
// tbl_keputusan: id[0],id_heat[1],id_acara[2],no_kp[3],nama[4],
//   id_rumah[5],id_kategori[6],jenis[7],prestasi[8],unit[9],
//   kedudukan[10],layak_final[11],catatan[12],status[13],created_at[14]

// ════════════════════════════════════════
// UPDATE: saveKeputusan — composite key fix
// ════════════════════════════════════════
function saveKeputusan(payload) {
  try {
    var p = (typeof payload === "string") ? JSON.parse(payload) : payload;
    var sh = _sheet('tbl_keputusan');
    if (!sh) return JSON.stringify({success:false, message:"tbl_keputusan tidak dijumpai"});

    var data = sh.getDataRange().getValues();
    var headers = data[0];
    var idIdx     = headers.indexOf("id");
    var idHeatIdx = headers.indexOf("id_heat");
    var noKpIdx   = headers.indexOf("no_kp");

    // Cari baris sedia ada: id_heat + no_kp
    var existRow = -1;
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][idHeatIdx]) === String(p.id_heat) &&
          String(data[i][noKpIdx])   === String(p.no_kp)) {
        existRow = i + 1;
        break;
      }
    }

    // Kolum yang JANGAN dioverwrite masa update
    var skipOnUpdate = ['id','created_at','entered_at','entered_by'];

    if (existRow > 0) {
      // UPDATE — kemaskini kolum yang ada dalam payload sahaja
      headers.forEach(function(h, colIdx) {
        if (skipOnUpdate.indexOf(h) > -1) return;
        if (p[h] !== undefined) {
          sh.getRange(existRow, colIdx + 1).setValue(p[h]);
        }
      });
    } else {
      // INSERT baru — bina row lengkap
      var rowData = headers.map(function(h) {
        if (h === 'id')         return p.id || _uniqueId('KPT');
        if (h === 'created_at') return new Date();
        if (h === 'status')     return p.status || 'DRAFT';
        return p[h] !== undefined ? p[h] : '';
      });
      sh.appendRow(rowData);
    }

    return JSON.stringify({success: true, message: "Keputusan disimpan"});
  } catch(e) {
    Logger.log('saveKeputusan error: ' + e);
    return JSON.stringify({success: false, message: e.toString()});
  }
}

function getKeputusan(payload) {
  var sheet = _sheet('tbl_keputusan');
  if (!sheet) return JSON.stringify({ success: true, keputusan: [] });
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    if (payload && payload.id_acara && data[i][2] !== payload.id_acara) continue;
    if (payload && payload.id_heat  && data[i][1] !== payload.id_heat)  continue;
    list.push({
      id           : data[i][0],
      id_heat      : data[i][1],
      id_acara     : data[i][2],
      no_kp        : data[i][3],
      nama         : data[i][4],
      id_rumah     : data[i][5],
      id_kategori  : data[i][6],
      jenis        : data[i][7],
      prestasi     : data[i][8],
      unit         : data[i][9],
      kedudukan    : data[i][10],
      layak_final  : _boolVal(data[i][11]),
      catatan      : data[i][12],
      status       : data[i][13] || 'DRAFT',
      created_at   : data[i][14] ? data[i][14].toString() : ''
    });
  }
  return JSON.stringify({ success: true, keputusan: list });
}

function prosesLayakFinal(payload) {
  if (!payload || !payload.id_acara) return { success: false, message: 'id_acara diperlukan' };
  var aSheet = _sheet('tbl_acara_jana');
  var topN   = 8;
  if (aSheet) {
    var aData = aSheet.getDataRange().getValues();
    for (var a = 1; a < aData.length; a++) {
      if (aData[a][0] === payload.id_acara) { topN = parseInt(aData[a][11]) || 8; break; }
    }
  }
  var sheet = _sheet('tbl_keputusan');
  if (!sheet) return { success: false };
  var data  = sheet.getDataRange().getValues();
  // kumpul semua keputusan SARINGAN untuk acara ini
  var saringan = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] === payload.id_acara && data[i][7] === 'SARINGAN' && data[i][13] === 'DISAHKAN') {
      saringan.push({ row: i, kedudukan: parseInt(data[i][10]) || 99, no_kp: data[i][3] });
    }
  }
  saringan.sort(function(a,b){ return a.kedudukan - b.kedudukan; });
  var layakKp = saringan.slice(0, topN).map(function(x){ return x.no_kp; });
  var updated = 0;
  for (var i2 = 1; i2 < data.length; i2++) {
    if (data[i2][2] === payload.id_acara && data[i2][7] === 'SARINGAN') {
      var layak = layakKp.indexOf(data[i2][3]) !== -1;
      sheet.getRange(i2+1, 12).setValue(layak);
      updated++;
    }
  }
  return { success: true, layak: layakKp.length, updated: updated };
}

function publishKeputusan(payload) {
  if (!payload || !payload.id_acara) return { success: false, message: 'id_acara diperlukan' };
  var sheet = _sheet('tbl_keputusan');
  if (!sheet) return { success: false };
  var data  = sheet.getDataRange().getValues();
  // cari keputusan FINAL yang DISAHKAN
  var finalList = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] === payload.id_acara && data[i][7] === 'FINAL' && data[i][13] === 'DISAHKAN') {
      finalList.push({ row: i, no_kp: data[i][3], nama: data[i][4], id_rumah: data[i][5],
                       id_kategori: data[i][6], prestasi: data[i][8], unit: data[i][9],
                       kedudukan: parseInt(data[i][10]) || 0 });
    }
  }
  if (!finalList.length) return { success: false, message: 'Tiada keputusan FINAL DISAHKAN untuk acara ini' };

  var _sp = getSettings(); var settings = (typeof _sp==='string'?JSON.parse(_sp):_sp).data || {};
  var mataArr  = [
    parseInt(settings.mata_1) || 5,
    parseInt(settings.mata_2) || 3,
    parseInt(settings.mata_3) || 2,
    parseInt(settings.mata_4) || 1,
    parseInt(settings.mata_5) || 0,
    parseInt(settings.mata_6) || 0
  ];

  var akhirSheet = _ensureSheet('tbl_keputusan_akhir',
    ['id','id_acara','no_kp','nama','id_rumah','id_kategori',
     'prestasi','unit','kedudukan','mata','status','created_at']);
  // padam rekod lama untuk acara ini
  var akhirData = akhirSheet.getDataRange().getValues();
  for (var ad = akhirData.length - 1; ad >= 1; ad--) {
    if (akhirData[ad][1] === payload.id_acara) akhirSheet.deleteRow(ad + 1);
  }

  var now = new Date();
  finalList.forEach(function(f) {
    var mata = mataArr[Math.min(f.kedudukan - 1, mataArr.length - 1)] || 0;
    akhirSheet.appendRow([
      _uniqueId('KA'), payload.id_acara, f.no_kp, f.nama, f.id_rumah, f.id_kategori,
      f.prestasi, f.unit, f.kedudukan, mata, 'PUBLISHED', now
    ]);
    // tandakan PUBLISHED dalam tbl_keputusan
    sheet.getRange(f.row + 1, 14).setValue('PUBLISHED');
  });

  // kemaskini medal tally dalam tbl_rumah_sukan
  _updateMedalTally();

  return { success: true, published: finalList.length, message: finalList.length + ' keputusan dipublish' };
}

function _updateMedalTally() {
  var akhirSheet = _sheet('tbl_keputusan_akhir');
  var rumahSheet = _sheet('tbl_rumah_sukan');
  if (!akhirSheet || !rumahSheet) return;

  var akhirData = akhirSheet.getDataRange().getValues();
  var tally = {};
  for (var i = 1; i < akhirData.length; i++) {
    if (!akhirData[i][0]) continue;
    var rId = akhirData[i][4];
    var ked = parseInt(akhirData[i][8]) || 0;
    var mat = parseInt(akhirData[i][9]) || 0;
    if (!tally[rId]) tally[rId] = { emas:0, perak:0, gangsa:0, keempat:0, mata:0 };
    if (ked === 1) tally[rId].emas++;
    else if (ked === 2) tally[rId].perak++;
    else if (ked === 3) tally[rId].gangsa++;
    else if (ked === 4) tally[rId].keempat++;
    tally[rId].mata += mat;
  }
  var rumahData = rumahSheet.getDataRange().getValues();
  for (var r = 1; r < rumahData.length; r++) {
    if (!rumahData[r][0]) continue;
    var rId2 = rumahData[r][0];
    var t    = tally[rId2] || { emas:0, perak:0, gangsa:0, keempat:0, mata:0 };
    rumahSheet.getRange(r+1, 6, 1, 5).setValues([[t.emas, t.perak, t.gangsa, t.keempat, t.mata]]);
  }
}

function getMedalTally() {
  var sheet = _sheet('tbl_rumah_sukan');
  if (!sheet) return JSON.stringify({ success: true, tally: [] });
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    list.push({
      id         : data[i][0],
      nama       : data[i][1],
      warna      : data[i][2],
      warna_teks : data[i][3],
      emas       : parseInt(data[i][5])  || 0,
      perak      : parseInt(data[i][6])  || 0,
      gangsa     : parseInt(data[i][7])  || 0,
      keempat    : parseInt(data[i][8])  || 0,
      mata       : parseInt(data[i][9])  || 0
    });
  }
  list.sort(function(a,b){
    if (b.emas !== a.emas) return b.emas - a.emas;
    if (b.perak !== a.perak) return b.perak - a.perak;
    return b.mata - a.mata;
  });
  return JSON.stringify({ success: true, tally: list });
}

function getPublishedResults(payload) {
  var sheet = _sheet('tbl_keputusan_akhir');
  if (!sheet) return JSON.stringify({ success: true, results: [], total: 0 });
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    if (payload && payload.id_acara && data[i][1] !== payload.id_acara) continue;
    list.push({
      id          : data[i][0],
      id_acara    : data[i][1],
      no_kp       : data[i][2],
      nama        : data[i][3],
      id_rumah    : data[i][4],
      id_kategori : data[i][5],
      prestasi    : data[i][6],
      unit        : data[i][7],
      kedudukan   : data[i][8],
      mata        : data[i][9],
      status      : data[i][10],
      created_at  : data[i][11] ? data[i][11].toString() : ''
    });
  }
  return { success: true, results: list, total: list.length };
}

// ── DASHBOARD ──────────────────────────────────────────────────────

function getDashboardStats() {
  var muridTotal = 0, acaraTotal = 0, heatSelesai = 0, published = 0;
  var s;
  s = _sheet('tbl_murid');
  if (s) muridTotal = Math.max(0, s.getLastRow() - 1);
  s = _sheet('tbl_acara_jana');
  if (s) acaraTotal = Math.max(0, s.getLastRow() - 1);
  s = _sheet('tbl_heat');
  if (s) {
    var hd = s.getDataRange().getValues();
    for (var i = 1; i < hd.length; i++) {
      if (hd[i][4] === 'SELESAI') heatSelesai++;
    }
  }
  s = _sheet('tbl_keputusan_akhir');
  if (s) published = Math.max(0, s.getLastRow() - 1);
  var statsData = { murid: muridTotal, acara: acaraTotal, heat_selesai: heatSelesai, published: published,
    reg: 0, pendaftaran: 0, lorong: 0, users: 0, keputusan: published };
  // hitung reg / pendaftaran
  var rs = _sheet('tbl_pendaftaran');
  if (rs) { statsData.reg = Math.max(0, rs.getLastRow() - 1); statsData.pendaftaran = statsData.reg; }
  // hitung users aktif
  var us = _sheet('tbl_users');
  if (us) {
    var ud = us.getDataRange().getValues();
    var uc = 0;
    for (var ui = 1; ui < ud.length; ui++) { if (_boolVal(ud[ui][7])) uc++; }
    statsData.users = uc;
  }
  // lorong dari settings
  var setSheet = _sheet('tbl_settings');
  if (setSheet) {
    var sd = setSheet.getDataRange().getValues();
    for (var si = 1; si < sd.length; si++) {
      if (sd[si][0] === 'lorong_trek') { statsData.lorong = parseInt(sd[si][1]) || 6; break; }
    }
  }
  // rumah sukan stats
  var rumahStats = [];
  var rmSheet = _sheet('tbl_rumah_sukan');
  if (rmSheet) {
    var rmData = rmSheet.getDataRange().getValues();
    for (var ri = 1; ri < rmData.length; ri++) {
      if (!rmData[ri][0]) continue;
      rumahStats.push({ id_rumah: rmData[ri][0], nama: rmData[ri][1], warna: rmData[ri][3] || '#6B7280', mata: 0 });
    }
  }
  return JSON.stringify({ success: true, data: statsData, rumah: rumahStats });
}

function getDashboardOps() {
  return getDashboardStats();
}

// ══════════════════════════════════════════════════════════════════
// M7 — JADUAL ACARA
// ══════════════════════════════════════════════════════════════════
// tbl_jadual_acara: id_jadual[0], no_acara[1], nama_acara[2],
//   kategori[3], peringkat[4], tarikh[5], hari[6],
//   masa_mula[7], lokasi[8], id_acara_link[9],
//   status[10], created_at[11]

function getJadualAcara(payload) {
  var sheet = _sheet('tbl_jadual_acara');
  if (!sheet) return JSON.stringify({ success: true, jadual: [], total: 0 });
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    if (payload && payload.id_jadual && data[i][0] !== payload.id_jadual) continue;
    list.push({
      id_jadual     : data[i][0],
      no_acara      : data[i][1] ? data[i][1].toString() : '',
      nama_acara    : data[i][2] || '',
      kategori      : data[i][3] || '',
      peringkat     : data[i][4] || 'AKHIR',
      tarikh        : data[i][5] ? (data[i][5] instanceof Date ? data[i][5].toISOString().split('T')[0] : data[i][5].toString().split('T')[0]) : '',
      hari          : data[i][6] || '',
      masa_mula     : data[i][7] || '',
      lokasi        : data[i][8] || '',
      id_acara_link : data[i][9] || '',
      status        : data[i][10] || 'AKTIF',
      created_at    : data[i][11] ? data[i][11].toString() : ''
    });
  }
  // Sort by tarikh + masa_mula
  list.sort(function(a, b) {
    var keyA = (a.tarikh || '') + (a.masa_mula || '');
    var keyB = (b.tarikh || '') + (b.masa_mula || '');
    return keyA > keyB ? 1 : keyA < keyB ? -1 : 0;
  });
  return JSON.stringify({ success: true, jadual: list, total: list.length });
}

function saveJadualAcara(payload) {
  if (!payload || !payload.no_acara || !payload.nama_acara || !payload.tarikh) {
    return JSON.stringify({ success: false, message: 'no_acara, nama_acara dan tarikh diperlukan' });
  }

  var sheet = _ensureSheet('tbl_jadual_acara',
    ['id_jadual','no_acara','nama_acara','kategori','peringkat',
     'tarikh','hari','masa_mula','lokasi','id_acara_link','status','created_at']);

  var data = sheet.getDataRange().getValues();

  // UPDATE jika ada id_jadual
  if (payload.id_jadual) {
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === payload.id_jadual) {
        sheet.getRange(i+1, 2, 1, 10).setValues([[
          payload.no_acara.toString(),
          payload.nama_acara || '',
          payload.kategori   || '',
          payload.peringkat  || 'AKHIR',
          payload.tarikh,
          payload.hari       || '',
          payload.masa_mula  || '',
          payload.lokasi     || '',
          payload.id_acara_link || '',
          'AKTIF'
        ]]);
        return JSON.stringify({ success: true, message: 'Jadual berjaya dikemaskini' });
      }
    }
  }

  // INSERT baru — semak duplikasi no_acara + peringkat
  for (var d = 1; d < data.length; d++) {
    if (data[d][0] &&
        data[d][1].toString() === payload.no_acara.toString() &&
        data[d][4] === payload.peringkat) {
      return JSON.stringify({ success: false, message: 'No. acara ' + payload.no_acara + ' dengan peringkat ' + payload.peringkat + ' sudah wujud.' });
    }
  }

  var id = _uniqueId('JDL');
  sheet.appendRow([
    id,
    payload.no_acara.toString(),
    payload.nama_acara     || '',
    payload.kategori       || '',
    payload.peringkat      || 'AKHIR',
    payload.tarikh,
    payload.hari           || '',
    payload.masa_mula      || '',
    payload.lokasi         || '',
    payload.id_acara_link  || '',
    'AKTIF',
    new Date()
  ]);
  return JSON.stringify({ success: true, id_jadual: id, message: 'Jadual berjaya disimpan' });
}

function deleteJadualAcara(payload) {
  if (!payload || !payload.id_jadual) {
    return JSON.stringify({ success: false, message: 'id_jadual diperlukan' });
  }
  var sheet = _sheet('tbl_jadual_acara');
  if (!sheet) return JSON.stringify({ success: false, message: 'tbl_jadual_acara tiada' });
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id_jadual) {
      sheet.deleteRow(i + 1);
      return JSON.stringify({ success: true, message: 'Jadual dipadam' });
    }
  }
  return JSON.stringify({ success: false, message: 'Jadual tidak dijumpai' });
}

// ══════════════════════════════════════════════════════════════════
// M6 — SETUP, HELPERS KP, DEBUG
// ══════════════════════════════════════════════════════════════════

// ── KP HELPERS ─────────────────────────────────────────────────────

function _normalizeKp(kp) {
  if (!kp) return '';
  var s = kp.toString().replace(/\D/g, '');
  return s.length === 12 ? s : '';
}

function _formatKp(kp) {
  var s = _normalizeKp(kp);
  if (!s) return kp;
  return s.slice(0,6) + '-' + s.slice(6,8) + '-' + s.slice(8);
}

function _jantinaFromKp(kp) {
  var s = _normalizeKp(kp);
  if (!s) return '';
  var lastDigit = parseInt(s.slice(-1));
  return (lastDigit % 2 === 1) ? 'L' : 'P';
}

function _tarihLahirFromKp(kp) {
  var s = _normalizeKp(kp);
  if (!s) return '';
  try {
    var yr2 = parseInt(s.substring(0,2));
    var mm  = s.substring(2,4);
    var dd  = s.substring(4,6);
    var yr4 = yr2 <= 24 ? '20' : '19';
    return yr4 + (yr2 < 10 ? '0'+yr2 : yr2) + '-' + mm + '-' + dd;
  } catch(e) { return ''; }
}

// ── SETUP AWAL ─────────────────────────────────────────────────────

// ── ALIAS FUNCTIONS (untuk compatibility dengan AdminOps) ──────────────
function janaFinal(payload) {
  // Alias untuk prosesLayakFinal
  return prosesLayakFinal(payload);
}

function updatePesertaHeat(payload) {
  // Kemaskini peserta dalam heat (lorong, status)
  if (!payload || !payload.id_ph) return { success: false, message: 'id_ph diperlukan' };
  var sheet = _sheet('tbl_peserta_heat');
  if (!sheet) return { success: false, message: 'tbl_peserta_heat tiada' };
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] !== payload.id_ph) continue;
    if (payload.lorong !== undefined) sheet.getRange(i+1, 8).setValue(payload.lorong);
    if (payload.status !== undefined) sheet.getRange(i+1, 10).setValue(payload.status);
    return { success: true, message: 'Peserta heat dikemaskini' };
  }
  return { success: false, message: 'Rekod tidak dijumpai' };
}

function setupInitialData() {
  Logger.log('════════════════════════════════════');
  Logger.log('  setupInitialData() MULA v3.0');
  Logger.log('════════════════════════════════════');

  // 1. tbl_settings
  var sSheet = _ensureSheet('tbl_settings', ['key','value']);
  var sData  = sSheet.getDataRange().getValues();
  var sExist = {};
  sData.forEach(function(r){ if(r[0]) sExist[r[0]] = true; });
  var defaults = [
    ['nama_sekolah',        'SK Sultan Ismail, Kemaman'],
    ['nama_pertandingan',   'Sukan Tahunan 2025'],
    ['tahun',               2025],
    ['tarikh_sukan',        '2025-08-20'],
    ['lokasi',              'Padang Utama SK Sultan Ismail'],
    ['tema',                'Cemerlang Bersama'],
    ['lorong_trek',         6],
    ['podium',              4],
    ['mata_1',              5], ['mata_2', 3], ['mata_3', 2],
    ['mata_4',              1], ['mata_5', 0], ['mata_6', 0],
    ['pendaftaran_buka',    true],
    ['paparan_awam',        true],
    ['mod_penyelenggaraan', false]
  ];
  defaults.forEach(function(d){ if (!sExist[d[0]]) sSheet.appendRow(d); });
  Logger.log('✅ tbl_settings: OK');

  // 2. tbl_rumah_sukan — auto-populate 5 rumah default
  var rumahSheet = _ensureSheet('tbl_rumah_sukan',
    ['id','nama','warna','warna_teks','kod','emas','perak','gangsa','keempat','mata','pengurus','created_at']);
  if (rumahSheet.getLastRow() <= 1) {
    var rumahDefault = [
      ['RMH-BESTARI',   'BESTARI',   '#3B82F6','#ffffff','BST', 0,0,0,0,0,'',new Date().toString()],
      ['RMH-GEMILANG',  'GEMILANG',  '#F59E0B','#ffffff','GML', 0,0,0,0,0,'',new Date().toString()],
      ['RMH-AMAL',      'AMAL',      '#10B981','#ffffff','AML', 0,0,0,0,0,'',new Date().toString()],
      ['RMH-CEMERLANG', 'CEMERLANG', '#EF4444','#ffffff','CML', 0,0,0,0,0,'',new Date().toString()],
      ['RMH-DEDIKASI',  'DEDIKASI',  '#8B5CF6','#ffffff','DDK', 0,0,0,0,0,'',new Date().toString()]
    ];
    rumahDefault.forEach(function(r){ rumahSheet.appendRow(r); });
    Logger.log('✅ tbl_rumah_sukan: 5 rumah default dicipta');
  } else {
    Logger.log('✅ tbl_rumah_sukan: sudah ada data (' + (rumahSheet.getLastRow()-1) + ' rumah)');
  }

  // 3. tbl_kategori — 4 kategori standard
  var katSheet = _ensureSheet('tbl_kategori',
    ['id','kod','nama','jantina','umin','umax','kuota_individu','kuota_kumpulan','warna','aktif','created_at']);
  if (katSheet.getLastRow() <= 1) {
    katSheet.appendRow(['KAT-L1','L1','Lelaki Bawah 12', 'L',7,11,3,1,'#4F8EF7',true,new Date()]);
    katSheet.appendRow(['KAT-L2','L2','Lelaki Bawah 15', 'L',12,14,3,1,'#10B981',true,new Date()]);
    katSheet.appendRow(['KAT-P1','P1','Perempuan Bawah 12','P',7,11,3,1,'#EC4899',true,new Date()]);
    katSheet.appendRow(['KAT-P2','P2','Perempuan Bawah 15','P',12,14,3,1,'#8B5CF6',true,new Date()]);
    Logger.log('✅ tbl_kategori: 4 kategori default dicipta');
  } else {
    Logger.log('✅ tbl_kategori: sudah ada data');
  }

  // 4. tbl_acara_master
  _ensureSheet('tbl_acara_master',
    ['id','kod','nama','jenis','kategori_json','guna_lorong',
     'jenis_pendaftaran','min_ahli','max_ahli','format_acara',
     'top_n_final','emoji','catatan','aktif','created_at',
     'kuota_ind_rumah','kuota_pasukan_rumah','ahli_utama','ahli_simpanan']);
  Logger.log('✅ tbl_acara_master: OK (isi acara via AdminSetup)');

  // 5. tbl_acara_jana
  _ensureSheet('tbl_acara_jana',
    ['id_acara','no_acara','nama_acara','id_kategori','id_master','jenis',
     'guna_lorong','jenis_pendaftaran','min_ahli','max_ahli','format_acara','top_n_final','created_at']);
  Logger.log('✅ tbl_acara_jana: OK');

  // 6. tbl_murid
  _ensureSheet('tbl_murid',
    ['id','no_kp','nama','id_rumah','id_kategori','jantina','tarikh_lahir',
     'kelas','no_dada','is_active','created_at','created_by','darjah','nama_rumah']);
  Logger.log('✅ tbl_murid: OK (import murid via AdminOps)');

  // 7. tbl_pendaftaran
  _ensureSheet('tbl_pendaftaran',
    ['id_reg','id_acara','no_acara','nama_acara','no_kp','id_rumah',
     'id_kategori','nama_murid','status','created_at','created_by']);
  Logger.log('✅ tbl_pendaftaran: OK');

  // 8. tbl_pendaftaran_kumpulan
  _ensureSheet('tbl_pendaftaran_kumpulan',
    ['id_kumpulan','id_acara','no_acara','nama_acara','id_rumah','id_kategori',
     'nama_pasukan','ahli_json','bilangan_ahli','status','created_at','created_by']);
  Logger.log('✅ tbl_pendaftaran_kumpulan: OK');

  // 9. tbl_heat + peserta + keputusan
  _ensureSheet('tbl_heat',
    ['id_heat','id_acara','jenis','no_heat','status','tarikh','masa_mula','catatan','created_at']);
  _ensureSheet('tbl_peserta_heat',
    ['id','id_heat','id_acara','no_kp','nama','id_rumah','id_kategori','lorong','giliran','status','source','created_at']);
  _ensureSheet('tbl_keputusan',
    ['id','id_heat','id_acara','no_kp','nama','id_rumah','id_kategori',
     'jenis','prestasi','unit','kedudukan','layak_final','catatan','status','created_at']);
  _ensureSheet('tbl_keputusan_akhir',
    ['id','id_acara','no_kp','nama','id_rumah','id_kategori',
     'prestasi','unit','kedudukan','mata','status','created_at']);
  Logger.log('✅ tbl_heat, tbl_peserta_heat, tbl_keputusan, tbl_keputusan_akhir: OK');

  // 10. tbl_users — bina default users jika tiada
  var uSheet = _ensureSheet('tbl_users',
    ['username','password','full_name','email','phone','role','id_rumah','is_active','created_at']);
  var uData  = uSheet.getDataRange().getValues();
  var uExist = {};
  for (var u = 1; u < uData.length; u++) {
    if (uData[u][0]) uExist[uData[u][0]] = true;
  }
  var defaultUsers = [
    ['admin',     'admin123',       'Administrator Sistem', 'admin@sk.edu.my',     '', 'Admin',    '', true],
    ['urusetia',  'urusetiago123',  'Urusetia Sukan',       'urusetia@sk.edu.my',  '', 'Urusetia', '', true],
    ['pencatat1', 'pencatat123',    'Pencatat Sukan 1',     'pencatat@sk.edu.my',  '', 'Pencatat', '', true]
  ];
  defaultUsers.forEach(function(u) {
    if (!uExist[u[0]]) {
      uSheet.appendRow([u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7], new Date()]);
      Logger.log('✅ User dicipta: ' + u[0]);
    } else {
      Logger.log('   User sedia ada: ' + u[0]);
    }
  });

  Logger.log('════════════════════════════════════');
  Logger.log('  setupInitialData() SELESAI');
  Logger.log('');
  Logger.log('  CREDENTIALS DEFAULT:');
  Logger.log('  admin      / admin123');
  Logger.log('  urusetia   / urusetiago123');
  Logger.log('  pencatat1  / pencatat123');
  Logger.log('');
  Logger.log('  LANGKAH SETERUSNYA:');
  Logger.log('  1. Buka Admin Setup → Rumah Sukan → tambah 5 rumah');
  Logger.log('  2. Buka Admin Setup → Pengguna → tambah akaun Pengurus');
  Logger.log('  3. Buka Admin Ops → Import Murid');
  Logger.log('  4. Buka Admin Setup → Acara Master → tambah acara');
  Logger.log('  5. Buka Admin Ops → Jana Acara');
  Logger.log('════════════════════════════════════');
}



// ══════════════════════════════════════════════════════════════════
// DEBUG TOOLS — Dump raw sheet data ke Logger
// ══════════════════════════════════════════════════════════════════

// ── FIX MURID SCHEMA ──────────────────────────────────────────────────────
// Tambah kolum darjah & nama_rumah di hujung tbl_murid TANPA padam data sedia ada
function fixMuridSchema() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('tbl_murid');
    if (!sheet) return JSON.stringify({ success: false, message: 'tbl_murid tiada' });

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    Logger.log('Header semasa: ' + JSON.stringify(headers));
    Logger.log('Jumlah kolum: ' + headers.length);

    var hasDarjah    = headers.indexOf('darjah') > -1;
    var hasNamaRumah = headers.indexOf('nama_rumah') > -1;
    var added = [];

    if (!hasDarjah) {
      var col = sheet.getLastColumn() + 1;
      sheet.getRange(1, col).setValue('darjah');
      // Warna header kuning (kolum guru isi)
      sheet.getRange(1, col).setBackground('#FEF3C7').setFontWeight('bold');
      added.push('darjah (kolum ' + col + ')');
      Logger.log('✅ Tambah kolum darjah di kolum ' + col);
    } else {
      Logger.log('ℹ️ darjah sudah ada di kolum ' + (headers.indexOf('darjah')+1));
    }

    if (!hasNamaRumah) {
      var col2 = sheet.getLastColumn() + 1;
      sheet.getRange(1, col2).setValue('nama_rumah');
      sheet.getRange(1, col2).setBackground('#FEF3C7').setFontWeight('bold');
      added.push('nama_rumah (kolum ' + col2 + ')');
      Logger.log('✅ Tambah kolum nama_rumah di kolum ' + col2);
    } else {
      Logger.log('ℹ️ nama_rumah sudah ada di kolum ' + (headers.indexOf('nama_rumah')+1));
    }

    // Warna header kolum AUTO — kelabu (supaya guru tahu jangan usik)
    var allHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var autoCols = ['id','id_rumah','id_kategori','jantina','tarikh_lahir','no_dada','is_active','created_at','created_by'];
    allHeaders.forEach(function(h, i) {
      if (autoCols.indexOf(h) > -1) {
        sheet.getRange(1, i+1).setBackground('#F3F4F6').setFontColor('#9CA3AF');
      }
    });

    // Freeze header
    sheet.setFrozenRows(1);

    var msg = added.length > 0
      ? 'Berjaya tambah: ' + added.join(', ')
      : 'Kolum darjah & nama_rumah sudah wujud';
    Logger.log('✅ fixMuridSchema selesai: ' + msg);
    return JSON.stringify({ success: true, message: msg, added: added });
  } catch(e) {
    Logger.log('❌ fixMuridSchema error: ' + e.message);
    return JSON.stringify({ success: false, message: e.message });
  }
}

// ── SHEET VALIDATION SETUP ────────────────────────────────────────────────
// Buat dropdown & protection pada tbl_murid untuk guru input data
function setupSheetValidation() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('tbl_murid');
    if (!sheet) return { success: false, message: 'tbl_murid tiada. Jalankan setupInitialData() dahulu.' };

    // Ambil senarai nama rumah dari tbl_rumah_sukan
    var rumahSheet = ss.getSheetByName('tbl_rumah_sukan');
    var rumahNames = [];
    if (rumahSheet && rumahSheet.getLastRow() > 1) {
      var rumahData = rumahSheet.getRange(2, 2, rumahSheet.getLastRow()-1, 1).getValues();
      rumahData.forEach(function(r){ if(r[0]) rumahNames.push(r[0].toString()); });
    }
    if (rumahNames.length === 0) rumahNames = ['BESTARI','GEMILANG','AMAL','CEMERLANG','DEDIKASI'];

    var lastRow = 1000; // apply validation untuk 1000 baris

    // Dropdown DARJAH — kolum M (index 13, col 13)
    var darjahRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['1','2','3','4','5','6'], true)
      .setAllowInvalid(false)
      .setHelpText('Pilih darjah 1 hingga 6')
      .build();
    sheet.getRange(2, 13, lastRow, 1).setDataValidation(darjahRule);

    // Dropdown NAMA_RUMAH — kolum N (index 14, col 14)
    var rumahRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(rumahNames, true)
      .setAllowInvalid(false)
      .setHelpText('Pilih nama rumah sukan')
      .build();
    sheet.getRange(2, 14, lastRow, 1).setDataValidation(rumahRule);

    // Warna header — highlight kolum yang guru perlu isi (B,C,H,M,N)
    var guruCols = [2, 3, 8, 13, 14]; // B=2, C=3, H=8, M=13, N=14
    guruCols.forEach(function(col) {
      sheet.getRange(1, col).setBackground('#FEF3C7').setFontWeight('bold'); // kuning
    });

    // Warna header kolum AUTO — kelabu
    var autoCols = [1, 4, 5, 6, 7, 9, 10, 11, 12];
    autoCols.forEach(function(col) {
      sheet.getRange(1, col).setBackground('#F3F4F6').setFontColor('#9CA3AF'); // kelabu
    });

    // Freeze header row
    sheet.setFrozenRows(1);

    Logger.log('✅ setupSheetValidation: dropdown darjah & rumah sukan berjaya');
    Logger.log('✅ Rumah tersedia: ' + rumahNames.join(', '));
    return JSON.stringify({ 
      success: true, 
      message: 'Dropdown berjaya dipasang. Rumah: ' + rumahNames.join(', '),
      rumah: rumahNames
    });
  } catch(e) {
    Logger.log('❌ setupSheetValidation error: ' + e.message);
    return JSON.stringify({ success: false, message: e.message });
  }
}




// ── BACKFILL ID RUMAH ─────────────────────────────────────────────────────
// Kemaskini id_rumah dalam tbl_murid untuk data lama yang tiada id_rumah
// Guna nama_rumah[18] untuk lookup id dari tbl_rumah_sukan
function backfillIdRumah() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var muridSheet = ss.getSheetByName('tbl_murid');
    if (!muridSheet) return JSON.stringify({ success: false, message: 'tbl_murid tiada' });

    // Bina rumah lookup
    var rumahSheet = ss.getSheetByName('tbl_rumah_sukan');
    var rumahMap = {};
    if (rumahSheet && rumahSheet.getLastRow() > 1) {
      var rd = rumahSheet.getRange(2, 1, rumahSheet.getLastRow()-1, 2).getValues();
      rd.forEach(function(r) {
        if (r[0] && r[1]) rumahMap[r[1].toString().toUpperCase().trim()] = r[0].toString();
      });
    }
    Logger.log('Rumah map: ' + JSON.stringify(rumahMap));

    var data = muridSheet.getDataRange().getValues();
    var updated = 0, skipped = 0;

    for (var i = 1; i < data.length; i++) {
      if (!data[i][0]) continue;
      var idRumah   = data[i][3] ? data[i][3].toString().trim() : '';
      var namaRumah = data[i][18] ? data[i][18].toString().toUpperCase().trim() : '';

      if (idRumah) { skipped++; continue; } // dah ada id_rumah
      if (!namaRumah) { skipped++; continue; } // tiada nama_rumah

      var newId = rumahMap[namaRumah];
      if (!newId) { 
        Logger.log('Baris '+(i+1)+': nama_rumah "'+namaRumah+'" tiada dalam tbl_rumah_sukan');
        skipped++; continue; 
      }

      muridSheet.getRange(i+1, 4).setValue(newId); // kolum D = id_rumah
      updated++;
    }

    Logger.log('✅ backfillIdRumah: ' + updated + ' dikemaskini, ' + skipped + ' skip');
    return JSON.stringify({ success: true, updated: updated, skipped: skipped,
      message: updated + ' rekod id_rumah dikemaskini' });
  } catch(e) {
    Logger.log('❌ backfillIdRumah error: ' + e.message);
    return JSON.stringify({ success: false, message: e.message });
  }
}

function debugMuridSchema() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('tbl_murid');
  if (!sheet) { Logger.log('tbl_murid TIADA'); return; }
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  Logger.log('Jumlah kolum: ' + headers.length);
  headers.forEach(function(h, i) {
    Logger.log('  [' + i + '] kolum ' + (i+1) + ' = "' + h + '"');
  });
  // Tunjuk row pertama data juga
  if (sheet.getLastRow() > 1) {
    var row1 = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];
    Logger.log('ROW[1] data:');
    row1.forEach(function(v, i) {
      Logger.log('  [' + i + '] = "' + v + '"');
    });
  }
}

function debugDumpAll() {
  var sheets = [
    'tbl_settings','tbl_users','tbl_kategori',
    'tbl_rumah_sukan','tbl_acara_master'
  ];
  sheets.forEach(function(name) {
    var s = _sheet(name);
    if (!s) { Logger.log('❌ TIADA: ' + name); return; }
    var data = s.getDataRange().getValues();
    Logger.log('');
    Logger.log('══ ' + name + ' (' + (data.length-1) + ' rows) ══');
    Logger.log('HEADER: ' + JSON.stringify(data[0]));
    for (var i = 1; i < Math.min(data.length, 6); i++) {
      Logger.log('ROW['+i+']: ' + JSON.stringify(data[i]));
    }
    if (data.length > 6) Logger.log('... (' + (data.length-6) + ' lagi)');
  });
}

function debugKategori() {
  var s = _sheet('tbl_kategori');
  if (!s) { Logger.log('❌ tbl_kategori TIADA'); return; }
  var data = s.getDataRange().getValues();
  Logger.log('tbl_kategori: ' + data.length + ' rows (termasuk header)');
  Logger.log('HEADER raw: ' + JSON.stringify(data[0]));
  for (var i = 1; i < data.length; i++) {
    Logger.log('ROW['+i+'] id="'+data[i][0]+'" kod="'+data[i][1]+'" nama="'+data[i][2]+'" aktif="'+data[i][9]+'" type='+typeof data[i][9]);
  }
  Logger.log('');
  Logger.log('getKategori() result:');
  var r = getKategori();
  Logger.log('success=' + r.success + ' count=' + r.total);
  r.data.forEach(function(k,i) {
    Logger.log('  ['+i+'] id='+k.id+' kod='+k.kod+' aktif='+k.aktif);
  });
}

function debugRumah() {
  var s = _sheet('tbl_rumah_sukan');
  if (!s) { Logger.log('❌ tbl_rumah_sukan TIADA'); return; }
  var data = s.getDataRange().getValues();
  Logger.log('tbl_rumah_sukan: ' + data.length + ' rows');
  Logger.log('HEADER raw: ' + JSON.stringify(data[0]));
  for (var i = 1; i < data.length; i++) {
    Logger.log('ROW['+i+']: ' + JSON.stringify(data[i]));
  }
  Logger.log('');
  var r = getRumah();
  Logger.log('getRumah() → success='+r.success+' count='+(r.rumah||[]).length);
}

function debugAcara() {
  var s = _sheet('tbl_acara_master');
  if (!s) { Logger.log('❌ tbl_acara_master TIADA'); return; }
  var data = s.getDataRange().getValues();
  Logger.log('tbl_acara_master: ' + data.length + ' rows');
  Logger.log('HEADER raw: ' + JSON.stringify(data[0]));
  for (var i = 1; i < data.length; i++) {
    Logger.log('ROW['+i+'] [9]="'+data[i][9]+'" type='+typeof data[i][9]+' [5]="'+data[i][5]+'" type='+typeof data[i][5]);
  }
  Logger.log('');
  try {
    var r = getAcara();
    Logger.log('getAcara() → success='+r.success+' count='+(r.data||[]).length);
  } catch(e) {
    Logger.log('getAcara() ERROR: ' + e.message);
  }
}

// ══════════════════════════════════════════════════════════════════
// RESET TOOLS — Guna dengan BERHATI-HATI
// ══════════════════════════════════════════════════════════════════

/**
 * resetSheets()
 * Padam SEMUA DATA (bukan header) dalam sheets yang ada schema lama.
 * Kemudian set semula header kepada schema v3.0 yang betul.
 * Lepas run ini, jalankan setupInitialData() semula.
 *
 * SELAMAT: Tidak padam sheet, hanya padam baris data.
 * BAHAYA:  Data lama TIDAK boleh recover. Pastikan tiada data penting.
 */
function resetSheets() {
  Logger.log('════════════════════════════════════');
  Logger.log('  resetSheets() MULA');
  Logger.log('  Padam data lama, set header baru');
  Logger.log('════════════════════════════════════');

  var SHEETS = [
    {
      name: 'tbl_settings',
      headers: ['key','value']
    },
    {
      name: 'tbl_users',
      headers: ['username','password','full_name','email','phone','role','id_rumah','is_active','created_at']
    },
    {
      name: 'tbl_rumah_sukan',
      headers: ['id','nama','warna','warna_teks','kod','emas','perak','gangsa','keempat','mata','pengurus','created_at']
    },
    {
      name: 'tbl_kategori',
      headers: ['id','kod','nama','jantina','umin','umax','kuota_individu','kuota_kumpulan','warna','aktif','created_at']
    },
    {
      name: 'tbl_acara_master',
      headers: ['id','kod','nama','jenis','kategori_json','guna_lorong',
                'jenis_pendaftaran','min_ahli','max_ahli','format_acara',
                'top_n_final','emoji','catatan','aktif','created_at']
    },
    {
      name: 'tbl_acara_jana',
      headers: ['id_acara','no_acara','nama_acara','id_kategori','id_master','jenis',
                'guna_lorong','jenis_pendaftaran','min_ahli','max_ahli','format_acara','top_n_final','created_at']
    },
    {
      name: 'tbl_murid',
      headers: ['id','no_kp','nama','id_rumah','id_kategori','jantina','tarikh_lahir',
                'kelas','no_dada','is_active','created_at','created_by']
    },
    {
      name: 'tbl_pendaftaran',
      headers: ['id_reg','id_acara','no_acara','nama_acara','no_kp','id_rumah',
                'id_kategori','nama_murid','status','created_at','created_by']
    },
    {
      name: 'tbl_pendaftaran_kumpulan',
      headers: ['id_kumpulan','id_acara','no_acara','nama_acara','id_rumah','id_kategori',
                'nama_pasukan','ahli_json','bilangan_ahli','status','created_at','created_by']
    },
    {
      name: 'tbl_heat',
      headers: ['id_heat','id_acara','jenis','no_heat','status','tarikh','masa_mula','catatan','created_at']
    },
    {
      name: 'tbl_peserta_heat',
      headers: ['id','id_heat','id_acara','no_kp','nama','id_rumah','id_kategori',
                'lorong','giliran','status','source','created_at']
    },
    {
      name: 'tbl_keputusan',
      headers: ['id','id_heat','id_acara','no_kp','nama','id_rumah','id_kategori',
                'jenis','prestasi','unit','kedudukan','layak_final','catatan','status','created_at']
    },
    {
      name: 'tbl_keputusan_akhir',
      headers: ['id','id_acara','no_kp','nama','id_rumah','id_kategori',
                'prestasi','unit','kedudukan','mata','status','created_at']
    }
  ];

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  SHEETS.forEach(function(def) {
    var sheet = ss.getSheetByName(def.name);

    if (!sheet) {
      // Sheet tidak wujud — cipta baru dengan header
      sheet = ss.insertSheet(def.name);
      sheet.appendRow(def.headers);
      Logger.log('🆕 DICIPTA: ' + def.name);
      return;
    }

    var lastRow = sheet.getLastRow();

    // Padam semua data (bukan header row 1)
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
      Logger.log('🗑️  DIPADAM: ' + def.name + ' (' + (lastRow - 1) + ' baris data dibuang)');
    } else {
      Logger.log('   KOSONG : ' + def.name + ' (tiada data untuk dipadam)');
    }

    // Set semula header row dengan schema v3.0
    sheet.getRange(1, 1, 1, def.headers.length).setValues([def.headers]);
    Logger.log('✅ HEADER  : ' + def.name + ' → ' + def.headers.length + ' kolum');
  });

  Logger.log('');
  Logger.log('════════════════════════════════════');
  Logger.log('  resetSheets() SELESAI');
  Logger.log('');
  Logger.log('  LANGKAH WAJIB SELEPAS INI:');
  Logger.log('  1. Run setupInitialData()');
  Logger.log('     → cipta semula settings & users default');
  Logger.log('  2. Buka AdminSetup → tambah Rumah Sukan');
  Logger.log('  3. Buka AdminSetup → semak Kategori (L1,L2,P1,P2)');
  Logger.log('  4. Buka AdminSetup → tambah Acara Master');
  Logger.log('════════════════════════════════════');
}

/**
 * resetAndSetup()
 * Shortcut: reset + setup dalam satu langkah.
 * Paling selamat untuk permulaan bersih.
 */
function resetAndSetup() {
  resetSheets();
  setupInitialData();
  Logger.log('');
  Logger.log('✅ Reset + Setup selesai. Sedia untuk guna.');
}

// ── DEBUG & TEST ───────────────────────────────────────────────────

function testLogin() {
  Logger.log('=== TEST LOGIN ===');
  var tests = [
    { username:'admin',    password:'admin123',      expect:true  },
    { username:'urusetia', password:'urusetiago123', expect:true  },
    { username:'admin',    password:'salah',         expect:false },
    { username:'tiada',    password:'abc',           expect:false }
  ];
  tests.forEach(function(t) {
    var r = loginUser({ username: t.username, password: t.password });
    var pass = r.success === t.expect;
    Logger.log((pass ? '✅' : '❌') + ' ' + t.username + '/' + t.password +
               ' → ' + (r.success ? 'OK ('+r.user.role+')' : 'FAIL: '+r.message));
  });
}

function testSchema() {
  Logger.log('=== TEST SCHEMA — semak semua sheets wujud ===');
  var sheets = [
    'tbl_settings','tbl_users','tbl_rumah_sukan','tbl_kategori',
    'tbl_acara_master','tbl_acara_jana','tbl_murid',
    'tbl_pendaftaran','tbl_pendaftaran_kumpulan',
    'tbl_heat','tbl_peserta_heat','tbl_keputusan','tbl_keputusan_akhir'
  ];
  sheets.forEach(function(name) {
    var s = _sheet(name);
    Logger.log((s ? '✅' : '❌') + ' ' + name + (s ? ' ('+s.getLastRow()+' rows)' : ' — TIADA'));
  });
}

function testGetSettings() {
  var r = getSettings();
  Logger.log('=== TEST getSettings ===');
  Logger.log(JSON.stringify(r.data));
}

function testSavePendaftaran() {
  Logger.log('=== TEST savePendaftaran (dry run) ===');
  // Test GATE 1 — pendaftaran tutup
  var orig = getSetting('pendaftaran_buka');
  saveSetting('pendaftaran_buka', false);
  var r1 = savePendaftaran({ id_acara:'TEST', no_kp:'140415031001' });
  Logger.log('GATE 1 (tutup): ' + (r1.success === false ? '✅' : '❌') + ' — ' + r1.message);
  saveSetting('pendaftaran_buka', orig !== null ? orig : true);
}

function runAllTests() {
  testSchema();
  testLogin();
  testGetSettings();
  testSavePendaftaran();
  Logger.log('=== SEMUA TEST SELESAI ===');
}

function getAllKeputusan() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName("tbl_keputusan");
    if (!sh) return JSON.stringify({success:false,message:"tbl_keputusan tidak dijumpai"});
    var data = sh.getDataRange().getValues();
    if (data.length <= 1) return JSON.stringify({success:true,keputusan:[]});
    var headers = data[0];
    var keputusan = data.slice(1).filter(function(r){return r[0];}).map(function(r){
      var obj = {};
      headers.forEach(function(h,i){ obj[h] = r[i]; });
      return obj;
    });
    return JSON.stringify({success:true,keputusan:keputusan});
  } catch(e) {
    return JSON.stringify({success:false,message:e.toString()});
  }
}

function deleteKeputusan(payload) {
  try {
    var p = typeof payload==="string" ? JSON.parse(payload) : payload;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName("tbl_keputusan");
    if (!sh) return JSON.stringify({success:false,message:"tbl_keputusan tidak dijumpai"});
    var data = sh.getDataRange().getValues();
    var headers = data[0];
    var idHeatIdx = headers.indexOf("id_heat");
    var noKpIdx = headers.indexOf("no_kp");
    for (var i = data.length-1; i >= 1; i--) {
      if (data[i][idHeatIdx]===p.id_heat && data[i][noKpIdx]===p.no_kp) {
        sh.deleteRow(i+1); break;
      }
    }
    return JSON.stringify({success:true,message:"Rekod dipadam"});
  } catch(e) {
    return JSON.stringify({success:false,message:e.toString()});
  }
}

// ═══════════════════════════════════════════════════════════════════
// REKOD ACARA — Rekod Sekolah / Daerah / Negeri / MSSM (OPTIONAL)
// tbl_rekod: id_rekod[0], id_acara_master[1], nama_acara[2],
//            id_kategori[3], jantina[4], peringkat[5],
//            prestasi[6], unit[7], nama_pemilik[8],
//            tahun[9], catatan[10], aktif[11], created_at[12]
// ═══════════════════════════════════════════════════════════════════

function getRekod(payload) {
  var sheet = _sheet('tbl_rekod');
  if (!sheet) return JSON.stringify({ success: true, data: [] });
  var data = sheet.getDataRange().getValues();
  var list = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    if (payload && payload.id_acara_master && data[i][1] !== payload.id_acara_master) continue;
    if (payload && payload.id_kategori    && data[i][3] !== payload.id_kategori)    continue;
    if (payload && payload.peringkat      && data[i][5] !== payload.peringkat)      continue;
    list.push({
      id_rekod        : data[i][0],
      id_acara_master : data[i][1],
      nama_acara      : data[i][2],
      id_kategori     : data[i][3],
      jantina         : data[i][4],
      peringkat       : data[i][5],
      prestasi        : data[i][6],
      unit            : data[i][7] || 's',
      nama_pemilik    : data[i][8] || '',
      tahun           : data[i][9] || '',
      catatan         : data[i][10] || '',
      aktif           : data[i][11] !== false && data[i][11] !== 'FALSE',
      created_at      : data[i][12] ? data[i][12].toString() : ''
    });
  }
  return JSON.stringify({ success: true, data: list, total: list.length });
}

function saveRekod(payload) {
  if (!payload || !payload.id_acara_master || !payload.peringkat) {
    return JSON.stringify({ success: false, message: 'id_acara_master dan peringkat diperlukan' });
  }
  var sheet = _ensureSheet('tbl_rekod', [
    'id_rekod','id_acara_master','nama_acara','id_kategori','jantina',
    'peringkat','prestasi','unit','nama_pemilik','tahun','catatan','aktif','created_at'
  ]);
  var peringkat = (payload.peringkat || '').toUpperCase();
  var validPeringkat = ['SEKOLAH','DAERAH','NEGERI','MSSM'];
  if (validPeringkat.indexOf(peringkat) === -1) {
    return JSON.stringify({ success: false, message: 'Peringkat tidak sah. Guna: SEKOLAH/DAERAH/NEGERI/MSSM' });
  }
  // UPDATE jika id_rekod ada
  if (payload.id_rekod) {
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === payload.id_rekod) {
        sheet.getRange(i+1, 2, 1, 12).setValues([[
          payload.id_acara_master,
          payload.nama_acara    || data[i][2],
          payload.id_kategori   || data[i][3],
          payload.jantina       || data[i][4],
          peringkat,
          payload.prestasi      !== undefined ? payload.prestasi : data[i][6],
          payload.unit          || data[i][7] || 's',
          payload.nama_pemilik  || data[i][8] || '',
          payload.tahun         || data[i][9] || '',
          payload.catatan       !== undefined ? payload.catatan : data[i][10],
          payload.aktif         !== undefined ? _boolVal(payload.aktif) : data[i][11],
          data[i][12]
        ]]);
        return JSON.stringify({ success: true, message: 'Rekod dikemaskini' });
      }
    }
  }
  // CREATE baru
  var id = _uniqueId('RKD');
  sheet.appendRow([
    id,
    payload.id_acara_master,
    payload.nama_acara    || '',
    payload.id_kategori   || '',
    payload.jantina       || '',
    peringkat,
    payload.prestasi      || '',
    payload.unit          || 's',
    payload.nama_pemilik  || '',
    payload.tahun         || new Date().getFullYear(),
    payload.catatan       || '',
    true,
    new Date()
  ]);
  return JSON.stringify({ success: true, id: id, message: 'Rekod berjaya ditambah' });
}

function deleteRekod(payload) {
  if (!payload || !payload.id_rekod) return JSON.stringify({ success: false, message: 'id_rekod diperlukan' });
  var sheet = _sheet('tbl_rekod');
  if (!sheet) return JSON.stringify({ success: false, message: 'tbl_rekod tiada' });
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === payload.id_rekod) {
      sheet.deleteRow(i + 1);
      return JSON.stringify({ success: true, message: 'Rekod dipadam' });
    }
  }
  return JSON.stringify({ success: false, message: 'Rekod tidak dijumpai' });
}

// checkPecahRekod — dipanggil selepas saveKeputusan
// Bandingkan prestasi baru dengan SEMUA peringkat yang ADA dalam tbl_rekod
// Return senarai peringkat yang dipecah (boleh kosong jika tiada rekod / tiada pecah)
function checkPecahRekod(payload) {
  // payload: { id_acara_master, id_kategori, prestasi, unit, jenis }
  // jenis: TRACK (masa — lebih kecil lebih baik) / FIELD (jarak/berat — lebih besar lebih baik)
  if (!payload || !payload.id_acara_master || payload.prestasi === undefined) {
    return JSON.stringify({ success: true, pecah: [] });
  }
  var sheet = _sheet('tbl_rekod');
  if (!sheet) return JSON.stringify({ success: true, pecah: [] }); // tiada tbl_rekod = skip
  var data  = sheet.getDataRange().getValues();
  var prestasiBaru = parseFloat(payload.prestasi);
  if (isNaN(prestasiBaru)) return JSON.stringify({ success: true, pecah: [] });
  var jenis = (payload.jenis || 'TRACK').toUpperCase();
  var pecah = [];
  for (var i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    if (data[i][1] !== payload.id_acara_master) continue;
    if (payload.id_kategori && data[i][3] !== payload.id_kategori) continue;
    if (data[i][11] === false || data[i][11] === 'FALSE') continue; // rekod tidak aktif — skip
    var prestasiSedia = parseFloat(data[i][6]);
    if (isNaN(prestasiSedia)) continue;
    var dipecah = false;
    if (jenis === 'FIELD') {
      dipecah = prestasiBaru > prestasiSedia; // lebih jauh/berat = lebih baik
    } else {
      dipecah = prestasiBaru < prestasiSedia; // lebih laju = lebih baik (masa)
    }
    if (dipecah) {
      pecah.push({
        id_rekod        : data[i][0],
        peringkat       : data[i][5],
        prestasi_lama   : prestasiSedia,
        prestasi_baru   : prestasiBaru,
        unit            : data[i][7] || 's',
        nama_acara      : data[i][2]
      });
    }
  }
  return JSON.stringify({ success: true, pecah: pecah, count: pecah.length });
}