# 🛍️ LuxStore — Full-Stack E-Commerce App

**Stack:** React · Express · MySQL · Docker

---

## 📁 Project Structure

```
ecommerce/
├── .env                   # Environment variables (edit before running)
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── controllers/
│   └── routes/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
└── mysql/
    └── init.sql           # Auto-runs on first start
```

---

## 🚀 Quick Start

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 2. Configure Environment
Edit `.env` if needed (defaults work out-of-the-box for local use):
```env
DB_PASSWORD=ecom_pass123
JWT_SECRET=supersecret_jwt_key_change_in_production
REACT_APP_API_URL=http://localhost:5000/api
```

> ⚠️ **For production**, change `JWT_SECRET`, `DB_PASSWORD`, and `MYSQL_ROOT_PASSWORD`.

### 3. Build & Run
```bash
docker compose up --build
```

First run takes ~3–5 minutes (installs npm packages, compiles React).

### 4. Access the App
| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:5000/api    |
| MySQL    | localhost:3306               |

---

## 🔑 Demo Credentials

Register a new account via the UI, or insert an admin user manually:

```bash
docker exec -it ecom_mysql mysql -u ecom_user -pecom_pass123 ecommerce_db

-- Inside MySQL:
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@luxstore.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7oq.9.6L2W', 'admin');
-- Password: admin123
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | /api/auth/register   | Register user      |
| POST   | /api/auth/login      | Login              |
| GET    | /api/auth/me         | Get current user   |

### Products
| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| GET    | /api/products        | List (filter, sort, page)|
| GET    | /api/products/:id    | Single product           |
| GET    | /api/products/categories | All categories       |
| POST   | /api/products        | Create (admin)           |
| PUT    | /api/products/:id    | Update (admin)           |
| DELETE | /api/products/:id    | Delete (admin)           |

### Cart (Auth required)
| Method | Endpoint       | Description     |
|--------|----------------|-----------------|
| GET    | /api/cart      | Get cart        |
| POST   | /api/cart      | Add item        |
| PUT    | /api/cart/:id  | Update quantity |
| DELETE | /api/cart/:id  | Remove item     |
| DELETE | /api/cart/clear| Clear cart      |

### Orders (Auth required)
| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| POST   | /api/orders           | Place order            |
| GET    | /api/orders/my        | My orders              |
| GET    | /api/orders/all       | All orders (admin)     |
| PUT    | /api/orders/:id/status| Update status (admin)  |

---

## 🛑 Stop the App
```bash
docker compose down          # Stop containers
docker compose down -v       # Stop + delete database volume
```

## 🔄 Rebuild After Code Changes
```bash
docker compose up --build
```
