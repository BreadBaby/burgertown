// Подключение функционала "Чертогов Фрилансера"
//import { hashSettings } from "lightgallery/plugins/hash/lg-hash-settings.js";
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

window.addEventListener('DOMContentLoaded', () => {
    document.addEventListener("click", documentActions);

    function documentActions(e) {
      const targetElement = e.target;

      if (targetElement.classList.contains('cell-items__link')) {
        const productId = targetElement.closest('.cell-items').dataset.pid;
        addToCart(targetElement, productId);
        e.preventDefault();
      }

      if (targetElement.parentNode.classList.contains('item-table__close')) {
        const productId = targetElement.closest('.table__item').dataset.cartPid;
        updateCart(targetElement, productId, false);
        e.preventDefault();
      }
    }

    function addToCart(productButton, productId) {
      if (!productButton.classList.contains('_hold')) {
        productButton.classList.add('_hold');
        productButton.classList.add('_fly');
  
        const cart = document.querySelector('.header__cart');
        const product = document.querySelector(`[data-pid="${productId}"]`);
        const productImage = product.querySelector('.cell-items__image-ibg');
  
        const productImageFly = productImage.cloneNode(true);
  
        const productImageFlyWidth = productImage.offsetWidth;
        const productImageFlyHeight = productImage.offsetHeight;
        const productImageFlyTop = productImage.getBoundingClientRect().top;
        const productImageFlyLeft = productImage.getBoundingClientRect().left;
  
        productImageFly.setAttribute('class', '_flyImage _image-ibg');
        productImageFly.style.cssText =
          `
        left: ${productImageFlyLeft}px;
        top: ${productImageFlyTop}px;
        width: ${productImageFlyWidth}px;
        height: ${productImageFlyHeight}px;
      `;
  
        document.body.append(productImageFly);
  
        const cartFlyLeft = cart.getBoundingClientRect().left;
        const cartFlyTop = cart.getBoundingClientRect().top;
  
        productImageFly.style.cssText =
          `
        left: ${cartFlyLeft}px;
        top: ${cartFlyTop}px;
        width: 0px;
        height: 0px;
        opacity:0;
      `;
  
        productImageFly.addEventListener('transitionend', function () {
          if (productButton.classList.contains('_fly')) {
            productImageFly.remove();
            updateCart(productButton, productId);
            productButton.classList.remove('_fly');
          }
        });
      }
    }
  
    function updateCart(productButton, productId, productAdd = true) {
      const cart = document.querySelector('.header__menucart');
      const cartIcon = cart.querySelector('.header__cart');
      const cartQuantity = cartIcon.querySelector('span');
      const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
      const cartList = document.querySelector('.box__table');
      const product = document.querySelector(`[data-pid="${productId}"]`);
      const cartProductImage = product.querySelector('.cell-items__image-ibg').innerHTML;
      const cartProductTitle = product.querySelector('.cell-items__label').innerHTML;
      const cartProductPrice = product.querySelector('.cell-items__price span').innerHTML.match(/\d+/);

      //Добавляем
      if (productAdd) {
        if (cartQuantity) {
          cartQuantity.innerHTML = ++cartQuantity.innerHTML;
        } else {
          cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
        }
        if (!cartProduct) {
          const cartProductContent = `
        <button type="button" class="item-table__close">
          <img src="/img/vectors/close.svg" alt="">
        </button>
        <div class="item-table__burger">
          <div class="item-table__image">${cartProductImage}</div>
        </div>
        <div class="item-table__name">${cartProductTitle}</div>
        <div class="item-table__quantity"><span>1</span></div>
        <div class="item-table__price"><span>${cartProductPrice}</span> грн</div>
        `;
          cartList.insertAdjacentHTML('beforeend', `<div data-cart-pid="${productId}" class="table__item item-table">${cartProductContent}</div>`);        
        } else {
          const cartProductQuantity = cartProduct.querySelector('.item-table__quantity span');
          const cartProductPricechild = cartProduct.querySelector('.item-table__price span');
          cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
          cartProductPricechild.innerHTML = +cartProductPrice * +cartProductQuantity.innerHTML;
        }
  
        // После всех действий
        productButton.classList.remove('_hold');
      } else {
        const cartProductQuantity = cartProduct.querySelector('.item-table__quantity span');
        const cartProductPricechild = cartProduct.querySelector('.item-table__price span');
        cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
        cartProductPricechild.innerHTML = +cartProductPricechild.innerHTML - +cartProductPrice;
        if (!parseInt(cartProductQuantity.innerHTML)) {
          cartProduct.remove();
        }
   
        const cartQuantityValue = --cartQuantity.innerHTML;
  
        if (cartQuantityValue) {
          cartQuantity.innerHTML = cartQuantityValue;
        } else {
          cartQuantity.remove();
          cart.classList.remove('_active');
        }
      }
    }
// 
    const langs = document.querySelectorAll('.header__linkLanguages'),  
          wrapperLangs = document.querySelectorAll('.header__itemLanguages'),    
          parentLangs = document.querySelector('.header__listlanguages'),
          form = document.querySelector('.form'),
          selectChildren = document.querySelectorAll('.select__option'),
          formAdress = document.querySelector('.form__adress').parentNode;

    function removeActiveLang() {
        langs.forEach(item => {
            item.classList.remove('_activeLang');
        })
    }

    function showActiveLang(i = 1) {
         langs[i].classList.add('_activeLang');
    }

    removeActiveLang();
    showActiveLang();

    parentLangs.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('header__linkLanguages')) {
          langs.forEach((item, i) => {
              if (target == item) {
                if (item.parentElement.dataset.order == '1') {
                  wrapperLangs.forEach(key => {
                    key.dataset.order =  +key.dataset.order + 1;
                    key.style.order = key.dataset.order;
                    if (key.dataset.order > "3") {
                      key.dataset.order = 1;
                      key.style.order = key.dataset.order;
                    }
                  })
                } else if (item.parentElement.dataset.order == '3') {
                  wrapperLangs.forEach(key => {
                    key.dataset.order =  +key.dataset.order - 1;
                    key.style.order = key.dataset.order;
                    if (key.dataset.order < "1") {
                      key.dataset.order = 3;
                      key.style.order = key.dataset.order;
                    }
                  })
                }
                  removeActiveLang();
                  showActiveLang(i);
                }
            });
        }
        event.preventDefault();
    });
