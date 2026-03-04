/**
 * ═══════════════════════════════════════════════════════════════
 * ATHLETICS TOURNAMENT MANAGEMENT SYSTEM - CODE.GS
 * Complete Backend - Router + Auth + API
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// ROUTER - SERVE HTML PAGES
// ═══════════════════════════════════════════════════════════════

function doGet(e) {
  try {
    const page = e.parameter.page || 'home';
    
    // PUBLIC PAGES (no login required)
    if (page === 'home') {
      return HtmlService.createHtmlOutputFromFile('Home')
        .setTitle('Sukan Tahunan 2025');
    }
    
    if (page === 'results') {
      return HtmlService.createHtmlOutputFromFile('Results')
        .setTitle('Keputusan Rasmi');
    }
    
    if (page === 'login') {
  // TEMPORARY AUTO-LOGIN (for testing)
  try {
    const tempSession = {
      username: 'admin',
      full_name: 'Administrator',
      role: 'Admin',
      id_rumah: null,
      login_time: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24*60*60*1000).toISOString()
    };
    
    PropertiesService.getUserProperties().setProperty('session', JSON.stringify(tempSession));
    
    return HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Auto Login</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 48px 60px;
              border-radius: 16px;
              text-align: center;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              min-width: 400px;
            }
            h2 {
              color: #3B82F6;
              font-size: 24px;
              margin-bottom: 24px;
              font-weight: 600;
            }
            .spinner {
              border: 4px solid #f3f3f3;
              border-top: 4px solid #3B82F6;
              border-radius: 50%;
              width: 60px;
              height: 60px;
              animation: spin 1s linear infinite;
              margin: 0 auto 24px auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            p {
              color: #6B7280;
              font-size: 16px;
              margin-bottom: 12px;
            }
            .countdown {
              color: #3B82F6;
              font-weight: 600;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>🔓 Auto Login Activated</h2>
            <div class="spinner"></div>
            <p>Redirecting to admin panel...</p>
            <p class="countdown">Redirecting in <span id="counter">2</span> seconds</p>
          </div>
          
          <script>
            console.log('Auto-login page loaded');
            
            let count = 2;
            const counterEl = document.getElementById('counter');
            
            const interval = setInterval(function() {
              count--;
              counterEl.textContent = count;
              
              if (count <= 0) {
                clearInterval(interval);
                console.log('Redirecting to admin-setup...');
                window.location.href = '?page=admin-setup';
              }
            }, 1000);
            
            // Fallback redirect after 3 seconds
            setTimeout(function() {
              if (window.location.search.indexOf('page=login') !== -1) {
                console.log('Fallback redirect triggered');
                window.location.href = '?page=admin-setup';
              }
            }, 3000);
          </script>
        </body>
      </html>
    `).setTitle('Auto Login').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    
  } catch (error) {
    Logger.log('Login page error: ' + error.message);
    return HtmlService.createHtmlOutput(`
      <html>
        <body style="font-family:sans-serif;padding:20px;text-align:center;">
          <h2 style="color:red;">Error loading login page</h2>
          <p>${error.message}</p>
          <button onclick="window.location.href='?page=home'" 
                  style="padding:10px 20px;margin-top:20px;cursor:pointer;">
            Go Home
          </button>
        </body>
      </html>
    `);
  }
}
    
    // PROTECTED PAGES (require login)
    const session = getSession();
    
    if (!session || !session.username) {
      return HtmlService.createHtmlOutput(`
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Login Required</title>
            <style>
              body {
                font-family: sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
              }
              .box {
                background: white;
                padding: 40px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
              }
              h2 { color: #EF4444; }
              button {
                background: #3B82F6;
                color: white;
                border: none;
                padding: 12px 32px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="box">
              <h2>🔒 Login Required</h2>
              <p>Please login to access this page.</p>
              <button onclick="window.location.href='?page=login'">Login Now</button>
            </div>
          </body>
        </html>
      `);
    }
    
    // ADMIN PAGES
    if (page === 'admin-setup') {
      if (session.role !== 'Admin') return accessDenied();
      return HtmlService.createHtmlOutputFromFile('AdminSetup')
        .setTitle('Admin - Setup');
    }
    
    if (page === 'admin-ops') {
      if (session.role !== 'Admin') return accessDenied();
      return HtmlService.createHtmlOutputFromFile('AdminOps')
        .setTitle('Admin - Operations');
    }
    
    if (page === 'admin-results') {
      if (session.role !== 'Admin') return accessDenied();
      return HtmlService.createHtmlOutputFromFile('AdminResults')
        .setTitle('Admin - Results');
    }
    
    // OTHER ROLES
    if (page === 'rumah') {
      if (session.role !== 'Rumah') return accessDenied();
      return HtmlService.createHtmlOutputFromFile('Rumah')
        .setTitle('Guru Rumah');
    }
    
    if (page === 'pengurus') {
      if (session.role !== 'Pengurus') return accessDenied();
      return HtmlService.createHtmlOutputFromFile('Pengurus')
        .setTitle('Pengurus');
    }
    
    if (page === 'pencatat') {
      if (session.role !== 'Pencatat') return accessDenied();
      return HtmlService.createHtmlOutputFromFile('Pencatat')
        .setTitle('Pencatat');
    }
    
    // 404 NOT FOUND
    return HtmlService.createHtmlOutput(`
      <html>
        <head>
          <meta charset="UTF-8">
          <title>404 Not Found</title>
          <style>
            body {
              font-family: sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
            }
            .box {
              background: white;
              padding: 40px;
              border-radius: 12px;
              text-align: center;
              box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            }
            h1 { color: #EF4444; font-size: 72px; margin: 0; }
            button {
              background: #3B82F6;
              color: white;
              border: none;
              padding: 12px 32px;
              border-radius: 8px;
              font-size: 16px;
              cursor: pointer;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <button onclick="window.location.href='?page=home'">Go Home</button>
          </div>
        </body>
      </html>
    `);
    
  } catch (error) {
    Logger.log('doGet Error: ' + error.message);
    return HtmlService.createHtmlOutput(`
      <html>
        <head><meta charset="UTF-8"><title>Error</title></head>
        <body style="font-family:monospace;padding:20px;background:#000;color:#0f0;">
          <h2>⚠️ System Error</h2>
          <pre>${error.message}\n\n${error.stack}</pre>
          <button onclick="window.location.href='?page=home'" 
                  style="padding:10px 20px;margin-top:20px;">
            Go Home
          </button>
        </body>
      </html>
    `);
  }
}

// ═══════════════════════════════════════════════════════════════
// ACCESS DENIED PAGE
// ═══════════════════════════════════════════════════════════════

function accessDenied() {
  return HtmlService.createHtmlOutput(`
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Access Denied</title>
        <style>
          body {
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
          }
          .box {
            background: white;
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          }
          h1 { color: #EF4444; font-size: 64px; margin: 0; }
          button {
            background: #3B82F6;
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>🚫</h1>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <button onclick="window.location.href='?page=home'">Go Home</button>
        </div>
      </body>
    </html>
  `);
}

// ═══════════════════════════════════════════════════════════════
// SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════

function getSession() {
  const userProperties = PropertiesService.getUserProperties();
  const sessionData = userProperties.getProperty('session');
  
  if (!sessionData) return null;
  
  try {
    const session = JSON.parse(sessionData);
    
    // Check expiry
    if (new Date(session.expires_at) < new Date()) {
      userProperties.deleteProperty('session');
      return null;
    }
    
    return session;
  } catch (error) {
    Logger.log('Session parse error: ' + error);
    return null;
  }
}

function saveSession(session) {
  PropertiesService.getUserProperties().setProperty('session', JSON.stringify(session));
}

function clearSession() {
  PropertiesService.getUserProperties().deleteProperty('session');
}

// ═══════════════════════════════════════════════════════════════
// LOGIN HANDLER
// ═══════════════════════════════════════════════════════════════

function handleLogin(data) {
  try {
    const username = data.username;
    const password = data.password;
    
    // Get users from database
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const usersSheet = ss.getSheetByName('tbl_users');
    const usersData = usersSheet.getDataRange().getValues();
    
    // Find user (skip header row)
    let user = null;
    for (let i = 1; i < usersData.length; i++) {
      const row = usersData[i];
      if (row[1] === username && row[2] === password) {
        user = {
          username: row[1],
          full_name: row[3],
          role: row[6],
          id_rumah: row[7] || null,
          is_active: row[8]
        };
        break;
      }
    }
    
    if (!user) {
      return { success: false, message: 'Invalid username or password' };
    }
    
    if (!user.is_active) {
      return { success: false, message: 'Account is disabled' };
    }
    
    // Create session
    const session = {
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      id_rumah: user.id_rumah,
      login_time: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24*60*60*1000).toISOString()
    };
    
    saveSession(session);
    
    return {
      success: true,
      session: session,
      message: 'Login successful'
    };
    
  } catch (error) {
    Logger.log('Login error: ' + error);
    return { success: false, message: 'System error' };
  }
}

function handleLogout() {
  clearSession();
  return { success: true, message: 'Logged out' };
}

// ═══════════════════════════════════════════════════════════════
// DATABASE HELPERS
// ═══════════════════════════════════════════════════════════════

function getSheetData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

// ═══════════════════════════════════════════════════════════════
// TEST FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function testLogin() {
  const result = handleLogin({
    username: 'admin',
    password: 'admin123'
  });
  Logger.log(result);
}

function testSession() {
  const session = getSession();
  Logger.log(session);
}

// ═══════════════════════════════════════════════════════════════
// PUBLIC DATA API (FOR HOME PAGE)
// ═══════════════════════════════════════════════════════════════

function getPublicData(data) {
  try {
    const type = data.type || 'home';
    
    if (type === 'home') {
      // Get medal tally
      const medalTally = getMedalTally();
      
      // Get recent results (published only)
      const recentResults = getRecentResults(10);
      
      // Get tournament info
      const tournamentInfo = getTournamentInfo();
      
        return {
        success: true,
        data: {
          tournament: tournamentInfo,
          tournament_name: tournamentInfo.name || 'Sukan Tahunan 2025',
          medalTally: medalTally,
          medal_tally: medalTally,
          recentResults: recentResults,
          recent_results: recentResults,
          bestAthletes: [],
          best_athletes: []
        }
      };
    }
    
    if (type === 'results') {
      const results = getPublishedResults();
      return { success: true, results: results };
    }
    
    return { success: false, message: 'Unknown data type' };
    
  } catch (error) {
    Logger.log('getPublicData error: ' + error);
    return { success: false, message: 'Error loading data' };
  }
}

function getTournamentInfo() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const settingsSheet = ss.getSheetByName('tbl_settings');
    const settingsData = settingsSheet.getDataRange().getValues();
    
    const info = {};
    for (let i = 1; i < settingsData.length; i++) {
      const key = settingsData[i][0];
      const value = settingsData[i][1];
      
      if (key === 'tournament_name') info.name = value;
      if (key === 'tournament_year') info.year = value;
      if (key === 'school_name') info.school = value;
    }
    
    return info;
  } catch (error) {
    return {
      name: 'Sukan Tahunan 2025',
      year: 2025,
      school: 'SK Sultan Ismail'
    };
  }
}

function getMedalTally() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get houses
    const housesSheet = ss.getSheetByName('tbl_rumah_sukan');
    const housesData = housesSheet.getDataRange().getValues();
    
    const tally = [];
    
    // Initialize tally for each house
    for (let i = 1; i < housesData.length; i++) {
      const house = housesData[i];
      if (house[5] === true) { // is_active
        tally.push({
          id_rumah: house[0],
          nama: house[1],
          warna: house[2],
          gold: 0,
          silver: 0,
          bronze: 0,
          total_points: 0
        });
      }
    }
    
    // Get published results
    const resultsSheet = ss.getSheetByName('tbl_keputusan');
    if (!resultsSheet) return tally;
    
    const resultsData = resultsSheet.getDataRange().getValues();
    
    // Get students for house mapping
    const studentsSheet = ss.getSheetByName('tbl_murid');
    const studentsData = studentsSheet.getDataRange().getValues();
    
    // Get point values
    const settingsSheet = ss.getSheetByName('tbl_settings');
    const settingsData = settingsSheet.getDataRange().getValues();
    
    let goldPoints = 50, silverPoints = 30, bronzePoints = 20;
    for (let i = 1; i < settingsData.length; i++) {
      if (settingsData[i][0] === 'point_emas') goldPoints = settingsData[i][1];
      if (settingsData[i][0] === 'point_perak') silverPoints = settingsData[i][1];
      if (settingsData[i][0] === 'point_gangsa') bronzePoints = settingsData[i][1];
    }
    
    // Count medals from published results
    for (let i = 1; i < resultsData.length; i++) {
      const result = resultsData[i];
      const isPublished = result[11];
      const isFinal = result[12];
      
      if (!isPublished || !isFinal) continue;
      
      // Process each rank (1-3)
      for (let rank = 1; rank <= 3; rank++) {
        const kpIndex = 3 + (rank - 1) * 2; // rank_1_kp at index 3, rank_2_kp at 5, etc.
        const no_kp = result[kpIndex];
        
        if (!no_kp) continue;
        
        // Find student's house
        let id_rumah = null;
        for (let s = 1; s < studentsData.length; s++) {
          if (studentsData[s][0] === no_kp) {
            id_rumah = studentsData[s][4];
            break;
          }
        }
        
        if (!id_rumah) continue;
        
        // Update tally
        const houseData = tally.find(t => t.id_rumah === id_rumah);
        if (houseData) {
          if (rank === 1) {
            houseData.gold++;
            houseData.total_points += goldPoints;
          } else if (rank === 2) {
            houseData.silver++;
            houseData.total_points += silverPoints;
          } else if (rank === 3) {
            houseData.bronze++;
            houseData.total_points += bronzePoints;
          }
        }
      }
    }
    
    // Sort by points
    tally.sort((a, b) => {
      if (b.total_points !== a.total_points) return b.total_points - a.total_points;
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      return b.bronze - a.bronze;
    });
    
    return tally;
    
  } catch (error) {
    Logger.log('getMedalTally error: ' + error);
    return [];
  }
}

function getRecentResults(limit) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const resultsSheet = ss.getSheetByName('tbl_keputusan');
    
    if (!resultsSheet) return [];
    
    const resultsData = resultsSheet.getDataRange().getValues();
    const eventsSheet = ss.getSheetByName('tbl_acara');
    const eventsData = eventsSheet ? eventsSheet.getDataRange().getValues() : [];
    const studentsSheet = ss.getSheetByName('tbl_murid');
    const studentsData = studentsSheet ? studentsSheet.getDataRange().getValues() : [];
    
    const results = [];
    
    for (let i = 1; i < resultsData.length; i++) {
      const result = resultsData[i];
      const isPublished = result[11];
      const isFinal = result[12];
      
      if (!isPublished || !isFinal) continue;
      
      const no_acara = result[1];
      
      // Get event name
      let eventName = no_acara;
      for (let e = 1; e < eventsData.length; e++) {
        if (eventsData[e][0] === no_acara) {
          eventName = eventsData[e][10] || eventsData[e][0];
          break;
        }
      }
      
      // Get winners
      const winners = [];
      for (let rank = 1; rank <= 3; rank++) {
        const kpIndex = 3 + (rank - 1) * 2;
        const no_kp = result[kpIndex];
        
        if (no_kp) {
          let nama = no_kp;
          for (let s = 1; s < studentsData.length; s++) {
            if (studentsData[s][0] === no_kp) {
              nama = studentsData[s][1];
              break;
            }
          }
          winners.push({ rank: rank, nama: nama });
        }
      }
      
      results.push({
        no_acara: no_acara,
        event_name: eventName,
        winners: winners,
        published_at: result[17]
      });
    }
    
    // Sort by published date (most recent first)
    results.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    
    return results.slice(0, limit || 10);
    
  } catch (error) {
    Logger.log('getRecentResults error: ' + error);
    return [];
  }
}

function getPublishedResults() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const resultsSheet = ss.getSheetByName('tbl_keputusan');
    
    if (!resultsSheet) return [];
    
    const resultsData = resultsSheet.getDataRange().getValues();
    const results = [];
    
    for (let i = 1; i < resultsData.length; i++) {
      const result = resultsData[i];
      if (result[11] === true) { // is_published
        results.push({
          id_keputusan: result[0],
          no_acara: result[1],
          heat_number: result[2],
          rank_1_kp: result[3],
          rank_1_result: result[4],
          rank_2_kp: result[5],
          rank_2_result: result[6],
          rank_3_kp: result[7],
          rank_3_result: result[8],
          is_final: result[12],
          published_at: result[17]
        });
      }
    }
    
    return results;
    
  } catch (error) {
    Logger.log('getPublishedResults error: ' + error);
    return [];
  }
}