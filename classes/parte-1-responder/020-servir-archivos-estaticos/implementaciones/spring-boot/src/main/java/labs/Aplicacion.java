package labs;

import java.time.Duration;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class Aplicacion {

    @Configuration
    public static class Estaticos implements WebMvcConfigurer {
        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registro) {
            registro.addResourceHandler("/estatico/**")
                    .addResourceLocations("classpath:/publico/")
                    .setCacheControl(CacheControl.maxAge(Duration.ofHours(1)).cachePublic());
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(Aplicacion.class, args);
    }
}
