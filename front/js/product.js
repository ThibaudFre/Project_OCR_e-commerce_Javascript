import getAllContent from "./../utils/getContents.js";
import  * as basket from "./../utils/basket.js";

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
const errorNumb = document.createElement('p');
    errorNumb.innerHTML = "Veuillez renseigner un nombre compris entre 1 et 100.";
//message of error in case of the quantity in localstorage will be over 100 when the user want to addToCart

const overHundred = document.createElement('p');
    overHundred.innerHTML= `Vous ne pouvez pas ajouter plus de 100 articles par produit. Veuillez renseignez un nombre d'article inférieur`;

    //-------------------METHODS------------------

//message when the product is unavailable
const messageProductError = () =>{
    let article = document.getElementsByTagName("article");
    article[0].innerHTML=`Produit indisponnible. Veuillez recharger la page ou bien retourner sur la page <a href= './index.html' alt= "page d'Acceuil">d'acceuil.</a>`;
    article[0].style.textAlign = "center";
}
//-------------------------------------------------------
//Act when the user input value isn't valid
const notValid = (errMess, becomeRed) =>{
    containSetting[0].appendChild(errMess);
    becomeRed.style.borderColor = "red";
    addToCart.setAttribute("disabled", true);
    errMess.classList.add('error');
}
//Act when the input value is valid
const ifValid = (messToRemove, becomeBlack) => {
    if (containSetting[0].contains(messToRemove)){
        containSetting[0].removeChild(messToRemove);
        becomeBlack.style.borderColor = "black";
        addToCart.disabled = false; 
    } 
}
//check if a color have been choosed
const isSelectedColor = () =>{
    if(selectColors.value == ""){
        notValid(errorColor, selectColors);
    }else{
        ifValid(errorColor, selectColors);
    }
}

//check if the user input value is between 0 and 100
const checkQuantity = (quantity) =>{
    if (quantity <= 0 || quantity > 100){
        notValid(errorNumb, quantityInput);
    }else{
        ifValid(errorNumb, quantityInput);
        ifValid(overHundred, quantityInput);
    }
}

//function used to check the user number input values
const isANumber = (e) =>{
    let regEx = /^[0-9]{1,3}$/;
    
    if(regEx.test(e.target.value)){
        checkQuantity(e.target.valueAsNumber);
    }else{
        notValid(errorNumb, quantityInput);
    }
}
//--------------------------------------------------------

//function of the addToCart button eventListener
const toAddToCart = (e) =>{
    e.preventDefault();
    isSelectedColor();
    checkQuantity(quantityInput.valueAsNumber);
    if(addToCart.disabled == false){
        basket.addBasket(
            {
                "name":`${title.innerHTML}-${selectColors.value}`,
                "quantity": quantityInput.valueAsNumber,
                "price": parseInt(price.innerHTML) * quantityInput.valueAsNumber
            });
        form.reset();
    }   
}

//--------------------------------------------------------

//function to check if the button disabled is true when the input is reset to put it abled
const isButtonDisabled = () =>{
    if(addToCart.disabled == true){
        addToCart.disabled = false;
    }
}
//--------------------------------------------------------

getAllContent(`http://localhost:3000/api/products/${id}`)
.then((item) =>{
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

    for(let color of item.colors){
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
.catch((err)=> {
    messageProductError();
    console.log("erreur:",err);
});

export{notValid, quantityInput, overHundred};