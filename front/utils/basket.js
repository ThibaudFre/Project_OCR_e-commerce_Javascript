import {notValid, quantityInput, overHundred} from "../js/product.js";

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
    let foundProduct = basket.find(p => p.name == product.name);
    if(foundProduct != undefined){
        const sumQuantity = foundProduct.quantity + product.quantity ;
    
        if( sumQuantity <= 100){
            foundProduct.quantity += product.quantity;
            foundProduct.price += product.price;
            console.log("localStorage is not [] and the quant is below 100", basket);
        }else if(sumQuantity > 100){
            console.log("difference is: ", sumQuantity - 100);
            notValid(overHundred, quantityInput);
        }
    }else{
        console.log("localStorage is empty", basket);
        product.quantity = product.quantity;
        basket.push(product);
    }
    saveBasket(basket);
}



export {saveBasket, getBasket, addBasket};