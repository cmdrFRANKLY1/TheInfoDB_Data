# Select (SQL)

## What is the SELECT Command?

The `SELECT` command is the fundamental statement in SQL's Data Query Language (DQL). It is used to fetch and retrieve data from one or more tables in a relational database. The retrieved data is stored in a temporary result table, often called a result set. `SELECT` is highly versatile and can be combined with numerous clauses (like `WHERE`, `GROUP BY`, and `ORDER BY`) to filter, aggregate, and sort the output.

# Examples & Usage

| Command / Format | Description | 
| ----- | ----- | 
| `SELECT * FROM users;` | Retrieves all columns and all records from the `users` table | 
| `SELECT first_name, last_name FROM users;` | Retrieves only the `first_name` and `last_name` columns | 
| `SELECT DISTINCT country FROM users;` | Retrieves unique (non-duplicate) values from the `country` column | 
| `SELECT * FROM users WHERE age >= 18;` | Filters the result set to include only records where the condition is met | 
| `SELECT * FROM users ORDER BY last_name ASC;` | Sorts the retrieved records alphabetically by `last_name` | 
| `SELECT COUNT(id), country FROM users GROUP BY country;` | Groups the data by `country` and calculates an aggregate count for each | 
| `SELECT * FROM users LIMIT 10;` | Restricts the query output to only the first 10 rows | 

# Quick Reference Links

* [W3Schools SQL SELECT Statement](https://www.w3schools.com/sql/sql_select.asp)

* [PostgreSQL SELECT Documentation](https://www.postgresql.org/docs/current/sql-select.html)

* [MySQL SELECT Statement Syntax](https://dev.mysql.com/doc/refman/8.0/en/select.html)

# Hyperlinks

| W3Schools SQL SELECT Statement | https://www.w3schools.com/sql/sql_select.asp |
| PostgreSQL SELECT Documentation | https://www.postgresql.org/docs/current/sql-select.html |
| MySQL SELECT Statement Syntax | https://dev.mysql.com/doc/refman/8.0/en/select.html |

# Mouse Over Information

| Word | Information | 
| ----- | ----- | 
| SELECT | a SQL command used to retrieve data from a database | 
| DQL | data query language, a subset of SQL used exclusively for reading and fetching data | 
| table | a collection of data elements organized in rows and columns | 
| column | a vertical set of data values of a particular type in a database table | 
| row | a single, structured data item in a table, also known as a record | 
| query | a request for data or information from a database management system | 
| result set | the temporary table of rows returned by a database query | 
| FROM | a clause that specifies the table(s) from which to retrieve data | 
| WHERE | a clause used to extract only those records that fulfill a specified condition | 
| DISTINCT | a keyword used within a SELECT statement to return only unique values | 
| ORDER BY | a keyword used to sort the result set in ascending or descending order | 
| GROUP BY | a statement that groups rows that have the same values into summary rows | 
| aggregate | a function (like COUNT, MAX, SUM) that calculates a single value from multiple rows | 

# Tags

`sql`, `select`, `dql`, `query`, `database`, `relational`, `data-retrieval`, `backend`, `programming`, `tables`

# Dependencies

Relational Database Management System (RDBMS), MySQL, PostgreSQL, SQLite, SQL Server, Oracle Database, Database Engine