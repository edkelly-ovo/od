// Global state
let allPods = [];
let currentTeamDetails = null;

// Initialize the application
async function init() {
    try {
        await loadAllPods();
        renderPods();
    } catch (error) {
        console.error('Error initializing app:', error);
        document.body.innerHTML = '<div class="loading">Error loading data. Please check the console.</div>';
    }
}

// Load all pod JSON files
async function loadAllPods() {
    const podFiles = [
        'aer.json', 'agile-delivery.json', 'ai.json', 'ava.json', 'bpc.json',
        'comms-automation.json', 'cte.json', 'data-and-ai-platform.json',
        'drive-home-and-exports.json', 'emo.json', 'enterprise-technology.json',
        'experience-foundations.json', 'fulfil.json', 'home-services.json',
        'infrastructure-and-enablement.json', 'iops.json', 'payments.json',
        'payments-strategy.json', 'ptlt.json', 'release-operations.json',
        'enterprise-security.json', 'serve.json', 'service-operations.json'
    ];

    // Detect base path for GitHub Pages compatibility
    // Handles both root domain (username.github.io) and project pages (username.github.io/repo-name)
    const pathname = window.location.pathname;
    let basePath = '';
    if (pathname !== '/' && pathname !== '/index.html') {
      // Extract base path (everything before the filename)
      const pathParts = pathname.split('/').filter(p => p && p !== 'index.html');
      basePath = pathParts.length > 0 ? '/' + pathParts[0] : '';
    }
    const podsPath = `${basePath}/pods`;
    
    const loadPromises = podFiles.map(async (file) => {
        try {
            const response = await fetch(`${podsPath}/${file}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (error) {
            console.warn(`Could not load ${file}:`, error);
            return null;
        }
    });

    const results = await Promise.all(loadPromises);
    allPods = results.filter(pod => pod !== null);
    
    // Sort pods alphabetically by name
    sortPods();
}

// Sort pods alphabetically by name
function sortPods() {
    allPods.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
    });
}

// Render a member card
function renderMember(member) {
    const contractClass = member.contract_type === 'Vacancy' ? 'vacancy' : 
                        member.contract_type === '3rd Party Partner' ? 'third-party' : '';
    
    const supplierInfo = member.supplier ? 
        `<div class="member-supplier">Supplier: ${escapeHtml(member.supplier)}</div>` : '';

    const skillsetHtml = member.skillset && member.skillset.length > 0 ? `
        <div class="member-skillset">
            <div class="skillset-label">Skills</div>
            <div class="skills-list">
                ${member.skillset.map(skill => 
                    `<span class="skill-tag">${escapeHtml(skill)}</span>`
                ).join('')}
            </div>
        </div>
    ` : '';

    return `
        <div class="member-card-inline">
            <div class="member-name">${member.name ? escapeHtml(member.name) : '<em>Vacancy</em>'}</div>
            ${member.email ? `<div class="member-email">${escapeHtml(member.email)}</div>` : ''}
            <div>
                <span class="member-role">${escapeHtml(member.role)}</span>
                <span class="member-role-group">${escapeHtml(member.role_group)}</span>
                <span class="member-contract ${contractClass}">${escapeHtml(member.contract_type)}</span>
            </div>
            ${supplierInfo}
            ${skillsetHtml}
        </div>
    `;
}

// Render pods
function renderPods() {
    const podList = document.getElementById('podList');
    
    if (allPods.length === 0) {
        podList.innerHTML = '<div class="no-results">No pods found.</div>';
        return;
    }

    podList.innerHTML = allPods.map(pod => {
        const teamCount = pod.teams?.length || 0;
        const leadership = pod.leadership?.join(', ') || 'None specified';
        const allTeams = (pod.teams || []).map((team, teamIndex) => {
            const members = team.members || [];
            const membersHtml = members.map(member => renderMember(member)).join('');
            const teamId = `team-${pod.name.replace(/\s+/g, '-').toLowerCase()}-${teamIndex}`;
            return `
                <div class="team-section">
                    <div class="team-header" onclick="toggleTeam('${teamId}')">
                        <div class="team-name">${escapeHtml(team.name)}</div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="team-members-count">${members.length} member${members.length !== 1 ? 's' : ''}</div>
                            <span class="collapse-icon" id="icon-${teamId}">▼</span>
                        </div>
                    </div>
                    <div class="team-members-list collapsed" id="${teamId}">
                        ${membersHtml}
                    </div>
                </div>
            `;
        }).join('');

        const podId = `pod-${pod.name.replace(/\s+/g, '-').toLowerCase()}`;
        const solutions = pod.solutions || [];
        const solutionsHtml = solutions.length > 0 ? solutions.map(solution => `
            <div class="solution-item">
                <div class="solution-name">${escapeHtml(solution.name)}</div>
                <div class="solution-description">${escapeHtml(solution.description)}</div>
            </div>
        `).join('') : '<div class="no-solutions">No solutions defined</div>';
        
        return `
            <div class="pod-card">
                <div class="pod-header" onclick="togglePod('${podId}')">
                    <div class="pod-name">${escapeHtml(pod.name)}</div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div class="team-count">${teamCount} teams</div>
                        ${solutions.length > 0 ? `<div class="solution-count">${solutions.length} solution${solutions.length !== 1 ? 's' : ''}</div>` : ''}
                        <span class="collapse-icon" id="icon-${podId}">▼</span>
                    </div>
                </div>
                <div class="pod-content collapsed" id="${podId}">
                    <div class="leadership">
                        <div class="leadership-label">Leadership</div>
                        <div class="leadership-names">${escapeHtml(leadership)}</div>
                    </div>
                    <div class="solutions-section">
                        <div class="solutions-label">Solutions</div>
                        <div class="solutions-list">
                            ${solutionsHtml}
                        </div>
                    </div>
                    <div class="teams-preview">
                        ${allTeams}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Show team details
function showTeamDetails(podName, teamName) {
    const pod = allPods.find(p => p.name === podName);
    if (!pod) return;

    const team = pod.teams.find(t => t.name === teamName);
    if (!team) return;

    currentTeamDetails = { pod, team };
    
    const teamDetails = document.getElementById('teamDetails');
    teamDetails.classList.remove('hidden');

    const members = team.members || [];
    const membersHtml = members.map(member => {
        const contractClass = member.contract_type === 'Vacancy' ? 'vacancy' : 
                            member.contract_type === '3rd Party Partner' ? 'third-party' : '';
        
        const supplierInfo = member.supplier ? 
            `<div class="member-supplier">Supplier: ${escapeHtml(member.supplier)}</div>` : '';

        const skillsetHtml = member.skillset && member.skillset.length > 0 ? `
            <div class="member-skillset">
                <div class="skillset-label">Skills</div>
                <div class="skills-list">
                    ${member.skillset.map(skill => 
                        `<span class="skill-tag">${escapeHtml(skill)}</span>`
                    ).join('')}
                </div>
            </div>
        ` : '';

        return `
            <div class="member-card">
                <div class="member-name">${member.name ? escapeHtml(member.name) : '<em>Vacancy</em>'}</div>
                ${member.email ? `<div class="member-email">${escapeHtml(member.email)}</div>` : ''}
                <div>
                    <span class="member-role">${escapeHtml(member.role)}</span>
                    <span class="member-role-group">${escapeHtml(member.role_group)}</span>
                    <span class="member-contract ${contractClass}">${escapeHtml(member.contract_type)}</span>
                </div>
                ${supplierInfo}
                ${skillsetHtml}
            </div>
        `;
    }).join('');

    teamDetails.innerHTML = `
        <div class="team-details-header">
            <div>
                <div class="team-details-title">${escapeHtml(teamName)}</div>
                <div style="color: #666; margin-top: 5px;">Pod: ${escapeHtml(podName)} • ${members.length} member${members.length !== 1 ? 's' : ''}</div>
            </div>
            <button class="close-btn" onclick="hideTeamDetails()">Close</button>
        </div>
        <div class="members-grid">
            ${membersHtml}
        </div>
    `;

    // Scroll to team details
    teamDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Hide team details
function hideTeamDetails() {
    document.getElementById('teamDetails').classList.add('hidden');
    currentTeamDetails = null;
}

// Toggle pod collapse/expand
function togglePod(podId) {
    const content = document.getElementById(podId);
    const icon = document.getElementById(`icon-${podId}`);
    
    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        icon.textContent = '▲';
    } else {
        content.classList.add('collapsed');
        icon.textContent = '▼';
    }
}

// Toggle team collapse/expand
function toggleTeam(teamId) {
    const content = document.getElementById(teamId);
    const icon = document.getElementById(`icon-${teamId}`);
    
    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        icon.textContent = '▲';
    } else {
        content.classList.add('collapsed');
        icon.textContent = '▼';
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

