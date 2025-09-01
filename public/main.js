async function fetchProducts() {
  try {
    const response = await fetch('/products');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();
    const productContainer = document.getElementById('product-container');
    const productTemplate = document.getElementById('product-template');

    products.forEach(product => {
      const productDiv = productTemplate.cloneNode(true);
      productDiv.removeAttribute('id');

      titleDiv = productDiv.querySelector('.product-title');
      titleDiv.textContent = product.item;

      imageDiv = productDiv.querySelector('.product-image');
      imageDiv.src = product.image_url;
      imageDiv.alt = product.item;

      descriptionDiv = productDiv.querySelector('.product-description');
      descriptionDiv.textContent = product.description;

      priceDiv = productDiv.querySelector('.product-price');
      priceDiv.textContent = product.price;

      buttonDiv = productDiv.querySelector('.paypal-button');
      buttonDiv.id = `paypal-button-container-${product.id}`;

      productContainer.appendChild(productDiv);
    });

    productContainer.removeChild(productTemplate);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

fetchProducts();
