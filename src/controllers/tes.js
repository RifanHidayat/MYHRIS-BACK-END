const express = require('express');
const mysql = require('mysql2');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chat_app'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Endpoint untuk mendapatkan detail pengguna
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});


// Endpoint User
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// API untuk menyimpan pesan
app.post('/saveMessage', (req, res) => {
    const { type,sender, recipient, message, status } = req.body;
    db.query(
        'INSERT INTO messages (type, sender, recipient, message, status) VALUES (?, ?, ?, ?, ?)',
        [type, sender, recipient, message, status],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Database error' });
                return;
            }
            res.status(201).json({ message: 'Message saved' });
            console.log("Message Saved Api");
             
        }
    );
});

// API untuk mendapatkan pesan antara dua pengguna
app.get('/messages/:sender/:recipient', (req, res) => {
    const { sender, recipient } = req.params;
    db.query(
        'SELECT * FROM messages WHERE (sender = ? AND recipient = ?) OR (sender = ? AND recipient = ?)',
        [sender, recipient, recipient, sender],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Database error' });
                return;
            }

            // const formattedResults = results.map(message => ({
            //     type: 'message',
            //     sender: message.sender,
            //     message: message.message,
            //     status: message.status,
            // }));

            res.json(results);
        }
    );
});

app.post('/messages/status', (req, res) => {
    const updates = req.body;
    updates.forEach((update) => {
      db.query(
        'UPDATE messages SET status = ? WHERE id = ?',
        [update.status, update.id],
        (err) => {
          if (err) throw err;
        }
      );
    });
    res.json({ success: true });
  });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map(); 

wss.on('connection', (ws) => {
  console.log('Client connected!');

  // Handle incoming messages from client
  ws.on('message', (message) =>{
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.type) {
        case 'setUsername':
            // Simpan username untuk klien
            clients.set(parsedMessage.username, ws);
            break;

        case 'setStatus':
            clients.set(parsedMessage.username, { ws: ws, recipient: parsedMessage.recipient });
            if (recipientData && recipientData.recipient === parsedMessage.sender) {
                console.log(true);
                recipientData.ws.send("online");
            } 
            break;

        case 'message':
            // Kirim pesan berdasarkan username
            const recipientData = clients.get(parsedMessage.recipient);
            if (recipientData && recipientData.recipient === parsedMessage.sender) {
                console.log(true);
                recipientData.ws.send(JSON.stringify({
                    type: 'message',
                    sender: parsedMessage.sender,
                    message: parsedMessage.message,
                    status: parsedMessage.status,
                }));
            } else {
                ws.send(JSON.stringify({ type: 'error', message: 'Recipient not found or not in the same chat.' }));
            }
            break;

        case 'broadcast':
            // Kirim pesan ke semua klien
            clients.forEach((client) => {
                client.send(JSON.stringify({ type: 'message', from: parsedMessage.sender, message: parsedMessage.message }));
            });
            break;

        default:
            ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
            break;
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected.');
    // Hapus username dan koneksi dari map
    for (let [username, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(username);
        break;
      }
    }
  });
});

// Server express listening on port 8080
