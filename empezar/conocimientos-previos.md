# Conocimientos previos — las seis cosas que el programa da por sabidas

> [⬅️ Empezar](README.md) · [🎓 Clases](../classes/README.md) · [📚 Programa](../curriculum/README.md)

Este documento no enseña ningún framework. Enseña **el suelo sobre el que se
apoyan todos**: seis ideas que aparecen en la primera clase y no vuelven a
explicarse porque a partir de ahí se dan por conocidas.

Si ya trabajas con servidores, léelo en diagonal y quédate con la sección 3, que
fija el vocabulario exacto con el que están escritos los 149 contratos.

---

## 1. La terminal

Todo el laboratorio se ejecuta escribiendo comandos. No hay un botón.

Un comando es un programa al que se le pasan **argumentos** y que, al terminar,
devuelve un **código de salida**: `0` significa que fue bien y cualquier otro
número que no. Esa convención es la que permite encadenar comprobaciones, y es
la razón de que la integración continua de este repositorio se pueda poner en
rojo sola.

```bash
node scripts/doctor.mjs     # ejecuta el programa `node` con un argumento
echo $?                     # imprime el código de salida (en PowerShell: $LASTEXITCODE)
```

Lo mínimo que hay que saber hacer:

| Quiero | En Linux, macOS y Git Bash | En PowerShell |
| --- | --- | --- |
| Ver dónde estoy | `pwd` | `pwd` |
| Listar archivos | `ls` | `ls` |
| Entrar en un directorio | `cd classes` | `cd classes` |
| Subir uno | `cd ..` | `cd ..` |
| Ver un archivo | `cat README.md` | `cat README.md` |
| Cortar un proceso colgado | `Ctrl+C` | `Ctrl+C` |

En Windows, usa **Windows Terminal**: las consolas antiguas usan una página de
códigos que rompe los acentos y los símbolos `✔ ⊘ ✘` con los que el ejecutor
informa.

**Un error clásico y su causa.** `command not found` (o `no se reconoce como un
comando`) casi nunca significa que el programa no esté instalado: significa que
el sistema no sabe **dónde** buscarlo. La lista de directorios donde busca es la
variable `PATH`, y muchos instaladores la modifican sin avisar a las terminales
ya abiertas. Cerrar la terminal y abrir otra resuelve la mitad de los casos.

## 2. Cliente, servidor y puerto

Un **servidor** es un proceso que se queda esperando. No hace nada hasta que
alguien le habla; entonces responde y vuelve a esperar. Un **cliente** es quien
habla: el navegador, `curl`, o el verificador de este repositorio.

Para que el sistema operativo sepa a qué proceso entregar cada mensaje, cada
servidor **se ata a un puerto**: un número entre 1 y 65535. El registro oficial
de qué número corresponde a qué servicio lo mantiene la IANA
[@iana-port-numbers]; en la práctica, lo que importa aquí son tres reglas:

1. **Un puerto, un proceso.** Si intentas arrancar dos servidores en el 3000, el
   segundo falla con `EADDRINUSE`. Es el error más frecuente al ejecutar clases
   seguidas: un servidor de la anterior que no murió.
2. **Los puertos por debajo de 1024 están reservados** y en Linux y macOS
   requieren privilegios. Por eso el laboratorio usa números altos.
3. **La dirección importa tanto como el número.** `127.0.0.1` solo acepta
   conexiones de tu propia máquina; `0.0.0.0` acepta las de toda la red local.
   Todas las implementaciones de este repositorio se atan a `127.0.0.1` **a
   propósito**: un laboratorio no tiene por qué ser alcanzable desde el wifi de
   la cafetería.

El ejecutor de clases comprueba que el puerto esté libre **antes** de arrancar y
espera a que se libere al terminar. Esa comprobación existe porque sin ella cada
clase acababa probando el servidor de la anterior — un verde perfecto sobre el
programa equivocado.

## 3. Una petición y una respuesta

