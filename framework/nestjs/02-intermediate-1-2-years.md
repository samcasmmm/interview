# 🟡 NestJS Interview Preparation — Intermediate Level (1–2 Years Experience)

> Comprehensive interview guide covering custom pipes, guards, interceptors, exception filters, JWT authentication, RBAC, dynamic modules, custom providers, TypeORM/Prisma integration, event emitter, testing, and API documentation.

---

## 📑 Table of Contents

- [Q01. What is a Custom Pipe and how do you implement the `PipeTransform` interface?](#q01-what-is-a-custom-pipe-and-how-do-you-implement-the-pipetransform-interface)
- [Q02. What are Guards (`CanActivate`) and how do they fundamentally differ from Express middleware?](#q02-what-are-guards-canactivate-and-how-do-they-fundamentally-differ-from-express-middleware)
- [Q03. How do you implement JWT authentication in NestJS using `@nestjs/jwt` and `@nestjs/passport`?](#q03-how-do-you-implement-jwt-authentication-in-nestjs-using-nestjsjwt-and-nestjspassport)
- [Q04. What is a Passport Strategy in NestJS and how do you extract and validate tokens?](#q04-what-is-a-passport-strategy-in-nestjs-and-how-do-you-extract-and-validate-tokens)
- [Q05. How do you implement Role-Based Access Control (RBAC) using `@SetMetadata`, `Reflector`, and a Custom Guard?](#q05-how-do-you-implement-role-based-access-control-rbac-using-setmetadata-reflector-and-a-custom-guard)
- [Q06. What is an Interceptor (`NestInterceptor`) and how does it leverage RxJS operators?](#q06-what-is-an-interceptor-nestinterceptor-and-how-does-it-leverage-rxjs-operators)
- [Q07. How do you build a Response Transform Interceptor to standardize JSON envelopes?](#q07-how-do-you-build-a-response-transform-interceptor-to-standardize-json-envelopes)
- [Q08. How do you build a Logging / Execution-Duration Interceptor?](#q08-how-do-you-build-a-logging--execution-duration-interceptor)
- [Q09. What is an Exception Filter and how do you implement a Custom Exception Filter?](#q09-what-is-an-exception-filter-and-how-do-you-implement-a-custom-exception-filter)
- [Q10. How do you catch all unhandled exceptions globally using an empty `@Catch()` decorator?](#q10-how-do-you-catch-all-unhandled-exceptions-globally-using-an-empty-catch-decorator)
- [Q11. What is the difference between `ExecutionContext` and `ArgumentsHost`?](#q11-what-is-the-difference-between-executioncontext-and-argumentshost)
- [Q12. How do you create Custom Parameter Decorators (e.g., `@CurrentUser()`) using `createParamDecorator`?](#q12-how-do-you-create-custom-parameter-decorators-eg-currentuser-using-createparamdecorator)
- [Q13. How do you combine multiple decorators using `applyDecorators`?](#q13-how-do-you-combine-multiple-decorators-using-applydecorators)
- [Q14. What are Dynamic Modules and how do you structure `forRoot()` or `register()`?](#q14-what-are-dynamic-modules-and-how-do-you-structure-forroot-or-register)
- [Q15. How do you validate environment variables using `@nestjs/config` and Joi or Zod?](#q15-how-do-you-validate-environment-variables-using-nestjsconfig-and-joi-or-zod)
- [Q16. How do you integrate TypeORM or Prisma with NestJS dependency injection?](#q16-how-do-you-integrate-typeorm-or-prisma-with-nestjs-dependency-injection)
- [Q17. How do you handle database transactions reliably in NestJS?](#q17-how-do-you-handle-database-transactions-reliably-in-nestjs)
- [Q18. How do you handle multipart file uploads using `FileInterceptor` and Multer?](#q18-how-do-you-handle-multipart-file-uploads-using-fileinterceptor-and-multer)
- [Q19. What is Circular Dependency between modules and services, and how do you resolve it with `forwardRef()`?](#q19-what-is-circular-dependency-between-modules-and-services-and-how-do-you-resolve-it-with-forwardref)
- [Q20. What are Custom Providers in NestJS (`useValue`, `useClass`, `useFactory`, `useExisting`)?](#q20-what-are-custom-providers-in-nestjs-usevalue-useclass-usefactory-useexisting)
- [Q21. How do you use asynchronous factory providers (`useFactory` with `async/await`)?](#q21-how-do-you-use-asynchronous-factory-providers-usefactory-with-asyncawait)
- [Q22. What are non-class Injection Tokens and how do you inject them using `@Inject()`?](#q22-what-are-non-class-injection-tokens-and-how-do-you-inject-them-using-inject)
- [Q23. What are Lifecycle Hooks in NestJS (`OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy`)?](#q23-what-are-lifecycle-hooks-in-nestjs-onmoduleinit-onapplicationbootstrap-onmoduledestroy)
- [Q24. How do you enable graceful application shutdown with `enableShutdownHooks()`?](#q24-how-do-you-enable-graceful-application-shutdown-with-enableshutdownhooks)
- [Q25. How do you implement reusable pagination, filtering, and sorting in REST APIs?](#q25-how-do-you-implement-reusable-pagination-filtering-and-sorting-in-rest-apis)
- [Q26. How do you generate Swagger / OpenAPI documentation using `@nestjs/swagger`?](#q26-how-do-you-generate-swagger--openapi-documentation-using-nestjsswagger)
- [Q27. How does `ClassSerializerInterceptor` with `@Exclude()` sanitize sensitive entity data?](#q27-how-does-classserializerinterceptor-with-exclude-sanitize-sensitive-entity-data)
- [Q28. How do you implement API Rate Limiting using `@nestjs/throttler`?](#q28-how-do-you-implement-api-rate-limiting-using-nestjsthrottler)
- [Q29. How do you schedule background Cron jobs and Intervals using `@nestjs/schedule`?](#q29-how-do-you-schedule-background-cron-jobs-and-intervals-using-nestjsschedule)
- [Q30. How do you decouple domain events using `@nestjs/event-emitter` (`EventEmitter2`)?](#q30-how-do-you-decouple-domain-events-using-nestjsevent-emitter-eventemitter2)
- [Q31. How do you write Unit Tests for NestJS services using `@nestjs/testing` and Jest mocks?](#q31-how-do-you-write-unit-tests-for-nestjs-services-using-nestjstesting-and-jest-mocks)
- [Q32. How do you write End-to-End (E2E) tests for NestJS controllers using `supertest`?](#q32-how-do-you-write-end-to-end-e2e-tests-for-nestjs-controllers-using-supertest)
- [Q33. How do you configure API Versioning in NestJS (`URI`, `HEADER`, `MEDIA_TYPE`)?](#q33-how-do-you-configure-api-versioning-in-nestjs-uri-header-media_type)
- [Q34. How do you build microservice/container Health Checks using `@nestjs/terminus`?](#q34-how-do-you-build-microservicecontainer-health-checks-using-nestjsterminus)

---

### Q01. What is a Custom Pipe and how do you implement the `PipeTransform` interface?

#### Answer:
A custom pipe is an `@Injectable()` class implementing the `PipeTransform<T, R>` interface. It must define a `transform(value: T, metadata: ArgumentMetadata): R` method:
- `value`: The incoming argument currently being processed.
- `metadata`: Contains information about the argument (`type: 'body' | 'query' | 'param' | 'custom'`, `metatype`, `data`).

#### Example:
```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class TrimStringPipe implements PipeTransform<any, any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      return value.trim();
    }
    if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach(key => {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
        }
      });
    }
    return value;
  }
}
```

---

### Q02. What are Guards (`CanActivate`) and how do they fundamentally differ from Express middleware?

#### Answer:
Guards are classes implementing `CanActivate`. They determine whether a given request will be handled by the route handler or rejected (returning `403 Forbidden` or `401 Unauthorized`).

**Difference from Express Middleware:**
1. **Context Awareness**: Middleware has no knowledge of which route handler, controller method, or metadata will execute next.
2. **Access to `ExecutionContext`**: Guards have access to the exact target class and method (`context.getClass()`, `context.getHandler()`), allowing them to inspect custom decorators and metadata (e.g. roles, permissions) via `Reflector`.
3. **Execution Point**: Guards run *after* all middleware, but *before* interceptors and pipes.

---

### Q03. How do you implement JWT authentication in NestJS using `@nestjs/jwt` and `@nestjs/passport`?

#### Answer:
JWT authentication in NestJS involves:
1. `JwtModule.register({ secret, signOptions: { expiresIn: '1h' } })` to sign tokens.
2. A `JwtStrategy` extending Passport's `PassportStrategy(Strategy)`.
3. An `AuthGuard('jwt')` protecting endpoints.

#### Example:
```typescript
// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'SECRET_KEY_123',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
```

---

### Q04. What is a Passport Strategy in NestJS and how do you extract and validate tokens?

#### Answer:
A Passport strategy class extends `PassportStrategy(Strategy, 'jwt')`. Its constructor configures token extraction from the `Authorization: Bearer <token>` header, and its `validate(payload)` method verifies the token payload and attaches the user to `req.user`.

#### Example:
```typescript
// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY_123',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token claims');
    }
    // Return value is automatically attached to req.user
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}
```

---

### Q05. How do you implement Role-Based Access Control (RBAC) using `@SetMetadata`, `Reflector`, and a Custom Guard?

#### Answer:
1. Define a `@Roles(...roles: string[])` decorator using `SetMetadata`.
2. Create a `RolesGuard` that extracts the required roles using `Reflector` and compares them with `req.user.roles`.

#### Example:
```typescript
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true; // No roles required

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}

// admin.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles('admin', 'superadmin')
  getDashboard() {
    return { secretData: 'Confidential statistics' };
  }
}
```

---

### Q06. What is an Interceptor (`NestInterceptor`) and how does it leverage RxJS operators?

#### Answer:
Interceptors implement `NestInterceptor` and wrap the execution flow using Aspect-Oriented Programming (AOP). They can:
- Bind extra logic before method execution.
- Transform the result returned by a function.
- Transform the exception thrown from a function.
- Extend function behavior (e.g. caching, timeout, logging).

They receive `ExecutionContext` and `CallHandler`. Calling `next.handle()` returns an RxJS `Observable` representing the controller response stream.

---

### Q07. How do you build a Response Transform Interceptor to standardize JSON envelopes?

#### Answer:
A response transform interceptor uses RxJS `map()` to wrap all successful controller responses in a uniform `{ statusCode, timestamp, data }` format.

#### Example:
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope<T> {
  statusCode: number;
  timestamp: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseEnvelope<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseEnvelope<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
}
```

---

### Q08. How do you build a Logging / Execution-Duration Interceptor?

#### Answer:
Using RxJS `tap()`, you can execute side effects before and after handler execution without altering the returned payload.

#### Example:
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - now;
        this.logger.log(`[${method}] ${url} +${elapsed}ms`);
      }),
    );
  }
}
```

---

### Q09. What is an Exception Filter and how do you implement a Custom Exception Filter?

#### Answer:
Exception filters catch unhandled exceptions thrown across the application and format custom client responses. They implement `ExceptionFilter<T>` and are decorated with `@Catch()`.

#### Example:
```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || exceptionResponse,
    });
  }
}
```

---

### Q10. How do you catch all unhandled exceptions globally using an empty `@Catch()` decorator?

#### Answer:
Leaving the `@Catch()` decorator empty without arguments causes the filter to intercept **every** exception thrown, whether it is an `HttpException`, a database connection error, a syntax error, or an unhandled Promise rejection.

#### Example:
```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    this.logger.error(`Exception on ${request.url}`, exception);

    response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
```

---

### Q11. What is the difference between `ExecutionContext` and `ArgumentsHost`?

#### Answer:
- **`ArgumentsHost`**: A general abstraction providing utility methods to extract request and response parameters for different transport protocols (`switchToHttp()`, `switchToWs()`, `switchToRpc()`). It is passed to Exception Filters.
- **`ExecutionContext`**: Extends `ArgumentsHost` by adding reflection methods:
  - `getClass<T>()`: Returns the controller class type handling the request.
  - `getHandler()`: Returns a reference to the specific route handler method.
  - `getType()`: Returns the application context type (`'http' | 'ws' | 'rpc'`).
  - Passed to Guards and Interceptors.

---

### Q12. How do you create Custom Parameter Decorators (e.g., `@CurrentUser()`) using `createParamDecorator`?

#### Answer:
`createParamDecorator` builds custom parameter annotations that extract and transform request attributes directly inside controller signatures.

#### Example:
```typescript
// current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

// profile.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return user;
  }

  @Get('email')
  getEmail(@CurrentUser('email') email: string) {
    return { email };
  }
}
```

---

### Q13. How do you combine multiple decorators using `applyDecorators`?

#### Answer:
`applyDecorators` aggregates multiple decorators into a single reusable custom decorator, drastically reducing boilerplate across controller endpoints.

#### Example:
```typescript
// auth.decorator.ts
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
}

// controller usage:
@Controller('orders')
export class OrdersController {
  @Get()
  @Auth('admin', 'manager') // Replaces 3 separate decorator annotations
  findAll() {
    return [];
  }
}
```

---

### Q14. What are Dynamic Modules and how do you structure `forRoot()` or `register()`?

#### Answer:
A **Dynamic Module** is a module whose imports, providers, or configuration can be customized dynamically at consumption time.
It defines a static method returning a `DynamicModule` object containing `module`, `providers`, `exports`, etc.

#### Example:
```typescript
import { DynamicModule, Module } from '@nestjs/common';

export interface MailerOptions {
  apiKey: string;
  senderEmail: string;
}

@Module({})
export class MailerModule {
  static register(options: MailerOptions): DynamicModule {
    return {
      module: MailerModule,
      providers: [
        {
          provide: 'MAILER_CONFIG',
          useValue: options,
        },
        MailerService,
      ],
      exports: [MailerService],
    };
  }
}
```

---

### Q15. How do you validate environment variables using `@nestjs/config` and Joi or Zod?

#### Answer:
Using schema validation prevents the application from starting if mandatory environment variables are missing or incorrectly formatted.

#### Example (using Joi):
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().min(16).required(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
})
export class AppModule {}
```

---

### Q16. How do you integrate TypeORM or Prisma with NestJS dependency injection?

#### Answer:
- **TypeORM**: Uses `TypeOrmModule.forRootAsync()` and `TypeOrmModule.forFeature([Entity])`, allowing direct injection with `@InjectRepository(Entity) private repo: Repository<Entity>`.
- **Prisma**: Managed by creating a custom `@Injectable()` `PrismaService` extending `PrismaClient` and implementing `OnModuleInit`.

#### Example (Prisma Service):
```typescript
// prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

---

### Q17. How do you handle database transactions reliably in NestJS?

#### Answer:
- **TypeORM**: Use `DataSource.transaction()` or QueryRunner.
- **Prisma**: Use `prisma.$transaction(async (tx) => { ... })`.

#### Example (Prisma Interactive Transaction):
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async transferFunds(fromUserId: string, toUserId: string, amount: number) {
    return this.prisma.$transaction(async (tx) => {
      const sender = await tx.account.update({
        where: { userId: fromUserId },
        data: { balance: { decrement: amount } },
      });

      if (sender.balance < 0) {
        throw new Error('Insufficient funds');
      }

      const receiver = await tx.account.update({
        where: { userId: toUserId },
        data: { balance: { increment: amount } },
      });

      return { sender, receiver };
    });
  }
}
```

---

### Q18. How do you handle multipart file uploads using `FileInterceptor` and Multer?

#### Answer:
Nest provides `@UseInterceptors(FileInterceptor('fieldName', multerOptions))` to parse incoming `multipart/form-data` and inject the file object using `@UploadedFile()`.

#### Example:
```typescript
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
```

---

### Q19. What is Circular Dependency between modules and services, and how do you resolve it with `forwardRef()`?

#### Answer:
Circular dependency occurs when Class A depends on Class B, and Class B simultaneously depends on Class A.
Because both classes need the other to be instantiated first, Nest will throw an `Undefined Dependency` error during bootstrap.

**Solution**:
Wrap the dependency with `forwardRef(() => DependencyClass)` on both sides (in `@Module()` imports and in constructor `@Inject(forwardRef(() => ...))`).

#### Example:
```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
  ) {}
}

// orders.service.ts
@Injectable()
export class OrdersService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}
}
```

---

### Q20. What are Custom Providers in NestJS (`useValue`, `useClass`, `useFactory`, `useExisting`)?

#### Answer:
Nest allows declaring custom providers using object literals instead of shorthand class names:
1. `useValue`: Injects a constant value, configuration object, or mock test instance.
2. `useClass`: Dynamically selects which class to instantiate based on environment or condition.
3. `useFactory`: Creates a provider dynamically using a factory function with injectable dependencies.
4. `useExisting`: Creates an alias for an already registered provider.

#### Example:
```typescript
const connectionProvider = {
  provide: 'DB_CONNECTION',
  useValue: { host: 'localhost', port: 5432 },
};

const serviceProvider = {
  provide: 'LOGGING_SERVICE',
  useClass: process.env.NODE_ENV === 'production' ? CloudWatchLogger : ConsoleLogger,
};
```

---

### Q21. How do you use asynchronous factory providers (`useFactory` with `async/await`)?

#### Answer:
An asynchronous provider uses `useFactory` that returns a `Promise`. Nest will defer completing application bootstrap until the Promise resolves, ensuring downstream dependencies receive a ready connection.

#### Example:
```typescript
export const databaseConnectionProvider = {
  provide: 'ASYNC_DB_CONNECTION',
  useFactory: async (configService: ConfigService) => {
    const host = configService.get<string>('DB_HOST');
    const client = new DatabaseClient({ host });
    await client.connect(); // Application awaits this connection
    return client;
  },
  inject: [ConfigService],
};
```

---

### Q22. What are non-class Injection Tokens and how do you inject them using `@Inject()`?

#### Answer:
When a provider does not use a TypeScript class as its token (e.g. string literals, Symbols), the DI container cannot infer the type via TypeScript reflection. 
You must explicitly use `@Inject(TOKEN)` in constructor parameters.

#### Example:
```typescript
export const API_KEY_TOKEN = Symbol('API_KEY');

@Injectable()
export class PaymentService {
  constructor(@Inject(API_KEY_TOKEN) private readonly apiKey: string) {}

  process() {
    console.log(`Processing with API Key: ${this.apiKey}`);
  }
}
```

---

### Q23. What are Lifecycle Hooks in NestJS (`OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy`)?

#### Answer:
Nest offers lifecycle hooks to execute logic at critical stages:
- **Initialization**:
  1. `onModuleInit()`: Called after the module's dependencies have resolved.
  2. `onApplicationBootstrap()`: Called after all modules are initialized, before listening for connections.
- **Termination**:
  1. `onModuleDestroy()`: Called after cleanup signal is received.
  2. `beforeApplicationShutdown()`: Called before the app closes connections.
  3. `onApplicationShutdown()`: Called when the application closes.

#### Example:
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    console.log('Connecting to Redis cluster...');
  }

  async onModuleDestroy() {
    console.log('Flushing Redis cache and terminating connections...');
  }
}
```

---

### Q24. How do you enable graceful application shutdown with `enableShutdownHooks()`?

#### Answer:
By default, Node.js process termination signals (`SIGINT`, `SIGTERM`) kill the process immediately without running NestJS teardown hooks.
Calling `app.enableShutdownHooks()` tells Nest to listen for termination signals and trigger `onModuleDestroy` and `beforeApplicationShutdown`.

#### Example:
```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Starts listening for SIGTERM, SIGINT
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
```

---

### Q25. How do you implement reusable pagination, filtering, and sorting in REST APIs?

#### Answer:
Create reusable pagination DTOs using `class-validator` and `class-transformer` with numeric limits and defaults.

#### Example:
```typescript
// pagination.dto.ts
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
```

---

### Q26. How do you generate Swagger / OpenAPI documentation using `@nestjs/swagger`?

#### Answer:
1. Install `@nestjs/swagger`.
2. Initialize `SwaggerModule.createDocument()` and `SwaggerModule.setup('api/docs', app, document)` in `main.ts`.
3. Annotate DTOs with `@ApiProperty()` and controllers with `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()`.

#### Example:
```typescript
// main.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('E-Commerce API')
  .setDescription('API documentation for E-Commerce platform')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

---

### Q27. How does `ClassSerializerInterceptor` with `@Exclude()` sanitize sensitive entity data?

#### Answer:
Using `ClassSerializerInterceptor` combined with `class-transformer` decorators ensures that sensitive fields (like password hashes or internal IDs) are automatically omitted from JSON serialization.

#### Example:
```typescript
// user.entity.ts
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  name: string;
  email: string;

  @Exclude() // Stripped from response JSON
  passwordHash: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

// In controller:
@UseInterceptors(ClassSerializerInterceptor)
@Get(':id')
getUser() {
  return new UserEntity({ id: '1', name: 'John', email: 'j@e.com', passwordHash: 'secret' });
}
```

---

### Q28. How do you implement API Rate Limiting using `@nestjs/throttler`?

#### Answer:
`@nestjs/throttler` protects APIs against brute force and DDoS attacks by enforcing request rate limits per client IP.

#### Example:
```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds
      limit: 10,  // max 10 requests per ttl per IP
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

---

### Q29. How do you schedule background Cron jobs and Intervals using `@nestjs/schedule`?

#### Answer:
Install `@nestjs/schedule`, import `ScheduleModule.forRoot()`, and annotate service methods with `@Cron()`, `@Interval()`, or `@Timeout()`.

#### Example:
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  // Runs every midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  generateDailySummary() {
    this.logger.log('Generating daily analytics report...');
  }
}
```

---

### Q30. How do you decouple domain events using `@nestjs/event-emitter` (`EventEmitter2`)?

#### Answer:
The Event Emitter pattern decouples business logic. When an event occurs (e.g. `user.created`), the publisher emits an event, and one or more independent listeners handle tasks like sending emails or notifications asynchronously.

#### Example:
```typescript
// 1. Event definition
export class UserRegisteredEvent {
  constructor(public readonly email: string, public readonly userId: string) {}
}

// 2. Publisher
@Injectable()
export class UsersService {
  constructor(private eventEmitter: EventEmitter2) {}

  async registerUser(email: string) {
    const user = { id: 'u101', email };
    this.eventEmitter.emit('user.registered', new UserRegisteredEvent(user.email, user.id));
    return user;
  }
}

// 3. Subscriber / Listener
@Injectable()
export class WelcomeEmailListener {
  @OnEvent('user.registered')
  async handleUserRegistered(event: UserRegisteredEvent) {
    console.log(`Sending welcome email to ${event.email}`);
  }
}
```

---

### Q31. How do you write Unit Tests for NestJS services using `@nestjs/testing` and Jest mocks?

#### Answer:
Use `Test.createTestingModule()` to build an isolated Nest DI environment with mocked dependencies.

#### Example:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

const mockUserRepository = {
  findOne: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should return user by id', async () => {
    mockUserRepository.findOne.mockResolvedValue({ id: '1', name: 'Alice' });
    const user = await service.findById('1');
    expect(user.name).toEqual('Alice');
    expect(mockUserRepository.findOne).toHaveBeenCalledWith('1');
  });
});
```

---

### Q32. How do you write End-to-End (E2E) tests for NestJS controllers using `supertest`?

#### Answer:
E2E tests bootstrap the complete NestJS application instance using `Test.createTestingModule` and simulate real HTTP requests via `supertest`.

#### Example:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
```

---

### Q33. How do you configure API Versioning in NestJS (`URI`, `HEADER`, `MEDIA_TYPE`)?

#### Answer:
Enable versioning in `main.ts` using `app.enableVersioning()`, then annotate controllers or methods with `@Version('1')`.

#### Example:
```typescript
// main.ts
app.enableVersioning({
  type: VersioningType.URI, // URLs will look like: /v1/users
});

// users.controller.ts
@Controller('users')
export class UsersController {
  @Version('1')
  @Get()
  findAllV1() { return ['User V1']; }

  @Version('2')
  @Get()
  findAllV2() { return [{ id: 1, name: 'User V2' }]; }
}
```

---

### Q34. How do you build microservice/container Health Checks using `@nestjs/terminus`?

#### Answer:
`@nestjs/terminus` provides production-grade health indicators for Kubernetes liveness and readiness probes (checking DB, Redis, Disk, Memory).

#### Example:
```typescript
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024), // 150MB
    ]);
  }
}
```
