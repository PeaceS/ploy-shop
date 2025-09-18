async function fetchKeychainStock() {
  try {
    const response = await fetch('/keychains');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const keychains = await response.json();
    const keychainStockContainer = document.getElementById('keychain');

    keychains.forEach(keychain => {
      const row = document.createElement('tr');

      const item = document.createElement('td');
      item.textContent = keychain.item;
      row.appendChild(item);

      const stock = document.createElement('td');
      stock.classList.add('stock');
      stock.textContent = keychain.stock;
      row.appendChild(stock);

      keychainStockContainer.appendChild(row);
    });

  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

fetchKeychainStock();
