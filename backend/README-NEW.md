# Backend (core PHP with MySQL) for Food Delivery App

## Database Setup

1. Make sure MySQL is running
2. Run the SQL schema to create database and tables:

```bash
mysql -u root -p < schema.sql
```

Or use your MySQL client to run schema.sql directly.

**Default credentials in config/Database.php:**

```php
private $host = 'localhost';
private $db = 'food_delivery_app';
private $user = 'root';
private $password = '';
```

Update these if your MySQL uses different credentials.

## Quick Start

1. Change to the backend folder and run PHP built-in server:

```bash
cd backend
php -S localhost:8000
```

2. API endpoints:

**Items:**

- List items: GET http://localhost:8000/api.php?action=list
- Get item: GET http://localhost:8000/api.php?action=get&id=1
- Add item: POST http://localhost:8000/api.php?action=add (JSON body)

**Auth:**

- Register: POST http://localhost:8000/api/auth.php?action=register (JSON {name,email,password})
- Login: POST http://localhost:8000/api/auth.php?action=login (JSON {email,password})
- Me: GET http://localhost:8000/api/auth.php?action=me (Authorization: Bearer <token>)
- Logout: POST http://localhost:8000/api/auth.php?action=logout (Authorization: Bearer <token>)

## Example Requests

### List items (frontend):

```javascript
fetch("http://localhost:8000/api.php?action=list")
  .then((r) => r.json())
  .then((data) => console.log(data.items));
```

### Register:

```javascript
fetch("http://localhost:8000/api/auth.php?action=register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John",
    email: "john@example.com",
    password: "secret123",
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

### Login:

```javascript
fetch("http://localhost:8000/api/auth.php?action=login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "john@example.com", password: "secret123" }),
})
  .then((r) => r.json())
  .then((data) => {
    localStorage.setItem("authToken", data.token);
    console.log(data.user);
  });
```

### Fetch user data (with auth token):

```javascript
fetch("http://localhost:8000/api/auth.php?action=me", {
  headers: { Authorization: "Bearer " + localStorage.getItem("authToken") },
})
  .then((r) => r.json())
  .then(console.log);
```

## Database Tables

- **users**: Stores user credentials with password hashing (bcrypt)
- **items**: Stores food items with pricing and categories

Passwords are hashed using PHP's password_hash() with PASSWORD_DEFAULT algorithm.
