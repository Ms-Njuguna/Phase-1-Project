# Phase-1-Project

# The Beauty Edit

A sleek, single-page web application built with **HTML, CSS (Tailwind + custom)**, and **vanilla JavaScript**, powered by the [Makeup API](https://makeup-api.herokuapp.com/). This project allows users to browse curated beauty products by brand, explore product details, and submit an order with total price tracking — all in an intuitive and polished UI experience.

---

## Features

- **Dynamic product display** filtered by selected beauty brands.
- **Product cards** with hover-triggered descriptions and shade previews.
- **Order summary section** that:
  - Lists selected products.
  - Calculates and updates total price.
  - Allows item removal.
  - Submits order with validation + form reset.
- **Responsive design** with polished styling and subtle transitions.
- **Asynchronous API fetching** using `fetch()` and JSON handling.
- **No page reloads** — fully single-page interface (SPA behavior).
- **Form validation** and input reset upon submission.
- **CORS-safe HTTPS integration** for deployment compatibility.

---

## Landing Page

> “Explore the Best of Beauty” — your go-to for curated makeup collections.

Users are welcomed with a clean, professional landing page featuring a brand logo and fashion-forward model imagery. From there, they can dive directly into the product experience.

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
│   └── logo, header and footer assets
├── README.md
└── LICENSE

```

## How it all works

- App loads and fetches products from the Makeup API.

- Buttons are generated dynamically for selected brands.

- When a brand is clicked:

    -Up to 9 products are displayed in cards.

    -Cards include images, shades, price, and description hover effects.

    -Clicking Buy Now:

        -Adds the product to the order summary.

        -Calculates and updates the total cost.

        -Users can remove items or checkout via a form.

-On submit:

    -Name & email are validated (with type="email" and required inputs).

    -Order list is cleared and total resets.



---

## Author

- **Name:** Patricia Njuguna
- **GitHub:** [@Ms-Njuguna](https://github.com/Ms-Njuguna)


## License

This project is licensed under the [MIT-License](LICENSE).