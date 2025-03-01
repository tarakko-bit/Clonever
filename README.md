# Clonever - Crypto Engagement Platform

A dynamic cryptocurrency engagement platform with robust admin management and Telegram bot integration, focusing on secure user interactions and blockchain connectivity.

## Features

- 🤖 Telegram Bot Integration (@clonehodlbot)
- 💰 Solana Blockchain Wallet Connection
- 📊 Points Management System
- 👥 Multi-tier Admin Dashboard
- 🔄 Referral System
- 💱 Cryptocurrency Conversion
- 🔐 Secure Authentication

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Blockchain**: Solana Web3.js
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack Query
- **Authentication**: Passport.js
- **Routing**: Wouter

## Setup

1. Clone the repository:
```bash
git clone https://github.com/tarakko-bit/Clonever.git
cd Clonever
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
DATABASE_URL=postgresql://...
TELEGRAM_BOT_TOKEN=your_bot_token
```

4. Start the development server:
```bash
npm run dev
```

## Admin Access

The system includes pre-configured admin accounts:

### Superadmin
- Username: `superadmin`
- Access: Full system access including bulk SOL operations

### Regular Admins
- Usernames: `tarak`, `hamza`, `dokho`, `asmaa`
- Access: User management and referral monitoring

Admin features include:
- User Management
- Referral Tracking
- Bulk SOL Transactions (Superadmin only)
- Analytics Dashboard

## API Endpoints

### Public Routes
- `POST /api/login`: User authentication
- `GET /api/user`: Get current user
- `GET /api/convert/rate`: Get points conversion rate

### Admin Routes
- `GET /api/admin/users`: List all users
- `GET /api/admin/referrals`: List all referrals
- `POST /api/admin/bulk-send`: Bulk SOL transactions (Superadmin)

## Telegram Bot Commands

- `/start`: Initialize bot interaction
- `/link <code>`: Link Telegram account with platform
- `/balance`: Check points balance
- `/referrals`: View referral statistics

## License

MIT
