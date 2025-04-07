import { AppModule } from '@/app.module'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as bodyParser from 'body-parser'

// Main function to bootstrap and start the application
async function bootstrap() {
  // Create an instance of the NestJS application using the AppModule
  const app = await NestFactory.create(AppModule)

  app.use(bodyParser.json({ limit: '100mb' }))
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))

  app.setGlobalPrefix('api') // Add '/api' to all routes

  // Redirect root to /api-docs, but avoid redirecting if already at /api-docs
  app.use((req, res, next) => {
    if (req.originalUrl === '/') {
      return res.redirect('/api-docs')
    }
    next()
  })

  // Enable Cross-Origin Resource Sharing (CORS) to allow requests from different origins
  // This is useful for frontend-backend communication, especially in development environments
  app.enableCors({
    origin: '*', // Allows requests from any origin (not recommended for production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Specifies allowed HTTP methods
    credentials: true, // Enables the use of credentials like cookies, authorization headers, etc.
  })

  // Configure Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('Utility API Documentation') // Set the title of the documentation
    .setDescription(
      // Provide a detailed description of the API's purpose
      'The Utility API is designed for production-like utilities.',
    )
    .setVersion('1.0') // Specify the version of the API
    .build() // Build the Swagger configuration

  // Create the Swagger documentation object based on the configuration
  const document = SwaggerModule.createDocument(app, config)

  // Setup the Swagger module to serve the API docs at the '/api-docs' endpoint
  SwaggerModule.setup('api-docs', app, document)

  // Start the application and listen on the specified port
  // Use the environment variable PORT if defined, otherwise default to port 4000
  await app.listen(process.env.PORT || 4000)
}

// Call the bootstrap function to start the application
bootstrap()
