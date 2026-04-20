const btnTheme = document.getElementById('btn-theme');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});