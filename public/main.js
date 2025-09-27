async function isEnabled(flag) {
  const response = await fetch(`/config/${flag}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const config = await response.json(); 
  console.log(config.isEnabled);
  return config.isEnabled;
}

function formatId(id) {
  const idAsString = String(id);
  const paddedId = idAsString.padStart(3, '0');

  return `TB-${paddedId}`;
}

async function soldFn(item, id, email) {
  try {
    const response = await fetch(`/${item}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
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

async function fetchKeychainStock(search) {
  try {
    endpoint = search ? `/keychains?search=${search}` : '/keychains';
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const keychains = await response.json();
    const keychainStockContainer = document.getElementById('keychain');
    const hiddenSoldButton = document.getElementById('sold-button');

    for (const row of keychainStockContainer.querySelectorAll('.removable')) {
      row.remove();
    }

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

      row.classList.add('removable');
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

    for (const row of bondStockContainer.querySelectorAll('.removable')) {
      row.remove();
    }

    isEnabled('prompt_the_bond_buyer_email');

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
          let email = prompt('Please enter your email');
          soldFn('bonds', theBond.id, email);
        });
      } else {
        sold.classList.add('sold');
      }
      row.appendChild(sold);

      row.classList.add('removable');
      bondStockContainer.appendChild(row);
    });

  } catch (error) {
    console.error('Failed to fetch the bonds:', error);
  }
}

async function bindTheBondSearch() {
  const searchInput = document.getElementById('search-the-bond');
  let timeoutId;

  searchInput.addEventListener('input', function(event) {
    const itemId = event.target.value;

    // Clear the previous timeout to reset the timer
    clearTimeout(timeoutId);

    // Set a new timeout to call the function after 500ms
    timeoutId = setTimeout(async () => {
      await fetchTheBondStock(itemId);
    }, 500); // Wait for 500 milliseconds before calling
  });
}

async function bindKeychainSearch() {
  const searchInput = document.getElementById('search-keychain');
  let timeoutId;

  searchInput.addEventListener('input', function(event) {
    const searchWord = event.target.value;

    // Clear the previous timeout to reset the timer
    clearTimeout(timeoutId);

    // Set a new timeout to call the function after 500ms
    timeoutId = setTimeout(async () => {
      await fetchKeychainStock(searchWord);
    }, 500); // Wait for 500 milliseconds before calling
  });
}

document.addEventListener('DOMContentLoaded', function() {
  fetchTheBondStock();
  fetchKeychainStock();
  bindTheBondSearch();
  bindKeychainSearch();
});
