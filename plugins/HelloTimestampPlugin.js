/**
 * HelloTimestampPlugin
 * Plugin que usa Proxy Global para extender el comportamiento de múltiples plugins
 * Intercepta la respuesta para agregar un timestamp
 */
class HelloTimestampPlugin {
    constructor() {
        this.name = 'HelloTimestampPlugin';
    }

    /**
     * Aplica el Proxy a los plugins especificados
     */
    apply() {
        const pluginsToPatch = ['./HelloWorldPlugin', './HelloPlugin'];

        pluginsToPatch.forEach(pluginPath => {
            try {
                const fullPath = require.resolve(pluginPath);
                const pluginModule = require.cache[fullPath];

                if (!pluginModule) {
                    console.warn(`Módulo no encontrado en cache: ${pluginPath}`);
                    return;
                }

                const OriginalClass = pluginModule.exports;

                const ProxiedClass = new Proxy(OriginalClass, {
                    construct(target, args) {
                        const instance = new target(...args);
                        return new Proxy(instance, {
                            get(target, prop, receiver) {
                                if (prop === 'handler') {
                                    const originalHandler = Reflect.get(target, prop, receiver);

                                    return function (req, res) {
                                        // Interceptar res.send para modificar el cuerpo de la respuesta
                                        const originalSend = res.send;
                                        res.send = function (body) {
                                            const timestamp = new Date().toISOString();
                                            // Restaurar el send original y llamar con el contenido modificado
                                            res.send = originalSend;
                                            return originalSend.call(this, `${body} [${timestamp}]`);
                                        };

                                        // Llamar al handler original
                                        return originalHandler.apply(this, [req, res]);
                                    };
                                }
                                return Reflect.get(target, prop, receiver);
                            }
                        });
                    }
                });

                // Reemplazar la exportación del módulo
                pluginModule.exports = ProxiedClass;
                console.log(`HelloTimestampPlugin aplicado a: ${pluginPath}`);
            } catch (e) {
                console.error(`Error aplicando HelloTimestampPlugin a ${pluginPath}:`, e.message);
            }
        });
    }
}

module.exports = HelloTimestampPlugin;
