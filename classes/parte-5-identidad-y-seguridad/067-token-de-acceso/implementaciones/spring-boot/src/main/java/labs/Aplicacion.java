package labs;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class Aplicacion {

    // En produccion, del entorno (clase 075). jjwt ademas exige que la clave
    // de HS256 tenga al menos 256 bits: una clave corta ni siquiera compila
    // el arranque — el framework convierte una mala practica en un error.
    private static final SecretKey CLAVE = Keys.hmacShaKeyFor(
            "clave-de-firma-solo-para-el-laboratorio".getBytes(StandardCharsets.UTF_8));
    private static final Map<String, String> USUARIOS = Map.of("ana", "secreta123");

    @PostMapping("/token")
    public ResponseEntity<Map<String, Object>> emitir(
            @RequestBody(required = false) Map<String, String> credenciales) {
        String usuario = credenciales == null ? "" : credenciales.getOrDefault("usuario", "");
        String clave = credenciales == null ? "" : credenciales.getOrDefault("clave", "");
        if (!clave.equals(USUARIOS.get(usuario))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "credenciales-invalidas"));
        }
        String token = Jwts.builder()
                .subject(usuario)
                .expiration(new Date(System.currentTimeMillis() + 3_600_000))
                .signWith(CLAVE, Jwts.SIG.HS256)
                .compact();
        return ResponseEntity.ok(Map.of("token", token, "tipo", "Bearer", "expira_en", 3600));
    }

    @GetMapping("/informe")
    public ResponseEntity<Map<String, String>> informe(
            @RequestHeader(name = "Authorization", required = false) String cabecera) {
        String token = cabecera != null && cabecera.startsWith("Bearer ")
                ? cabecera.substring("Bearer ".length())
                : "";
        try {
            // `parseSignedClaims` solo acepta tokens FIRMADOS con la clave
            // dada: un `alg: none` no es un caso especial que recordar, es un
            // token no firmado y se rechaza por tipo. Caducidad incluida.
            Claims datos = Jwts.parser().verifyWith(CLAVE).build()
                    .parseSignedClaims(token).getPayload();
            return ResponseEntity.ok(Map.of("usuario", datos.getSubject()));
        } catch (JwtException | IllegalArgumentException e) {
            // Alterado, caducado, de otra clave o ausente: un solo 401. El
            // matiz es para el registro del servidor, no para el atacante.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "token-invalido"));
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
