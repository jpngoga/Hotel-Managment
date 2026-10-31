# Hotel-Managment
# Hotel Management System

A full-stack Hotel Management System built to simplify hotel operations through a centralized web application. The system provides tools for managing rooms, reservations, customers, payments, employees, and hotel performance reports.

The project uses a **Django REST Framework backend** to manage data and business logic, and a **React frontend** to provide an interactive dashboard for hotel staff.

## Project Overview

The Hotel Management System is designed to help hotel administrators and staff manage daily hotel activities efficiently, reduce manual record-keeping, and access important operational information from one platform.

### Main Features

- **User Authentication:** User registration, login, logout, profile management, and token-based authentication.
- **Dashboard:** Displays important hotel statistics, including customers, employees, rooms, bookings, payments, and revenue.
- **Room Management:** Create, view, update, and delete rooms. Manage room types, descriptions, prices, capacity, amenities, images, and maintenance status.
- **Booking Management:** Create and manage reservations, track booking dates and guest numbers, calculate booking costs, and prevent overlapping reservations.
- **Customer Management:** View and manage customer profiles and customer information.
- **Payment Management:** Record and manage payments, payment methods, transaction references, and payment statuses.
- **Employee Management:** Register employees and manage their contact information, positions, salaries, hire dates, and employment statuses.
- **Reports:** View hotel statistics, booking summaries, payment totals, and completed-payment revenue.
- **Search:** Search supported customer, employee, and payment records.
- **Responsive Dashboard:** A sidebar navigation layout provides access to the different management sections.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS
- Lucide React icons

### Backend
- Python
- Django
- Django REST Framework
- Django REST Framework Token Authentication
- SQLite database
- Pillow for image handling
- Django CORS Headers

## Project Structure

```text
Hotel-Managment/
│
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   │
│   ├── accounts/
│   ├── rooms/
│   ├── bookings/
│   ├── customers/
│   ├── payments/
│   ├── employees/
│   ├── reports/
│   ├── manage.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

## User Roles and Access Control

The system supports three user roles:

| Role | Responsibilities |
|---|---|
| Administrator | Manages hotel operations, staff, customers, rooms, bookings, payments, and reports. |
| Receptionist | Intended for front-desk and reservation-related activities, subject to configured permissions. |
| Customer | Registers, logs in, manages their profile, and accesses their own bookings. |

Access to protected backend endpoints is controlled through authentication and permission checks.

## Backend API Endpoints

The backend exposes REST API endpoints under `/api/`.

| Module | Base Endpoint | Purpose |
|---|---|---|
| Accounts | `/api/accounts/` | Registration, login, logout, and profile operations |
| Rooms | `/api/rooms/` | Room management |
| Bookings | `/api/bookings/` | Reservation management |
| Customers | `/api/customers/` | Customer profile management |
| Payments | `/api/payments/` | Payment records |
| Employees | `/api/employees/` | Employee management |
| Reports | `/api/reports/dashboard/` | Dashboard statistics and reports |

### Important API Functionality

- Room listing is publicly accessible; room modifications require staff permissions.
- Booking operations require authentication. Customers access their own bookings, while staff can access all bookings.
- Customer, payment, and employee management endpoints are restricted to administrators.
- Booking validation checks that the check-out date is after the check-in date, guest numbers do not exceed room capacity, and confirmed or pending reservations do not
