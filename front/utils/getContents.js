const getAllContent = async (url) =>{
    try{
        const response =  await fetch(url);
        if (response.ok){
            return await response.json();
        }else{
            throw new Error("error not found");
        }
        
    // à utiliser pour cart = > localStorage / sessionStorage.setItem("products", JSON.stringify(products));
    }catch(error){
        console.log("erreur dans getAllContent");
    }
}
//Get method to target all the Json file in the given url

export default getAllContent;




