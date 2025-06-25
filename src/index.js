//A web app that allows a user to see products by brand and order them a per shade preference
//make sure that all DOM content is loaded before any function is run
document.addEventListener('DOMContentLoaded', () => {
    displayBrands();
    createTotalRow();
    handleOrderSubmit();
})

//displays make-up brands
function displayBrands () {
    const BASE_URL = "https://makeup-api.herokuapp.com/api/v1/products.json";
    const brandButtons = document.querySelector('#brand-buttons');
    const selectedBrands = ['fenty', 'maybelline', 'marcelle', 'e.l.f.', 'clinique', 'glossier', 'l\'oreal'];

    //shows loading message as products are fetched
    showLoadingMessage();

    //fetches products from public API
    fetch(`${BASE_URL}`)
    .then(res => res.json())
    .then(products => {
        //filters through all products and return new set with specific chosen brands
        const selectedProducts = products.filter(product => selectedBrands.includes(product.brand));
        const uniqueBrands = [...new Set(selectedProducts.map(product => product.brand))];

        //lists product brands 
        uniqueBrands.forEach(brand => {
            const brandButton = document.createElement('button');
            brandButton.innerHTML = brand.toUpperCase();
            brandButton.className = 'brand-Button'

            brandButton.addEventListener('click', () => {
                displayProducts(selectedProducts.filter(product => product.brand === brand))
            })
            brandButtons.appendChild(brandButton);
        })

        //to make sure the first brand on the brand list always displays it's products when the page is refreshed
        displayProducts(selectedProducts.filter(product => product.brand === uniqueBrands[0]));
    })
}

//displays products/product cards for selected brands
function displayProducts(products) {
    
    const displaySection = document.querySelector('#products-byBrand')
    displaySection.innerHTML = '';
    
    //shows maximum of 9 products per brand
    products.slice(0, 9).forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card'


        //checks if colour/shade is unnamed or null and render product out of stock
        let colorDropdownHTML = '';
        let isOutOfStock = false;
        let price = '0.00';

        const validColors = product.product_colors.filter(
            color => color.colour_name && color.colour_name.toLowerCase() !== 'unnamed'
        );

        if (validColors.length > 0) {
            price = Number(product.price).toFixed(2);
            colorDropdownHTML = `
                <label for="colorSelect-${product.id}">Shades:</label>
                <select id="colorSelect-${product.id}">
                    ${validColors.map(color => `
                       <option value="${color.hex_value}">
                           ${color.colour_name}
                        </option>
                    `).join('')}
                </select>
            `;
        } else {
            colorDropdownHTML = '<p>No shades available</p>';
            isOutOfStock = true;
        }

        //separates image and description for hover effect
        const imageAndDescription = `
            <div class="image-wrapper">
                <img src="${product.image_link}" alt="${product.name}" class= "product-image" loading="lazy"
                   onerror="this.onerror=null; this.src='https://i.pinimg.com/736x/61/8b/81/618b817cb28017dd9f174687f3987138.jpg';">
               <div class="image-description hidden">
                   <p>${product.description || 'No description available.'}</p>
               </div>
           </div>
        `;

        //product card details
        productCard.innerHTML = `
            ${imageAndDescription}
            <div id="product-Details">
                <p>${product.name}</p>
                <p class="product-price">${isOutOfStock ? 'Out of stock' : `$ ${price}`}</p>
            </div>
            <div class="shade-container">
                ${validColors.map(color => `
                   <span class="shade" 
                   style="background-color:${color.hex_value}" 
                   title="${color.colour_name}">
                   </span>
                `).join('')}
                ${colorDropdownHTML}
            </div>
            <button class="transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white transition disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400" id="buyNow-Button" ${isOutOfStock ? 'disabled' : ''}>
                ${isOutOfStock ? 'Unavailable' : 'Buy Now'}
            </button>
        `
        displaySection.appendChild(productCard);

        const productDescription = productCard.querySelector('.image-description')
        const productImage = productCard.querySelector('.product-image')


        //hover effect over image to show product description
        //uses this instead of hovering over entire card so as to access other features i.e., dropdown and order button
        productCard.querySelector('.image-wrapper').addEventListener('mouseenter', () => {
            productImage.style.opacity = '0';
            productDescription.classList.remove('hidden');
            productDescription.classList.add('show');
        })

        productCard.querySelector('.image-wrapper').addEventListener('mouseleave',  () => {
            productImage.style.opacity = '1';
            productDescription.classList.remove('show');
            productDescription.classList.add('hidden');
        })

        //order button to add order to order list/summary later
        const buyNowButton = productCard.querySelector('#buyNow-Button');
        buyNowButton.addEventListener('click', () => {

            const shadeDropdown = productCard.querySelector(`#colorSelect-${product.id}`);
            const selectedShade = shadeDropdown ? shadeDropdown.options[shadeDropdown.selectedIndex].text : 'No shade';

            handleOrderSummary(product, selectedShade)
        })
    })

    //to prevent heading from showing before products fully load
    const brandHeading = document.getElementById('brand-heading');
    if (brandHeading.classList.contains('hidden')) {
        brandHeading.classList.remove('hidden');
    }
}

