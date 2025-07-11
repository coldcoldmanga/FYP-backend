# GEMINI-SERVER

GEMINI-SERVER is a Node.js backend service designed to process, analyze, and manage reports using AI-powered summarization, push notifications, and file uploads. It leverages Express.js, integrates with services like Firebase, Cloudinary, and OneSignal, and provides several RESTful endpoints for report management and notifications.

> **Note:** This project is also configured for seamless deployment on [Vercel](https://vercel.com/), making it easy to host and scale in the cloud.

---

## Features

- **AI Report Summarization**: Analyze and summarize reports using AI.
- **Push Notifications**: Notify users, admins, and workers via OneSignal.
- **File Uploads**: Upload and manage attachments with Cloudinary.
- **RESTful API**: Multiple endpoints for report and notification management.
- **Firebase Integration**: Store and retrieve data securely.

---

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: v18.x or higher  
  [Download Node.js](https://nodejs.org/)
- **npm**: Comes with Node.js
- **Vercel CLI** (optional, for deployment):  
  Install globally with `npm install -g vercel`
- **Service Credentials**:  
  - Firebase Admin SDK (`serviceAccount.json`)
  - Cloudinary credentials
  - OneSignal API keys
  - Any other environment variables required (see `.env` or `firebaseConfig.js`)

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd GEMINI-SERVER
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment/configuration files:**
   - Place your `serviceAccount.json` in the root directory.
   - Configure Firebase and other service credentials in `firebaseConfig.js` or via environment variables.

4. **Run the server locally:**
   ```bash
   npm run dev
   ```
   The server will start on port 3000 by default.

---

## Deployment (Vercel)

This project is ready to deploy on Vercel. To deploy:

1. **Install Vercel CLI (if not already):**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts to complete your deployment.

---

## Project Structure

```
.
├── server.js                # Main server entry point
├── package.json             # Project metadata and dependencies
├── firebaseConfig.js        # Firebase configuration
├── serviceAccount.json      # Firebase Admin SDK credentials
├── vercel.json              # Vercel deployment configuration
├── services/                # Service modules (AI, notifications, uploads, etc.)
└── node_modules/            # Installed dependencies
```

Replace `<your-repo-url>` with your actual repository URL.  
Let me know if you want to add API usage examples or further details!

---

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [Firebase](https://firebase.google.com/)
- [Cloudinary](https://cloudinary.com/)
- [OneSignal](https://onesignal.com/)
- [Vercel](https://vercel.com/)
