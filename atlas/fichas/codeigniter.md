# 🔥 CodeIgniter — 2006

> [⬅️ Atlas](../README.md) · [🐘 Ecosistema PHP](../ecosistemas/php.md) · [🗂️ Índice](../frameworks.md)

CodeIgniter fue **la puerta de entrada al patrón modelo-vista-controlador para
una generación entera de programadores PHP**, y lo consiguió por una razón muy
poco glamurosa: era el único que funcionaba en los alojamientos compartidos
baratos de la época.

| | |
|---|---|
| **Aparición** | 2006, creado por EllisLab |
| **Clasificación** | `web-framework` |
| **Ecosistema** | PHP |
| **Licencia** | `MIT` |
| **Estado** | 🟢 Activo |
| **Documentación** | <https://codeigniter.com/user_guide/> |

---

## 💡 Por qué ganó: la restricción del entorno

En 2006, el PHP del mundo real vivía en alojamientos compartidos: sin acceso a la
línea de comandos, sin poder instalar extensiones, sin configurar el servidor.
Symfony y Zend Framework asumían un entorno que mucha gente no tenía.

CodeIgniter era **una carpeta que se subía por FTP y funcionaba**. Sin
dependencias, sin instalación, sin configuración del servidor.

Es una lección del [módulo 11](../../curriculum/11-seleccion-y-sostenibilidad.md)
que casi nunca aparece en las comparativas: **las restricciones de despliegue
deciden adopciones**. Un framework técnicamente superior que no se puede instalar
donde está tu gente no gana.

## ⚖️ Lo que le costó después

Esa misma virtud fue su límite. Al no depender de un gestor de paquetes ni de
estándares comunes, CodeIgniter quedó fuera del ecosistema que se formó alrededor
de Composer y de los estándares PSR [@php-fig-psr]. Sus componentes no se podían
mezclar con los de otros frameworks, y los de otros no entraban fácilmente.

Cuando el lenguaje se modernizó —espacios de nombres, gestor de dependencias,
interoperabilidad— [Laravel](laravel.md) ocupó el espacio de «framework agradable
para PHP» con acceso completo a ese ecosistema [@lockhart-modern-php].

## 🎓 Las dos lecciones

**1. Las restricciones de despliegue deciden adopciones.** La matriz del módulo
11 tiene que incluir «dónde se va a ejecutar esto y quién lo instala».

**2. Independencia y aislamiento son la misma cosa vista desde dos lados.** No
depender de nadie es una ventaja hasta que el ecosistema se organiza y quedas
fuera.

## 🔗 Enlaces

- Documentación oficial: <https://codeigniter.com/user_guide/>
- [Ficha de Laravel](laravel.md) — su heredero · [Ficha de Symfony](symfony.md)
- [Ecosistema PHP](../ecosistemas/php.md)

## Fuentes

- [@lockhart-modern-php] Lockhart, Josh. *Modern PHP*. O'Reilly Media, 2015. ISBN 9781491905180 — <https://openlibrary.org/isbn/9781491905180>
- [@php-fig-psr] *PSR — PHP Standards Recommendations*, PHP-FIG — <https://www.php-fig.org/psr/>
