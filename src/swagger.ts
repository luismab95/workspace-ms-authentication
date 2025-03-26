import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MS-AUTHENTICATION",
      version: "1.0.0",
      description:
        "Microservice for authentication based on hexagonal architecture in workspace project.",
    },
  },
  apis: ["src/infrastructure/http/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
