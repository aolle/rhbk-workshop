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
|CLIENT_ID|padel-user-backend|
|CLIENT_SECRET|0unvbdWCBWcFMQUyVukqA6TQuHHWjj9x|
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
> This data are the test values in local development. Ensure you production values with a right way. 

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