# Group By (SQL)

## What is the GROUP BY Clause?

The `GROUP BY` clause is used in SQL to arrange identical data into groups. It is most often used in conjunction with aggregate functions (such as `COUNT()`, `MAX()`, `MIN()`, `SUM()`, and `AVG()`) within a `SELECT` statement to group the result set by one or more columns. When you need to filter these newly grouped records, the `HAVING` clause is used instead of the standard `WHERE` clause.

# Examples & Usage

| Command / Format | Description | 
| ----- | ----- | 
| `SELECT country, COUNT(id) FROM users GROUP BY country;` | Groups users by `country` and returns the total count of users in each | 
| `SELECT department, SUM(salary) FROM employees GROUP BY department;` | Calculates the total sum of salaries for each `department` | 
| `SELECT status, AVG(age) FROM users GROUP BY status;` | Finds the average `age` of users, grouped by their account `status` | 
| `SELECT category, COUNT(id) FROM products GROUP BY category HAVING COUNT(id) > 10;` | Groups products by `category` but only returns groups with more than 10 items using the `HAVING` clause | 
| `SELECT year, month, SUM(sales) FROM revenue GROUP BY year, month;` | Groups data by multiple columns (`year` and `month`) to create highly specific summary rows | 

# Quick Reference Links

* [W3Schools SQL GROUP BY Statement](https://www.w3schools.com/sql/sql_groupby.asp)

* [PostgreSQL GROUP BY Documentation](https://www.postgresql.org/docs/current/sql-select.html#SQL-GROUPBY)

* [MySQL GROUP BY Handling](https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html)

# Hyperlinks

| W3Schools SQL GROUP BY Statement | https://www.w3schools.com/sql/sql_groupby.asp |
| PostgreSQL GROUP BY Documentation | https://www.postgresql.org/docs/current/sql-select.html#SQL-GROUPBY |
| MySQL GROUP BY Handling | https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html |

# Mouse Over Information

| Word | Information | 
| ----- | ----- | 
| GROUP BY | a SQL clause that groups rows with the same values into summary rows | 
| aggregate function | a function that performs a calculation on a set of values and returns a single summary value (e.g., SUM, COUNT) | 
| HAVING | a clause used to filter groups based on the results of aggregate functions, operating like a WHERE clause for grouped data | 
| SELECT | a SQL command used to retrieve data from a database, required when using GROUP BY | 
| COUNT | an aggregate function that returns the number of rows that match a specified criterion | 
| SUM | an aggregate function that returns the total mathematical sum of a numeric column | 
| AVG | an aggregate function that calculates and returns the average value of a numeric column | 
| clause | a distinct operational part of a SQL statement, such as SELECT, FROM, or GROUP BY | 
| result set | the temporary table of rows returned by a database query | 

# Tags

`sql`, `groupby`, `clause`, `aggregation`, `query`, `database`, `relational`, `data-analysis`, `backend`, `programming`

# Dependencies

Relational Database Management System (RDBMS), MySQL, PostgreSQL, SQLite, SQL Server, Oracle Database, Database Engine