package labs;

import java.util.List;
import java.util.Map;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
// Los repositorios de abajo son interfaces ANIDADAS, y la busqueda de Spring Data
// las ignora por omision: `considerNestedRepositories` es false.
@EnableJpaRepositories(considerNestedRepositories = true)
public class Aplicacion {

    @Entity
    @Table(name = "cuentas")
    public static class Cuenta {
        @Id
        public Long id;

        public int saldo;
    }

    public interface Cuentas extends JpaRepository<Cuenta, Long> {
    }

    /**
     * Los dos errores de una transferencia, y son distintos.
     *
     * `SALDO_INSUFICIENTE` se detecta ANTES de escribir nada. `NO_EXISTE` se
     * detecta DESPUES de haber cobrado, y ese es el que necesita la transaccion.
     *
     * Extiende `RuntimeException` a proposito: Spring solo deshace la
     * transaccion ante excepciones NO comprobadas. Con una excepcion comprobada
     * —una que herede de `Exception` sin heredar de `RuntimeException`— hace
     * COMMIT y la propaga. Es la trampa mas repetida de `@Transactional`.
     */
    public static class FalloDeNegocio extends RuntimeException {
        public final int estado;
        public final String codigo;

        public FalloDeNegocio(int estado, String codigo) {
            super(codigo);
            this.estado = estado;
            this.codigo = codigo;
        }
    }

    @Service
    public static class Banco {

        private final Cuentas cuentas;

        public Banco(Cuentas cuentas) {
            this.cuentas = cuentas;
        }

        public void sembrar() {
            cuentas.deleteAll();
            for (long id : new long[] { 1L, 2L }) {
                Cuenta cuenta = new Cuenta();
                cuenta.id = id;
                cuenta.saldo = 100;
                cuentas.save(cuenta);
            }
        }

        public Map<String, Object> estado() {
            List<Integer> saldos = cuentas.findAll().stream()
                    .sorted((a, b) -> Long.compare(a.id, b.id))
                    .map(c -> c.saldo).toList();
            return Map.of("cuentas", saldos, "total", saldos.stream().mapToInt(Integer::intValue).sum());
        }

        private void mover(Map<String, Object> cuerpo) {
            long de = numero(cuerpo.get("de"));
            long a = numero(cuerpo.get("a"));
            int monto = (int) numero(cuerpo.get("monto"));

            Cuenta origen = cuentas.findById(de).orElseThrow(() -> new FalloDeNegocio(404, "NO_EXISTE"));
            if (origen.saldo < monto) {
                throw new FalloDeNegocio(409, "SALDO_INSUFICIENTE");
            }

            // El cobro va PRIMERO, a proposito.
            origen.saldo -= monto;
            cuentas.saveAndFlush(origen);

            Cuenta destino = cuentas.findById(a).orElseThrow(() -> new FalloDeNegocio(404, "NO_EXISTE"));
            destino.saldo += monto;
            cuentas.saveAndFlush(destino);
        }

        /** CON transaccion: la excepcion sale del metodo y Spring deshace todo. */
        @Transactional
        public void transferir(Map<String, Object> cuerpo) {
            mover(cuerpo);
        }

        /**
         * SIN transaccion: cada `saveAndFlush` se confirma por su cuenta porque
         * `NEVER` prohibe que exista una transaccion envolvente. Mismo codigo,
         * mismo error, y diez unidades evaporadas.
         */
        @Transactional(propagation = Propagation.NEVER)
        public void transferirSinTransaccion(Map<String, Object> cuerpo) {
            mover(cuerpo);
        }

        private static long numero(Object valor) {
            return valor instanceof Number n ? n.longValue() : -1L;
        }
    }

    @Bean
    public CommandLineRunner semilla(Banco banco) {
        return args -> banco.sembrar();
    }

    @RestController
    public static class Controlador {

        private final Banco banco;

        public Controlador(Banco banco) {
            this.banco = banco;
        }

        @GetMapping("/reiniciar")
        public Map<String, Object> reiniciar() {
            banco.sembrar();
            return banco.estado();
        }

        @GetMapping("/cuentas")
        public Map<String, Object> cuentas() {
            return banco.estado();
        }

        @PostMapping("/transferir")
        public ResponseEntity<Map<String, Object>> transferir(
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            return ejecutar(() -> banco.transferir(cuerpo == null ? Map.of() : cuerpo));
        }

        @PostMapping("/transferir-sin-transaccion")
        public ResponseEntity<Map<String, Object>> sinTransaccion(
                @RequestBody(required = false) Map<String, Object> cuerpo) {
            return ejecutar(() -> banco.transferirSinTransaccion(cuerpo == null ? Map.of() : cuerpo));
        }

        private static ResponseEntity<Map<String, Object>> ejecutar(Runnable operacion) {
            try {
                operacion.run();
            } catch (FalloDeNegocio fallo) {
                return ResponseEntity.status(fallo.estado).body(Map.of("code", fallo.codigo));
            }
            return ResponseEntity.ok(Map.of("ok", true));
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
