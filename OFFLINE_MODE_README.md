# 🔌 Offline Mode Guide

This revised guide explains how to operate the Code Clash platform in **Offline Mode**. This mode allows the student panel to function even without an internet connection or Supabase access.

## ⚠️ CRITICAL: DO NOT USE VERCEL LINK ⚠️

**If you are offline, you CANNOT use `https://code-clash-ui-seven.vercel.app`**

You must run the website from your **Local Computer**:
1.  Open the folder in VS Code
2.  Run `Start_Offline_Server.bat` (or `npm run dev`)
3.  Open `http://localhost:3000` in your browser.

---

## How it Works

When the application detects a network failure (or cannot reach Supabase), it automatically switches to local fallback mechanisms:

1.  **Student Registration**:
    *   If the database is unreachable, registration data is saved locally on the student's device.
    *   The student can proceed to the quiz immediately.

2.  **Quiz Fetching**:
    *   If the student cannot fetch the quiz from the cloud, they can enter the special code: **`OFFLINE`**.
    *   This loads a pre-configured local quiz (editable in `lib/offline-data.ts`).
    *   If there is a network error for *any* code, the system will suggest trying the offline mode.

3.  **Quiz Submission**:
    *   If the quiz results cannot be sent to the database, they are saved securely in the browser's `localStorage`.
    *   A "Submitted Offline" confirmation is shown.

## Setup for Offline Competition

1.  **Start the Server**:
    Ensure the Next.js server is running on the host machine:
    ```bash
    npm run dev
    ```

2.  **Student Access**:
    Students connect to the host's IP address (e.g., `http://192.168.1.5:3000`).

3.  **Running the Quiz**:
    *   Instruct students to Register.
    *   Instruct students to enter quiz code: **`OFFLINE`** (or your regular code if you have internet).
    *   Students take the quiz and submit.

## Retrieving Offline Results

Since offline results are stored on the **student's device**, you need to manually collect them if they never synced.
*   Results are stored in `localStorage` under the key `quizResults`.
*   (Future enhancement: Add an "Export Local Results" button for students to send a JSON file to the admin).

## Editing the Offline Quiz

To change the questions for the offline mode:
1.  Open `lib/offline-data.ts`.
2.  Edit the `OFFLINE_QUIZ` object.
3.  The changes will reflect immediately (server restart may be required for hot reloading to catch up on all clients).
