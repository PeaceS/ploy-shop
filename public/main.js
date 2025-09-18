async function fetchKeychainStock() {
  try {
    const response = await fetch('/keychains');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const keychains = await response.json();
    const stockContainer = document.getElementById('stock');

    keychains.forEach(keychain => {
      const li = document.createElement('li');
      li.textContent = `${keychain.item} - ${keychain.stock}`;
      stockContainer.appendChild(li);
    });

  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

fetchKeychainStock();
