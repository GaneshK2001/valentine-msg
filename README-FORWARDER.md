Forwarder — store incoming messages locally (and optionally forward to Google Sheets)

1. Create a `.env` file next to `server.js` with:

   ADMIN_KEY=your_admin_key_here
   MESSAGES_FILE=messages.json
   PORT=3000

   # Optional: set this to your Google Apps Script Web App URL to forward messages to a Sheet

   G_SHEET_URL=https://script.google.com/macros/s/XXXXXXXX/exec

2. Install and run:

   npm install
   npm start

3. In the client (`love.js`) ensure `FORWARDER_URL` points to your forwarder (example: `http://localhost:3000` or deployed URL).

Behavior:

- Incoming POST `/send` will always be saved to the local `MESSAGES_FILE` (JSON array).
- If `G_SHEET_URL` is set the server will also POST the message JSON to that URL (non-blocking).
- Admin UI: `http://localhost:3000/admin?key=ADMIN_KEY`
- JSON API: `http://localhost:3000/messages?key=ADMIN_KEY`

Security: keep `.env` private. If you use a public `G_SHEET_URL` endpoint, ensure the Apps Script enforces any required validation.

Google Sheets quick setup (Apps Script Web App):

1. Create a new Google Sheet and open Extensions → Apps Script.
2. Replace the script with:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date(),
      data.pageTitle || "",
      data.pageUrl || "",
      data.question || "",
      data.answer || "",
      data.time || "",
    ]);
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: err.message }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Deploy → New deployment → select "Web app", set access to "Anyone", and deploy. Copy the web app URL into `G_SHEET_URL`.

Now messages saved locally will also show up in your Google Sheet.
