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
      <a href="#" class="btn btn-primary">Edit Item</a>
    </div>
  </div>`;

      

      
      
      
      let itemsContainer = document.getElementById('row');
      itemsContainer.appendChild(itemCard);
    });
  });
      

    
   
  
  // Show the "Add Item" form when the button is clicked
const showAddItemFormButton = document.getElementById('showAddItemFormButton');
showAddItemFormButton.addEventListener('click', () => {
  document.getElementById('addItemForm').style.display = 'block';
  document.getElementById('showAddItemFormButton').style.display = 'none';
  
  
  
});

// Function to handle the form submission

  const addItemForm = document.getElementById('addItemForm');
const nameInput = addItemForm.querySelector('#name');
const priceInput = addItemForm.querySelector('#price');
const imageUrlInput = addItemForm.querySelector('#image_url');
const descriptionInput = addItemForm.querySelector('#description');

addItemForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // Access the form inputs and their values
  const name = nameInput.value;
  const price = priceInput.value;
  const imageUrl = imageUrlInput.value;
  const description = descriptionInput.value;
  console.log(name,price,imageUrl,description);

  // Send the form data to the backend or perform any other actions
  // Example: make an AJAX request to the backend endpoint
  fetch('/add-item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
      body: JSON.stringify({
      name: name,
      price: price,
      image_url: imageUrl,
      description: description,
      vendorId: vendorId, // Assuming vendorId is already defined or obtained
    }),
  })
    .then(response => response.json())
    .then(data => {
       if (data.success) {
        // Item added successfully, reload the page
        window.location.reload();
      } else {
        // Handle any errors or display a message
        console.error(data.error);
      }
    })
    .catch(error => {
      // Handle any errors that occurred during the request
      console.error(error);
    });
});


