# Clase 078 — Dependencias vulnerables

> [⬅️ 077](../077-politica-de-seguridad-de-contenido/README.md) · [📚 Parte 5](../README.md) · [🎓 Clases](../../README.md) · [079 ➡️](../../parte-6-la-interfaz/079-plantillas-en-el-servidor/README.md)
>
> Parte **5 — Identidad y seguridad** · Nivel **🟡 intermedio** · Pista **`plataforma`**
>
> ✅ **Clase construida** — 4 implementaciones verificadas contra [`contrato.json`](contrato.json).

## 🎯 Objetivo

Saber **qué arrastras y cuándo te expone**. Las siete clases anteriores
protegieron el código que escribes; esta mira el código que **no** escribes
y que sin embargo ejecutas — que en cualquier aplicación moderna es la
inmensa mayoría [@owasp-top10].

## 🧩 La situación

Una aplicación declara **dos** dependencias y ejecuta **seis**. Una de las
cuatro que nadie eligió tiene un aviso de seguridad conocido, crítico y
explotado activamente: **CVE-2017-5638**, la ejecución remota de código en
el analizador multipart de Apache Struts 2 [@cve-2017-5638] — la misma que
está detrás de la brecha de Equifax de 2017 [@struts-security].

## 🧮 El contrato

| Petición | Respuesta | Qué mide |
| --- | --- | --- |
| `GET /dependencias` | `directas: 2`, `total: 6` | **el árbol es mayor que tu manifiesto** |
| `GET /dependencias/struts2-core` | `directa: false`, `traida_por: ["portal-base"]` | nunca la elegiste: la trajo otra |
| `GET /auditoria` | `afectadas: 1`, con `CVE-2017-5638` y `2.5.10.1` | el aviso se localiza y se nombra |
| `GET /auditoria` | el hallazgo es `directa: false` | y se dice que es **transitiva** |
| `GET /auditoria?version=2.5.13` | `afectadas: 0` | actualizar **cierra** el aviso |
| `GET /auditoria?version=2.5.9` | **`afectadas: 1`** | la comparación es **numérica** |

El último caso es el que convierte esta clase en una medición y no en una
declaración de intenciones. `2.5.9` está afectada porque `9 < 10`, pero
**alfabéticamente `"2.5.9" > "2.5.10"`**: un auditor que compare versiones
como texto declara sana una versión vulnerable. Es un fallo silencioso, no
lanza ninguna excepción, y produce exactamente lo peor que puede producir
una herramienta de seguridad: **un verde falso**.

Y el quinto y el sexto juntos prueban que la auditoría *compara* en lugar de
llevar la respuesta escrita: la misma petición con distinta versión da
distinto veredicto en las dos direcciones.

## 🔬 Qué es dato congelado aquí, y por qué

Con la misma honestidad que la clase 077:

- **El aviso es real** y su identificador es verificable [@cve-2017-5638];
  el catálogo de CISA lo lista como explotado activamente [@cisa-kev].
- **El árbol y la base de avisos son instantáneas congeladas**, en
  `datos/`. No hay ninguna biblioteca vulnerable instalada: **este
  laboratorio no instala software vulnerable**, audita datos sobre él — que
  es literalmente lo que hace un auditor de dependencias.
- **Congelar la base es lo que hace repetible el contrato.** En producción
  se consulta en línea (OSV, GHSA, el catálogo KEV) y cambia cada día; un
  contrato atado a un feed vivo daría verdes y rojos distintos cada semana
  sin que el código cambiara.

<!-- generado: fichas -->

## 🧰 Las piezas de esta clase, una por una

Antes del código: **qué es cada framework, qué versión se está usando y qué hace falta para ejecutarlo**. Todo lo de esta sección sale de los archivos reales del repositorio —el catálogo, la receta de arranque y el manifiesto de dependencias de cada ecosistema—, así que no puede quedarse desactualizado sin que la validación lo detecte.

