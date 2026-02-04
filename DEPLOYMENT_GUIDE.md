# 🚀 How to Deploy Code Clash to Vercel

Follow these simple steps to get your website online with a shareable public link.

## 1️⃣ Prepare Your Code (Git)

Open your terminal in this folder and run these commands one by one:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Save changes
git commit -m "Ready for deployment with Supabase"

# Rename branch to main
git branch -M main
```

## 2️⃣ Push to GitHub

1. Go to **[GitHub.com](https://github.com)** and sign in.
2. Click the **+** icon (top right) -> **New repository**.
3. Name it `code-clash-ui`.
4. Click **Create repository**.
5. Copy the URL shown (e.g., `https://github.com/your-username/code-clash-ui.git`).
6. Run these commands in your terminal (replace the URL with yours):

```bash
# Connect to GitHub (replace URL below!)
git remote add origin https://github.com/YOUR_USERNAME/code-clash-ui.git

# Push code
git push -u origin main
```

## 3️⃣ Deploy to Vercel

1. Go to **[Vercel.com](https://vercel.com)** and sign up/login.
2. Click **Add New** -> **Project**.
3. Select **Import** next to your `code-clash-ui` repository.
4. **IMPORTANT**: You must add Environment Variables. 
   - Expand the **Environment Variables** section.
   - Add these two (copy exact values from your `.env.local` file):
   
   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://eolbohjzkgswlbvvzdlb.supabase.co`
   
   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: (Copy the long key starting with `eyJ...` from your .env.local file)

5. Click **Deploy**.

## 🎉 You're Done!

Wait about a minute. Vercel will give you a link like:
👉 `https://code-clash-ui.vercel.app`

Send this link to everyone! They can now register and participate from their own devices.
