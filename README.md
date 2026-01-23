# PharmaLens

A production-ready medical web application that provides intelligent prescription analysis and medication guidance using AI. PharmaLens helps users understand their medications, identify potential drug interactions, and receive personalized safety recommendations.

## 🎯 Project Overview

PharmaLens is a full-stack application that combines a modern React frontend with a Node.js/Express backend to deliver comprehensive prescription analysis. The system uses Ollama (a local LLM runtime) with the qwen2.5:1.5b model to analyze prescriptions and generate structured medical guidance including:

- **Medication Schedules**: Detailed timing and dosage instructions
- **Drug Interactions**: Identification of harmful combinations
- **Overdose Warnings**: Safety alerts for maximum dosages
- **Side Effects**: Common and serious side effect information
- **Food Interactions**: Dietary restrictions and recommendations
- **Lifestyle Advice**: Activity and lifestyle guidance
- **Safety Tips**: General medication safety recommendations

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Fetch API with custom API client
- **Routing**: React Router
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MySQL 8 (via Docker)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **LLM Integration**: Ollama (local)
- **Model**: qwen2.5:1.5b

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **Ollama** installed and running locally
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd PharmaLens
```

### 2. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env file with your configuration
# Key variables:
# - DATABASE_URL: MySQL connection string
# - JWT_SECRET: Secret key for JWT tokens
# - OLLAMA_BASE_URL: http://localhost:11434
# - OLLAMA_MODEL: qwen2.5:1.5b

# Start MySQL database
docker-compose up -d

# Wait for MySQL to be ready (check status)
docker-compose ps

# Generate Prisma Client
npm run prisma:generate

# Set up database schema
npx prisma db push

# Start backend server (in development mode)
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Set Up Ollama

In a separate terminal:

```bash
# Start Ollama service
ollama serve

# Download the required model (in another terminal)
ollama pull qwen2.5:1.5b

# Verify model is available
ollama list
```

### 4. Set Up Frontend

Open a new terminal window:

```bash
# Navigate to project root
cd PharmaLens

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:8080`

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

## 📁 Project Structure

```
PharmaLens/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── app.ts          # Express app configuration
│   │   ├── server.ts       # Server entry point
│   │   ├── routes/         # API route definitions
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── lib/            # Shared utilities (Prisma client)
│   │   └── utils/          # Helper functions
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── docker-compose.yml  # MySQL Docker configuration
│   ├── .env.example        # Environment variables template
│   └── package.json
│
├── src/                     # Frontend React application
│   ├── components/
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   ├── sections/      # Page sections
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/          # React contexts (AuthContext)
│   ├── lib/               # Utilities (API client)
│   ├── pages/             # Page components
│   └── App.tsx            # Main app component
│
├── public/                 # Static assets
└── package.json           # Frontend dependencies
```

## 🔐 Authentication

PharmaLens uses JWT-based authentication:

1. **Register**: Create a new account with name, email, and password
2. **Login**: Sign in with email and password
3. **Protected Routes**: Prescription analysis requires authentication
4. **Token Storage**: JWT tokens are stored in localStorage

## 📡 API Endpoints

### Authentication (Public)

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Prescription (Protected)

- `POST /prescription/analyze` - Analyze prescription text
- `GET /prescription/history` - Get user's prescription history

### Health Check

- `GET /health` - Server health status

See [backend/README.md](./backend/README.md) for detailed API documentation.

## 🎨 Features

### Frontend Features
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ User authentication (Register/Login)
- ✅ Prescription input (manual text entry)
- ✅ Real-time prescription analysis
- ✅ Interactive medication dashboard
- ✅ Safety warnings and alerts
- ✅ Side effects information
- ✅ Food and lifestyle guidance
- ✅ Toast notifications for user feedback

### Backend Features
- ✅ RESTful API with Express.js
- ✅ JWT authentication with bcrypt password hashing
- ✅ MySQL database with Prisma ORM
- ✅ Ollama LLM integration for prescription analysis
- ✅ Structured JSON response parsing
- ✅ Error handling and validation
- ✅ CORS enabled for frontend integration

## 🛠️ Development

### Backend Development

```bash
cd backend

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Prisma commands
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate      # Run migrations
npm run prisma:studio      # Open Prisma Studio (database GUI)
```

### Frontend Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## 🐳 Docker Services

The backend uses Docker Compose to run MySQL:

```bash
cd backend

# Start MySQL
docker-compose up -d

# Stop MySQL
docker-compose down

# View logs
docker-compose logs mysql

# Check status
docker-compose ps
```

## 🔧 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="mysql://pharmalens_user:pharmalens_password@localhost:3306/pharmalens"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:1.5b

# MySQL (for Docker Compose)
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=pharmalens
MYSQL_USER=pharmalens_user
MYSQL_PASSWORD=pharmalens_password
MYSQL_PORT=3306
```

### Frontend

The frontend uses environment variables via Vite. Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:3000
```

## 🧪 Testing the Application

1. **Start Backend**: Ensure backend is running on port 3000
2. **Start Frontend**: Ensure frontend is running on port 8080
3. **Start Ollama**: Ensure Ollama is running with qwen2.5:1.5b model
4. **Register/Login**: Create an account or sign in
5. **Analyze Prescription**: Enter prescription text and analyze
6. **View Results**: Check the medication dashboard for analysis results

### Example Prescription Text

```
Take Aspirin 100mg twice daily after meals. 
Metformin 500mg once daily with breakfast.
Lisinopril 10mg once daily in the morning.
```

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error**
```bash
# Check if MySQL is running
docker-compose ps

# View MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

**Ollama Connection Error**
```bash
# Verify Ollama is running
curl http://localhost:11434/api/tags

# Check if model is available
ollama list

# Pull model if missing
ollama pull qwen2.5:1.5b
```

**Prisma Issues**
```bash
# Regenerate Prisma Client
npm run prisma:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Frontend Issues

**API Connection Error**
- Verify backend is running on port 3000
- Check browser console for CORS errors
- Verify `VITE_API_URL` in environment variables

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure production database credentials
4. Set up proper CORS origins
5. Build: `npm run build`
6. Start: `npm start`

### Frontend

1. Set `VITE_API_URL` to production backend URL
2. Build: `npm run build`
3. Deploy the `dist/` folder to your hosting service

## 🔒 Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days (configurable)
- API endpoints are protected with authentication middleware
- CORS is configured for frontend origin
- Environment variables are used for sensitive data
- SQL injection protection via Prisma ORM

## 📝 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions:
- Check the [backend README](./backend/README.md) for detailed API documentation
- Review the troubleshooting section above
- Check server logs for error messages

## 🎯 Future Enhancements

- [ ] Image upload and OCR for prescription images
- [ ] Medication reminder notifications
- [ ] Export prescription reports as PDF
- [ ] Multi-language support
- [ ] Advanced drug interaction database
- [ ] Integration with pharmacy APIs
- [ ] Mobile app version

---

**Built with ❤️ for better medication safety**