Este es el vocabulario que usan los 149 contratos. Vale la pena leerlo despacio.

Una **petición** HTTP tiene cuatro partes:

```text
POST /tareas HTTP/1.1            ← método y ruta
content-type: application/json   ← cabeceras
                                 ← línea en blanco
{"titulo":"Comprar pan"}         ← cuerpo
```

- **El método** dice qué se pretende: `GET` leer, `POST` crear, `PUT` reemplazar,
  `PATCH` modificar una parte, `DELETE` borrar. No es decoración: `GET` no debe
  cambiar nada, y de eso dependen las cachés y los buscadores [@rfc9110].
- **La ruta** identifica el recurso.
- **Las cabeceras** son metadatos: qué formato lleva el cuerpo, quién eres, qué
  formatos aceptas de vuelta.
- **El cuerpo** son los datos. `GET` normalmente no lleva.

La **respuesta** tiene la misma forma, con un número en lugar de un método:

```text
201 Created                      ← código de estado
location: /tareas/7              ← cabeceras
content-type: application/json
                                 ← línea en blanco
{"id":7,"titulo":"Comprar pan"}  ← cuerpo
```

Los códigos van por familias, y saberlas evita memorizar:

| Familia | Significa | Ejemplos que verás en las clases |
| --- | --- | --- |
| `2xx` | salió bien | `200` hecho · `201` creado · `204` hecho, sin cuerpo |
| `3xx` | está en otro sitio | `303` mira aquí con un `GET` · `304` no ha cambiado |
| `4xx` | **el cliente** se equivocó | `400` mal formado · `401` no sé quién eres · `403` sé quién eres y no puedes · `404` no existe · `409` conflicto · `422` bien formado pero inválido |
| `5xx` | **el servidor** se equivocó | `500` error no controlado · `503` no disponible |

La frontera entre `4xx` y `5xx` es la más útil de todas: dice **de quién es el
problema**, y por tanto quién tiene que arreglarlo.

Todo esto viaja sobre una conexión TCP y, en la práctica, cifrada con TLS. Cómo
se establece esa conexión y por qué eso condiciona el rendimiento de una página
está contado con detalle en Grigorik [@grigorik-hpbn]; para el laboratorio basta
con saber que existe una conexión debajo y que abrirla cuesta tiempo.

## 4. JSON

**Los contratos de las 149 clases están escritos en JSON**, y la mayoría de las
respuestas que se comparan también.

JSON tiene exactamente seis tipos: objeto, lista, cadena, número, booleano y
`null` [@rfc8259]. Nada más. No hay fechas, no hay comentarios, y no hay
enteros distintos de decimales.

```json
{
  "clase": "011",
  "titulo": "Levantar un servidor y responder",
  "casos": [
    { "peticion": "GET /", "espera": 200 }
  ]
}
```

Tres detalles que causan errores reales:

- **Las claves siempre van entre comillas dobles.** `{clase: "011"}` no es JSON.
- **No admite coma final.** `[1, 2, 3,]` es un error de sintaxis.
- **Las fechas son una convención, no un tipo.** Se transmiten como cadenas, y
  el formato que usa todo este repositorio es el de ISO 8601 en UTC:
  `"2026-08-25T14:30:00Z"`.

## 5. Dependencias y gestores de paquetes

Un framework es código que tú no escribiste y que tu programa necesita para
funcionar: una **dependencia**. Cada ecosistema tiene una herramienta que las
descarga y las coloca:

| Ecosistema | Declara las dependencias en | Las instala |
| --- | --- | --- |
| JavaScript · TypeScript | `package.json` | `pnpm install` |
| Python | `requirements.txt` | `pip install -r requirements.txt` |
| JVM | `pom.xml` | `mvn package` |
| .NET | `*.csproj` | `dotnet restore` |
| PHP | `composer.json` | `composer install` |
| Ruby | `Gemfile` | `bundle install` |
| Go | `go.mod` | `go mod download` |

