```
npx prisma migrate dev --name init
npx prisma db pull

```

# DOCUMENTACIÓN

El servidor corre en el puerto 5000 localmente.
Nuestra URL de desarrollo es: http://localhost:5000

# AUTENTICACIÓN
## Registro de usuarios
El endpoint para realizar el registro de usuarios:
http://localhost:5000/api/auth/register
El token es generado con base en el identificador del usuario y el correo.
## REQUEST
Enviar la siguiente información para poder registrar a un usuario correctamente. 
En role existen dos opciones ['USER_ROLE', 'ENTERPRISE_ROLE'].
Todos los campos son validados en el backend.
```
{
    "email":"correo@gmail.com",
    "password":"Serge+1202",
    "role":"USER_ROLE"
}

```

### RESPONSE
* Una vez realizado el registro correctamente ya no es necesario realizar el login, pues automáticamente se genera
un token de acceso con una duración de 2 horas para poder acceder a la aplicación.  El token generado después de realizar el registro o el inicio de sesión es validado en el backend para cada una de las operaciones que se llevarán acabo en la aplicación.

* Después de realizar el registro se le enviará al usuario por medio de un correo electrónico un link para validar su correo electrónico. ANTES DE CREAR PERFILES DEBERÍA DE HABER VALIDADO EL CORREO ELECTRÓNICO. De no ser así agreguen algun boton para reenviar el correo electrónico con el link de verificación de email.

```
  {
    "account": {
        "id": 4,
        "email": "serge15games@gmail.com",
        "role": "USER_ROLE",
        "email_validated": false,
        "createdAt": "2025-01-02T00:12:35.275Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjo0LCJpYXQiOjE3MzU3NzY3NT"
  }
```
### RESPONSE ERRORES
El endpoint devolverá error si alguno de los campos de registro está mal, por ejemplo si el correo no es valido 
o que la contraseña no cumpla con los requerimientos nece3sarios.

## INICIO DE SESIÓN DE LOS USUARIOS
El endpoint para realizar el inicio de sesión de los usuarios: http://localhost:5000/api/auth/login

## REQUEST 
Enviar la siguiente información para poder iniciar sesión.

{
    "email":"serge15games@gmail.com",
    "password":"Serge+1202"
}

## RESPONSE
En la respuesta obtenemos la misma que al registrar a un usuario. El token de acceso 
para todas las operaciones dentro de la aplicación.


```
  {
    "account": {
        "id": 4,
        "email": "serge15games@gmail.com",
        "role": "USER_ROLE",
        "email_validated": false,
        "createdAt": "2025-01-02T00:12:35.275Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjo0LCJpYXQiOjE3MzU3NzY3NT"
  }
```

## SOLICITUD PARA EL REESTABLECIMIENTO DE LA CONTRASEÑA

Primero deberían de pedir el **CORREO ELECTRÓNICO** del usuario, una vez ingresado deberían de llamar el siguiente endpoint para enviar un correo electrónico al usuario con el link para reestablecer su contraseña. 

```
  TIPO: POST
  AUTHORIZATION: NONE
  ENDPOINT: http://localhost:5000/api/auth/forgot-password
```

La vista para reestablecer la contraseña no es necesaria realizarla, pensaba que podría ser servida por el mismo servidor así le implementamos más seguridad a la app.

## REQUEST
En el cuerpo de la request enviarán solo el correo electrónico.

```
  {
    "email": "serge15games@gmail.com"
  }
```

## RESPONSE
Si todo sale bien, el servidor responderá con el siguiente mensaje:

```
  {
    "message": "Se ha enviado un correo electrónico a serge15games@gmail.com"
  }
```

Se enviará un correo electrónico al usuario donde se le proporcionará el link para reeestablecer la contraseña,
donde en la misma se proporciona un token de acceso generado con una duración de 15 MINUTOS.
La ruta enviada por correo dirigirá al usuario a una vista web para reestablecer la contraseña.
## ERRORES
```
  Error: 400
  Message: Correo no válido

  Error: 400
  Message: No se proporcionó el correo electrónico.

  Error: 400
  Message: El correo no está registrado.

  Error: 500
  Message: Internal Server Error
```

# PERFIL

## CREAR PERFIL
En perfil se recabaran los datos de cada una de las personas. Si la cuenta se creó con un rol USER_ROLE
entonces podrá asociar diferentes perfiles a la misma cuenta, si la cuenta se creó con un rol ENTERPRISE_ROLE
entonces solo podrá asociarse con un solo perfil.

