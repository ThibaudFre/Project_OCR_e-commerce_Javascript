import getAllContent from "../utils/getContents.js";
import { postOrder } from "../utils/postRequest.js";
import { ifValid, notValid, errNaN, errorNumb } from "../utils/errorHandler.js";
import { getBasket, saveBasket } from "../utils/basket.js";

let panier = getBasket();
const cartItems = document.getElementById('cart__items');
let priceCount;
const totalPrice = document.getElementById('totalPrice');
let articleCount;
const totalProduct = document.getElementById("totalQuantity");
const orderButton = document.getElementById('order');

//form const
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');
const errFirstName = "Veuillez renseignez un prénom sous forme de lettres. Charactère spéciaux (-,!...) et nombres interdits. "
const errLastName = "Veuillez renseignez un nom sous forme de lettres. Charactère spéciaux (-,!...) et nombres interdits. "
const errAdress = "Veuillez renseignez une adress valide. Charactère spéciaux (,!+.*...) interdits. "
const errCity = "Veuillez renseignez une ville valide. Charactère spéciaux (,!+.*...) et nombres interdits. "
const errEmail = "Veuillez renseigner un email valide."
//-------------------METHODS------------------

//form checker

const regExCheck = (regEx, toTest, from, errMess) => {

    if (toTest != "") {
        if (regEx.test(toTest)) {
            from.parentElement.lastElementChild.innerHTML = "";
            if (orderButton.disabled = true) {
                orderButton.disabled = false;
            }
        } else {
            from.parentElement.lastElementChild.innerHTML = errMess;
            orderButton.disabled = true;
        }
    }
}

const checkFirstName = () => {
    regExCheck(/^[a-zéèç\s]{2,}$/ig, firstName.value, firstName, errFirstName);
}
firstName.addEventListener('input', checkFirstName);

const checkLastName = () => {
    regExCheck(/^[a-zéèç\s]{2,}$/ig, lastName.value, lastName, errLastName);
}
lastName.addEventListener('input', checkLastName);

const checkAdress = () => {
    regExCheck(/^[a-z0-9éèç\s\,\''\-]*$/gi, address.value, address, errAdress);
}
address.addEventListener('input', checkAdress);

