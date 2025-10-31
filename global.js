console.log('IT\'S ALIVE!');

const BASE_PATH =
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? '/' // Local server
    : '/portfolio/'; // GitHub Pages repo name

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$('nav a');

// let currentLink = navLinks.find((a) => a.host === location.host && a.pathname === location.pathname);
// currentLink?.classList.add('current');

let pages = [
    { url: '', title: 'Home'},
    {url: 'projects/', title: 'Projects' },
    {url: 'contact/', title: 'Contact' },
    {url: 'resume/', title: 'Resume' },
    {url: 'https://github.com/tic044', title: 'Github' },
]

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    
    // Prepend BASE_PATH to relative URLs
    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
    }
    
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host !== location.host) {
        a.target = '_blank';
    }
    
    nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `<label class="color-scheme">Theme:
        <select>
            <option value="light dark">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>`
);

let select =  document.querySelector('select');
select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value)
    document.documentElement.style.setProperty('color-scheme', event.target.value)
    localStorage.colorScheme = event.target.value;
});

if ('colorScheme' in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}

let form = document.querySelector('form');
form?.addEventListener('submit', function (event) {
    event.preventDefault(); // Stop the default form submission
    
    let data = new FormData(form);
    
    let url = form.action + '?';
    
    for (let [name, value] of data) {
        let encodedValue = encodeURIComponent(value);
        url += name + '=' + encodedValue + '&';
    }
    
    url = url.slice(0, -1);    
    location.href = url;
});

// Make articles with data-href clickable
$$('article[data-href]').forEach(article => {
    article.style.cursor = 'pointer';
    article.addEventListener('click', function() {
        location.href = this.dataset.href;
    });
});

export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
    }

  }

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';
    
    for (const project of projects) {
        const article = document.createElement('article');
        
        // If project has a URL, make it clickable
        if (project.url) {
            // Prepend BASE_PATH to relative URLs
            const url = project.url.startsWith('http') ? project.url : BASE_PATH + project.url;
            article.dataset.href = url;
            article.style.cursor = 'pointer';
            article.addEventListener('click', function() {
                location.href = this.dataset.href;
            });
        }
        
        // Prepend BASE_PATH to relative image paths
        const imageSrc = project.image.startsWith('http') ? project.image : BASE_PATH + project.image;
        
        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <img src="${imageSrc}" alt="${project.title}">
            <div>
                <p>${project.description}</p>
                <p>${project.year}</p>
            </div>
        `;
        containerElement.appendChild(article);
    }

}

export async function fetchGithubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);

}