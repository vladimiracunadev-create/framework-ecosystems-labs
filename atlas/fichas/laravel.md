# 🔴 Laravel — 2011

> [⬅️ Atlas](../README.md) · [🐘 Ecosistema PHP](../ecosistemas/php.md) · [🗂️ Índice](../frameworks.md)

Laravel es **el framework más usado del lenguaje que más web mueve**, y el que
mejor demuestra que la experiencia de quien programa puede ser una ventaja
competitiva decisiva. También es el mejor ejemplo del catálogo de un ecosistema
comercial construido alrededor de un proyecto de código abierto — con lo que eso
implica para el análisis del [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md).

> **🎯 Por qué está en este programa**
>
> **Es el mejor representante vivo de «convención sobre configuración»**
> ([módulo 02](../../curriculum/02-arquitectura-de-frameworks.md)). Rails inventó
> el modelo pero su cuota es hoy modesta; Laravel lo lleva a un ecosistema con
> presencia enorme, así que es donde el compromiso —velocidad inicial a cambio de
> comportamiento implícito— se puede observar a escala.
>
> **Su ORM hace visible el problema de la consulta N+1** como pocos
> ([módulo 06](../../curriculum/06-persistencia-y-dominio.md)): Eloquent es tan
> cómodo que la consulta accidental por cada elemento de una lista aparece sin
> que nadie la escriba.
>
> **Y su modelo de negocio plantea la pregunta de la estrategia de salida** de
> una forma que los frameworks de fundación no plantean.

| | |
|---|---|
| **Aparición** | 2011, creado por Taylor Otwell |
| **Clasificación** | `full-stack-framework` |
| **Ecosistema** | PHP |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo, con versiones mayores anuales |
| **Documentación** | <https://laravel.com/docs> |

---

## 📜 El problema que existía

En 2011, PHP tenía frameworks buenos y una reputación mala. **Symfony** era
potente y verboso; **Zend Framework** era el estándar corporativo y aún más
verboso; **CodeIgniter** era ligero pero se había quedado atrás. Ninguno ofrecía
lo que Rails llevaba siete años ofreciendo: **que empezar un proyecto fuera
agradable**.

Laravel no inventó ningún concepto nuevo. Tomó las ideas de Rails, se apoyó en la
infraestructura de Symfony —de la que usa componentes hasta hoy— y puso todo el
esfuerzo en la superficie: nombres, mensajes de error, generadores, documentación.

## 💡 Lo que trae en la caja

Esta lista **es** el argumento del framework. Cada elemento es algo que en un
ecosistema minimalista habría que elegir, integrar y mantener:

| Capacidad | Qué evita |
| --- | --- |
| **Eloquent** (ORM de registro activo) | Elegir e integrar un mapeador |
| **Migraciones** versionadas | Coordinar cambios de esquema a mano |
| **Colas** con varios motores | Montar el procesamiento en segundo plano |
| **Tareas programadas** declarativas | Mantener entradas de cron por servidor |
| **Autenticación y autorización** | Escribir identidad propia, que el [módulo 07](../../curriculum/07-identidad-y-seguridad.md) desaconseja explícitamente |
| **Validación** con reglas nombradas | Construir el sistema de errores por campo |
| **Blade** (plantillas) | Elegir motor de plantillas |
| **Pruebas** integradas desde el inicio | Configurar el arnés de pruebas |
| **Contenedor de dependencias** | Cablear las colaboraciones a mano |

Y alrededor, un ecosistema **comercial**: despliegue, administración, monitorización
y desarrollo local, de la misma empresa. Ese es el punto que merece atención.

## ⚖️ El compromiso, en concreto

### Lo que se gana

Velocidad inicial difícil de igualar. Un producto con autenticación, panel,
colas y pruebas puede estar en marcha en un día. Para un equipo pequeño con un
plazo corto, eso no es un detalle: es la diferencia entre existir y no existir.

### Lo que se paga

**1. Comportamiento implícito.** Las fachadas estáticas —`Cache::get()`,
`DB::table()`— resuelven contra el contenedor por debajo. Es cómodo hasta que hay
que diagnosticar qué instancia se resolvió, con qué alcance y por qué. Es
exactamente el aviso del [módulo 02](../../curriculum/02-arquitectura-de-frameworks.md):
**cuanto más implícito, mejor debe ser el diagnóstico**.

