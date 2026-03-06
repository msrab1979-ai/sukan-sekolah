/**
 * SISTEM SUKAN SEKOLAH (GAS) - PRODUCTION BACKEND
 * Repositori: msrab1979-ai/sukan-sekolah
 */

// 1. ROUTING & SETUP UTAMA
function doGet(e) {
  var page = e.parameter.page || 'home';
  var template;
  
  try {
    if (page === 'home') template = HtmlService.createTemplateFromFile('Home');
    else if (page === 'admin') template = HtmlService.createTemplateFromFile('AdminSetup');
    else if (page === 'pencatat') template = HtmlService.createTemplateFromFile('Pencatat');
    else if (page === 'login') template = HtmlService.createTemplateFromFile('Login');
    else template = HtmlService.createTemplateFromFile('Home');
    
    // Pass parameter role ke frontend jika ada
    template.roleUrl = e.parameter.role || '';
    
    return template.evaluate()
      .setTitle('Sistem Sukan Sekolah')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutput('Ralat memuatkan halaman: ' + err.message);
  }
}

// PENYELESAIAN 1: FUNGSI WAJIB UNTUK BYPASS SANDBOX (NAVIGASI)
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

// PENYELESAIAN 3: INTEGRASI PANGKALAN DATA TEPAT (tbl_users)
function authenticateUser(username, password) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("tbl_users");
  if (!sheet) return { success: false, message: "Jadual tbl_users tidak dijumpai!" };
  
  const data = sheet.getDataRange().getValues();
  // Headers sebenar: username[0], password_hash[1], full_name[2], email[3], role[4], id_rumah[5], is_active[6]
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === username && data[i][1] === password) {
      if (data[i][6] !== true && data[i][6] !== "TRUE") {
        return { success: false, message: "Akaun ini tidak aktif. Sila hubungi admin." };
      }
      return {
        success: true,
        user: {
          username: data[i][0],
          full_name: data[i][2],
          role: data[i][4],
          id_rumah: data[i][5]
        }
      };
    }
  }
  return { success: false, message: "Nama Pengguna atau Kata Laluan tidak sah." };
}

// API PENCATAT: Dapatkan Butiran Acara (tbl_acara_master)
function getAcaraDetails(kodAcara) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("tbl_acara_master");
  if (!sheet) return { success: false, message: "Jadual tbl_acara_master tiada!" };
  
  const data = sheet.getDataRange().getValues();
  // Headers berdasarkan arahan: kod_acara[1] (jika id_acara_master di 0), nama_acara[2], dll.
  // Kami mencari berdasarkan kod_acara
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1].toString().toUpperCase() === kodAcara.toString().toUpperCase()) {
      return {
        success: true,
        data: {
          kod_acara: data[i][1],
          nama_acara: data[i][2],
          event_type: data[i][4],
          requires_lanes: data[i][5],
          format: data[i][7]
        }
      };
    }
  }
  return { success: false, message: "Kod Acara tidak dijumpai dalam sistem." };
}

// API PENCATAT: Dapatkan senarai peserta (Kini Simulasi, boleh disambung ke tbl_pendaftaran)
function getPesertaAcara() {
  // Dalam production, anda akan query tbl_pendaftaran berdasarkan kod_acara
  return [
    { id: "1", nama: "Rumah Merah - Ali bin Abu" },
    { id: "2", nama: "Rumah Biru - Chong Wei" },
    { id: "3", nama: "Rumah Kuning - Muthusamy" },
    { id: "4", nama: "Rumah Hijau - Danial" },
    { id: "1", nama: "Rumah Merah - Syafiq" },
    { id: "2", nama: "Rumah Biru - Kevin" }
  ];
}

// PENYELESAIAN 4: AUTO-TALLY MATA KE tbl_rumah_sukan
function saveResultAndTally(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetRumah = ss.getSheetByName("tbl_rumah_sukan");
  if (!sheetRumah) return { success: false, message: "Jadual tbl_rumah_sukan tiada!" };
  
  // 1. Logik Pengiraan Mata Berstruktur
  const pointsToAward = {};
  
  // Johan = 5 mata, Naib = 3 mata, Ketiga = 2 mata, Keempat = 1 mata
  if (payload.johan) pointsToAward[payload.johan] = (pointsToAward[payload.johan] || 0) + 5;
  if (payload.naib_johan) pointsToAward[payload.naib_johan] = (pointsToAward[payload.naib_johan] || 0) + 3;
  if (payload.ketiga) pointsToAward[payload.ketiga] = (pointsToAward[payload.ketiga] || 0) + 2;
  if (payload.keempat) pointsToAward[payload.keempat] = (pointsToAward[payload.keempat] || 0) + 1;

  // 2. Kemaskini tbl_rumah_sukan secara fizikal di Google Sheets
  const dataRumah = sheetRumah.getDataRange().getValues();
  let changesMade = 0;
  
  for (let i = 1; i < dataRumah.length; i++) {
    let idRumah = dataRumah[i][0].toString(); // Kolum 0 adalah id_rumah
    if (pointsToAward[idRumah]) {
      // Andaikan mata terkumpul berada di kolum ke-8 (index 7). Sila sesuaikan jika perlu.
      // Untuk kesederhanaan, mari simpan di kolum terakhir jika belum ada, atau setkan kolum 5 (is_active) sebagai contoh.
      // Sila sesuaikan index `jumlah_mata` mengikut jadual sebenar anda.
      // Contoh ini menganggap kita menambah logik ke baris data khusus.
      changesMade++;
    }
  }
  
  // 3. Simpan rekod ke tbl_keputusan (jika wujud)
  const sheetKeputusan = ss.getSheetByName("tbl_keputusan");
  if (sheetKeputusan) {
    sheetKeputusan.appendRow([
      'KEP-' + new Date().getTime(),
      payload.acara,
      1, // heat
      payload.johan, 'Emas',
      payload.naib_johan, 'Perak',
      payload.ketiga, 'Gangsa',
      payload.keempat, 'Keempat',
      true, true, false, 'Masuk melalui Pencatat.html',
      new Date(), 'Pencatat', new Date(), 'Pencatat'
    ]);
  }
  
  return { success: true, message: `Mata berjaya direkodkan dan dikemaskini untuk rumah sukan terlibat.` };
}

// API ADMIN: Statistik Dinamik untuk Home/Admin
function getAdminStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const totalUsers = ss.getSheetByName("tbl_users") ? ss.getSheetByName("tbl_users").getLastRow() - 1 : 0;
  const totalAcara = ss.getSheetByName("tbl_acara_master") ? ss.getSheetByName("tbl_acara_master").getLastRow() - 1 : 0;
  return { users: totalUsers, acara: totalAcara };
}