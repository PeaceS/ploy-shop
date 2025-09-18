async function fetchKeychainStock() {
  try {
    const response = await fetch('/keychains');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const keychains = await response.json();
    const keychainStockContainer = document.getElementById('keychain');
    const hiddenSoldButton = document.getElementById('sold-button');

    keychains.forEach(keychain => {
      const row = document.createElement('tr');

      const item = document.createElement('td');
      item.textContent = keychain.item;
      row.appendChild(item);

      const stock = document.createElement('td');
      stock.classList.add('stock');
      stock.textContent = keychain.stock;
      row.appendChild(stock);

      const sold = document.createElement('td');
      const soldButton = hiddenSoldButton.cloneNode(true)
      soldButton.classList.remove('hide');
      sold.appendChild(soldButton);
      row.appendChild(sold);

      keychainStockContainer.appendChild(row);
    });

  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

fetchKeychainStock();
