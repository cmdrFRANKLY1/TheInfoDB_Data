# From (SQL)

## What is the FROM Clause?

The `FROM` clause is a mandatory component in most SQL data retrieval operations. It is used to specify the specific table, tables, or views from which data should be selected or manipulated. While most commonly associated with the `SELECT` statement, it is also a critical part of `DELETE` statements and provides the foundation for combining multiple tables using `JOIN` operations.

# Examples & Usage

| Command / Format | Description | 
| ----- | ----- | 
| `SELECT * FROM employees;` | Specifies `employees` as the source table to retrieve all records and columns | 
| `SELECT e.first_name, e.last_name FROM employees e;` | Uses a temporary table alias (`e`) for the `employees` table to make the query shorter and easier to read | 
| `SELECT * FROM users, orders;` | Retrieves data from both the `users` and `orders` tables, creating a Cartesian product (cross join) | 
| `DELETE FROM sessions WHERE status = 'expired';` | Specifies the `sessions` table as the target from which specific records will be removed | 
| `SELECT * FROM (SELECT id, name FROM users) AS subquery;` | Uses a nested subquery as the data source in the `FROM` clause instead of a standard table | 

# Quick Reference Links

* [W3Schools SQL SELECT (includes FROM)](https://www.w3schools.com/sql/sql_select.asp)

* [PostgreSQL FROM Clause Documentation](https://www.postgresql.org/docs/current/sql-select.html#SQL-FROM)

* [MySQL SELECT Statement Syntax](https://dev.mysql.com/doc/refman/8.0/en/select.html)

# Hyperlinks

| W3Schools SQL SELECT (includes FROM) | https://www.w3schools.com/sql/sql_select.asp |
| PostgreSQL FROM Clause Documentation | https://www.postgresql.org/docs/current/sql-select.html#SQL-FROM |
| MySQL SELECT Statement Syntax | https://dev.mysql.com/doc/refman/8.0/en/select.html |

# Mouse Over Information

| Word | Information | 
| ----- | ----- | 
| FROM | a SQL clause that specifies the table, view, or subquery to retrieve or manipulate data from | 
| clause | a distinct operational part of a SQL statement, such as SELECT, FROM, or WHERE | 
| table | a collection of data elements organized in rows and columns | 
| view | a virtual table whose contents are defined by the result of a stored SQL query | 
| alias | a temporary, shorthand name assigned to a table or column for the duration of a query | 
| query | a request for data or information from a database management system | 
| join | an operation that combines rows from two or more tables based on a related column between them | 
| subquery | a query nested inside another query, often used as a temporary data source | 
| Cartesian product | a mathematical operation that returns a result set mapping every row of one table to every row of another | 

# Tags

`sql`, `from`, `clause`, `query`, `database`, `relational`, `data-retrieval`, `backend`, `programming`, `tables`

# Dependencies

Relational Database Management System (RDBMS), MySQL, PostgreSQL, SQLite, SQL Server, Oracle Database, Database Engine