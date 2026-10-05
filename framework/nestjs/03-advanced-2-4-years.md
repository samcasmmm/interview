# 🟠 NestJS Interview Preparation — Advanced Level (2–4 Years Experience)

> Advanced interview guide covering Provider Scopes & DI graph mechanics, Microservices (Kafka/RabbitMQ/Redis), WebSockets & SSE, BullMQ job queues, CQRS & Sagas, AsyncLocalStorage context propagation, Redis caching, gRPC, distributed locks, and architectural patterns.

---

## 📑 Table of Contents

- [Q01. What are Provider Scopes (`DEFAULT`, `REQUEST`, `TRANSIENT`) and what is the performance impact of `Scope.REQUEST`?](#q01-what-are-provider-scopes-default-request-transient-and-what-is-the-performance-impact-of-scoperequest)
- [Q02. How does Request-scope bubble up through the NestJS dependency graph?](#q02-how-does-request-scope-bubble-up-through-the-nestjs-dependency-graph)
- [Q03. How do you implement Multi-Tenancy in NestJS without sacrificing throughput?](#q03-how-do-you-implement-multi-tenancy-in-nestjs-without-sacrificing-throughput)
- [Q04. What is the architectural difference between NestJS HTTP servers and NestJS Microservices?](#q04-what-is-the-architectural-difference-between-nestjs-http-servers-and-nestjs-microservices)
- [Q05. How do `@MessagePattern()` and `@EventPattern()` differ across transport brokers?](#q05-how-do-messagepattern-and-eventpattern-differ-across-transport-brokers)
- [Q06. How do you implement a `ClientProxy` to communicate asynchronously with a RabbitMQ or Redis microservice?](#q06-how-do-you-implement-a-clientproxy-to-communicate-asynchronously-with-a-rabbitmq-or-redis-microservice)
- [Q07. How do you build a real-time WebSockets Gateway using `@WebSocketGateway()` and Socket.IO?](#q07-how-do-you-build-a-real-time-websockets-gateway-using-websocketgateway-and-socketio)
- [Q08. How do you authenticate and secure WebSocket connections using Guards and connection handshakes?](#q08-how-do-you-authenticate-and-secure-websocket-connections-using-guards-and-connection-handshakes)
- [Q09. How do you implement Server-Sent Events (SSE) in NestJS using `@Sse()` and RxJS Observables?](#q09-how-do-you-implement-server-sent-events-sse-in-nestjs-using-sse-and-rxjs-observables)
- [Q10. How do you configure Redis caching with `@nestjs/cache-manager` and custom cache keys?](#q10-how-do-you-configure-redis-caching-with-nestjscache-manager-and-custom-cache-keys)
- [Q11. How do you implement distributed background job processing with `@nestjs/bullmq`?](#q11-how-do-you-implement-distributed-background-job-processing-with-nestjsbullmq)
- [Q12. How do you handle job retries, exponential backoff, progress tracking, and failure alerts in BullMQ?](#q12-how-do-you-handle-job-retries-exponential-backoff-progress-tracking-and-failure-alerts-in-bullmq)
- [Q13. What is CQRS (Command Query Responsibility Segregation) and how is it implemented with `@nestjs/cqrs`?](#q13-what-is-cqrs-command-query-responsibility-segregation-and-how-is-it-implemented-with-nestjscqrs)
- [Q14. What are Sagas in `@nestjs/cqrs` and how do they coordinate complex distributed workflows with RxJS?](#q14-what-are-sagas-in-nestjscqrs-and-how-do-they-coordinate-complex-distributed-workflows-with-rxjs)
- [Q15. How do you implement Distributed Tracing and Correlation ID propagation using `AsyncLocalStorage`?](#q15-how-do-you-implement-distributed-tracing-and-correlation-id-propagation-using-asynclocalstorage)
- [Q16. How do you implement fine-grained Attribute-Based Access Control (ABAC) using CASL in NestJS?](#q16-how-do-you-implement-fine-grained-attribute-based-access-control-abac-using-casl-in-nestjs)
- [Q17. What is Lazy Loading Modules using `LazyModuleLoader` and when should you adopt it?](#q17-what-is-lazy-loading-modules-using-lazymoduleloader-and-when-should-you-adopt-it)
- [Q18. How do you configure database read-write replica splitting and connection pooling in NestJS?](#q18-how-do-you-configure-database-read-write-replica-splitting-and-connection-pooling-in-nestjs)
- [Q19. How do you implement Distributed Locking (Redlock) in NestJS to prevent race conditions?](#q19-how-do-you-implement-distributed-locking-redlock-in-nestjs-to-prevent-race-conditions)
- [Q20. How do you organize enterprise codebases using NestJS Monorepo Workspaces (`nest g app` / `nest g lib`)?](#q20-how-do-you-organize-enterprise-codebases-using-nestjs-monorepo-workspaces-nest-g-app--nest-g-lib)
- [Q21. How do you create configurable dynamic libraries using `ConfigurableModuleBuilder`?](#q21-how-do-you-create-configurable-dynamic-libraries-using-configurablemodulebuilder)
- [Q22. How do you implement high-performance gRPC services in NestJS using Protocol Buffers?](#q22-how-do-you-implement-high-performance-grpc-services-in-nestjs-using-protocol-buffers)
- [Q23. How does gRPC streaming (Client, Server, Bi-directional) work in NestJS?](#q23-how-does-grpc-streaming-client-server-bi-directional-work-in-nestjs)
- [Q24. How do you implement an API Idempotency Interceptor using Redis?](#q24-how-do-you-implement-an-api-idempotency-interceptor-using-redis)
- [Q25. How do you implement the Transactional Outbox Pattern in NestJS to ensure reliable message delivery?](#q25-how-do-you-implement-the-transactional-outbox-pattern-in-nestjs-to-ensure-reliable-message-delivery)
- [Q26. How do you mock microservice message clients (`ClientProxy`) in integration and E2E tests?](#q26-how-do-you-mock-microservice-message-clients-clientproxy-in-integration-and-e2e-tests)
- [Q27. What are `DiscoveryService` and `MetadataScanner` in `@nestjs/core`, and how do you build custom decorators?](#q27-what-are-discoveryservice-and-metadatascanner-in-nestjscore-and-how-do-you-build-custom-decorators)
- [Q28. How do you implement Circuit Breakers and Timeouts using RxJS operators in NestJS controllers?](#q28-how-do-you-implement-circuit-breakers-and-timeouts-using-rxjs-operators-in-nestjs-controllers)
- [Q29. How do you build an Audit Logging Interceptor capturing DB diffs and user actors?](#q29-how-do-you-build-an-audit-logging-interceptor-capturing-db-diffs-and-user-actors)
- [Q30. How do you implement Session-based stateful authentication with Redis in NestJS?](#q30-how-do-you-implement-session-based-stateful-authentication-with-redis-in-nestjs)
- [Q31. How do you harden NestJS against web security vulnerabilities (Helmet, CSRF, Parameter Pollution)?](#q31-how-do-you-harden-nestjs-against-web-security-vulnerabilities-helmet-csrf-parameter-pollution)
- [Q32. How do you diagnose and debug memory leaks in NestJS production microservices?](#q32-how-do-you-diagnose-and-debug-memory-leaks-in-nestjs-production-microservices)
- [Q33. What is the difference between synchronous HTTP communication and asynchronous message broker patterns in NestJS?](#q33-what-is-the-difference-between-synchronous-http-communication-and-asynchronous-message-broker-patterns-in-nestjs)
- [Q34. How do you implement custom validation rules using `registerDecorator` in `class-validator`?](#q34-how-do-you-implement-custom-validation-rules-using-registerdecorator-in-class-validator)

---

### Q01. What are Provider Scopes (`DEFAULT`, `REQUEST`, `TRANSIENT`) and what is the performance impact of `Scope.REQUEST`?

#### Answer:
NestJS provides three provider lifecycle scopes:
1. `Scope.DEFAULT` (Singleton):
   - One single instance is created during application startup and cached across all incoming requests and consumers.
   - Recommended for almost all providers due to zero runtime instantiation overhead and minimal memory usage.
2. `Scope.REQUEST`:
   - A **new instance** is created exclusively for each incoming request and garbage collected after response completion.
   - **Severe Performance Impact**: Creating thousands of object instances per second dramatically increases garbage collection pressure, degrades throughput (often by 50–70%), and bubbles up the entire dependency graph.
3. `Scope.TRANSIENT`:
   - A dedicated instance is created for each provider that injects it. It is not shared across consumers.

#### Example:
```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
  private timestamp = Date.now();
  getTimestamp() { return this.timestamp; }
}
```

---

### Q02. How does Request-scope bubble up through the NestJS dependency graph?

#### Answer:
Scope "bubbles up" the dependency chain. If a Singleton Service `A` injects a Request-Scoped Service `B`, Service `A` automatically becomes **Request-Scoped** as well. Any Controller that injects Service `A` will also be re-instantiated for every request.
- This propagation cannot be suppressed because a persistent singleton cannot hold an instance that changes with every HTTP request.
- **Architectural Remedy**: Use Node's `AsyncLocalStorage` to store per-request context (user, tenant, correlation ID) inside a singleton service instead of making the service request-scoped.

---

### Q03. How do you implement Multi-Tenancy in NestJS without sacrificing throughput?

#### Answer:
Instead of making services and database connections Request-Scoped, multi-tenancy should be architected using:
1. Singletons holding a tenant-aware connection pool cache or map.
2. An interceptor/middleware that extracts `x-tenant-id` from headers and stores it in `AsyncLocalStorage`.
3. Repositories querying tenant schemas or applying a tenant filter (`where: { tenantId }`).

#### Example:
```typescript
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export const tenantStorage = new AsyncLocalStorage<string>();

@Injectable()
export class TenantAwareRepository {
  getTenantId(): string {
    const tenantId = tenantStorage.getStore();
    if (!tenantId) throw new Error('Tenant context missing');
    return tenantId;
  }

  async findOrders() {
    const tenantId = this.getTenantId();
    // Reuses singleton DB connection pool with tenant isolation:
    return db.query('SELECT * FROM orders WHERE tenant_id = $1', [tenantId]);
  }
}
```

---

### Q04. What is the architectural difference between NestJS HTTP servers and NestJS Microservices?

#### Answer:
- **HTTP Applications (`NestFactory.create`)**:
  - Expose traditional REST, GraphQL, or WebSocket ports over HTTP/1.1 or HTTP/2.
  - Rely on synchronous request-response semantics.
- **Microservices (`NestFactory.createMicroservice`)**:
  - Listen on message brokers or RPC transports (Redis, RabbitMQ, Kafka, NATS, gRPC, MQTT, TCP).
  - Abstract network transport protocols behind unified `@MessagePattern()` and `@EventPattern()` decorators.
  - Support both request-response (via message correlation IDs) and fire-and-forget event pub/sub.

---

### Q05. How do `@MessagePattern()` and `@EventPattern()` differ across transport brokers?

#### Answer:
- `@MessagePattern(pattern)`:
  - **Request-Response** pattern.
  - The sender expects an explicit return value.
  - Behind the scenes, Nest creates a reply queue or correlation identifier (e.g. RabbitMQ reply-to header) and waits for response resolution.
- `@EventPattern(pattern)`:
  - **Event-Driven / Pub-Sub** pattern (Fire-and-forget).
  - The handler does not send a response back to the publisher.
  - Optimized for high throughput, notifications, telemetry, and distributed choreography.

#### Example:
```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

@Controller()
export class OrdersMicroserviceController {
  // Request-Response
  @MessagePattern('orders.calculate_tax')
  calculateTax(@Payload() data: { amount: number }) {
    return { tax: data.amount * 0.18 };
  }

  // Event (Fire-and-forget)
  @EventPattern('orders.created')
  handleOrderCreated(@Payload() order: any) {
    console.log(`Order ${order.id} received, triggering email notification`);
  }
}
```

---

### Q06. How do you implement a `ClientProxy` to communicate asynchronously with a RabbitMQ or Redis microservice?

#### Answer:
A `ClientProxy` is injected via `ClientsModule.register()` or `ClientsModule.registerAsync()`.
- Use `client.send(pattern, data)` for Request-Response (returns an RxJS `Observable`).
- Use `client.emit(pattern, data)` for Events (returns an RxJS `Observable` that completes upon dispatch).

#### Example:
```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CheckoutService } from './checkout.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'payments_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [CheckoutService],
})
export class AppModule {}

// checkout.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueOf } from 'rxjs';

@Injectable()
export class CheckoutService {
  constructor(@Inject('PAYMENT_SERVICE') private client: ClientProxy) {}

  async processPayment(orderId: string, amount: number) {
    // Request-Response via RabbitMQ
    return firstValueOf(
      this.client.send({ cmd: 'process_charge' }, { orderId, amount }),
    );
  }

  notifyShipping(orderId: string) {
    // Fire-and-forget event
    this.client.emit('order.ready_for_shipping', { orderId });
  }
}
```

---

### Q07. How do you build a real-time WebSockets Gateway using `@WebSocketGateway()` and Socket.IO?

#### Answer:
Install `@nestjs/websockets` and `@nestjs/platform-socket.io`. Annotate a class with `@WebSocketGateway()`, implement connection lifecycle hooks, and use `@SubscribeMessage()` to handle client events.

#### Example:
```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() payload: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Broadcast to room
    this.server.to(payload.room).emit('newMessage', {
      sender: client.id,
      text: payload.message,
    });
    return { status: 'delivered' };
  }
}
```

---

### Q08. How do you authenticate and secure WebSocket connections using Guards and connection handshakes?

#### Answer:
In WebSockets, token authentication is performed during the handshake query or `auth` header. Guards can access `context.switchToWs().getClient()` to verify JWT claims and disconnect unauthorized sockets.

#### Example:
```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      throw new WsException('Missing authentication token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload; // Attach to socket session
      return true;
    } catch {
      throw new WsException('Invalid authentication credentials');
    }
  }
}
```

---

### Q09. How do you implement Server-Sent Events (SSE) in NestJS using `@Sse()` and RxJS Observables?

#### Answer:
SSE provides unidirectional HTTP streaming from server to client. In NestJS, a route handler decorated with `@Sse('path')` returns an `Observable<MessageEvent>`.

#### Example:
```typescript
import { Controller, Sse } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

@Controller('stream')
export class StreamController {
  @Sse('ticks')
  sendEvents(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((count) => ({
        data: { message: 'Heartbeat tick', tick: count, timestamp: new Date() },
      })),
    );
  }
}
```

---

### Q10. How do you configure Redis caching with `@nestjs/cache-manager` and custom cache keys?

#### Answer:
1. Install `@nestjs/cache-manager`, `cache-manager`, and `cache-manager-redis-yet`.
2. Configure `CacheModule.registerAsync()` in `AppModule`.
3. Use `@UseInterceptors(CacheInterceptor)` and `@CacheKey('custom_key')` or inject `CACHE_MANAGER`.

#### Example:
```typescript
import { Module } from '@nestjs/common';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: { host: 'localhost', port: 6379 },
          ttl: 60 * 1000, // 60 seconds
        }),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
```

---

### Q11. How do you implement distributed background job processing with `@nestjs/bullmq`?

#### Answer:
BullMQ provides Redis-backed distributed queues. 
- Producer injects `@InjectQueue('name')` and calls `queue.add('jobName', payload)`.
- Consumer creates a class with `@Processor('name')` and `@Process('jobName')`.

#### Example:
```typescript
// 1. Module setup
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: { host: 'localhost', port: 6379 },
    }),
    BullModule.registerQueue({ name: 'email-queue' }),
  ],
})
export class EmailModule {}

// 2. Processor
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('email-queue')
export class EmailProcessor extends WorkerHost {
  async process(job: Job<{ email: string; template: string }>): Promise<any> {
    console.log(`Processing email job ${job.id} for ${job.data.email}`);
    // Simulate email dispatch
    await new Promise(res => setTimeout(res, 500));
    return { sent: true };
  }
}
```

---

### Q12. How do you handle job retries, exponential backoff, progress tracking, and failure alerts in BullMQ?

#### Answer:
Configure `attempts` and `backoff` options when adding a job to the queue, and use lifecycle listeners (`@OnWorkerEvent('failed')`, `@OnWorkerEvent('completed')`).

#### Example:
```typescript
// Adding job with exponential backoff:
await this.emailQueue.add('sendWelcome', data, {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 2000, // 2s, 4s, 8s, 16s...
  },
  removeOnComplete: true,
  removeOnFail: false,
});

// Listener
@Processor('email-queue')
export class EmailProcessor extends WorkerHost {
  async process(job: Job) {
    await job.updateProgress(50);
    // Work...
    await job.updateProgress(100);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(`Job ${job.id} failed after ${job.attemptsMade} attempts: ${err.message}`);
  }
}
```

---

### Q13. What is CQRS (Command Query Responsibility Segregation) and how is it implemented with `@nestjs/cqrs`?

#### Answer:
CQRS separates write operations (**Commands**) from read operations (**Queries**).
- **Commands**: Alter state, do not return entity views. Handled by `ICommandHandler`.
- **Queries**: Read state, never alter data. Handled by `IQueryHandler`.
- Managed via `CommandBus` and `QueryBus`.

#### Example:
```typescript
// Command
export class CreateOrderCommand {
  constructor(public readonly customerId: string, public readonly amount: number) {}
}

// Handler
@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(private orderRepo: OrderRepository, private eventPublisher: EventPublisher) {}

  async execute(command: CreateOrderCommand) {
    const { customerId, amount } = command;
    const order = await this.orderRepo.create({ customerId, amount });
    return order.id;
  }
}

// Controller usage
@Controller('orders')
export class OrdersController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.commandBus.execute(new CreateOrderCommand(dto.customerId, dto.amount));
  }
}
```

---

### Q14. What are Sagas in `@nestjs/cqrs` and how do they coordinate complex distributed workflows with RxJS?

#### Answer:
A Saga is a long-running process that listens to domain events and dispatches new commands in response, orchestrating multi-step distributed transactions using RxJS stream operators (`ofType`, `map`, `mergeMap`).

#### Example:
```typescript
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { OrderCreatedEvent } from './events/order-created.event';
import { DispatchNotificationCommand } from './commands/dispatch-notification.command';

@Injectable()
export class OrderSagas {
  @Saga()
  orderCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OrderCreatedEvent),
      delay(1000),
      map((event) => {
        console.log(`Saga triggered for order: ${event.orderId}`);
        return new DispatchNotificationCommand(event.orderId);
      }),
    );
  };
}
```

---

### Q15. How do you implement Distributed Tracing and Correlation ID propagation using `AsyncLocalStorage`?

#### Answer:
`AsyncLocalStorage` (Node.js core) binds state (like `correlationId` or `traceId`) to the current asynchronous execution context without passing it explicitly through every function call.

#### Example:
```typescript
// trace-context.service.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const traceStorage = new AsyncLocalStorage<Map<string, string>>();

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
    res.setHeader('x-correlation-id', correlationId);

    const store = new Map<string, string>();
    store.set('correlationId', correlationId);

    traceStorage.run(store, () => next());
  }
}

// Any deeply nested service:
@Injectable()
export class AnyService {
  log(message: string) {
    const traceId = traceStorage.getStore()?.get('correlationId');
    console.log(`[TraceID: ${traceId}] ${message}`);
  }
}
```

---

### Q16. How do you implement fine-grained Attribute-Based Access Control (ABAC) using CASL in NestJS?

#### Answer:
CASL defines permissions as abilities (`can(action, subject, condition)`). A guard evaluates whether the authenticated user has permission to perform a specific action on a specific resource instance.

#### Example:
```typescript
import { AbilityBuilder, createMongoAbility, PureAbility } from '@casl/ability';

export enum Action {
  Manage = 'manage',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export class Article {
  id: string;
  isPublished: boolean;
  authorId: string;
}

export function defineAbilityFor(user: { id: string; role: string }) {
  const { can, cannot, build } = new AbilityBuilder<PureAbility>();

  if (user.role === 'admin') {
    can(Action.Manage, 'all');
  } else {
    can(Action.Read, Article, { isPublished: true });
    can(Action.Update, Article, { authorId: user.id }); // Can only update own articles
  }

  return build();
}
```

---

### Q17. What is Lazy Loading Modules using `LazyModuleLoader` and when should you adopt it?

#### Answer:
By default, Nest loads all modules into memory at bootstrap. `LazyModuleLoader` dynamically loads a module only when its functionality is invoked.
- **Benefits**: Cuts cold-start time in AWS Lambda / serverless functions and reduces baseline memory footprint.
- **Use Cases**: Heavy background job handlers, infrequently used export routines, admin reporting modules.

#### Example:
```typescript
import { Injectable } from '@nestjs/common';
import { LazyModuleLoader } from '@nestjs/core';

@Injectable()
export class ReportsService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}

  async generatePdfReport() {
    const { HeavyPdfModule } = await import('./heavy-pdf.module');
    const moduleRef = await this.lazyModuleLoader.load(() => HeavyPdfModule);
    const { PdfGeneratorService } = await import('./pdf-generator.service');
    const pdfService = moduleRef.get(PdfGeneratorService);
    return pdfService.render();
  }
}
```

---

### Q18. How do you configure database read-write replica splitting and connection pooling in NestJS?

#### Answer:
In TypeORM or Prisma, configure connection replication options:
- Primary / Master instance handles write queries (`INSERT`, `UPDATE`, `DELETE`).
- Replicas handle read queries (`SELECT`).

#### Example (TypeORM configuration):
```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  replication: {
    master: {
      host: 'master.db.internal',
      port: 5432,
      username: 'pg_user',
      password: 'password',
      database: 'production_db',
    },
    slaves: [
      {
        host: 'replica1.db.internal',
        port: 5432,
        username: 'pg_user',
        password: 'password',
        database: 'production_db',
      },
      {
        host: 'replica2.db.internal',
        port: 5432,
        username: 'pg_user',
        password: 'password',
        database: 'production_db',
      },
    ],
  },
  extra: {
    max: 20, // Max connection pool per pod
    connectionTimeoutMillis: 5000,
  },
});
```

---

### Q19. How do you implement Distributed Locking (Redlock) in NestJS to prevent race conditions?

#### Answer:
When multiple server replicas run scheduled jobs or process payments concurrently, in-memory locks fail. A distributed lock using Redis (Redlock) guarantees single-execution across all application instances.

#### Example:
```typescript
import { Injectable } from '@nestjs/common';
import Redlock from 'redlock';
import Redis from 'ioredis';

@Injectable()
export class LockService {
  private redlock: Redlock;

  constructor() {
    const client = new Redis({ host: 'localhost', port: 6379 });
    this.redlock = new Redlock([client], { retryCount: 3, retryDelay: 200 });
  }

  async runWithLock<T>(resourceKey: string, ttlMs: number, task: () => Promise<T>): Promise<T> {
    const lock = await this.redlock.acquire([`locks:${resourceKey}`], ttlMs);
    try {
      return await task();
    } finally {
      await lock.release();
    }
  }
}
```

---

### Q20. How do you organize enterprise codebases using NestJS Monorepo Workspaces (`nest g app` / `nest g lib`)?

#### Answer:
Nest CLI supports multi-project workspaces managed through a single `nest-cli.json` and root `package.json`:
- Applications live in `apps/<app-name>` (e.g. `api-gateway`, `auth-service`).
- Shared libraries live in `libs/<lib-name>` (e.g. `common`, `database`, `contracts`).
- TypeScript path mapping (`@app/common`) enables clean imports across apps without publishing npm packages.

---

### Q21. How do you create configurable dynamic libraries using `ConfigurableModuleBuilder`?

#### Answer:
`ConfigurableModuleBuilder` (introduced in NestJS 9) eliminates hundreds of lines of boilerplate required for async dynamic module registration (`forRoot`, `forRootAsync`, `inject`, `useFactory`).

#### Example:
```typescript
// storage.module-definition.ts
import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface StorageOptions {
  bucket: string;
  region: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<StorageOptions>().build();

// storage.module.ts
import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './storage.module-definition';
import { StorageService } from './storage.service';

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule extends ConfigurableModuleClass {}

// Consumer simply uses:
// StorageModule.register({ bucket: 'my-bucket', region: 'us-east-1' })
// or StorageModule.registerAsync({ ... })
```

---

### Q22. How do you implement high-performance gRPC services in NestJS using Protocol Buffers?

#### Answer:
NestJS supports gRPC using `@nestjs/microservices` and `@grpc/grpc-js`. Route handlers use `@GrpcMethod('ServiceName', 'MethodName')`.

#### Example:
```typescript
// hero.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface HeroById { id: number; }
interface Hero { id: number; name: string; }

@Controller()
export class HeroController {
  @GrpcMethod('HeroService', 'FindOne')
  findOne(data: HeroById): Hero {
    const items = [
      { id: 1, name: 'Superman' },
      { id: 2, name: 'Batman' },
    ];
    return items.find((u) => u.id === data.id) || { id: 0, name: 'Unknown' };
  }
}
```

---

### Q23. How does gRPC streaming (Client, Server, Bi-directional) work in NestJS?

#### Answer:
Using `@GrpcStreamMethod()`, methods receive or return RxJS `Observable` instances representing continuous streams of protobuf messages.

#### Example:
```typescript
import { Controller } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { Observable, Subject } from 'rxjs';

@Controller()
export class ChatStreamController {
  @GrpcStreamMethod('ChatService', 'BidiStreamChat')
  bidiStreamChat(messages$: Observable<{ text: string }>): Observable<{ reply: string }> {
    const response$ = new Subject<{ reply: string }>();

    messages$.subscribe({
      next: (msg) => response$.next({ reply: `Echo: ${msg.text}` }),
      complete: () => response$.complete(),
    });

    return response$.asObservable();
  }
}
```

---

### Q24. How do you implement an API Idempotency Interceptor using Redis?

#### Answer:
Clients send a unique `Idempotency-Key` header with mutation requests (`POST`/`PUT`). The interceptor checks Redis:
1. If the key exists with a completed response, it immediately returns the cached response.
2. If the key is currently processing, it returns `409 Conflict`.
3. If new, it locks the key, processes the handler, caches the response, and completes.

#### Example:
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import Redis from 'ioredis';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private redis = new Redis();

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['idempotency-key'];

    if (!key) return next.handle();

    const cacheKey = `idempotency:${key}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      if (cached === 'PROCESSING') {
        throw new ConflictException('Request is currently being processed');
      }
      return of(JSON.parse(cached));
    }

    await this.redis.set(cacheKey, 'PROCESSING', 'EX', 60);

    return next.handle().pipe(
      tap(async (response) => {
        await this.redis.set(cacheKey, JSON.stringify(response), 'EX', 86400); // 24h
      }),
    );
  }
}
```

---

### Q25. How do you implement the Transactional Outbox Pattern in NestJS to ensure reliable message delivery?

#### Answer:
In distributed architectures, publishing directly to Kafka/RabbitMQ during a database transaction can lead to inconsistencies if the broker is down or the DB transaction fails.
- **Outbox Pattern**: The event is saved into an `outbox` table *within the same database transaction* as the entity update.
- A background worker polls the `outbox` table (or CDC via Debezium) and safely dispatches messages to the message broker.

---

### Q26. How do you mock microservice message clients (`ClientProxy`) in integration and E2E tests?

#### Answer:
Replace the `ClientProxy` token with a mock object implementing `send` and `emit` returning `of(mockResponse)`.

#### Example:
```typescript
import { of } from 'rxjs';

const mockPaymentClient = {
  send: jest.fn().mockImplementation((pattern, payload) => {
    if (pattern.cmd === 'process_charge') {
      return of({ status: 'SUCCESS', transactionId: 'txn_999' });
    }
    return of(null);
  }),
  emit: jest.fn().mockReturnValue(of(true)),
};

// In Test.createTestingModule:
providers: [
  { provide: 'PAYMENT_SERVICE', useValue: mockPaymentClient },
]
```

---

### Q27. What are `DiscoveryService` and `MetadataScanner` in `@nestjs/core`, and how do you build custom decorators?

#### Answer:
`DiscoveryService` scans all registered providers and controllers in the application container. Combined with `MetadataScanner` and `Reflector`, it allows building custom framework plugins (e.g. custom metrics scanners, custom queue workers, cron triggers).

---

### Q28. How do you implement Circuit Breakers and Timeouts using RxJS operators in NestJS controllers?

#### Answer:
Use RxJS operators `timeout()` and `catchError()` to enforce maximum response wait times and provide fallback responses when third-party dependencies stall.

#### Example:
```typescript
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { timeout, catchError } from 'rxjs/operators';
import { of, TimeoutError } from 'rxjs';

@Injectable()
export class ExternalInventoryService {
  constructor(private http: HttpService) {}

  checkStock(productId: string) {
    return this.http.get(`https://inventory.api.com/items/${productId}`).pipe(
      timeout(2000), // Fail if response takes longer than 2 seconds
      catchError((err) => {
        if (err instanceof TimeoutError) {
          console.warn('Inventory API timed out, returning degraded fallback');
          return of({ data: { inStock: true, estimated: true } });
        }
        throw err;
      }),
    );
  }
}
```

---

### Q29. How do you build an Audit Logging Interceptor capturing DB diffs and user actors?

#### Answer:
An interceptor captures the authenticated user from `req.user`, target resource ID from `req.params`, input body, and the execution result, sending audit logs asynchronously to an audit database.

---

### Q30. How do you implement Session-based stateful authentication with Redis in NestJS?

#### Answer:
Use `express-session` backed by `connect-redis`. NestJS controllers access `req.session` to store authenticated user sessions with server-managed session IDs.

---

### Q31. How do you harden NestJS against web security vulnerabilities (Helmet, CSRF, Parameter Pollution)?

#### Answer:
1. **Helmet**: `app.use(helmet())` sets secure HTTP headers (CSP, HSTS, X-Frame-Options).
2. **CORS**: Enforce whitelist of allowed domains.
3. **Rate Limiting**: Apply `@nestjs/throttler`.
4. **Validation**: Use `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` to prevent parameter injection.

---

### Q32. How do you diagnose and debug memory leaks in NestJS production microservices?

#### Answer:
1. Take heap snapshots using Node's `v8` or Chrome DevTools inspect flag (`node --inspect`).
2. Common culprits in NestJS:
   - Unclosed RxJS Subscriptions inside services.
   - Accidental `Scope.REQUEST` caching in singleton maps.
   - Event listeners added repeatedly to `EventEmitter` without cleanup.
   - Growing in-memory caches without TTL or eviction policies.

---

### Q33. What is the difference between synchronous HTTP communication and asynchronous message broker patterns in NestJS?

#### Answer:
- **Synchronous HTTP**:
  - Tight coupling between caller and receiver.
  - Cascading failures (if downstream service fails, caller times out).
- **Asynchronous Message Brokers (RabbitMQ/Kafka)**:
  - Loose temporal coupling (receiver can be offline; messages wait in queues).
  - Backpressure control, load leveling, and broadcast fan-out capabilities.

---

### Q34. How do you implement custom validation rules using `registerDecorator` in `class-validator`?

#### Answer:
`registerDecorator` allows creating domain-specific validation annotations (e.g. `@IsValidTaxId()`, `@IsPasswordStrong()`).

#### Example:
```typescript
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidDomain(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidDomain',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid domain name!`;
        },
      },
    });
  };
}
```
