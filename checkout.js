document.addEventListener('DOMContentLoaded', function() {
    const orderDetails = document.getElementById('orderDetails');
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary') || '[]');
    const totalPrice = localStorage.getItem('totalPrice') || '0';

    let totalPriceDisplay = 0;
    orderSummary.forEach(item => {
        const itemPrice = item.quantity * item.price;
        totalPriceDisplay += itemPrice;

        const itemDiv = document.createElement('div');
        itemDiv.textContent = `${item.name}: ${item.quantity} ${item.unit} - Rs${item.itemPrice}`;
        orderDetails.appendChild(itemDiv);
    });

    const totalDiv = document.createElement('div');
    totalDiv.textContent = `Total: Rs.${totalPrice}`;
    orderDetails.appendChild(totalDiv);

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    }

    function validateCardNumber(cardNumber) {
        return /^\d{16}$/.test(cardNumber);
    }

    function validateExpiryDate(expiryDate) {
        return /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate);
    }

    function validateCVV(cvv) {
        return /^\d{3}$/.test(cvv);
    }

    document.getElementById('pay').addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        let isValid = true;

        if (!name) {
            isValid = false;
            document.getElementById('nameError').textContent = 'Name is required';
        } else {
            document.getElementById('nameError').textContent = '';
        }

        if (!validateEmail(email)) {
            isValid = false;
            document.getElementById('emailError').textContent = 'Invalid email format';
        } else {
            document.getElementById('emailError').textContent = '';
        }

        if (!phone) {
            isValid = false;
            document.getElementById('phoneError').textContent = 'Phone is required';
        } else {
            document.getElementById('phoneError').textContent = '';
        }

        if (!address) {
            isValid = false;
            document.getElementById('addressError').textContent = 'Address is required';
        } else {
            document.getElementById('addressError').textContent = '';
        }

        if (!validateCardNumber(cardNumber)) {
            isValid = false;
            document.getElementById('cardNumberError').textContent = 'Invalid card number';
        } else {
            document.getElementById('cardNumberError').textContent = '';
        }

        if (!validateExpiryDate(expiryDate)) {
            isValid = false;
            document.getElementById('expiryDateError').textContent = 'Invalid expiry date';
        } else {
            document.getElementById('expiryDateError').textContent = '';
        }

        if (!validateCVV(cvv)) {
            isValid = false;
            document.getElementById('cvvError').textContent = 'Invalid CVV';
        } else {
            document.getElementById('cvvError').textContent = '';
        }

        if (isValid) {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 3); // Example: 3 days from now

            // Show the modal
            const modal = document.getElementById('myModal');
            const modalMessage = document.getElementById('modalMessage');
            modalMessage.textContent = `Thank you for your purchase! Your delivery date is ${deliveryDate.toLocaleDateString()}.`;
            modal.style.display = 'block';

            // Close the modal when the user clicks on <span> (x)
            document.querySelector('.close').onclick = function() {
                modal.style.display = 'none';
            };

            // Close the modal when the user clicks anywhere outside of the modal
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            };

            // Automatically close the modal after 3 seconds
            setTimeout(function() {
                modal.style.display = 'none';
            }, 3000);
        }
    });
});
