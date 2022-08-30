const contenerProducts = document.getElementById("items");

fetch("http://localhost:3000/api/products")
    .then(resp => {
        if (resp.ok) {
            return resp.json();
        }
    })
    .then((data) => {
        console.log(data);
        /*for each product I want to create in the items section:
            - a link wich contain: 
                - an article wich contain:
                    - an img of kanap n°
                    - an h3 title for the kanap name
                    - a p as a description of the product*/
        for (let item of data) {
            const img = document.createElement("img");
            img.src = item.imageUrl;
            img.alt = item.altTxt;

            const title = document.createElement("h3");
            title.classList.add('productName');
            title.innerHTML = item.name;

            const p = document.createElement("p");
            p.classList.add("productDescription");
            p.innerHTML = item.description;

            const article = document.createElement("article");
            article.appendChild(img);
            article.appendChild(title);
            article.appendChild(p);

            const a = document.createElement("a");
            a.href = `./product.html?id=${item._id}`;
            a.appendChild(article);

            contenerProducts.appendChild(a);
        }
    })
    .catch((err) => {
        //if error:
        contenerProducts.innerHTML = "Erreur de chargement";
    })