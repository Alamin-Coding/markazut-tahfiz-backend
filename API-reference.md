# API Reference

This document lists all API endpoints for the Markazut Tahfiz backend application.

## Authentication

- The middleware only enforces authentication for `/dashboard` routes.
- API routes do not have built-in authentication checks in the code.
- However, based on functionality, some endpoints are intended for public use (e.g., submitting forms), while others should be restricted to authenticated administrators.
- Authentication is handled via JWT tokens stored in cookies for dashboard access.

## Endpoints

### Authentication

| Method | Endpoint                    | Description               | Access                    |
| ------ | --------------------------- | ------------------------- | ------------------------- |
| POST   | `/api/auth/login`           | Login user                | Public                    |
| POST   | `/api/auth/logout`          | Logout user               | Authenticated users       |
| POST   | `/api/auth/forgot-password` | Request password reset    | Public                    |
| POST   | `/api/auth/reset-password`  | Reset password with token | Public (with reset token) |

### About

| Method | Endpoint                        | Description                                      | Access |
| ------ | ------------------------------- | ------------------------------------------------ | ------ |
| GET    | `/api/about`                    | Fetch about page content                         | Public |
| POST   | `/api/about`                    | Create or update about page content              | Admin  |

### Admission

| Method | Endpoint              | Description                                               | Access |
| ------ | --------------------- | --------------------------------------------------------- | ------ |
| GET    | `/api/admission`      | List admission applications (with optional status filter) | Admin  |
| POST   | `/api/admission`      | Submit new admission application                          | Public |
| PUT    | `/api/admission/[id]` | Update admission application status/details               | Admin  |
| DELETE | `/api/admission/[id]` | Soft delete admission application                         | Admin  |

### Contact

| Method | Endpoint              | Description                                      | Access |
| ------ | --------------------- | ------------------------------------------------ | ------ |
| GET    | `/api/contact`        | Fetch contact information, hero, and departments | Public |
| POST   | `/api/contact`        | Create contact info, hero, or department         | Admin  |
| PUT    | `/api/contact`        | Update contact info, hero, or department         | Admin  |
| DELETE | `/api/contact`        | Delete contact info, hero, or department         | Admin  |
| POST   | `/api/contact/submit` | Submit contact form                              | Public |

### FAQ

| Method | Endpoint        | Description     | Access |
| ------ | --------------- | --------------- | ------ |
| GET    | `/api/faq`      | Fetch all FAQs  | Public |
| POST   | `/api/faq`      | Create new FAQ  | Admin  |
| PUT    | `/api/faq/[id]` | Update FAQ      | Admin  |
| DELETE | `/api/faq/[id]` | Soft delete FAQ | Admin  |

### Finance

| Method | Endpoint               | Description                                           | Access |
| ------ | ---------------------- | ----------------------------------------------------- | ------ |
| GET    | `/api/finance/expense` | List expenses (with optional filters)                 | Admin  |
| POST   | `/api/finance/expense` | Add new expense                                       | Admin  |
| GET    | `/api/finance/income`  | List income (with optional filters)                   | Admin  |
| POST   | `/api/finance/income`  | Add new income                                        | Admin  |
| GET    | `/api/finance/summary` | Get finance summary (income/expense totals by period) | Admin  |

### Notice

| Method | Endpoint           | Description        | Access |
| ------ | ------------------ | ------------------ | ------ |
| GET    | `/api/notice`      | Fetch all notices  | Public |
| POST   | `/api/notice`      | Create new notice  | Admin  |
| PUT    | `/api/notice/[id]` | Update notice      | Admin  |
| DELETE | `/api/notice/[id]` | Soft delete notice | Admin  |

### Notifications

| Method | Endpoint                      | Description                  | Access |
| ------ | ----------------------------- | ---------------------------- | ------ |
| POST   | `/api/notifications/sms/bulk` | Queue bulk SMS notifications | Admin  |

### Payment

| Method | Endpoint               | Description                           | Access |
| ------ | ---------------------- | ------------------------------------- | ------ |
| GET    | `/api/payment`         | List payments (with optional filters) | Admin  |
| POST   | `/api/payment`         | Record new payment                    | Admin  |
| GET    | `/api/payment/summary` | Get payment summary by period         | Admin  |

### Result

| Method | Endpoint                | Description                           | Access |
| ------ | ----------------------- | ------------------------------------- | ------ |
| GET    | `/api/result`           | Fetch results (with optional filters) | Public |
| POST   | `/api/result`           | Create new result                     | Admin  |
| PUT    | `/api/result/[id]`      | Update result                         | Admin  |
| DELETE | `/api/result/[id]`      | Soft delete result                    | Admin  |
| GET    | `/api/result/analytics` | Get result analytics and statistics   | Public |

### Student

| Method | Endpoint            | Description                           | Access |
| ------ | ------------------- | ------------------------------------- | ------ |
| GET    | `/api/student`      | List students (with optional filters) | Admin  |
| POST   | `/api/student`      | Create new student                    | Admin  |
| GET    | `/api/student/[id]` | Get student details                   | Admin  |
| PUT    | `/api/student/[id]` | Update student                        | Admin  |
| DELETE | `/api/student/[id]` | Soft delete student                   | Admin  |

### Upload

| Method | Endpoint      | Description                  | Access |
| ------ | ------------- | ---------------------------- | ------ |
| POST   | `/api/upload` | Upload images to Cloudinary  | Admin  |
| DELETE | `/api/upload` | Delete image from Cloudinary | Admin  |

## Notes

- All endpoints return JSON responses with a `success` boolean and `data` or `message` fields.
- Error responses include appropriate HTTP status codes.
- Some endpoints support query parameters for filtering.
- Soft deletes set `isActive: false` instead of removing records.
- CORS is enabled for all API routes.
- When creating new API routes, update this file accordingly.
