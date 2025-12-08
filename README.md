# OVO Product & Tech - Team Visualization

A web application to visualize organizational teams and members from JSON data files. This tool provides an interactive view of pods, teams, and team members with their roles, skillsets, and contract information.

## Features

- **Google Workspace OAuth Authentication**: Secure access restricted to authorized Google Workspace users
- **Version Support**: Switch between v1 and v2 pod data models using the version selector
- **Pod Overview**: View all pods with team counts, individual counts, vacancy counts, and leadership information
- **Collapsible Sections**: Expandable pods, teams, and solutions sections for easy navigation
- **Team Members & Supporting Members**: Teams display both regular members and supporting members separately
- **Member Information**: View comprehensive details including:
  - Name and email
  - Role and roleGroup
  - Contract type (Permanent, 3rd Party Partner, Vacancy)
  - Skillsets grouped by type: careerSkillset, teamSkillset, dailySkillset, generalCompetencies
  - Supplier information (for 3rd Party Partners)
  - Leave status
- **Solutions Display**: View solutions for each pod with collapsible sections
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **API Protection**: All API endpoints are protected with authentication middleware

## How to Run Locally

This application uses Express.js as the backend server. To run it locally:

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Google OAuth credentials:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback` (for local development)
     - Your production URL + `/auth/google/callback` (for production)
   - Copy the Client ID and Client Secret

3. Create a `.env` file in the root directory:
```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Allowed domain for authentication (default: ovo.com)
ALLOWED_DOMAIN=ovo.com

# OAuth Callback URL (default: http://localhost:3000/auth/google/callback)
# For production, set this to your production URL
CALLBACK_URL=http://localhost:3000/auth/google/callback

# Session Secret (change this to a random string in production)
SESSION_SECRET=your-random-session-secret-key-change-in-production

# Server Port (default: 3000)
PORT=3000

# Node Environment
NODE_ENV=development
```

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in the PORT environment variable).

### API Endpoints

**Public Endpoints:**
- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - OAuth callback handler
- `GET /auth/logout` - Logout user
- `GET /auth/status` - Check authentication status

**Protected Endpoints (require authentication):**
- `GET /api/pods/:version` - Get all pods for a specific version (e.g., `/api/pods/v1`)

## Docker Deployment

The application includes a Dockerfile for containerized deployment.

### Building the Docker Image

```bash
docker build -t ovo-product-tech-visualization .
```

### Running the Container

```bash
docker run -d \
  -p 3000:3000 \
  -e GOOGLE_CLIENT_ID=your-client-id \
  -e GOOGLE_CLIENT_SECRET=your-client-secret \
  -e ALLOWED_DOMAIN=ovo.com \
  -e CALLBACK_URL=http://localhost:3000/auth/google/callback \
  -e SESSION_SECRET=your-session-secret \
  --name ovo-app \
  ovo-product-tech-visualization
```

### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - ALLOWED_DOMAIN=${ALLOWED_DOMAIN:-ovo.com}
      - CALLBACK_URL=${CALLBACK_URL:-http://localhost:3000/auth/google/callback}
      - SESSION_SECRET=${SESSION_SECRET}
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```

## Deployment

For full Express.js functionality, deploy to a Node.js hosting service:

**Docker-based platforms (recommended):**
- **Docker Hub / AWS ECS / Google Cloud Run**: Use the provided Dockerfile
- **Kubernetes**: Deploy using the Docker image

**Heroku:**
```bash
heroku create your-app-name
git push heroku main
```

**Railway:**
- Connect your GitHub repository
- Railway will auto-detect Node.js and deploy

**Render:**
- Connect your GitHub repository
- Set build command: `npm install`
- Set start command: `npm start`

**Vercel/Netlify:**
- These platforms support Express.js serverless functions
- Configure as a Node.js application

### Environment Variables

Required environment variables (see `.env.example` for template):

- `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret
- `ALLOWED_DOMAIN` - Domain restriction for authentication (default: `ovo.com`)
- `CALLBACK_URL` - OAuth callback URL (default: `http://localhost:3000/auth/google/callback`)
- `SESSION_SECRET` - Secret key for session encryption (use a strong random string in production)
- `PORT` - Server port (default: `3000`)
- `NODE_ENV` - Node environment (`development` or `production`)

