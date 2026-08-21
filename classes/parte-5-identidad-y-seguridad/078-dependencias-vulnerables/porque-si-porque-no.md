# Por qué sí y por qué no — Dependencias vulnerables

> [⬅️ Clase 078](README.md) · [📚 Parte 5](../README.md)

| Ecosistema | Por qué sí | Por qué no | Qué se paga |
| --- | --- | --- | --- |
| [Express](../../../atlas/fichas/express.md) · npm | `npm audit` está **dentro del gestor**: cero fricción, sale hasta sin pedirlo | Ruido notorio: avisos de dependencias de desarrollo que nadie va a explotar acaban entrenando al equipo a ignorar la salida | Aprender a filtrar sin dejar de mirar |
| [FastAPI](../../../atlas/fichas/fastapi.md) · PyPI | `pip-audit` es de la PyPA y consulta la base oficial de avisos de Python | Externo al gestor: hay que instalarlo y acordarse. Y sin versiones fijadas, no puede pronunciarse | Fijar versiones antes de poder auditar nada |
| [Spring Boot](../../../atlas/fichas/spring-boot.md) · Maven | OWASP Dependency-Check se engancha al ciclo de vida: la auditoría es una fase más de la construcción | Es un complemento que alguien tiene que añadir, y su análisis es lento | Minutos de construcción a cambio de cobertura |
| [ASP.NET Core](../../../atlas/fichas/aspnet-core.md) · NuGet | `dotnet list package --vulnerable --include-transitive` viene **en el SDK**: un comando, sin instalar nada | Necesita `packages.lock.json` para ser exacto, y no está activado por omisión | Activar el bloqueo de versiones para que el informe sea real |

## 🧭 El hallazgo

Los cuatro ecosistemas pueden hacer lo mismo; lo que cambia es **cuánta
fricción hay entre el equipo y la respuesta**. Node y .NET la ponen en el
gestor que ya usas; Python y la JVM, en una herramienta que hay que añadir.

Parece un detalle de comodidad y no lo es: una auditoría que exige instalar
algo, recordar el comando y ejecutarlo a mano se convierte en una tarea
trimestral, y los avisos aparecen a diario. La seguridad que depende de que
alguien se acuerde no es seguridad — la lección es la misma que la de las
clases 070 y 076: **lo que no está en el camino por omisión, no ocurre.**

De ahí que la respuesta madura no sea ninguna de las cuatro herramientas
sino el sitio donde se ejecutan: **la integración continua y un trabajo
periódico**. Un árbol sin avisos hoy tiene avisos en un mes sin que nadie
haya tocado una línea, porque lo que cambió fue el conocimiento público, no
tu código.

## ⚖️ Lo que una auditoría no puede decirte

Conviene tenerlo claro antes de confiar en un verde:

- **No sabe de días cero.** Solo conoce lo publicado; el aviso de mañana
  cubre el código que ya ejecutas hoy.
- **No sabe si llegas al código afectado.** Marca el paquete, no la ruta de
  ejecución. Por eso un informe con cuarenta hallazgos necesita criterio, no
  cuarenta actualizaciones.
- **No cubre lo que no está fijado.** Sobre un rango de versiones no hay
  veredicto posible, y un informe que no lo declara está informando de una
  cobertura mayor que la real.
- **No mide el riesgo del propio acto de actualizar.** Subir una versión es
  un cambio como cualquier otro, y sin pruebas es un riesgo que se cambia por
  otro (parte 10).

La brecha de Equifax es la síntesis de todo esto: el aviso estaba publicado,
el parche existía, y la herramienta habría dicho «afectada»
[@struts-security]. Lo que falló no fue detectar — fue el tramo entre
detectar y desplegar [@nist-ssdf].

## Fuentes

- [@struts-security] *Apache Struts Security Bulletins*. Apache Software Foundation — <https://cwiki.apache.org/confluence/display/WW/Security+Bulletins>
- [@cisa-kev] *Known Exploited Vulnerabilities Catalog*. CISA — <https://www.cisa.gov/known-exploited-vulnerabilities-catalog>
- [@nist-ssdf] *SP 800-218 — Secure Software Development Framework*. NIST — <https://csrc.nist.gov/projects/ssdf>
