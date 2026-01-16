const HelloPlugin = require('./HelloPlugin');

/**
 * HelloBPlugin
 * Plugin que usa Proxy global para interceptar y modificar el comportamiento de HelloPlugin
 * Cambia "Hello X!" por "Hello, X"
 */
class HelloBPlugin {
    constructor() {
        this.name = 'HelloBPlugin';
    }

    /**
     * Método que crea un Proxy global de HelloPlugin
     */
    apply() {
        // Obtener el módulo de HelloPlugin
        const pluginModule = require.cache[require.resolve('./HelloPlugin')];

        // Crear un Proxy del constructor HelloPlugin
        const ProxiedPlugin = new Proxy(HelloPlugin, {
            construct(target, args) {
                // Crear la instancia original
                const instance = new target(...args);

                // Retornar un Proxy de la instancia
                return new Proxy(instance, {
                    get(target, prop, receiver) {
                        // Interceptar el método handler
                        if (prop === 'handler') {
                            return function (req, res) {
                                // Comportamiento modificado: Agregar coma
                                const name = req.query.name || 'World';
                                res.send(`Hello, ${name}`);
                            };
                        }

                        // Para cualquier otra propiedad, retornar el valor original
                        return Reflect.get(target, prop, receiver);
                    }
                });
            }
        });

        // Reemplazar la exportación del módulo con el Proxy
        pluginModule.exports = ProxiedPlugin;

        console.log('HelloBPlugin aplicado: Proxy global creado para HelloPlugin');
    }
}

module.exports = HelloBPlugin;
