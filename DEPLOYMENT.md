# Deployment Guide: DisasterTrain360 AI

Follow these simple, step-by-step instructions to deploy the application for **100% free ($0.00)**. 

---

## Part 1: Deploy Backend to Render.com (Free)

Render will host your Spring Boot backend on a free secure link (`https://...`).

### Step 1: Push your code to GitHub
Ensure all code is committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create a Web Service on Render
1. Go to [Render.com](https://render.com) and sign up for a free account.
2. Click **New +** (top right) and select **Web Service**.
3. Select **Build and deploy from a Git repository**.
4. Connect your GitHub repository.

### Step 3: Configure Build & Deploy Settings
Set the following configuration values on the deployment screen:
*   **Name:** `disastertrain360-backend`
*   **Language/Runtime:** `Java`
*   **Branch:** `main`
*   **Root Directory:** `backend` *(Make sure this is set to compile only the backend!)*
*   **Build Command:** `mvn clean package -DskipTests`
*   **Start Command:** `java -jar target/disastertrain360-backend-1.0.0.jar`
*   **Instance Type:** **Free** ($0/month)

### Step 4: Configure Environment Variables
Scroll down to the **Environment Variables** section and click **Add Environment Variable**. Add the following variables to inject your AWS credentials securely (do not keep them hardcoded in code):

| Key | Value | Description |
| :--- | :--- | :--- |
| `AWS_DYNAMODB_ACCESS_KEY` | `YOUR_DYNAMODB_ACCESS_KEY` | Your DynamoDB Access Key |
| `AWS_DYNAMODB_SECRET_KEY` | `YOUR_DYNAMODB_SECRET_KEY` | Your DynamoDB Secret Key |
| `AWS_S3_ACCESS_KEY` | `YOUR_S3_ACCESS_KEY` | Your S3 Access Key |
| `AWS_S3_SECRET_KEY` | `YOUR_S3_SECRET_KEY` | Your S3 Secret Key |
| `AWS_LAMBDA_ACCESS_KEY` | `YOUR_LAMBDA_ACCESS_KEY` | Your Lambda Access Key |
| `AWS_LAMBDA_SECRET_KEY` | `YOUR_LAMBDA_SECRET_KEY` | Your Lambda Secret Key |
| `APP_CORS_ALLOWED_ORIGINS` | `https://disaster-train360-ai.vercel.app` | *(Replace this with your actual Vercel URL once generated)* |

### Step 5: Deploy
Click **Create Web Service**. 
Render will build your Spring Boot jar and start the server. Once successful, copy the **HTTPS URL** provided at the top left of the Render dashboard (e.g. `https://disastertrain360-backend.onrender.com`).

---

## Part 2: Deploy Frontend to Vercel (Free)

Vercel will host your Vite + React frontend for free.

### Step 1: Create a Vercel Project
1. Log in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **Add New** → **Project**.
3. Import your GitHub repository.

### Step 2: Configure Build Settings
Configure these settings on the Vercel dashboard:
*   **Project Name:** `disaster-train360-ai`
*   **Framework Preset:** `Vite`
*   **Root Directory:** Click **Edit** and choose the `frontend` folder.

### Step 3: Add Environment Variables
Under the **Environment Variables** section, add your backend API URL:
*   **Name:** `VITE_API_URL`
*   **Value:** `https://disastertrain360-backend.onrender.com` *(Paste your Render backend URL here)*

### Step 4: Deploy
Click **Deploy**. Vercel will build your static files and give you a live HTTPS URL (e.g., `https://disaster-train360-ai.vercel.app`).

---

## Part 3: Final Integration Step (CORS Update)

Now that you have your Vercel frontend URL, you need to tell the backend to accept requests from it:

1. Go back to your **Render Dashboard** for `disastertrain360-backend`.
2. Go to **Environment Variables**.
3. Edit the value of `APP_CORS_ALLOWED_ORIGINS` and set it to your Vercel URL:
   `https://disaster-train360-ai.vercel.app`
4. Save the changes. Render will automatically redeploy the backend with the updated CORS configuration.

**You are now fully live and ready for testing! 🚀**
