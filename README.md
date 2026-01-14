## Quick Start

```bash
npm install
cp .env.example .env
docker-compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

Server runs on `http://localhost:3000`

## Setup Instructions

### Installation

```bash
# Clone and install
git clone https://github.com/4olcay/ai-chat.git
cd ai-chat
npm install

# Environment setup
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

npm run db:migrate

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev
npm run build 
npm run start
npm run db:migrate
npm run format
```

## API Endpoints

See: /docs/AI Chat API.postman_collection.json for Postman collection.
