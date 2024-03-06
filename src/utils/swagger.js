const swaggerJSDoc = require('swagger-jsdoc');
const version = require('../../package.json')

const address = "localhost"

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Curriculum Vitae",
        ...version,
        description: "Documentation for Curriculum vitae",
    },
    servers: [
        {
            url: `https://${address}:${process.env.SERVER_PORT}`,
            description: "Development Curriculum Vitae"
        },
    ],
}

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ["./src/routes/*.js"],
}

exports.swaggerSpec = swaggerJSDoc(options);