const checkCity = () => {
    regExCheck(/^[a-zéèç\s\']*$/gi, city.value, city, errCity);
}
city.addEventListener('input', checkCity);

const checkEmail = () => {
    regExCheck(/^[a-zA-Z_-]+\w*[\@]{1,1}[a-z]{2,}\.{1,}[a-z]{2,}$/, email.value, email, errEmail);
}
email.addEventListener('change', checkEmail);

//------------------------------------------------------------------------

//method to calculate the sum of all the products(price and quantity);
const priceAndQuantCount = () => {
    const arrOfPrices = document.getElementsByClassName("price");
    const arrOfQuant = document.getElementsByClassName("quant");
    priceCount = 0;
    articleCount = 0;
    for (let i = 0; i < arrOfPrices.length; i++) {
        priceCount += parseInt(arrOfPrices[i].innerHTML.substring(0, arrOfPrices[i].innerHTML.length - 1)) * arrOfQuant[i].valueAsNumber;
        articleCount += arrOfQuant[i].valueAsNumber;
    }
    totalPrice.innerHTML = priceCount;
    totalProduct.innerHTML = articleCount;

}

//method to check the number input and change the localStorage
const changeLocalStorage = (e) => {
    const productsList = panier.map(elem => elem);
    const newNumb = e.target.valueAsNumber;
    const parent = e.target.closest("article");
    const id = parent.dataset.id;
    const color = parent.dataset.color;

    if (newNumb <= 0 || newNumb > 100) {
        notValid(e.target.parentElement.parentElement, errorNumb, e.target, orderButton);
    } else {
        ifValid(e.target.parentElement.parentElement, errorNumb, e.target, orderButton);
        for (let product of productsList) {
            if (product.id === id.substring(1, id.length - 1) && product.color === color.substring(1, color.length - 1)) {
                product.quantity = newNumb;
            }
        }
        priceAndQuantCount();
    }

    saveBasket(productsList);
}

const isANumber = (e) => {
    let regEx = /^[0-9]{1,3}$/;
    if (regEx.test(e.target.value)) {
        ifValid(e.target.parentElement.parentElement, errNaN, e.target, orderButton);
        changeLocalStorage(e);
    } else {
        notValid(e.target.parentElement.parentElement, errNaN, e.target, orderButton);
    }
}

const numberChanged = (e) => {
    isANumber(e);
}

//method to remove the item when user click on delete
const removeItem = (e) => {
    let productsList = panier.map(elem => elem);
    let finalBasket;
    console.log('productList is : ', productsList);
    const parent = e.target.closest('article');
    const id = parent.dataset.id;
    const color = parent.dataset.color;

    finalBasket = productsList.filter(item => {
        return item.id != id.substring(1, id.length - 1) || item.color != color.substring(1, color.length - 1);
    });

    saveBasket(finalBasket);
    cartItems.removeChild(parent);
    panier = getBasket();
    priceAndQuantCount();

}
const createObjectOrder = () => {
    const productsIds = panier.map(item => item.id);
    return {
        'contact': {
            'firstName': firstName.value,
            'lastName': lastName.value,
            'address': address.value,
            'city': city.value,
            'email': email.value
        },
        'products': productsIds
    }
}

//method to check again the user data value and post the order
const postToOrder = (e) => {
    e.preventDefault();
    checkFirstName();
    checkLastName();
    checkAdress();
    checkCity();
    checkEmail();
    if (!orderButton.disabled) {
        const order = createObjectOrder();
        postOrder(order);
        window.location.href = "./confirmation.html";
    }
}

if (panier.length > 0) {
    for (let object of panier) {
        getAllContent(`http://localhost:3000/api/products/${object.id}`)
            .then(item => {

                //-------------IMAGE----------------------
                const img = document.createElement("img");
                img.classList.add()
                img.src = item.imageUrl;
                img.alt = item.altTxt;

                const imgContain = document.createElement('div');
                imgContain.classList.add("cart__item__img");
                imgContain.appendChild(img);

                //----------------CONTENT------------------
                //PRODUCT DESCRIPTION
                const productTitle = document.createElement('div');
                productTitle.innerHTML = item.name;

                const colorText = document.createElement('p');
                colorText.innerHTML = object.color;

                const price = document.createElement('p');
                price.classList.add('price');
                price.innerHTML = `${item.price} €`;

                const description = document.createElement('div');
                description.classList.add('cart__item__content__description');
                description.appendChild(productTitle);
                description.appendChild(colorText);
                description.appendChild(price);
                //SETTING
                const quantity = document.createElement('p');
                quantity.innerHTML = "Qté : ";

                const quantityInput = document.createElement('input');
                quantityInput.classList.add('quant');
                quantity.step = "1",
                    quantityInput.type = "number";
                quantityInput.classList.add("itemQuantity");
                quantityInput.name = "itemQuantity";
                quantityInput.min = "1";
                quantityInput.max = "100";
                quantityInput.value = object.quantity;
                quantityInput.addEventListener('change', numberChanged);

                const deleteText = document.createElement("p");
                deleteText.classList.add("deleteItem");
                deleteText.innerHTML = "Supprimer";
                deleteText.addEventListener('click', removeItem);

                const deleteContain = document.createElement('div');
                deleteContain.classList.add("cart__item__content__settings__delete");
                deleteContain.appendChild(deleteText);

                const quantitySet = document.createElement("div");
                quantitySet.classList.add("cart__item__content__settings__quantity");
                quantitySet.appendChild(quantity);
                quantitySet.appendChild(quantityInput);
                quantitySet.appendChild(deleteContain);

                const settingContain = document.createElement('div');
                settingContain.classList.add("cart__item__content__settings");
                settingContain.appendChild(quantitySet);

                const contentContain = document.createElement('div');
                contentContain.classList.add("cart__item__content");
                contentContain.appendChild(description);
                contentContain.appendChild(settingContain);
                //-----------------ARTICLE------------------
                const article = document.createElement("article");
                article.classList.add('cart__item');
                article.setAttribute('data-id', `{${object.id}}`);
                article.setAttribute('data-color', `{${object.color}}`);
                article.appendChild(imgContain);
                article.appendChild(contentContain);

                cartItems.appendChild(article);
                priceAndQuantCount();
                orderButton.disabled = true;
                orderButton.addEventListener("click", postToOrder);
            })
            .catch(error => {
                cartItems.innerHTML = `<p>Erreur de chargement. Veuillez retourner sur la page <a href= './index.html' alt= "page d'Acceuil">d'acceuil</a>, ou bien recharger la page.`;
                cartItems.style.textAlign = "center";
                console.log("produits non chargés", error)
            })
    }
}else{
    cartItems.innerHTML =`<p> Votre panier est vide.</p>`
    cartItems.style.textAlign= "center";
    totalPrice.innerHTML = "0";
    totalProduct.innerHTML = "0";
}



