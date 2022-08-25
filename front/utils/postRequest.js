

 const saveOrder = (order) => {
    localStorage.setItem("order",JSON.stringify(order));
}

const postOrder = async (order) => {
    try {
        const response = await fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
        if (response.ok) {
            const resp = await response.json();
            saveOrder(resp);
        }else{
            throw new Error("error :", response.status)
        }
    } catch(error) {
        console.log('erreur dans postOrder', error);
    }
}

export {postOrder} ;
