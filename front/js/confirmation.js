let orderData = JSON.parse(localStorage.getItem("order"));
console.log(orderData);

let orderId = document.getElementById('orderId');
orderId.innerHTML = orderData.orderId;