```
  TIPO: POST
  AUTHORIZATION: Bearer-Token: Token
  ENDPOINT: http://localhost:5000/api/profile/create
```

Para crear un perfil, deberán enviar el token que se retornó al crear una cuenta o al iniciar sesión. El token
lo enviarán para verificar la autenticidad del usuario en cada operación del sistema.

## REQUEST

Idealmente se deben enviar los siguientes datos.
```
  {
    "name": "Serge Eduardo Martínez Ramírez",
    "weight": "67",
    "height": "182",
    "birthdate": "2003-02-12",
    "is_primary": true,
    "img": "path/servidor"
  }
```

Los datos OBLIGATORIOS que se deben enviar a este endpoint son: NAME, BIRTHDATE, IS_PRIMARY.

is_primary: True si el perfil será el perfil principal de la cuenta, de lo contario enviar false.
img: Enviarán la ruta de la imagén de perfil. Las imágenes de perfil de los usuarios 
se almacenarán en el servidor.

Esto es para las cuentas de tipo USER_ROLE.

Podrían crear un perfil con la siguiente información sin problema.

```
  {
    "name": "Serge Eduardo Martínez Ramírez",
    "birthdate": "2003-02-12",
    "is_primary": true
  }
```
## RESPONSE

### ERROR: CUENTA EMPRESARIAL
Cuando la cuenta es de tipo empresarial solo se podrá tener vinculada un perfil. Si se intenta crear otro perfil
se enviará el siguiente error.

```
  {
    "error": "No puedes tener más de un perfil asociado a tu cuenta empresarial"
  }
```

### ERROR: TOKEN NO PROPORCIONADO

Al crear un perfil se debe de enviar el token generado al iniciar sesión en los headers de la petición.
Debe de ir como un BEARER TOKEN. Si el token no va en la solicitud, el servidor responderá con el siguiente error:

```
  {
    "error": "No token provided"
  }
```
### ERROR: TOKEN INVALIDO

Si el token es proporcionado pero no es un token valido, responderá con el siguiente error:

```
  {
    "error": "Token Invalid"
  }
```

### SUCCESS: PERFIL CREADO CORRECTAMENTE
Si el perfil se crea correctamente entonces el servidor responderá con la siguiente información:
```
  {
    "profile_id": "3443cd57-27a3-4788-9ee6-44a98f5b468d",
    "name": "Aaron Olvera Martínez",
    "weight": 67,
    "height": 162,
    "img": "path/servidor",
    "birthdate": "2003-03-12T00:00:00.000Z",
    "is_primary": true,
    "created_at": "2025-01-05T01:59:46.907Z",
    "account_id": 2
  }
```

## Actualizar Perfil

Endpoint para actualizar los datos del usuario.

```
  TIPO: POST
  AUTHORIZATION: Bearer-Token: Token de Cuenta
  ENDPOINT: http://localhost:5000/api/profile/update
```
### REQUEST
Para solicitar una actualización de los datos es necesario que se envié el token de autenticación de la cuenta
y el ID del perfil que se va a actualizar.

```
  {
    "profile_id": "032127ab-2f82-49c1-8cb0-9da3c28e6892",
    "name": "Serge Eduardo Martínez Ramírez",
    "weight": 70,
    "height": 182,
    "birthdate": "2003-02-12",
    "is_primary": true,
    "img": "path/server"
  }
```

### RESPONSE

Si todo sale bien, el servidor responde con la data del perfil actualizado.

```
  {
    "profile_id": "032127ab-2f82-49c1-8cb0-9da3c28e6892",
    "name": "Serge Eduardo Martínez Ramírez",
    "weight": 70,
    "height": 182,
    "img": "path/server",
    "birthdate": "2003-02-12T00:00:00.000Z",
    "is_primary": true,
    "created_at": "2025-01-05T05:04:07.415Z",
    "account_id": 1
  }
```

### ERRORES
* Retorna error si un perfil secundario intenta volverse un perfil principal. Al modificar los datos
eviten que se pueda modificar si el perfil es el principal o no.
* Retorna un error si un perfil no está asociado a la cuenta.
* Si otro perfil intenta modificar los datos y existe otro perfil con los mismos datos en la cuenta


