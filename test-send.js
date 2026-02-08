const http = require('http');
const data = JSON.stringify({
  pageTitle: 'Story Test',
  pageUrl: 'http://localhost:3000/story.html',
  question: "What's your favorite memory?",
  answer: 'This is a test answer from the assistant',
  time: new Date().toISOString()
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/send',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error('Request error:', e);
});

req.write(data);
req.end();
