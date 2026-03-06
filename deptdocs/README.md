# DeptDocs 📄

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

DeptDocs is a specialized internal document management portal designed for the **Department of AI & Data Science at Christ University**. It streamlines the end-to-end workflow for departmental reports—from creation and multi-step review to official publication and secure archival.

The platform solves the challenge of fragmented reporting by providing a unified, role-based interface where faculty can generate standard-compliant PDFs and administrators can review, provide feedback, and securely store finalized documents in Google Drive.

## 🚀 Key Features

- **Role-Based Dashboards**: Tailored experiences for Faculty (Report Creation) and Admins (Review & Management).
- **Dynamic Form Builder**: Multi-step forms for capturing activity details, speaker profiles, and participant data.
- **Automated PDF Generation**: Server-side rendering of official University-formatted reports using `@react-pdf/renderer`.
- **Digital Signatures**: Integrated signature capture during onboarding for authenticating departmental reports.
- **Google Drive Integration**: Automated upload of approved reports to departmental Drive folders using Service Accounts.
- **Real-time Notifications**: Instant alerts for report assignments, revisions, and status updates via Supabase Realtime.
- **Activity Logging**: Comprehensive audit trail of all administrative actions.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 4.
- **Backend/BaaS**: Supabase (PostgreSQL, Auth, Realtime, Storage).
- **PDF Engine**: `@react-pdf/renderer`.
- **Integrations**: Google Drive API (via `googleapis`).
- **Icons**: Lucide React.

## 📋 Prerequisites

Before you begin, ensure you have the following installed/configured:
- **Node.js**: v20 or higher.
- **pnpm**: Fast, disk space efficient package manager.
- **Supabase Account**: A project with Auth and Database enabled.
- **Google Cloud Console**: Service Account with Google Drive API access and a target Folder ID.

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory and populate it with the following:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key # For server-side operations

# Google Drive Integration
GOOGLE_DRIVE_FOLDER_ID=your_target_folder_id
# Stringified JSON of your Google Service Account Key
GOOGLE_SERVICE_ACCOUNT_KEY='{"type": "service_account", "project_id": "...", ...}'

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🛠️ Installation & Running

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/deptdocs.git
   cd deptdocs/deptdocs
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   ```

4. **Build for production**:
   ```bash
   pnpm build
   pnpm start
   ```

## 🗄️ Database Setup

DeptDocs relies on specific Supabase tables and storage buckets:

1.  **Tables**: Create the following tables in your Supabase project:
    - `profiles`: (id, full_name, designation, department, signature_url)
    - `reports`: (id, owner_id, title, status, data [JSONB], admin_feedback)
    - `notifications`: (id, user_id, title, message, link, read)
    - `activity_logs`: (id, user_name, description, created_at)
2.  **Storage**: Create a public bucket named `signatures` for storing user digital sign-offs.
3.  **Authentication**: Enable Email/Password provider. Ensure `onboarding` logic in `proxy.ts` matches your requirements.

## 🌐 Deployment

### Vercel
Deploying to Vercel is straightforward:
- Connect your GitHub repository.
- Add the environment variables listed above.
- **Note**: The API routes (like `/api/drive/upload`) are configured with `export const dynamic = 'force-dynamic'` to ensure they run on the server and handle streaming/API calls correctly.

---
Built with ❤️ for Christ University.
