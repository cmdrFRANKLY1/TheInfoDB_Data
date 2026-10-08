# SQL Aggregate Function: COUNT

## What is the COUNT Function?

The `COUNT()` function is a standard SQL aggregate function that returns the number of rows in a result set that match a specified criterion. It is highly versatile and frequently used to find the total number of records in a table, the number of non-null values in a specific column, or the number of unique values when combined with the `DISTINCT` keyword. It is often paired with the `GROUP BY` clause to calculate totals for specific categories or groups.

# Examples & Usage

| Command / Format | Description | 
| ----- | ----- | 
| `SELECT COUNT(*) FROM users;` | Returns the total number of rows (records) in the `users` table, including those with NULL values | 
| `SELECT COUNT(email) FROM users;` | Returns the number of rows where the `email` column is not NULL | 
| `SELECT COUNT(DISTINCT country) FROM users;` | Returns the total number of unique, non-duplicate values in the `country` column | 
| `SELECT department, COUNT(id) FROM employees GROUP BY department;` | Groups employees by `department` and returns the total count of employees in each | 
| `SELECT COUNT(*) FROM orders WHERE status = 'shipped';` | Returns the total number of orders that have a 'shipped' status using the `WHERE` clause | 

# Quick Reference Links

* [W3Schools SQL COUNT() Function](https://www.w3schools.com/sql/sql_count_avg_sum.asp)

* [PostgreSQL Aggregate Functions Documentation](https://www.postgresql.org/docs/current/functions-aggregate.html)

* [MySQL COUNT() Aggregate Function](https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html#function_count)

# Hyperlinks

| W3Schools SQL COUNT() Function | https://www.w3schools.com/sql/sql_count_avg_sum.asp |
| PostgreSQL Aggregate Functions Documentation | https://www.postgresql.org/docs/current/functions-aggregate.html |
| MySQL COUNT() Aggregate Function | https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html#function_count |

# Mouse Over Information

| Word | Information | 
| ----- | ----- | 
| COUNT | an aggregate function that returns the number of rows matching a specified criterion | 
| aggregate function | a function that performs a calculation on a set of values and returns a single summary value | 
| NULL | a special marker used in SQL to indicate that a data value does not exist or is unknown | 
| DISTINCT | a keyword used within a query to return only unique, non-duplicate values | 
| GROUP BY | a SQL clause that groups rows with the same values into summary rows | 
| WHERE | a clause used to extract only those records that fulfill a specified condition | 
| result set | the temporary table of rows returned by a database query | 
| row | a single, structured data item in a table, also known as a record | 

# Tags

`sql`, `count`, `aggregate-function`, `math`, `database`, `relational`, `data-analysis`, `backend`, `programming`

# Dependencies

Relational Database Management System (RDBMS), MySQL, PostgreSQL, SQLite, SQL Server, Oracle Database, Database Engine