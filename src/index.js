//creating variables to be used in varoius functions
let allProducts = [];
let currentPage = 1;
const productsPerPage = 12;
let filteredProducts = [];
let filters = {
  brand: "",
  productType: "",
  priceSort: ""
};
let cart = JSON.parse(localStorage.getItem('cart')) || [];



//to make sure the DOM loads before any function runs
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  renderCart();
  renderPagination();
  handleTotal();
  handleCheckout();

  //event listener for the filter by brand
  document.getElementById("brandFilter").addEventListener("change", (e) => {
    filters.brand = e.target.value;
    applyFilters();
  });

  //event listener for the filter by product type
  document.getElementById("typeFilter").addEventListener("change", (e) => {
    filters.productType = e.target.value;
    applyFilters();
  });

  //event listener for the filter by price
  document.getElementById("priceSort").addEventListener("change", (e) => {
    filters.priceSort = e.target.value;
    applyFilters();
  });
})



//fetching products from my API
function fetchProducts() {
  const spinner = document.getElementById('spinner');
  const productDisplay = document.getElementById('productDisplay');
  const pagination = document.getElementById('pagination');

  // Shows the spinner, and hides the pagination buttons until the product cards are fully loaded
  spinner.classList.remove('hidden');
  productDisplay.innerHTML = '';
  pagination.classList.add('hidden');



  fetch('https://makeup-api.herokuapp.com/api/v1/products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;

    filteredProducts = [...data];

    // Hides the spinner, shows the pagination buttons
    spinner.classList.add('hidden');
    pagination.classList.remove('hidden');

    displayProducts(data);
    console.log(allProducts);
    populateBrandOptions();

  })
  .catch(error => {
    //incase the fetch fails, a message is displayed
    spinner.classList.add('hidden');
    productDisplay.innerHTML = `<p class="text-red-500 text-center">Failed to load products.</p>`;
    console.error(error);
  });
}


//displays the products fetched from the API
function displayProducts() {
  //to display a certain number of products per page for pagination logic
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const currentProducts = filteredProducts.slice(start, end);

  const productDisplay = document.querySelector('#productDisplay');
  productDisplay.innerHTML = '';

  //product card content from fetched data
  currentProducts.forEach(product => {
    const price = Number(product.price).toFixed(2);
    const isOutOfStock = price === '0.00';

    const productCard = document.createElement('div');
    productCard.innerHTML = `
      <img src="${product.image_link}" class="w-full h-48 object-cover rounded mb-3" onerror="this.onerror=null; this.src='./images/placeholders/${product.product_type?.toLowerCase().replace(/\s/g, '_')}.svg'" >
      <h3 class="text-lg font-semibold">${product.name}</h3>
      <p class="text-sm text-black">${product.brand}</p>
      <p class="text-[#FDFBF9] font-bold">${isOutOfStock ? 'Out of stock' : '$' + price}</p>
      <button class="mt-2 bg-[#CC5500] ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#CC5500] hover:bg-[#b44900]'} text-[#FDFBF9] px-3 py-1 rounded add-to-cart-btn" data-id="${product.id}">${isOutOfStock ? 'Unavailable' : 'Add to Cart'}</button>
    `
    productDisplay.appendChild(productCard)
  })

  //add to cart button event listener
  document.querySelectorAll('.add-to-cart-btn:not([disabled])').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const productToAdd = allProducts.find(product => product.id == id);
      addToCart(productToAdd);
    });
  });
}

//makes sure that the products are sectioned into pages so as to not overwhelm the user
function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  // Previous page Button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.className = `px-4 py-2 mx-1 rounded border border-[#CC5500] text-[#CC5500] bg-[#FDFBF9] hover:bg-[#CC5500] hover:text-white disabled:opacity-40 shadow-sm`;
  prevBtn.addEventListener("click", () => {
    currentPage--;
    displayProducts();
    renderPagination();
  });
  pagination.appendChild(prevBtn);

  // Determines the visible page range
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) {
    endPage = Math.min(5, totalPages);
  } else if (currentPage >= totalPages - 2) {
    startPage = Math.max(1, totalPages - 4);
  }

  // shows the First page + ellipsis
  if (startPage > 1) {
    appendPageBtn(1);
    appendEllipsis();
  }

  // Page buttons
  for (let i = startPage; i <= endPage; i++) {
    appendPageBtn(i);
  }

  // shows the Last page + ellipsis
  if (endPage < totalPages) {
    appendEllipsis();
    appendPageBtn(totalPages);
  }

  // the Next page Button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.className = `px-4 py-2 mx-1 rounded border border-[#CC5500] text-[#CC5500] bg-[#FDFBF9] hover:bg-[#CC5500] hover:text-white disabled:opacity-40 shadow-sm`;
  nextBtn.addEventListener("click", () => {
    currentPage++;
    displayProducts();
    renderPagination();
  });
  pagination.appendChild(nextBtn);
 
}


