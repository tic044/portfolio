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