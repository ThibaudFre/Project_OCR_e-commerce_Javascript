import { ifValid, notValid, overHundred, errorNumb } from "../utils/errorHandler.js";
import * as basket from "./../utils/basket.js";

let title = document.getElementById("title");
let price = document.getElementById("price");

//get the ID
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");
//get all the setting section elements needed
const form = document.getElementById('productForm');
const containSetting = document.getElementsByClassName('item__content__settings__quantity');
const selectColors = document.getElementById('colors');
const quantityInput = document.getElementById('quantity');
const addToCart = document.getElementById('addToCart');
//messages of error in case of invalid input
const errorColor = document.createElement('p');
errorColor.innerHTML = "Veuillez renseigner une couleur";

//-------------------METHODS------------------

//message when the product is unavailable
const messageProductError = () => {
    let article = document.getElementsByTagName("article");
    article[0].innerHTML = `Produit indisponnible. Veuillez recharger la page ou bien retourner sur la page <a href= './index.html' alt= "page d'Acceuil">d'acceuil.</a>`;
    article[0].style.textAlign = "center";
}
//-------------------------------------------------------

//check if a color have been choosed
const isSelectedColor = () => {
    if (selectColors.value == "") {
        notValid(containSetting[0], errorColor, selectColors, addToCart);
    } else {
        ifValid(containSetting[0], errorColor, selectColors, addToCart);
    }
}

//check if the user input value is between 0 and 100
const checkQuantity = (quantity) => {
    if (quantity <= 0 || quantity > 100) {
        notValid(containSetting[0], errorNumb, quantityInput, addToCart);
    } else {
        ifValid(containSetting[0], errorNumb, quantityInput, addToCart);
        ifValid(containSetting[0], overHundred, quantityInput, addToCart);
    }
}

//function used to check the user number input values
const isANumber = (e) => {
    let regEx = /^[0-9]{1,3}$/;

    if (regEx.test(e.target.value)) {
        checkQuantity(e.target.valueAsNumber);
    } else {
        notValid(containSetting[0], errorNumb, quantityInput, addToCart);
    }
}
//--------------------------------------------------------

//function of the addToCart button eventListener
const toAddToCart = (e) => {
    e.preventDefault();
    isSelectedColor();
    checkQuantity(quantityInput.valueAsNumber);
    if (addToCart.disabled == false) {
        basket.addBasket(
            {
                "id": id,
                "name": title.innerHTML,
                "color": selectColors.value,
                "quantity": quantityInput.valueAsNumber
            });
        form.reset();
    }
}

//--------------------------------------------------------

//function to check if the button disabled is true when the input is reset to put it abled
const isButtonDisabled = () => {
    if (addToCart.disabled == true) {
        addToCart.disabled = false;
    }
}
//--------------------------------------------------------

if (id) {
    fetch(`http://localhost:3000/api/products/${id}`)
        .then(resp => {
            if (resp.ok) {
                return resp.json();
            }
        })
        .then((item) => {
            //Creation in the item__img div of the kanap img product:
            const img = document.createElement("img");
            img.src = item.imageUrl;
            img.alt = item.altTxt;

            const containerImg = document.getElementsByClassName("item__img")[0];
            containerImg.appendChild(img);

            //adding of the title
            title.innerHTML = item.name;

            //adding of the price
            price.innerHTML = item.price;

            //adding of the kanap description
            let description = document.getElementById("description");
            description.innerHTML = item.description;

            //adding colors deppending of the colors available in the product/item.colors array and make it required
            selectColors.setAttribute('required', '');
            selectColors.addEventListener('change', isSelectedColor);

            for (let color of item.colors) {
                let option = document.createElement('option');
                option.value = color;
                option.innerHTML = color;
                selectColors.appendChild(option);
            }

            //adding required to the quantity input and an event listener to check the value
            quantityInput.setAttribute('required', '');
            quantityInput.addEventListener('change', isANumber);
            form.addEventListener('reset', isButtonDisabled)
            //adding an eventListener to the addToCart button
            addToCart.addEventListener('click', toAddToCart)

        })
        .catch((err) => {
            messageProductError();
            console.log("erreur:", err);
        });
}

export { notValid, quantityInput, overHundred, containSetting, addToCart};