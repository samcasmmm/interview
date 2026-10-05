# 100 PostgreSQL + SQL Interview Questions & Answers

A structured guide from Beginner → Intermediate → Advanced for software developer interview prep.

---

## Beginner (001–030)

001 - What is SQL?  
Ans - SQL (Structured Query Language) is a standard language used to create, query, update, and manage data in relational databases. It works with tables made of rows and columns.  
Example:  
```sql
SELECT * FROM employees;
```

002 - What is a Relational Database Management System (RDBMS)?  
Ans - An RDBMS is software that stores data in tables with rows and columns, enforces relationships between tables using keys, and supports SQL for data operations. Examples include PostgreSQL, MySQL, and Oracle.  

003 - What is PostgreSQL and why is it popular?  
Ans - PostgreSQL is a free, open-source, object-relational database system known for standards compliance, extensibility (custom types, functions), strong support for JSON/JSONB, advanced indexing, and reliability (ACID compliance). It's widely used in backend systems because it combines relational rigor with NoSQL-like flexibility.  
Example:  
```sql
SELECT version();
```

004 - What are the different sublanguages of SQL — DDL, DML, DQL, DCL, TCL?  
Ans - SQL commands are grouped into categories: **DDL** (Data Definition Language) defines schema — CREATE, ALTER, DROP, TRUNCATE. **DML** (Data Manipulation Language) modifies data — INSERT, UPDATE, DELETE. **DQL** (Data Query Language) retrieves data — SELECT. **DCL** (Data Control Language) manages permissions — GRANT, REVOKE. **TCL** (Transaction Control Language) manages transactions — COMMIT, ROLLBACK, SAVEPOINT.  

005 - What is DDL? Give examples.  
Ans - DDL statements define or modify the structure of database objects like tables, schemas, and indexes. Changes made by DDL are auto-committed in PostgreSQL by default within an implicit transaction, but PostgreSQL actually supports transactional DDL (it can be rolled back inside an explicit transaction, unlike most databases).  
Example:  
```sql
CREATE TABLE employees (id SERIAL PRIMARY KEY, name TEXT);
ALTER TABLE employees ADD COLUMN salary NUMERIC;
DROP TABLE employees;
```

006 - What is DML? Give examples.  
Ans - DML statements manipulate the actual data stored in tables — inserting, updating, or deleting rows.  
Example:  
```sql
INSERT INTO employees (name, salary) VALUES ('Asha', 60000);
UPDATE employees SET salary = 65000 WHERE name = 'Asha';
DELETE FROM employees WHERE name = 'Asha';
```

007 - What is DQL?  
Ans - DQL refers to the SELECT statement, used purely to query and retrieve data without modifying it.  
Example:  
```sql
SELECT name, salary FROM employees WHERE salary > 50000;
```

008 - What is DCL? Give examples.  
Ans - DCL controls access rights and permissions on database objects.  
Example:  
```sql
GRANT SELECT, INSERT ON employees TO app_user;
REVOKE INSERT ON employees FROM app_user;
```

009 - What is TCL? Give examples.  
Ans - TCL manages the effects of DML statements by grouping them into transactions that can be committed or undone.  
Example:  
```sql
BEGIN;
UPDATE employees SET salary = salary * 1.1;
COMMIT;
```

010 - What are the common PostgreSQL data types?  
Ans - Common types include: numeric — INTEGER, BIGINT, NUMERIC/DECIMAL, REAL, DOUBLE PRECISION; text — VARCHAR(n), TEXT, CHAR(n); date/time — DATE, TIME, TIMESTAMP, TIMESTAMPTZ, INTERVAL; boolean — BOOLEAN; and PostgreSQL-specific types — JSON, JSONB, ARRAY, UUID, and ENUM.  

011 - What is the difference between CHAR, VARCHAR, and TEXT?  
| Type | Storage | Notes |
|---|---|---|
| CHAR(n) | Fixed-length, space-padded | Slower to update, rarely used |
| VARCHAR(n) | Variable-length with a max limit | Enforces a length constraint |
| TEXT | Variable-length, unlimited | PostgreSQL stores VARCHAR and TEXT identically internally; no real performance difference |
Ans - In PostgreSQL, VARCHAR and TEXT perform the same internally — VARCHAR simply adds a length check. CHAR pads values with trailing spaces to a fixed length, which can cause subtle bugs in comparisons. Most PostgreSQL developers prefer TEXT unless a strict length limit is a business rule.  

012 - What is a Primary Key?  
Ans - A Primary Key uniquely identifies each row in a table. It cannot contain NULL values and a table can have only one primary key (which may be a composite of multiple columns).  
Example:  
```sql
CREATE TABLE departments (
  department_id SERIAL PRIMARY KEY,
  department_name TEXT NOT NULL
);
```

013 - What is a Foreign Key?  
Ans - A Foreign Key is a column (or set of columns) in one table that references the Primary Key of another table, enforcing referential integrity between the two tables.  
Example:  
```sql
CREATE TABLE employees (
  emp_id SERIAL PRIMARY KEY,
  name TEXT,
  department_id INT REFERENCES departments(department_id)
);
```

014 - What is a UNIQUE constraint? How is it different from a Primary Key?  
Ans - UNIQUE ensures all values in a column (or column group) are distinct. Unlike a Primary Key, a table can have multiple UNIQUE constraints, and UNIQUE columns can accept a single NULL (or multiple NULLs, since PostgreSQL treats NULLs as distinct from each other).  
| Feature | Primary Key | Unique |
|---|---|---|
| NULLs allowed | No | Yes |
| Count per table | One | Multiple |
| Auto-indexed | Yes | Yes |

