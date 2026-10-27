from flask import Flask, jsonify, request
import os
from pathlib import Path
import redis

app = Flask(__name__)
REDIS_HOST = os.getenv("REDIS_HOST", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
Path("/app/data").mkdir(parents=True, exist_ok=True)

def client():
    return redis.Redis(
        host=REDIS_HOST, port=REDIS_PORT,
        decode_responses=True, socket_connect_timeout=2
    )

@app.get("/")
def inicio():
    return jsonify({"servicio": "procesamiento", "estado": "funcionando"})

@app.get("/salud")
def salud():
    try:
        client().ping()
        return jsonify({"servicio": "procesamiento", "redis": "conectado", "estado": "saludable"})
    except redis.RedisError as exc:
        return jsonify({"servicio": "procesamiento", "redis": "desconectado", "detalle": str(exc)}), 503

@app.post("/datos")
def guardar():
    data = request.get_json(silent=True) or {}
    if not isinstance(data.get("clave"), str) or not data["clave"].strip() or "valor" not in data:
        return jsonify({"error": "Envía un JSON con clave (texto) y valor"}), 400
    try:
        client().set(data["clave"].strip(), str(data["valor"]))
        return jsonify({"mensaje": "Dato guardado", "clave": data["clave"].strip()}), 201
    except redis.RedisError as exc:
        return jsonify({"error": "No se pudo conectar con Redis", "detalle": str(exc)}), 503

@app.get("/datos/<path:clave>")
def consultar(clave):
    try:
        value = client().get(clave)
        if value is None:
            return jsonify({"error": "La clave no existe", "clave": clave}), 404
        return jsonify({"clave": clave, "valor": value})
    except redis.RedisError as exc:
        return jsonify({"error": "No se pudo conectar con Redis", "detalle": str(exc)}), 503

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
