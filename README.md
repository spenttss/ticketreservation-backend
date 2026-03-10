# Ticket Reservation API 

A simple Node.js and TypeScript backend for managing events and ticket reservations. Built with Express and PostgreSQL. Zod is used for schema validation.

This project demonstrates a **clean architecture** with separated layers including controllers, services, and repositories. It also includes centralized error handling and input validation.

---

## Key Technical Features

| Feature | Technical Implementation |
| :--- | :--- |
| **Concurrency Handling** | SQL Transactions & `FOR UPDATE` locking to prevent race conditions |
| **Domain Validation** | Strict request schema validation using **Zod** |
| **Layered Architecture** | Decoupled structure with Controllers, Services, and Repositories |
| **Testing & QA** | Robust integration tests powered by **Jest** and **Supertest** |

---

## Tech Stack

| Tool | Purpose |
| :--- | :--- |
| **TypeScript** | Type safety & maintainability |
| **PostgreSQL** | Relational data & ACID transactions |
| **Zod** | Request body validation |
| **Jest** | Automated testing |

---

## Getting Started

### 1. Clone & Install

```bash
git clone [https://github.com/spenttss/ticketreservation-backend.git](https://github.com/spenttss/ticketreservation-backend.git)
cd ticketreservation-backend
npm install
```

### 2. Database & Env

1. Create a DB in PostgreSQL.

2. Run the script in `./database/init.sql`

3. Create a `.env` file (see `.env.example`)

### 3. Run

```bash
npm run dev
```

<img width="933" height="310" alt="Image" src="https://github.com/user-attachments/assets/48ff7078-c589-4a87-af8c-29b06088f723" />

---

## Testing

Run the full integration suite to verify business logic:
```bash
npm test
```

<img width="216" height="34" alt="Image" src="https://github.com/user-attachments/assets/4fc3f412-57db-42ea-a8a0-d5f842ad1bf8" />

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
