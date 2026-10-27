const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const WEB_URL = process.env.WEB_URL || "http://web:5000";
const PROCESAMIENTO_URL = process.env.PROCESAMIENTO_URL || "http://procesamiento:5001";
const DATA_DIR = "/app/data";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function writeAudit(message) {
  try {
    fs.appendFileSync(path.join(DATA_DIR, "visualizacion.log"), `${new Date().toISOString()} ${message}\n`);
  } catch (error) {
    console.error("No se pudo escribir el registro:", error.message);
  }
}

app.get("/", (req, res) => {
  writeAudit("GET /");
  res.type("html").send(`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0b1020">
<title>Proyecto 03 · Control Center</title>
<style>
:root{color-scheme:dark;--bg:#080d19;--panel:#101827;--panel2:#141f31;--line:#243149;--text:#edf3ff;--muted:#92a2bd;--blue:#6d8cff;--cyan:#59e1d0;--green:#5ee0a0;--red:#ff7e91;--radius:20px}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:radial-gradient(ellipse at 15% -10%,#1a2b50 0,transparent 40%),radial-gradient(ellipse at 100% 10%,#172b39 0,transparent 30%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.5}
button,input{font:inherit}
.shell{max-width:1180px;margin:0 auto;padding:34px 24px 28px}
.topbar{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:42px}
.brand{display:flex;align-items:center;gap:13px}.logo{width:46px;height:46px;display:grid;place-items:center;border-radius:15px;background:linear-gradient(135deg,var(--blue),#8c68f7);box-shadow:0 8px 30px #6d8cff35;font-weight:900;font-size:20px}
.brand-title{font-weight:750;letter-spacing:.2px}.brand-sub{font-size:12px;color:var(--muted);margin-top:2px}
.pill{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid #285343;background:#102a29;color:#8ef0c1;border-radius:999px;font-size:12px;font-weight:700}.dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 12px #5ee0a0}
.hero{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:28px}.eyebrow{color:var(--cyan);font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:800;margin-bottom:10px}
h1{font-size:clamp(30px,5vw,48px);line-height:1.08;letter-spacing:-1.7px;margin:0;max-width:700px}.gradient{background:linear-gradient(90deg,#f4f7ff 5%,#9db2ff 55%,#63e6d4);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero p{max-width:650px;color:var(--muted);margin:14px 0 0;font-size:15px}
.version{color:var(--muted);font-size:12px;white-space:nowrap;padding-bottom:5px}
.stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-bottom:20px}.stat{background:linear-gradient(145deg,#121d2e,#0e1624);border:1px solid var(--line);border-radius:16px;padding:17px 19px}.stat-top{display:flex;justify-content:space-between;align-items:center;color:var(--muted);font-size:12px}.stat-icon{font-size:16px}.stat strong{display:block;font-size:23px;margin-top:7px;letter-spacing:-.5px}.stat small{color:var(--muted);font-size:12px}
.grid{display:grid;grid-template-columns:1.05fr 1fr 1fr;gap:16px;align-items:stretch}
.card{background:linear-gradient(155deg,#121c2c,#0e1624);border:1px solid var(--line);border-radius:var(--radius);padding:22px;min-width:0;box-shadow:0 18px 45px #00000012}
.card-head{display:flex;align-items:flex-start;gap:12px;margin-bottom:18px}.icon{width:40px;height:40px;flex:0 0 40px;display:grid;place-items:center;border-radius:13px;background:#202e49;color:#a8baff;font-size:18px}.card h2{font-size:17px;margin:0 0 4px;letter-spacing:-.3px}.card-desc{font-size:12px;color:var(--muted);margin:0}
.service-list{display:grid;gap:10px;margin:18px 0}.service{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#0b1321;border:1px solid #1e2b40;border-radius:12px;padding:11px 12px}.service-name{font-size:13px;font-weight:650}.service-port{font-size:11px;color:var(--muted);margin-top:2px}.status{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--muted)}.status-dot{width:7px;height:7px;border-radius:50%;background:#65738a}.status.ok{color:#86edbd}.status.ok .status-dot{background:var(--green)}.status.bad{color:#ff9eaa}.status.bad .status-dot{background:var(--red)}
label{display:block;font-size:12px;color:#b4c1d7;margin:14px 0 7px;font-weight:650}
input{width:100%;padding:12px 13px;background:#0a1220;border:1px solid #2a3952;border-radius:11px;color:var(--text);outline:none;transition:border .2s,box-shadow .2s}
input::placeholder{color:#61718b}input:focus{border-color:var(--blue);box-shadow:0 0 0 3px #6d8cff20}
button{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;border:0;border-radius:11px;padding:12px 15px;margin-top:14px;background:linear-gradient(100deg,#6b87ff,#8b6cf5);color:white;font-weight:750;font-size:13px;cursor:pointer;box-shadow:0 8px 22px #6d8cff22;transition:transform .15s,filter .15s}
button:hover{filter:brightness(1.1);transform:translateY(-1px)}button:active{transform:translateY(0)}button:disabled{opacity:.6;cursor:wait;transform:none}
.result{margin:15px 0 0;min-height:74px;max-height:230px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;background:#080f1b;border:1px solid #1c2a40;color:#c3d0e5;padding:13px;border-radius:12px;font:12px/1.6 "Cascadia Code",Consolas,monospace}
.hint{font-size:11px;color:var(--muted);margin:10px 0 0}.footer{display:flex;justify-content:space-between;gap:12px;align-items:center;color:#73839e;font-size:11px;margin-top:24px;padding:18px 3px;border-top:1px solid #1b2639}.footer span:last-child{color:#8f9eb5}
@media(max-width:900px){.grid{grid-template-columns:1fr 1fr}.card:first-child{grid-column:1/-1}.service-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.shell{padding:22px 14px}.topbar{margin-bottom:30px}.pill{font-size:10px}.hero{display:block}.version{margin-top:15px}.stats{grid-template-columns:1fr;gap:9px}.stat{padding:13px 15px}.grid{grid-template-columns:1fr}.card:first-child{grid-column:auto}.service-list{grid-template-columns:1fr}.card{padding:18px}.footer{display:block}.footer span{display:block;margin:4px 0}}
</style>
</head>
<body>
<div class="shell">
<header class="topbar">
  <div class="brand"><div class="logo">P3</div><div><div class="brand-title">Proyecto 03</div><div class="brand-sub">MULTICONTAINER CONTROL CENTER</div></div></div>
  <div class="pill"><span class="dot"></span> Docker Compose</div>
</header>
<section class="hero">
  <div><div class="eyebrow">Infraestructura &amp; seguridad computacional</div><h1><span class="gradient">Tu aplicación,</span><br>todos los servicios conectados.</h1><p>Panel de control para monitorear la comunicación entre contenedores, guardar datos en Redis y consultar información en tiempo real.</p></div>
  <div class="version">BUILD <strong>1.0.0</strong></div>
</section>
<section class="stats">
  <div class="stat"><div class="stat-top"><span>MICROSERVICIOS</span><span class="stat-icon">◈</span></div><strong>04</strong><small>Servicios en la arquitectura</small></div>
  <div class="stat"><div class="stat-top"><span>RED INTERNA</span><span class="stat-icon">⌘</span></div><strong>Bridge</strong><small>red-proyecto</small></div>
  <div class="stat"><div class="stat-top"><span>ALMACENAMIENTO</span><span class="stat-icon">▤</span></div><strong>Redis</strong><small>Persistencia habilitada</small></div>
</section>
<section class="grid">
  <article class="card">
    <div class="card-head"><div class="icon">⌁</div><div><h2>Estado de servicios</h2><p class="card-desc">Verifica la conexión entre contenedores.</p></div></div>
    <div class="service-list">
      <div class="service"><div><div class="service-name">Visualización</div><div class="service-port">Node.js · :3000</div></div><span class="status" id="s-visualizacion"><i class="status-dot"></i><span>Sin probar</span></span></div>
      <div class="service"><div><div class="service-name">Web API</div><div class="service-port">Python · :5000</div></div><span class="status" id="s-web"><i class="status-dot"></i><span>Sin probar</span></span></div>
      <div class="service"><div><div class="service-name">Procesamiento</div><div class="service-port">Python · interno :5001</div></div><span class="status" id="s-procesamiento"><i class="status-dot"></i><span>Sin probar</span></span></div>
      <div class="service"><div><div class="service-name">Base de datos</div><div class="service-port">Redis · :6379</div></div><span class="status" id="s-redis"><i class="status-dot"></i><span>Sin probar</span></span></div>
    </div>
    <button id="healthButton" onclick="salud()">↻ &nbsp; Comprobar servicios</button>
    <pre class="result" id="health" aria-live="polite">Pulsa el botón para ejecutar la comprobación.</pre>
  </article>
  <article class="card">
    <div class="card-head"><div class="icon">＋</div><div><h2>Guardar un dato</h2><p class="card-desc">Almacena una clave y su valor en Redis.</p></div></div>
    <form id="form">
      <label for="clave">Clave</label><input id="clave" placeholder="Ej. curso" required maxlength="120">
      <label for="valor">Valor</label><input id="valor" placeholder="Ej. Docker Compose" required maxlength="500">
      <button id="saveButton">↥ &nbsp; Guardar dato</button>
    </form>
    <pre class="result" id="saveResult" aria-live="polite">El resultado de la operación aparecerá aquí.</pre>
    <p class="hint">Los datos se guardan a través de la API de procesamiento.</p>
  </article>
  <article class="card">
    <div class="card-head"><div class="icon">⌕</div><div><h2>Consultar un dato</h2><p class="card-desc">Recupera información por su clave.</p></div></div>
    <form id="lookup">
      <label for="lookupKey">Clave a consultar</label><input id="lookupKey" placeholder="Escribe una clave guardada" required maxlength="120">
      <button id="lookupButton">⌕ &nbsp; Consultar dato</button>
    </form>
    <pre class="result" id="lookupResult" aria-live="polite">La información consultada aparecerá aquí.</pre>
    <p class="hint">Prueba con la misma clave que acabas de guardar.</p>
  </article>
</section>
<footer class="footer"><span>Proyecto 03 · Aplicación multicontenedor</span><span>Python · Node.js · Redis · Docker</span></footer>
</div>
<script>
async function show(id,url,options){const el=document.getElementById(id);el.textContent="Procesando solicitud...";try{const r=await fetch(url,options);const d=await r.json();el.textContent=JSON.stringify(d,null,2);return {ok:r.ok,data:d,status:r.status}}catch(e){el.textContent="Error de conexión: "+e.message;return {ok:false}}}
function setStatus(id,ok,label){const el=document.getElementById(id);el.className="status "+(ok?"ok":"bad");el.querySelector("span").textContent=label}
async function salud(){const b=document.getElementById("healthButton");b.disabled=true;b.textContent="Comprobando...";const r=await show("health","/api/salud");setStatus("s-visualizacion",true,"En línea");if(r&&r.data&&r.data.servicios){for(const name of ["web","procesamiento"]){const item=r.data.servicios[name];setStatus("s-"+name,!!(item&&item.http===200),item&&item.http===200?"En línea":"Sin conexión")}const p=r.data.servicios.procesamiento;setStatus("s-redis",!!(p&&p.respuesta&&p.respuesta.redis==="conectado"),p&&p.respuesta&&p.respuesta.redis==="conectado"?"Conectado":"Sin conexión")}b.disabled=false;b.innerHTML="↻ &nbsp; Comprobar servicios"}
document.getElementById("form").addEventListener("submit",async e=>{e.preventDefault();const b=document.getElementById("saveButton");b.disabled=true;await show("saveResult","/api/datos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({clave:document.getElementById("clave").value.trim(),valor:document.getElementById("valor").value})});b.disabled=false});
document.getElementById("lookup").addEventListener("submit",async e=>{e.preventDefault();const b=document.getElementById("lookupButton");b.disabled=true;await show("lookupResult","/api/datos/"+encodeURIComponent(document.getElementById("lookupKey").value.trim()));b.disabled=false});
</script>
</body>
</html>`);
});

