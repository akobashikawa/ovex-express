const HelloWorldPlugin = require('./HelloWorldPlugin');

/**
 * HelloWorldBPlugin
 * Plugin que modifica el comportamiento de HelloWorldPlugin
 * sobrescribiendo su método handler
 */
class HelloWorldBPlugin {
    constructor() {
        this.name = 'HelloWorldBPlugin';
    }

    /**
     * Método que altera el comportamiento de HelloWorldPlugin
     * Sobrescribe el método handler del prototipo
     */
    apply() {
        // Guardar el handler original (por si se necesita restaurar)
        const originalHandler = HelloWorldPlugin.prototype.handler;

        // Sobrescribir el método handler de HelloWorldPlugin
        HelloWorldPlugin.prototype.handler = function (req, res) {
            res.send('Hello, World');
        };

        console.log('HelloWorldBPlugin aplicado: comportamiento de HelloWorldPlugin modificado');
    }
}

module.exports = HelloWorldBPlugin;
