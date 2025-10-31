import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');

if (projectsTitle) {
    projectsTitle.textContent = `Projects (${projects.length})`;
}
renderProjects(projects, projectsContainer, 'h2');

let selectedYear = null;
let query = '';

// Unified filtering function that applies both filters
function getFilteredProjects() {
    let filtered = projects;
    
    // Apply search query filter
    if (query) {
        filtered = filtered.filter((project) => {
            let values = Object.values(project).join('\n').toLowerCase();
            return values.includes(query.toLowerCase());
        });
    }
    
    // Apply year filter
    if (selectedYear !== null) {
        filtered = filtered.filter(p => p.year === selectedYear);
    }
    
    return filtered;
}

function updateDisplay() {
    let filteredProjects = getFilteredProjects();
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
}

function renderPieChart(projectsGiven) {

    let newRolledData = d3.rollups(
        projectsGiven, 
        v => v.length,
        d => d.year,
    );

    // Pie Chart

    let newData = newRolledData.map(([year, count]) => ({
        value: count,
        label: year,
    }));

    let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newSliceGenerator = d3.pie().value(d => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map(d => newArcGenerator(d));

    // Clear paths and legends
    d3.select('#projects-pie-plot').selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();
    // Set colors
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let legend = d3.select('.legend');
    newData.forEach((d, index) => {
        legend.append('li')
        .attr('style', `--color: ${colors(index)};`)
        .attr('class', 'legend-item')
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    })

    // Selecting pie chart wedges
    let svg = d3.select('#projects-pie-plot');
    
    newArcs.forEach((arc, i) => {
        svg.append('path')
        .attr('d', arc)
        .attr('fill', colors(i))
        .on('click', () => {
            // Toggle year selection
            if (selectedYear === newData[i].label) {
                selectedYear = null; // Deselect
            } else {
                selectedYear = newData[i].label; // Select this year
            }
            
            // Update display with both filters
            updateDisplay();
          });
    });
    
    // Restore selection state after re-rendering
    newData.forEach((d, idx) => {
        if (d.label === selectedYear) {
            svg.selectAll('path')
              .filter((_, i) => i === idx)
              .attr('class', 'selected');
          
            legend.selectAll('li')
              .filter((_, i) => i === idx)
              .classed('selected', true)
              .attr('style', `--color: oklch(60% 45% 0);`);
        }
    });
}

renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    updateDisplay();
});
