document.addEventListener('DOMContentLoaded', () => {
    displayBrands()
})

function displayBrands () {
    const BASE_URL = "http://makeup-api.herokuapp.com/api/v1/products.json";
    const brandButtons = document.querySelector('#brand-buttons');
    const selectedBrands = ['fenty', 'maybelline', 'marcelle', 'e.l.f.', 'clinique', 'glossier', 'l\'oreal'];

    showLoadingMessage();

    fetch(`${BASE_URL}`)
    .then(res => res.json())
    .then(products => {
        const selectedProducts = products.filter(product => selectedBrands.includes(product.brand)).slice(0, 150);;
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
        displayProducts(selectedProducts.filter(product => product.brand === uniqueBrands[0]));
    })
}


function displayProducts(products) {
    //console.log("This is the main function")
    
    const displaySection = document.querySelector('#products-byBrand')
    displaySection.innerHTML = '';
    
    products.slice(0, 9).forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card'

        const colorDropdown = product.product_colors.length > 0
        ? `
            <label for="colorSelect-${product.id}">Shades:</label>
            <select id="colorSelect-${product.id}">
                ${product.product_colors.map(color => `
                    <option value="${color.hex_value}">
                        ${color.colour_name || 'Unnamed color'}
                    </option>
                `).join('')}
            </select>
        `
        : '<p>No shades available</p>';

        productCard.innerHTML = `
            <img src= "${product.image_link}" alt= "${product.name}" loading="lazy" onerror="this.onerror=null; this.src='https://i.pinimg.com/736x/61/8b/81/618b817cb28017dd9f174687f3987138.jpg';">
            <div id="product-Details">
                <p>${product.name}</p>
                <p>${product.price_sign} ${product.price}</p>
            </div>
            <div id="color-Dropdown">${colorDropdown}</div>
            <button id= "buyNow-Button">Buy Now</button>
        `
        displaySection.appendChild(productCard);
        productCard.addEventListener('mouseover', showProductDescription)
    })
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

function showProductDescription() {
    console.log('The mouse is over a product card');
}