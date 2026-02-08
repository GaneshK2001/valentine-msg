Local Telegram forwarder (free, secure)

1. Create a `.env` file next to `server.js` with:

   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_numeric_chat_id_here
   PORT=3000

2. Install and run:

   npm install
   npm start

3. In the client (`love.js`) set `FORWARDER_URL` to `http://localhost:3000`.

Now the client will POST answers to the forwarder and the server will call Telegram with the token from the environment.

Security: Keep your `.env` private. Rotate token if you previously exposed it.
