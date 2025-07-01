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

  document.getElementById("brandFilter").addEventListener("change", (e) => {
    filters.brand = e.target.value;
    applyFilters();
  });

  document.getElementById("typeFilter").addEventListener("change", (e) => {
    filters.productType = e.target.value;
    applyFilters();
  });

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

  // Show spinner, hide content
  spinner.classList.remove('hidden');
  productDisplay.innerHTML = '';
  pagination.classList.add('hidden');



  fetch('https://makeup-api.herokuapp.com/api/v1/products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;

    filteredProducts = [...data];

    // Hide spinner, show products
    spinner.classList.add('hidden');
    pagination.classList.remove('hidden');

    displayProducts(data);
    console.log(allProducts);
    populateBrandOptions();

  })
  .catch(error => {
    spinner.classList.add('hidden');
    productDisplay.innerHTML = `<p class="text-red-500">Failed to load products.</p>`;
    console.error(error);
  });
}



function displayProducts() {
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const currentProducts = filteredProducts.slice(start, end);

  const productDisplay = document.querySelector('#productDisplay');
  productDisplay.innerHTML = '';

  currentProducts.forEach(product => {
    const price = Number(product.price).toFixed(2);

    const productCard = document.createElement('div');
    productCard.innerHTML = `
      <img src="${product.image_link}" class="w-full h-48 object-cover rounded mb-3" onerror="this.onerror=null; this.src='./images/placeholders/${product.product_type?.toLowerCase().replace(/\s/g, '_')}.svg'" >
      <h3 class="text-lg font-semibold">${product.name}</h3>
      <p class="text-sm text-gray-600">${product.brand}</p>
      <p class="text-burnt font-bold">${product.price === '0.0' ? 'Out of stock' : '$' + price}</p>
      <button class="mt-2 bg-burnt text-cream px-3 py-1 rounded add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    `
    productDisplay.appendChild(productCard)
  })

  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    const productToAdd = allProducts.find(p => p.id == id);
    addToCart(productToAdd);
  });
});
}



function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  // Prev Button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.className = `px-4 py-2 mx-1 rounded border border-[#CC5500] text-[#CC5500] hover:bg-[#CC5500] hover:text-white disabled:opacity-40`;
  prevBtn.addEventListener("click", () => {
    currentPage--;
    displayProducts();
    renderPagination();
  });
  pagination.appendChild(prevBtn);

  // Determine visible page range
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (currentPage <= 3) {
    endPage = Math.min(5, totalPages);
  } else if (currentPage >= totalPages - 2) {
    startPage = Math.max(1, totalPages - 4);
  }

  // First page + ellipsis
  if (startPage > 1) {
    appendPageBtn(1);
    appendEllipsis();
  }

  // Page buttons
  for (let i = startPage; i <= endPage; i++) {
    appendPageBtn(i);
  }

  // Last page + ellipsis
  if (endPage < totalPages) {
    appendEllipsis();
    appendPageBtn(totalPages);
  }

  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.className = `px-4 py-2 mx-1 rounded border border-[#CC5500] text-[#CC5500] hover:bg-[#CC5500] hover:text-white disabled:opacity-40`;
  nextBtn.addEventListener("click", () => {
    currentPage++;
    displayProducts();
    renderPagination();
  });
  pagination.appendChild(nextBtn);
 
}


// Helper functions
function appendPageBtn(i) {
  const pageBtn = document.createElement("button");
  pageBtn.textContent = i;
  pageBtn.className = `px-3 py-1 mx-1 rounded border ${
    i === currentPage ? "bg-[#CC5500] text-white" : "text-[#CC5500] border-[#CC5500]"
    } hover:bg-[#CC5500] hover:text-white transition
  `;

  pageBtn.addEventListener("click", () => {
    currentPage = i;
    displayProducts();
    renderPagination();
  });

  pagination.appendChild(pageBtn);
}



function appendEllipsis() {
  const dots = document.createElement("span");
  dots.textContent = "...";
  dots.className = "mx-2 text-gray-500";
  pagination.appendChild(dots);
}



function applyFilters() {
  let filtered = [...allProducts];

  // Filter by brand
  if (filters.brand) {
    filtered = filtered.filter(p => p.brand?.toLowerCase() === filters.brand.toLowerCase());
  }

  // Filter by product_type
  if (filters.productType) {
    filtered = filtered.filter(p => p.product_type?.toLowerCase() === filters.productType.toLowerCase());
  }

  // Sort by price
  if (filters.priceSort === "high") {
    filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else if (filters.priceSort === "low") {
    filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  }

  // Update pagination
  currentPage = 1;
  filteredProducts = filtered;
  displayProducts();
  renderPagination();
}


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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


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


function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function toggleCart() {
  const cartPanel = document.getElementById("cartPanel");
  cartPanel.classList.toggle("translate-x-full");
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

function renderCart() {
  const cartItemsContainer = document.getElementById('cartItems');

  cartItemsContainer.innerHTML = '';

  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'mb-4 border-b pb-2';
    itemDiv.innerHTML = `
      <p class="font-semibold">${item.name}</p>
      <p>$${item.price} × ${item.quantity}</p>
      <div class="flex gap-2 mt-1">
        <button onclick="changeQty(${item.id}, 1)" class="bg-green-500 text-white px-2 rounded">+</button>
        <button onclick="changeQty(${item.id}, -1)" class="bg-red-500 text-white px-2 rounded">-</button>
        <button onclick="removeFromCart(${item.id})" class="bg-gray-400 text-white px-2 rounded">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  updateCartCount();
  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const totalDiv = document.querySelector('#cartTotal');
  totalDiv.textContent = `${total.toFixed(2)}`;

}


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

function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  saveCart();
  renderCart();
  updateCartCount();
}

