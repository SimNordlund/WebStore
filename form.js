//Hämtar ALL produktinfo om samtliga produkter (array)
const takeAllProducts = JSON.parse(localStorage.getItem('selectedItems'));
console.log(takeAllProducts); 

//Lista av inga dubbletter
let takeNoDublicates = getDublicatesGone(takeAllProducts);
console.log(takeNoDublicates);

//Map med räkande produkter matchade med ID
let takeMapOfCountedIDs = getCountedProductsMap(takeAllProducts);
console.log(takeMapOfCountedIDs)

//Actionlistener på formuläret + funktionalitet. 
const getForm = document.getElementById('getForm');
getForm.addEventListener('submit', changePage); 

//Validering + Ändrar utseendet på sidan. Tar bort form and lägger till orderbekräftelse + returnknapp.
function changePage(e) {
  e.preventDefault(); // formulär skickas ej direkt, block görs innan

  //Kollar så att samtliga valideringsregler är uppfyllda. Returnerar true eller false. 
  let isNameOk = ValidateInput(document.getElementById('name').value);
  let isEmailOk = ValidateEmail();
  let isAdressOk = ValidateInput(document.getElementById('address').value);
  let isZipOk = ValidateZip();
  let isCityOk = ValidateInput(document.getElementById('city').value);
  let isPhoneOk = ValidateTelephone();

  //Om validering OK, submit genomförs och ändrar utseende. 
    if (isNameOk && isEmailOk && isZipOk && isAdressOk && isCityOk && isPhoneOk) {
    let totalCostOfProducts = 0;
    let newHtml = `<h1 class="display-4"> Thank you for ordering! </h1> <hr>
                   <h2> Your products: </h2> <br>`;

    for (let i = 0; i < takeNoDublicates.length; i++) {
      
      let productCount = takeMapOfCountedIDs.get(takeNoDublicates[i].id);
      totalCostOfProducts += (productCount * takeNoDublicates[i].price);

                  newHtml += `<h2>` +
                  takeNoDublicates[i].title + `<br>
                  Price: ` + takeNoDublicates[i].price.toFixed(2) + `$ each <br>
                  Quantity: ` + productCount + `
                  </h2>
                  <img src="${takeNoDublicates[i].image}" class="card-img-top img-fluid" alt="">
                  <hr> <br>`;
    }

    getForm.innerHTML = newHtml + `<h3> Total price: `+ totalCostOfProducts.toFixed(2) +`$ </h3> <br>
    <a id="goFrontPage" href="index.html" class="btn btn-warning">Go to homepage</a>`;
    getForm.style.textAlign = 'center';
    getForm.style.margin = '10px';
    document.getElementById('goFrontPage').addEventListener('click', clearStorage); //ActionL till goFrontPage-knapp. Rensar storage. 
  }
}

function getCountedProductsMap(allProducts) {
  const mapOfCounts = new Map();  //Lagra antalet av varje produkt

  //Räkna alla produkter och lagra förekomst i mappen. 
  allProducts.forEach((product) => {
    if (mapOfCounts.has(product.id)) {
      mapOfCounts.set(product.id, mapOfCounts.get(product.id) + 1); //Om ID finns, ökar med +1 
    }
    else {
      mapOfCounts.set(product.id, 1); //Om ej finns än läggs det in o börjar på 1
    }
  });
  return mapOfCounts;
}

function getDublicatesGone (allProducts) {
  let stringArrayOfObjects = allProducts.map(JSON.stringify) //gör om till temp strängarray
  let stringSetOfObjects = new Set(stringArrayOfObjects);
  let allProductsNoDublicates = Array.from(stringSetOfObjects).map(JSON.parse);
  return allProductsNoDublicates;
}

//Namn, gatuadress och ort kan anväda samma validering, har samma kravspecifikationer. Lär skicka in en variabel som input till metoden
function ValidateInput(input) {
 if (input.length >= 2 && input.length < 50) { 
    return true;
 }
 else { 
  alert("input måste vara mellan 2-50 bokstäver");
  return false;
 }
}

function ValidateEmail() {
  const input = document.getElementById('email').value;
  if (input.length < 50) {
    return true;
  } 
  else {
    alert("Felaktig email");
    return false;
  }
}

function ValidateTelephone() {
  const input = document.getElementById('phone').value;
  const regex = /^[0-9()-]*$/;
  if (regex.test(input)) {
    return true;
  } 
  else {
    alert("Felaktigt telefonnummer");
    return false;
  }
}

function ValidateZip(){
  const input = document.getElementById('zip').value;
  const regex = /^\d{5}$/;
  if (regex.test(input)) {
    return true;
  } 
  else {
    alert("Postnummer felaktigt");
    return false;
  }
}

//Funktion för att rensa lagrad info om produkten ifrån local storage. 
function clearStorage() {
  localStorage.clear();
}

