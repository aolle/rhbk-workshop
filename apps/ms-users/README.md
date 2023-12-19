# ms-users

## Architecture

* Quarkus + Java 17
* MariaDB

## Model
```json
{
  "id": 123123,
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