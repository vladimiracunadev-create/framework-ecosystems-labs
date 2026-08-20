# ☁️ Plataformas de ejecución

> [⬅️ Atlas](../README.md) · [🗂️ Índice](../frameworks.md) · [🧭 Taxonomía](../../docs/TAXONOMY.md)

**Una sola entrada, y está aquí para marcar una frontera.** Kubernetes no es un
framework de aplicación, y compararlo con uno es el error de categoría que el
[módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md) enseña a detectar en
su primera hora.

## La distinción, con las cinco preguntas del módulo 00

| Pregunta | Framework de aplicación | Plataforma de ejecución |
| --- | --- | --- |
| ¿Arranca tu código? | Sí, dentro del proceso | No: arranca **tu proceso entero**, desde fuera |
| ¿Uso parcial? | A veces | No: la adoptas o no |
| ¿Define el ciclo de vida? | El de la petición | El del **contenedor**: arranque, sondas, reinicio, retirada |
| ¿Depende de otra tecnología? | Del runtime | De una infraestructura completa |
| ¿Quién lo ejecuta? | Tú, en tu proceso | Un plano de control, tuyo o de un tercero |

Ambos «controlan el ciclo de vida», pero de cosas distintas. Un framework decide
cuándo se llama a tu manejador. Una plataforma decide cuándo **existe** tu
proceso.

## Por qué aparece en un programa sobre frameworks

Porque **condiciona el contrato**, y eso es visible en el propio código del
repositorio. El [módulo 12](../../curriculum/12-producto-final.md) exige separar
la sonda de **vivo** de la de **listo**:

```javascript
export async function estado({ baseDeDatos }) {
  // «vivo» responde siempre que el proceso funcione: si depende de la base de
  // datos, un fallo de esta provoca el reinicio en bucle de un proceso sano.
  const vivo = { status: "ok" };
  const listo = (await baseDeDatos.ping()) ? { status: "ok" } : { status: "degraded", reason: "database" };
  return { vivo, listo };
}
```

Esa distinción **no existe** sin una plataforma que reinicie procesos. Aparece
porque alguien externo va a decidir, cada pocos segundos, si tu proceso sigue
mereciendo tráfico. Confundir las dos sondas produce el fallo clásico: la base de
datos se degrada, la sonda de vida falla, la plataforma reinicia procesos sanos,
y el reinicio masivo empeora la degradación.

## Otras decisiones que la plataforma impone

| La plataforma exige | Y eso condiciona |
| --- | --- |
| Configuración por entorno, no en archivos del artefacto | El arranque debe fallar si falta una variable, no en la primera petición [@twelve-factor] |
| Procesos efímeros y reemplazables | Nada de estado en memoria que no se pueda perder; afecta a las sesiones |
| Cierre ordenado ante una señal | El servidor debe atender `SIGTERM` y terminar lo que está sirviendo |
| Registros por la salida estándar | Nada de escribir archivos de registro dentro del contenedor |

Cuatro requisitos que no vienen del framework y que ninguna comparación de
frameworks recoge, pero que determinan si el producto es operable.

## La tecnología

<!-- generado:tabla-ecosistema cloud -->
| Tecnología | Clasificación | Desde | Era | Estado | Licencia | Documentación |
| --- | --- | ---: | --- | --- | --- | --- |
| [**Kubernetes**](../fichas/kubernetes.md) | `platform` | 2014 | 🟢 Vigente | 🟢 activo | `Apache-2.0` | [oficial](https://kubernetes.io/docs/home/) |
<!-- fin -->

## Qué aporta

<!-- generado:notas-ecosistema cloud -->
- **Kubernetes** — No es un framework de aplicación y compararlo con uno es un error de categoría. Condiciona, eso sí, las sondas de vida y de disponibilidad que el módulo 12 exige.
<!-- fin -->

## Fuentes

- [@twelve-factor] The Twelve-Factor App — <https://12factor.net/>
