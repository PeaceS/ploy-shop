function preload(images) {
  images.forEach(image => {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'image';
    preload.href = image;
    document.head.appendChild(preload);
  });
}

async function createSession(priceId, productId) {
  const response = await fetch('/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ priceId: priceId, productId: productId }),
  });

  return await response.json();
}

async function fetchProducts() {
  try {
    const response = await fetch('/products');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();
    const productContainer = document.getElementById('product-container');
    const productTemplate = document.getElementById('product-template');

    products.forEach(async product => {
      const productDiv = productTemplate.cloneNode(true);
      productDiv.removeAttribute('id');

      titleDiv = productDiv.querySelector('.product-title');
      titleDiv.textContent = product.item;

      let currentImageIndex = 0;
      const images = [
        `${product.image_directory}/a.webp`,
        `${product.image_directory}/b.webp`,
        `${product.image_directory}/c.webp`,
        `${product.image_directory}/d.webp`,
        `${product.image_directory}/e.webp`,
        `${product.image_directory}/f.webp`,
        `${product.image_directory}/g.webp`
      ].slice(0, product.categories_count);

      preload(images);

      imageDiv = productDiv.querySelector('.product-image');
      imageDiv.src = images[0];
      imageDiv.alt = product.item;
      imageDiv.id = product.id

      descriptionDiv = productDiv.querySelector('.product-description');
      descriptionDiv.textContent = product.description;

      priceDiv = productDiv.querySelector('.product-price');
      priceDiv.textContent = product.price;

      const stripeLink = productDiv.querySelector('.stripe-link');
      stripeLink.addEventListener('click', async (event) => {
        event.preventDefault();
        const button = event.currentTarget;
        const loader = button.querySelector('.loader');
        loader.classList.add('loading');
        try {
          const checkoutLink = await createSession(product.stripe_price_id, product.id);
          window.location.href = checkoutLink.url;
        } finally {
          loader.classList.remove('loading');
        }
      });

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
