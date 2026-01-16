/**
 * HelloPlugin
 * Plugin que devuelve un saludo personalizado
 */
class HelloPlugin {
    constructor() {
        this.name = 'HelloPlugin';
    }

    /**
     * Handler del plugin
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    handler(req, res) {
        const name = req.query.name || 'World';
        res.send(`Hello ${name}!`);
    }
}

module.exports = HelloPlugin;
