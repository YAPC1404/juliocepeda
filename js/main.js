const btnTheme = document.getElementById('btn-theme');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");

let index = 0;

function updateSlide() {
  slider.style.transform = `translateX(-${index * 100}%)`;
}

document.querySelector(".next").onclick = () => {
  index = (index + 1) % slides.length;
  updateSlide();
};

document.querySelector(".prev").onclick = () => {
  index = (index - 1 + slides.length) % slides.length;
  updateSlide();
};


setInterval(() => {
  index = (index + 1) % slides.length;
  updateSlide();
}, 4000);