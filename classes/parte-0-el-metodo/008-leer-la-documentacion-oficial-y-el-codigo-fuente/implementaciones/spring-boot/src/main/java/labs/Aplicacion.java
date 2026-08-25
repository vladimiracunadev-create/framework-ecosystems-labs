package labs;

import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringBootVersion;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * CUATRO PREGUNTAS SOBRE SPRING BOOT, RESPONDIDAS ABRIENDO SPRING BOOT.
 *
 * Ninguna respuesta esta escrita a mano. Todas salen de lo que hay instalado: el
 * manifiesto de Maven, la version que el propio framework publica y el archivo
 * donde vive su codigo.
 *
 * Y la cuarta pregunta da aqui una respuesta distinta a la de Express y FastAPI,
 * que es el motivo de que Spring Boot este en el elenco de esta clase.
 */
@SpringBootApplication
@RestController
public class Aplicacion {

    private static final List<String> PREGUNTAS =
            List.of("version", "documentacion", "donde-vive", "codigo-fuente");

    /**
     * De donde sale el codigo de una clase, preguntandoselo a la maquina virtual.
     *
     * `getProtectionDomain().getCodeSource()` devuelve el archivo del que se
     * cargo la clase. No hay que suponer rutas ni buscar en el disco: la JVM
     * sabe exactamente de donde vino cada cosa que ha cargado.
     */
    private static String origenDe(Class<?> clase) {
        try {
            return clase.getProtectionDomain().getCodeSource().getLocation().toString();
        } catch (Exception fallo) {
            return "no lo declara";
        }
    }

    /** La version que este proyecto PIDIO, leida de su propio pom.xml. */
    private static String versionDeclarada() {
        try {
            String pom = Files.readString(Path.of("pom.xml"), StandardCharsets.UTF_8);
            int arranque = pom.indexOf("spring-boot-starter-parent");
            if (arranque < 0) {
                return "sin declarar";
            }
            int desde = pom.indexOf("<version>", arranque);
            int hasta = pom.indexOf("</version>", desde);
            return desde < 0 || hasta < 0 ? "sin declarar" : pom.substring(desde + 9, hasta).trim();
        } catch (Exception fallo) {
            return "sin declarar";
        }
    }

    private static Map<String, Object> version() {
        String declarada = versionDeclarada();
        String instalada = SpringBootVersion.getVersion();

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("respondida", true);
        salida.put("leida_del_paquete", true);
        salida.put("declarada_en_el_proyecto", declarada);
        salida.put("instalada", instalada);
        salida.put("satisface_lo_declarado", declarada.equals(instalada));
        // `SpringBootVersion` lo publica el propio framework leyendo el
        // manifiesto de su jar. Es la fuente mas fiable que existe: la escribe
        // quien construyo el artefacto, no quien lo usa.
        salida.put("de_donde_sale", "SpringBootVersion.getVersion(), del manifiesto del jar");
        salida.put("por_que_importa",
                "un rango no identifica lo que se ejecuta; en un informe de error solo vale la version exacta");
        return salida;
    }

    private static Map<String, Object> documentacion() {
        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("respondida", true);
        // AQUI EMPIEZA LA DIFERENCIA. Un paquete de Maven no lleva la direccion
        // de su documentacion: el POM tiene un campo `<url>`, pero el jar que se
        // descarga no lo publica de forma que se pueda consultar en ejecucion.
        salida.put("leida_del_paquete", false);
        salida.put("por_que_no",
                "el jar no publica una direccion consultable en ejecucion; en Node y en Python el manifiesto del paquete si la trae");
        salida.put("donde_esta", "https://docs.spring.io/spring-boot/index.html");
        salida.put("de_donde_sale_esa_direccion", "el catalogo del repositorio, no el paquete");
        salida.put("por_que_importa",
                "cuando el paquete no lo dice, alguien tiene que mantener esa direccion a mano — y eso caduca");
        return salida;
    }

    private static Map<String, Object> dondeVive() {
        String origen = origenDe(SpringApplication.class);
        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("respondida", true);
        salida.put("existe", !origen.equals("no lo declara"));
        salida.put("ruta", origen);
        salida.put("punto_de_entrada", "org.springframework.boot.SpringApplication");
        salida.put("por_que_importa",
                "el codigo que se ejecuta esta en tu disco: no hay que imaginarlo, pero aqui tampoco se puede leer");
        return salida;
    }

    /**
     * ¿PUEDES LEER SU CODIGO FUENTE SIN SALIR DE TU MAQUINA?
     *
     * En la JVM, NO. Lo que se descarga es bytecode: clases compiladas. Para
     * leer el original hay que pedir aparte el jar de fuentes —`-sources.jar`—
     * o ir al repositorio en la red.
     *
     * A cambio, la JVM ofrece algo que los otros dos no: la REFLEXION. No se
     * puede leer el cuerpo de un metodo, pero si su forma exacta, y sin
     * compilar nada ni abrir un archivo.
     */
    private static Map<String, Object> codigoFuente() {
        List<String> metodos = new ArrayList<>();
        for (Method metodo : Arrays.stream(RequestMapping.class.getDeclaredMethods())
                .sorted((a, b) -> a.getName().compareTo(b.getName()))
                .toList()) {
            metodos.add(metodo.getName() + ": " + metodo.getReturnType().getSimpleName());
        }

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("respondida", true);
        salida.put("hay_codigo_fuente_en_disco", false);
        salida.put("que_viaja_en_el_paquete", "bytecode compilado, no el codigo original");
        salida.put("como_conseguirlo",
                "mvn dependency:sources, o el repositorio en github.com/spring-projects/spring-boot");
        salida.put("lo_que_si_se_puede_leer_sin_salir", "la forma de cualquier clase, por reflexion");
        salida.put("ejemplo_clase", RequestMapping.class.getName());
        salida.put("ejemplo_atributos", metodos);
        salida.put("por_que_importa",
                "en Node y en Python el codigo esta a un `cat`; aqui hay un paso mas, y por eso se consulta menos");
        return salida;
    }

    @GetMapping("/preguntas")
    public Map<String, Object> preguntas() {
        return Map.of(
                "framework", "spring-boot",
                "total", PREGUNTAS.size(),
                "preguntas", PREGUNTAS,
                "todas_leidas_del_paquete", false);
    }

    @GetMapping("/pregunta/{cual}")
    public ResponseEntity<Map<String, Object>> pregunta(@PathVariable("cual") String cual) {
        Map<String, Object> respuesta = switch (cual) {
            case "version" -> version();
            case "documentacion" -> documentacion();
            case "donde-vive" -> dondeVive();
            case "codigo-fuente" -> codigoFuente();
            default -> null;
        };

        if (respuesta == null) {
            // Una pregunta que no esta no se contesta con una aproximacion. Es la
            // misma regla que la clase 006 aplica al coste de contratar.
            return ResponseEntity.status(404)
                    .body(Map.of("code", "PREGUNTA_DESCONOCIDA", "preguntas", PREGUNTAS));
        }

        Map<String, Object> salida = new LinkedHashMap<>();
        salida.put("pregunta", cual);
        salida.put("framework", "spring-boot");
        salida.putAll(respuesta);
        return ResponseEntity.ok(salida);
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
