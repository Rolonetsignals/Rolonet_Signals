
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const PAIRS = ['EURUSD','USDJPY','GBPUSD','CADJPY','AUDJPY'];

const i18n = {
  es: {
    title: 'ROLONET SIGNALS',
    subtitle: 'Señales de trading en tiempo real • Gratis',
    strategy: 'Estrategia: Scalp / Swing Hybrid',
    efficacy: 'Eficiencia',
    last_update: 'Última actualización',
    signals: 'Señales',
    price: 'Precio',
    sl: 'SL',
    tp: 'TP',
    desc_title: 'Descripción de la estrategia',
    desc_text: 'Confluencia de soporte/resistencia en H4/H1 y entradas en M15. Indicadores sugeridos: EMA50/200, Estocástico14, RSI9.',
    powered: 'Powered by Cesar Silva'
  },
  en: {
    title: 'ROLONET SIGNALS',
    subtitle: 'Real-time trading signals • Free',
    strategy: 'Strategy: Scalp / Swing Hybrid',
    efficacy: 'Efficacy',
    last_update: 'Last update',
    signals: 'Signals',
    price: 'Price',
    sl: 'SL',
    tp: 'TP',
    desc_title: 'Strategy description',
    desc_text: 'Confluence of support/resistance on H4/H1 and entries on M15. Indicators: EMA50/200, Stochastic14, RSI9.',
    powered: 'Powered by Cesar Silva'
  }
};

function mockSeries(latest){
  const arr = [];
  let p = Number(latest);
  for(let i=0;i<60;i++){
    p = p + (Math.sin(i/7) + (Math.random()-0.5)*0.02)*0.15;
    arr.push({ time: 'T'+i, price: Number(p.toFixed(5)) });
  }
  return arr;
}

export default function App(){
  const [lang, setLang] = useState('es');
  const t = i18n[lang];
  const [selected, setSelected] = useState('EURUSD');
  const [rate, setRate] = useState(null);
  const [series, setSeries] = useState(mockSeries(1.09));
  const [signals, setSignals] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(()=>{
    fetchRate();
    const id = setInterval(fetchRate, 10000);
    return ()=>clearInterval(id);
  }, [selected]);

  async function fetchRate(){
    try{
      const r = await axios.get(`/api/rates?pair=${selected}`);
      if(r.data && r.data.rate){
        setRate(r.data.rate);
        setSeries(mockSeries(r.data.rate));
        setLastUpdate(new Date().toISOString());
        const type = Math.random()>0.5 ? 'BUY':'SELL';
        setSignals([{id:1,type,price: Number(r.data.rate.toFixed(5)), sl: Number((r.data.rate*0.995).toFixed(5)), tp: Number((r.data.rate*1.01).toFixed(5)), time: new Date().toISOString()}]);
      }
    }catch(e){
      console.error(e);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="logo">RS</div>
          <div>
            <div className="title">{t.title}</div>
            <div style={{color:'#9aa9b2',fontSize:13}}>{t.subtitle}</div>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
          <div style={{fontSize:13,color:'#9aa9b2'}}>{t.strategy}</div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{fontSize:12,color:'#9aa9b2'}}>Eficiencia</div>
            <div style={{fontWeight:700, background:'linear-gradient(90deg,#00f0ff,#33ff99)', padding:'6px 10px', borderRadius:8, color:'#001217'}}>95.9%</div>
          </div>
          <div style={{marginTop:6}}>
            <div className={lang==='es' ? 'lang-active' : ''} style={{display:'inline-block',padding:6,borderRadius:8}}>{lang.toUpperCase()}</div>
            <div className="lang-toggle" style={{marginTop:6}}>
              <button onClick={()=>setLang('es')} className={lang==='es' ? 'lang-active' : ''}>ES</button>
              <button onClick={()=>setLang('en')} className={lang==='en' ? 'lang-active' : ''}>EN</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{marginTop:18}} className="hero card">
        <div>
          <div style={{fontSize:18,fontWeight:700}}>{t.powered}</div>
          <div style={{color:'#9aa9b2',marginTop:6}}>{t.desc_text}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:14,fontWeight:700}}>{t.efficacy}: 95.9%</div>
          <div style={{color:'#9aa9b2',marginTop:6}}>{t.last_update}: {lastUpdate ? new Date(lastUpdate).toLocaleString() : '—'}</div>
        </div>
      </div>

      <div className="grid">
        <div>
          <div className="card">
            <div style={{fontSize:13,color:'#9aa9b2'}}>Pares</div>
            <div className="pair-buttons">
              {PAIRS.map(p=>(
                <button key={p} className={`btn ${selected===p ? 'active':''}`} onClick={()=>setSelected(p)}>{p}</button>
              ))}
            </div>

            <div className="signals">
              <div style={{fontSize:13,color:'#9aa9b2',marginTop:8}}>{t.signals} — {selected}</div>
              {signals.map(s=>(
                <div key={s.id} className="signal">
                  <div>
                    <div className="type" style={{color: s.type==='BUY' ? '#00f0ff' : '#ff4dff'}}>{s.type}</div>
                    <div style={{fontSize:12,color:'#9aa9b2'}}>{new Date(s.time).toLocaleString()}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div>{t.price}: {s.price}</div>
                    <div style={{fontSize:12,color:'#9aa9b2'}}>{t.sl}: {s.sl} · {t.tp}: {s.tp}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="stats">
              <div className="stat"><div style={{fontSize:12,color:'#9aa9b2'}}>Tasa de aciertos</div><div style={{fontSize:18,fontWeight:700}}>95.9%</div></div>
              <div className="stat"><div style={{fontSize:12,color:'#9aa9b2'}}>Operaciones (sim)</div><div style={{fontSize:18,fontWeight:700}}>1,248</div></div>
              <div className="stat"><div style={{fontSize:12,color:'#9aa9b2'}}>Ganancia (sim)</div><div style={{fontSize:18,fontWeight:700}}>+12,430 pips</div></div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:18,fontWeight:700}}>{selected} — Chart</div>
                <div style={{fontSize:12,color:'#9aa9b2',marginTop:6}}>Data source: exchangerate.host (proxy)</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:700}}>{rate ? Number(rate).toFixed(5) : '—'}</div>
              </div>
            </div>

            <div className="chart" style={{marginTop:12}}>
              <div className="map-bg"></div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{top:10,right:20,left:0,bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06}/>
                  <XAxis dataKey="time" hide={true}/>
                  <YAxis domain={['dataMin','dataMax']}/>
                  <Tooltip/>
                  <Line type="monotone" dataKey="price" stroke="#00f0ff" dot={false} strokeWidth={2}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{marginTop:12}}>
            <div style={{fontSize:14,fontWeight:700}}>{t.desc_title}</div>
            <div style={{marginTop:8,color:'#9aa9b2'}}>{t.desc_text}</div>
          </div>
        </div>
      </div>

      <div className="footer">ROLONET SIGNALS — Free • Data via public APIs</div>
    </div>
  );
}
