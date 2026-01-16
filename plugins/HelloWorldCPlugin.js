const HelloWorldPlugin = require('./HelloWorldPlugin');

/**
 * HelloWorldCPlugin
 * Plugin que usa Proxy para interceptar y modificar el comportamiento de HelloWorldPlugin
 */
class HelloWorldCPlugin {
    constructor() {
        this.name = 'HelloWorldCPlugin';
    }

    /**
     * Método que crea un Proxy global de HelloWorldPlugin
     * Modifica el módulo para que todas las futuras instancias usen el Proxy
     */
    apply() {
        // Obtener el módulo de HelloWorldPlugin
        const pluginModule = require.cache[require.resolve('./HelloWorldPlugin')];

        // Crear un Proxy del constructor HelloWorldPlugin
        const ProxiedPlugin = new Proxy(HelloWorldPlugin, {
            construct(target, args) {
                // Crear la instancia original
                const instance = new target(...args);

                // Retornar un Proxy de la instancia
                return new Proxy(instance, {
                    get(target, prop, receiver) {
                        // Interceptar el método handler
                        if (prop === 'handler') {
                            return function (req, res) {
                                // Comportamiento modificado
                                res.send('Hello, World');
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

        console.log('HelloWorldCPlugin aplicado: Proxy global creado para HelloWorldPlugin');
    }
}

module.exports = HelloWorldCPlugin;
