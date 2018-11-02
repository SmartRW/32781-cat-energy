const navButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-navigation');
const mqMobile = window.matchMedia('(max-width: 767px)');

if (mqMobile.matches) {
  nav.classList.add('visually-hidden');
  navButton.classList.remove('menu-button_opened');
  navButton.classList.add('menu-button_closed');
}

mqMobile.addListener((e) => {
  if (e.matches) {
    nav.classList.add('visually-hidden');
    navButton.classList.remove('menu-button_opened');
    navButton.classList.add('menu-button_closed');
  } else {
    nav.classList.remove('visually-hidden');
  }
});

navButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (navButton.classList.contains('menu-button_opened')) {
    navButton.classList.remove('menu-button_opened');
    navButton.classList.add('menu-button_closed');
    nav.classList.add('visually-hidden');
  } else {
    navButton.classList.remove('menu-button_closed');
    navButton.classList.add('menu-button_opened');
    nav.classList.remove('visually-hidden');
  }
});