//shows a loading message with spinning loading circle to retain the user's attention
function showLoadingMessage() {
    const displaySection = document.querySelector('#products-byBrand');
    displaySection.innerHTML = `
        <div class="spinner">
            <div class="spinner-circle"></div>
            <p>Please wait while we load the products for you...</p>
        </div>
    `;
}

//creates tottal row that goes at the end of products ordered table in order summary section
function createTotalRow() {
    const orderTable = document.querySelector('#ordered-itemsDisplay');
    const orderTotal = document.createElement('tr');
    orderTotal.id = 'order-total-row'; // Assign ID for easy targeting

    orderTotal.innerHTML = `
        <td>
            <span>Total</span>
            <p>(inclusive of all taxes and fees)</p>
        </td>
        <td id="total-amount">$ 0.00</td>
    `;

    orderTable.appendChild(orderTotal);
}

//handles order summary content
function handleOrderSummary(product, shade) {

    const orderTable = document.querySelector('#ordered-itemsDisplay')

    //makes sure price is always a number with two decimal places
    const productPrice = Number(product.price);
    const price = productPrice.toFixed(2);

    const orderDetailsRow = document.createElement('tr')
    orderDetailsRow.innerHTML = `
        <td>${product.brand}'s ${product.name} in : ${shade}</td>
        <td>
            <div class="price-wrapper">
                <span>$ ${price}</span>
                <button type = "button" class="remove-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="black"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </button>
            </div>
        </td>
    `

    orderTable.insertBefore(orderDetailsRow, document.getElementById('order-total-row'));
    handleOrderTotal(price);

    //event listener for removing order from summary of orders
    const removeButton = orderDetailsRow.querySelector('.remove-btn');
    removeButton.addEventListener('click', handleDeleteOrder);

    const orderSummarySection = document.querySelector('#order-summaryDisplay');
    if (orderSummarySection.classList.contains('hidden')) {
        orderSummarySection.classList.remove('hidden');
    }
}

//handles total price of products ordered
let allPrices = [];
function handleOrderTotal(price) {

    //calculates total of all prices of all products ordered
    allPrices.push(Number(price));
    const total = allPrices.reduce((acc, curr) => acc + curr, 0).toFixed(2);

    const totalAmount = document.getElementById('total-amount');
    if (totalAmount) {
        totalAmount.textContent = `$ ${total}`;
    }
    return total;
}

//handles deletion of order from order summary
function handleDeleteOrder(e) {
    e.preventDefault();

    const rowData = e.target.closest('tr')

    const priceText = rowData.querySelector('.price-wrapper span').textContent;
    const priceValue = Number(priceText.replace('$', '').trim());

    // Removes price from allPrices array (first matching one)
    const indexToRemove = allPrices.indexOf(priceValue);
    if (indexToRemove !== -1) {
        allPrices.splice(indexToRemove, 1);
    }

    rowData.remove()

    //recalculates order total once product ordered is deleted
    const newTotal = allPrices.reduce((acc, curr) => acc + curr, 0).toFixed(2);
    document.getElementById('total-amount').textContent = `$ ${newTotal}`;

    // Hides order summary form if all products are deleted
    const orderRows = document.querySelectorAll('tr:not(#order-total-row):not(#table-headers)');
    if (orderRows.length === 0) {
        const orderSummarySection = document.querySelector('#order-summaryDisplay');
        orderSummarySection.classList.add('hidden');
        allPrices = []; // Reset price state
    }
}

//handles submission of order
function handleOrderSubmit() {

    const submitButton = document.querySelector('#checkout-Button');
    submitButton.addEventListener('click', (e) => {
        //to prevent default form behaviour
        e.preventDefault();

        //to access user name value entered
        const userName = document.querySelector('#userName').value;
        alert(`${userName}, you have successfully ordered your make-up products!`)

        //resets the order summary form when order is submitted
        const form = document.querySelector('#order-summaryForm'); 
        form.reset();

        //hides the order summary form
        const orderSummarySection = document.querySelector('#order-summaryDisplay');
        orderSummarySection.classList.add('hidden');

        const rows = document.querySelectorAll(
            '#ordered-itemsDisplay tr:not(#order-total-row):not(#table-headers)'
        );
        rows.forEach(row => row.remove());

        //Resets total and clear prices
        document.getElementById('total-amount').textContent = '$ 0.00';
        allPrices = [];
    }
    );
}