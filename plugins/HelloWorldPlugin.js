/**
 * HelloWorldPlugin
 * Plugin de ejemplo que devuelve "Hello World!"
 */
class HelloWorldPlugin {
    constructor() {
        this.name = 'HelloWorldPlugin';
    }

    /**
     * Handler del plugin
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    handler(req, res) {
        res.send('Hello World!');
    }
}

module.exports = HelloWorldPlugin;
