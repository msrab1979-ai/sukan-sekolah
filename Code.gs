function doGet(e) {
  var page = e.parameter.page || 'home';
  var template;

  try {
    switch (page) {
      case 'home': template = HtmlService.createTemplateFromFile('Home'); break;
      case 'login': template = HtmlService.createTemplateFromFile('Login'); break;
      case 'admin-setup': template = HtmlService.createTemplateFromFile('AdminSetup'); break;
      case 'pengurus': template = HtmlService.createTemplateFromFile('Pengurus'); break;
      case 'pencatat': template = HtmlService.createTemplateFromFile('Pencatat'); break; // Route baru
      default: template = HtmlService.createTemplateFromFile('Home');
    }

    return template.evaluate()
      .setTitle('Sistem Sukan Sekolah')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (error) {
    return HtmlService.createHtmlOutput('<h3>Ralat 404: Fail tidak dijumpai</h3><p>' + error.message + '</p>')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

// MENGHALANG MASALAH WHITE SCREEN & NAVIGASI
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

// ═══════════════════════════════════════════
// MODUL PENGGUNA & AUTHENTICATION
// ═══════════════════════════════════════════

function handleLogin(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('tbl_users');
    
    // Auto-create jika belum wujud untuk elak ralat pertama kali
    if (!sheet) {
      sheet = ss.insertSheet('tbl_users');
      sheet.appendRow(['username', 'password_hash', 'full_name', 'role', 'id_rumah']);
      // Add default admin
      sheet.appendRow(['admin', 'admin123', 'Administrator', 'Admin', '']);
      sheet.appendRow(['pencatat1', 'pencatat123', 'Pencatat Keputusan', 'Pencatat', '']);
      sheet.setFrozenRows(1);
    }

    const rows = sheet.getDataRange().getValues();
    const headers = rows[0];
    const userIdx = headers.indexOf('username');
    const passIdx = headers.indexOf('password_hash');
    const nameIdx = headers.indexOf('full_name');
    const roleIdx = headers.indexOf('role');
    const rumahIdx = headers.indexOf('id_rumah');

    // Semak DB
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][userIdx]) === data.username && String(rows[i][passIdx]) === data.password) {
        return { 
          success: true, 
          session: { 
            username: rows[i][userIdx], 
            full_name: rows[i][nameIdx], 
            role: rows[i][roleIdx],
            id_rumah: rows[i][rumahIdx]
          } 
        };
      }
    }
    
    return { success: false, message: 'Nama pengguna atau kata laluan salah.' };
  } catch (error) {
    return { success: false, message: 'Ralat sistem: ' + error.message };
  }
}

// ═══════════════════════════════════════════
// MODUL PENCATAT (NEW WORKFLOW)
// ═══════════════════════════════════════════

function getAcaraForPencatat() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('tbl_acara_master');
    if (!sheet) return { success: true, data: [] };
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, data: [] };
    
    const exactKeys = ['id_acara', 'kod_acara', 'nama_acara', 'icon_emoji', 'event_type', 'requires_lanes', 'jenis', 'format', 'record_type', 'record_unit', 'num_attempts', 'result_calculation', 'display_order', 'is_active'];
    
    const result = data.slice(1).map(row => {
      let obj = {};
      exactKeys.forEach((key, i) => obj[key] = row[i]);
      return obj;
    }).filter(r => String(r.is_active).toUpperCase() !== 'FALSE');
    
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function saveKeputusanPencatat(payload) {
  const lock = LockService.getScriptLock();
  try {
    if (!lock.tryLock(10000)) throw new Error("Sistem sibuk. Sila cuba lagi.");

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('tbl_keputusan');
    
    if (!sheet) {
      sheet = ss.insertSheet('tbl_keputusan');
      sheet.appendRow(['id_keputusan', 'no_acara', 'rank_1_ic', 'rank_2_ic', 'rank_3_ic', 'mata_1', 'mata_2', 'mata_3', 'created_at', 'created_by']);
      sheet.setFrozenRows(1);
    }

    // Ambil tetapan mata dari tbl_settings (Auto-Mata)
    let ptEmas = 5, ptPerak = 3, ptGangsa = 1; // Default
    const setSheet = ss.getSheetByName('tbl_settings');
    if (setSheet) {
      const setRows = setSheet.getDataRange().getValues();
      setRows.forEach(r => {
        if (r[0] === 'point_emas') ptEmas = parseInt(r[1]) || 5;
        if (r[0] === 'point_perak') ptPerak = parseInt(r[1]) || 3;
        if (r[0] === 'point_gangsa') ptGangsa = parseInt(r[1]) || 1;
      });
    }

    const rowData = [
      'KEP-' + new Date().getTime(),
      payload.no_acara,
      payload.rank_1 || '',
      payload.rank_2 || '',
      payload.rank_3 || '',
      payload.rank_1 ? ptEmas : 0,
      payload.rank_2 ? ptPerak : 0,
      payload.rank_3 ? ptGangsa : 0,
      new Date().toISOString(),
      payload.pencatat || 'Pencatat'
    ];

    sheet.appendRow(rowData);
    return { success: true, message: `Keputusan ${payload.no_acara} berjaya disimpan & mata dikira secara automatik.` };
  } catch (error) {
    return { success: false, message: error.message };
  } finally {
    lock.releaseLock();
  }
}

