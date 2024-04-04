document.addEventListener('DOMContentLoaded', getProducts);

function getProducts() {
    fetch('https://fakestoreapi.com/products')
        .then((res) => res.json())
        .then((data) => {
            let output = '';
            data.forEach(function (product) {
                output += `
                    <div class="col-xl-4 col-md-6">
                        <h2 class="text-dark" >${product.title}</h2>
                        <img src="${product.image}" class="card-img-top img-fluid" alt="">
                        <div class="card-body align-self-end">
                            <!-- <p class="card-text">${product.description}</p> -->
                            <p class="card-text text-dark">Price: <small class="text-muted">${product.price.toFixed(2)}$</small></p>
                            <p class="card-text text-dark">Category: <small class="text-muted">${product.category}</small></p>
                            <button id="${product.id}" class="align-self-end btn btn-warning">Add product to cart</button>
                            <hr>
                        </div>
                    </div>
                `;
            });
            document.getElementById('output').innerHTML = output;
        
            // console.log(res);
                    
            data.forEach(function (product) {
            let btn = document.getElementById(product.id);
            //console.log(product.id);
            btn.addEventListener('click', function(){ saveProductToLocalstorage(product);});
                
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}
function saveProductToLocalstorage(product) {
    //console.log(product);

    let cartOfProducts = JSON.parse(localStorage.getItem("selectedItems")) ||  [];

    if (cartOfProducts.length === 0) { //Om arrayen ej finns skapas en upp. 
    cartOfProducts[0] = product;
    console.log(cartOfProducts[0]);
     } 
     else {
        cartOfProducts.push(product); // Lägger till produkten i slutet av arrayen
        console.log(cartOfProducts[cartOfProducts.length - 1]); // Loggar den nyligen tillagda produkten
    }

    console.log("Innehåll i cartOfProducts:", cartOfProducts); //Visar innehååll i varukorg. 
    localStorage.setItem("selectedItems", JSON.stringify(cartOfProducts)); //Sparar varukorg i localstorage
   
}