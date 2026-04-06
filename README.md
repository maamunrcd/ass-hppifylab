# AppifySocial: Scalable & Modern Social Feed Engine

AppifySocial is a production-grade social media feed built with **Next.js 16**, **TypeScript**, and **Prisma**. It transitions a static design into a fully interactive, secure, and scalable application using the latest industry standards.

## 🌟 Key Features

### 1. High-Performance Feed
-   **Infinite Scrolling**: Native implementation using `IntersectionObserver` for seamless content loading.
-   **Cursor-Based Pagination**: Optimized for millions of records; avoids the performance degradation of classic offset pagination.
-   **Optimistic UI Updates**: Reactions (Likes) and Comments feel instantaneous, using React Query's `onMutate` to eliminate network perceived latency.

### 2. Rich Content Delivery
-   **Post Creation**: Supports rich text and image posts with client/server-side validation.
-   **Media Handling**: Dedicated API route for secure image uploads with UUID sanitization.
-   **Public/Private Visibility**: Database-level filtering ensures private posts are only visible to their authors.

### 3. Advanced Comment System
-   **Nested Threading**: Supports deep reply chains using a self-referential Prisma model.
-   **Interactive Reactions**: Like functionality on comments, precisely matched to original design assets.
-   **Micro-Interactions**: Real-time relative timestamps and hover-active states for action links.

## 🏗 Architectural Design

-   **Feature-Based Folder Structure**: Organized by domain (`src/features/feed/`, `src/features/auth/`) to ensure long-term maintainability and horizontal scalability.
-   **Solid Service Layer**: Heavy business logic is decoupled from UI components into reusable `PostService` and `CommentService` classes.
-   **Type-Safe Server Actions**: All mutations use Next.js Server Actions with **Zod** schema validation for end-to-end type safety.
-   **Security First**: Implements JWT-based authentication via HTTP-only cookies and bcrypt password hashing.

## 🚀 Getting Started

1.  **Clone & Install**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Configure your `.env` for PostgreSQL and JWT:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/appify"
    JWT_SECRET="generate-a-secure-key"
    ```

3.  **Database Migration**:
    ```bash
    npx prisma migrate dev
    ```

4.  **Run Development**:
    ```bash
    npm run dev
    ```

## 📈 Scalability Readiness

While implemented as an MVP, the system is architected for massive scale. For a deep dive into the migration path toward millions of posts (S3 storage, Redis caching, and Message Queues), please refer to our:

📄 **[Architecture & Scalability Analysis](./architecture_analysis.md)**

## 📁 Repository Structure

-   `src/features/`: Domain-specific components, hooks, and server actions.
-   `src/services/`: Modularized business logic (Service Layer).
-   `src/app/api/`: REST endpoints for client-side file uploads.
-   `lib/`: Core utilities (Prisma Client, JWT verification).
-   `design-assets/`: Reference designs converted into React components.

---
*Created for the Infolytx Interview Task.*
