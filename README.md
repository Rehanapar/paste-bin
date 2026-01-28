# Pastebin Lite

A simple Pastebin-like application built with Next.js 16 and Redis.  
Users can create text pastes and receive a shareable link to view the content.  
This project implements a **view-count limit** for each paste.

---

## Features

- Create a paste with arbitrary text
- Receive a shareable link for the paste
- View a paste through the link
- Optional view-count limit (paste disappears after max views)
- Safe display of paste content (no script execution)

---

## Persistence Layer

- **Redis** is used as the persistence layer.
- Local Redis server is supported (`redis://localhost:6379`).
- Each paste is stored as a JSON object in Redis with the key `paste:<id>`.

---

## Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/pastebin-lite.git
   cd pastebin-lite
   ```
2. Install dependencies:

   npm install

3. Make sure Redis is running locally:

   redis-server
   redis-cli ping # should return PONG

4. Create .env.local with your base URL:

   NEXT_PUBLIC_BASE_URL=http://localhost:3000

5. Start the development server:

   npm run dev

6. Open http://localhost:3000 in your browser.

Deployment

Connect this GitHub repository to Vercel.

Redis must be accessible from the deployed environment. (Vercel supports environment variables to configure remote Redis URLs.)

Vercel will build and deploy automatically when you push changes to GitHub.

Notes

Only view-count limit is implemented for now.
