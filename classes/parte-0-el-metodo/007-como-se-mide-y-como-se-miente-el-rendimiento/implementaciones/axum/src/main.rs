mod medicion;

use std::collections::HashMap;

use axum::{extract::Query, routing::get, Json, Router};
use serde_json::{json, Value};

use medicion::{comparar, entorno, medir_bien, medir_mal, trabajo, VUELTAS};

// La version de axum no se escribe a mano: se lee del propio `Cargo.toml`, que
// esta en el directorio desde el que se ejecuta.
//
// Un numero de version copiado a mano en un informe de rendimiento es el primer
// sitio por donde se cuela una mentira, y el mas dificil de detectar despues.
fn version_de_axum() -> String {
    let manifiesto = std::fs::read_to_string("Cargo.toml").unwrap_or_default();
    for linea in manifiesto.lines() {
        if let Some(resto) = linea.strip_prefix("axum = ") {
            return format!("axum {}", resto.trim().trim_matches('"'));
        }
    }
    "axum (version desconocida)".to_string()
}

// Cuantas repeticiones, con un tope.
//
// Sin tope, `?n=10000000` bloquearia el hilo — y una ruta que mide no deberia
// poder tumbar el servicio que mide.
fn repeticiones(parametros: &HashMap<String, String>) -> usize {
    parametros
        .get("n")
        .and_then(|v| v.parse::<usize>().ok())
        .unwrap_or(100)
        .clamp(1, 2000)
}

async fn ruta_trabajo() -> Json<Value> {
    Json(json!({ "hecho": true, "vueltas": VUELTAS, "huella": trabajo() }))
}

async fn ruta_medir_mal(Query(p): Query<HashMap<String, String>>) -> Json<Value> {
    Json(medir_mal(repeticiones(&p)))
}

async fn ruta_medir_bien(Query(p): Query<HashMap<String, String>>) -> Json<Value> {
    Json(medir_bien(repeticiones(&p)))
}

async fn ruta_comparar(Query(p): Query<HashMap<String, String>>) -> Json<Value> {
    Json(comparar(repeticiones(&p)))
}

async fn ruta_entorno() -> Json<Value> {
    let version = version_de_axum();
    let mut salida = entorno(&version);
    salida["framework"] = json!(version);
    Json(salida)
}

#[tokio::main]
async fn main() {
    let aplicacion = Router::new()
        .route("/trabajo", get(ruta_trabajo))
        .route("/medir-mal", get(ruta_medir_mal))
        .route("/medir-bien", get(ruta_medir_bien))
        .route("/comparar", get(ruta_comparar))
        .route("/entorno", get(ruta_entorno));

    let puerto = std::env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let escucha = tokio::net::TcpListener::bind(format!("127.0.0.1:{puerto}"))
        .await
        .expect("no se pudo abrir el puerto");

    axum::serve(escucha, aplicacion).await.expect("el servidor termino");
}
