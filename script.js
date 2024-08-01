document.addEventListener('DOMContentLoaded', () => {
    // Cart functionality
    const cartButtons = document.querySelectorAll('.add-btn');
    const cartContainer = document.querySelector('.orders');
    const totalAmountElement = document.querySelector('.total p:nth-child(2)');
    const cart = {};

    cartButtons.forEach(button => {
        const changeText = button.querySelector('.change-text');
        const increase = button.querySelector('#increase');
        const decrease = button.querySelector('#decrease');
        const productInfo = button.closest('.food-box');
        const productName = productInfo.querySelector('.food-text h3').innerText;
        const productPrice = parseFloat(productInfo.querySelector('.food-text p:nth-child(3)').innerText.replace('$', ''));
        let quantity = 0;

        button.addEventListener('click', () => {
            if (!button.classList.contains('clicked')) {
                button.classList.add('clicked');
                quantity = 1;
                changeText.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> ${quantity}`;
                button.querySelectorAll('p').forEach(p => p.style.display = 'flex');
                addToCart(productName, productPrice, quantity);
            }
        });

        increase.addEventListener('click', (event) => {
            event.stopPropagation();
            quantity += 1;
            changeText.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> ${quantity}`;
            updateCart(productName, productPrice, quantity);
        });

        decrease.addEventListener('click', (event) => {
            event.stopPropagation();
            if (quantity > 1) {
                quantity -= 1;
                changeText.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> ${quantity}`;
                updateCart(productName, productPrice, quantity);
            } else {
                button.classList.remove('clicked');
                changeText.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Add to cart`;
                button.querySelectorAll('p').forEach(p => p.style.display = 'none');
                removeFromCart(productName);
            }
        });
    });

    function addToCart(name, price, quantity) {
        if (cart[name]) {
            cart[name].quantity += quantity;
            cart[name].totalPrice = cart[name].quantity * price;
        } else {
            cart[name] = { price: price, quantity: quantity, totalPrice: price * quantity };
        }
        renderCart();
    }

    function updateCart(name, price, quantity) {
        if (cart[name]) {
            cart[name].quantity = quantity;
            cart[name].totalPrice = price * quantity;
        }
        renderCart();
    }

    function removeFromCart(name) {
        if (cart[name]) {
            delete cart[name];
        }
        renderCart();
    }

    function renderCart() {
        cartContainer.innerHTML = '';
        let totalAmount = 0;

        for (const [name, info] of Object.entries(cart)) {
            const cartItem = document.createElement('div');
            cartItem.classList.add('goods-ordered');

            cartItem.innerHTML = `
                <h4>${name}</h4>
                <div class="price-amount">
                    <span>${info.quantity}x</span>
                    <span>$${info.price.toFixed(2)}</span>
                    <span>$${info.totalPrice.toFixed(2)}</span>
                    <p class="remove-item" data-name="${name}">x</p>
                </div>
            `;

            cartContainer.appendChild(cartItem);
            totalAmount += info.totalPrice;
        }

        totalAmountElement.innerText = `$${totalAmount.toFixed(2)}`;

        // Add event listeners to the remove buttons
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const name = event.target.dataset.name;
                removeFromCart(name);
            });
        });
    }

    // Modal functionality
    const confirmOrderBtn = document.querySelector('.your-cart button');
    const bgModal = document.querySelector('.bg-modal');
    const closeModal = document.querySelector('#close');
    const modalOrders = document.querySelector('.orders-pop');
    const startNewOrderBtn = document.querySelector('.popup-modal button');

    // Function to update the modal with cart details
    function updateModal() {
        const cartItems = document.querySelectorAll('.goods-ordered');
        modalOrders.innerHTML = ''; // Clear existing items

        if (cartItems.length === 0) {
            modalOrders.innerHTML = '<p>No orders made yet. Please proceed to make your orders.</p>';
        } else {
            cartItems.forEach(item => {
                const itemClone = item.cloneNode(true);
                itemClone.classList.remove('goods-ordered');
                itemClone.classList.add('goods-ordered-pop');
                // Remove 'x' buttons if any
                itemClone.querySelectorAll('p').forEach(p => p.remove());
                modalOrders.appendChild(itemClone);
            });
        }
    }

    // Show the modal
    confirmOrderBtn.addEventListener('click', () => {
        updateModal();
        bgModal.style.display = 'flex';
    });

    // Close the modal
    closeModal.addEventListener('click', () => {
        bgModal.style.display = 'none';
    });

    // Start a new order
    startNewOrderBtn.addEventListener('click', () => {
        // Clear cart items
        const cartItems = document.querySelectorAll('.goods-ordered');
        cartItems.forEach(item => item.remove());

        // Update cart section
        const cartSection = document.querySelector('.your-cart .orders');
        if (cartItems.length === 0) {
            cartSection.innerHTML = '<p>Nothing in cart</p>';
        }

        // Clear cart data
        for (const name in cart) {
            delete cart[name];
        }

        // Reset total amount
        totalAmountElement.innerText = '$0.00';

        // Close the modal
        bgModal.style.display = 'none';
    });
});