// 
    function hideAdress() {
      selectChildren.forEach(item  => {
        if (item.hasAttribute('hidden') && item.getAttribute('data-value') == 'pickup') {
          formAdress.style.display ='flex';
        } else {
          formAdress.style.display ='none';
        }
      })
    }

    form.addEventListener('click', (e) => {
      if (e.target && e.target.tagName == 'BUTTON') hideAdress();    
    });
   
    function hideCard(hold) {
      const cartIcon = document.querySelector('.header__cart');
      const hidesElement = document.querySelector('.order__hidesElement');
      const unHidesElement = document.querySelector('.order__content');
            
      if (!hold) {  
        const timer = setTimeout(function(){
          if (cartIcon.innerText == '') {
            hidesElement.style.display = 'flex';
            unHidesElement.style.display = 'none';
          }else {
            hidesElement.style.display = 'none';
            unHidesElement.style.display = 'flex';
          }
        },1010);   
      }
    };

    hideCard();
//
    const cartfinalPrice = document.querySelector('.box__finalPrice span');
    const bodyTabs = document.querySelector('.tabs-menu__content');
    const buttonAdd = bodyTabs.querySelectorAll('.cell-items__link'); 
    const parentBox = document.querySelector('.box');

    function updateFinalPrice(num, hold) {
      if (!hold) {
        cartfinalPrice.textContent = +cartfinalPrice.textContent + +num;   
      }
    }

    bodyTabs.addEventListener('click', (e) => {
     
      if ( e.target && e.target.classList.contains('cell-items__link')) {
        let num, hold;
        if (e.target.classList.contains('_hold')) {
          return hold = true;
        }
        buttonAdd.forEach(elem => { 
          if (e.target == elem) {
             return num = +elem.parentElement.previousElementSibling.innerHTML.match(/\d+/);
          }
        });
        updateFinalPrice(num, hold);
        hideCard(hold);
      }
    });
    
    parentBox.addEventListener('click', (e) => {
      if ( e.target && e.target.parentNode.classList.contains('item-table__close')) {
        cartfinalPrice.textContent = '';
        let arr = e.target.parentNode.parentNode.parentNode.childNodes;
          arr.forEach(elem => {
            if (elem.nodeName != '#text' && (elem.classList.length < 3)) {
              const timer = setTimeout(function(){
                cartfinalPrice.textContent = +cartfinalPrice.textContent + +elem.lastElementChild.innerText.match(/\d+/); 
                hideCard();
              },10);  
          }      
          });
      }
      
    });

// phone number input mask
    [].forEach.call(document.querySelectorAll('input[type="tel"]'), function (input) {
      let keyCode;
      function mask(event) {
        event.keyCode && (keyCode = event.keyCode);
        let pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        let matrix = '+38(___)___-__-__',
          i = 0,
          def = matrix.replace(/\D/g, ''),
          val = this.value.replace(/\D/g, ''),
          new_value = matrix.replace(/[_\d]/g, function (a) {
            return i < val.length ? val.charAt(i++) || def.charAt(i) : a
          });
        i = new_value.indexOf('_');
        if (i != -1) {
          i < 5 && (i = 3);
          new_value = new_value.slice(0, i)
        }
        var reg = matrix.substr(0, this.value.length).replace(/_+/g,
          function (a) {
            return '\\d{1,' + a.length + '}'
          }).replace(/[+()]/g, '\\$&');
        reg = new RegExp('^' + reg + '$');
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
        if (event.type == 'blur' && this.value.length < 5) this.value = ''
      }
      input.addEventListener('input', mask, false);
      input.addEventListener('focus', mask, false);
      input.addEventListener('blur', mask, false);
      input.addEventListener('keydown', mask, false);
    });
});


