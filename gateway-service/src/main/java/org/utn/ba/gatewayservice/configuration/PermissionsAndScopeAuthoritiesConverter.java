package org.utn.ba.gatewayservice.configuration;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import java.util.ArrayList;
import java.util.Collection;

public class PermissionsAndScopeAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

  private final JwtGrantedAuthoritiesConverter scopeConverter = new JwtGrantedAuthoritiesConverter();

  private static final String permissionPrefix = "SCOPE_";

  @Override
  public Collection<GrantedAuthority> convert(Jwt jwt) {
    Collection<GrantedAuthority> authorities = new ArrayList<>(scopeConverter.convert(jwt));

    Object permissionsClaim = jwt.getClaim("permissions");
    if (permissionsClaim instanceof Iterable) {
      for (Object p : (Iterable<?>) permissionsClaim) {
        if (p != null) {
          String perm = p.toString().trim();
          if (!perm.isEmpty()) {
            authorities.add(new SimpleGrantedAuthority(permissionPrefix + perm));
          }
        }
      }
    } else if (permissionsClaim instanceof String) {
      String[] parts = ((String) permissionsClaim).split("[,\\s]+");
      for (String part : parts) {
        if (!part.isBlank()) {
          authorities.add(new SimpleGrantedAuthority(permissionPrefix + part.trim()));
        }
      }
    }

    return authorities;
  }
}