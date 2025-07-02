# Phase-1-Project

# Verdara

A sleek, single-page web application built with **HTML, CSS (Tailwind + custom)**, and **vanilla JavaScript**, powered by the [Makeup API](https://makeup-api.herokuapp.com/). This project allows users to browse beauty products by brand , price or product type, add item to cart, and checkout an order with total price tracking.

---

## Features

- **Dynamic product display** filtered by beauty brands, price and product type.
- **Product cards** with product details and add to cart buttons.
- **Cart** that:
  - Lists selected products.
  - Calculates and updates total price.
  - Allows item removal and increase of quantity.
  - Submits order with prompt + cart reset.
- **Responsive design** with polished styling and subtle transitions.
- **Asynchronous API fetching** using `fetch()` and JSON handling.
- **No page reloads** — fully single-page interface (SPA behavior).
- **Form validation** and input reset upon submission.
- **CORS-safe HTTPS integration** for deployment compatibility.

---

## Landing Page

Users are welcomed with a clean, professional landing page featuring a brand logo and product imagery. From there, they can dive directly into the product experience.

---

## Technologies Used

- **HTML5**
- **CSS** (with custom styles + Tailwind)
- **JavaScript**
- **Public API**: [Makeup API](https://makeup-api.herokuapp.com/)
- **Deployment**: [GitHub Pages](https://ms-njuguna.github.io/Phase-1-Project/)

---

## Project Structure

```bash
Phase-1-Project/
├── index.html
├── src/
│   └── index.js
├── css/
│   └── styles.css
├── images/
│   └── logo, header and footer assets - placeholders
├── README.md
└── LICENSE

```

## How it all works

- App loads and fetches products from the Makeup API.

- Buttons are generated dynamically for filtering brands based on brand type, price and product type.

- When a brand is clicked:

    -All the specific brand products are displayed in cards.

    -Cards include images, price, brand and add to cart button.

    -Clicking add to cart:

        -Adds the product to the cart.

        -Calculates and updates the total cost of all products.

        -Users can remove items, increase product quantity or checkout from the cart.

-On checkout:

    -Cart is cleared and total resets.



---

## Author

- **Name:** Patricia Njuguna
- **GitHub:** [@Ms-Njuguna](https://github.com/Ms-Njuguna)


## License

This project is licensed under the [MIT-License](LICENSE).