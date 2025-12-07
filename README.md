# OVO Product & Tech - Team Visualization

A web application to visualize organizational teams and members from JSON data files.

## Features

- **Pod Overview**: View all pods with team counts and leadership
- **Team Details**: Click on any team to see detailed member information
- **Search**: Search across teams, members, roles, and skills
- **Filter**: Filter by specific pod
- **Statistics**: View overall statistics about pods, teams, and members

## How to Run

### Option 1: Simple HTTP Server (Recommended)

Since the app needs to load JSON files, you'll need to run a local web server:

**Python 3:**
```bash
python3 -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Node.js (with http-server):**
```bash
npx http-server -p 8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

### Option 2: VS Code Live Server

If you're using VS Code, install the "Live Server" extension and right-click on `index.html` → "Open with Live Server"

## Deployment to GitHub Pages

This app is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Push to main branch**: The workflow will automatically deploy when you push to the `main` branch

3. **Access your site**: Your app will be available at:
   - `https://<username>.github.io/<repository-name>/` (if repository is not named `username.github.io`)
   - `https://<username>.github.io/` (if repository is named `username.github.io`)

### Manual Deployment

You can also trigger deployment manually:
- Go to Actions tab in your repository
- Select "Deploy to GitHub Pages" workflow
- Click "Run workflow"

### Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) will:
- Trigger on pushes to `main` branch
- Build and deploy the static site to GitHub Pages
- Use the latest GitHub Actions Pages deployment tools

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `app.js` - Application logic and data handling
- `*.json` - Pod data files (one per pod)

## Usage

1. **Browse Pods**: The main view shows all pods as cards
2. **View Teams**: Each pod card shows a preview of teams
3. **Team Details**: Click on any team to see all members with their details
4. **Search**: Use the search box to find teams, members, or skills
5. **Filter**: Use the dropdown to filter by specific pod

## Features

- Responsive design that works on desktop and mobile
- Real-time search and filtering
- Detailed member information including:
  - Name and email
  - Role and role group
  - Contract type
  - Skillset
  - Supplier information (for 3rd Party Partners)

