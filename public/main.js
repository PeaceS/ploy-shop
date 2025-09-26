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
      imageDiv.src = `${product.image_directory}/a.jpg`;
      imageDiv.alt = product.item;
      imageDiv.id = product.id

      descriptionDiv = productDiv.querySelector('.product-description');
      descriptionDiv.textContent = product.description;

      priceDiv = productDiv.querySelector('.product-price');
      priceDiv.textContent = product.price;

      let currentImageIndex = 0;
      const images = [
        `${product.image_directory}/a.jpg`,
        `${product.image_directory}/b.jpg`
      ];

      const updateImage = (id) => {
        imageDiv = document.getElementById(id);
        imageDiv.classList.remove('show');

        // Wait for the fade-out to complete before changing the image source
        setTimeout(() => {
            imageDiv.src = images[currentImageIndex];
            // Fade in the new image
            imageDiv.classList.add('show');
        }, 500); // This delay should match the CSS transition duration
      };

      prevBtn = productDiv.querySelector('.previous-btn');
      prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateImage(product.id);
      });

      nextBtn = productDiv.querySelector('.next-btn');
      nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImage(product.id);
      });

      productContainer.appendChild(productDiv);
    });

    productTemplate.classList.add('hide');
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

fetchProducts();