015 - What is the NOT NULL constraint?  
Ans - NOT NULL ensures a column must always contain a value; it rejects any attempt to insert or update a row with a NULL in that column.  
Example:  
```sql
ALTER TABLE employees ALTER COLUMN name SET NOT NULL;
```

016 - What is the CHECK constraint?  
Ans - CHECK enforces a custom boolean condition that every row must satisfy.  
Example:  
```sql
ALTER TABLE employees ADD CONSTRAINT salary_positive CHECK (salary > 0);
```

017 - What is the DEFAULT constraint?  
Ans - DEFAULT specifies a value automatically used for a column when no value is provided during INSERT.  
Example:  
```sql
ALTER TABLE employees ALTER COLUMN join_date SET DEFAULT CURRENT_DATE;
```

018 - How do you create a table in PostgreSQL? (CREATE TABLE)  
Ans - CREATE TABLE defines a new table along with its columns, data types, and constraints.  
Example:  
```sql
CREATE TABLE employees (
  emp_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INT,
  salary NUMERIC(10,2) DEFAULT 0,
  join_date DATE DEFAULT CURRENT_DATE
);
```

019 - How do you modify an existing table? (ALTER TABLE)  
Ans - ALTER TABLE changes a table's structure — adding/dropping columns, renaming, changing data types, or adding constraints.  
Example:  
```sql
ALTER TABLE employees ADD COLUMN email TEXT;
ALTER TABLE employees RENAME COLUMN email TO work_email;
ALTER TABLE employees DROP COLUMN work_email;
ALTER TABLE employees ALTER COLUMN salary TYPE NUMERIC(12,2);
```

020 - What is the difference between DELETE, TRUNCATE, and DROP?  
| Command | Type | Removes | Rollback? | Resets identity/sequence | Fires triggers |
|---|---|---|---|---|---|
| DELETE | DML | Specific rows (WHERE optional) | Yes (in transaction) | No | Yes |
| TRUNCATE | DDL | All rows | Yes (PostgreSQL supports it in a transaction) | Yes | Only with special TRUNCATE triggers |
| DROP | DDL | The entire table structure + data | Yes (in transaction) | N/A (table is gone) | No |
Ans - DELETE removes rows one at a time and can be filtered with WHERE, but is slower for large tables. TRUNCATE quickly removes all rows by deallocating pages and resets any associated sequence, but cannot use WHERE. DROP removes the table object itself, including its schema, indexes, and constraints.  

021 - How do you insert data into a table?  
Ans - Use INSERT INTO with column names and matching values.  
Example:  
```sql
INSERT INTO employees (name, department_id, salary) VALUES ('Ravi', 1, 55000);
INSERT INTO employees (name, department_id, salary) VALUES ('Meera', 2, 62000), ('Kabir', 1, 48000);
```

022 - How do you update existing records?  
Ans - UPDATE modifies existing rows; always use WHERE to target specific rows, or all rows will be updated.  
Example:  
```sql
UPDATE employees SET salary = salary * 1.05 WHERE department_id = 1;
```

023 - How do you delete records from a table?  
Ans - DELETE removes rows matching a condition; omitting WHERE deletes every row.  
Example:  
```sql
DELETE FROM employees WHERE join_date < '2020-01-01';
```

024 - What is the SELECT statement used for?  
Ans - SELECT retrieves data from one or more tables, optionally filtering, sorting, grouping, and joining.  
Example:  
```sql
SELECT name, salary FROM employees ORDER BY salary DESC;
```

025 - What is the WHERE clause used for?  
Ans - WHERE filters rows before any grouping happens, based on a boolean condition. Rows that don't satisfy the condition are excluded from the result.  
Example:  
```sql
SELECT * FROM employees WHERE salary > 50000 AND department_id = 1;
```

026 - What is the ORDER BY clause?  
Ans - ORDER BY sorts the result set by one or more columns, ascending (ASC, default) or descending (DESC).  
Example:  
```sql
SELECT name, salary FROM employees ORDER BY salary DESC, name ASC;
```

027 - What are aggregate functions in SQL?  
Ans - Aggregate functions compute a single summary value from multiple rows. Common ones: COUNT(), SUM(), AVG(), MIN(), MAX().  
Example:  
```sql
SELECT COUNT(*) AS total_employees, AVG(salary) AS avg_salary FROM employees;
```

028 - What is the GROUP BY clause?  
Ans - GROUP BY groups rows sharing the same value(s) in specified columns so aggregate functions can be applied per group instead of the whole table.  
Example:  
```sql
SELECT department_id, COUNT(*), AVG(salary)
FROM employees
GROUP BY department_id;
```

029 - What is the HAVING clause, and how is it different from WHERE?  
Ans - HAVING filters groups after aggregation, while WHERE filters individual rows before aggregation. You can use aggregate functions in HAVING but not in WHERE.  
| Clause | Applied to | Runs | Can use aggregates? |
|---|---|---|---|
| WHERE | Individual rows | Before GROUP BY | No |
| HAVING | Groups | After GROUP BY | Yes |
Example:  
```sql
SELECT department_id, AVG(salary) AS avg_sal
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 55000;
```

