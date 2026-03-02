# 🎓 DeptDocs

A full-stack, comprehensive web application built for the **Department of AI & Data Science at Christ University**. This platform digitizes and streamlines the creation, collaborative editing, and administrative approval of official university activity reports.

---

## ✨ Comprehensive Feature List

### 📝 Smart Document Generation
* **Multi-Step Editor:** A guided, intuitive form to input event details, speaker profiles, participant metrics, and upload event photos/attachments.
* **Live PDF Preview:** Instantly renders inputted data into the official university A4 PDF format.
* **Smart Date & Time Handling:** Automatically formats date ranges (e.g., "12th March 2026 to 13th March 2026") seamlessly into the final document.

### 🤝 Collaboration & Access Control
* **Role-Based Access:** Users can invite colleagues to documents as either **Editors** (can modify) or **Viewers** (read-only).
* **Ownership Protection:** Advanced database security ensures that collaborators cannot accidentally overwrite or hijack document ownership.
* **Race-Condition Locks:** React hooks securely lock document states during initial fetch to prevent blank-data overwrites on slow connections.

### 🛡️ Admin Command Center
* **Review Queue:** Department heads can view all submitted reports awaiting approval.
* **Approval & Push to Drive:** One-click approval that automatically pushes the final PDF to the official University Google Drive.
* **Revision Workflow:** Admins can reject reports, attach specific feedback, and instantly revert the document to "Draft" status for the original author.
* **Task Delegation:** Admins can generate blank draft assignments and push them directly to a specific faculty member's dashboard.

### 🔔 Real-Time Notifications
* **Live Alert Bell:** Powered by WebSockets, users receive instant, live UI alerts without refreshing the page.
* **Notification Triggers:** * "You have been invited to collaborate."
  * "Your role has been changed."  
  * "Admin requested revisions on your report."  
  * "You have been assigned a new report task."

### 👤 Automated Onboarding
* **Metadata Extraction:** Automatically pulls user details from the sign-up phase.
* **Digital Signatures:** Secure upload and storage of user signatures, automatically appended to the bottom of their generated reports.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
* **Backend / Database:** Supabase (PostgreSQL)
* **Authentication:** Supabase Auth
* **Storage:** Supabase Storage Buckets
* **Realtime:** Supabase Realtime (WebSockets)
* **PDF Rendering:** `@react-pdf/renderer`
* **Icons:** `lucide-react`

---

