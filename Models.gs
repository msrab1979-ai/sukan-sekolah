/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ATHLETICS TOURNAMENT MANAGEMENT SYSTEM
 * Models & Services - Separated for Clean Architecture
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @fileoverview Data access layer and business services
 * @author Athletics System
 * @version 1.0.0
 * 
 * CONTAINS:
 * • Model classes for all tables
 * • Business logic services
 * • Validation services
 * • Calculation services
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// BASE MODEL CLASS
// ═══════════════════════════════════════════════════════════════════════════

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.ss = SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
  }
  
  /**
   * Get sheet
   */
  getSheet() {
    return this.ss.getSheetByName(this.tableName);
  }
  
  /**
   * Get all data as objects
   */
  getAll(filters = {}) {
    const sheet = this.getSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) return [];
    
    const headers = data[0];
    let results = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
    
    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        results = results.filter(item => item[key] === filters[key]);
      }
    });
    
    return results;
  }
  
  /**
   * Find by ID
   */
  findById(id, columnIndex = 0) {
    const sheet = this.getSheet();
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][columnIndex] === id) {
        const headers = data[0];
        const obj = { _row: i + 1, _data: data[i] };
        headers.forEach((header, idx) => {
          obj[header] = data[i][idx];
        });
        return obj;
      }
    }
    
    return null;
  }
  
  /**
   * Insert new record
   */
  insert(values) {
    const sheet = this.getSheet();
    sheet.appendRow(values);
    return true;
  }
  
  /**
   * Update record
   */
  update(rowIndex, values) {
    const sheet = this.getSheet();
    sheet.getRange(rowIndex, 1, 1, values.length).setValues([values]);
    return true;
  }
  
  /**
   * Delete record
   */
  delete(rowIndex) {
    const sheet = this.getSheet();
    sheet.deleteRow(rowIndex);
    return true;
  }
  
  /**
   * Count records
   */
  count(filters = {}) {
    return this.getAll(filters).length;
  }
  
  /**
   * Get headers
   */
  getHeaders() {
    const sheet = this.getSheet();
    return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MODEL CLASSES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Settings Model
 */
class SettingsModel extends BaseModel {
  constructor() {
    super('tbl_settings');
  }
  
  getSetting(key) {
    const settings = this.getAll({ setting_key: key });
    return settings.length > 0 ? settings[0].setting_value : null;
  }
  
  setSetting(key, value, username) {
    const setting = this.findById(key, 0);
    
    if (setting) {
      // Check if locked
      if (setting.is_locked) {
        throw new Error('Setting is locked');
      }
      
      const values = [...setting._data];
      values[1] = value; // setting_value
      values[6] = new Date(); // updated_at
      values[7] = username; // updated_by
      
      this.update(setting._row, values);
    } else {
      throw new Error('Setting not found: ' + key);
    }
    
    return true;
  }
  
  getAllAsObject() {
    const settings = this.getAll();
    const obj = {};
    settings.forEach(s => {
      obj[s.setting_key] = {
        value: s.setting_value,
        type: s.data_type,
        category: s.category,
        locked: s.is_locked
      };
    });
    return obj;
  }
  
  getSchoolType() {
    return this.getSetting('school_type') || 'RENDAH';
  }
  
  getLevelTerm() {
    return this.getSetting('level_term') || 'Darjah';
  }
  
  getPoints() {
    return {
      gold: parseInt(this.getSetting('point_emas')) || 50,
      silver: parseInt(this.getSetting('point_perak')) || 30,
      bronze: parseInt(this.getSetting('point_gangsa')) || 20,
      fourth: parseInt(this.getSetting('point_ke4')) || 5
    };
  }
  
  isRegistrationOpen() {
    return this.getSetting('registration_open') === 'true';
  }
}

/**
 * Rumah Model
 */
class RumahModel extends BaseModel {
  constructor() {
    super('tbl_rumah_sukan');
  }
  
  getActive() {
    return this.getAll({ is_active: true });
  }
  
  createRumah(data, username) {
    const all = this.getAll();
    const nextId = all.length > 0 ? Math.max(...all.map(r => r.id_rumah)) + 1 : 1;
    
    this.insert([
      nextId,
      data.nama_rumah.toUpperCase(),
      data.warna_bg,
      data.warna_text,
      nextId,
      true,
      new Date(),
      username
    ]);
    
    return nextId;
  }
  
  updateRumah(id_rumah, data) {
    const rumah = this.findById(id_rumah);
    if (!rumah) throw new Error('Rumah not found');
    
    const values = [...rumah._data];
    values[1] = data.nama_rumah.toUpperCase();
    values[2] = data.warna_bg;
    values[3] = data.warna_text;
    values[5] = data.is_active;
    
    this.update(rumah._row, values);
    return true;
  }
  
  getRumahColor(id_rumah) {
    const rumah = this.findById(id_rumah);
    return rumah ? {
      bg: rumah.warna_bg,
      text: rumah.warna_text,
      nama: rumah.nama_rumah
    } : null;
  }
}

/**
 * Kategori Model
 */
class KategoriModel extends BaseModel {
  constructor() {
    super('tbl_kategori_config');
  }
  
  getActive() {
    return this.getAll({ is_active: true });
  }
  
  createKategori(data, username) {
    const all = this.getAll();
    const nextId = all.length > 0 ? Math.max(...all.map(k => k.id_kategori)) + 1 : 1;
    
    this.insert([
      nextId,
      data.kod_kategori,
      data.nama_kategori,
      data.jantina,
      data.tahun_lahir_mula,
      data.tahun_lahir_tamat,
      data.max_individu || 2,
      data.max_kumpulan || 2,
      data.max_open_individu || 1,
      data.max_open_kumpulan || 1,
      data.warna_badge || '#3B82F6',
      nextId,
      true,
      new Date(),
      username,
      null,
      null
    ]);
    
    return nextId;
  }
  
  matchCategory(jantina, tahun_lahir) {
    const categories = this.getActive().filter(k => k.jantina === jantina);
    
    for (let cat of categories) {
      if (tahun_lahir >= cat.tahun_lahir_tamat && 
          tahun_lahir <= cat.tahun_lahir_mula) {
        return cat;
      }
    }
    
    return null;
  }
  
  getQuota(id_kategori, type) {
    const kategori = this.findById(id_kategori);
    if (!kategori) return 0;
    
    switch(type) {
      case 'individu': return kategori.max_individu;
      case 'kumpulan': return kategori.max_kumpulan;
      case 'open_individu': return kategori.max_open_individu;
      case 'open_kumpulan': return kategori.max_open_kumpulan;
      default: return 0;
    }
  }
}

/**
 * Event Master Model
 */
class AcaraMasterModel extends BaseModel {
  constructor() {
    super('tbl_acara_master');
  }
  
  getActive() {
    return this.getAll({ is_active: true });
  }
  
  createMaster(data, username) {
    const all = this.getAll();
    const nextId = all.length > 0 ? Math.max(...all.map(m => m.id_acara_master)) + 1 : 1;
    
    this.insert([
      nextId,
      data.kod_acara,
      data.nama_acara,
      data.icon_emoji || '🏃',
      data.event_type,
      data.requires_lanes,
      data.jenis,
      data.format,
      data.record_type,
      data.record_unit,
      data.num_attempts || null,
      data.result_calculation || 'SINGLE',
      data.description || '',
      nextId,
      true,
      new Date(),
      username
    ]);
    
    return nextId;
  }
  
  getByType(event_type) {
    return this.getAll({ event_type: event_type, is_active: true });
  }
  
  requiresLanes(id_acara_master) {
    const master = this.findById(id_acara_master);
    return master ? master.requires_lanes : false;
  }
}

/**
 * Acara (Event Instance) Model
 */
class AcaraModel extends BaseModel {
  constructor() {
    super('tbl_acara');
  }
  
  getActive() {
    return this.getAll({ is_active: true });
  }
  
  createEvent(data, username) {
    this.insert([
      data.no_acara,
      data.id_acara_master,
      data.jantina,
      data.jenis,
      data.had_peserta_per_rumah,
      data.format,
      data.scheduled_time || null,
      data.scheduled_date || null,
      data.venue || null,
      true,
      data.nama_display,
      data.event_type,
      data.requires_lanes,
      data.num_attempts || null,
      new Date(),
      username,
      null,
      null
    ]);
    
    return data.no_acara;
  }
  
  getByMaster(id_acara_master) {
    return this.getAll({ id_acara_master: id_acara_master, is_active: true });
  }
  
  isOpen(no_acara) {
    return no_acara.includes('OPEN');
  }
  
  getEventType(no_acara) {
    const event = this.findById(no_acara, 0);
    return event ? event.event_type : null;
  }
}

/**
 * Acara-Kategori Junction Model
 */
class AcaraKategoriModel extends BaseModel {
  constructor() {
    super('tbl_acara_kategori');
  }
  
  linkCategory(no_acara, id_kategori, notes = null) {
    const all = this.getAll();
    const nextId = all.length > 0 ? Math.max(...all.map(ak => ak.id_link || 0)) + 1 : 1;
    
    this.insert([
      nextId,
      no_acara,
      id_kategori,
      notes,
      new Date()
    ]);
    
    return nextId;
  }
  
  getEventCategories(no_acara) {
    return this.getAll({ no_acara: no_acara })
      .map(ak => ak.id_kategori);
  }
  
  getCategoryEvents(id_kategori) {
    return this.getAll({ id_kategori: id_kategori })
      .map(ak => ak.no_acara);
  }
  
  isEligible(no_acara, id_kategori) {
    const links = this.getAll({ no_acara: no_acara, id_kategori: id_kategori });
    return links.length > 0;
  }
}

/**
 * Murid (Student) Model
 */
class MuridModel extends BaseModel {
  constructor() {
    super('tbl_murid');
  }
  
  getActive() {
    return this.getAll({ is_active: true });
  }
  
  createStudent(data, username) {
    // Validate IC
    if (!this.validateIC(data.no_kp)) {
      throw new Error('Invalid IC format');
    }
    
    // Check duplicate
    if (this.findById(data.no_kp, 0)) {
      throw new Error('IC already exists');
    }
    
    // Derive from IC
    const derived = this.deriveFromIC(data.no_kp);
    
    // Match category
    const kategoriModel = new KategoriModel();
    const kategori = kategoriModel.matchCategory(derived.jantina, derived.tahun_lahir);
    
    this.insert([
      data.no_kp,
      data.nama,
      data.tahap,
      data.kelas,
      data.id_rumah,
      kategori ? kategori.id_kategori : null,
      derived.jantina,
      derived.tahun_lahir,
      derived.umur,
      data.email_wali || null,
      data.phone_wali || null,
      null,
      true,
      new Date(),
      username,
      null,
      null
    ]);
    
    return data.no_kp;
  }
  
  updateStudent(no_kp, data, username) {
    const student = this.findById(no_kp, 0);
    if (!student) throw new Error('Student not found');
    
    // Re-derive if needed
    const derived = this.deriveFromIC(no_kp);
    const kategoriModel = new KategoriModel();
    const kategori = kategoriModel.matchCategory(derived.jantina, derived.tahun_lahir);
    
    const values = [...student._data];
    values[1] = data.nama;
    values[2] = data.tahap;
    values[3] = data.kelas;
    values[4] = data.id_rumah;
    values[5] = kategori ? kategori.id_kategori : values[5];
    values[9] = data.email_wali || values[9];
    values[10] = data.phone_wali || values[10];
    values[15] = new Date();
    values[16] = username;
    
    this.update(student._row, values);
    return true;
  }
  
  getByHouse(id_rumah) {
    return this.getAll({ id_rumah: id_rumah, is_active: true });
  }
  
  getByCategory(id_kategori) {
    return this.getAll({ id_kategori: id_kategori, is_active: true });
  }
  
  search(query, limit = 20) {
    const all = this.getActive();
    const queryLower = query.toLowerCase();
    
    return all.filter(s => 
      s.nama.toLowerCase().includes(queryLower) || 
      s.no_kp.includes(query)
    ).slice(0, limit);
  }
  
  validateIC(no_kp) {
    const pattern = /^\d{6}-\d{2}-\d{4}$/;
    return pattern.test(no_kp);
  }
  
  deriveFromIC(no_kp) {
    const yearPart = parseInt(no_kp.substr(0, 2));
    const birthYear = yearPart <= 24 ? 2000 + yearPart : 1900 + yearPart;
    
    const lastDigit = parseInt(no_kp.slice(-1));
    const jantina = lastDigit % 2 === 0 ? 'P' : 'L';
    
    const currentYear = new Date().getFullYear();
    const umur = currentYear - birthYear;
    
    return {
      tahun_lahir: birthYear,
      jantina: jantina,
      umur: umur
    };
  }
  
  getStudentWithDetails(no_kp) {
    const student = this.findById(no_kp, 0);
    if (!student) return null;
    
    // Get rumah
    const rumahModel = new RumahModel();
    const rumah = rumahModel.findById(student.id_rumah);
    
    // Get kategori
    const kategoriModel = new KategoriModel();
    const kategori = kategoriModel.findById(student.id_kategori);
    
    return {
      ...student,
      rumah: rumah ? {
        nama: rumah.nama_rumah,
        warna_bg: rumah.warna_bg,
        warna_text: rumah.warna_text
      } : null,
      kategori: kategori ? {
        kod: kategori.kod_kategori,
        nama: kategori.nama_kategori
      } : null
    };
  }
}

/**
 * Pendaftaran (Registration) Model
 */
class PendaftaranModel extends BaseModel {
  constructor() {
    super('tbl_pendaftaran');
  }
  
  getActive() {
    return this.getAll({ status: 'ACTIVE' });
  }
  
  registerStudent(data, username) {
    const all = this.getAll();
    const nextId = all.length > 0 ? Math.max(...all.map(r => r.id_reg || 0)) + 1 : 1;
    
    this.insert([
      nextId,
      data.no_acara,
      data.no_kp,
      data.position_in_team || null,
      data.team_name || null,
      'ACTIVE',
      new Date(),
      username,
      data.notes || null
    ]);
    
    return nextId;
  }
  
  withdraw(id_reg) {
    const reg = this.findById(id_reg);
    if (!reg) throw new Error('Registration not found');
    
    const values = [...reg._data];
    values[5] = 'WITHDRAWN';
    
    this.update(reg._row, values);
    return true;
  }
  
  getByEvent(no_acara) {
    return this.getAll({ no_acara: no_acara, status: 'ACTIVE' });
  }
  
  getByStudent(no_kp) {
    return this.getAll({ no_kp: no_kp, status: 'ACTIVE' });
  }
  
  isRegistered(no_kp, no_acara) {
    const regs = this.getAll({ 
      no_kp: no_kp, 
      no_acara: no_acara, 
      status: 'ACTIVE' 
    });
    return regs.length > 0;
  }
  
  countByHouse(no_acara, id_rumah) {
    const regs = this.getByEvent(no_acara);
    const muridModel = new MuridModel();
    
    let count = 0;
    regs.forEach(reg => {
      const student = muridModel.findById(reg.no_kp, 0);
      if (student && student.id_rumah === id_rumah) {
        count++;
      }
    });
    
    return count;
  }
}

/**
 * Cabutan Lorong (Lane Draw) Model
 */
class CabutanLorongModel extends BaseModel {
  constructor() {
    super('tbl_cabutan_lorong');
  }
  
  drawLanes(no_acara, participants, trackLanes, username) {
    // Clear existing
    this.clearEvent(no_acara);
    
    // Calculate heats
    const numHeats = Math.ceil(participants.length / trackLanes);
    
    // Random shuffle
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    
    shuffled.forEach((reg, index) => {
      const heatNumber = Math.floor(index / trackLanes) + 1;
      const laneNumber = (index % trackLanes) + 1;
      
      const all = this.getAll();
      const nextId = all.length > 0 ? Math.max(...all.map(c => c.id_cabutan || 0)) + 1 : 1;
      
      this.insert([
        nextId,
        no_acara,
        heatNumber,
        laneNumber,
        reg.no_kp,
        new Date(),
        username
      ]);
    });
    
    return numHeats;
  }
  
  clearEvent(no_acara) {
    const lanes = this.getAll({ no_acara: no_acara });
    
    lanes.forEach(lane => {
      const found = this.findById(lane.id_cabutan);
      if (found) {
        this.delete(found._row);
      }
    });
  }
  
  getByEvent(no_acara) {
    return this.getAll({ no_acara: no_acara })
      .sort((a, b) => {
        if (a.heat_number !== b.heat_number) {
          return a.heat_number - b.heat_number;
        }
        return a.lane_number - b.lane_number;
      });
  }
  
  getByHeat(no_acara, heat_number) {
    return this.getAll({ no_acara: no_acara, heat_number: heat_number })
      .sort((a, b) => a.lane_number - b.lane_number);
  }
  
  groupByHeat(no_acara) {
    const lanes = this.getByEvent(no_acara);
    const grouped = {};
    
    lanes.forEach(lane => {
      if (!grouped[lane.heat_number]) {
        grouped[lane.heat_number] = [];
      }
      grouped[lane.heat_number].push(lane);
    });
    
    return grouped;
  }
}

/**
 * Keputusan (Results) Model
 */
class KeputusanModel extends BaseModel {
  constructor() {
    super('tbl_keputusan');
  }
  
  getPublished() {
    return this.getAll({ is_published: true });
  }
  
  enterResult(data, username) {
    const all = this.getAll();
    const nextId = all.length > 0 ? Math.max(...all.map(k => k.id_keputusan || 0)) + 1 : 1;
    
    const ranks = data.ranks || [];
    const rank1 = ranks[0] || {};
    const rank2 = ranks[1] || {};
    const rank3 = ranks[2] || {};
    const rank4 = ranks[3] || {};
    
    this.insert([
      nextId,
      data.no_acara,
      data.heat_number || 1,
      rank1.no_kp || null,
      rank1.result || null,
      rank2.no_kp || null,
      rank2.result || null,
      rank3.no_kp || null,
      rank3.result || null,
      rank4.no_kp || null,
      rank4.result || null,
      false,
      data.is_final !== undefined ? data.is_final : true,
      data.school_record || false,
      data.notes || null,
      new Date(),
      username,
      null,
      null,
      null,
      null
    ]);
    
    return nextId;
  }
  
  publish(id_keputusan, username) {
    const result = this.findById(id_keputusan);
    if (!result) throw new Error('Result not found');
    
    const values = [...result._data];
    values[11] = true; // is_published
    values[17] = new Date(); // published_at
    values[18] = username; // published_by
    
    this.update(result._row, values);
    return true;
  }
  
  getByEvent(no_acara) {
    return this.getAll({ no_acara: no_acara });
  }
  
  getFinalResults(no_acara) {
    return this.getAll({ 
      no_acara: no_acara, 
      is_final: true, 
      is_published: true 
    });
  }
}

/**
 * Percubaan (Attempts) Model - For Field Events
 */
class PercubaanModel extends BaseModel {
  constructor() {
    super('tbl_percubaan');
  }
  
  enterAttempts(no_acara, no_kp, attempts, username) {
    // Clear existing
    this.clearAthleteAttempts(no_acara, no_kp);
    
    // Insert new
    attempts.forEach((attempt, index) => {
      const all = this.getAll();
      const nextId = all.length > 0 ? Math.max(...all.map(p => p.id_percubaan || 0)) + 1 : 1;
      
      this.insert([
        nextId,
        no_acara,
        no_kp,
        index + 1,
        attempt.is_foul ? null : attempt.value,
        attempt.is_foul || false,
        attempt.is_dns || false,
        attempt.is_dnf || false,
        attempt.notes || null,
        new Date(),
        username
      ]);
    });
    
    return attempts.length;
  }
  
  clearAthleteAttempts(no_acara, no_kp) {
    const attempts = this.getAll({ no_acara: no_acara, no_kp: no_kp });
    
    attempts.forEach(attempt => {
      const found = this.findById(attempt.id_percubaan);
      if (found) {
        this.delete(found._row);
      }
    });
  }
  
  getAthleteAttempts(no_acara, no_kp) {
    return this.getAll({ no_acara: no_acara, no_kp: no_kp })
      .sort((a, b) => a.attempt_number - b.attempt_number);
  }
  
  getBestAttempt(no_acara, no_kp) {
    const attempts = this.getAthleteAttempts(no_acara, no_kp)
      .filter(a => !a.is_foul && !a.is_dns && !a.is_dnf && a.result_value !== null);
    
    if (attempts.length === 0) return null;
    
    return attempts.reduce((best, current) => {
      return current.result_value > best.result_value ? current : best;
    });
  }
  
  getAllBestAttempts(no_acara) {
    const attempts = this.getAll({ no_acara: no_acara });
    const athletesBest = {};
    
    attempts.forEach(attempt => {
      if (attempt.is_foul || attempt.is_dns || attempt.is_dnf || !attempt.result_value) {
        return;
      }
      
      if (!athletesBest[attempt.no_kp] || 
          attempt.result_value > athletesBest[attempt.no_kp].result_value) {
        athletesBest[attempt.no_kp] = attempt;
      }
    });
    
    return Object.values(athletesBest)
      .sort((a, b) => b.result_value - a.result_value);
  }
}

/**
 * Murid Terbaik (Best Athletes) Model
 */
class MuridTerbaikModel extends BaseModel {
  constructor() {
    super('tbl_murid_terbaik');
  }
  
  getByYear(tahun) {
    return this.getAll({ tahun: tahun, is_active: true });
  }
  
  setBest(data, username) {
    const existing = this.getAll({ 
      id_kategori: data.id_kategori, 
      tahun: data.tahun 
    });
    
    if (existing.length > 0) {
      // Update
      const best = this.findById(existing[0].id_terbaik);
      const values = [...best._data];
      values[2] = data.no_kp;
      values[3] = data.nama;
      values[4] = data.total_points;
      values[5] = data.total_gold;
      values[6] = data.total_silver;
      values[7] = data.total_bronze;
      values[8] = data.ranking_method;
      values[12] = data.notes || null;
      values[13] = username;
      values[14] = new Date();
      
      this.update(best._row, values);
      return existing[0].id_terbaik;
    } else {
      // Insert
      const all = this.getAll();
      const nextId = all.length > 0 ? Math.max(...all.map(m => m.id_terbaik || 0)) + 1 : 1;
      
      this.insert([
        nextId,
        data.id_kategori,
        data.no_kp,
        data.nama,
        data.total_points,
        data.total_gold,
        data.total_silver,
        data.total_bronze,
        data.ranking_method,
        data.id_rumah,
        data.tahun,
        true,
        data.notes || null,
        username,
        new Date(),
        null,
        false
      ]);
      
      return nextId;
    }
  }
}

/**
 * Audit Log Model
 */
class AuditLogModel extends BaseModel {
  constructor() {
    super('tbl_audit_log');
  }
  
  log(action, tableName, recordId, oldValue, newValue, username) {
    try {
      const all = this.getAll();
      const nextId = all.length > 0 ? Math.max(...all.map(a => a.id_log || 0)) + 1 : 1;
      
      this.insert([
        nextId,
        action,
        tableName,
        recordId ? String(recordId) : null,
        oldValue ? JSON.stringify(oldValue) : null,
        newValue ? JSON.stringify(newValue) : null,
        username,
        null,
        null,
        new Date(),
        null
      ]);
    } catch (error) {
      Logger.log('Audit log error: ' + error.message);
    }
  }
  
  getRecent(limit = 100) {
    const all = this.getAll();
    return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
  
  getByUser(username, limit = 100) {
    return this.getAll({ username: username })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
  
  getByAction(action, limit = 100) {
    return this.getAll({ action_type: action })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// BUSINESS SERVICES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validation Service
 */
class ValidationService {
  static validateRegistration(no_kp, no_acara, session) {
    const muridModel = new MuridModel();
    const acaraModel = new AcaraModel();
    const kategoriModel = new KategoriModel();
    const acaraKategoriModel = new AcaraKategoriModel();
    const pendaftaranModel = new PendaftaranModel();
    
    // Get student
    const student = muridModel.findById(no_kp, 0);
    if (!student) {
      return { valid: false, message: 'Student not found' };
    }
    
    // Get event
    const event = acaraModel.findById(no_acara, 0);
    if (!event) {
      return { valid: false, message: 'Event not found' };
    }
    
    // Check if already registered
    if (pendaftaranModel.isRegistered(no_kp, no_acara)) {
      return { valid: false, message: 'Already registered' };
    }
    
    // Check category eligibility
    if (!acaraKategoriModel.isEligible(no_acara, student.id_kategori)) {
      return { valid: false, message: 'Category not eligible' };
    }
    
    // Check quota
    const studentRegs = pendaftaranModel.getByStudent(no_kp);
    const kategori = kategoriModel.findById(student.id_kategori);
    
    const isOpen = acaraModel.isOpen(no_acara);
    const eventJenis = event.jenis;
    
    let currentCount = 0;
    let maxQuota = 0;
    
    if (isOpen) {
      if (eventJenis === 'Individu') {
        currentCount = studentRegs.filter(r => {
          const evt = acaraModel.findById(r.no_acara, 0);
          return evt && acaraModel.isOpen(r.no_acara) && evt.jenis === 'Individu';
        }).length;
        maxQuota = kategori.max_open_individu;
      } else {
        currentCount = studentRegs.filter(r => {
          const evt = acaraModel.findById(r.no_acara, 0);
          return evt && acaraModel.isOpen(r.no_acara) && evt.jenis === 'Kumpulan';
        }).length;
        maxQuota = kategori.max_open_kumpulan;
      }
    } else {
      if (eventJenis === 'Individu') {
        currentCount = studentRegs.filter(r => {
          const evt = acaraModel.findById(r.no_acara, 0);
          return evt && !acaraModel.isOpen(r.no_acara) && evt.jenis === 'Individu';
        }).length;
        maxQuota = kategori.max_individu;
      } else {
        currentCount = studentRegs.filter(r => {
          const evt = acaraModel.findById(r.no_acara, 0);
          return evt && !acaraModel.isOpen(r.no_acara) && evt.jenis === 'Kumpulan';
        }).length;
        maxQuota = kategori.max_kumpulan;
      }
    }
    
    if (currentCount >= maxQuota) {
      return { 
        valid: false, 
        message: `Quota penuh: ${currentCount}/${maxQuota}` 
      };
    }
    
    // Check house quota
    const houseCount = pendaftaranModel.countByHouse(no_acara, student.id_rumah);
    if (houseCount >= event.had_peserta_per_rumah) {
      return { 
        valid: false, 
        message: `Quota rumah penuh: ${houseCount}/${event.had_peserta_per_rumah}` 
      };
    }
    
    return { valid: true };
  }
}

/**
 * Medal Tally Service
 */
class MedalTallyService {
  static calculate() {
    const keputusanModel = new KeputusanModel();
    const rumahModel = new RumahModel();
    const muridModel = new MuridModel();
    const settingsModel = new SettingsModel();
    
    const results = keputusanModel.getPublished()
      .filter(r => r.is_final === true);
    
    const points = settingsModel.getPoints();
    const houses = rumahModel.getActive();
    
    const tally = houses.map(h => ({
      id_rumah: h.id_rumah,
      nama: h.nama_rumah,
      warna: h.warna_bg,
      gold: 0,
      silver: 0,
      bronze: 0,
      fourth: 0,
      total_points: 0
    }));
    
    results.forEach(result => {
      [1, 2, 3, 4].forEach(rank => {
        const kpField = `rank_${rank}_kp`;
        const no_kp = result[kpField];
        
        if (no_kp) {
          const student = muridModel.findById(no_kp, 0);
          if (student) {
            const house = tally.find(t => t.id_rumah === student.id_rumah);
            
            if (house) {
              if (rank === 1) {
                house.gold++;
                house.total_points += points.gold;
              } else if (rank === 2) {
                house.silver++;
                house.total_points += points.silver;
              } else if (rank === 3) {
                house.bronze++;
                house.total_points += points.bronze;
              } else if (rank === 4) {
                house.fourth++;
                house.total_points += points.fourth;
              }
            }
          }
        }
      });
    });
    
    // Sort
    tally.sort((a, b) => {
      if (b.total_points !== a.total_points) {
        return b.total_points - a.total_points;
      }
      if (b.gold !== a.gold) {
        return b.gold - a.gold;
      }
      if (b.silver !== a.silver) {
        return b.silver - a.silver;
      }
      return b.bronze - a.bronze;
    });
    
    return tally;
  }
}

/**
 * Best Athlete Service
 */
class BestAthleteService {
  static calculateBest(id_kategori, tahun) {
    const keputusanModel = new KeputusanModel();
    const muridModel = new MuridModel();
    const settingsModel = new SettingsModel();
    
    const results = keputusanModel.getPublished()
      .filter(r => r.is_final === true);
    
    const points = settingsModel.getPoints();
    const students = muridModel.getByCategory(id_kategori);
    
    const studentPoints = {};
    
    students.forEach(student => {
      studentPoints[student.no_kp] = {
        no_kp: student.no_kp,
        nama: student.nama,
        id_rumah: student.id_rumah,
        points: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        fourth: 0
      };
    });
    
    results.forEach(result => {
      [1, 2, 3, 4].forEach(rank => {
        const kpField = `rank_${rank}_kp`;
        const no_kp = result[kpField];
        
        if (no_kp && studentPoints[no_kp]) {
          if (rank === 1) {
            studentPoints[no_kp].gold++;
            studentPoints[no_kp].points += points.gold;
          } else if (rank === 2) {
            studentPoints[no_kp].silver++;
            studentPoints[no_kp].points += points.silver;
          } else if (rank === 3) {
            studentPoints[no_kp].bronze++;
            studentPoints[no_kp].points += points.bronze;
          } else if (rank === 4) {
            studentPoints[no_kp].fourth++;
            studentPoints[no_kp].points += points.fourth;
          }
        }
      });
    });
    
    // Sort
    const sorted = Object.values(studentPoints)
      .filter(s => s.points > 0)
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gold !== a.gold) return b.gold - a.gold;
        if (b.silver !== a.silver) return b.silver - a.silver;
        return b.bronze - a.bronze;
      });
    
    return sorted.length > 0 ? sorted[0] : null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function testModels() {
  Logger.log('=== TESTING MODELS ===');
  
  // Test Settings
  const settingsModel = new SettingsModel();
  Logger.log('School Type: ' + settingsModel.getSchoolType());
  Logger.log('Level Term: ' + settingsModel.getLevelTerm());
  Logger.log('Points: ' + JSON.stringify(settingsModel.getPoints()));
  
  // Test Rumah
  const rumahModel = new RumahModel();
  Logger.log('Active Houses: ' + rumahModel.getActive().length);
  
  // Test Students
  const muridModel = new MuridModel();
  Logger.log('Total Students: ' + muridModel.count());
  Logger.log('Active Students: ' + muridModel.getActive().length);
  
  // Test Medal Tally
  const tally = MedalTallyService.calculate();
  Logger.log('Medal Tally:');
  tally.forEach(h => {
    Logger.log(`${h.nama}: ${h.total_points} pts (${h.gold}G ${h.silver}S ${h.bronze}B)`);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// END OF MODELS.GS
// ═══════════════════════════════════════════════════════════════════════════