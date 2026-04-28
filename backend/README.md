Backend (core PHP) for Food Delivery App

Quick start:

1. Copy `.env.example` to `.env` and update database/CORS values if needed.

2. Change to the backend folder and run PHP built-in server:

   cd backend
   php -S localhost:8000

Environment variables:

- `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `CORS_ALLOWED_ORIGIN` for the frontend origin, for example `http://localhost:3000`

3. API endpoints (no framework):

- List items: GET http://localhost:8000/api.php?action=list
- Get item: GET http://localhost:8000/api.php?action=get&id=1
- Add item: POST http://localhost:8000/api.php?action=add (JSON body)

Example `fetch` to list items (frontend):

```javascript
fetch("http://localhost:8000/api.php?action=list")
  .then((r) => r.json())
  .then((data) => console.log(data.items));
```

Example `fetch` to add an item:

```javascript
fetch("http://localhost:8000/api.php?action=add", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Veg Wrap",
    description: "Tasty wrap",
    price: 5.5,
    category: "Wraps",
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

Data is stored in `data/items.json` (simple JSON file). This is intentionally minimal for local development.

Authentication endpoints:

- Register: POST http://localhost:8000/api/auth.php?action=register (JSON {name,email,password})
- Login: POST http://localhost:8000/api/auth.php?action=login (JSON {email,password})
- Me: GET http://localhost:8000/api/auth.php?action=me (Authorization: Bearer <token>)
- Logout: POST http://localhost:8000/api/auth.php?action=logout (Authorization: Bearer <token>)

Example login:

```javascript
fetch("http://localhost:8000/api/auth.php?action=login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "you@example.com", password: "secret" }),
})
  .then((r) => r.json())
  .then(console.log);
```

# Add new user and Register as well as login form database succefull.

## commit as register / login sucessful.
