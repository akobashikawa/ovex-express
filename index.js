const express = require('express');

const app = express();
const PORT = 3000;

// Sistema de plugins
app.plugins = [];

/**
 * Método para agregar plugins a la aplicación
 * @param {string} name - Nombre del plugin
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE, etc.)
 * @param {string} route - Ruta del endpoint
 * @param {Function} PluginClass - Clase del plugin
 */
app.addPlugin = function (name, method, route, PluginClass) {
    // Validar método HTTP
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
    const upperMethod = method.toUpperCase();

    if (!validMethods.includes(upperMethod)) {
        throw new Error(`Método HTTP inválido: ${method}`);
    }

    // Instanciar el plugin
    const pluginInstance = new PluginClass();

    // Verificar que el plugin tenga un método handler
    if (typeof pluginInstance.handler !== 'function') {
        throw new Error(`El plugin ${name} debe tener un método handler`);
    }

    // Registrar el plugin en la aplicación
    const lowerMethod = upperMethod.toLowerCase();
    app[lowerMethod](route, (req, res) => {
        pluginInstance.handler(req, res);
    });

    // Guardar metadata del plugin
    app.plugins.push({
        name,
        method: upperMethod,
        route,
        pluginClass: PluginClass.name
    });

    console.log(`Plugin registrado: ${name} [${upperMethod} ${route}]`);
};



// Aplicar HelloWorldCPlugin para modificar globalmente el comportamiento de HelloWorldPlugin usando Proxy
const HelloWorldCPlugin = require('./plugins/HelloWorldCPlugin');
const helloworldCPlugin = new HelloWorldCPlugin();
helloworldCPlugin.apply();

// IMPORTANTE: Requerir HelloWorldPlugin DESPUÉS de aplicar el Proxy
const HelloWorldPlugin = require('./plugins/HelloWorldPlugin');

// Aplicar HelloBPlugin para modificar globalmente el comportamiento de HelloPlugin usando Proxy
const HelloBPlugin = require('./plugins/HelloBPlugin');
const helloBPlugin = new HelloBPlugin();
helloBPlugin.apply();

// IMPORTANTE: Requerir HelloPlugin DESPUÉS de aplicar el Proxy
const HelloPlugin = require('./plugins/HelloPlugin');

// Registrar el plugin HelloWorld (ahora con comportamiento modificado globalmente por HelloWorldCPlugin)
app.addPlugin('helloworld', 'GET', '/helloworld', HelloWorldPlugin);

// Registrar el plugin Hello
app.addPlugin('hello', 'GET', '/hello', HelloPlugin);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Plugins registrados: ${app.plugins.length}`);
    app.plugins.forEach(plugin => {
        console.log(`  - ${plugin.name}: ${plugin.method} ${plugin.route}`);
    });
});
