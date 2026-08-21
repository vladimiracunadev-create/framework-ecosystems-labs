package labs;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

// Un servidor de autorizacion MINIMO: codigo de autorizacion + PKCE. En
// produccion no se escribe uno —el ecosistema tiene spring-authorization-
// server, o se despliega Keycloak—; este existe para que cada defensa del
// protocolo sea medible paso a paso.
@SpringBootApplication
@RestController
public class Aplicacion {

    private static final SecretKey CLAVE = Keys.hmacShaKeyFor(
            "clave-de-firma-solo-para-el-laboratorio".getBytes(StandardCharsets.UTF_8));

    // La redirect_uri se registra POR ADELANTADO: la peticion debe traer
    // exactamente la registrada, o un atacante pediria el codigo a su servidor.
    private static final Map<String, String> CLIENTES =
            Map.of("cliente-demo", "https://app.example/callback");

    private record Emision(String reto, String redireccion, String cliente, boolean usado) {}

    // Codigo → lo que hara falta al canjearlo. Un solo uso; en produccion,
    // ademas, caduca en minutos.
    private final Map<String, Emision> codigos = new ConcurrentHashMap<>();
    private final SecureRandom aleatorio = new SecureRandom();

    private String tokenAleatorio() {
        byte[] bytes = new byte[24];
        aleatorio.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String resumenS256(String verificador) {
        try {
            byte[] digesto = MessageDigest.getInstance("SHA-256")
                    .digest(verificador.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digesto);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    @GetMapping("/autorizar")
    public ResponseEntity<?> autorizar(@RequestParam Map<String, String> q) {
        String registrada = CLIENTES.get(q.getOrDefault("client_id", ""));

        // Cliente desconocido o redirect_uri no registrada: error DIRECTO,
        // sin redirigir — redirigir a una URI no verificada seria un open
        // redirect.
        if (registrada == null || !registrada.equals(q.get("redirect_uri"))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "invalid_request"));
        }

        // Aqui iria login y consentimiento; el laboratorio los salta con un
        // usuario fijo porque lo que mide es la mecanica del codigo y PKCE.
        String estado = q.get("state");
        MultiValueMap<String, String> consulta = new LinkedMultiValueMap<>();

        // Sin PKCE no hay codigo. La redirect_uri SI esta verificada, asi
        // que el error viaja de vuelta al cliente con el state intacto.
        if (!"code".equals(q.get("response_type"))
                || q.getOrDefault("code_challenge", "").isEmpty()
                || !"S256".equals(q.get("code_challenge_method"))) {
            consulta.add("error", "invalid_request");
            if (estado != null) consulta.add("state", estado);
        } else {
            String codigo = tokenAleatorio();
            codigos.put(codigo, new Emision(
                    q.get("code_challenge"), q.get("redirect_uri"), q.get("client_id"), false));
            consulta.add("code", codigo);
            // El state vuelve TAL CUAL: es el testigo anti-CSRF del cliente.
            if (estado != null) consulta.add("state", estado);
        }

        String destino = UriComponentsBuilder.fromUriString(registrada)
                .queryParams(consulta).build().toUriString();
        return ResponseEntity.status(HttpStatus.FOUND).header("Location", destino).build();
    }

    @PostMapping("/token")
    public ResponseEntity<Map<String, Object>> token(@RequestParam Map<String, String> f) {
        Emision entrada = codigos.get(f.getOrDefault("code", ""));

        boolean invalido = !"authorization_code".equals(f.get("grant_type"))
                || entrada == null
                || entrada.usado()
                || !entrada.cliente().equals(f.get("client_id"))
                || !entrada.redireccion().equals(f.get("redirect_uri"));

        // PKCE: el resumen del verificador de ahora tiene que casar con el
        // reto del principio. Solo quien inicio el flujo tiene el verificador.
        String resumen = resumenS256(f.getOrDefault("code_verifier", ""));

        if (invalido || !resumen.equals(entrada.reto())) {
            if (entrada != null) {
                codigos.put(f.get("code"), new Emision(
                        entrada.reto(), entrada.redireccion(), entrada.cliente(), true));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "invalid_grant"));
        }

        codigos.put(f.get("code"), new Emision(
                entrada.reto(), entrada.redireccion(), entrada.cliente(), true));

        String idToken = Jwts.builder()
                .issuer("http://laboratorio.local")
                .subject("ana")
                .audience().add(f.get("client_id")).and()
                .expiration(new Date(System.currentTimeMillis() + 3_600_000))
                .signWith(CLAVE, Jwts.SIG.HS256)
                .compact();

        return ResponseEntity.ok(Map.of(
                "access_token", tokenAleatorio(),
                "token_type", "Bearer",
                "expires_in", 3600,
                "id_token", idToken));
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
