# ms-users

## Architecture

* Quarkus + Java 17
* MariaDB

## Model
```json
{
  "id": 123123,
  "username": "dborrego",
  "name": "David",
  "year-of-birth": 1988,
  "level": 3.12
}
```

## Lifecycle

### Local development

The application needs a ```MariaDB``` database running to run correctly. So, we'll start a container with MariaDB using ```podman```.

```bash
podman run \
    -d  \
    --name rhbk-ms-users  \
    --env POSTGRES_USER=user1234 \
    --env POSTGRES_PASSWORD=user1234 \
    --env POSTGRES_DB=users \
    -p 5432:5432 \
    postgres:16
```

Now, we can start the application with the ```Maven``` command:

```bash
mvn quarkus:dev
```

### Production build

We will compile a native image, using ```Maven```:

```bash
mvn package \
    -Pnative \
    -Dquarkus.native.container-build=true
```

## Test the application

### What you need

The application uses an OpenID - JWT workflow to secure the application. In this case, we'll need the following data:

|Variable|Value|Description|
|---|---|---|
|KCHOST|http://localhost:8080|Keycloack url|
|REALM|jwt-demo|KeyCloak realm|
|CLIENT_ID|padel-user-backend|Client id|
|CLIENT_SECRET|0unvbdWCBWcFMQUyVukqA6TQuHHWjj9x|Client secret|
|UNAME|dborrego|User who gets the data|
|PASSWORD|dborrego|User password|

```bash
KCHOST=http://localhost:8080                               
REALM=jwt-demo                                   
CLIENT_ID=padel-user-backend
CLIENT_SECRET=0unvbdWCBWcFMQUyVukqA6TQuHHWjj9x
UNAME=dborrego                                                 
PASSWORD=dborrego
```

> [!WARNING]  
> This data are the test values in local development. Ensure your production values with a right way. 

### Get a token

To call the application you need a valid token, which is going to be checked against Keycloak. 

```bash
ACCESS_TOKEN=`curl \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET" \
  -d "username=$UNAME" \
  -d "password=$PASSWORD" \
  -d "grant_type=password" \
  "$KCHOST/realms/$REALM/protocol/openid-connect/token"  | jq -r '.access_token'`
```

Now, we can see the access token in a JWT format with ```echo $ACCESS_TOKEN``` but it's in base64 so the best way is to decode it:

```json
...
  "realm_access": {
    "roles": [
      "padel-users-admin",
      "default-roles-jwt-demo",
      "offline_access",
      "uma_authorization",
    ]
  },
...
```

Now we can to the different operations: 

### Create an element

```bash
curl \
  -X POST \
  -H 'Authorization: Bearer '$ACCESS_TOKEN \
  -H 'Content-Type: application/json' \
  --data '{"name":"David", "year": 1988, "level": 3.12, "username":"dborrego"}' \
  localhost:8081/users
{"id":1,"username":"dborrego","name":"David","year":1988,"level":3.12}
```

### List all elements

```bash
curl \
  -H 'Authorization: Bearer '$ACCESS_TOKEN \
  localhost:8081/users 
[{"id":1,"username":"dborrego","name":"David","year":1988,"level":3.12}]
```

### List my user

To list the user, it must coincide with the username and the user of the JWT token, if not anybody can get the data on any user.

```bash
curl \
  -H 'Authorization: Bearer '$ACCESS_TOKEN \
  localhost:8081/users/1
{"id":1,"username":"dborrego","name":"David","year":1988,"level":3.12}
```

### Delete a user

```bash
curl -v \
  -X DELETE \
  -H 'Authorization: Bearer '$ACCESS_TOKEN \
  localhost:8081/users/1
> 
< HTTP/1.1 204 No Content
< 
```

## Security

We can find three different security checks:
* OpenID: The application integrates the OpenID flow with KeyCloak

```properties
quarkus.oidc.auth-server-url=http://localhost:8080/realms/jwt-demo
quarkus.oidc.client-id=padel-user-backend
quarkus.oidc.credentials.secret=0unvbdWCBWcFMQUyVukqA6TQuHHWjj9x
```

* Role: the user needs a specific role to get the information from the rest endpoint
```java
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
```

* Username: in some cases, the user only can get his information

```java
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
```