Local Telegram forwarder (free, secure)

1. Create a `.env` file next to `server.js` with:

   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_numeric_chat_id_here
   PORT=3000

2. Install and run:

   npm install
   npm start

3. In the client (`love.js`) set `FORWARDER_URL` to `http://localhost:3000` (default already set for local testing).

4. View stored messages:
   - Open the admin page in your browser:
     http://localhost:3000/admin?key=replace_this_with_a_secret
   - Or fetch raw JSON:
     http://localhost:3000/messages?key=replace_this_with_a_secret

Now the client will POST answers to the forwarder and the server will store messages.

Security: Keep your `.env` private. Rotate token if you previously exposed it.
