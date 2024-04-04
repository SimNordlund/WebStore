//Hämtar alla produkter
let allProductsFromStorage = JSON.parse(localStorage.getItem("selectedItems")); //Gör om JSON strängarna till objekt array ifrån ls
console.log(allProductsFromStorage);

let sumPriceOfAllProducts = 0;

if (allProductsFromStorage !== null && allProductsFromStorage.length != 0) {
document.getElementById("goToFormPage").style.display ="block";
document.getElementById("emptyCartButton").style.display = "block";
//Tar bort dubletter av produkter
let noDoublicatesList = removeDuplicates(allProductsFromStorage);

let countAllProducts = countProductsMap(allProductsFromStorage);

showAllProducts = document.getElementById("showAllProducts");

for (let i = 0; i < noDoublicatesList.length; i++) {
  showCart(noDoublicatesList[i], countAllProducts);
}

let getDivToShowTotalPrice  = document.getElementById("sumCostOfAllProducts"); 
getDivToShowTotalPrice.innerHTML = `<h2>Total price for all products: `+ 
                                    sumPriceOfAllProducts.toFixed(2) + 
                                    `$</h2> <br> <hr>`
}

else {
  let getFormPageButton = document.getElementById("allButtons"); 
  getFormPageButton.innerHTML = ` <div class = "text-center">
  <a id="buttonEmptyCart" href="index.html" class="btn btn-warning">
     Home Page
  </a>
  <hr>
  </div>`;
  getFormPageButton.style.margin = '50px';
  let getEmptyCartButton = document.getElementById("emptyCartButton");
  getEmptyCartButton.innerHTML = `<div></div>`;
}

// Modifierad showCart för att inkludera ett unikt omslagsdiv och uppdatera produktantalet
function showCart(productInList, countAllProducts) {
  const productCount = countAllProducts.get(productInList.id) || 0;
  const productWrapperId = `product-wrapper-${productInList.id}`;
  sumPriceOfAllProducts += productInList.price * productCount;

  const productElement = document.createElement("div");
  productElement.setAttribute("id", productWrapperId);
  productElement.innerHTML = `
    <h1>${productInList.title} <br>Price: ${productInList.price.toFixed(2)}$ each</h1>
    <h3 id="count-${
      productInList.id
    }"><br>Quantity: ${productCount}<br>Total price: ${
    (productInList.price * productCount).toFixed(2)}$
    </h3>
    <br>
    <img src="${productInList.image}" class="card-img-top img-fluid" alt="">
    <div class="d-flex justify-content-center">
      <button id="add-${
        productInList.id
      }" class="btn btn-warning">Add product</button>
      <button id="remove-${
        productInList.id
      }" class="btn btn-outline-secondary">Remove product</button>
    </div> <br> <hr>`;

  showAllProducts.appendChild(productElement);

  // Eventlyssnare för att lägga till produkter
  document
    .getElementById(`add-${productInList.id}`)
    .addEventListener("click", () => {
      addProduct(productInList, productInList.price);
    });

  // Eventlyssnare för att ta bort produkter
  document
    .getElementById(`remove-${productInList.id}`)
    .addEventListener("click", () => {
      clearOneProduct(productInList.id, productInList.price);
    });
}

function addProduct(productToAdd, productPrice) {
  // Lägg till produkten i localStorage
  let allProducts = JSON.parse(localStorage.getItem("selectedItems")) || [];
  allProducts.push(productToAdd);
  localStorage.setItem("selectedItems", JSON.stringify(allProducts));

  updateProductDisplay(productToAdd.id, allProducts, productPrice);

  updatePrice();
}

function clearOneProduct(productToRemove, productPrice) {
  // Hämta den nuvarande listan av produkter från localStorage
  let allProducts = JSON.parse(localStorage.getItem("selectedItems")) || [];

  // Hitta index för en produkt med det givna ID:t
  const productIndex = allProducts.findIndex(
    (product) => product.id === productToRemove
  );

  // Om produkten finns, ta bort den från listan
  if (productIndex !== -1) {
    allProducts.splice(productIndex, 1);

    // Uppdatera localStorage med den nya listan
    localStorage.setItem("selectedItems", JSON.stringify(allProducts));

    // Uppdatera den visuella representationen och mängden produkter
    updateProductDisplay(productToRemove, allProducts, productPrice);

    //Om alla produkter är borttagna så visas tillbaka knapp
    if (allProducts.length === 0) { 
      showAllProducts.innerHTML = `<div class = "text-center">
        <a href="index.html" class="btn btn-warning">
         Go back to home page
        </a>
        </div>`;
      }
  }
  
  updatePrice();
}

function updatePrice() {
  let allProducts = JSON.parse(localStorage.getItem("selectedItems")) || []; 
  let totalPrice = 0; 
  allProducts.forEach(product => {
      totalPrice += product.price
  });

  let getDivToShowTotalPrice = document.getElementById("sumCostOfAllProducts");
  if (getDivToShowTotalPrice) {
    getDivToShowTotalPrice.innerHTML = `<h2>Total price for all products: ${totalPrice.toFixed(2)}$</h2> <br> <hr>`;
  }
}

function updateProductDisplay(productId, allProducts, productPrice) {
  // Räkna antalet av denna produkt som fortfarande finns kvar
  const productCount = allProducts.filter(
    (product) => product.id === productId
  ).length;
  const totalProductPrice = productPrice * productCount;
  console.log(totalProductPrice);

  // Uppdatera antalet i DOM
  const countElement = document.getElementById(`count-${productId}`);
  if (countElement) {
    countElement.innerHTML = `<br>Quantity: ${productCount}<br> Total price: ${totalProductPrice.toFixed(2)}$`;
  }

  // Ta bort hela produktvisningen om antalet är noll
  if (productCount === 0) {
    const productWrapper = document.getElementById(
      `product-wrapper-${productId}`
    );

    if (productWrapper) {
      productWrapper.remove();
    }
  }
}

function emptyCart() {
  localStorage.removeItem("selectedItems");
  showAllProducts.innerHTML = `<div class = "text-center">
<a href="index.html" class="btn btn-warning">
   Go back to home page
</a>
</div>`;
}

//Tar bort dubletter. 
function removeDuplicates(items) {
  //Items är en array av objekt
  let jsonObject = items.map(JSON.stringify); //Gör om objekt array till strängarray
  let uniqueSet = new Set(jsonObject); //Tar bort dubletter
  let uniqueArray = Array.from(uniqueSet).map(JSON.parse); //Parsar tillbaka till objekt.
  return uniqueArray;
}

function countProductsMap(products) {
  // Skapa en Map för att lagra antalet av varje produkt
  const counts = new Map();

  // Loopa igenom alla produkter och räkna dem
  products.forEach((product) => {
    if (counts.has(product.id)) {
      counts.set(product.id, counts.get(product.id) + 1);
    } 
    else {
      counts.set(product.id, 1);
    }
  });
  return counts;
}
