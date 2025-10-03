async function fetchTransaction(uuid) {
  try {
    const response = await fetch(`/transactions/${uuid}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { transaction: transaction } = await response.json();
    return(transaction);

  } catch (error) {
    console.error('Failed to fetch transaction:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get('session_id');
  const transaction = await fetchTransaction(uuid);

  if (transaction != null) {
    const divProduct = document.getElementById('product');
    divProduct.textContent = transaction.product_type;

    const divPrice = document.getElementById('price');
    divPrice.textContent = transaction.price / 100;
    divPrice.classList.remove('hide');
  } else {
    const title = document.getElementById('title');
    title.textContent = 'Something went wrong';

    const description = document.getElementById('description');
    description.textContent = 'Please allow us to perform further checks.'
  }
});