**2. El dominio tiende a acabar dentro del framework.** El modelo de Eloquent es
a la vez fila de la tabla, objeto de dominio y a menudo objeto de respuesta. Los
tres modelos que el [módulo 06](../../curriculum/06-persistencia-y-dominio.md)
insiste en separar colapsan en uno solo, y funciona — hasta que el dominio crece.
El síntoma es reconocible: campos internos de la base filtrándose en la API.

**3. La consulta N+1 es casi gratis de escribir.**

```php
// Una consulta para los usuarios, y una MÁS por cada usuario al pintar.
// No hay ningún indicio en el código de que esto ocurra.
foreach (Usuario::all() as $usuario) {
    echo $usuario->perfil->nombre;
}
```

No se ve en desarrollo con diez filas. Se detecta **contando consultas por caso
de uso en una prueba**, que es el diagnóstico que enseña el módulo 06.

**4. La cadencia anual de versiones mayores.** Mantenerse al día es trabajo
continuo; quedarse atrás acumula una migración grande. Es una decisión que hay
que puntuar en la matriz, no descubrir después.

## 🏢 El ecosistema comercial y la estrategia de salida

Laravel es `MIT` y su código es abierto. Pero su experiencia completa —despliegue,
administración, monitorización— pasa por productos de pago de la misma empresa.
Eso **no es malo**: financia el desarrollo del núcleo y explica por qué la
documentación y las herramientas están al nivel que están.

Sí es una **dimensión que hay que puntuar explícitamente**:

| Pregunta del módulo 11 | En el caso de Laravel |
| --- | --- |
| ¿Qué parte quedaría inservible si hubiera que sustituirlo? | El dominio, si vive dentro de los modelos de Eloquent. Poco, si está separado |
| ¿Quién decide la dirección? | Una empresa con un fundador identificable, no un comité |
| ¿Qué pasa si cambian los términos de las herramientas comerciales? | El núcleo sigue siendo MIT; el flujo de trabajo, no necesariamente |
| ¿Cuál es el coste de la actualización mayor? | Anual, documentado, con herramienta de asistencia |

La defensa es la misma de siempre y está en el
[módulo 02](../../curriculum/02-arquitectura-de-frameworks.md): dominio
independiente, adaptadores en el borde, y una **función de aptitud** que falle si
el dominio empieza a importar el framework.

## 🔄 Lo que se ha modernizado

- **Tipado más estricto** siguiendo la evolución de PHP.
- **Instalador y entorno local** propios, que redujeron mucho la fricción inicial.
- **Colas, eventos y difusión** en tiempo real integrados.
- **Herramienta de asistencia a la actualización** entre versiones mayores.
- Adopción de los **estándares PSR** que permiten intercambiar piezas con otros
  frameworks PHP.

## 🎓 Las tres lecciones

**1. La experiencia de desarrollo es una ventaja competitiva real.** Laravel no
ganó por ser técnicamente superior a Symfony: ganó por ser más agradable. Eso es
un criterio legítimo y debe entrar en la matriz de decisión con su peso — no
colarse disfrazado de argumento técnico.

**2. Todo lo que viene en la caja es una decisión que no tomaste.** Nueve
capacidades incluidas son nueve integraciones que te ahorras y nueve decisiones
que alguien tomó por ti. El módulo 11 pregunta si esas nueve encajan en tu
producto, no si son buenas en abstracto.

**3. La comodidad tiene una factura y llega tarde.** El N+1, el dominio dentro
del ORM y el acoplamiento a las fachadas no duelen el primer mes. Duelen en el
segundo año, que es cuando el coste de corregirlos es máximo.

## 🔗 Enlaces

- Documentación oficial: <https://laravel.com/docs>
- [Ecosistema PHP](../ecosistemas/php.md) — dónde encaja y de quién hereda
- [Módulo 06](../../curriculum/06-persistencia-y-dominio.md) — registro activo frente a mapeador de datos
