# Ovex Express

Aplicación web simple con Express.js que incluye un sistema de plugins extensible.

## Instalación

```bash
npm install
```

## Uso

Para iniciar el servidor:

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## Sistema de Plugins

La aplicación incluye un sistema de plugins que permite registrar endpoints de manera modular.

### Uso del método `addPlugin`

```javascript
app.addPlugin(name, method, route, PluginClass);
```

**Parámetros:**
- `name` (string): Nombre identificador del plugin
- `method` (string): Método HTTP (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)
- `route` (string): Ruta del endpoint
- `PluginClass` (Function): Clase del plugin que debe tener un método `handler(req, res)`

### Ejemplo: Crear un Plugin

```javascript
// plugins/HelloWorldPlugin.js
class HelloWorldPlugin {
  constructor() {
    this.name = 'HelloWorldPlugin';
  }

  handler(req, res) {
    res.send('Hello World!');
  }
}

module.exports = HelloWorldPlugin;
```

### Ejemplo: Registrar un Plugin

```javascript
const HelloWorldPlugin = require('./plugins/HelloWorldPlugin');

app.addPlugin('helloworld', 'GET', '/helloworld', HelloWorldPlugin);
```

## Endpoints

- **GET** `/helloworld` - Devuelve "Hello World!" (registrado mediante plugin)

## Ejemplo de Uso

```bash
curl http://localhost:3000/helloworld
```

Respuesta:
```
Hello World!
```

## Estructura del Proyecto

```
ovex-express/
├── index.js                      # Aplicación principal con sistema de plugins
├── plugins/
│   └── HelloWorldPlugin.js       # Plugin de ejemplo
├── package.json
└── README.md
```
