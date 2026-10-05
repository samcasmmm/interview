# 🐘 SQL & PostgreSQL Interview Master Guide

> A comprehensive study guide containing **100 in-depth interview questions and code examples** covering standard SQL querying, indexing internals, transaction isolation (ACID), window functions, PostgreSQL MVCC, JSONB operations, query planning (`EXPLAIN ANALYZE`), partitioning, and performance tuning.

---

## 📑 Table of Contents

- [Standard SQL (55 Questions)](#-standard-sql-55-questions)
  - [1. Basics & Query Fundamentals (Q1–Q14)](#1-basics--query-fundamentals)
  - [2. Window Functions & Advanced Aggregations (Q15–Q22)](#2-window-functions--advanced-aggregations)
  - [3. Constraints, Indexes & Schema Design (Q23–Q30)](#3-constraints-indexes--schema-design)
  - [4. Transactions, ACID & Locking (Q31–Q37)](#4-transactions-acid--locking)
  - [5. Query Writing, Manipulation & Performance (Q38–Q45)](#5-query-writing-manipulation--performance)
  - [6. Views, Procedures & Architecture (Q46–Q55)](#6-views-procedures--architecture)
- [PostgreSQL (45 Questions)](#-postgresql-45-questions)
  - [1. Core Architecture, MVCC & Types (Q1–Q10)](#1-core-architecture-mvcc--types)
  - [2. Indexing Deep Dive (Q11–Q16)](#2-indexing-deep-dive)
  - [3. Query Planning & Tuning (Q17–Q24)](#3-query-planning--tuning)
  - [4. Transactions, Locking & Replication (Q25–Q32)](#4-transactions-locking--replication)
  - [5. Extensibility, Advanced Features & RLS (Q33–Q45)](#5-extensibility-advanced-features--rls)

---

# 📊 Standard SQL (55 Questions)

---

### 1. Basics & Query Fundamentals

#### 1. Difference between `DDL`, `DML`, `DQL`, and `DCL`.
- **DDL (Data Definition Language)**: Defines schema structure (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`).
- **DML (Data Manipulation Language)**: Modifies table data (`INSERT`, `UPDATE`, `DELETE`).
- **DQL (Data Query Language)**: Retrieves data from tables (`SELECT`).
- **DCL (Data Control Language)**: Manages database privileges and permissions (`GRANT`, `REVOKE`).

```sql
-- DDL
CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(100), salary NUMERIC);

-- DML
INSERT INTO employees (id, name, salary) VALUES (1, 'Alice', 75000);

-- DQL
SELECT name, salary FROM employees WHERE salary > 50000;

-- DCL
GRANT SELECT ON employees TO readonly_user;
```

---

#### 2. What is the difference between `WHERE` and `HAVING`?
- **`WHERE`**: Filters individual records **before** grouping or aggregation occurs. Cannot contain aggregate functions (`COUNT`, `SUM`).
- **`HAVING`**: Filters groups **after** aggregation (`GROUP BY`). Can filter based on aggregate calculations.

```sql
SELECT department, COUNT(*) AS employee_count, AVG(salary) AS avg_sal
FROM employees
WHERE is_active = TRUE         -- Filters raw rows before grouping
GROUP BY department
HAVING COUNT(*) >= 5          -- Filters grouped aggregations
   AND AVG(salary) > 60000;
```

---

#### 3. What is the logical order of execution of a SQL query?
Although written starting with `SELECT`, the database engine processes queries in the following logical sequence:
1. **`FROM`** (including table joins)
2. **`WHERE`** (row-level filtering)
3. **`GROUP BY`** (grouping rows)
4. **`HAVING`** (group filtering)
5. **`SELECT`** (computing column expressions)
6. **`DISTINCT`** (deduplicating)
7. **`ORDER BY`** (sorting)
8. **`LIMIT` / `OFFSET`** (pagination)
*Note: This is why column aliases defined in `SELECT` cannot be referenced in `WHERE`.*

---

#### 4. Difference between `DELETE`, `TRUNCATE`, and `DROP`.
- **`DELETE`**: DML command. Deletes specific rows matching a `WHERE` condition. Row-level locks, logged row-by-row in WAL, triggers fire, slower.
- **`TRUNCATE`**: DDL command. Rapidly empties the entire table by deallocating storage pages. Resets identity sequences, bypasses per-row delete triggers, much faster.
- **`DROP`**: DDL command. Completely removes table definition, indexes, constraints, and data from the database catalog.

```sql
DELETE FROM logs WHERE created_at < NOW() - INTERVAL '30 days'; -- Conditional
TRUNCATE TABLE temp_staging; -- Wipes all data instantly
DROP TABLE deprecated_orders; -- Deletes schema and table entirely
```

---

#### 5. What is a Primary Key vs a Unique Key?
- **Primary Key (PK)**: Uniquely identifies each row; strictly prohibits `NULL` values; a table can have **only one** PK.
- **Unique Key**: Enforces uniqueness across rows; **allows `NULL` values** (behavior varies slightly across DBs, but allows at least one `NULL`); a table can have **multiple** unique keys.

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,              -- Only 1 Primary Key allowed
    email VARCHAR(255) UNIQUE NOT NULL,       -- Unique constraint
    ssn VARCHAR(11) UNIQUE                    -- Unique constraint (allows NULL)
);
```

---

#### 6. What is a Foreign Key and Referential Integrity?
A **Foreign Key** is a column that points to the Primary/Unique key of another table. **Referential Integrity** guarantees that relationships between tables remain consistent (no orphaned records).

```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE
    -- ON DELETE CASCADE automatically deletes child orders when the parent user is deleted
);
```

---

#### 7. What are the different types of `JOIN`s?
- **`INNER JOIN`**: Returns rows where matching keys exist in **both** tables.
- **`LEFT JOIN`**: Returns all rows from the left table and matched rows from the right table (unmatched columns filled with `NULL`).
- **`RIGHT JOIN`**: Returns all rows from right table and matches from left.
- **`FULL OUTER JOIN`**: Returns all rows from both tables, matching where possible.
- **`CROSS JOIN`**: Cartesian product ($M \times N$ rows).

```sql
SELECT u.name, o.order_total
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id;
```

---

#### 8. What is a Self Join and when would you use one?
A Self Join joins a table to itself using aliases, typically to query hierarchical or tree structures (e.g. employee-to-manager relationships).

```sql
CREATE TABLE staff (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    manager_id INT
);

SELECT 
    e.name AS employee_name,
    m.name AS manager_name
FROM staff e
LEFT JOIN staff m ON e.manager_id = m.emp_id;
```

---

#### 9. Difference between `UNION` and `UNION ALL`.
- **`UNION`**: Combines result sets from multiple queries and **removes duplicate rows** (requires an expensive sort/hash deduplication step).
- **`UNION ALL`**: Combines result sets **retaining all duplicates** (much faster; always prefer unless deduplication is required).

```sql
SELECT email FROM customers
UNION ALL
SELECT email FROM newsletter_subscribers;
```

---

#### 10. Subqueries: Correlated vs Non-Correlated.
- **Non-Correlated Subquery**: Independent of outer query. Executes **once** and passes its result to the outer query.
- **Correlated Subquery**: References columns from the outer query. Evaluates **once for each row** processed by the outer query (can cause high latency).

```sql
-- Non-correlated (Runs once)
SELECT * FROM employees 
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Correlated (Runs once per employee row)
SELECT e1.name, e1.salary, e1.department
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary) 
    FROM employees e2 
    WHERE e2.department = e1.department
);
```

---

#### 11. Difference between `IN`, `EXISTS`, and `JOIN`.
- **`IN`**: Compares a value against a list or subquery column. *(Caution: `NOT IN` returns 0 rows if subquery contains a single `NULL`)*.
- **`EXISTS`**: Tests for the existence of rows matching a correlated subquery; short-circuits on first match (boolean test).
- **`JOIN`**: Merges columns from both tables into the output result set.

```sql
-- Using EXISTS (Clean, short-circuits efficiently)
SELECT u.name FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.user_id AND o.status = 'completed'
);
```

---

#### 12. Aggregate functions in SQL.
Functions that calculate a single summarized value over multiple rows:
- `COUNT()`: Counts rows or non-null values.
- `SUM()`: Calculates numeric sum.
- `AVG()`: Calculates mathematical average.
- `MIN()` / `MAX()`: Computes lowest and highest values.

---

#### 13. Common mistakes with `GROUP BY`.
- **Mistake**: Selecting a column in the `SELECT` list that is neither grouped in `GROUP BY` nor wrapped in an aggregate function.

```sql
-- ❌ Invalid in standard SQL:
-- SELECT department, name, AVG(salary) FROM employees GROUP BY department;

-- ✅ Correct:
SELECT department, COUNT(name), AVG(salary) 
FROM employees 
GROUP BY department;
```

---

#### 14. Difference between `COUNT(*)`, `COUNT(1)`, and `COUNT(column)`.
- **`COUNT(*)`**: Counts total number of rows in table, including rows with all `NULL`s.
- **`COUNT(1)`**: Identical in performance and behavior to `COUNT(*)` in modern query optimizers.
- **`COUNT(column)`**: Counts only rows where the specified column is **NOT `NULL`**.

---

### 2. Window Functions & Advanced Aggregations

#### 15. What are Window Functions vs `GROUP BY` aggregates?
- **`GROUP BY`**: Collapses multiple rows into a single summary row per group.
- **Window Functions (`OVER (...)`)**: Compute aggregate/ranking values across a partition of rows while **retaining individual row identities**.

```sql
SELECT 
    name, 
    department, 
    salary,
    AVG(salary) OVER(PARTITION BY department) AS dept_avg_salary,
    salary - AVG(salary) OVER(PARTITION BY department) AS diff_from_avg
FROM employees;
```

---

#### 16. Difference between `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()`.
- **`ROW_NUMBER()`**: Generates strictly unique sequential integers (`1, 2, 3, 4`).
- **`RANK()`**: Assigns same rank to ties, but **skips subsequent ranks** (`1, 2, 2, 4`).
- **`DENSE_RANK()`**: Assigns same rank to ties **without gaps** (`1, 2, 2, 3`).

```sql
SELECT 
    name, salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
    RANK() OVER (ORDER BY salary DESC) AS rnk,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM employees;
```

---

#### 17. What is a Common Table Expression (CTE)?
A CTE (`WITH cte_name AS (...)`) defines a temporary named result set that improves readability and modularity of complex queries.

```sql
WITH HighEarningDepts AS (
    SELECT department, AVG(salary) AS avg_sal
    FROM employees
    GROUP BY department
    HAVING AVG(salary) > 80000
)
SELECT e.name, e.salary, h.avg_sal
FROM employees e
JOIN HighEarningDepts h ON e.department = h.department;
```

---

#### 18. What is a Recursive CTE?
A CTE that repeatedly references itself to traverse hierarchical or tree data structures (e.g., org charts, category trees).

```sql
WITH RECURSIVE OrgChart AS (
    -- Anchor member
    SELECT emp_id, name, manager_id, 1 as depth
    FROM staff
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive member
    SELECT s.emp_id, s.name, s.manager_id, o.depth + 1
    FROM staff s
    JOIN OrgChart o ON s.manager_id = o.emp_id
)
SELECT * FROM OrgChart ORDER BY depth;
```

---

#### 19. Difference between CTE and Subquery.
- **Readability**: CTEs organize logic from top-to-bottom instead of nested inside-out.
- **Reusability**: A single CTE can be referenced multiple times within the main query.
- **Optimization**: Modern database engines inline non-recursive CTEs identically to subqueries.

---

#### 20. Difference between `NULL` and empty string `''`.
- **`NULL`**: Represents unknown or missing data. Does not equal anything (`NULL = NULL` is `UNKNOWN`).
- **Empty string `''`**: A known, concrete string value of length 0.

---

#### 21. Why does `NULL = NULL` evaluate to UNKNOWN / False?
SQL uses three-valued logic (`TRUE`, `FALSE`, `UNKNOWN`). Because `NULL` signifies an unknown value, comparing two unknowns cannot be verified as equal. Always use `IS NULL` or `IS NOT NULL`.

---

#### 22. Difference between `COALESCE()` and `NULLIF()`.
- **`COALESCE(val1, val2, ...)`**: Returns the **first non-null** argument in the list.
- **`NULLIF(val1, val2)`**: Returns `NULL` if `val1 == val2`; otherwise returns `val1` (useful to prevent divide-by-zero).

```sql
-- Safe division preventing division by zero
SELECT revenue / NULLIF(total_orders, 0) AS avg_order_val FROM daily_stats;

-- Fallback display
SELECT name, COALESCE(phone, email, 'No contact info') AS primary_contact FROM users;
```

---

### 3. Constraints, Indexes & Schema Design

#### 23. Common constraints in SQL.
- `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `NOT NULL`.
- `CHECK`: Validates values against a boolean expression (e.g. `CHECK (age >= 18)`).
- `DEFAULT`: Automatically sets default value when column is omitted.

---

#### 24. Database Normalization (1NF, 2NF, 3NF).
- **1NF**: Atomic values per column (no comma-separated lists), unique primary key.
- **2NF**: In 1NF + all non-key columns are fully functionally dependent on the entire primary key (removes partial dependencies).
- **3NF**: In 2NF + no transitive dependencies (non-key columns depend **only** on the primary key, not on other non-key columns).

---

#### 25. What is Denormalization?
Deliberately introducing redundant data into tables to reduce expensive multi-table joins and optimize high-throughput read operations in analytics/reporting workloads.

---

#### 26. What is an Index and how does it work?
An index is an auxiliary data structure (usually a self-balancing **B-Tree**) that maintains sorted column values alongside row pointers (Tuple IDs / TIDs), enabling $O(\log N)$ point lookups and range scans instead of costly $O(N)$ full table scans.

---

#### 27. Clustered vs Non-Clustered Index.
- **Clustered Index**: Dictates the physical order of data rows on disk (only 1 per table; e.g. Primary Key in MySQL InnoDB).
- **Non-Clustered Index**: Separate index structure containing indexed keys and pointers back to the raw row storage (Heap in PostgreSQL).

---

#### 28. When can an index hurt performance?
- High-write workloads (every `INSERT`, `UPDATE`, and `DELETE` must maintain all indexes).
- Low-cardinality columns (e.g. `gender`, `is_active` with only 2 values), where the planner prefers sequential scans.

---

#### 29. Composite (Multi-Column) Index and Leftmost Prefix Rule.
A composite index `(col_a, col_b, col_c)` can accelerate queries filtering by:
- `(col_a)`
- `(col_a, col_b)`
- `(col_a, col_b, col_c)`
*It CANNOT be efficiently used for queries filtering only by `(col_b)` or `(col_c)` without `col_a`.*

```sql
CREATE INDEX idx_user_loc ON users (country, city, zip_code);
```

---

#### 30. What is a Covering Index?
An index that contains **all columns** required by a query (either in the indexed key or via `INCLUDE`). This allows the database to perform an **Index-Only Scan** without touching table disk blocks.

```sql
CREATE INDEX idx_orders_covering ON orders (user_id, status) INCLUDE (order_total, created_at);

-- Completely satisfied by index alone:
SELECT user_id, status, order_total, created_at 
FROM orders 
WHERE user_id = 42 AND status = 'completed';
```

---

### 4. Transactions, ACID & Locking

#### 31. What is a Transaction and ACID properties?
A transaction is a logical unit of database work.
- **A (Atomicity)**: All operations succeed, or all are rolled back.
- **C (Consistency)**: Transforms DB from one valid state to another, upholding constraints.
- **I (Isolation)**: Concurrent transactions do not cross-contaminate each other.
- **D (Durability)**: Committed transactions survive system crashes and power failures.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;
```

---

#### 32. SQL Transaction Isolation Levels.

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|---|:---:|:---:|:---:|
| **Read Uncommitted** | ❌ Allowed | ❌ Allowed | ❌ Allowed |
| **Read Committed** (Default) | ✅ Prevented | ❌ Allowed | ❌ Allowed |
| **Repeatable Read** | ✅ Prevented | ✅ Prevented | ❌ Allowed (Prevented in Postgres) |
| **Serializable** | ✅ Prevented | ✅ Prevented | ✅ Prevented |

---

#### 33. Dirty Read, Non-Repeatable Read, and Phantom Read.
- **Dirty Read**: Transaction reads uncommitted, in-flight changes of another transaction that might later roll back.
- **Non-Repeatable Read**: A transaction re-reads the same row and discovers values have been **modified** by a committed transaction.
- **Phantom Read**: A transaction re-runs a range query and discovers new **inserted/deleted rows** matching the criteria.

---

#### 34. What is Deadlock and how to resolve it?
A deadlock occurs when Transaction A holds Lock 1 and waits for Lock 2, while Transaction B holds Lock 2 and waits for Lock 1.
- **Prevention**: Always acquire locks in the same alphabetical/logical order across all application endpoints; keep transactions short.

---

#### 35. Optimistic vs Pessimistic Locking.
- **Pessimistic Locking**: Locks rows explicitly upfront (`SELECT ... FOR UPDATE`), preventing any other connection from reading/writing until committed.
- **Optimistic Locking**: No locks held during reading. Checks a `version_number` or `updated_at` column at update time; rejects if version changed.

```sql
-- Optimistic locking query pattern
UPDATE products 
SET stock = stock - 1, version = version + 1 
WHERE product_id = 101 AND version = 3;
```

---

#### 36. What does `SELECT ... FOR UPDATE` do?
Acquires exclusive row-level locks on matching rows, blocking other transactions attempting to update, delete, or lock those same rows until the current transaction completes.

```sql
BEGIN;
SELECT balance FROM accounts WHERE id = 10 FOR UPDATE;
-- Safe to calculate new balance without race conditions
UPDATE accounts SET balance = balance - 50 WHERE id = 10;
COMMIT;
```

---

#### 37. What is a Savepoint?
A savepoint allows rolling back part of a transaction without aborting the entire transaction.

```sql
BEGIN;
INSERT INTO audit_log VALUES ('Task started');
SAVEPOINT step1;

-- Risky operation
INSERT INTO records VALUES (1, 'data');
-- If failed:
ROLLBACK TO SAVEPOINT step1;

COMMIT;
```

---

### 5. Query Writing, Manipulation & Performance

#### 38. `INNER JOIN` vs implicit comma join in `FROM`.
Explicit `INNER JOIN ... ON ...` is ANSI standard. Comma-separated `FROM tableA, tableB WHERE ...` is legacy, error-prone, and can easily turn into an unintentional Cartesian `CROSS JOIN` if the `WHERE` condition is omitted.

---

#### 39. How do you find and remove duplicate rows in a table?

```sql
-- Finding duplicates
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Deleting duplicates while keeping lowest ID
DELETE FROM users 
WHERE id NOT IN (
    SELECT MIN(id) FROM users GROUP BY email
);
```

---

#### 40. Query to find the N-th highest salary.

```sql
-- Finding 2nd highest salary using DENSE_RANK (Handles ties properly)
WITH RankedSalaries AS (
    SELECT name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank_pos
    FROM employees
)
SELECT name, salary 
FROM RankedSalaries 
WHERE rank_pos = 2;
```

---

#### 41. How to calculate a Running Total in SQL?

```sql
SELECT 
    order_date, 
    amount,
    SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM sales;
```

---

#### 42. Pivot queries using conditional aggregation.

```sql
SELECT 
    product_id,
    SUM(CASE WHEN quarter = 'Q1' THEN sales ELSE 0 END) AS Q1_Sales,
    SUM(CASE WHEN quarter = 'Q2' THEN sales ELSE 0 END) AS Q2_Sales,
    SUM(CASE WHEN quarter = 'Q3' THEN sales ELSE 0 END) AS Q3_Sales,
    SUM(CASE WHEN quarter = 'Q4' THEN sales ELSE 0 END) AS Q4_Sales
FROM quarterly_sales
GROUP BY product_id;
```

---

#### 43. `LEFT JOIN ... WHERE right.id IS NULL` vs `NOT EXISTS`.
Both retrieve rows from Table A with no match in Table B (Anti-Join). `NOT EXISTS` is generally preferred as it is null-safe and easily optimized by query planners.

```sql
-- Find customers with zero orders
SELECT c.name FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
```

---

#### 44. What is a Query Execution Plan?
The query execution plan is the internal roadmap generated by the database optimizer detailing how a query will be executed (e.g., Index Scan vs Sequential Scan, Hash Join vs Nested Loop, estimated costs, disk buffers).

---

#### 45. What is SQL Injection and how to prevent it?
SQL injection occurs when untrusted input is concatenated directly into a query string, allowing attackers to execute arbitrary SQL commands.
- **Prevention**: Always use **Parameterized Queries / Prepared Statements**.

```javascript
// ❌ Dangerous (Vulnerable to SQL Injection)
// db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`);

// ✅ Safe (Parameterized Query)
db.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
```

---

### 6. Views, Procedures & Architecture

#### 46. What is a View and what are its benefits?
A View is a stored, named SQL query that acts as a virtual table. It encapsulates complex joins, standardizes reporting queries, and restricts direct table access for security.

```sql
CREATE VIEW active_customer_summary AS
SELECT c.id, c.name, COUNT(o.order_id) as total_orders
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE c.is_active = TRUE
GROUP BY c.id, c.name;
```

---

#### 47. What is a Materialized View?
A Materialized View **persists the query results physically on disk** as a snapshot. Queries against it run instantly without recalculating joins. It must be periodically refreshed.

```sql
CREATE MATERIALIZED VIEW monthly_revenue_report AS
SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS total_revenue
FROM orders
GROUP BY DATE_TRUNC('month', order_date);

-- Refresh command
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_revenue_report;
```

---

#### 48. What is a Stored Procedure?
A precompiled set of SQL statements stored in the database database that can accept parameters, execute transactional logic, and control loops.

---

#### 49. What is a Database Trigger?
A procedural function automatically executed by the database in response to `INSERT`, `UPDATE`, or `DELETE` events on a table.

---

#### 50. Natural Join risks.
`NATURAL JOIN` automatically joins tables on columns with identical names. It is dangerous in production because schema migrations that rename or add columns can silently break queries.

---

#### 51. Database Schema vs Instance.
- **Instance**: The active memory structures (buffer pools) and background OS processes running the database engine.
- **Schema**: Logical namespace inside a database containing tables, views, and indexes.

---

#### 52. Scalar vs Table-Valued Functions.
- **Scalar Function**: Returns a single value (e.g., `LOWER('ABC')`, custom tax calculator).
- **Table-Valued Function**: Returns a complete table of rows and columns (used in `FROM` clauses).

---

#### 53. What is the N+1 Query Problem?
Occurs when an application makes 1 initial query to fetch parent records, and then executes $N$ separate queries in a loop to fetch related child records.
- **Solution**: Use `JOIN` or batched `IN (...)` queries (ORM eager-loading).

---

#### 54. Horizontal vs Vertical Partitioning.
- **Horizontal Partitioning (Sharding)**: Splits rows across multiple physical tables/shards based on a partition key (e.g. `created_at`, `tenant_id`).
- **Vertical Partitioning**: Splits columns into separate tables (e.g. moving large `TEXT` or `BLOB` fields to a secondary table).

---

#### 55. What is three-valued logic in SQL?
Every boolean expression evaluates to **`TRUE`**, **`FALSE`**, or **`UNKNOWN`** due to `NULL` values.

---

# 🐘 PostgreSQL (45 Questions)

---

### 1. Core Architecture, MVCC & Types

#### 1. What distinguishes PostgreSQL from other relational databases?
PostgreSQL is an advanced Object-Relational Database Management System (ORDBMS) featuring:
- Native support for structured JSON (`JSONB`), Arrays, Range types, and Geometric types.
- Multi-Version Concurrency Control (MVCC) preventing read-write lock contention.
- Pluggable extension ecosystem (PostGIS, `pg_trgm`, `pgvector`).

---

#### 2. What is MVCC (Multi-Version Concurrency Control)?
MVCC enables concurrent read and write operations.
- When an `UPDATE` or `DELETE` occurs, Postgres does **not** overwrite the existing row. Instead, it marks the old row with an expiry transaction ID (`xmax`) and writes a **new row version** with an insertion transaction ID (`xmin`).
- **Result**: Readers never block writers, and writers never block readers.

---

#### 3. What is `VACUUM` and why is it necessary?
Because MVCC creates dead row versions (bloat) on updates and deletes, `VACUUM` scans tables to:
1. Reclaim dead tuple storage for future inserts.
2. Update table statistics for the query planner.
3. Prevent Transaction ID (XID) wraparound.

---

#### 4. Difference between `VACUUM`, `VACUUM FULL`, and `AUTOVACUUM`.
- **`VACUUM`**: Reclaims space for reuse within the table without locking out readers or writers.
- **`VACUUM FULL`**: Rewrites the entire table into a new disk file to return storage to the OS; requires an **exclusive table lock** (`ACCESS EXCLUSIVE`).
- **`AUTOVACUUM`**: Background daemon that runs `VACUUM` and `ANALYZE` automatically based on change thresholds.

---

#### 5. `JSONB` vs `JSON` in PostgreSQL.
- **`JSON`**: Stores text representation; fast to write, slow to query, no indexing support.
- **`JSONB`**: Stores parsed binary format; slightly slower insert time, but supports fast indexing (**GIN Index**) and efficient query operators (`@>`, `?`, `->>`).

```sql
CREATE TABLE audit_events (
    id SERIAL PRIMARY KEY,
    metadata JSONB
);

CREATE INDEX idx_events_meta ON audit_events USING GIN (metadata);

-- Fast indexed lookup
SELECT * FROM audit_events WHERE metadata @> '{"role": "admin"}';
```

---

#### 6. PostgreSQL Array Types.

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT,
    tags TEXT[]
);

INSERT INTO posts (title, tags) VALUES ('Postgres Guide', ARRAY['sql', 'db', 'backend']);

-- Search for posts containing 'sql' tag
SELECT * FROM posts WHERE 'sql' = ANY(tags);
```

---

#### 7. What are Range Types?
Range types represent ranges of continuous values (`int4range`, `daterange`, `tsrange`), with built-in overlap (`&&`) and containment (`@>`) operators.

```sql
CREATE TABLE reservations (
    room_id INT,
    booking_period DATERANGE
);

-- Find reservations that overlap with a specific date range
SELECT * FROM reservations 
WHERE booking_period && daterange('2026-06-01', '2026-06-15');
```

---

#### 8. UUID primary keys vs Serial integers.
- **`UUID` (`uuid_generate_v4()`)**: 128-bit globally unique identifier. Safe for distributed architectures; cannot be guessed by enumeration attacks.
- **`SERIAL` / `BIGIDENTITY`**: 64-bit sequential integer. Smaller storage, higher B-Tree index locality, faster join performance.

---

#### 9. Difference between `CHAR`, `VARCHAR`, and `TEXT` in PostgreSQL.
In PostgreSQL, there is **no performance difference** between `VARCHAR(n)` and `TEXT`. `TEXT` is preferred unless an explicit character length constraint is strictly required by business logic.

---

#### 10. `ENUM` types in PostgreSQL.

```sql
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered');

CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    status order_status DEFAULT 'pending'
);
```

---

### 2. Indexing Deep Dive

#### 11. Index types supported in PostgreSQL.
1. **B-Tree (Default)**: Best for equality and range queries (`<`, `<=`, `=`, `>=`, `>`).
2. **GIN (Generalized Inverted Index)**: Best for composite items (JSONB, Arrays, Full-Text Search).
3. **GiST (Generalized Search Tree)**: Best for geometric data, PostGIS coordinates, and range types.
4. **BRIN (Block Range Index)**: Extremely compact indexes for massive append-only tables (time-series, logs).
5. **Hash**: Fast equality-only lookups (`=`).

---

#### 12. GIN vs GiST Indexes.
- **GIN**: Faster for lookups and multi-value containment; slower to update.
- **GiST**: Faster to update; supports nearest-neighbor distance searches ($k$-NN) and geometric overlaps.

---

#### 13. What is a Partial Index?
An index built only over rows matching a `WHERE` predicate. It saves disk space and maintains high lookup speeds for common query filters.

```sql
-- Indexes only active pending jobs instead of millions of completed jobs
CREATE INDEX idx_pending_jobs ON queue_jobs (priority) WHERE status = 'pending';
```

---

#### 14. What is an Expression (Functional) Index?
An index built on the output of a function or expression.

```sql
CREATE INDEX idx_users_lower_email ON users (LOWER(email));

-- Query uses index:
SELECT * FROM users WHERE LOWER(email) = 'test@example.com';
```

---

#### 15. What is `CREATE INDEX CONCURRENTLY`?
Builds an index without acquiring an exclusive table lock, allowing live read and write operations to proceed during index creation on active production databases.

```sql
CREATE INDEX CONCURRENTLY idx_orders_created ON orders (created_at);
```

---

#### 16. How to find unused indexes in PostgreSQL?

```sql
SELECT 
    relname AS table_name,
    indexrelname AS index_name,
    idx_scan AS number_of_scans,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

### 3. Query Planning & Tuning

#### 17. `EXPLAIN` vs `EXPLAIN ANALYZE`.
- **`EXPLAIN`**: Shows estimated costs and plan generated by the optimizer without running the query.
- **`EXPLAIN (ANALYZE, BUFFERS)`**: Executes the query, outputting **actual execution time**, actual rows, and cache/disk buffer hits.

```sql
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM orders WHERE user_id = 500;
```

---

#### 18. Sequential Scan vs Index Scan.
- **Sequential Scan**: Reads every disk block in the table sequentially.
- **Index Scan**: Traverses B-Tree to find TIDs and visits table heap for column data.
- *Postgres chooses Seq Scan when selecting a large percentage (>15-20%) of the table due to sequential disk read efficiency.*

---

#### 19. What is an Index-Only Scan?
The query retrieves all requested data directly from the index tree without reading the table heap, relying on the **Visibility Map** to confirm tuple visibility.

---

#### 20. What does `ANALYZE` do?
`ANALYZE` collects statistical distributions of column values into `pg_statistic` (visible in `pg_stats`), enabling the cost-based optimizer to select optimal join strategies and index plans.

---

#### 21. What is `pg_stat_statements`?
A built-in PostgreSQL extension that records execution statistics (call count, total time, min/max time, buffer hits) for all queries run on the server.

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Identify top 5 slowest queries
SELECT query, calls, total_exec_time / calls AS avg_time_ms
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 5;
```

---

#### 22. Common causes of slow queries.
- Missing indexes on foreign keys.
- Missing `ANALYZE` after bulk data loading.
- Sub-optimal table joins without indexes.
- Table bloat due to disabled autovacuum.

---

#### 23. Connection Pooling and PgBouncer.
PostgreSQL allocates a dedicated OS process for each client connection (~10MB memory per connection). Tools like **PgBouncer** pool and reuse connections to prevent CPU context-switch overhead.

---

#### 24. Table Bloat and prevention.
Bloat is accumulated disk space occupied by dead row versions. Configure aggressive autovacuum thresholds:

```sql
ALTER TABLE heavy_update_table SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_vacuum_cost_limit = 1000
);
```

---

### 4. Transactions, Locking & Replication

#### 25. Default Isolation Level in PostgreSQL.
PostgreSQL defaults to **`READ COMMITTED`**. It uses statement-level snapshots, preventing dirty reads.

---

#### 26. `SERIALIZABLE` isolation and SSI.
Postgres implements Serializable Snapshot Isolation (SSI). It tracks read-write dependencies (SIREAD locks) and aborts with a serialization failure (`40001`) if a cycle is detected, requiring the application to retry the transaction.

---

#### 27. PostgreSQL Lock Hierarchy.
Locks escalate from `ACCESS SHARE` (`SELECT`), `ROW SHARE`, `ROW EXCLUSIVE` (`UPDATE`/`DELETE`), up to `ACCESS EXCLUSIVE` (`ALTER TABLE`, `DROP TABLE`).

---

#### 28. Row-Level Locks: `FOR UPDATE` vs `FOR SHARE`.
- **`FOR UPDATE`**: Exclusive row lock; blocks other updates, deletes, and locks.
- **`FOR SHARE`**: Shared row lock; allows concurrent reads and other `FOR SHARE` locks, but blocks modifications.

---

#### 29. Streaming Replication.
The primary node streams Write-Ahead Log (WAL) records over TCP to standby replica nodes, which replay the WAL changes in real time for read scaling and high availability.

---

#### 30. Synchronous vs Asynchronous Replication.
- **Synchronous**: Primary waits for standby confirmation before committing (zero data loss, higher write latency).
- **Asynchronous**: Primary commits immediately without waiting (maximum performance, potential data lag during sudden failovers).

---

#### 31. Logical Replication vs Physical Replication.
- **Physical**: Copies exact byte-for-byte WAL records across identical Postgres versions.
- **Logical**: Uses publication/subscription models to stream row-level changes (`INSERT`, `UPDATE`, `DELETE`), allowing replication between different Postgres versions or specific tables.

---

#### 32. Write-Ahead Log (WAL).
WAL ensures Durability and crash recovery by logging all changes to disk sequentially before modifying the underlying data table pages.

---

### 5. Extensibility, Advanced Features & RLS

#### 33. PostgreSQL Extensions.
- **`PostGIS`**: Spatial data and geometric queries.
- **`pg_trgm`**: Trigram matching for fast fuzzy text and `ILIKE '%pattern%'` queries.
- **`pgcrypto`**: Cryptographic hashing and encryption.
- **`pgvector`**: Vector embeddings for AI similarity search.

---

#### 34. Fuzzy Text Search with `pg_trgm`.

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);

-- Fast indexed wildcard search
SELECT * FROM products WHERE name ILIKE '%phone%';
```

---

#### 35. Full-Text Search in PostgreSQL.

```sql
SELECT title, ts_rank(to_tsvector('english', body), query) AS rank
FROM articles, to_tsquery('english', 'postgresql & performance') query
WHERE to_tsvector('english', body) @@ query
ORDER BY rank DESC;
```

---

#### 36. Writable Common Table Expressions (Data-Modifying CTEs).

```sql
-- Move deleted rows to an archive table in a single atomic statement
WITH deleted_rows AS (
    DELETE FROM active_orders
    WHERE created_at < NOW() - INTERVAL '1 year'
    RETURNING *
)
INSERT INTO archived_orders
SELECT * FROM deleted_rows;
```

---

#### 37. `UPSERT` using `ON CONFLICT`.

```sql
INSERT INTO user_stats (user_id, login_count, last_login)
VALUES (42, 1, NOW())
ON CONFLICT (user_id) 
DO UPDATE SET 
    login_count = user_stats.login_count + 1,
    last_login = EXCLUDED.last_login;
```

---

#### 38. Native Table Partitioning (`PARTITION BY`).

```sql
CREATE TABLE sensor_readings (
    device_id INT,
    recorded_at TIMESTAMPTZ NOT NULL,
    reading NUMERIC
) PARTITION BY RANGE (recorded_at);

-- Create monthly partitions
CREATE TABLE sensor_readings_2026_01 PARTITION OF sensor_readings
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE sensor_readings_2026_02 PARTITION OF sensor_readings
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

---

#### 39. What is Partition Pruning?
The query planner analyzes query `WHERE` clauses and **completely skips scanning partitions** that fall outside the query range.

---

#### 40. Procedural Programming with `PL/pgSQL`.

```sql
CREATE OR REPLACE FUNCTION calculate_bonus(emp_id INT)
RETURNS NUMERIC AS $$
DECLARE
    emp_salary NUMERIC;
    bonus NUMERIC;
BEGIN
    SELECT salary INTO emp_salary FROM employees WHERE id = emp_id;
    IF emp_salary > 100000 THEN
        bonus := emp_salary * 0.10;
    ELSE
        bonus := emp_salary * 0.15;
    END IF;
    RETURN bonus;
END;
$$ LANGUAGE plpgsql;
```

---

#### 41. Functions vs Stored Procedures in PostgreSQL.
- **Function (`CREATE FUNCTION`)**: Returns a value; can be called inside `SELECT` queries; cannot commit/rollback transactions internally.
- **Procedure (`CREATE PROCEDURE`)**: Invoked with `CALL procedure_name()`; supports explicit transaction management (`COMMIT`/`ROLLBACK`) inside the procedure body.

---

#### 42. PostgreSQL Trigger with `PL/pgSQL`.

```sql
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

---

#### 43. Pub/Sub with `LISTEN` and `NOTIFY`.

```sql
-- Publisher
NOTIFY order_events, '{"order_id": 1001, "status": "paid"}';

-- Subscriber (in client application)
LISTEN order_events;
```

---

#### 44. `pg_dump` vs `pg_basebackup`.
- **`pg_dump`**: Logical text/tar backup of SQL commands; version-agnostic.
- **`pg_basebackup`**: Physical binary copy of the raw database cluster filesystem for Point-in-Time Recovery (PITR) and replication nodes.

---

#### 45. Row-Level Security (RLS) in PostgreSQL.
Enforces multi-tenant authorization directly in the database engine based on session variables.

```sql
-- Enable RLS on table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY tenant_isolation_policy ON documents
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::INT);

-- Application session setting
SET app.current_tenant_id = '101';
SELECT * FROM documents; -- Only returns rows matching tenant_id = 101
```
