# HireHub - Job Portal System

## Overview

HireHub is a modern full-stack Job Portal System that connects job seekers and employers through an intuitive and professional platform. The system allows employers to post and manage jobs while job seekers can search, save, and apply for opportunities. An administrative dashboard provides complete platform management capabilities.

## Features

### Job Seeker Features

* User Registration and Login
* Browse Available Jobs
* Search and Filter Jobs
* Save Jobs
* Apply for Jobs
* Track Applications
* Manage User Profile
* Upload CV/Resume

### Employer Features

* Employer Registration and Login
* Company Profile Management
* Post New Jobs
* Edit Job Listings
* Delete Job Listings
* View Posted Jobs
* View Applicants
* Employer Dashboard

### Admin Features

* Admin Dashboard
* View Platform Statistics
* Manage Users
* Manage Jobs
* Manage Companies
* Platform Monitoring

## Technologies Used

### Frontend

* Next.js
* React.js
* TypeScript
* Tailwind CSS
* Lucide React Icons

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Authentication

* JWT Authentication
* bcryptjs Password Hashing

## Database Tables

* users
* jobs
* applications
* saved_jobs
* companies

## System Architecture

Frontend (Next.js)

↓

REST API (Node.js + Express)

↓

MySQL Database

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/hirehub-job-portal.git
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Environment Variables

Create a .env file inside backend folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hirehub_db
JWT_SECRET=your_secret_key
```

## Screenshots

### Home Page

Modern landing page with job search functionality.

### Jobs Page

Browse and search available jobs.

### Employer Dashboard

Manage job postings and applicants.

### Company Profile

Company information management.

### Admin Dashboard

Platform statistics and administration.

## Future Improvements

* AI Resume Analyzer
* Email Notifications
* Interview Scheduling
* Job Recommendations
* Chat System
* Resume Builder
* Company Reviews

## Author

Dewmi Punsara

BSc Software Engineering

## License

This project is developed for educational and portfolio purposes.
