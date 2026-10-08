# SQL Clause: ORDER BY (Sort)

## What is the ORDER BY Clause?

In SQL, to "sort by" a specific value, you use the `ORDER BY` clause. The `ORDER BY` keyword is used to sort the result set of a query in either ascending or descending order based on one or more columns. By default, `ORDER BY` sorts the records in ascending order. To sort the records in descending order, you must explicitly use the `DESC` keyword.

# Examples & Usage

| Command / Format | Description | 
| ----- | ----- | 
| `SELECT * FROM users ORDER BY last_name;` | Sorts the retrieved records alphabetically by `last_name` in ascending order (default) | 
| `SELECT * FROM users ORDER BY age DESC;` | Sorts the retrieved records by `age` in descending order (highest to lowest) | 
| `SELECT * FROM employees ORDER BY department ASC, salary DESC;` | Sorts first by `department` (ascending), and then sorts by `salary` (descending) within each department | 
| `SELECT first_name, last_name FROM users ORDER BY 2;` | Sorts the result set by the second column in the `SELECT` list (which is `last_name`) | 
| `SELECT category, SUM(sales) FROM revenue GROUP BY category ORDER BY SUM(sales) DESC;` | Combines `GROUP BY` and `ORDER BY` to sort aggregated summary data | 

# Quick Reference Links

* [W3Schools SQL ORDER BY Keyword](https://www.w3schools.com/sql/sql_orderby.asp)

* [PostgreSQL Sorting Rows (ORDER BY) Documentation](https://www.postgresql.org/docs/current/queries-order.html)

* [MySQL ORDER BY Optimization](https://dev.mysql.com/doc/refman/8.0/en/order-by-optimization.html)

# Hyperlinks

| W3Schools SQL ORDER BY Keyword | https://www.w3schools.com/sql/sql_orderby.asp |
| PostgreSQL Sorting Rows (ORDER BY) Documentation | https://www.postgresql.org/docs/current/queries-order.html |
| MySQL ORDER BY Optimization | https://dev.mysql.com/doc/refman/8.0/en/order-by-optimization.html |

# Mouse Over Information

| Word | Information | 
| ----- | ----- | 
| ORDER BY | a SQL clause used to sort the result set of a query by one or more columns | 
| sort | the process of arranging data into a meaningful order, usually alphabetical or numerical | 
| ASC | ascending, a keyword used to sort data from lowest to highest or A to Z | 
| DESC | descending, a keyword used to sort data from highest to lowest or Z to A | 
| result set | the temporary table of rows returned by a database query | 
| SELECT | a SQL command used to retrieve data from a database, required when using ORDER BY | 
| clause | a distinct operational part of a SQL statement, such as SELECT, FROM, or ORDER BY | 
| column | a vertical set of data values of a particular type in a database table | 
| aggregate | a function (like SUM or COUNT) that performs a calculation on a set of values to return a single summary value | 

# Tags

`sql`, `orderby`, `sort`, `sortby`, `clause`, `database`, `relational`, `data-analysis`, `backend`, `programming`

# Dependencies

Relational Database Management System (RDBMS), MySQL, PostgreSQL, SQLite, SQL Server, Oracle Database, Database Engine