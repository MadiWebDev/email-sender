# MailingPerson - Bulk Email Sender

A modern bulk email sending application built with Next.js, Prisma, and Nodemailer. Send emails using Gmail with App Passwords, manage templates, contacts, and campaigns with ease.

## Features

- **Gmail Integration**: Configure Gmail credentials using App Passwords for secure email sending
- **Template Management**: Create, edit, and preview email templates with HTML support
- **Contact Management**: Add contacts individually or import in bulk
- **Bulk Email Campaigns**: Send emails to multiple recipients at once
- **Real-time Status**: Track campaign status (Draft, Sending, Completed, Failed)
- **Credit System**: Built-in credit tracking for email usage

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (or MongoDB Atlas)
- Gmail account with 2-Step Verification enabled

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure your `.env` file:
```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/mailingperson?retryWrites=true&w=majority"
AUTH_SECRET="generate-a-strong-secret-here"
AUTH_URL="http://localhost:3000"
GOOGLE_ID=""  # Optional - for Google OAuth
GOOGLE_SECRET=""  # Optional - for Google OAuth
```

4. Run Prisma migrations:
```bash
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## How to Use

### 1. Configure Gmail Credentials

1. Go to Settings in the dashboard
2. Enable 2-Step Verification on your Google Account if not already enabled
3. Generate an App Password:
   - Go to Google Account settings > Security
   - Enable 2-Step Verification
   - Search for "App Passwords"
   - Create a new app password (e.g., "Email Sender")
   - Copy the 16-character password
4. Enter your Gmail address and App Password in the Settings page
5. Click "Save Credentials"

### 2. Create Templates

1. Navigate to Templates
2. Click "New Template"
3. Enter template name, subject, and HTML content
4. Save the template for reuse in campaigns

### 3. Add Contacts

1. Go to Audience
2. Add contacts individually with name, email, and tags
3. Or import contacts in bulk by pasting email addresses (one per line)

### 4. Send Campaigns

1. Navigate to Campaigns
2. Click "New Campaign"
3. Enter campaign details (name, subject, from name)
4. Select a template or write custom content
5. Select recipients from your contacts
6. Click "Send Campaign"

## Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com/new)
3. Configure environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set these in your production environment:
- `DATABASE_URL` - Your MongoDB connection string
- `AUTH_SECRET` - A strong random secret for NextAuth
- `AUTH_URL` - Your production URL (e.g., https://yourdomain.com)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: MongoDB with Prisma ORM
- **Email**: Nodemailer with Gmail SMTP
- **Authentication**: NextAuth v5
- **Styling**: Tailwind CSS
- **UI Components**: Lucide Icons

## Security Notes

- Gmail App Passwords are encrypted before storage
- Each user has their own isolated Gmail credentials
- No SMTP credentials are stored in environment variables
- All API routes require authentication

## License

MIT
