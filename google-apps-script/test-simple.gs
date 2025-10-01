/**
 * 🧪 Simple test to verify Spreadsheet access
 */
function testSpreadsheetAccess() {
  console.log('🧪 Testing Spreadsheet access...');

  const SPREADSHEET_ID = '1nQVX_Jtwhwl3ApGlXuV6NthROZkejy6EMrFztw1k_vU'; // Task Management Database
  
  try {
    // Try to open spreadsheet
    console.log(`📂 Attempting to open Spreadsheet: ${SPREADSHEET_ID}`);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    console.log(`✅ Spreadsheet opened: ${spreadsheet.getName()}`);
    
    // Try to get sheet
    const sheet = spreadsheet.getSheetByName('Tasks');
    if (!sheet) {
      console.log('❌ Sheet "Tasks" not found');
      console.log('Available sheets:', spreadsheet.getSheets().map(s => s.getName()).join(', '));
      return;
    }
    console.log(`✅ Sheet "Tasks" found`);
    
    // Try to read data
    const data = sheet.getDataRange().getValues();
    console.log(`✅ Read ${data.length} rows`);
    console.log('First row (headers):', data[0]);
    
    return {
      success: true,
      spreadsheetName: spreadsheet.getName(),
      sheetName: sheet.getName(),
      rowCount: data.length
    };
    
  } catch (error) {
    console.error('❌ Error:', error.toString());
    console.error('Stack:', error.stack);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 🧪 Test with URL from spreadsheet
 */
function testWithSpreadsheetUrl() {
  console.log('🧪 Testing with Spreadsheet URL...');
  
  // Try to open by URL
  const url = 'https://docs.google.com/spreadsheets/d/1Ny3Nb1Ql9coj3hBePwxmbm_OTrWfTGMxkBw1w0ZTyP4/edit';
  
  try {
    const spreadsheet = SpreadsheetApp.openByUrl(url);
    console.log(`✅ Spreadsheet opened: ${spreadsheet.getName()}`);
    console.log(`✅ Spreadsheet ID: ${spreadsheet.getId()}`);
    
    return {
      success: true,
      id: spreadsheet.getId(),
      name: spreadsheet.getName()
    };
  } catch (error) {
    console.error('❌ Error:', error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * 🧪 List all accessible spreadsheets
 */
function listAccessibleSpreadsheets() {
  console.log('🧪 Listing accessible spreadsheets...');
  
  try {
    const files = DriveApp.getFilesByType(MimeType.GOOGLE_SHEETS);
    const spreadsheets = [];
    
    while (files.hasNext() && spreadsheets.length < 10) {
      const file = files.next();
      spreadsheets.push({
        name: file.getName(),
        id: file.getId(),
        url: file.getUrl()
      });
    }
    
    console.log(`✅ Found ${spreadsheets.length} spreadsheets:`);
    spreadsheets.forEach(s => {
      console.log(`- ${s.name} (${s.id})`);
    });
    
    return spreadsheets;
  } catch (error) {
    console.error('❌ Error:', error.toString());
    return [];
  }
}