// ═══════════════════════════════════════════
// MODUL TETAPAN ASAS (SETTINGS) 
// ═══════════════════════════════════════════

function getSettings() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('tbl_settings');
    if (!sheet) {
      sheet = ss.insertSheet('tbl_settings');
      sheet.appendRow(['setting_key', 'setting_value', 'description']);
      sheet.appendRow(['tournament_name', 'Sukan Tahunan SK Sultan Ismail 2025', 'Nama Kejohanan']);
      sheet.appendRow(['track_lanes', '8', 'Bilangan Lorong Track']);
      sheet.appendRow(['point_emas', '5', 'Mata Tempat Pertama']);
      sheet.appendRow(['point_perak', '3', 'Mata Tempat Kedua']);
      sheet.appendRow(['point_gangsa', '1', 'Mata Tempat Ketiga']);
      sheet.setFrozenRows(1);
    }
    const data = sheet.getDataRange().getValues();
    let settingsObj = {};
    for (let i = 1; i < data.length; i++) settingsObj[data[i][0]] = data[i][1];
    
    return { success: true, settings: settingsObj };
  } catch (error) { return { success: false, message: error.message }; }
}

function updateSettings(payload) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('tbl_settings');
    if (!sheet) return { success: false, message: "Jadual 'tbl_settings' tidak dijumpai." };
    const data = sheet.getDataRange().getValues();
    const updates = payload.settings;
    for (let key in updates) {
      let found = false;
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === key) {
          sheet.getRange(i + 1, 2).setValue(updates[key]);
          found = true; break;
        }
      }
      if (!found) sheet.appendRow([key, updates[key], '']);
    }
    return { success: true, message: 'Tetapan berjaya dikemas kini.' };
  } catch (error) { return { success: false, message: error.message }; }
}

// ═══════════════════════════════════════════
// MODUL RUMAH SUKAN & KATEGORI (API SYNC)
// ═══════════════════════════════════════════

function getRumah() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('tbl_rumah_sukan');
    if (!sheet) return { success: true, rumah: [] };
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, rumah: [] };
    
    const exactKeys = ['id_rumah', 'nama_rumah', 'warna_bg', 'warna_text', 'display_order', 'is_active', 'created_at', 'created_by'];
    const result = data.slice(1).map(row => {
      let obj = {};
      exactKeys.forEach((key, i) => { 
        let val = row[i];
        if (val instanceof Date) val = val.toISOString();
        obj[key] = val; 
      });
      return obj;
    }).filter(r => r.id_rumah !== '' && String(r.is_active).toUpperCase() !== 'FALSE'); 
    result.sort((a, b) => (parseInt(a.display_order) || 99) - (parseInt(b.display_order) || 99));
    return { success: true, rumah: result };
  } catch (error) { return { success: false, message: error.message }; }
}

function getKategoriConfig() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('tbl_kategori_config');
    if (!sheet) return { success: true, data: [] };
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return { success: true, data: [] };
    const rows = data.slice(1);
    
    // Sync Exact Columns from Prompt Wajib Requirement
    const exactKeys = ['id_kategori', 'kod_kategori', 'nama_kategori', 'jantina', 'tahun_lahir_mula', 'tahun_lahir_tamat', 'max_individu', 'max_kumpulan', 'max_open_individu', 'max_open_kumpulan', 'warna_badge', 'display_order', 'is_active'];
    const result = rows.map(row => {
      let obj = {};
      exactKeys.forEach((key, i) => { 
        let val = row[i];
        if (val instanceof Date) val = val.toISOString();
        obj[key] = val; 
      });
      return obj;
    }).filter(r => r.id_kategori !== '' && String(r.is_active).toUpperCase() !== 'FALSE');
    result.sort((a, b) => (parseInt(a.display_order) || 99) - (parseInt(b.display_order) || 99));
    return { success: true, data: result };
  } catch (error) { return { success: false, message: error.message }; }
}

// Helper Awam
function getPublicData(params) {
  return { 
    success: true, 
    counts: { murid: 1500, rumah: 4, acara: 48, users: 12 },
    data: { tournament: { name: 'Sukan Tahunan Sekolah 2025' } }
  };
}

function getUsers() { return { success: true, users: [] }; }
function getEventMasters() { return { success: true, masters: [] }; }
function getHouseNamesFromMurid() { return { success: true, data: [] }; }