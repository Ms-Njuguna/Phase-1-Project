
document.addEventListener('DOMContentLoaded', () => {
    displayProducts()
    console.log("Hi. If you\'re seeing this the js file is correctly linked to your project.")
})

function displayProducts() {
    //console.log("This is the main function")

    const displaySection = document.querySelector('#products-byBrand')
    const BASE_URL = "http://makeup-api.herokuapp.com/api/v1/products.json";

    fetch(`${BASE_URL}`)
    .then(res => res.json())
    .then(products => {
        products.forEach(product => {
            if(product.brand === 'fenty'|| 
                product.brand === 'maybelline'|| 
                product.brand === 'marcelle'|| 
                product.brand === 'e.l.f.'|| 
                product.brand === 'clinique'|| 
                product.brand === 'glossier'|| 
                product.brand === 'l\'oreal'
               ){
                const img = new Image();
                img.src = product.image_link;

                img.onload = () => {
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


                    const productCard = document.createElement('div');
                    productCard.className = 'product-card'
                    productCard.innerHTML = `
                        <img src= "${product.image_link}" alt= "${product.name}">
                        <div id="product-Details">
                            <p>${product.name}</p>
                            <p>${product.price_sign} ${product.price}</p>
                        </div>
                        <div id="color-Dropdown">${colorDropdown}</div>
                    `
                    displaySection.appendChild(productCard);
                }
                img.onerror = () => {
                    // Image failed to load — do nothing
                    console.warn(`Image failed to load for product: ${product.name}`);
                };
            }
        })
    })
}