# WeLearn - Online Learning Platform

A Student led peer-to-peer online tutoring platform that connect tutees with tutors for personalized learning experiences.

## Features

- User Authentication (Tutees & Tutors)
- Tutor Profile Management
- Real-time Session Booking
- Calendar Integration
- Payment Processing (Xendit)
- Interactive Dashboard
- Session Management
- Rating & Review System

## Tech Stack

- **Frontend**: Next.js 15.2.3
- **Authentication**: Clerk
- **Database**: PostgreSQL
- **Payment**: Xendit
- **Video Call**: Zoom

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL
- Xendit API key
- Clerk API credentials
- Zoom API key

### Installation

1. Clone the repository

```bash
git clone [repository-url]
cd welearn
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file with the following variables:

```
DATABASE_URL=[your_postgres_url]
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[your_clerk_key]
CLERK_SECRET_KEY=[your_clerk_secret]
XENDIT_API_KEY=[your_xendit_key]
ZOOM_API_KEY=[your_zoom_key]
```

4. Run the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser
