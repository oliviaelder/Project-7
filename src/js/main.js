
  
  function showHTMLMessage(message) {
    document.getElementById('app').innerHTML = message;
  }
  function showTextMessage(message) {

    document.getElementById('app').innerText = message;

  }

  function populateSelectList() {

     //let partSelectList = document.getElementById("type");
      let flowerSelectList = $("#category");
      let typeSet = []
 
     for (const flower of flowerArray){
         var e1 = $("<option>"); 
       
         if (flower.status == 'Active'){
             
            if (flower.qoh > 0){
               if (!typeSet.includes(flower.category)) { // Only add if the category isn't already in the Set
                   typeSet.push(flower.category); // Add the category to the Set
                    e1.text(flower.category); 
                    e1.val(flower.category);
                    flowerSelectList.append(e1);                  
               }
            }              
         }
     }
     flowerSelectList.on("change",function(e){
      console.log("on change function");
      selectedCategory = $(e.target).val()
      console.log("selected category:" + selectedCategory);
      
      displaySelectedBouquets(selectedCategory);
    })
   }

   
function displaySelectedBouquets(selectedCategory) {

  let bouquetSelectList = $("#bouquetList");
  let typeSet = [];
  bouquetSelectList.empty(); // Clear previous results
  var e1 = $("<option>");

  let filteredBouquets = flowerArray.filter(flower => flower.category=== selectedCategory && flower.status === 'Active' && flower.qoh > 0);
  bouquetSelectList.attr('size', Math.max(filteredBouquets.length,2))
  //console.log(filteredParts);

  // Display the filtered bouquets
  filteredBouquets.forEach(flower => {
    var e1 = $("<option>");
  
    if (!typeSet.includes(flower.bouquetname)) {    // Only add if the bouquet isn't already in the Set
      typeSet.push(flower.bouquetname); // Add the bouquet to the Set 
       e1.text(flower.bouquetname);
       e1.val(flower.bouquetname);     
       bouquetSelectList.append(e1);
    }
  });
  
  bouquetSelectList.on("change", function(e){
    selectedBouquet = $(e.target).val();
     // console.log("here!");
    displayBouquetDetails(selectedBouquet);
   })
}

   let shoppingCart = [];

   function displayBouquetDetails(selectedBouquet) {
    
     let detailsDiv = $("#bouquetDetails");
     detailsDiv.empty(); // Clear previous results
   
     let selectedBouquetItem = flowerArray.find(flower => flower.bouquetname === selectedBouquet);

     if (selectedBouquetItem) {
       //if selectedPartItem is found, then display details
       let descriptionElement =  $("<description></description>");  //create new description element
  
      // descriptionElement.innerHTML = "<strong>Description:</strong> <span>" + selectedBouquet.description + "</span> <br>";
      

       detailsDiv.append(`<p><b>Quantity on Hand: </b> ${selectedBouquetItem.qoh}</p>`);
       //detailsDiv.append(`<p><b>Price: </b> $${selectedBouquetItem.price}</p>`);
         
      // Populate the size dropdown list
      let bouquetSizeList = $("#bouquetSizeList");
      bouquetSizeList.empty(); // Clear previous sizes
      bouquetSizeList.append(`<option value="">Select size and price</option>`); // Default option

      // Get unique sizes for the selected bouquet
      const availableSizes = flowerArray
      .filter(flower => flower.bouquetname === selectedBouquet) // Filter by selected bouquet
      .map(flower => ({ size: flower.size, price: flower.price })); // Map to an array of objects with size and price

        // Create a Set to keep track of sizes added
        const uniqueSizes = new Set();
     
        availableSizes.forEach(({ size, price }) => {
          if (!uniqueSizes.has(size)) {
              uniqueSizes.add(size); // Add size to the Set
              bouquetSizeList.append(`<option value="${size}" data-price="${price}">${size} - $${price}</option>`); // Append size and price
          }
      });


       //"Add to Cart button"
       let cartButton = $("#addToCartButton");
       cartButton.off("click");  // Remove any previous click handlers
       cartButton.on("click", () => {
       addToCart(selectedBouquetItem);
       });
   
     } else {
       detailsDiv.textContent = "No details available for this item.";
     }
   }

   // Function to add selected part and quantity to the shopping cart
function addToCart(selectedBouquetItem) {
  
  let quantity = $("#quantity").val();
  let selectedSize = $("#bouquetSizeList").val(); // Get the selected size from the dropdown

  // Find the price for the selected size
  let sizePrice = selectedBouquetItem.price; // Default price from the bouquet item
  
  //Find the price for the selected size
  if (selectedSize) {
      // Optionally adjust price based on selected size, if needed
      // For example, if prices vary by size:
      const sizeInfo = flowerArray.find(flower => flower.bouquetname === selectedBouquetItem.bouquetname && flower.size === selectedSize);
      if (sizeInfo) {
          sizePrice = sizeInfo.price; // Update sizePrice to the correct price based on selected size
      }
}

  // Add part to the shopping cart array
  shoppingCart.push({
    bouquetname: selectedBouquetItem.bouquetname,
    //description: part.description,
    price: sizePrice,
    quantity,            //as entered by user, NOT qoh
    total: (sizePrice * quantity).toFixed(2)
    });

  // Update cart display
  updateCartDisplay();
}

// Function to display the shopping cart
function updateCartDisplay() {
  let cartList = document.getElementById("shoppingCart");
  let totalElement = document.getElementById("cartTotal");
  cartList.innerHTML = ''; // Clear previous cart items

  let total = 0;

  shoppingCart.forEach(item => {
    let cartItem = document.createElement("li");
    //cartItem.innerHTML = `${item.part} - Quantity: ${item.quantity} - Total: $${item.total}`;
    cartItem.innerHTML = "<Strong> Item: </strong> " + item.bouquetname +  
                         "<Strong> Quantity: </strong> " + item.quantity + 
                         "<Strong> Total: </strong> " + "$"+ item.total 
    cartList.appendChild(cartItem);

    total += parseFloat(item.total); // Add item's total price to the overall total
   });

   // Update total display
  totalElement.innerHTML = `<strong>Total: </strong>$${total.toFixed(2)}`;

}

// Function to clear the shopping cart
function clearCart() {
  shoppingCart = []; // Empty the shopping cart array
  updateCartDisplay(); // Update the cart display to show it's empty
  }

  function pageLoad() {
    
    populateSelectList();
    // //add click event handler to button
    // let button = document.querySelector("button");
 
    // button.addEventListener("click", () => {
    //   console.log("Added to Cart");
    // });  

    // Event listener for the "Clear Cart" button
    document.getElementById("clearCartButton").addEventListener("click", function() {
    clearCart(); // Clear the cart when the button is clicked
   });
  }
  window.onload = pageLoad;
