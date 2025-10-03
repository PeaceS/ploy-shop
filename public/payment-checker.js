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

const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get('session_id');
const transaction = fetchTransaction(uuid);

console.log(transaction);
