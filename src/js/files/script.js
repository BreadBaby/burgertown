// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

window.addEventListener('DOMContentLoaded', () => {
    const langs = document.querySelectorAll('.header__linkLanguages'),
          parentLangs = document.querySelector('.header__listlanguages');

    function removeActiveLang() {
        langs.forEach(item => {
            item.classList.remove('_activeLang');
        })
    }

    function showActiveLang(i = 0) {
        langs[i].classList.add('_activeLang');
    }
    removeActiveLang();
    showActiveLang();

    parentLangs.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('header__linkLanguages')) {
            langs.forEach((item, i) => {
                if (target == item) {
                    removeActiveLang();
                    showActiveLang(i);
                }
            });
        }
    });  
});
