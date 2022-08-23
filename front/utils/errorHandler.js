//messages of error in case of the quantity in localstorage will be over 100 when the user want to addToCart
const overHundred = document.createElement('p');
overHundred.innerHTML = `Vous ne pouvez pas ajouter plus de 100 articles par produit. Veuillez renseignez un nombre d'article inférieur.`;
const errorNumb = document.createElement('p');
errorNumb.innerHTML = "Veuillez renseigner un nombre compris entre 1 et 100.";
const errNaN = document.createElement('p');
errNaN.innerHTML= "Tout charactère autre qu'un chiffre est interdit. Veuillez renseigner un nombre.";
//Act when the user input value isn't valid
const notValid = (containErr, errMess, becomeRed, button) => {
    containErr.appendChild(errMess);
    becomeRed.style.borderColor = "red";
    button.setAttribute("disabled", true);
    errMess.classList.add('error');
}
//Act when the input value is valid
const ifValid = (removeFrom, messToRemove, becomeBlack, button) => {
    if (removeFrom.contains(messToRemove)) {
        removeFrom.removeChild(messToRemove);
        becomeBlack.style.borderColor = "black";
        button.disabled = false;
    }
}

export {notValid, ifValid, overHundred, errorNumb, errNaN}