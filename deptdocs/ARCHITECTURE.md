# System Architecture: DeptDocs 🏛️

This document provides a technical overview of the DeptDocs architecture, detailing the interaction between the frontend, Supabase, and Google Drive, as well as the data models and security gates.

## 1. System Overview

DeptDocs follows a modern serverless architecture using **Next.js 15** as the application framework, **Supabase** as the Backend-as-a-Service (BaaS), and **Google Drive** for long-term document archival.

```mermaid
graph TD
    Client[Next.js Frontend] <--> SupabaseAuth[Supabase Auth]
    Client <--> SupabaseDB[Supabase PostgreSQL]
    Client <--> SupabaseStorage[Supabase Storage - Signatures]
    Client -- /api/drive/upload --> ServerSide[Next.js API Route]
    ServerSide -- renderToStream --> PDFRenderer[@react-pdf/renderer]
    ServerSide -- Service Account --> GoogleDrive[Google Drive API]
    SupabaseDB -- Realtime --> Client
```

## 2. Database Schema

The PostgreSQL database (managed via Supabase) consists of four essential tables:

### `profiles`
Stores extended user metadata and digital signatures.
- `id`: UUID (Primary Key, links to `auth.users`)
- `full_name`: TEXT
- `email`: TEXT
- `designation`: TEXT (e.g., Assistant Professor)
- `department`: TEXT (Default: AI & Data Science)
- `signature_url`: TEXT (Public URL to the signature file in Supabase Storage)

### `reports`
The core document entity.
- `id`: UUID (Primary Key)
- `owner_id`: UUID (Foreign Key to `profiles.id`)
- `title`: TEXT
- `status`: ENUM ('draft', 'completed')
- `data`: JSONB (Stores all form fields: activity details, guest info, etc.)
- `admin_feedback`: TEXT (Comments from admin for revisions)
- `updated_at`: TIMESTAMP

### `notifications`
Powers the realtime alerting mechanism.
- `id`: UUID
- `user_id`: UUID
- `title`: TEXT
- `message`: TEXT
- `link`: TEXT (Direct path to the action, e.g., `/home/new?id=...`)
- `read`: BOOLEAN

### `activity_logs`
An immutable audit trail for administrative actions.
- `id`: UUID
- `user_name`: TEXT
- `description`: TEXT (e.g., "Approved Report: Annual Tech Talk")
- `created_at`: TIMESTAMP

## 3. Authentication & Authorization Flow

### The Onboarding Gate
1. **Signup**: User registers via Email/Password.
2. **Onboarding**: Upon first login, users are redirected to `/onboarding` if their profile is incomplete (missing `full_name` or `signature_url`).
3. **Signature Capture**: Users upload an image of their digital signature, which is stored in the `signatures` storage bucket.

### Middleware Security (`proxy.ts`)
The application uses a custom proxy logic to gate routes:
- **Protected Routes**: `/home` and `/admin` require an active session.
- **Onboarding Gate**: Authenticated users are forced to `/onboarding` if their profile is incomplete.
- **Admin Gate**: Access to `/admin` is restricted to specific hardcoded email addresses (e.g., `sakshamsharma614@gmail.com`).

## 4. The PDF Generation Pipeline

The transformation from form data to a finalized Google Drive document happens server-side for security and reliability.

1. **Submission**: A faculty member completes the form and marks it as 'completed'.
2. **Review**: The Admin reviews the report via the `LivePreview` component (which uses the same logic as the PDF).
3. **Approval**: When the Admin clicks "Approve & Push":
   - The frontend calls the `/api/drive/upload` POST route.
   - The server initializes Supabase using the **Service Role Key** to bypass RLS.
   - It fetches the full report data and user profiles (for signatures).
   - **`@react-pdf/renderer`** renders the `ReportPDF` component to a stream.
   - The stream is uploaded directly to Google Drive using a **Google Service Account**.
   - The resulting Drive link is saved back into the report's `data` JSONB payload.

## 5. Project Structure Breakdown

```text
app/
├── (auth)/         # Auth pages (login, signup, forgot-password)
├── admin/          # Admin Dashboard & Review Queue
├── home/           # Faculty Dashboard & Report Builder
├── onboarding/     # First-time user setup
├── api/            # Serverless functions
│   ├── drive/      # Google Drive upload pipeline
│   └── ai/         # (Optional) AI extraction features
components/
├── forms/          # Modular form steps (GeneralInfo, Speakers, etc.)
├── ReportPDF.tsx   # The "Source of Truth" for document layout
└── LivePreview.tsx # React view of the PDF for real-time feedback
utils/
└── supabase/       # Client and Server factories
```
