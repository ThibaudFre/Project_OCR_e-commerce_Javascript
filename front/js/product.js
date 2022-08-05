import getAllContent from "./../utils/getContents.js";
//get the ID
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

const messageError = () =>{
    let article = document.getElementsByTagName("article");
    article[0].innerHTML=`Produit indisponnible.<br><br> Veuillez recharger la page ou bien retourner sur la page <br><br><a href= './index.html' alt= "page d'Acceuil">d'acceuil.</a>`;
    article[0].style.textAlign = "center";
}




getAllContent(`http://localhost:3000/api/products/${id}`)
.then((item) =>{
    if(item.name === undefined){
        messageError();
    }
    //Creation in the item__img div of the kanap img product:
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.altTxt;

    const containerImg = document.getElementsByClassName("item__img")[0];
    containerImg.appendChild(img);

    //adding of the title
    let title = document.getElementById("title");
    title.innerHTML = item.name;

    //adding of the price
    let price = document.getElementById("price");
    price.innerHTML = item.price;

    //adding of the kanap description
    let description = document.getElementById("description");
    description.innerHTML = item.description;
    
})
.catch((err)=> {
    messageError();
    console.log("erreur:",err);
});