| Framework | Qué es | Desde | Licencia | Quién lo mantiene |
| --- | --- | ---: | --- | --- |
| **Express** | framework web de Node.js (JavaScript) | 2010 | MIT | OpenJS Foundation |
| **FastAPI** | framework web de Python (Python) | 2018 | MIT | proyecto independiente |
| **Spring Boot** | framework de aplicación de JVM (Java) | 2014 | Apache-2.0 | Broadcom/VMware y colaboradores |
| **ASP.NET Core** | framework web de .NET (C#) | 2016 | MIT | Microsoft y .NET Foundation |

### 🔧 Express

Definió el modelo de middleware encadenado que copiaron casi todos los frameworks de Node.js. Minimalista no significa biblioteca: posee el bucle de peticiones.

- **Documentación oficial:** <https://expressjs.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `express ^5.1.0`
- **Necesita en el PATH:** `node`, `pnpm`

Preparar sus dependencias, dentro de su directorio:

```bash
pnpm install --silent --ignore-scripts
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 node server.mjs
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `datos/arbol.json` | datos en JSON usados por la implementación |
| `datos/avisos.json` | datos en JSON usados por la implementación |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `package.json` | manifiesto de Node.js: nombre, tipo de módulo y dependencias con su rango de versión |
| `pnpm-lock.yaml` | archivo de bloqueo: la versión exacta de cada dependencia y de sus dependencias |
| `pnpm-workspace.yaml` | raíz de instalación propia, y la prohibición de ejecutar scripts al instalar |
| `server.mjs` | código JavaScript (módulo ES) |

### 🔧 FastAPI

Deriva validación, serialización y documentación OpenAPI de las anotaciones de tipo. Demostró que el tipado opcional de Python podía ser infraestructura, no adorno.

- **Documentación oficial:** <https://fastapi.tiangolo.com/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `fastapi>=0.115, uvicorn>=0.30`
- **Necesita en el PATH:** `python`

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 python -m uvicorn main:app --host 127.0.0.1 --port 3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `datos/arbol.json` | datos en JSON usados por la implementación |
| `datos/avisos.json` | datos en JSON usados por la implementación |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `main.py` | código Python |
| `requirements.txt` | dependencias de Python, una por línea, con versión fijada |

### 🔧 Spring Boot

Autoconfiguración y servidor incrustado sobre Spring. Convirtió un framework famoso por su configuración XML en uno de arranque inmediato.

- **Documentación oficial:** <https://spring.io/projects/spring-boot>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `spring-boot 3.5.6, Java 21, spring-boot-starter-web`
- **Necesita en el PATH:** `java`, `mvn`

Preparar sus dependencias, dentro de su directorio:

```bash
mvn -q -B package -DskipTests
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 java -jar target/clase-078-1.0.0.jar --server.port=3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `datos/arbol.json` | datos en JSON usados por la implementación |
| `datos/avisos.json` | datos en JSON usados por la implementación |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `pom.xml` | manifiesto de Maven: el proyecto, su Java, sus dependencias y cómo se empaqueta |
| `src/main/java/labs/Aplicacion.java` | código Java |
| `src/main/resources/application.properties` | configuración de Spring Boot: lo que se ajusta sin tocar el código |

### 🔧 ASP.NET Core

Reescritura multiplataforma y de código abierto de la pila web de Microsoft. Sus API mínimas trajeron el estilo de los microframeworks al ecosistema .NET.

- **Documentación oficial:** <https://learn.microsoft.com/aspnet/core/>
- **Estado en el catálogo:** activo
- **Versión que ejecuta esta clase:** `net10.0`
- **Necesita en el PATH:** `dotnet`

Preparar sus dependencias, dentro de su directorio:

```bash
dotnet build -c Release --nologo -v quiet
```

Arrancarla suelta, sin el verificador:

```bash
PORT=3000 dotnet run -c Release --no-build --urls http://127.0.0.1:3000
```

Qué hay dentro de su directorio:

| Archivo | Qué es |
| --- | --- |
| `Clase078.csproj` | proyecto de .NET: el marco de destino y las dependencias |
| `datos/arbol.json` | datos en JSON usados por la implementación |
| `datos/avisos.json` | datos en JSON usados por la implementación |
| `ejecutar.json` | la receta que usa el verificador: qué hace falta, cómo se prepara y cómo arranca |
| `Program.cs` | código C# |

> Si alguna cadena de herramientas no está en tu máquina, `node scripts/doctor.mjs` dice cuál falta y con qué comando se instala. No hace falta tenerlas todas: el verificador ejecuta lo que encuentra y **declara** lo que omitió.

<!-- fin generado: fichas -->

## 🌐 Las implementaciones — el código a la vista

Las cuatro implementan **el mismo auditor en cuatro lenguajes**: leer el árbol,
cruzarlo con los avisos, comparar versiones numéricamente y decir **quién trajo**
la afectada. La uniformidad es deliberada — como en la 069, lo que se compara no
es el código sino lo que cada ecosistema pone alrededor.

Y el corazón del auditor son quince líneas que deciden si la herramienta sirve
o miente.

### La comparación de versiones · [`express/server.mjs`](implementaciones/express/server.mjs)

```javascript
function menorQue(a, b) {
  const pa = String(a).split(".").map(Number);
  const pb = String(b).split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x < y;
  }
  return false;
}
```

**Comparar versiones como texto es el error que convierte una auditoría en un
tranquilizante.** `"2.5.9" > "2.5.10"` es cierto alfabéticamente, así que una
comparación textual declararía sana una versión afectada — sin excepción, sin
registro, produciendo lo peor que puede producir una herramienta de seguridad:
un verde falso.

Y el `?? 0` no es defensivo por costumbre: un componente que falta cuenta como
cero, para que `2.5.10 < 2.5.10.1`.

### FastAPI · [`fastapi/main.py`](implementaciones/fastapi/main.py)

```python
    ta, tb = _tupla(a), _tupla(b)
    largo = max(len(ta), len(tb))
    ta = ta + (0,) * (largo - len(ta))
    tb = tb + (0,) * (largo - len(tb))
    return ta < tb
```

Python es el único de los cuatro que **no necesita el bucle**: rellena las dos
tuplas hasta la misma longitud y deja que la comparación de tuplas haga el
recorrido componente a componente. Menos código, y sobre todo menos sitio donde
equivocarse.

### Spring Boot · [`spring-boot/…/Aplicacion.java`](implementaciones/spring-boot/src/main/java/labs/Aplicacion.java)

```java
    private static boolean menorQue(String a, String b) {
        String[] pa = a.split("\\.");
        String[] pb = b.split("\\.");
        int largo = Math.max(pa.length, pb.length);
        for (int i = 0; i < largo; i++) {
            int x = i < pa.length ? Integer.parseInt(pa[i]) : 0;
            int y = i < pb.length ? Integer.parseInt(pb[i]) : 0;
            if (x != y) {
                return x < y;
            }
        }
        return false;
    }
```

Idéntico al de Express con un detalle propio del lenguaje: `split("\\.")` lleva
el punto escapado porque **`String.split` recibe una expresión regular**, no un
separador literal. Un `split(".")` a secas devuelve un array vacío y el auditor
diría que ninguna versión está afectada.

### ASP.NET Core · [`aspnet-core/Program.cs`](implementaciones/aspnet-core/Program.cs)

```csharp
static bool MenorQue(string a, string b)
{
    var pa = a.Split('.');
    var pb = b.Split('.');
    for (var i = 0; i < Math.Max(pa.Length, pb.Length); i++)
    {
        var x = i < pa.Length ? int.Parse(pa[i]) : 0;
        var y = i < pb.Length ? int.Parse(pb[i]) : 0;
        if (x != y) return x < y;
    }
    return false;
}
```

`Split('.')` con un carácter, no con una cadena: C# distingue los dos y aquí la
sobrecarga correcta es literal. La misma función, y la trampa de Java no existe.

### Lo que hace accionable un hallazgo

```javascript
      directa: paquete.directa,
      traida_por: paquete.traida_por,
      explotada_activamente: aviso.explotada_activamente === true,
```

Un hallazgo sin estos tres campos es una alarma; con ellos es una tarea. **Sobre
una dependencia transitiva no se actualiza**: o subes a quien la trajo, o
fuerzas la versión — y saber cuál de las dos requiere saber quién la trajo.

```javascript
    const forzada = peticion.query.version;
```

Y `?version=` permite preguntar «¿y si actualizo?» **sin tocar el árbol**. Es la
pregunta que se hace *antes* de planificar la actualización, y es también lo que
demuestra que el auditor compara en vez de llevar la respuesta escrita: la
misma petición con distinta versión da distinto veredicto en las dos
direcciones.

> ⚠️ Los dos ficheros de `datos/` son **datos congelados, no software
> instalado**: el árbol de una aplicación de 2017 y una instantánea de la base
> de avisos. Este laboratorio no instala bibliotecas vulnerables — audita datos
> sobre ellas, que es literalmente lo que hace un auditor. Y congelar la base es
> lo que hace repetible el contrato: atado a un feed vivo daría verdes distintos
> cada semana sin que el código cambiara.

## 📊 Comparación

Lo que trae de serie cada ecosistema para hacer esto de verdad:

| Ecosistema | La herramienta | Dónde vive el árbol resuelto |
| --- | --- | --- |
| Node.js | **`npm audit` / `pnpm audit`**, integrado en el gestor | `package-lock.json`, `pnpm-lock.yaml` |
| Python | `pip-audit` (PyPA), externo al gestor | `requirements.txt` fijado, `poetry.lock`, `uv.lock` |
| JVM | OWASP Dependency-Check, complemento de Maven/Gradle | resolución de Maven (`mvn dependency:tree`) |
| .NET | **`dotnet list package --vulnerable`**, en el propio SDK | `packages.lock.json` |

Node y .NET lo traen **dentro de la herramienta que ya usas**; Python y la
JVM lo dejan en un complemento que hay que añadir y recordar. La diferencia
no es de calidad del análisis sino de **fricción**, y en seguridad la
fricción decide: lo que no está a un comando de distancia no se ejecuta.

Y una condición previa que atraviesa las cuatro: **sin fichero de bloqueo no
hay auditoría posible**. Un `^4.17.0` no identifica una versión, y sobre un
rango no se puede pronunciar ningún aviso. Auditar sin *lockfile* es
auditar la mitad del árbol y llamarlo entero.

## 🧭 Un hallazgo no es una alarma

El resultado de una auditoría no es una lista de tareas: es una lista de
preguntas. Lo que decide la urgencia:

- **¿Está explotada activamente?** El catálogo KEV de CISA existe para esa
  pregunta [@cisa-kev]; un aviso crítico teórico y uno con exploits en
  circulación no se tratan igual.
- **¿Llegas a ejecutar el código afectado?** Una vulnerabilidad en una vía
  que tu aplicación nunca recorre es real pero no alcanzable — el matiz que
  separa un parche de urgencia de uno planificado.
- **¿Es directa o transitiva?** Si es transitiva, no la actualizas tú: o
  actualizas a quien la trajo, o fuerzas la versión (`overrides`,
  `dependencyManagement`) y asumes la incompatibilidad.
- **¿Cuánto tardas en desplegar el parche?** Es la métrica que la brecha de
  Equifax convirtió en famosa: el aviso y el parche de Struts existían
  **meses** antes [@struts-security]. Lo que falló no fue detectar, fue
  desplegar.

## ⚠️ Errores frecuentes

- **Comparar versiones como texto.** El sexto caso del contrato: un verde
  falso, silencioso.
- **Auditar sin fichero de bloqueo.** Sin versiones exactas, la cobertura
  real del análisis es menor que la que informa.
- **Mirar solo las directas.** Cuatro de las seis del árbol —y la única
  afectada— no están en el manifiesto.
- **Ejecutar la auditoría solo a mano.** Un árbol sano hoy no lo es en un
  mes sin tocar una línea: los avisos nuevos aparecen sobre el código
  existente. Va en integración continua, y en un trabajo periódico.
- **Actualizarlo todo a ciegas al primer aviso.** Actualizar es un cambio,
  y un cambio sin pruebas es otro riesgo (parte 10).
- **Confundir «no hay avisos» con «es seguro».** La auditoría solo sabe de
  lo **publicado**; el día cero no aparece en ninguna base.
- **Ignorar los avisos de las dependencias de desarrollo.** No van a
  producción, pero corren en tu máquina y en tu integración continua — con
  acceso a tus credenciales [@nist-ssdf].

## ✅ Verificación

```bash
node scripts/run-class.mjs 078
```

Los casos están en [`contrato.json`](contrato.json). El verificador ejecuta
las implementaciones que encuentre y declara las que omitió.

## 🧪 Reto de transferencia

Añade a la base un aviso con **rango** (`introducida_en` y `fijada_en`) en
lugar de solo el límite superior, y el caso que lo mide: una versión
**anterior** a `introducida_en` **no** está afectada. Es el error opuesto al
del sexto caso —el falso positivo— y el que hace que los equipos dejen de
mirar los informes.

## 🔗 Enlaces

- [Por qué sí y por qué no](porque-si-porque-no.md)
- [Clase 075 — Secretos y configuración](../075-secretos-y-configuracion/README.md) — la otra mitad de la seguridad de plataforma
- [Parte 5 — Identidad y seguridad](../README.md) — la parte que esta clase cierra

## Fuentes

- [@cve-2017-5638] *CVE-2017-5638 — Apache Struts remote code execution*. — <https://nvd.nist.gov/vuln/detail/CVE-2017-5638>
- [@struts-security] *Apache Struts Security Bulletins*. Apache Software Foundation — <https://cwiki.apache.org/confluence/display/WW/Security+Bulletins>
- [@cisa-kev] *Known Exploited Vulnerabilities Catalog*. CISA — <https://www.cisa.gov/known-exploited-vulnerabilities-catalog>
- [@owasp-top10] *OWASP Top 10* (A06: Vulnerable and Outdated Components). OWASP — <https://owasp.org/www-project-top-ten/>
- [@nist-ssdf] *SP 800-218 — Secure Software Development Framework (SSDF)*. NIST — <https://csrc.nist.gov/projects/ssdf>
- [@slsa] *SLSA — Supply-chain Levels for Software Artifacts*. — <https://slsa.dev/>