030 - What is DISTINCT used for?  
Ans - DISTINCT removes duplicate rows from the result set, considering all selected columns together.  
Example:  
```sql
SELECT DISTINCT department_id FROM employees;
```
---
## Intermediate (031–070)

031 - What do LIMIT and OFFSET do?  
Ans - LIMIT restricts the number of rows returned; OFFSET skips a specified number of rows before returning results. They're commonly combined for pagination.  
Example:  
```sql
SELECT * FROM employees ORDER BY emp_id LIMIT 10 OFFSET 20; -- page 3, 10 rows per page
```

032 - How does the LIKE operator work?  
Ans - LIKE performs pattern matching on strings using wildcards: `%` matches any sequence of characters, `_` matches exactly one character. PostgreSQL also offers `ILIKE` for case-insensitive matching.  
Example:  
```sql
SELECT * FROM employees WHERE name LIKE 'A%';   -- starts with A
SELECT * FROM employees WHERE name ILIKE '%sha'; -- ends with 'sha', case-insensitive
```

033 - How does the IN operator work?  
Ans - IN checks whether a value matches any value in a given list or subquery result, simplifying multiple OR conditions.  
Example:  
```sql
SELECT * FROM employees WHERE department_id IN (1, 2, 3);
```

034 - How does the BETWEEN operator work?  
Ans - BETWEEN checks if a value lies within an inclusive range.  
Example:  
```sql
SELECT * FROM employees WHERE salary BETWEEN 40000 AND 70000;
```

035 - How does IS NULL / IS NOT NULL work, and how does NULL behave in comparisons?  
Ans - NULL represents an unknown/missing value. You must use `IS NULL` or `IS NOT NULL` to test for it — using `= NULL` always returns unknown (treated as false) because NULL isn't equal to anything, including itself. Any arithmetic or comparison involving NULL also yields NULL.  
Example:  
```sql
SELECT * FROM employees WHERE manager_id IS NULL;
```

036 - What is the CASE expression used for?  
Ans - CASE adds conditional (if/else-like) logic inside SQL queries, returning different values based on conditions.  
Example:  
```sql
SELECT name, salary,
  CASE
    WHEN salary >= 70000 THEN 'High'
    WHEN salary >= 50000 THEN 'Medium'
    ELSE 'Low'
  END AS salary_band
FROM employees;
```

037 - What are Joins? What types does SQL support?  
Ans - A JOIN combines rows from two or more tables based on a related column. Common types: INNER JOIN (matching rows only), LEFT JOIN (all left rows + matches), RIGHT JOIN (all right rows + matches), FULL OUTER JOIN (all rows from both sides), CROSS JOIN (cartesian product), and SELF JOIN (a table joined with itself).  

038 - What is an INNER JOIN?  
Ans - INNER JOIN returns only rows where there's a match in both tables based on the join condition.  
Example:  
```sql
SELECT e.name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id;
```

039 - What is a LEFT JOIN (LEFT OUTER JOIN)?  
Ans - LEFT JOIN returns all rows from the left table, and matching rows from the right table; unmatched right-side columns are NULL. It's often used to find rows in one table that have no related record.  
Example:  
```sql
SELECT e.name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id;
```

040 - What is a RIGHT JOIN?  
Ans - RIGHT JOIN returns all rows from the right table and matching rows from the left; unmatched left-side columns are NULL. It's the mirror of LEFT JOIN and is less commonly used since swapping table order with LEFT JOIN achieves the same result.  
Example:  
```sql
SELECT e.name, d.department_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.department_id;
```

041 - What is a FULL OUTER JOIN?  
Ans - FULL OUTER JOIN returns all rows from both tables, matching where possible and filling with NULL where there's no match on either side.  
Example:  
```sql
SELECT e.name, d.department_name
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.department_id;
```

042 - What is a CROSS JOIN?  
Ans - CROSS JOIN returns the Cartesian product — every row of the first table combined with every row of the second. No join condition is used.  
Example:  
```sql
SELECT e.name, s.shift_name
FROM employees e
CROSS JOIN shifts s;
```

043 - What is a SELF JOIN?  
Ans - A SELF JOIN joins a table to itself, typically using aliases, to compare rows within the same table — e.g., finding employees and their managers who are also in the employees table.  
Example:  
```sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
```

