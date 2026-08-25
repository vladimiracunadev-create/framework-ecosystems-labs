use std::hint::black_box;
use std::time::Instant;

use serde_json::{json, Value};
use sha2::{Digest, Sha256};

// LA MEDICION, SIN NADA DE AXUM DENTRO.
//
// El metodo no depende del framework — por eso este archivo no lo menciona, y
// por eso es el mismo que el de Express, Fastify y Gin traducido a Rust. Lo que
// cambia entre las cuatro implementaciones es el lenguaje, no lo que se hace.

// LA UNIDAD DE TRABAJO. Determinista y con coste real.
//
// Cuatrocientos hashes encadenados sobre la misma semilla: siempre el mismo
// resultado, siempre el mismo trabajo.
pub const VUELTAS: usize = 400;

pub fn trabajo() -> String {
    let mut dato: Vec<u8> = b"clase-007".to_vec();
    for _ in 0..VUELTAS {
        let mut hasher = Sha256::new();
        hasher.update(&dato);
        dato = hasher.finalize().to_vec();
    }
    hex::encode(&dato)[..16].to_string()
}

// `black_box` le dice al compilador que no puede suponer nada sobre este valor.
//
// Sin el, un optimizador que ve que el resultado no se usa puede BORRAR EL
// TRABAJO ENTERO y dejar el bucle vacio. En Rust y en Go pasa de verdad, y el
// resultado son mediciones de cero coma nada que no miden nada.
//
// Es la tercera forma de mentir con un numero de rendimiento, despues de no
// calentar y de publicar solo la media.
fn muestrear(n: usize) -> Vec<f64> {
    let mut tiempos = Vec::with_capacity(n);
    for _ in 0..n {
        let inicio = Instant::now();
        black_box(trabajo());
        tiempos.push(inicio.elapsed().as_nanos() as f64 / 1e6);
    }
    tiempos
}

fn media(xs: &[f64]) -> f64 {
    xs.iter().sum::<f64>() / xs.len() as f64
}

// El percentil p de una muestra ya ordenada.
//
// Con el metodo del rango mas cercano: el valor por debajo del cual queda al
// menos el p por ciento de las observaciones. No se interpola, para no inventar
// un numero que nadie midio.
fn percentil(ordenados: &[f64], p: f64) -> f64 {
    let indice = ((ordenados.len() as f64) * p / 100.0).ceil() as usize;
    ordenados[indice.saturating_sub(1).min(ordenados.len() - 1)]
}

fn redondear(x: f64) -> f64 {
    (x * 10_000.0).round() / 10_000.0
}

// LA MEDICION MAL HECHA.
//
// Sin calentar y publicando solo la media. No esta exagerada: es exactamente lo
// que aparece en la mayoria de las comparativas que circulan.
pub fn medir_mal(n: usize) -> Value {
    let tiempos = muestrear(n);
    json!({
        "muestras": n,
        "calentamiento": 0,
        "publica": "solo la media",
        "media_ms": redondear(media(&tiempos)),
        "por_que_esta_mal": [
            "no calienta: las primeras muestras miden las caches frias, no el trabajo",
            "publica una media: un solo numero no dice nada sobre la forma de la distribucion",
            "no dice cuantas veces se repitio ni en que maquina",
        ],
    })
}

// LA MEDICION BIEN HECHA.
//
// Calienta, mide, ordena y publica la distribucion entera. La media sigue ahi —
// no es que sea falsa, es que sola no basta.
pub fn medir_bien(n: usize) -> Value {
    let calentamiento = (n / 5).max(20);
    muestrear(calentamiento);

    let tiempos = muestrear(n);
    let mut ordenados = tiempos.clone();
    ordenados.sort_by(|a, b| a.partial_cmp(b).unwrap());

    json!({
        "muestras": n,
        "calentamiento": calentamiento,
        "publica": "percentiles",
        "media_ms": redondear(media(&tiempos)),
        "p50_ms": redondear(percentil(&ordenados, 50.0)),
        "p90_ms": redondear(percentil(&ordenados, 90.0)),
        "p99_ms": redondear(percentil(&ordenados, 99.0)),
        "maximo_ms": redondear(ordenados[ordenados.len() - 1]),
    })
}

// LO QUE HAY QUE PUBLICAR PARA QUE UN NUMERO SIGNIFIQUE ALGO.
//
// Cuatro datos. Una comparativa a la que le falte uno no se puede reproducir, y
// lo que no se puede reproducir no es una medicion: es una anecdota.
//
// El cuarto es el que mas duele en Rust: medir en modo DEPURACION da numeros
// hasta diez veces peores, y es el error mas comun de quien compara contra Rust
// sin haberlo compilado nunca.
pub fn entorno(version_del_framework: &str) -> Value {
    let modo = if cfg!(debug_assertions) {
        "depuracion, SIN optimizar: los numeros no valen para comparar"
    } else {
        "release, optimizado"
    };

    json!({
        "publica": ["runtime", "version_del_framework", "nucleos", "modo_de_compilacion"],
        "runtime": "rust nativo, sin maquina virtual ni recoleccion de basura",
        "version_del_framework": version_del_framework,
        "nucleos": std::thread::available_parallelism().map(|n| n.get()).unwrap_or(0),
        "modo_de_compilacion": modo,
        "aviso": "estos cuatro datos describen la maquina que ejecuta, no el framework: cambiarla cambia todos los numeros",
    })
}

// LO QUE SE PUEDE AFIRMAR SIN SABER EN QUE MAQUINA SE EJECUTA.
//
// `la_media_oculta_la_cola` es cierto en cualquier ordenador: siempre hay
// peticiones lentas y la media las esconde. Esa afirmacion si se puede meter en
// un contrato.
//
// «Este framework es un 30 % mas rapido que aquel» no, y por eso no esta aqui.
pub fn comparar(n: usize) -> Value {
    let mal = medir_mal(n);
    let bien = medir_bien(n);

    let p99 = bien["p99_ms"].as_f64().unwrap_or(0.0);
    let media_bien = bien["media_ms"].as_f64().unwrap_or(1.0);
    let media_mal = mal["media_ms"].as_f64().unwrap_or(0.0);

    json!({
        "mal_hecha": mal,
        "bien_hecha": bien,
        "la_media_oculta_la_cola": p99 > media_bien,
        "cuanto_la_oculta": format!("p99 es {:.1}× la media", p99 / media_bien),
        "el_calentamiento_cambia_el_numero": (media_mal - media_bien).abs() > f64::EPSILON,
        "mide_esta_maquina_no_el_framework": true,
        "lo_que_no_se_puede_afirmar": "que un framework sea mas rapido que otro: eso exige la misma maquina, el mismo trabajo y la distribucion entera",
    })
}
