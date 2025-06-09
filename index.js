// This event waits until the entire web page content is fully loaded before running any code inside
document.addEventListener('DOMContentLoaded', function () {

    //  all buttons with class 'add-button' (these add items to the cart)
    const addButtons = document.querySelectorAll('.add-button');

    //  parts of the cart UI
    const cartContent = document.getElementById('cartContent');       // Where cart items are shown
    const cartEmpty = document.getElementById('cartEmpty');           // Message shown if cart is empty
    const cartSummary = document.getElementById('cartSummary');       // Section with totals (subtotal, VAT, total)

    // Elements showing the subtotal, VAT, and total cost
    const subtotalAmount = document.getElementById('subtotalAmount');
    const vatAmount = document.getElementById('vatAmount');
    const totalAmount = document.getElementById('totalAmount');

    // Button to continue to delivery section
    const continueButton = document.getElementById('continueOrderBtn');

    // The delivery information section (initially hidden)
    const deliverySection = document.querySelector('.delivery-info');

    // This object stores the items in the cart.
    // Each item name is a key with price and quantity as values.
    const cart = {};

    // This function updates the cart display whenever changes happen
    function updateCartUI() {
        cartContent.innerHTML = ''; // Clears current cart contents before rebuilding it
        let subtotal = 0; // Variable to keep track of the cost before taxes

        // Loop through all items in the cart
        for (const itemName in cart) {
            const item = cart[itemName];
            const itemTotal = item.price * item.quantity; // Calculate total price for this item
            subtotal += itemTotal; // Add item total to subtotal

            // Create a new HTML element to show this item in the cart
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');

            // Insert the item name, price, quantity, and total
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${itemName}</h4>
                    <p>€${item.price.toFixed(2)} x ${item.quantity} = €${itemTotal.toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
            `;

            // When the "+" button is clicked, increase quantity by 1 and update UI
            itemElement.querySelector('.plus').addEventListener('click', () => {
                item.quantity++;
                updateCartUI(); // Refresh cart display
            });

            // When the "-" button is clicked
            itemElement.querySelector('.minus').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--; // Reduce quantity by 1
                } else {
                    delete cart[itemName]; // Remove item completely if quantity goes below 1
                }
                updateCartUI(); // Refresh cart display

                // Hide delivery section if there are no more items in the cart
                if (Object.keys(cart).length === 0) {
                    deliverySection.style.display = 'none';
                }
            });

            // Add the item to the cart display
            cartContent.appendChild(itemElement);
        }

        // Calculate VAT (21% of subtotal) and total amount
        const vat = subtotal * 0.21;
        const total = subtotal + vat;

        // Update amounts shown on the page
        subtotalAmount.textContent = `€${subtotal.toFixed(2)}`;
        vatAmount.textContent = `€${vat.toFixed(2)}`;
        totalAmount.textContent = `€${total.toFixed(2)}`;

        // If cart is empty, show "cart is empty" message and hide totals
        if (Object.keys(cart).length === 0) {
            cartEmpty.style.display = 'block';
            cartSummary.style.display = 'none';
        } else {
            cartEmpty.style.display = 'none';
            cartSummary.style.display = 'block';
        }
    }

    // For every "Add to Cart" button
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the item name and price from button's data attributes
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));

            // If item already in cart, increase quantity
            if (cart[name]) {
                cart[name].quantity++;
            } else {
                // If item is new, add it to cart with quantity 1
                cart[name] = {
                    price: price,
                    quantity: 1
                };
            }

            updateCartUI(); // Refresh cart display
        });
    });

    // When user clicks "Continue Order", show the delivery section
    continueButton.addEventListener('click', function () {
        if (Object.keys(cart).length > 0) { // Only show if cart isn't empty
            deliverySection.style.display = 'block'; // Show delivery section
            deliverySection.scrollIntoView({ behavior: 'smooth' }); // Scroll to that section smoothly
        }
    });
});