044 - What is a subquery?  
Ans - A subquery is a query nested inside another query, used in SELECT, WHERE, FROM, or with operators like IN/EXISTS. It's evaluated first (for non-correlated cases) and its result is used by the outer query.  
Example:  
```sql
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

045 - What is the difference between a correlated and a non-correlated subquery?  
Ans - A non-correlated subquery runs independently of the outer query and executes once. A correlated subquery references a column from the outer query, so it re-executes once per outer row — useful for row-by-row comparisons but potentially slower.  
Example:  
```sql
-- Correlated: references outer table 'e'
SELECT e.name, e.salary
FROM employees e
WHERE e.salary > (
  SELECT AVG(salary) FROM employees WHERE department_id = e.department_id
);
```

046 - What is the difference between EXISTS and IN?  
Ans - EXISTS checks only for the presence of any matching row in a subquery and stops early once one is found — it works well with correlated subqueries and handles NULLs safely. IN compares a value against a list; it can behave unexpectedly if the subquery result contains NULL (an entire NOT IN can return no rows). For large subquery result sets, EXISTS is generally more efficient and predictable.  
Example:  
```sql
SELECT d.department_name
FROM departments d
WHERE EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id);
```

047 - What is a CTE (Common Table Expression)?  
Ans - A CTE, defined with the WITH clause, creates a named, temporary result set that can be referenced later in the same query. It improves readability by breaking complex queries into logical steps.  
Example:  
```sql
WITH high_earners AS (
  SELECT * FROM employees WHERE salary > 60000
)
SELECT department_id, COUNT(*) FROM high_earners GROUP BY department_id;
```

048 - What is a Recursive CTE? Give an example.  
Ans - A recursive CTE calls itself repeatedly to process hierarchical or graph-like data (e.g., org charts, category trees). It has an anchor member (base case) and a recursive member (referencing the CTE itself), combined with UNION ALL.  
Example:  
```sql
WITH RECURSIVE org_chart AS (
  SELECT emp_id, name, manager_id, 1 AS level
  FROM employees
  WHERE manager_id IS NULL          -- anchor: top-level employees
  UNION ALL
  SELECT e.emp_id, e.name, e.manager_id, oc.level + 1
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.emp_id   -- recursive step
)
SELECT * FROM org_chart ORDER BY level;
```

049 - What is the difference between UNION and UNION ALL?  
Ans - UNION combines results from two queries and removes duplicate rows (which requires an internal sort/dedupe, adding overhead). UNION ALL combines results and keeps all rows, including duplicates, making it faster. Both require the queries to have the same number of columns with compatible types.  
Example:  
```sql
SELECT name FROM employees WHERE department_id = 1
UNION ALL
SELECT name FROM employees WHERE department_id = 2;
```

050 - What do INTERSECT and EXCEPT do?  
Ans - INTERSECT returns only rows common to both queries. EXCEPT returns rows present in the first query but not in the second. Both remove duplicates by default.  
Example:  
```sql
SELECT emp_id FROM project_a_team
EXCEPT
SELECT emp_id FROM project_b_team;   -- employees only in project A
```

051 - What are Window functions?  
Ans - Window functions perform calculations across a set of rows ("window") related to the current row, without collapsing rows like GROUP BY does. They're defined with an OVER() clause, optionally using PARTITION BY and ORDER BY.  
Example:  
```sql
SELECT name, department_id, salary,
  AVG(salary) OVER (PARTITION BY department_id) AS dept_avg
FROM employees;
```

052 - What does PARTITION BY do in a window function?  
Ans - PARTITION BY divides rows into groups (partitions) for the window function to operate on independently, similar to GROUP BY, but without merging rows into one per group — every original row is retained.  
Example:  
```sql
SELECT name, department_id, salary,
  RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dept_rank
FROM employees;
```

053 - What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?  
| Function | Ties handled how | Gaps after ties? |
|---|---|---|
| ROW_NUMBER() | Assigns a unique sequential number regardless of ties | No gaps, but ties get arbitrary distinct numbers |
| RANK() | Same rank for ties | Leaves gaps in the sequence (e.g., 1,2,2,4) |
| DENSE_RANK() | Same rank for ties | No gaps (e.g., 1,2,2,3) |
Ans - All three assign a position to rows within a partition ordered by some column, but they differ in how tied values are ranked, as shown above.  
Example:  
```sql
SELECT name, salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn,
  RANK()       OVER (ORDER BY salary DESC) AS rnk,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS d_rnk
FROM employees;
```

054 - What do LEAD() and LAG() do?  
Ans - LEAD() accesses a value from a following row, and LAG() accesses a value from a preceding row, within the same result set — useful for comparing a row to the previous/next one (e.g., month-over-month change).  
Example:  
```sql
SELECT name, join_date,
  LAG(join_date) OVER (ORDER BY join_date) AS previous_join_date
