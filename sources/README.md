# Política de fuentes

**Regla del repositorio:** ninguna afirmación del programa procede de una fuente
difusa. Todo lo que se enseña se apoya en un libro, un artículo con revisión, una
norma o la documentación oficial de quien mantiene la tecnología. Esa regla no es
una intención: es una comprobación automática que puede dejar el repositorio en
rojo.

## Qué se acepta como fuente

| Tipo | Localizador obligatorio | Se verifica contra |
| --- | --- | --- |
| `book` | ISBN-13, con dígito de control válido | `https://openlibrary.org/isbn/{isbn13}.json` |
| `paper` | DOI | `https://api.crossref.org/works/{doi}` |
| `standard` | URL https del organismo (IETF, W3C, WHATWG, NIST, OWASP…) | petición HTTP a la URL |
| `reference` | URL https de la documentación oficial o del autor | petición HTTP a la URL |

Lo que **no** se acepta: capturas sin origen, resúmenes de terceros presentados
como fuente, contenido generado sin verificar, foros, y respuestas de asistentes
—incluido el que ayudó a escribir esto— sin comprobación contra la fuente
primaria.

## Cómo se cita

Cita en línea con `[@identificador]`, y una sección `## Fuentes` al final del
documento con la referencia completa y su localizador.

```markdown
El transporte cambia; la semántica del método no [@rfc9110].

## Fuentes

- [@rfc9110] RFC 9110 — HTTP Semantics, IETF, 2022 — <https://www.rfc-editor.org/rfc/rfc9110>
```

Además, cada lección declara sus fuentes en el front matter:

```yaml
---
modulo: "01"
fuentes: [rfc9110, rfc9111, grigorik-hpbn, openapi-spec]
---
```

## Qué comprueba la validación

`node scripts/verify-sources.mjs` falla si:

- una cita `[@id]` no existe en `bibliography.json`;
- una fuente declarada en el front matter nunca se cita en la **exposición** —la
  sección `## Fuentes` no cuenta, para que listar una obra no equivalga a
  respaldarse en ella;
- una fuente citada no está declarada;
- una lección cita menos de cuatro fuentes;
- una entrada carece de localizador `https`;
- un libro carece de ISBN-13 o su dígito de control es inválido;
- un artículo carece de DOI, o su localizador no es ese DOI resoluble;
- alguna entrada de la bibliografía **nunca** se cita en el repositorio;
- una lección omite cualquiera de las doce secciones obligatorias.

Esta comprobación **no usa la red**: es determinista y reproducible en cualquier
máquina.

## Revisión contra los catálogos

`node scripts/refresh-sources.mjs` sí consulta la red y compara cada entrada con
su catálogo de origen, informando de la deriva. No modifica nada y no forma parte
de la validación obligatoria, porque un fallo de red no es un fallo del
repositorio.

```bash
node scripts/refresh-sources.mjs              # todas las entradas
node scripts/refresh-sources.mjs --type=book  # solo libros
node scripts/refresh-sources.mjs --print      # además imprime las citas completas
```

Un `403` al comprobar un enlace suele significar que la editorial bloquea
clientes automatizados, no que la fuente haya desaparecido; el informe lo separa
de los errores reales.

## Añadir una fuente

1. Localiza la fuente **primaria**. Si solo encuentras a alguien citándola, aún
   no la tienes.
2. Obtén su localizador: ISBN-13 de la edición concreta, DOI, o URL oficial.
3. Verifícalo antes de escribirlo:

   ```bash
   curl -s https://openlibrary.org/isbn/9780134757599.json | head -c 400
   curl -s https://api.crossref.org/works/10.1007/BF02505024 | head -c 400
   ```

4. Añade la entrada a `bibliography.json` con los datos **que devuelve el
   catálogo**, no los que recuerdas.
5. Cítala en algún documento: una entrada que nadie cita hace fallar la
   validación a propósito.
6. Ejecuta `node scripts/verify-sources.mjs` y `node scripts/refresh-sources.mjs`.

## Sobre el respeto a los derechos de autor

El repositorio **no redistribuye** libros ni artículos protegidos. Cita, remite y
explica; para acceder a las obras están las bibliotecas, las editoriales y los
repositorios de acceso abierto. Las normas del IETF, W3C, WHATWG, NIST y OWASP
son de acceso libre y se enlazan directamente.

## Estado actual

Consulta [`../docs/BIBLIOGRAPHY.md`](../docs/BIBLIOGRAPHY.md) para el listado
completo, generado desde el registro con
`node scripts/generate-bibliography.mjs`.
