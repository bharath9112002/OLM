# Online Learning Management (OLM)

A React + Vite learning management platform covering authentication, dashboard analytics, course management (DummyJSON API), student management, course enrollment, and instructor management.

## Tech Stack

React 19 (Vite), Tailwind CSS v4, Context API, React Router, Axios, React Hook Form, React Toastify, localStorage.

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Demo Accounts

| Role    | Email             | Password    |
|---------|-------------------|-------------|
| Admin   | admin@olm.com     | Admin@123   |
| Student | student@olm.com   | Student@123 |

Or register a new account and pick a role.

## Modules Implemented

1. **Authentication** — Login (Admin/Student), Register, Forgot Password, protected routes, logout.
2. **Dashboard** — Role-aware stats, recent activity, upcoming classes, quick actions.
3. **Course Management** — DummyJSON-backed course catalog with search, category filter, sort, pagination, and full CRUD (admin).
4. **Student Management** — Admin CRUD over student records with validation, search, and pagination.
5. **Course Enrollment** — Students self-enroll from the catalog; admins can enroll any student, view enrollment summaries, and remove enrollments. Duplicate enrollments are blocked.
6. **Instructor Management** — Admin CRUD, course assignment, and instructor profile pages.

## Notes

- Course seed data is fetched once from the [DummyJSON Products API](https://dummyjson.com/products) and then persisted to `localStorage`, so add/edit/delete operations stick across reloads.
- All other data (users, students, instructors, enrollments) is stored in `localStorage`.
