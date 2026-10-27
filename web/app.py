from flask import Flask, jsonify, request
import logging
import os
from pathlib import Path
import requests
import redis

app = Flask(__name__)
PROCESAMIENTO_URL = os.getenv("PROCESAMIENTO_URL", "http://localhost:5001")
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))

Path("/app/logs").mkdir(parents=True, exist_ok=True)
logging.basicConfig(
    filename="/app/logs/web.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)

def redis_client():
    return redis.Redis(
        host=REDIS_HOST, port=REDIS_PORT,
        decode_responses=True, socket_connect_timeout=2
    )

@app.get("/")
def inicio():
    return jsonify({
        "proyecto": "Proyecto 03",
        "servicio": "web-python",
        "estado": "funcionando",
        "rutas": ["/salud", "/redis", "/api/procesamiento/salud"]
    })

@app.get("/salud")
def salud():
    return jsonify({"servicio": "web", "estado": "saludable"})

@app.get("/redis")
def comprobar_redis():
    try:
        redis_client().ping()
        return jsonify({"redis": "conectado", "estado": "correcto"})
    except redis.RedisError as exc:
        app.logger.exception("Error conectando con Redis")
        return jsonify({"redis": "desconectado", "error": str(exc)}), 503

@app.get("/api/procesamiento/salud")
def salud_procesamiento():
    try:
        response = requests.get(f"{PROCESAMIENTO_URL}/salud", timeout=3)
        return jsonify({
            "servicio_web": "funcionando",
            "respuesta_procesamiento": response.json()
        }), response.status_code
    except requests.RequestException as exc:
        app.logger.exception("Error consultando procesamiento")
        return jsonify({"error": "No se pudo contactar procesamiento", "detalle": str(exc)}), 503

@app.post("/api/datos")
def guardar_dato():
    body = request.get_json(silent=True) or {}
    if not isinstance(body.get("clave"), str) or not body["clave"].strip() or "valor" not in body:
        return jsonify({"error": "Envía un JSON con clave (texto) y valor"}), 400
    try:
        response = requests.post(
            f"{PROCESAMIENTO_URL}/datos",
            json={"clave": body["clave"].strip(), "valor": body["valor"]},
            timeout=5
        )
        return jsonify(response.json()), response.status_code
    except requests.RequestException as exc:
        app.logger.exception("Error guardando dato")
        return jsonify({"error": "No se pudo guardar el dato", "detalle": str(exc)}), 503

@app.get("/api/datos/<path:clave>")
def consultar_dato(clave):
    try:
        response = requests.get(f"{PROCESAMIENTO_URL}/datos/{clave}", timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.RequestException as exc:
        app.logger.exception("Error consultando dato")
        return jsonify({"error": "No se pudo consultar el dato", "detalle": str(exc)}), 503

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
