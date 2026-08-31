/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - E-KARTU MENGAJAR (PONDOK PESANTREN AL-MADINA)
 * =========================================================================
 * 
 * PETUNJUK PEMASANGAN / UPDATE:
 * 1. Buka Google Spreadsheet data Anda.
 * 2. Klik menu "Ekstensi" (Extensions) -> "Apps Script".
 * 3. Hapus seluruh kode lama di file Code.gs, lalu salin (copy) & tempel (paste) kode di bawah ini.
 * 4. Klik ikon "Simpan" (Save / Ctrl+S).
 * 5. Klik tombol "Terapkan" (Deploy) di pojok kanan atas -> pilih "Kelola Penerapan" (Manage Deployments).
 * 6. Klik ikon Pensil (Edit) pada penerapan yang aktif:
 *    - Versi: Pilih "Versi baru" (New version)
 *    - Jalankan sebagai (Execute as): "Saya" (Me - email pemilik spreadsheet)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> PENTING! Harus "Anyone" agar data form bisa masuk tanpa login Google.
 * 7. Klik "Terapkan" (Deploy).
 * =========================================================================
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var headers = data[0];
    var rows = [];
    
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var obj = {};
      for (var j = 0; j < headers.length; j++) {
        var headerName = headers[j];
        var cellValue = row[j];
        
        // Format tanggal jika objek Date
        if (cellValue instanceof Date) {
          cellValue = Utilities.formatDate(cellValue, Session.getScriptTimeZone(), "yyyy-MM-dd");
        }
        obj[headerName] = cellValue !== undefined && cellValue !== null ? String(cellValue) : "";
      }
      rows.push(obj);
    }
    
    return ContentService.createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Kunci selama 10 detik agar penambahan baris bersamaan tidak bentrok
    lock.waitLock(10000);
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    
    // Parse data yang dikirim dari aplikasi
    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    var now = new Date();
    var timestamp = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    
    // Siapkan baris data baru sesuai urutan kolom spreadsheet
    var rowData = [
      timestamp,                                  // A: Timestamp
      data.nama_guru || "-",                      // B: Nama_Guru
      data.tanggal || "-",                        // C: Tanggal
      data.jenjang || "-",                        // D: Jenjang_Utama
      data.presensi || "Hadir",                   // E: Presensi
      data.keterangan || "-",                     // F: Keterangan
      data.jam_masuk || "-",                      // G: Jam_Masuk
      data.jam_keluar || "-",                     // H: Jam_Keluar
      Number(data.m_ulya) || 0,                   // I: Mengajar_Ulya
      Number(data.m_wustho) || 0,                 // J: Mengajar_Wustho
      Number(data.m_td) || 0,                     // K: Mengajar_Tadribud
      Number(data.p_ulya) || 0,                   // L: Pengganti_Ulya
      Number(data.p_wustho) || 0,                 // M: Pengganti_Wustho
      Number(data.p_td) || 0,                     // N: Pengganti_Tadribud
      data.deskripsi_lembur || "-",               // O: Deskripsi_Lembur
      Number(data.jam_lembur) || 0,               // P: Jam_Lembur
      data.jenis_eskul || "-",                    // Q: Jenis_Eskul
      Number(data.jml_pertemuan_eskul) || 0,      // R: Jml_Pertemuan_Eskul
      data.keterangan_pengganti || "-"            // S: Keterangan_Pengganti
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "Data berhasil disimpan ke Spreadsheet",
      row: rowData 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
