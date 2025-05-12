// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const DATA_FILE = path.join(__dirname, 'items.json');
const app = express();
app.use(cors());
app.use(express.json());

// Helper: baca & tulis file JSON
function readItems() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch {
    return [];
  }
}
function writeItems(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
}

// GET all items
app.get('/items', (req, res) => {
  res.json(readItems());
});

// POST create new item
app.post('/items', (req, res) => {
  const items = readItems();
  const newItem = { 
    id: Date.now(), 
    nama: req.body.nama, 
    kode: req.body.kode, 
    harga: req.body.harga, 
    stok: req.body.stok 
  };
  items.push(newItem);
  writeItems(items);
  res.status(201).json(newItem);
});

// PUT update item by id
app.put('/items/:id', (req, res) => {
  const items = readItems();
  const idx = items.findIndex(i => i.id == req.params.id);
  if (idx === -1) return res.sendStatus(404);
  items[idx] = { 
    id: items[idx].id,
    nama: req.body.nama,
    kode: req.body.kode,
    harga: req.body.harga,
    stok: req.body.stok
  };
  writeItems(items);
  res.json(items[idx]);
});

// DELETE item by id
app.delete('/items/:id', (req, res) => {
  let items = readItems();
  const before = items.length;
  items = items.filter(i => i.id != req.params.id);
  if (items.length === before) return res.sendStatus(404);
  writeItems(items);
  res.sendStatus(204);
});

app.get('/', (req, res) => {
    res.send('Selamat datang di API Barang');
  });

  const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

  

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