app.get("/salud", (req, res) => res.json({ servicio: "visualizacion", estado: "saludable" }));

app.get("/api/salud", async (req, res) => {
  const result = {};
  for (const [name, url] of [["web", `${WEB_URL}/salud`], ["procesamiento", `${PROCESAMIENTO_URL}/salud`]]) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      result[name] = { http: response.status, respuesta: await response.json() };
    } catch (error) {
      result[name] = { estado: "error", detalle: error.message };
    }
  }
  const ok = Object.values(result).every(v => v.http === 200);
  res.status(ok ? 200 : 503).json({ visualizacion: "funcionando", servicios: result });
});

app.post("/api/datos", async (req, res) => {
  try {
    const response = await fetch(`${WEB_URL}/api/datos`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body), signal: AbortSignal.timeout(5000)
    });
    res.status(response.status).json(await response.json());
  } catch (error) {
    res.status(503).json({ error: "No se pudo contactar con web", detalle: error.message });
  }
});

app.get("/api/datos/:clave", async (req, res) => {
  try {
    const response = await fetch(`${WEB_URL}/api/datos/${encodeURIComponent(req.params.clave)}`, { signal: AbortSignal.timeout(5000) });
    res.status(response.status).json(await response.json());
  } catch (error) {
    res.status(503).json({ error: "No se pudo contactar con web", detalle: error.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  writeAudit(`Servidor iniciado en puerto ${PORT}`);
  console.log(`Servicio de visualización activo en el puerto ${PORT}`);
});
