# ☸️ Kubernetes — 2014

> [⬅️ Atlas](../README.md) · [☁️ Plataformas de ejecución](../ecosistemas/cloud.md) · [🗂️ Índice](../frameworks.md)

Kubernetes no es un framework de aplicación, y compararlo con uno es el error de
categoría que el [módulo 00](../../curriculum/00-taxonomia-y-diagnostico.md)
enseña a detectar en su primera hora. Está en el Atlas por una razón distinta:
**condiciona el contrato de todas las aplicaciones que se ejecutan encima**, y esa
influencia sí es materia de este programa.

> **🎯 Por qué está en este programa**
>
> Porque la distinción entre sonda de **vida** y sonda de **disponibilidad** que
> exige el [módulo 12](../../curriculum/12-producto-final.md) **no existe sin una
> plataforma que reinicie procesos**. Es el ejemplo más claro del catálogo de cómo
> una decisión de infraestructura entra dentro del código de la aplicación.

| | |
|---|---|
| **Aparición** | 2014, publicado por Google |
| **Clasificación** | `platform` — orquestador de contenedores |
| **Ecosistema** | Cloud (escrito en Go) |
| **Licencia** | `Apache-2.0` |
| **Gobierno** | CNCF |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://kubernetes.io/docs/home/> |

---

## 💡 El modelo: declarar el estado deseado

La idea central no es «ejecutar contenedores»: es **describir el estado que
quieres y dejar que un bucle de control lo mantenga** [@hightower-kubernetes].

```yaml
# No dices "arranca tres copias". Dices "quiero tres copias".
# Si una muere, el bucle de control crea otra sin que nadie intervenga.
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: taskflow
          image: taskflow:2.0.0
          livenessProbe:                  # ¿el proceso está vivo?
            httpGet: { path: /health, port: 3000 }
          readinessProbe:                 # ¿puede recibir tráfico?
            httpGet: { path: /ready, port: 3000 }
```

Esa diferencia entre «ordenar» y «declarar» es la que hace posible la
recuperación automática, y también la que obliga a la aplicación a comportarse de
cierta manera.

## 🩺 Las dos sondas: el error que cuesta un incidente

Es el punto donde la plataforma entra en el código, y donde se comete el fallo
clásico:

| Sonda | Pregunta | Si falla |
| --- | --- | --- |
| **Vida** | ¿El proceso funciona? | Kubernetes **lo mata y lo reinicia** |
| **Disponibilidad** | ¿Puede atender ahora? | Deja de enviarle tráfico, **sin matarlo** |

```javascript
export async function estado({ baseDeDatos }) {
  // «vivo» NO debe depender de la base de datos: si depende, un fallo de esta
  // provoca el reinicio en bucle de procesos que están perfectamente sanos.
  const vivo = { status: "ok" };
  const listo = (await baseDeDatos.ping()) ? { status: "ok" } : { status: "degraded", reason: "database" };
  return { vivo, listo };
}
```

**El incidente típico:** la base de datos se degrada → la sonda de vida la
consulta y falla → la plataforma reinicia todas las réplicas → los reinicios
masivos añaden carga → la degradación empeora. Un fallo recuperable se convierte
en una caída total **por culpa de una comprobación mal escrita**.

## 📋 Lo que la plataforma exige de la aplicación

Cuatro requisitos que no vienen de ningún framework y que ninguna comparativa de
frameworks recoge:

| La plataforma exige | Consecuencia en el código |
| --- | --- |
| Configuración por entorno | Fallar **al arrancar** si falta una variable, no en la primera petición |
| Procesos efímeros y reemplazables | Nada de estado en memoria que no se pueda perder |
| Cierre ordenado ante `SIGTERM` | Dejar de aceptar peticiones nuevas y terminar las que están en curso |
| Registros por la salida estándar | No escribir archivos de registro dentro del contenedor |

Son los mismos principios que el [módulo 12](../../curriculum/12-producto-final.md)
exige en la entrega final, y su origen está aquí.

## ⚖️ La pregunta incómoda: ¿lo necesitas?

Kubernetes resuelve problemas reales de escala, y **tiene un coste operativo alto
que hay que declarar**: red, almacenamiento, políticas, actualizaciones del propio
clúster, observabilidad y personal que lo entienda.

El [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md) pide puntuar el
coste total de operación, y aquí eso significa preguntar en serio:

- ¿Cuántos servicios hay? Con tres, un orquestador más simple suele bastar.
- ¿Quién va a operar el clúster? Es un puesto, no una tarea.
- ¿El problema es de escala o de **estructura de equipos**? Muchas adopciones de
  microservicios y Kubernetes resuelven un problema organizativo con una
  herramienta técnica [@skelton-team-topologies].

Los patrones que Kubernetes popularizó —ayudante lateral, embajador, adaptador—
son útiles incluso sin adoptarlo, y merecen conocerse por separado
[@burns-designing-distributed]. Lo mismo con los contenedores en sí, que resuelven
la paridad de entornos sin necesitar orquestador [@poulton-docker].

## 🎯 Objetivos de servicio, no reinicios

Tener recuperación automática invita a un error de razonamiento: creer que la
fiabilidad ya está resuelta. No lo está — solo se ha automatizado la reacción a
un tipo de fallo.

La fiabilidad se define con **objetivos de nivel de servicio y presupuesto de
error**, y con qué se detiene cuando ese presupuesto se agota
[@murphy-sre-workbook]. Es el contenido del
[módulo 08](../../curriculum/08-calidad-rendimiento-y-operacion.md), y es
independiente de la plataforma.

## 🎓 Las tres lecciones

**1. Una plataforma no es un framework, y aun así entra en tu código.** Las dos
sondas son la prueba: una decisión de infraestructura que se escribe en el
manejador HTTP.

**2. La sonda de vida no debe depender de tus dependencias.** Es el error más
caro y más frecuente del modelo, y se evita con una línea.

**3. Automatizar la reacción no es lo mismo que ser fiable.** El presupuesto de
error sigue siendo la conversación, y la plataforma no la tiene por ti.

## 🔗 Enlaces

- Documentación oficial: <https://kubernetes.io/docs/home/>
- [Plataformas de ejecución](../ecosistemas/cloud.md) · [Módulo 12](../../curriculum/12-producto-final.md)

## Fuentes

- [@hightower-kubernetes] Hightower, Kelsey; Burns, Brendan; Beda, Joe. *Kubernetes: Up and Running*. O'Reilly Media, 2017. ISBN 9781491935675 — <https://openlibrary.org/isbn/9781491935675>
- [@burns-designing-distributed] Burns, Brendan. *Designing Distributed Systems*. O'Reilly Media, 2018. ISBN 9781491983645 — <https://openlibrary.org/isbn/9781491983645>
- [@murphy-sre-workbook] Murphy, Niall Richard et al. *The Site Reliability Workbook*. O'Reilly Media, 2018. ISBN 9781492029502 — <https://openlibrary.org/isbn/9781492029502>
- [@poulton-docker] Poulton, Nigel. *Docker Deep Dive*. Packt Publishing, 2020. ISBN 9781800565135 — <https://openlibrary.org/isbn/9781800565135>
- [@skelton-team-topologies] Skelton, Matthew; Pais, Manuel. *Team Topologies*. IT Revolution Press, 2019. ISBN 9781942788812 — <https://openlibrary.org/isbn/9781942788812>
