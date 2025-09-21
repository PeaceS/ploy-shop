function formatId(id) {
  const idAsString = String(id);
  const paddedId = idAsString.padStart(3, '0');

  return `TB-${paddedId}`;
}

async function soldFn(item, id) {
  try {
    const response = await fetch(`/${item}/${id}`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    window.location.reload();

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    alert('Failed to update stock. Please try again.');
  }
};

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
      if (keychain.stock > 0) {
        const soldButton = hiddenSoldButton.cloneNode(true)
        soldButton.classList.remove('hide');
        sold.appendChild(soldButton);

        soldButton.addEventListener('click', () => {
          soldFn('keychains', keychain.id);
        });
      }
      row.appendChild(sold);

      keychainStockContainer.appendChild(row);
    });

  } catch (error) {
    console.error('Failed to fetch keychains:', error);
  }
}

async function fetchTheBondStock(id) {
  try {
    endpoint = id ? `/bonds/${id}` : '/bonds';
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const theBonds = await response.json();
    const bondStockContainer = document.getElementById('bond');
    const hiddenSoldButton = document.getElementById('sold-button');

    theBonds.forEach(theBond => {
      const row = document.createElement('tr');

      const item = document.createElement('td');
      item.textContent = formatId(theBond.id);
      row.appendChild(item);

      const sold = document.createElement('td');

      if (!theBond.sold) {
        const soldButton = hiddenSoldButton.cloneNode(true)
        soldButton.classList.remove('hide');
        sold.appendChild(soldButton);

        soldButton.addEventListener('click', () => {
          soldFn('bonds', theBond.id);
        });
      } else {
        sold.classList.add('sold');
      }
      row.appendChild(sold);

      bondStockContainer.appendChild(row);
    });

  } catch (error) {
    console.error('Failed to fetch the bonds:', error);
  }
}

fetchKeychainStock();
fetchTheBondStock();
