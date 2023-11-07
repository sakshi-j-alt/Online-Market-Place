// Get the vendor ID from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const vendorId = urlParams.get('id');

// Make a GET request to the backend endpoint to fetch the vendor information by ID
fetch(`/vendor/${vendorId}`)
  .then(response => response.json())
  .then(vendor => {
    
    
  // Update the HTML elements on the vendor information page with the fetched data
    document.getElementById('vendorName').textContent = vendor.name;
  document.getElementById('vendorInfo').textContent = vendor.information;

    vendor.items.forEach(item => {
      let itemCard = document.createElement('div');
      
      itemCard.classList.add("col-lg-4", "col-md-6", "col-sm-6");

      itemCard.innerHTML = `<div class="col1 card">
    <div class="prodimg">
      <img class="card-img-top" src="${item.image_url}" alt="Card image cap">
    </div>
    <div class="card-body">
      <h5 class="card-title">&#x20B9;${item.price}</h5>
      <p class="card-text">${item.description}</p>
      <a href="#" class="btn btn-primary">Add to cart</a>
    </div>
  </div>`;

      
      // let itemName = document.createElement('h2');
      // itemName.textContent = item.name;
      
      // let itemPrice = document.createElement('p');
      // itemPrice.textContent = `$${item.price}`;
      
      // let itemImage = document.createElement('img');
      // itemImage.src = item.image_url;
      // itemImage.alt = item.name;
      
      // let itemDescription = document.createElement('p');
      // itemDescription.textContent = item.description;
      
      // itemCard.appendChild(itemName);
      // itemCard.appendChild(itemPrice);
      // itemCard.appendChild(itemImage);
      // itemCard.appendChild(itemDescription);

      

      
      
      
      let itemsContainer = document.getElementById('row');
      itemsContainer.appendChild(itemCard);
    });
      

    
   
  
  })
  .catch(err => console.error(err));


