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

### Plugins Disponibles

#### 1. HelloWorldPlugin (Base)
Plugin base que devuelve "Hello World!".

```javascript
class HelloWorldPlugin {
  handler(req, res) {
    res.send('Hello World!');
  }
}
```

#### 2. HelloWorldBPlugin (Monkey Patching)
Modifica el comportamiento de `HelloWorldPlugin` usando monkey patching.

```javascript
class HelloWorldBPlugin {
  apply() {
    HelloWorldPlugin.prototype.handler = function(req, res) {
      res.send('Hello, World');
    };
  }
}
```

**Uso:**
```javascript
const plugin = new HelloWorldBPlugin();
plugin.apply();
app.addPlugin('helloworld', 'GET', '/helloworld', HelloWorldPlugin);
```

#### 3. HelloWorldCPlugin (Proxy) ⭐ Actual
Modifica el comportamiento usando JavaScript Proxy (implementación actual).

```javascript
class HelloWorldCPlugin {
  apply() {
    return new Proxy(HelloWorldPlugin, {
      construct(target, args) {
        const instance = new target(...args);
        return new Proxy(instance, {
          get(target, prop, receiver) {
            if (prop === 'handler') {
              return function(req, res) {
                res.send('Hello, World');
              };
            }
            return Reflect.get(target, prop, receiver);
          }
        });
      }
    });
  }
}
```

**Uso:**
```javascript
const plugin = new HelloWorldCPlugin();
const ProxiedPlugin = plugin.apply();
app.addPlugin('helloworld', 'GET', '/helloworld', ProxiedPlugin);
```


#### 4. HelloPlugin (Parámetros)
Plugin que demuestra el uso de parámetros de consulta (`query params`).

```javascript
class HelloPlugin {
  handler(req, res) {
    const name = req.query.name || 'World';
    res.send(`Hello ${name}!`);
  }
}
```


#### 5. HelloBPlugin (Proxy Global sobre HelloPlugin)
Modifica `HelloPlugin` usando un Proxy Global para cambiar el formato de salida ("Hello," en vez de "Hello").

```javascript
class HelloBPlugin {
  apply() {
    // Intercepta handler y devuelve "Hello, [name]"
  }
}
```

**Uso:**
```javascript
const helloBPlugin = new HelloBPlugin();
helloBPlugin.apply(); // Debe ejecutarse ANTES de requerir HelloPlugin
const HelloPlugin = require('./plugins/HelloPlugin');
app.addPlugin('hello', 'GET', '/hello', HelloPlugin);
```

#### 6. HelloTimestampPlugin (Proxy Global Múltiple)
Extiende el comportamiento de múltiples plugins (`HelloWorldPlugin` y `HelloPlugin`) interceptando `res.send` para agregar un timestamp.

```javascript
class HelloTimestampPlugin {
  apply() {
    // Intercepta constructores y res.send
    // Devuelve: body + " [ISO_TIMESTAMP]"
  }
}
```

**Uso:**
```javascript
const helloTimestampPlugin = new HelloTimestampPlugin();
helloTimestampPlugin.apply(); // Aplica a todos los plugins configurados
```

### Comparación de Patrones

| Patrón | Ventajas | Desventajas | Use directo del plugin |
|--------|----------|-------------|------------------------|
| **Monkey Patching** | Simple, directo | Modifica globalmente el prototipo | ✅ Sí |
| **Proxy** | No invasivo, controlado, flexible | Ligeramente más complejo | ✅ Sí |
| **Proxy Global** | Uso transparente del original | Requiere orden de carga estricto | ✅ Sí |
| **Proxy Interceptor** | Intercepta métodos de respuesta | Mayor complejidad | ✅ Sí |

## Endpoints

- **GET** `/helloworld` - Devuelve "Hello, World [TIMESTAMP]"
- **GET** `/hello` - Devuelve "Hello, [nombre] [TIMESTAMP]"

## Ejemplo de Uso

### /helloworld
```bash
curl http://localhost:3000/helloworld
```
Respuesta: `Hello, World [2026-01-16T08:13:12.904Z]`

### /hello
```bash
curl http://localhost:3000/hello?name=John
```
Respuesta: `Hello, John [2026-01-16T08:13:12.715Z]`


## Estructura del Proyecto

```
ovex-express/
├── index.js                      # Aplicación principal con sistema de plugins
├── plugins/
│   ├── HelloWorldPlugin.js       # Plugin base
│   ├── HelloWorldBPlugin.js      # Plugin con monkey patching
│   └── HelloWorldCPlugin.js      # Plugin con Proxy (actual)
├── package.json
└── README.md
```