//a helper function to append the current page button and display the products for the particular page button
function appendPageBtn(i) {
  const pageBtn = document.createElement("button");
  pageBtn.textContent = i;
  pageBtn.className = `px-3 py-1 mx-1 rounded border ${
    i === currentPage ? "bg-[#CC5500] text-white shadow-md" : "text-[#FDFBF9] border-[#CC5500] shadow-md"
    } hover:bg-[#CC5500] hover:text-white transition
  `;

  pageBtn.addEventListener("click", () => {
    currentPage = i;
    displayProducts();
    renderPagination();
  });

  pagination.appendChild(pageBtn);
}

//shows an ellipsis for other page buttons so that not all are displayed at once on the page
function appendEllipsis() {
  const dots = document.createElement("span");
  dots.textContent = "...";
  dots.className = "mx-2 text-gray-500";
  pagination.appendChild(dots);
}

//handles the filtering logic of the products based on brand, product type and price
function applyFilters() {
  let filtered = [...allProducts];

  // Filters products by brand
  if (filters.brand) {
    filtered = filtered.filter(p => p.brand?.toLowerCase() === filters.brand.toLowerCase());
  }

  // Filters products by product_type
  if (filters.productType) {
    filtered = filtered.filter(p => p.product_type?.toLowerCase() === filters.productType.toLowerCase());
  }

  // Sorts products by price
  if (filters.priceSort === "high") {
    filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else if (filters.priceSort === "low") {
    filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  }

  // Updates the pagination buttons based on how many products are displayed after filters are applied
  currentPage = 1;
  filteredProducts = filtered;
  displayProducts();
  renderPagination();
}

//creates a set of all products ,filters them based on each brand and displays the brands as options in the filter by brand section
function populateBrandOptions() {
  const brandSet = new Set(allProducts.map(p => p.brand).filter(Boolean));
  const brandSelect = document.getElementById("brandFilter");

  brandSet.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = capitalize(brand);
    brandSelect.appendChild(option);
  });
}

//capitalizes the first letter of each brand in the options to filter section
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//this handles when the user adds a product to the cart by clicking the add to cart button and staes initial quantity as one 
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart(); // optional if you want live updates
  updateCartCount();
}

//this makes sure that the data in the cart is saved in local storage 
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

//this makes sure that the cart stays hidden on page load until the user clicks on the cart icon
function toggleCart() {
  const cartPanel = document.getElementById("cartPanel");
  cartPanel.classList.toggle("translate-x-full");
}

//this updates the counter that shows above the cart icon and makes sure it tracks whether an item was added or removed 
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

//handles what is displayed in the cart and updates based on various changes
function renderCart() {
  const cartItemsContainer = document.getElementById('cartItems');

  cartItemsContainer.innerHTML = '';

  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'mb-4 border-b pb-2';
    const itemPrice = Number(item.price).toFixed(2);
    itemDiv.innerHTML = `
      <p class="font-semibold">${item.brand} - ${item.name}</p>
      <p>$${itemPrice} × ${item.quantity}</p>
      <div class="flex gap-2 mt-1">
        <button onclick="changeQty(${item.id}, 1)" class="bg-green-500 text-white px-2 rounded">+</button>
        <button onclick="changeQty(${item.id}, -1)" class="bg-red-500 text-white px-2 rounded">-</button>
        <button onclick="removeFromCart(${item.id})" class="bg-gray-400 text-white px-2 rounded">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  updateCartCount();
  handleTotal();

}

//calculates the total price of all products in the cart and makes sure it displays with 2 decimal places
function handleTotal() {
  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const totalDiv = document.querySelector('#cartTotal');
  totalDiv.textContent = `${total.toFixed(2)}`;
}

//enables the user to add or reduce the quantity of a particular product in the cart
function changeQty(id, amount) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  saveCart();
  renderCart();
  updateCartCount();
}

//when a user clicks the remove button next to a product, that specific product is removed from the cart and updates the info in the cart
function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  saveCart();
  renderCart();
  updateCartCount();
}

//handles the checkout of products
function handleCheckout() {
  const checkoutButton = document.getElementById('checkoutBtn');
  checkoutButton.addEventListener('click', () => {
    // Clears the cart array
    cart = [];

    // Removes the data stored from local storage
    localStorage.removeItem('cart');

    // Updates the cart UI
    renderCart();
    updateCartCount();
    handleTotal();

    //shows a confirmation message after checkout
    alert("Thank you for your purchase!");
  })
}