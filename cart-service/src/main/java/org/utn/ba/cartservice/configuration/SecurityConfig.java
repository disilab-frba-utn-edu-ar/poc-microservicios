package org.utn.ba.cartservice.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    JwtAuthenticationConverter jwtAuthConverter = new JwtAuthenticationConverter();
    jwtAuthConverter.setJwtGrantedAuthoritiesConverter(new PermissionsAndScopeAuthoritiesConverter());
    http
        .cors(AbstractHttpConfigurer::disable)
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/actuator/**").permitAll()
            .requestMatchers("/carts/**").hasAuthority("SCOPE_customer")
            .anyRequest().authenticated()
        )
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter)));

    return http.build();
  }

}
