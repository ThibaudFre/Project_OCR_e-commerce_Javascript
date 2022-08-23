import {quantityInput, containSetting, addToCart} from "./../js/product.js";
import {notValid, overHundred, errorNumb} from "./../utils/errorHandler.js"

const getBasket = () => {
   let basket = localStorage.getItem("basket");
   if(basket == null){
    return [];
   }else{
    return JSON.parse(basket);
   }
}

const saveBasket = (basket) => {
    localStorage.setItem("basket",JSON.stringify(basket));
}

const addBasket = (product) => {
    let basket = getBasket();
    let foundProduct = basket.find(p => p.name == product.name && p.color == product.color);
    if(foundProduct != undefined){
        const sumQuantity = foundProduct.quantity + product.quantity ;
    
        if( sumQuantity <= 100){
            foundProduct.quantity += product.quantity;
        }else if(sumQuantity > 100){
            notValid(containSetting[0], overHundred, quantityInput, addToCart);
        }
    }else{
        product.quantity = product.quantity;
        basket.push(product);
    }
    saveBasket(basket);
}



export {saveBasket, getBasket, addBasket};