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

### Comparación de Patrones

| Patrón | Ventajas | Desventajas |
|--------|----------|-------------|
| **Monkey Patching** | Simple, directo | Modifica globalmente el prototipo |
| **Proxy** | No invasivo, controlado, flexible | Ligeramente más complejo |

## Endpoints

- **GET** `/helloworld` - Devuelve "Hello, World" (usando HelloWorldCPlugin con Proxy)

## Ejemplo de Uso

```bash
curl http://localhost:3000/helloworld
```

Respuesta:
```
Hello, World
```

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
