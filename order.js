document.addEventListener('DOMContentLoaded', function() {
    const items = {
        fruits: [
            { name: 'Apple', price: 700, image: 'apple.jfif' },
            { name: 'Banana', price: 200, image: 'banana.jfif' },
            { name: 'Orange', price: 650, image: 'orange.jfif' },
            { name: 'Grapes', price: 800, image: 'grapes.jfif' },
            { name: 'Pineapple', price: 400, image: 'pineapple.jfif' },
            { name: 'Mango', price: 150, image: 'mango.jfif' }
        ],
        vegetables: [
            { name: 'Carrot', price: 300, image: 'images (7).jpeg' },
            { name: 'Beans', price: 200, image: 'images (8).jpeg' },
            { name: 'Tomato', price: 400, image: 'images.jpeg' },
            { name: 'Pumpkin', price: 100, image: 'download (17).jpeg' },
            { name: 'Leeks', price: 300, image: 'download (11).jpeg' },
            { name: 'Beetroot', price: 200, image: 'download (12).jpeg' }
        ],
        dairy: [
            { name: 'Ambewela fresh Milk', price: 900, image: 'download (5).jpeg' },
            { name: 'Kothmale Butter', price: 500, image: 'download (10).jpeg' },
            { name: 'Anchor Newdale', price: 80, image: 'download.jpeg' },
            { name: 'Ice cream', price: 400, image: 'images (4).jpeg' },
            { name: 'Cream', price: 700, image: 'cream.jfif' },
            { name: 'Cheese', price: 750, image: 'cheese.jfif' }
        ],
        meatSeafood: [
            { name: 'Chicken', price: 1160, image: 'chicken.jfif' },
            { name: 'Beef', price: 2350, image: 'beef.jfif' },
            { name: 'Fish', price: 900, image: 'fish.jfif' },
            { name: 'Shrimp', price: 1800, image: 'shrimp.jfif' }
        ],
        baking: [
            { name: 'Flour', price: 300, image: 'flour.jfif' },
            { name: 'Sugar', price: 200, image: 'sugar.jfif' },
            { name: 'Baking Powder', price: 400, image: 'baking powder.jfif' },
            { name: 'Salt', price: 100, image: 'salt.jfif' },
            { name: 'Oil', price: 580, image: 'oil.jfif' },
            { name: 'Yeast', price: 300, image: 'yeast.jfif' }
        ]
    };

    const orderForm = document.getElementById('orderForm');
    const orderSummary = document.getElementById('orderSummary').querySelector('tbody');
    const totalPriceElem = document.getElementById('totalPrice');

    function populateSection(sectionId, items, unit) {
        const section = document.getElementById(sectionId);
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item-container';  
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price} Rs/${unit}</span>
                    <input type="number" min="0" step="0.1" data-name="${item.name}" data-price="${item.price}" data-unit="${unit}">
                    <button type="button" class="add-to-cart" data-name="${item.name}" data-price="${item.price}" data-unit="${unit}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
            `;
            section.appendChild(itemDiv);
        });
    }

    populateSection('fruitsSection', items.fruits, 'kg');
    populateSection('vegetablesSection', items.vegetables, 'kg');
    populateSection('meatSeafoodSection', items.meatSeafood, 'kg');
    populateSection('dairySection', items.dairy, 'qty');
    populateSection('bakingSection', items.baking, 'qty');

    function updateOrderSummary() {
        orderSummary.innerHTML = '';
        let totalPrice = 0;

        const inputs = orderForm.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            const quantity = parseFloat(input.value);
            if (quantity > 0) {
                const name = input.getAttribute('data-name');
                const price = parseFloat(input.getAttribute('data-price'));
                const unit = input.getAttribute('data-unit');
                const itemPrice = quantity * price;
                totalPrice += itemPrice;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${name}</td>
                    <td>${quantity} ${unit}</td>
                    <td>${itemPrice.toFixed(2)}</td>
                    <td><button type="button" class="remove-button">Remove</button></td>
                `;

                const removeButton = row.querySelector('.remove-button');
                removeButton.addEventListener('click', function() {
                    row.remove();
                    updateTotalPrice(); // Update total price when an item is removed
                    saveOrderSummary();
                });

                orderSummary.appendChild(row);
            }
        });

        totalPriceElem.textContent = totalPrice.toFixed(2);
        saveOrderSummary();
    }

    function updateTotalPrice() {
        let totalPrice = 0;
        const rows = orderSummary.querySelectorAll('tr');
        rows.forEach(row => {
            const priceCell = row.querySelectorAll('td')[2];
            totalPrice += parseFloat(priceCell.innerText);
        });
        totalPriceElem.textContent = totalPrice.toFixed(2);
    }

    function saveOrderSummary() {
        const orderItems = [];
        const rows = orderSummary.querySelectorAll('tr');

        rows.forEach(row => {
            const columns = row.querySelectorAll('td');
            orderItems.push({
                name: columns[0].innerText,
                quantity: columns[1].innerText,
                price: columns[2].innerText
            });
        });

        localStorage.setItem('orderSummary', JSON.stringify(orderItems));
        localStorage.setItem('totalPrice', totalPriceElem.textContent);
    }

    function loadOrderSummary() {
        const savedOrderSummary = localStorage.getItem('orderSummary');
        const savedTotalPrice = localStorage.getItem('totalPrice');

        if (savedOrderSummary) {
            const orderItems = JSON.parse(savedOrderSummary);
            orderItems.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price}</td>
                    <td><button type="button" class="remove-button">Remove</button></td>
                `;

                const removeButton = row.querySelector('.remove-button');
                removeButton.addEventListener('click', function() {
                    row.remove();
                    updateTotalPrice(); // Update total price when an item is removed
                    saveOrderSummary();
                });

                orderSummary.appendChild(row);
            });
            totalPriceElem.textContent = savedTotalPrice || '0.00';
        }
    }

    // Load the order summary on page load
    loadOrderSummary();

    document.getElementById('addToFavourites').addEventListener('click', function() {
        const favouriteOrder = [];
        const inputs = orderForm.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            const quantity = parseFloat(input.value);
            if (quantity > 0) {
                favouriteOrder.push({
                    name: input.getAttribute('data-name'),
                    price: parseFloat(input.getAttribute('data-price')),
                    unit: input.getAttribute('data-unit'),
                    quantity
                });
            }
        });
        localStorage.setItem('favouriteOrder', JSON.stringify(favouriteOrder));

        // Show custom alert
        const alertDiv = document.getElementById('customAlert');
        const alertImage = document.getElementById('alertImage');
        const alertMessage = document.getElementById('alertMessage');

        alertImage.src = 'logo.png'; // Set the path to your image
        alertMessage.innerText = 'Your items were added to favourites!';

        alertDiv.classList.remove('hidden');
        alertDiv.classList.add('show');

        // Hide the alert after 3 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            alertDiv.classList.add('hidden');
        }, 3000);
    });

    const debouncedUpdateOrderSummary = debounce(updateOrderSummary, 300);

    orderForm.addEventListener('input', debouncedUpdateOrderSummary);

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Load async scripts after the page has loaded
    const loadScripts = async () => {
        const { calculateDiscount } = await import('./discount.js');
        document.getElementById('applyDiscount').addEventListener('click', () => {
            const discount = parseFloat(document.getElementById('discountInput').value) || 0;
            const discountedPrice = calculateDiscount(totalPriceElem.textContent, discount);
            totalPriceElem.textContent = discountedPrice.toFixed(2);
        });
    };
    loadScripts();
});
