
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());

function pairToBaseQuote(pair){
  const base = pair.slice(0,3);
  const quote = pair.slice(3);
  return { base, quote };
}

app.get('/api/rates', async (req, res) => {
  const pair = (req.query.pair || 'EURUSD').toUpperCase();
  const { base, quote } = pairToBaseQuote(pair);
  try {
    const url1 = `https://api.exchangerate.host/latest?base=${base}&symbols=${quote}`;
    const r1 = await fetch(url1);
    const j1 = await r1.json();
    if(j1 && j1.rates && j1.rates[quote]){
      return res.json({ pair, rate: j1.rates[quote], source: 'exchangerate.host', raw: j1 });
    }
    const url2 = `https://api.twelvedata.com/price?symbol=${base}${quote}`;
    const r2 = await fetch(url2);
    const j2 = await r2.json();
    if(j2 && j2.price){
      return res.json({ pair, rate: Number(j2.price), source: 'twelvedata', raw: j2 });
    }
    return res.status(502).json({ error: 'No rate available from providers' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error', detail: e.message });
  }
});

app.get('/api/health', (req,res)=>res.json({ ok:true, time: new Date().toISOString() }));

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log('Server listening on', port));
