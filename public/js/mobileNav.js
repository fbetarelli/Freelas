const hamburguerMenu = document.getElementById('hamburgerMenu')
const menubackground = document.getElementById('menubackground')
const menu = document.getElementById('menu')

hamburguerMenu.addEventListener('click', () => {
    menu.classList.replace('left-full', 'left-[30%]')

    menubackground.classList.replace('hidden', 'absolute')

})

menubackground.addEventListener('click', () => {
    menu.classList.replace('left-[30%]', 'left-full')
    menubackground.classList.replace('absolute', 'hidden')
})

const header = document.getElementById('header')
let lastScroll

document.addEventListener('scroll', () => {
    let currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 80) {
        header.classList.replace('translate-y-0', 'translate-y-[-100%]')
    } else {
        header.classList.replace('translate-y-[-100%]', 'translate-y-0')
    }

    lastScroll = currentScroll;

})