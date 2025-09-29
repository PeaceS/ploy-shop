function showPopup(product, cat_count, time, uuid) {
  const popup = document.getElementById('popup');
  popup.classList.remove('hide');

  const title = popup.querySelector('#title');
  title.textContent = product;
  const subTitle = popup.querySelector('#subTitle');
  subTitle.textContent = typeof time === 'string' ? time : time.textContent;

  const colors = [
    'Magenta',
    'Green',
    'Blue',
    'Dark brown',
    'Red brown',
    'White',
    'Nude'
  ];

  const list = popup.querySelector('#list');
  if (!list) return;
  while (list.firstChild) list.removeChild(list.firstChild);

  const limitedColors = colors.slice(0, Math.max(0, Math.min(colors.length, cat_count)));
  limitedColors.forEach((color) => {
    const id = color;
    const li = document.createElement('li');

    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = color;

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'color';
    input.id = id;
    input.value = color;

    li.appendChild(input);
    li.appendChild(label);
    list.appendChild(li);
  });
}

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

    const promptEmail = await isEnabled('prompt_the_bond_buyer_email');

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
          let email = '';
          if (promptEmail) {
            email = prompt('Please enter your email');
          }
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

async function fetchTransaction() {
  try {
    const endpoint = '/transactions';
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const transactions = await response.json();
    const transactionStockContainer = document.getElementById('transaction');

    for (const transaction of transactions) {
      const row = document.createElement('tr');

      const dateTime = document.createElement('td');

      const dateInMilliseconds = transaction.purchased_at * 1000;
      const date = new Date(dateInMilliseconds);
      const simpleOptions = {
        dateStyle: 'short',
        timeStyle: 'short'
      };

      dateTime.textContent = date.toLocaleString('th-TH', simpleOptions);
      dateTime.classList.add('time');
      row.appendChild(dateTime);

      const item = document.createElement('td');
      const productRes = await fetch(`/products/${transaction.product_type}/${transaction.product_id}`);
      const productDetail = await productRes.json();
      item.textContent = productDetail.item;
      row.appendChild(item);

      const check = document.createElement('td');
      check.textContent = '✓';
      check.classList.add('check');
      row.appendChild(check);

      transactionStockContainer.appendChild(row);

      row.addEventListener('click', () => {
        showPopup(productDetail.item, productDetail.categories_count, dateTime, transaction.uuid);
      });
    }

  } catch (error) {
    console.error('Failed to fetch keychains:', error);
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

function handlePopup() {
  const popup = document.getElementById('popup');
  const closeBtn = popup.querySelector('#closeBtn');

  closeBtn.addEventListener('click', () => {
    popup.classList.add('hide');
  });
}

document.addEventListener('DOMContentLoaded', function() {
  fetchTransaction();
  fetchTheBondStock();
  fetchKeychainStock();
  bindTheBondSearch();
  bindKeychainSearch();
  handlePopup();
});
