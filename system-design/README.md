# System Design Interview Preparation

High-Level Design (HLD), Low-Level Design (LLD), distributed systems, and scalability.

## Core Concepts
- Scalability: Horizontal vs Vertical scaling
- Load Balancers: Layer 4 vs Layer 7, Consistent Hashing
- Caching: Redis, Memcached, eviction policies (LRU, LFU), caching strategies (Cache-Aside, Write-Through)
- Database Scaling: Replication, Sharding, Partitioning, Federation
- CAP & PACELC Theorems, Eventual Consistency
- Message Queues & Streaming: Kafka, RabbitMQ, SQS
- Rate Limiting, Circuit Breakers & Fault Tolerance

## 📚 In-Depth System Design Blueprints

| Guide | Description | File Link |
| :--- | :--- | :--- |
| **Google Centralized SSO & Identity** | 1 Account / Email SSO across Mail, Drive, Photos, YouTube, Multi-Account, Zanzibar AuthZ, Edge Verification | [04-google-sso-system-design.md](file:///e:/code/study/prep-month/interview/system-design/04-google-sso-system-design.md) |
| **50 System Design Questions** | Comprehensive Q&A covering HLD/LLD, caching, sharding, consensus & CAP | [03-system-design.md](file:///e:/code/study/prep-month/interview/system-design/03-system-design.md) |
| **MERN Production Scenarios** | Real-world scaling, high-concurrency Node.js and PostgreSQL/MongoDB scenarios | [02-mern-production-scenarios.md](file:///e:/code/study/prep-month/interview/system-design/02-mern-production-scenarios.md) |
| **Advanced MERN & PostgreSQL** | Database indexing, connection pooling, transactions, and backend architecture | [01-advanced-mern-postgresql.md](file:///e:/code/study/prep-month/interview/system-design/01-advanced-mern-postgresql.md) |

## Classic Systems to Design
- Google Single Sign-On (SSO) & Identity Management
- URL Shortener (TinyURL)
- Distributed Rate Limiter
- Real-Time Chat System (WhatsApp / Slack)
- News Feed System (Twitter / Instagram)
- Video Streaming Service (Netflix / YouTube)
- Notification Service
