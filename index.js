import { fetchJSON, renderProjects, fetchGithubData } from './global.js';

const projects = await fetchJSON('../lib/projects.json');
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');

const githubData = await fetchGithubData('tic044');

const profileStats = document.querySelector('#profile-stats');

if (profileStats) {
    profileStats.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <dt>Public Repos</dt>
                <dd>${githubData.public_repos}</dd>
            </div>
            <div class="stat-card">
                <dt>Public Gists</dt>
                <dd>${githubData.public_gists}</dd>
            </div>
            <div class="stat-card">
                <dt>Followers</dt>
                <dd>${githubData.followers}</dd>
            </div>
            <div class="stat-card">
                <dt>Following</dt>
                <dd>${githubData.following}</dd>
            </div>
        </div>
      `;
  }