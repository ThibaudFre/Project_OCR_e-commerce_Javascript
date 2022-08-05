const getAllContent = async (url) =>{
    try{
    const response =  await fetch(url);
    let products = await response.json();
    return products;
    // à utiliser pour cart = > localStorage / sessionStorage.setItem("products", JSON.stringify(products));
    }catch(error){
        console.error("erreur dans getAllContent",error.message);
    }
}
//Get method to target all the Json file in the given url

export default getAllContent;




