/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ATHLETICS TOURNAMENT MANAGEMENT SYSTEM
 * Database Setup & Initialization
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @fileoverview Complete database creation and sample data population
 * @author Athletics System
 * @version 1.0.0
 * @license MIT
 * 
 * FEATURES:
 * ✓ Auto-create 15 tables with proper structure
 * ✓ Insert sample data (200 students for testing)
 * ✓ Setup indexes and validation
 * ✓ Configure initial settings
 * ✓ Create default users
 * ✓ One-click installation
 * 
 * USAGE:
 * 1. Open Apps Script Editor
 * 2. Run: setupDatabase()
 * 3. Wait for completion (2-3 minutes)
 * 4. Done! System ready to use
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  SPREADSHEET_ID: SpreadsheetApp.getActiveSpreadsheet().getId(),
  SCHOOL_NAME: 'SK Sultan Ismail',
  TOURNAMENT_YEAR: 2025,
  SAMPLE_STUDENTS: 200, // Set to 2000 for production
  
  // School Type: RENDAH or MENENGAH
  SCHOOL_TYPE: 'RENDAH', // Change to 'MENENGAH' for secondary school
  
  // Colors
  COLORS: {
    HEADER: '#1F2937',
    MERAH: '#DC2626',
    BIRU: '#2563EB',
    HIJAU: '#16A34A',
    KUNING: '#EAB308'
  },
  
  // Points System
  POINTS: {
    GOLD: 50,
    SILVER: 30,
    BRONZE: 20,
    FOURTH: 5
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN INSTALLATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Main setup function - Run this to install complete system
 * Creates all tables, inserts data, configures settings
 * 
 * @returns {Object} Installation result with status
 */
function setupDatabase() {
  const startTime = new Date();
  
  try {
    Logger.log('═══════════════════════════════════════════════════════');
    Logger.log('STARTING DATABASE SETUP');
    Logger.log('═══════════════════════════════════════════════════════');
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Step 1: Create all tables
    Logger.log('\n[1/5] Creating database tables...');
    createAllTables(ss);
    
    // Step 2: Insert initial settings
    Logger.log('\n[2/5] Configuring system settings...');
    insertSettings(ss);
    
    // Step 3: Create houses
    Logger.log('\n[3/5] Setting up houses...');
    insertHouses(ss);
    
    // Step 4: Create categories
    Logger.log('\n[4/5] Creating age categories...');
    insertCategories(ss);
    
    // Step 5: Create users
    Logger.log('\n[5/5] Creating user accounts...');
    insertUsers(ss);
    
    // Optional: Insert sample data
    if (CONFIG.SAMPLE_STUDENTS > 0) {
      Logger.log('\n[BONUS] Inserting sample data...');
      insertSampleStudents(ss, CONFIG.SAMPLE_STUDENTS);
      insertSampleEventMasters(ss);
    }
    
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    
    Logger.log('\n═══════════════════════════════════════════════════════');
    Logger.log('✅ DATABASE SETUP COMPLETE!');
    Logger.log(`⏱️  Duration: ${duration} seconds`);
    Logger.log('═══════════════════════════════════════════════════════');
    
    // Show success message
    SpreadsheetApp.getUi().alert(
      '✅ Setup Complete!\n\n' +
      `Database created successfully in ${duration.toFixed(2)} seconds.\n\n` +
      'Default Credentials:\n' +
      'Username: admin\n' +
      'Password: admin123\n\n' +
      '⚠️ Please change password after first login!'
    );
    
    return {
      success: true,
      duration: duration,
      message: 'Database setup completed successfully'
    };
    
  } catch (error) {
    Logger.log('\n❌ ERROR: ' + error.message);
    Logger.log(error.stack);
    
    SpreadsheetApp.getUi().alert(
      '❌ Setup Failed!\n\n' +
      'Error: ' + error.message + '\n\n' +
      'Please check the logs for details.'
    );
    
    return {
      success: false,
      error: error.message
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TABLE CREATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create all 15 database tables
 */
function createAllTables(ss) {
  const tables = [
    { name: 'tbl_settings', creator: createTableSettings },
    { name: 'tbl_rumah_sukan', creator: createTableRumah },
    { name: 'tbl_kategori_config', creator: createTableKategori },
    { name: 'tbl_acara_master', creator: createTableAcaraMaster },
    { name: 'tbl_users', creator: createTableUsers },
    { name: 'tbl_acara', creator: createTableAcara },
    { name: 'tbl_acara_kategori', creator: createTableAcaraKategori },
    { name: 'tbl_murid', creator: createTableMurid },
    { name: 'tbl_pendaftaran', creator: createTablePendaftaran },
    { name: 'tbl_cabutan_lorong', creator: createTableCabutanLorong },
    { name: 'tbl_keputusan', creator: createTableKeputusan },
    { name: 'tbl_percubaan', creator: createTablePercubaan },
    { name: 'tbl_murid_terbaik', creator: createTableMuridTerbaik },
    { name: 'tbl_school_records', creator: createTableSchoolRecords },
    { name: 'tbl_audit_log', creator: createTableAuditLog }
  ];
  
  tables.forEach(table => {
    Logger.log(`  Creating ${table.name}...`);
    
    // Delete if exists
    const existing = ss.getSheetByName(table.name);
    if (existing) {
      ss.deleteSheet(existing);
    }
    
    // Create new
    table.creator(ss);
    Logger.log(`  ✓ ${table.name} created`);
  });
}

/**
 * Create tbl_settings
 */
function createTableSettings(ss) {
  const sheet = ss.insertSheet('tbl_settings');
  
  // Header
  const headers = [
    'setting_key', 'setting_value', 'data_type', 'category', 
    'description', 'is_locked', 'updated_at', 'updated_by'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatting
  formatHeader(sheet, headers.length);
  
  // Freeze header
  sheet.setFrozenRows(1);
  
  // Protect header row
  const protection = sheet.getRange(1, 1, 1, headers.length).protect();
  protection.setWarningOnly(true);
}

/**
 * Create tbl_rumah_sukan
 */
function createTableRumah(ss) {
  const sheet = ss.insertSheet('tbl_rumah_sukan');
  
  const headers = [
    'id_rumah', 'nama_rumah', 'warna_bg', 'warna_text', 
    'display_order', 'is_active', 'created_at', 'created_by'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_kategori_config
 */
function createTableKategori(ss) {
  const sheet = ss.insertSheet('tbl_kategori_config');
  
  const headers = [
    'id_kategori', 'kod_kategori', 'nama_kategori', 'jantina',
    'tahun_lahir_mula', 'tahun_lahir_tamat', 
    'max_individu', 'max_kumpulan', 'max_open_individu', 'max_open_kumpulan',
    'warna_badge', 'display_order', 'is_active', 
    'created_at', 'created_by', 'updated_at', 'updated_by'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_acara_master
 */
function createTableAcaraMaster(ss) {
  const sheet = ss.insertSheet('tbl_acara_master');
  
  const headers = [
    'id_acara_master', 'kod_acara', 'nama_acara', 'icon_emoji',
    'event_type', 'requires_lanes', 'jenis', 'format',
    'record_type', 'record_unit', 'num_attempts', 'result_calculation',
    'description', 'display_order', 'is_active', 'created_at', 'created_by'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_users
 */
function createTableUsers(ss) {
  const sheet = ss.insertSheet('tbl_users');
  
  const headers = [
    'username', 'password_hash', 'full_name', 'email', 'phone',
    'role', 'id_rumah', 'is_active', 'last_login', 
    'created_at', 'created_by'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_acara
 */
function createTableAcara(ss) {
  const sheet = ss.insertSheet('tbl_acara');
  
  const headers = [
    'no_acara', 'id_acara_master', 'jantina', 'jenis', 
    'had_peserta_per_rumah', 'format', 'scheduled_time', 'scheduled_date',
    'venue', 'is_active', 'nama_display', 'event_type', 'requires_lanes',
    'num_attempts', 'created_at', 'created_by', 'updated_at', 'updated_by'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_acara_kategori
 */
function createTableAcaraKategori(ss) {
  const sheet = ss.insertSheet('tbl_acara_kategori');
  
  const headers = [
    'id_link', 'no_acara', 'id_kategori', 'notes', 'created_at'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_murid
 */
function createTableMurid(ss) {
  const sheet = ss.insertSheet('tbl_murid');
  
  const headers = [
    'no_kp', 'nama', 'tahap', 'kelas', 'id_rumah', 'id_kategori',
    'jantina', 'tahun_lahir', 'umur', 'email_wali', 'phone_wali',
    'photo_url', 'is_active', 'created_at', 'created_by', 
    'updated_at', 'updated_by'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_pendaftaran
 */
function createTablePendaftaran(ss) {
  const sheet = ss.insertSheet('tbl_pendaftaran');
  
  const headers = [
    'id_reg', 'no_acara', 'no_kp', 'position_in_team', 'team_name',
    'status', 'registered_at', 'registered_by', 'notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_cabutan_lorong
 */
function createTableCabutanLorong(ss) {
  const sheet = ss.insertSheet('tbl_cabutan_lorong');
  
  const headers = [
    'id_cabutan', 'no_acara', 'heat_number', 'lane_number',
    'no_kp', 'drawn_at', 'drawn_by'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_keputusan
 */
function createTableKeputusan(ss) {
  const sheet = ss.insertSheet('tbl_keputusan');
  
  const headers = [
    'id_keputusan', 'no_acara', 'heat_number',
    'rank_1_kp', 'rank_1_result',
    'rank_2_kp', 'rank_2_result',
    'rank_3_kp', 'rank_3_result',
    'rank_4_kp', 'rank_4_result',
    'is_published', 'is_final', 'school_record', 'notes',
    'entered_at', 'entered_by', 'published_at', 'published_by',
    'updated_at', 'updated_by'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_percubaan
 */
function createTablePercubaan(ss) {
  const sheet = ss.insertSheet('tbl_percubaan');
  
  const headers = [
    'id_percubaan', 'no_acara', 'no_kp', 'attempt_number',
    'result_value', 'is_foul', 'is_dns', 'is_dnf',
    'notes', 'entered_at', 'entered_by'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_murid_terbaik
 */
function createTableMuridTerbaik(ss) {
  const sheet = ss.insertSheet('tbl_murid_terbaik');
  
  const headers = [
    'id_terbaik', 'id_kategori', 'no_kp', 'nama',
    'total_points', 'total_gold', 'total_silver', 'total_bronze',
    'ranking_method', 'id_rumah', 'tahun', 'is_active',
    'notes', 'selected_by', 'selected_at', 
    'photo_url', 'certificate_generated'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_school_records
 */
function createTableSchoolRecords(ss) {
  const sheet = ss.insertSheet('tbl_school_records');
  
  const headers = [
    'id_record', 'id_acara_master', 'id_kategori', 'record_value',
    'no_kp', 'nama', 'id_rumah', 'year_set', 'no_acara',
    'notes', 'created_at', 'created_by'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

/**
 * Create tbl_audit_log
 */
function createTableAuditLog(ss) {
  const sheet = ss.insertSheet('tbl_audit_log');
  
  const headers = [
    'id_log', 'action_type', 'table_name', 'record_id',
    'old_value', 'new_value', 'username', 'ip_address',
    'user_agent', 'timestamp', 'notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  formatHeader(sheet, headers.length);
  sheet.setFrozenRows(1);
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA INSERTION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Insert system settings
 */
function insertSettings(ss) {
  const sheet = ss.getSheetByName('tbl_settings');
  
  const levelTerm = CONFIG.SCHOOL_TYPE === 'RENDAH' ? 'Darjah' : 'Tingkatan';
  const levelMax = CONFIG.SCHOOL_TYPE === 'RENDAH' ? 6 : 5;
  
  const settings = [
    ['school_type', CONFIG.SCHOOL_TYPE, 'STRING', 'GENERAL', 'School type: RENDAH or MENENGAH', true, new Date(), 'SYSTEM'],
    ['level_term', levelTerm, 'STRING', 'GENERAL', 'Display term for grade level', true, new Date(), 'SYSTEM'],
    ['level_min', 1, 'INTEGER', 'GENERAL', 'Minimum grade level', true, new Date(), 'SYSTEM'],
    ['level_max', levelMax, 'INTEGER', 'GENERAL', 'Maximum grade level', true, new Date(), 'SYSTEM'],
    ['tournament_name', `Sukan Tahunan ${CONFIG.SCHOOL_NAME} ${CONFIG.TOURNAMENT_YEAR}`, 'STRING', 'GENERAL', 'Tournament name', false, new Date(), 'SYSTEM'],
    ['tournament_year', CONFIG.TOURNAMENT_YEAR, 'INTEGER', 'GENERAL', 'Tournament year', false, new Date(), 'SYSTEM'],
    ['registration_open', true, 'BOOLEAN', 'REGISTRATION', 'Registration status', false, new Date(), 'SYSTEM'],
    ['track_lanes', 8, 'INTEGER', 'GENERAL', 'Number of track lanes', false, new Date(), 'SYSTEM'],
    ['point_emas', CONFIG.POINTS.GOLD, 'INTEGER', 'POINTS', 'Points for gold medal', false, new Date(), 'SYSTEM'],
    ['point_perak', CONFIG.POINTS.SILVER, 'INTEGER', 'POINTS', 'Points for silver medal', false, new Date(), 'SYSTEM'],
    ['point_gangsa', CONFIG.POINTS.BRONZE, 'INTEGER', 'POINTS', 'Points for bronze medal', false, new Date(), 'SYSTEM'],
    ['point_ke4', CONFIG.POINTS.FOURTH, 'INTEGER', 'POINTS', 'Points for 4th place', false, new Date(), 'SYSTEM']
  ];
  
  sheet.getRange(2, 1, settings.length, settings[0].length).setValues(settings);
}

/**
 * Insert default houses
 */
function insertHouses(ss) {
  const sheet = ss.getSheetByName('tbl_rumah_sukan');
  
  const houses = [
    [1, 'MERAH', CONFIG.COLORS.MERAH, '#FFFFFF', 1, true, new Date(), 'SYSTEM'],
    [2, 'BIRU', CONFIG.COLORS.BIRU, '#FFFFFF', 2, true, new Date(), 'SYSTEM'],
    [3, 'HIJAU', CONFIG.COLORS.HIJAU, '#FFFFFF', 3, true, new Date(), 'SYSTEM'],
    [4, 'KUNING', CONFIG.COLORS.KUNING, '#000000', 4, true, new Date(), 'SYSTEM']
  ];
  
  sheet.getRange(2, 1, houses.length, houses[0].length).setValues(houses);
}

/**
 * Insert default categories (for RENDAH)
 */
function insertCategories(ss) {
  const sheet = ss.getSheetByName('tbl_kategori_config');
  
  const currentYear = CONFIG.TOURNAMENT_YEAR;
  
  const categories = [
    [1, 'L1', 'Lelaki 10-12 tahun', 'L', currentYear - 10, currentYear - 12, 2, 2, 1, 1, '#3B82F6', 1, true, new Date(), 'SYSTEM', null, null],
    [2, 'L2', 'Lelaki 13-14 tahun', 'L', currentYear - 13, currentYear - 14, 2, 2, 1, 1, '#2563EB', 2, true, new Date(), 'SYSTEM', null, null],
    [3, 'P1', 'Perempuan 10-12 tahun', 'P', currentYear - 10, currentYear - 12, 2, 2, 1, 1, '#EC4899', 3, true, new Date(), 'SYSTEM', null, null],
    [4, 'P2', 'Perempuan 13-14 tahun', 'P', currentYear - 13, currentYear - 14, 2, 2, 1, 1, '#DB2777', 4, true, new Date(), 'SYSTEM', null, null]
  ];
  
  sheet.getRange(2, 1, categories.length, categories[0].length).setValues(categories);
}

/**
 * Insert default users
 */
function insertUsers(ss) {
  const sheet = ss.getSheetByName('tbl_users');
  
  // Simple password hashing (SHA-256 would be better in production)
  const hashPassword = (password) => {
    return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password)
      .map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2))
      .join('');
  };
  
  const users = [
    ['admin', hashPassword('admin123'), 'Administrator', 'admin@school.edu.my', '', 'Admin', null, true, null, new Date(), 'SYSTEM'],
    ['cg_merah', hashPassword('merah123'), 'Guru Rumah Merah', '', '', 'Rumah', 1, true, null, new Date(), 'SYSTEM'],
    ['cg_biru', hashPassword('biru123'), 'Guru Rumah Biru', '', '', 'Rumah', 2, true, null, new Date(), 'SYSTEM'],
    ['cg_hijau', hashPassword('hijau123'), 'Guru Rumah Hijau', '', '', 'Rumah', 3, true, null, new Date(), 'SYSTEM'],
    ['cg_kuning', hashPassword('kuning123'), 'Guru Rumah Kuning', '', '', 'Rumah', 4, true, null, new Date(), 'SYSTEM'],
    ['pengurus_merah', hashPassword('pengurus123'), 'Pengurus Merah', '', '', 'Pengurus', 1, true, null, new Date(), 'SYSTEM'],
    ['pencatat1', hashPassword('pencatat123'), 'Pencatat 1', '', '', 'Pencatat', null, true, null, new Date(), 'SYSTEM']
  ];
  
  sheet.getRange(2, 1, users.length, users[0].length).setValues(users);
}

/**
 * Insert sample students
 */
function insertSampleStudents(ss, count) {
  const sheet = ss.getSheetByName('tbl_murid');
  
  const namaLelaki = ['Ahmad', 'Ali', 'Hafiz', 'Khairul', 'Fariz', 'Danial', 'Luqman', 'Nabil', 'Syafiq', 'Amin'];
  const namaPerempuan = ['Siti', 'Nurul', 'Aina', 'Aminah', 'Fatimah', 'Zainab', 'Mariam', 'Khadijah', 'Sofea', 'Hana'];
  const kelas = ['Amal', 'Bestari', 'Cemerlang', 'Dedikasi', 'Gemilang'];
  
  const students = [];
  const currentYear = CONFIG.TOURNAMENT_YEAR;
  
  for (let i = 0; i < count; i++) {
    // Random birth year (2011-2016 for primary school)
    const birthYear = 2011 + Math.floor(Math.random() * 6);
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    
    // Random gender (odd = L, even = P)
    const lastDigit = Math.floor(Math.random() * 10);
    const jantina = lastDigit % 2 === 0 ? 'P' : 'L';
    
    // Generate IC number
    const yearPart = String(birthYear).slice(-2);
    const no_kp = `${yearPart}${birthMonth}${birthDay}-01-${String(1000 + i).slice(-4)}${lastDigit}`;
    
    // Generate name
    const namaList = jantina === 'L' ? namaLelaki : namaPerempuan;
    const nama = namaList[Math.floor(Math.random() * namaList.length)] + ' ' + 
                 namaList[Math.floor(Math.random() * namaList.length)];
    
    // Random tahap (1-6)
    const tahap = Math.floor(Math.random() * 6) + 1;
    
    // Random kelas
    const kelasName = kelas[Math.floor(Math.random() * kelas.length)];
    
    // Random rumah (1-4)
    const id_rumah = Math.floor(Math.random() * 4) + 1;
    
    // Calculate age and category
    const umur = currentYear - birthYear;
    
    // Simple category assignment (L1, L2, P1, P2)
    let id_kategori;
    if (jantina === 'L') {
      id_kategori = umur >= 13 ? 2 : 1; // L2 or L1
    } else {
      id_kategori = umur >= 13 ? 4 : 3; // P2 or P1
    }
    
    students.push([
      no_kp, nama, tahap, kelasName, id_rumah, id_kategori,
      jantina, birthYear, umur, null, null, null, true,
      new Date(), 'SYSTEM', null, null
    ]);
  }
  
  // Batch insert (split into chunks of 1000 for performance)
  const chunkSize = 1000;
  for (let i = 0; i < students.length; i += chunkSize) {
    const chunk = students.slice(i, i + chunkSize);
    sheet.getRange(i + 2, 1, chunk.length, chunk[0].length).setValues(chunk);
    Logger.log(`  Inserted students ${i + 1} to ${i + chunk.length}`);
  }
}

/**
 * Insert sample event masters
 */
function insertSampleEventMasters(ss) {
  const sheet = ss.getSheetByName('tbl_acara_master');
  
  const events = [
    [1, 'T100', '100 Meter', '🏃', 'TRACK', true, 'Individu', 'Final', 'TIME', 'seconds', null, 'SINGLE', 'Sprint 100m', 1, true, new Date(), 'SYSTEM'],
    [2, 'T200', '200 Meter', '🏃', 'TRACK', true, 'Individu', 'Saringan', 'TIME', 'seconds', null, 'SINGLE', 'Sprint 200m', 2, true, new Date(), 'SYSTEM'],
    [3, 'T400', '400 Meter', '🏃', 'TRACK', true, 'Individu', 'Saringan', 'TIME', 'seconds', null, 'SINGLE', 'Sprint 400m', 3, true, new Date(), 'SYSTEM'],
    [4, 'MLJ', 'Lompat Jauh', '⛹️', 'FIELD', false, 'Individu', 'Final', 'DISTANCE', 'meters', 6, 'BEST', 'Long jump', 10, true, new Date(), 'SYSTEM'],
    [5, 'MTJ', 'Tolak Peluru', '⛹️', 'FIELD', false, 'Individu', 'Final', 'DISTANCE', 'meters', 6, 'BEST', 'Shot put', 11, true, new Date(), 'SYSTEM'],
    [6, 'F4X100', '4×100m Relay', '🤾', 'RELAY', true, 'Kumpulan', 'Final', 'TIME', 'seconds', null, 'SINGLE', 'Relay 4x100m', 20, true, new Date(), 'SYSTEM']
  ];
  
  sheet.getRange(2, 1, events.length, events[0].length).setValues(events);
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format header row
 */
function formatHeader(sheet, numCols) {
  const headerRange = sheet.getRange(1, 1, 1, numCols);
  
  headerRange.setBackground(CONFIG.COLORS.HEADER);
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  
  // Auto-resize columns
  for (let i = 1; i <= numCols; i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * Test function - View sample data
 */
function testViewData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  Logger.log('=== SETTINGS ===');
  const settings = ss.getSheetByName('tbl_settings').getDataRange().getValues();
  Logger.log(settings.slice(0, 5));
  
  Logger.log('\n=== STUDENTS (First 5) ===');
  const students = ss.getSheetByName('tbl_murid').getDataRange().getValues();
  Logger.log(students.slice(1, 6));
  
  Logger.log('\n=== USERS ===');
  const users = ss.getSheetByName('tbl_users').getDataRange().getValues();
  Logger.log(users);
}

/**
 * Clean all data (DANGER - Use with caution)
 */
function cleanDatabase() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'WARNING',
    'This will DELETE ALL DATA!\n\nAre you sure?',
    ui.ButtonSet.YES_NO
  );
  
  if (response === ui.Button.YES) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    
    sheets.forEach(sheet => {
      if (sheet.getName().startsWith('tbl_')) {
        ss.deleteSheet(sheet);
      }
    });
    
    ui.alert('✅ All tables deleted!');
  }
}