FROM employees;
```

055 - What is a transaction, and what does ACID mean?  
Ans - A transaction is a sequence of one or more SQL operations executed as a single logical unit — either all succeed or none do. ACID describes the guarantees: **Atomicity** (all-or-nothing), **Consistency** (data moves between valid states), **Isolation** (concurrent transactions don't interfere improperly), **Durability** (once committed, changes survive crashes).  
Example:  
```sql
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;
```

056 - What do COMMIT, ROLLBACK, and SAVEPOINT do?  
Ans - COMMIT permanently saves all changes made in the current transaction. ROLLBACK undoes all changes since the transaction began (or since a SAVEPOINT). SAVEPOINT marks a point within a transaction that you can roll back to without discarding the entire transaction.  
Example:  
```sql
BEGIN;
UPDATE employees SET salary = salary + 1000 WHERE department_id = 1;
SAVEPOINT before_bonus;
UPDATE employees SET salary = salary + 5000 WHERE department_id = 2;
ROLLBACK TO SAVEPOINT before_bonus;  -- undoes only the second update
COMMIT;
```

057 - What is an index, and how does it improve performance?  
Ans - An index is a separate data structure that stores a sorted reference to column values and their row locations, allowing the database to find rows without scanning the whole table (similar to a book's index). Indexes speed up lookups, joins, and sorting but add overhead to writes (INSERT/UPDATE/DELETE) since the index must also be updated.  
Example:  
```sql
CREATE INDEX idx_employees_department_id ON employees(department_id);
```

058 - What are the main PostgreSQL index types (B-Tree and others)?  
Ans - **B-Tree** (default) — great for equality and range queries (`=`, `<`, `>`, `BETWEEN`, sorting). **Hash** — optimized for pure equality lookups. **GIN** (Generalized Inverted Index) — good for indexing composite values like arrays, JSONB, and full-text search. **GiST** (Generalized Search Tree) — used for geometric data, ranges, and nearest-neighbor searches. **BRIN** (Block Range Index) — very small, efficient for huge tables with naturally sorted data (e.g., timestamps in an append-only log table).  
Example:  
```sql
CREATE INDEX idx_data_gin ON products USING GIN (tags);
```

059 - What are EXPLAIN and EXPLAIN ANALYZE used for?  
Ans - EXPLAIN shows PostgreSQL's query execution plan — how it intends to retrieve data (sequential scan, index scan, join method, estimated cost) — without running the query. EXPLAIN ANALYZE actually executes the query and shows real timing and row counts alongside the plan, which is essential for diagnosing slow queries.  
Example:  
```sql
EXPLAIN ANALYZE
SELECT * FROM employees WHERE department_id = 1;
```

060 - What is a View?  
Ans - A View is a saved, named SELECT query that behaves like a virtual table. It doesn't store data itself (except materialized views); it re-runs the underlying query each time it's referenced, simplifying complex or repeated queries and restricting exposed columns.  
Example:  
```sql
CREATE VIEW high_earners AS
SELECT name, salary, department_id FROM employees WHERE salary > 60000;
SELECT * FROM high_earners;
```

061 - What is a Materialized View, and how is it different from a View?  
Ans - A Materialized View stores the query's result physically on disk, like a snapshot, so reading from it is fast and doesn't re-run the underlying query. It must be manually or periodically refreshed (`REFRESH MATERIALIZED VIEW`) to reflect underlying data changes, unlike a regular view which is always current but recomputed on each access.  
Example:  
```sql
CREATE MATERIALIZED VIEW dept_salary_summary AS
SELECT department_id, AVG(salary) AS avg_salary FROM employees GROUP BY department_id;
REFRESH MATERIALIZED VIEW dept_salary_summary;
```

062 - What are Sequences in PostgreSQL?  
Ans - A sequence is a database object that generates a series of unique numeric values, commonly used to auto-generate primary keys.  
Example:  
```sql
CREATE SEQUENCE emp_id_seq START 1 INCREMENT 1;
SELECT nextval('emp_id_seq');
```

063 - What is the difference between SERIAL and GENERATED ... AS IDENTITY columns?  
Ans - SERIAL is PostgreSQL's older shorthand that creates an integer column backed by a sequence with a DEFAULT expression. `GENERATED AS IDENTITY` is the newer, SQL-standard-compliant way to achieve auto-incrementing columns, and it's the recommended approach because it prevents accidentally overriding the generated value and integrates better with tooling.  
Example:  
```sql
CREATE TABLE orders (
  order_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_date DATE
);
```

064 - What is a Function (stored function) in PostgreSQL?  
Ans - A function is reusable, precompiled logic stored in the database that accepts parameters, performs computation or queries, and returns a value or table. PostgreSQL supports functions in SQL, PL/pgSQL, and other procedural languages.  
Example:  
```sql
CREATE FUNCTION get_employee_count(dept_id INT)
RETURNS INT AS $$
  SELECT COUNT(*) FROM employees WHERE department_id = dept_id;
$$ LANGUAGE sql;
SELECT get_employee_count(1);
```

065 - What is a Procedure, and how is it different from a Function?  
Ans - A Procedure (introduced in PostgreSQL 11 via `CREATE PROCEDURE`) is invoked with `CALL` and, unlike a function, can manage its own transactions internally (COMMIT/ROLLBACK within its body). Functions must return a value and can't control transactions; they're called as part of a SQL expression.  
Example:  
```sql
CREATE PROCEDURE give_raise(emp INT, amount NUMERIC)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE employees SET salary = salary + amount WHERE emp_id = emp;
  COMMIT;
