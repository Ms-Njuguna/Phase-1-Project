document.addEventListener('DOMContentLoaded', () => {
    displayBrands();
    createTotalRow();
    handleOrderSubmit();
})

function displayBrands () {
    const BASE_URL = "http://makeup-api.herokuapp.com/api/v1/products.json";
    const brandButtons = document.querySelector('#brand-buttons');
    const selectedBrands = ['fenty', 'maybelline', 'marcelle', 'e.l.f.', 'clinique', 'glossier', 'l\'oreal'];

    showLoadingMessage();

    fetch(`${BASE_URL}`)
    .then(res => res.json())
    .then(products => {
        const selectedProducts = products.filter(product => selectedBrands.includes(product.brand));
        const uniqueBrands = [...new Set(selectedProducts.map(product => product.brand))];

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


function displayProducts(products) {
    
    const displaySection = document.querySelector('#products-byBrand')
    displaySection.innerHTML = '';
    
    products.slice(0, 9).forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card'

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



        const imageAndDescription = `
            <div class="image-wrapper">
                <img src="${product.image_link}" alt="${product.name}" class= "product-image" loading="lazy"
                   onerror="this.onerror=null; this.src='https://i.pinimg.com/736x/61/8b/81/618b817cb28017dd9f174687f3987138.jpg';">
               <div class="image-description hidden">
                   <p>${product.description || 'No description available.'}</p>
               </div>
           </div>
        `;

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
            <button class="transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white" id="buyNow-Button" ${isOutOfStock ? 'disabled class="inactive"' : ''}>
                ${isOutOfStock ? 'Unavailable' : 'Buy Now'}
            </button>
        `
        displaySection.appendChild(productCard);

        const productDescription = productCard.querySelector('.image-description')
        const productImage = productCard.querySelector('.product-image')


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

        const buyNowButton = productCard.querySelector('#buyNow-Button');
        buyNowButton.addEventListener('click', () => {

            const shadeDropdown = productCard.querySelector(`#colorSelect-${product.id}`);
            const selectedShade = shadeDropdown ? shadeDropdown.options[shadeDropdown.selectedIndex].text : 'No shade';

            handleOrderSummary(product, selectedShade)
        })
    })

    const brandHeading = document.getElementById('brand-heading');
    if (brandHeading.classList.contains('hidden')) {
        brandHeading.classList.remove('hidden');
    }
}

function showLoadingMessage() {
    const displaySection = document.querySelector('#products-byBrand');
    displaySection.innerHTML = `
        <div class="spinner">
            <div class="spinner-circle"></div>
            <p>Please wait while we load the products for you...</p>
        </div>
    `;
}

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


function handleOrderSummary(product, shade) {

    const orderTable = document.querySelector('#ordered-itemsDisplay')

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

    const removeButton = orderDetailsRow.querySelector('.remove-btn');
    removeButton.addEventListener('click', handleDeleteOrder);

    const orderSummarySection = document.querySelector('#order-summaryDisplay');
    if (orderSummarySection.classList.contains('hidden')) {
        orderSummarySection.classList.remove('hidden');
    }
}


let allPrices = [];
function handleOrderTotal(price) {

    allPrices.push(Number(price));
    const total = allPrices.reduce((acc, curr) => acc + curr, 0).toFixed(2);

    const totalAmount = document.getElementById('total-amount');
    if (totalAmount) {
        totalAmount.textContent = `$ ${total}`;
    }
    return total;
}

function handleDeleteOrder(e) {
    e.preventDefault();

    const rowData = e.target.closest('tr')

    const priceText = rowData.querySelector('.price-wrapper span').textContent;
    const priceValue = Number(priceText.replace('$', '').trim());

    // Remove price from allPrices array (first matching one)
    const indexToRemove = allPrices.indexOf(priceValue);
    if (indexToRemove !== -1) {
        allPrices.splice(indexToRemove, 1);
    }

    rowData.remove()

    const newTotal = allPrices.reduce((acc, curr) => acc + curr, 0).toFixed(2);
    document.getElementById('total-amount').textContent = `$ ${newTotal}`;

    // Hide form if no items remain
    const orderRows = document.querySelectorAll('tr:not(#order-total-row):not(#table-headers)');
    if (orderRows.length === 0) {
        const orderSummarySection = document.querySelector('#order-summaryDisplay');
        orderSummarySection.classList.add('hidden');
        allPrices = []; // Reset price state
    }
}

function handleOrderSubmit() {

    const submitButton = document.querySelector('#checkout-Button');
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();

        const userName = document.querySelector('#userName').value;
        alert(`${userName}, you have successfully ordered your make-up products!`)

        const form = document.querySelector('#order-summaryForm'); 
        form.reset();

        const orderSummarySection = document.querySelector('#order-summaryDisplay');
        orderSummarySection.classList.add('hidden');

        const rows = document.querySelectorAll(
            '#ordered-itemsDisplay tr:not(#order-total-row):not(#table-headers)'
        );
        rows.forEach(row => row.remove());

        // ✅ Reset total and clear prices
        document.getElementById('total-amount').textContent = '$ 0.00';
        allPrices = [];
    }
    );
}