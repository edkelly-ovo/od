# OVO Product & Tech - Team Visualization

A web application to visualize organizational teams and members from JSON data files. This tool provides an interactive view of pods, teams, and team members with their roles, skillsets, and contract information.

## Features

- **Pod Overview**: View all pods with team counts and leadership information
- **Collapsible Teams**: Expandable pod and team sections for easy navigation
- **Team Details**: Click on any team to see detailed member information
- **Member Information**: View comprehensive details including:
  - Name and email
  - Role and role group
  - Contract type (Permanent, 3rd Party Partner, Vacancy)
  - Skillsets (career, team, daily, and general competencies)
  - Supplier information (for 3rd Party Partners)
  - Leave status
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **GitHub Pages Deployment**: Automatically deployed via GitHub Actions

## How to Run Locally

Since the app needs to load JSON files, you'll need to run a local web server:

### Option 1: Python HTTP Server

**Python 3:**
```bash
python3 -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

### Option 2: Node.js HTTP Server

```bash
npx http-server -p 8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

### Option 3: VS Code Live Server

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

```
.
├── index.html              # Main HTML structure
├── styles.css              # Styling and layout
├── app.js                  # Application logic and data handling
├── pods/                   # Pod data files directory
│   ├── schema.json         # JSON schema for pod validation
│   └── *.json              # Individual pod data files
├── scripts/                # Utility scripts
│   └── validate-all-schema.js  # Schema validation script
├── data/                   # Data files (gitignored)
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment workflow
└── README.md               # This file
```

## Pod Data Structure

Each pod JSON file follows the schema defined in `pods/schema.json` and includes:

- **name**: Pod name
- **leadership**: Array of leadership names
- **solutions**: Array of solutions (currently empty)
- **teams**: Array of teams, each containing:
  - **name**: Team name
  - **members**: Array of team members with:
    - Basic info: name, email, role, roleGroup, contractType
    - Skillsets: careerSkillset, teamSkillset, dailySkillset, generalCompetencies
    - Additional: supplier (for 3rd Party Partners), onLeave status

## Validation

Validate all pod JSON files against the schema:

```bash
node scripts/validate-all-schema.js
```

This ensures all pod data files conform to the expected structure.

## Usage

1. **Browse Pods**: The main view shows all pods as collapsible cards
2. **Expand Pods**: Click on a pod header to expand and see its teams
3. **View Teams**: Each pod shows its teams with member counts
4. **Expand Teams**: Click on a team header to see all team members
5. **View Member Details**: Each member card displays their role, contract type, skillsets, and other relevant information

## Data Files

Data files in the `data/` directory are gitignored and not committed to the repository. These typically contain source data used to generate or update the pod JSON files.

## Contributing

When adding or updating pod data:

1. Ensure the JSON file follows the schema in `pods/schema.json`
2. Validate your changes using the validation script
3. Test locally before pushing changes
4. Changes pushed to `main` will automatically deploy to GitHub Pages