END;
$$;
CALL give_raise(101, 5000);
```

066 - What is a Trigger?  
Ans - A trigger is a function automatically executed by the database in response to an event (INSERT, UPDATE, DELETE) on a table, either BEFORE or AFTER the event, and either for each row or once per statement. Triggers are useful for auditing, enforcing complex business rules, or maintaining derived data.  
Example:  
```sql
CREATE FUNCTION log_salary_change() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO salary_audit(emp_id, old_salary, new_salary, changed_at)
  VALUES (OLD.emp_id, OLD.salary, NEW.salary, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_salary_audit
AFTER UPDATE OF salary ON employees
FOR EACH ROW EXECUTE FUNCTION log_salary_change();
```

067 - What is the difference between JSON and JSONB in PostgreSQL?  
Ans - JSON stores an exact text copy of the input, preserving whitespace and key order, and is parsed on every read. JSONB stores data in a decomposed binary format — it's slightly slower to write (due to parsing on insert) but much faster to query, supports indexing (GIN), and doesn't preserve key order or whitespace. JSONB is recommended for almost all use cases.  
Example:  
```sql
CREATE TABLE products (id SERIAL PRIMARY KEY, details JSONB);
INSERT INTO products (details) VALUES ('{"color": "red", "size": "M"}');
SELECT details->>'color' AS color FROM products WHERE details @> '{"size": "M"}';
```

068 - What are Arrays in PostgreSQL, and how are they used?  
Ans - PostgreSQL allows columns to store arrays of any base type, letting you keep a list of values in a single field without a separate join table (useful for tags, for example).  
Example:  
```sql
CREATE TABLE articles (id SERIAL PRIMARY KEY, tags TEXT[]);
INSERT INTO articles (tags) VALUES (ARRAY['sql', 'postgres', 'backend']);
SELECT * FROM articles WHERE 'postgres' = ANY(tags);
```

069 - What is Normalization? Briefly explain 1NF, 2NF, and 3NF.  
Ans - Normalization organizes tables to reduce data redundancy and prevent update anomalies. **1NF** — each column holds atomic (indivisible) values, no repeating groups. **2NF** — meets 1NF and every non-key column depends on the whole primary key (relevant for composite keys). **3NF** — meets 2NF and no non-key column depends on another non-key column (removes transitive dependencies). Higher normal forms exist (BCNF, 4NF) but 3NF is the common interview benchmark.  

070 - What are the types of relationships (1:1, 1:N, N:M), and how are they implemented?  
Ans - **One-to-One**: a foreign key with a UNIQUE constraint on the referencing table. **One-to-Many**: a foreign key on the "many" side referencing the "one" side's primary key (e.g., one department has many employees). **Many-to-Many**: implemented using a junction/bridge table holding foreign keys to both related tables.  
Example:  
```sql
CREATE TABLE student_courses (
  student_id INT REFERENCES students(id),
  course_id INT REFERENCES courses(id),
  PRIMARY KEY (student_id, course_id)
);
```
---
## Advanced (071–100)

071 - What is MVCC (Multi-Version Concurrency Control) in PostgreSQL?  
Ans - MVCC allows PostgreSQL to handle concurrent reads and writes without blocking readers against writers. Instead of locking rows for reads, each transaction sees a consistent "snapshot" of the data — updates create new row versions rather than overwriting in place, and old versions are later cleaned up by VACUUM.  

072 - What are Transaction Isolation Levels? Explain each.  
Ans - Isolation levels control how much one transaction can see of another's uncommitted or concurrent changes. PostgreSQL supports:  
- **Read Uncommitted** — treated the same as Read Committed in PostgreSQL (dirty reads not actually allowed).
- **Read Committed** (default) — each statement sees only data committed before it began.
- **Repeatable Read** — the entire transaction sees a consistent snapshot from its start; prevents non-repeatable reads.
- **Serializable** — strictest level; transactions behave as if executed one at a time, preventing all anomalies including phantom reads, at the cost of possible serialization failures requiring retries.

073 - What is a deadlock, and how does PostgreSQL handle it?  
Ans - A deadlock occurs when two or more transactions each hold a lock the other needs, so neither can proceed. PostgreSQL automatically detects deadlocks by checking for cycles in the wait graph and resolves them by aborting one of the transactions (raising an error), letting the application retry.  

074 - What is VACUUM and why is it needed in PostgreSQL?  
Ans - Because MVCC creates new row versions on UPDATE/DELETE rather than overwriting, old ("dead") row versions accumulate. VACUUM reclaims that space for reuse, updates statistics for the query planner, and prevents transaction ID wraparound issues. PostgreSQL runs autovacuum automatically in the background by default.  

075 - What is the difference between VACUUM and VACUUM FULL?  
Ans - Plain VACUUM marks dead space as reusable within the existing table file without shrinking it on disk and doesn't require an exclusive lock (so the table stays usable). VACUUM FULL fully rewrites the table into a new, compact file, actually returning space to the OS — but it requires an exclusive lock, blocking reads/writes during the operation.  

076 - What are the table partitioning strategies in PostgreSQL?  
Ans - Partitioning splits a large table into smaller physical pieces while it's queried as one logical table. PostgreSQL supports: **Range** partitioning (e.g., by date ranges), **List** partitioning (by discrete values, e.g., region), and **Hash** partitioning (evenly distributing rows by a hash). Partitioning improves performance and manageability for very large tables, especially with partition pruning during queries.  
Example:  
```sql
CREATE TABLE sales (id INT, sale_date DATE, amount NUMERIC) PARTITION BY RANGE (sale_date);
CREATE TABLE sales_2025 PARTITION OF sales FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

077 - What is a Foreign Data Wrapper (FDW)?  
Ans - An FDW is a PostgreSQL extension mechanism that lets you query external data sources (another PostgreSQL database, MySQL, a CSV file, etc.) as if they were local tables, using extensions like `postgres_fdw`.  
Example:  
```sql
CREATE EXTENSION postgres_fdw;
CREATE SERVER remote_db FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host 'other_host', dbname 'sales');
```

078 - What is Full Text Search in PostgreSQL?  
Ans - Full Text Search allows efficient natural-language search over text columns using `tsvector` (a preprocessed, searchable document) and `tsquery` (a search expression), typically backed by a GIN index for speed — far more capable than a plain `LIKE '%word%'` search.  
Example:  
```sql
SELECT title FROM articles
WHERE to_tsvector('english', body) @@ to_tsquery('postgres & performance');
```

079 - What are common JSONB operators in PostgreSQL?  
Ans - Key operators: `->` returns a JSON field as JSON, `->>` returns it as text, `#>` extracts a nested value by path as JSON, `#>>` as text, `@>` checks if the left JSONB contains the right JSONB, and `?` checks if a key exists.  
Example:  
```sql
SELECT details->>'color' FROM products WHERE details @> '{"size": "M"}';
```

080 - How do you index JSONB columns for fast queries?  
Ans - Use a GIN index on the JSONB column, which supports containment (`@>`) and key-existence (`?`) queries efficiently. For frequent lookups on a specific key, an expression (functional) B-Tree index on that extracted value can be even faster.  
Example:  
```sql
CREATE INDEX idx_products_details_gin ON products USING GIN (details);
CREATE INDEX idx_products_color ON products ((details->>'color'));
```

081 - How do you find the second-highest salary in a table?  
Ans - Several approaches work; a common, index-friendly one uses `DENSE_RANK()` or a subquery with `LIMIT`/`OFFSET`.  
Example:  
```sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
OFFSET 1 LIMIT 1;
-- Alternative using window functions (handles ties correctly by rank)
SELECT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) ranked
WHERE rnk = 2;
```
The `DENSE_RANK` version correctly returns the true "2nd distinct salary level" even when multiple employees tie for the highest salary, whereas `OFFSET/LIMIT` on distinct values also works but is less flexible if you need the Nth rank with ties elsewhere.

082 - How do you find the Nth highest salary?  
Ans - Generalize the DENSE_RANK approach by parameterizing N.  
Example:  
```sql
SELECT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) ranked
WHERE rnk = 3;   -- 3rd highest salary
```

083 - How do you find duplicate records in a table?  
Ans - Group by the columns that define a "duplicate" and filter groups with more than one row using HAVING.  
Example:  
```sql
SELECT email, COUNT(*)
FROM employees
GROUP BY email
HAVING COUNT(*) > 1;
```

084 - How do you delete duplicate rows while keeping only one copy?  
Ans - Use `ROW_NUMBER()` to rank duplicates and delete everything except rank 1, or delete based on `ctid` (PostgreSQL's internal row identifier).  
Example:  
```sql
DELETE FROM employees a
USING employees b
WHERE a.ctid < b.ctid
  AND a.email = b.email;   -- keeps the row with the largest ctid, removes the rest
```

085 - How do you find employees who don't belong to any department?  
Ans - Use a LEFT JOIN and filter for NULL on the right side, or use NOT EXISTS.  
Example:  
```sql
SELECT e.name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id
WHERE d.department_id IS NULL;
-- Equivalent using NOT EXISTS
SELECT e.name
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM departments d WHERE d.department_id = e.department_id
);
```

086 - How do you find the top 3 salaries in each department?  
Ans - Use `DENSE_RANK()` (or `ROW_NUMBER()`) partitioned by department, then filter.  
Example:  
```sql
SELECT * FROM (
  SELECT name, department_id, salary,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk
  FROM employees
) ranked
WHERE rnk <= 3;
```

087 - How do you find employees earning more than their department's average salary?  
Ans - A correlated subquery compares each employee's salary against the average for their own department.  
Example:  
```sql
SELECT e.name, e.department_id, e.salary
FROM employees e
WHERE e.salary > (
  SELECT AVG(salary) FROM employees e2 WHERE e2.department_id = e.department_id
);
-- Equivalent using a window function (often faster, single pass)
SELECT name, department_id, salary FROM (
  SELECT name, department_id, salary,
    AVG(salary) OVER (PARTITION BY department_id) AS dept_avg
  FROM employees
) t
WHERE salary > dept_avg;
```

088 - How do you calculate a running total using window functions?  
Ans - Use `SUM()` as a window function ordered by the relevant column, with the default frame (`RANGE UNBOUNDED PRECEDING`) accumulating the total row by row.  
Example:  
```sql
SELECT order_date, amount,
  SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;
```

089 - How do you find gaps in a sequence of numbers or dates?  
Ans - Compare each value to the previous one (using LAG) and flag rows where the difference is greater than 1 (or more than one day for dates).  
Example:  
```sql
SELECT id, prev_id, id - prev_id AS gap_size
FROM (
  SELECT id, LAG(id) OVER (ORDER BY id) AS prev_id
  FROM sequence_table
) t
WHERE id - prev_id > 1;
```

090 - How do you pivot rows into columns in PostgreSQL?  
Ans - PostgreSQL doesn't have a native `PIVOT` keyword like some databases, but you can pivot manually using conditional aggregation with `CASE` inside aggregate functions, or use the `crosstab()` function from the `tablefunc` extension for dynamic pivoting.  
Example:  
```sql
SELECT department_id,
  SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS male_count,
  SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS female_count
FROM employees
GROUP BY department_id;
```

091 - How do you find "islands" of consecutive values (streaks) in a table?  
Ans - A classic technique: subtract a `ROW_NUMBER()` from the ordered value itself — rows in the same consecutive run will produce the same difference, which can then be used as a grouping key.  
Example:  
```sql
SELECT emp_id, work_date,
  work_date - (ROW_NUMBER() OVER (PARTITION BY emp_id ORDER BY work_date))::int AS grp
FROM attendance;
-- Rows with the same 'grp' value per emp_id form one consecutive streak of dates.
```

092 - What is the difference between ON DELETE CASCADE and ON DELETE SET NULL for foreign keys?  
Ans - Both define what happens to child rows when a referenced parent row is deleted. `ON DELETE CASCADE` automatically deletes the dependent child rows too. `ON DELETE SET NULL` keeps the child rows but sets the foreign key column to NULL. Other options include `RESTRICT` (block the delete if children exist, the default-like behavior) and `SET DEFAULT`.  
Example:  
```sql
CREATE TABLE employees (
  emp_id SERIAL PRIMARY KEY,
  department_id INT REFERENCES departments(department_id) ON DELETE CASCADE
);
```

093 - What is query planning and cost estimation in PostgreSQL?  
Ans - The query planner evaluates multiple possible execution strategies (sequential scan, index scan, different join algorithms like nested loop, hash join, merge join) and estimates their "cost" based on table statistics (row counts, data distribution) gathered by `ANALYZE`. It picks the plan with the lowest estimated cost. `EXPLAIN` output shows estimated cost, rows, and width for each plan node; `EXPLAIN ANALYZE` adds actual execution time and row counts, helping identify where estimates diverge from reality (often the root cause of a bad plan).  

094 - What are covering indexes and INCLUDE columns in PostgreSQL?  
Ans - A covering index contains all the columns a query needs, so PostgreSQL can answer the query using only the index without touching the table (an "index-only scan"). The `INCLUDE` clause lets you add extra columns to an index purely for this purpose, without making them part of the index's sort/search key, keeping the index smaller and more efficient than including them in the key itself.  
Example:  
```sql
CREATE INDEX idx_employees_dept_covering
  ON employees (department_id) INCLUDE (name, salary);
```

095 - What is the N+1 query problem, and how do you avoid it in PostgreSQL?  
Ans - The N+1 problem occurs when an application fetches a list of N parent records, then issues a separate query for each one's related data (N additional queries), instead of fetching everything in a single query. It's common in ORMs. It's avoided by using JOINs, batching with `WHERE id IN (...)`, or using ORM features like eager loading to fetch related data in one round trip.  
Example:  
```sql
-- Instead of one query per employee to get their department:
SELECT e.*, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;
```

096 - What is connection pooling, and why does it matter for PostgreSQL applications?  
Ans - Each PostgreSQL connection consumes memory and a backend process, so opening a new connection per request is expensive and doesn't scale well under high concurrency. Connection pooling (e.g., via PgBouncer, or built into ORMs/app frameworks) reuses a limited set of established connections across many client requests, drastically reducing connection overhead and improving throughput.  

097 - What does the CLUSTER command do, and how does it relate to clustered indexes in other databases?  
Ans - Unlike databases such as SQL Server where a clustered index physically orders table data continuously, PostgreSQL tables are normally stored in insertion order (a heap) regardless of indexes. The `CLUSTER` command physically reorders a table's rows on disk to match a specified index's order, which can improve performance for range queries on that index — but it's a one-time operation; new rows aren't automatically kept in that order afterward.  
Example:  
```sql
CLUSTER employees USING idx_employees_department_id;
```

098 - How do you approach optimizing a slow query in PostgreSQL?  
Ans - A practical checklist:  
1. Run `EXPLAIN ANALYZE` to see the actual execution plan and spot sequential scans on large tables, or misestimated row counts.
2. Ensure appropriate indexes exist on filter, join, and sort columns.
3. Run `ANALYZE` to keep table statistics current so the planner makes good choices.
4. Avoid `SELECT *`; fetch only needed columns.
5. Rewrite inefficient correlated subqueries as joins or window functions where possible.
6. Check for missing or unused indexes, and for bloat needing `VACUUM`.
7. Consider partitioning or materialized views for very large, repeatedly-aggregated datasets.

099 - What are common causes of performance issues in large PostgreSQL tables, and how do you fix them?  
Ans - Common causes: missing indexes on frequently filtered/joined columns; table/index bloat from insufficient vacuuming; outdated planner statistics; overly broad queries (`SELECT *`, no LIMIT); poor schema design causing excessive joins; and lock contention from long-running transactions. Fixes include adding targeted indexes, tuning autovacuum settings, running `ANALYZE` regularly, partitioning very large tables, caching frequent aggregate results in materialized views, and keeping transactions short.  

100 - What is database normalization vs. denormalization, and when would you denormalize?  
Ans - Normalization reduces redundancy by splitting data into related tables (improves data integrity, reduces update anomalies), while denormalization intentionally introduces redundancy — merging tables or duplicating data — to reduce the number of joins needed for read-heavy workloads. You'd denormalize when read performance is critical and joins are a proven bottleneck (e.g., reporting/analytics systems, high-traffic read paths), accepting the trade-off of more complex writes and potential data inconsistency if not carefully managed.  
---

## Most Important 20 Questions to Revise Before an Interview

- 011 - What is the difference between CHAR, VARCHAR, and TEXT?
- 012 - What is a Primary Key?
- 020 - What is the difference between DELETE, TRUNCATE, and DROP?
- 029 - What is the HAVING clause, and how is it different from WHERE?
- 037 - What are Joins? What types does SQL support?
- 044 - What is a subquery?
- 046 - What is the difference between EXISTS and IN?
- 047 - What is a CTE (Common Table Expression)?
- 048 - What is a Recursive CTE? Give an example.
- 049 - What is the difference between UNION and UNION ALL?
- 051 - What are Window functions?
- 053 - What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?
- 055 - What is a transaction, and what does ACID mean?
- 057 - What is an index, and how does it improve performance?
- 059 - What are EXPLAIN and EXPLAIN ANALYZE used for?
- 061 - What is a Materialized View, and how is it different from a View?
- 067 - What is the difference between JSON and JSONB in PostgreSQL?
- 081 - How do you find the second-highest salary in a table?
- 086 - How do you find the top 3 salaries in each department?
- 087 - How do you find employees earning more than their department's average salary?
