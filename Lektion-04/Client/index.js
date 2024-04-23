const initApp = async () => {
  const response = await fetch('http://localhost:5001/api/v1/products');

  if (response.ok) {
    const result = await response.json();
    console.log(result);
  }
};

document.addEventListener('DOMContentLoaded', initApp);
