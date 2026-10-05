# 🟢 NestJS Interview Preparation — Basic Level (0–1 Year Experience)

> Comprehensive interview guide covering NestJS core architecture, TypeScript fundamentals, CLI workflows, dependency injection basics, controllers, services, modules, routing, validation, and standard REST API design.

---

## 📑 Table of Contents

- [Q01. What is NestJS and why would you choose it over vanilla Express or Fastify?](#q01-what-is-nestjs-and-why-would-you-choose-it-over-vanilla-express-or-fastify)
- [Q02. What are the three core structural building blocks of every NestJS application?](#q02-what-are-the-three-core-structural-building-blocks-of-every-nestjs-application)
- [Q03. What is the role of `main.ts` and `NestFactory.create()`?](#q03-what-is-the-role-of-maints-and-nestfactorycreate)
- [Q04. What is a Module in NestJS, and what are its four metadata properties?](#q04-what-is-a-module-in-nestjs-and-what-are-its-four-metadata-properties)
- [Q05. What is the Root Module (`AppModule`) and why is it mandatory?](#q05-what-is-the-root-module-appmodule-and-why-is-it-mandatory)
- [Q06. How do Controllers work in NestJS and what is the `@Controller()` decorator?](#q06-how-do-controllers-work-in-nestjs-and-what-is-the-controller-decorator)
- [Q07. How do HTTP route mapping decorators (`@Get`, `@Post`, `@Put`, `@Delete`, `@Patch`) work?](#q07-how-do-http-route-mapping-decorators-get-post-put-delete-patch-work)
- [Q08. How do you extract parameters from incoming HTTP requests (`@Param`, `@Query`, `@Body`, `@Headers`)?](#q08-how-do-you-extract-parameters-from-incoming-http-requests-param-query-body-headers)
- [Q09. What is a Provider / Service in NestJS, and what does the `@Injectable()` decorator do?](#q09-what-is-a-provider--service-in-nestjs-and-what-does-the-injectable-decorator-do)
- [Q10. What is Dependency Injection (DI) and Inversion of Control (IoC) in NestJS?](#q10-what-is-dependency-injection-di-and-inversion-of-control-ioc-in-nestjs)
- [Q11. How does constructor-based Dependency Injection work in NestJS?](#q11-how-does-constructor-based-dependency-injection-work-in-nestjs)
- [Q12. What is the separation of concerns between a Controller and a Service?](#q12-what-is-the-separation-of-concerns-between-a-controller-and-a-service)
- [Q13. What are common Nest CLI generation commands (`generate` / `g`) and how do they speed up development?](#q13-what-are-common-nest-cli-generation-commands-generate--g-and-how-do-they-speed-up-development)
- [Q14. What is a Data Transfer Object (DTO) and why are TypeScript classes used instead of interfaces?](#q14-what-is-a-data-transfer-object-dto-and-why-are-typescript-classes-used-instead-of-interfaces)
- [Q15. How do you validate request payloads using `class-validator` and `ValidationPipe`?](#q15-how-do-you-validate-request-payloads-using-class-validator-and-validationpipe)
- [Q16. How do you configure a global `ValidationPipe` in `main.ts` with `whitelist` and `transform`?](#q16-how-do-you-configure-a-global-validationpipe-in-maints-with-whitelist-and-transform)
- [Q17. What is the difference between `@Param('id')` and `@Query('search')`?](#q17-what-is-the-difference-between-paramid-and-querysearch)
- [Q18. How do you customize HTTP status codes using `@HttpCode()` and response headers using `@Header()`?](#q18-how-do-you-customize-http-status-codes-using-httpcode-and-response-headers-using-header)
- [Q19. What built-in HTTP exception classes are provided by NestJS?](#q19-what-built-in-http-exception-classes-are-provided-by-nestjs)
- [Q20. How do you throw custom error messages and payload structures using built-in exceptions?](#q20-how-do-you-throw-custom-error-messages-and-payload-structures-using-built-in-exceptions)
- [Q21. What is the exact difference between `imports` and `exports` in a NestJS module?](#q21-what-is-the-exact-difference-between-imports-and-exports-in-a-nestjs-module)
- [Q22. What is the `@Global()` decorator, when should it be used, and what are its risks?](#q22-what-is-the-global-decorator-when-should-it-be-used-and-what-are-its-risks)
- [Q23. How do you load environment variables using `@nestjs/config` (`ConfigModule` and `ConfigService`)?](#q23-how-do-you-load-environment-variables-using-nestjsconfig-configmodule-and-configservice)
- [Q24. What is the high-level Request-Response lifecycle order in NestJS?](#q24-what-is-the-high-level-request-response-lifecycle-order-in-nestjs)
- [Q25. What is a NestJS Middleware and how do you implement the `NestMiddleware` interface?](#q25-what-is-a-nestjs-middleware-and-how-do-you-implement-the-nestmiddleware-interface)
- [Q26. How do you apply middleware to specific routes or exclude routes using `MiddlewareConsumer`?](#q26-how-do-you-apply-middleware-to-specific-routes-or-exclude-routes-using-middlewareconsumer)
- [Q27. What is a Pipe in NestJS and what are the common built-in transformation pipes?](#q27-what-is-a-pipe-in-nestjs-and-what-are-the-common-built-in-transformation-pipes)
- [Q28. How does `ParseIntPipe` or `ParseUUIDPipe` work to validate and transform route parameters?](#q28-how-does-parseintpipe-or-parseuuidpipe-work-to-validate-and-transform-route-parameters)
- [Q29. What is the difference between `forRoot()` and `forFeature()` in third-party modules?](#q29-what-is-the-difference-between-forroot-and-forfeature-in-third-party-modules)
- [Q30. How does NestJS handle asynchronous operations returning Promises and RxJS Observables?](#q30-how-does-nestjs-handle-asynchronous-operations-returning-promises-and-rxjs-observables)
- [Q31. How do you enable and configure Cross-Origin Resource Sharing (CORS) in NestJS?](#q31-how-do-you-enable-and-configure-cross-origin-resource-sharing-cors-in-nestjs)
- [Q32. What is the difference between the Express platform adapter and the Fastify platform adapter?](#q32-what-is-the-difference-between-the-express-platform-adapter-and-the-fastify-platform-adapter)
- [Q33. How do you configure a global URL prefix (e.g., `/api/v1`) in `main.ts`?](#q33-how-do-you-configure-a-global-url-prefix-eg-apiv1-in-maints)
- [Q34. How does route redirection work in NestJS using the `@Redirect()` decorator?](#q34-how-does-route-redirection-work-in-nestjs-using-the-redirect-decorator)

---

### Q01. What is NestJS and why would you choose it over vanilla Express or Fastify?

#### Answer:
**NestJS** is a progressive Node.js framework built with and fully supporting TypeScript (while preserving compatibility with pure JavaScript). It uses robust HTTP server frameworks like **Express** (default) or **Fastify** under the hood.

**Key Reasons to Choose NestJS:**
1. **Opinionated Architectural Structure**: Vanilla Express provides virtually no architectural guidelines, often leading to unmaintainable "spaghetti code" across large teams. NestJS enforces modular design inspired by Angular.
2. **First-class TypeScript Support**: Strongly typed codebase with compile-time type safety, decorators, and metadata reflection.
3. **Built-in Dependency Injection (IoC)**: Decouples classes, simplifies testing, and manages object lifecycles out of the box.
4. **Rich Ecosystem**: Native packages for microservices, WebSockets, GraphQL, ORMs (TypeORM/Prisma), validation, and OpenAPI (Swagger).
5. **Testability**: Provides `@nestjs/testing` to mock dependencies and bootstrap test modules with minimal boilerplate.

---

### Q02. What are the three core structural building blocks of every NestJS application?

#### Answer:
The architecture of NestJS rests on three fundamental concepts:
1. **Modules (`@Module`)**: Logical containers that group related controllers, services, and configuration. Every application has at least one root module.
2. **Controllers (`@Controller`)**: Responsible for handling incoming HTTP requests, mapping routes, extracting parameters, and returning responses to clients.
3. **Providers (`@Injectable`)**: Plain TypeScript classes that encapsulate business logic, data access, or utilities. They can be injected into controllers or other providers via Dependency Injection.

#### Example:
```typescript
// 1. Provider / Service
import { Injectable } from '@nestjs/common';

@Injectable()
export class GreetingService {
  getHello(): string {
    return 'Welcome to NestJS!';
  }
}

// 2. Controller
import { Controller, Get } from '@nestjs/common';

@Controller('greeting')
export class GreetingController {
  constructor(private readonly greetingService: GreetingService) {}

  @Get()
  sayHello(): string {
    return this.greetingService.getHello();
  }
}

// 3. Module
import { Module } from '@nestjs/common';

@Module({
  controllers: [GreetingController],
  providers: [GreetingService],
})
export class GreetingModule {}
```

---

### Q03. What is the role of `main.ts` and `NestFactory.create()`?

#### Answer:
`main.ts` serves as the application's entry point. It uses the static `NestFactory` class to bootstrap the application by reading the root module (`AppModule`), creating the DI container, resolving all dependency trees, and starting an HTTP listener on a specified port.

#### Example:
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Instantiates the Nest application based on the root module
  const app = await NestFactory.create(AppModule);

  // Set global configurations
  app.setGlobalPrefix('api');
  app.enableCors();

  // Listen on port 3000
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
```

---

### Q04. What is a Module in NestJS, and what are its four metadata properties?

#### Answer:
A Module is a class annotated with the `@Module()` decorator. The decorator provides metadata that the Nest IoC container uses to organize the application dependency graph.

**The Four Metadata Properties:**
- `imports`: The list of imported modules that export the providers required in this module.
- `controllers`: The list of controllers defined in this module that should be instantiated.
- `providers`: The providers (services, factories, repositories) instantiated by the Nest injector and available across this module.
- `exports`: The subset of `providers` that should be visible and usable in other modules that import this module.

#### Example:
```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],       // Modules providing external dependencies
  controllers: [UsersController], // Controllers belonging to this module
  providers: [UsersService],       // Services instantiated within this module
  exports: [UsersService],         // Exported so AuthModule can inject UsersService
})
export class UsersModule {}
```

---

### Q05. What is the Root Module (`AppModule`) and why is it mandatory?

#### Answer:
The **Root Module** (conventionally named `AppModule`) is the starting point from which NestJS builds the application graph. 
- When `NestFactory.create(AppModule)` is called, Nest starts resolving all child modules declared inside `AppModule.imports`, recursively assembling every controller, provider, and dependency.
- Without a root module, the Nest IoC container has no entry point to discover components or initialize the DI graph.

---

### Q06. How do Controllers work in NestJS and what is the `@Controller()` decorator?

#### Answer:
Controllers are responsible for receiving incoming client HTTP requests and returning responses. 
- The `@Controller('path')` decorator designates a class as a REST controller and optionally defines an URL prefix for all route handlers defined inside that class.
- Nest inspects method-level decorators (`@Get()`, `@Post()`, etc.) to register routes with the underlying HTTP server (Express or Fastify).

#### Example:
```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('products') // Base route: /products
export class ProductsController {
  @Get() // GET /products
  findAll(): string[] {
    return ['Laptop', 'Keyboard', 'Monitor'];
  }
}
```

---

### Q07. How do HTTP route mapping decorators (`@Get`, `@Post`, `@Put`, `@Delete`, `@Patch`) work?

#### Answer:
Nest provides method decorators corresponding to standard HTTP verbs:
- `@Get('path')`: Handles HTTP GET (read resources).
- `@Post('path')`: Handles HTTP POST (create resources).
- `@Put('path')`: Handles HTTP PUT (full replacement of resource).
- `@Patch('path')`: Handles HTTP PATCH (partial update of resource).
- `@Delete('path')`: Handles HTTP DELETE (remove resource).

The string passed inside the decorator is appended to the controller prefix.

#### Example:
```typescript
import { Controller, Get, Post, Put, Patch, Delete } from '@nestjs/common';

@Controller('items')
export class ItemsController {
  @Get()             // GET /items
  getAll() { return 'All items'; }

  @Post()            // POST /items
  create() { return 'Item created'; }

  @Put(':id')        // PUT /items/:id
  replace() { return 'Item replaced'; }

  @Patch(':id')      // PATCH /items/:id
  update() { return 'Item patched'; }

  @Delete(':id')     // DELETE /items/:id
  remove() { return 'Item removed'; }
}
```

---

### Q08. How do you extract parameters from incoming HTTP requests (`@Param`, `@Query`, `@Body`, `@Headers`)?

#### Answer:
NestJS provides declarative parameter decorators that bind incoming request data directly to method handler arguments:
- `@Param(key?)`: Extracts route parameters (e.g., `/users/:id`).
- `@Query(key?)`: Extracts query string parameters (e.g., `/users?page=1&limit=10`).
- `@Body(key?)`: Extracts the parsed JSON request payload.
- `@Headers(key?)`: Extracts incoming HTTP request headers.
- `@Req()` & `@Res()`: Injects the platform-specific Request and Response objects (use sparingly to avoid losing framework abstraction).

#### Example:
```typescript
import { Controller, Get, Post, Param, Query, Body, Headers } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':id')
  getUser(
    @Param('id') id: string,
    @Query('includeProfile') includeProfile: string,
    @Headers('authorization') authHeader: string,
  ) {
    return { id, includeProfile: Boolean(includeProfile), authHeader };
  }

  @Post()
  createUser(@Body() payload: { name: string; email: string }) {
    return { message: 'User created', payload };
  }
}
```

---

### Q09. What is a Provider / Service in NestJS, and what does the `@Injectable()` decorator do?

#### Answer:
A **Provider** is any class that can be injected as a dependency. Services, repositories, factories, and helpers can all be providers.
- The `@Injectable()` decorator tells TypeScript and NestJS that this class can be managed by the Nest IoC container.
- It attaches metadata that allows the Nest DI container to discover the constructor parameter types of the class and supply instances automatically.

---

### Q10. What is Dependency Injection (DI) and Inversion of Control (IoC) in NestJS?

#### Answer:
- **Inversion of Control (IoC)**: A software design principle where the control of object creation and lifecycle management is delegated to an external container/framework rather than each class instantiating its own dependencies using `new ClassName()`.
- **Dependency Injection (DI)**: The mechanism used by IoC containers to supply dependent objects to a class (typically through its constructor).

**Benefits in NestJS**:
1. Eliminates tight coupling between services and controllers.
2. Simplifies unit testing because dependencies can be swapped with mocks.
3. Automatically manages singletons and memory reuse across the application.

---

### Q11. How does constructor-based Dependency Injection work in NestJS?

#### Answer:
In NestJS, dependencies are declared in the class constructor. By using TypeScript's access modifiers (`private`, `readonly`, `public`), Nest automatically creates a class property and assigns the injected instance at runtime.

#### Example:
```typescript
import { Injectable, Controller, Get } from '@nestjs/common';

@Injectable()
export class OrdersService {
  getOrders() {
    return [{ orderId: 'ORD-101', total: 450 }];
  }
}

@Controller('orders')
export class OrdersController {
  // Nest injects OrdersService singleton into this constructor
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  fetchOrders() {
    return this.ordersService.getOrders();
  }
}
```

---

### Q12. What is the separation of concerns between a Controller and a Service?

#### Answer:
- **Controller Responsibility**:
  - Acts as the HTTP boundary layer.
  - Validates and deserializes incoming requests (routing, params, DTOs).
  - Delegates execution to the appropriate service method.
  - Determines HTTP status codes, headers, and response formats.
  - Should **not** contain SQL queries, business logic, or third-party API orchestration.

- **Service Responsibility**:
  - Implements core business logic, business rules, calculations, and domain validations.
  - Interacts with databases, ORMs, message queues, and external APIs.
  - Reusable across multiple controllers, cron jobs, microservices, or CLI scripts.

---

### Q13. What are common Nest CLI generation commands (`generate` / `g`) and how do they speed up development?

#### Answer:
The Nest CLI provides scaffolding commands that create files and automatically register them in the parent module:

| Command | Shorthand | What it creates |
| :--- | :--- | :--- |
| `nest generate module users` | `nest g mo users` | Creates `users.module.ts` and imports it in `app.module.ts` |
| `nest generate controller users` | `nest g co users` | Creates `users.controller.ts` and registers in `users.module.ts` |
| `nest generate service users` | `nest g s users` | Creates `users.service.ts` and registers in `users.module.ts` |
| `nest generate resource users` | `nest g res users` | Generates full CRUD scaffolding (Module, Controller, Service, DTOs, Entities) |

---

### Q14. What is a Data Transfer Object (DTO) and why are TypeScript classes used instead of interfaces?

#### Answer:
A **DTO (Data Transfer Object)** is an object that defines how data will be sent over the network.
- **Why Classes instead of Interfaces?**
  - TypeScript interfaces are purely compile-time constructs and are completely removed ("erased") during JavaScript compilation.
  - TypeScript **Classes** are preserved in runtime JavaScript. NestJS and validation libraries (`class-validator`, `class-transformer`) rely on runtime class metadata to validate and transform incoming JSON payloads.

#### Example:
```typescript
// create-user.dto.ts
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  readonly name: string;

  @IsEmail()
  readonly email: string;
}
```

---

### Q15. How do you validate request payloads using `class-validator` and `ValidationPipe`?

#### Answer:
1. Install `class-validator` and `class-transformer`:
   ```bash
   npm install class-validator class-transformer
   ```
2. Annotate DTO fields with validation decorators (`@IsString()`, `@IsInt()`, `@IsEmail()`, etc.).
3. Apply `ValidationPipe` either globally or at the controller/route level.

#### Example:
```typescript
import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return { status: 'Valid payload', data: createUserDto };
  }
}
```

---

### Q16. How do you configure a global `ValidationPipe` in `main.ts` with `whitelist` and `transform`?

#### Answer:
Setting a global validation pipe ensures that all incoming request bodies, queries, and params across every endpoint are automatically validated and sanitized.

- `whitelist: true`: Strips away any properties not explicitly defined in the DTO (protects against mass assignment attacks).
- `forbidNonWhitelisted: true`: Throws a `400 Bad Request` if unknown properties are passed.
- `transform: true`: Automatically converts request payloads into instances of their DTO classes and transforms primitive types (e.g., query string `"5"` to number `5`).

#### Example:
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

---

### Q17. What is the difference between `@Param('id')` and `@Query('search')`?

#### Answer:
- `@Param('id')`: Used to extract **path parameters** that identify a specific resource in the URL hierarchy.
  - URL: `/api/articles/42` $\rightarrow$ `@Param('id')` equals `'42'`.
- `@Query('search')`: Used to extract **query string parameters** for filtering, sorting, or pagination without altering the resource path.
  - URL: `/api/articles?search=nestjs&page=1` $\rightarrow$ `@Query('search')` equals `'nestjs'`.

---

### Q18. How do you customize HTTP status codes using `@HttpCode()` and response headers using `@Header()`?

#### Answer:
By default, Nest returns `200 OK` for all endpoints except `POST`, which returns `201 Created`.
- Use `@HttpCode(HttpStatus.XYZ)` to specify a custom status code.
- Use `@Header('key', 'value')` to send custom HTTP response headers.

#### Example:
```typescript
import { Controller, Post, HttpCode, HttpStatus, Header } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('login')
  @HttpCode(HttpStatus.OK) // Change default POST 201 to 200
  @Header('X-Application-Version', '1.0.0')
  login() {
    return { token: 'jwt-access-token' };
  }
}
```

---

### Q19. What built-in HTTP exception classes are provided by NestJS?

#### Answer:
NestJS provides a rich set of built-in exceptions derived from `HttpException` in `@nestjs/common`:
- `BadRequestException` (400)
- `UnauthorizedException` (41)
- `ForbiddenException` (403)
- `NotFoundException` (404)
- `MethodNotAllowedException` (405)
- `NotAcceptableException` (406)
- `RequestTimeoutException` (408)
- `ConflictException` (409)
- `GoneException` (410)
- `PayloadTooLargeException` (413)
- `UnsupportedMediaTypeException` (415)
- `UnprocessableEntityException` (422)
- `InternalServerErrorException` (500)
- `BadGatewayException` (502)
- `ServiceUnavailableException` (503)

---

### Q20. How do you throw custom error messages and payload structures using built-in exceptions?

#### Answer:
Built-in exception constructors accept either a string error message or a custom object structure, along with an optional error description.

#### Example:
```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [{ id: '1', email: 'john@example.com' }];

  findById(id: string) {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} was not found`);
    }
    return user;
  }

  create(email: string) {
    const exists = this.users.some(u => u.email === email);
    if (exists) {
      throw new ConflictException({
        statusCode: 409,
        error: 'Conflict',
        message: 'Email address is already registered',
        field: 'email',
      });
    }
    return { id: '2', email };
  }
}
```

---

### Q21. What is the exact difference between `imports` and `exports` in a NestJS module?

#### Answer:
- `imports`: Declares other modules that this module depends on. It gives this module access to whatever those other modules have explicitly placed in their `exports` array.
- `exports`: Declares which providers owned by this module are made publicly available to any other module that imports this module. If a provider is listed in `providers` but NOT in `exports`, it remains private to this module.

```
+--------------------+                     +--------------------+
|    AuthModule      |                     |    UsersModule     |
|                    |                     |                    |
| imports: [         |                     | providers: [       |
|   UsersModule  ----+-------------------->|   UsersService     |
| ]                  |  can inject         | ],                 |
|                    |  UsersService       | exports: [         |
|                    |                     |   UsersService ----+
+--------------------+                     +--------------------+
```

---

### Q22. What is the `@Global()` decorator, when should it be used, and what are its risks?

#### Answer:
By default, Nest modules are scoped to their own boundaries. If 10 modules need `DatabaseService`, all 10 must import `DatabaseModule`.
- Applying `@Global()` makes a module globally available. Once imported once in `AppModule`, all exported providers can be injected anywhere without re-importing the module.
- **Good Use Cases**: Cross-cutting infrastructure modules such as `DatabaseModule`, `CacheModule`, or `ConfigModule`.
- **Risks**: Overusing `@Global()` breaks modularity, creates invisible dependencies, and makes unit testing and refactoring difficult.

#### Example:
```typescript
import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
```

---

### Q23. How do you load environment variables using `@nestjs/config` (`ConfigModule` and `ConfigService`)?

#### Answer:
1. Install package: `npm install @nestjs/config`
2. Import `ConfigModule.forRoot()` in `AppModule`.
3. Inject `ConfigService` into any provider or controller to read typed environment variables.

#### Example:
```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Available everywhere without re-importing
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}

// database.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {}

  getDbPort(): number {
    return this.configService.get<number>('DB_PORT', 5432);
  }
}
```

---

### Q24. What is the high-level Request-Response lifecycle order in NestJS?

#### Answer:
When an incoming HTTP request hits a NestJS application, components execute in a strict, predictable pipeline:

1. **Incoming Request**
2. **Global Middleware** $\rightarrow$ **Module Middleware**
3. **Global Guards** $\rightarrow$ **Controller Guards** $\rightarrow$ **Route Guards**
4. **Global Interceptors (Pre-controller logic)** $\rightarrow$ **Controller / Route Interceptors**
5. **Global Pipes** $\rightarrow$ **Controller Pipes** $\rightarrow$ **Route Pipes** $\rightarrow$ **Parameter Pipes**
6. **Controller Route Handler Method** (invokes Business Service)
7. **Route / Controller / Global Interceptors (Post-controller RxJS operators)**
8. **Exception Filters** (if any error/exception was thrown at any step)
9. **Outgoing HTTP Response**

---

### Q25. What is a NestJS Middleware and how do you implement the `NestMiddleware` interface?

#### Answer:
NestJS middleware is equivalent to standard Express middleware. It is a function or class that executes before the route handler, with access to the `Request`, `Response`, and `next()` function.

**Common Middleware Tasks:**
- Request logging
- Attaching trace IDs
- Modifying request headers
- Parsing cookies

#### Example:
```typescript
// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${method}] ${originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });

    next();
  }
}
```

---

### Q26. How do you apply middleware to specific routes or exclude routes using `MiddlewareConsumer`?

#### Answer:
Middleware cannot be listed in the `@Module()` decorator properties. Instead, the module must implement the `NestModule` interface and define the `configure(consumer: MiddlewareConsumer)` method.

#### Example:
```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { UsersController } from './users/users.controller';

@Module({
  controllers: [UsersController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'users/health', method: RequestMethod.GET },
      )
      .forRoutes(UsersController); // Can also be string path 'users/*'
  }
}
```

---

### Q27. What is a Pipe in NestJS and what are the common built-in transformation pipes?

#### Answer:
A **Pipe** is a class annotated with `@Injectable()` implementing `PipeTransform`.
Pipes serve two primary purposes:
1. **Transformation**: Converts input data to the desired type/format (e.g., string to integer).
2. **Validation**: Evaluates input data and throws an exception if the data is invalid.

**Common Built-in Pipes:**
- `ParseIntPipe`: Converts string to integer.
- `ParseFloatPipe`: Converts string to float.
- `ParseBoolPipe`: Converts string `'true' | 'false'` to boolean.
- `ParseArrayPipe`: Parses comma-separated values into arrays.
- `ParseUUIDPipe`: Validates that a string is a valid UUID (v4/v5).
- `DefaultValuePipe`: Provides a fallback default value if parameter is undefined.

---

### Q28. How does `ParseIntPipe` or `ParseUUIDPipe` work to validate and transform route parameters?

#### Answer:
When applied to `@Param()`, these pipes automatically validate and transform the parameter before it enters the controller method. If parsing fails, Nest immediately returns a `400 Bad Request` without executing the method body.

#### Example:
```typescript
import { Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, HttpStatus } from '@nestjs/common';

@Controller('users')
export class UsersController {
  // GET /users/123 -> id becomes number 123
  @Get('by-id/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof id); // "number"
    return { id };
  }

  // GET /users/uuid/c8b3... -> validates UUID v4 format
  @Get('uuid/:uuid')
  getUserByUuid(
    @Param(
      'uuid',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    uuid: string,
  ) {
    return { uuid };
  }
}
```

---

### Q29. What is the difference between `forRoot()` and `forFeature()` in third-party modules?

#### Answer:
Dynamic modules often provide static methods named `forRoot()` and `forFeature()`:
- `forRoot()` / `forRootAsync()`:
  - Called **once** in the root module (`AppModule`).
  - Configures global settings, database connections, and establishes shared driver connections (e.g., `TypeOrmModule.forRoot({ ... })`).
- `forFeature()`:
  - Called inside individual feature/sub-modules.
  - Registers module-specific entities or repositories using the connection established by `forRoot()` (e.g., `TypeOrmModule.forFeature([UserEntity])`).

---

### Q30. How does NestJS handle asynchronous operations returning Promises and RxJS Observables?

#### Answer:
NestJS route handlers seamlessly support both modern asynchronous patterns:
1. **Promises (`async / await`)**: When a route handler returns a `Promise`, Nest automatically waits for it to resolve before serializing and sending the HTTP response.
2. **RxJS `Observable`**: When a handler returns an `Observable`, Nest automatically subscribes to it, extracts the emitted value, completes the stream, and sends the response.

#### Example:
```typescript
import { Controller, Get } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Controller('async')
export class AsyncController {
  // Handling Promise
  @Get('promise')
  async getPromise(): Promise<{ data: string }> {
    return new Promise(resolve => setTimeout(() => resolve({ data: 'Resolved Promise' }), 100));
  }

  // Handling Observable
  @Get('observable')
  getObservable(): Observable<{ data: string }> {
    return of({ data: 'Streamed Value' }).pipe(delay(100));
  }
}
```

---

### Q31. How do you enable and configure Cross-Origin Resource Sharing (CORS) in NestJS?

#### Answer:
CORS can be enabled in `main.ts` using `app.enableCors()` with an options configuration object.

#### Example:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://myfrontend.com', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(3000);
}
bootstrap();
```

---

### Q32. What is the difference between the Express platform adapter and the Fastify platform adapter?

#### Answer:
NestJS is platform-agnostic thanks to the adapter pattern:
- **Express (`@nestjs/platform-express`)**:
  - The default adapter.
  - Extremely mature ecosystem, vast collection of third-party npm middleware packages.
  - Slightly lower throughput compared to Fastify.
- **Fastify (`@nestjs/platform-fastify`)**:
  - High-performance alternative built for maximum speed.
  - Capable of handling up to 2x higher throughput and lower request latency.
  - May require Fastify-compatible middleware or plugins instead of standard Express packages.

#### Example (Switching to Fastify):
```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
```

---

### Q33. How do you configure a global URL prefix (e.g., `/api/v1`) in `main.ts`?

#### Answer:
Use `app.setGlobalPrefix('prefix', options?)` in `main.ts`. You can optionally exclude specific paths (such as health check endpoints or OpenAPI docs).

#### Example:
```typescript
import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  await app.listen(3000);
}
bootstrap();
```

---

### Q34. How does route redirection work in NestJS using the `@Redirect()` decorator?

#### Answer:
The `@Redirect(url, statusCode)` decorator redirects the client to another URL. The default status code is `302 Found`. 
You can also return an object `{ url: string, statusCode?: number }` dynamically from the route handler to override the static decorator values.

#### Example:
```typescript
import { Controller, Get, Redirect, Query } from '@nestjs/common';

@Controller('docs')
export class DocsController {
  // Static redirect
  @Get('v1')
  @Redirect('https://docs.nestjs.com/v1', 301)
  getDocsV1() {}

  // Dynamic redirect based on query param
  @Get('search')
  @Redirect('https://docs.nestjs.com', 302)
  searchDocs(@Query('version') version: string) {
    if (version === '10') {
      return { url: 'https://docs.nestjs.com/v10' };
    }
  }
}
```
