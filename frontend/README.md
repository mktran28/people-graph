# PeopleGraph

**Full-stack relationship intelligence web application**

PeopleGraph is a full-stack relationship intelligence web application that models **people and interactions as time-based events** and computes **derived relationship signals** using SQL.


## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- REST APIs

### Frontend
- React
- Tailwind CSS

---

## Features

### Core Functionality
- **People management**
  - Create, update, delete, and view people records
- **Interaction logging**
  - Log messages, calls, meetings, and notes as time-based events
- **Derived relationship signals**
  - Relationship strength score computed via SQL
  - Interaction counts per person

### Backend Quality
- Event-driven data modeling
- Clean separation of concerns (routes → controllers → models)
- Input validation with meaningful HTTP status codes
- Centralized error handling

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL
- npm

### Setup

```bash
cd backend
npm install

### Create a .env file in backend/:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/peopledb
PORT=8000

### Start the development server:

```bash
npm run dev

### The API will be available at:

```bash
http://localhost:8000