Todas hacen lo mismo con nombres distintos. Y todas comparten dos ideas:

**El archivo de bloqueo.** Junto al que tú escribes aparece otro que la
herramienta genera —`pnpm-lock.yaml`, `Gemfile.lock`, `composer.lock`— con la
versión **exacta** de cada dependencia y de las dependencias de tus
dependencias. Es lo que hace que la instalación de hoy sea igual a la de dentro
de seis meses. Se versiona en git; no se edita a mano.

**El versionado semántico.** `2.5.13` no es un número arbitrario: cambiar el
primer dígito anuncia una ruptura, el segundo una función nueva compatible, y
el tercero una corrección [@semver]. Los rangos que se escriben en el
manifiesto —`^4.18.0`— dicen hasta dónde aceptas actualizaciones automáticas.
La clase 078 muestra qué pasa cuando esa comparación se hace mal.

## 6. Git

El repositorio se obtiene y se recorre con git. Lo imprescindible cabe en cinco
comandos [@chacon-straub-pro-git]:

```bash
git clone https://github.com/vladimiracunadev-create/framework-ecosystems-labs.git
git status                 # qué he cambiado
git diff                   # qué exactamente
git checkout -- <archivo>  # deshazlo, vuelve a como estaba
git log --oneline -10      # qué ha pasado aquí
```

El único de los cinco que importa de verdad mientras aprendes es el tercero:
**romper cosas es parte del método** —varios retos de transferencia piden
justamente eso— y saber volver atrás en un comando es lo que permite romperlas
sin miedo.

Y una idea de fondo que Hunt y Thomas defienden desde la primera edición de su
libro: el control de versiones no es una herramienta de equipo, es una
herramienta de **una sola persona** que quiere poder experimentar
[@hunt-thomas-pragmatic].

---

## Comprobación de recuerdo

Sin volver arriba:

1. ¿Qué diferencia hay entre un `401` y un `403`? ¿Y entre un `404` y un `410`?
2. Un servidor falla al arrancar con `EADDRINUSE`. ¿Qué ha pasado y cómo se
   comprueba?
3. ¿Por qué se versiona el archivo de bloqueo y no basta con `package.json`?
4. ¿Qué tipo de JSON es `"2026-08-25T14:30:00Z"`? ¿Cuántos tipos tiene JSON?
5. Tu terminal dice que `pnpm` no existe, pero lo acabas de instalar. ¿Cuál es
   la explicación más probable?

Si las cinco tienen respuesta, [la primera clase](../classes/parte-0-el-metodo/README.md)
no te va a dejar fuera en ninguna línea.

## Fuentes

- [@rfc9110] Fielding, R.; Nottingham, M.; Reschke, J. *HTTP Semantics*, RFC 9110, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
- [@rfc8259] Bray, T. (ed.). *The JavaScript Object Notation (JSON) Data Interchange Format*, RFC 8259, IETF, 2017 — <https://www.rfc-editor.org/rfc/rfc8259>
- [@iana-port-numbers] *Service Name and Transport Protocol Port Number Registry*. IANA — <https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml>
- [@grigorik-hpbn] Grigorik, Ilya. *High Performance Browser Networking*. O'Reilly, 2013. ISBN 9781449344764 — <https://openlibrary.org/isbn/9781449344764>
- [@semver] Preston-Werner, Tom. *Semantic Versioning 2.0.0* — <https://semver.org/>
- [@chacon-straub-pro-git] Chacon, Scott; Straub, Ben. *Pro Git*, 2.ª ed. Apress, 2014. ISBN 9781484200773 — <https://openlibrary.org/isbn/9781484200773>
- [@hunt-thomas-pragmatic] Hunt, Andrew; Thomas, David. *The Pragmatic Programmer*, 20.º aniversario. Addison-Wesley, 2019. ISBN 9780135957059 — <https://openlibrary.org/isbn/9780135957059>
