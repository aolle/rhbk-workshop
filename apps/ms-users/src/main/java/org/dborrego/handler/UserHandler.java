package org.dborrego.handler;

import java.util.List;

import org.dborrego.model.User;

import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.logging.Log;
import io.quarkus.security.identity.SecurityIdentity;
import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

@Path("/users")
public class UserHandler {

  @Inject
  SecurityIdentity securityIdentity;

  @POST
  @RolesAllowed({ "padel-users-admin" })
  public Uni<User> create(User user) {
    return Panache.withTransaction(user::persist);
  }

  @GET
  @RolesAllowed({ "padel-users-admin" })
  public Uni<List<User>> listAll() {
    return User.listAll();
  }

  @GET
  @Path("/{id}")
  @RolesAllowed({ "padel-users-admin", "padel-users-player" })
  public Uni<User> ListById(Long id) {
    final String username = securityIdentity.getPrincipal().getName();
    Log.info(String.format("User %s find user with id %d", username, id));
    return User.<User>findById(id)
        .onItem()
        .ifNotNull()
        .transform(user -> {
          if (!username.equals(user.username)) {
            throw new WebApplicationException("El nombre del usuario no coincide", Response.Status.FORBIDDEN);
          }
          return user;
        });
  }

  @DELETE
  @Path("/{id}")
  @RolesAllowed({ "padel-users-admin" })
  public Uni<Response> deleteById(Long id) {
    return User.deleteById(id)
        .onItem()
        .transform(deleted -> deleted
            ? Response.ok().status(Response.Status.NO_CONTENT).build()
            : Response.ok().status(Response.Status.NOT_FOUND).build());
  }

}