**Important:** Never commit your `.env` file to version control. It's already in `.gitignore`.

## File Structure

```
.
├── public/                 # Public static files
│   ├── index.html          # Main HTML structure
│   ├── styles.css          # Styling and layout
│   └── app.js              # Client-side application logic
├── server/                 # Server-side code
│   ├── index.js            # Express server entry point
│   ├── config/             # Configuration files
│   │   ├── auth.js         # Passport.js Google OAuth configuration
│   │   └── session.js      # Express session configuration
│   ├── middleware/         # Express middleware
│   │   └── auth.js         # Authentication middleware
│   ├── routes/             # API routes
│   │   ├── index.js        # Main router
│   │   ├── auth.js         # Authentication routes
│   │   └── pods.js         # Pod data routes
│   └── lib/                # Utility functions
│       ├── getPodFiles.js  # Get pod file list
│       ├── loadPodFile.js  # Load pod JSON file
│       └── sortPodsByName.js  # Sort pods alphabetically
├── pods/                   # Pod data files directory
│   ├── schema.json         # JSON schema for pod validation
│   ├── v1/                 # Version 1 pod data files
│   │   └── *.json          # Individual pod data files
│   └── v2/                 # Version 2 pod data files
│       └── *.json          # Individual pod data files (when available)
├── scripts/                # Utility scripts
│   └── validate-all-schema.js  # Schema validation script
├── data/                   # Source data files (CSV files)
├── .env                    # Environment variables (not committed)
├── .env.example            # Environment variables template
├── package.json            # Node.js dependencies and scripts
└── README.md               # This file
```

## Pod Data Structure

Each pod JSON file follows the schema defined in `pods/schema.json` and includes:

- **name**: Pod name
- **leadership**: Array of leadership names
- **solutions**: Array of solutions, each with:
  - **name**: Solution name
  - **description**: Solution description
- **teams**: Array of teams, each containing:
  - **name**: Team name
  - **members**: Array of team members with:
    - Basic info: name, email, role, roleGroup, contractType
    - Skillsets: careerSkillset, teamSkillset, dailySkillset, generalCompetencies
    - Additional: supplier (for 3rd Party Partners), onLeave status
  - **supporting**: Array of supporting members (pod-members who support the team but are not present within it) with:
    - Basic info: name, email, role, roleGroup
    - Optional: contractType, skillsets, supplier, onLeave

## Validation

Validate all pod JSON files against the schema:

```bash
node scripts/validate-all-schema.js
```

This ensures all pod data files conform to the expected structure.

## Usage

1. **Login**: When you first access the application, you'll be prompted to log in with your Google Workspace account
2. **Authentication**: Only users with email addresses from the configured domain (default: `@ovo.com`) can access the application
3. **Select Version**: Use the version selector at the top to switch between v1 and v2 pod data
4. **Browse Pods**: The main view shows all pods as collapsible cards, sorted alphabetically
5. **Expand Pods**: Click on a pod header to expand and see its content (leadership, solutions, teams)
6. **View Solutions**: Click on the solutions header to expand and view all solutions for a pod
7. **View Teams**: Each pod shows its teams with member counts and supporting member counts
8. **Expand Teams**: Click on a team header to see all team members and supporting members
9. **View Member Details**: Each member card displays:
   - Role, roleGroup, and contract type
   - Skillsets grouped by type (career, team, daily, general competencies)
   - Supplier information (for 3rd Party Partners)
   - Leave status (if applicable)
10. **Supporting Members**: Supporting members are displayed separately from regular team members with distinct styling
11. **Logout**: Click the logout button in the header to end your session

## Data Files

Data files in the `data/` directory are gitignored and not committed to the repository. These typically contain source data used to generate or update the pod JSON files.

## Security

- All API endpoints are protected with authentication middleware
- Only users with email addresses from the configured domain can access the application
- Sessions are encrypted using the `SESSION_SECRET` environment variable
- In production, ensure `NODE_ENV=production` is set to enable secure cookies (HTTPS required)

## Contributing

When adding or updating pod data:

1. Ensure the JSON file follows the schema in `pods/schema.json`
2. Validate your changes using the validation script
3. Test locally before pushing changes
4. Ensure all environment variables are properly configured for your deployment environment
