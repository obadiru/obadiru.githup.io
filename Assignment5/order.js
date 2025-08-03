function calculateTotal() {
    const items = document.querySelectorAll('input[name="item"]:checked');
    let subtotal = 0;
    items.forEach(item => {
        subtotal += parseFloat(item.value);
    });
    const tax = subtotal * 0.13;
    const total = subtotal + tax;
    document.getElementById("totalCost").textContent = total.toFixed(2);
}