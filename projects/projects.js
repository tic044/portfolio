import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');

if (projectsTitle) {
    projectsTitle.textContent = `Projects (${projects.length})`;
}
renderProjects(projects, projectsContainer, 'h2');

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
    let selectedIndex = -1;
    let svg = d3.select('#projects-pie-plot');
    
    newArcs.forEach((arc, i) => {
        svg.append('path')
        .attr('d', arc)
        .attr('fill', colors(i))
        .on('click', () => {
            selectedIndex = selectedIndex === i ? -1 : i;
          
            svg
              .selectAll('path')
              .attr('class', (_, idx) => idx === selectedIndex ? 'selected' : '');
          
            legend
              .selectAll('li')
              .classed('selected', (_, idx) => idx === selectedIndex)
              .attr('style', (_, idx) => {
                  if (idx === selectedIndex) {
                      return '--color: oklch(60% 45% 0);';
                  }
                  return `--color: ${colors(idx)};`;
              });

            // Filter projects based on selected year
            if (selectedIndex === -1) {
                renderProjects(projectsGiven, projectsContainer, 'h2');
            }
            else {
                renderProjects(projectsGiven.filter(p => p.year === newData[selectedIndex].label), projectsContainer, 'h2');
            }
          });
    });
}

renderPieChart(projects);

// Query
let query = '';

function setQuery(query) {
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
      });
    return filteredProjects;
}

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    let filteredProjects = setQuery(event.target.value);

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});
