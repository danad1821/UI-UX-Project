let productsListed = [
  {
    productName: "Headphones",
    price: 10,
    quantity: 2,
  },
  {
    productName: "Microwave",
    price: 70,
    quantity: 1,
  },
  {
    productName: "Mini-Fridge",
    price: 100,
    quantity: 1,
  },
];

let nextBtn = document.getElementById("next-btn");
let prevBtn = document.getElementById("prev-btn");
let promoApplied = false;
let discountRate = 0; // Default 0% discount

// progress
let svgString = `<svg
    viewBox="0 0 16 16"
    class="bi bi-check-lg"
    fill="currentColor"
    height="16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"
        ></path>
    </svg>`;
    
let trashIconSvg = `<svg viewBox="0 0 16 16" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>`;

function updateProgress(currentStepNumber) {
  const steps = document.querySelectorAll(".stepper-step");
  const circles = document.querySelectorAll(".stepper-circle");

  steps.forEach((step, index) => {
    const stepNum = index + 1;

    // 1. Remove all active and complete classes first
    step.classList.remove(
      "stepper-pending",
      "stepper-active",
      "stepper-completed"
    );

    if (stepNum < currentStepNumber) {
      // 2. Mark previous steps as complete
      step.classList.add("stepper-completed");
      circles[index].innerHTML = svgString;
    } else if (stepNum === currentStepNumber) {
      // 3. Mark the current step as active
      step.classList.add("stepper-active");
      circles[index].innerHTML = stepNum;
    } else {
      step.classList.add("stepper-pending");
      circles[index].innerHTML = stepNum;
    }
    // Steps with stepNum > currentStepNumber remain inactive
  });
}

//summary
let itemsSection = document.getElementById("items");

function purchaseSummary() {
  itemsSection.innerHTML = `<div class="product-header row">
              <p class="col-3">Product</p>
              <p class="col-3">Price</p>
              <p class="col-3">Quantity</p>
              <p class="col-3"></p>
            </div>`;
  productsListed.forEach((product, index) => {
    let p = document.createElement("div");
    p.innerHTML = `<h4 class="col-3">${product.productName}</h4>
    <p class="col-3 product-price">$${(
      product.price * product.quantity
    ).toFixed(2)}</p><div class="d-flex align-items-center col-3">
      <button type="button" class="quantity-btn reduce-btn" data-index="${index}">-</button>
      <p class="product-quantity">${product.quantity}</p>
      <button type="button" class="quantity-btn add-btn" data-index="${index}">+</button>
    </div>
    <div class="col-3"><button type="button" class="remove-btn" data-index="${index}">${trashIconSvg}</button></div>
 `;
    p.className = "product";
    p.classList.add("row");
    itemsSection.appendChild(p);
  });
  
  attachQuantityListeners();
  attachRemoveListeners();
}

function updateTotals() {
  const tax = 15;
  const subtotalValue = productsListed.reduce((sum, a) => (sum += a.price * a.quantity), 0);
  
  let discountAmount = 0;
  if (promoApplied) {
    // 75% discount
    discountRate = 0.75; 
    discountAmount = subtotalValue * discountRate;
    document.getElementById("discount-value").textContent = "-$" + discountAmount.toFixed(2);
    document.getElementById("discount-row").classList.remove("d-none");
  } else {
    document.getElementById("discount-row").classList.add("d-none");
  }
  
  const finalSubtotal = subtotalValue - discountAmount;
  const totalPriceValue = finalSubtotal + 0 + tax; // Shipping is 0
  
  document.getElementById("subtotal").textContent = "$" + subtotalValue.toFixed(2);
  document.getElementById("total-price").textContent = "$" + totalPriceValue.toFixed(2);
}

// Promo Code Logic
const promoCodeInput = document.getElementById("promo-code-input");
const applyPromoBtn = document.getElementById("apply-promo-btn");
const promoError = document.getElementById("promo-error");
const DISCOUNT_CODE = "eddie";

applyPromoBtn.addEventListener("click", () => {
    const code = promoCodeInput.value.trim();
    
    if (code.toLowerCase() === DISCOUNT_CODE) {
        if (!promoApplied) {
            promoApplied = true;
            updateTotals();
            promoError.textContent = "Promo code applied successfully (75% discount)!";
            promoError.classList.remove("text-danger");
            promoError.classList.add("text-success");
        } else {
            promoError.textContent = "Promo code already applied.";
            promoError.classList.remove("text-success");
            promoError.classList.add("text-danger");
        }
    } else {
        promoApplied = false;
        updateTotals(); // Recalculate totals without discount
        promoError.textContent = "Invalid promo code.";
        promoError.classList.remove("text-success");
        promoError.classList.add("text-danger");
    }
    
    setTimeout(() => {
        promoError.textContent = "";
        promoError.classList.remove("text-success", "text-danger");
    }, 5000);
});

// Quantity and Remove Logic
const MAX_QUANTITY = 10;
const MIN_QUANTITY = 1;

function updateQuantity(index, newQuantity) {
    const product = productsListed[index];
    if (!product) return;

    product.quantity = newQuantity;
    
    // Re-render the summary to update UI and re-attach listeners
    purchaseSummary(); 
    updateTotals();
}

function attachQuantityListeners() {
    // Re-select all buttons after re-rendering purchaseSummary
    let addBtns = document.getElementsByClassName("add-btn");
    let reduceBtns = document.getElementsByClassName("reduce-btn");
    
    Array.from(addBtns).forEach(btn => {
        const index = parseInt(btn.getAttribute('data-index'));
        const currentQuantity = productsListed[index].quantity;
        
        if (currentQuantity >= MAX_QUANTITY) {
             btn.disabled = true;
        }

        btn.onclick = () => {
            const newQuantity = currentQuantity + 1;
            if (newQuantity <= MAX_QUANTITY) {
                updateQuantity(index, newQuantity);
            }
        };
    });

    Array.from(reduceBtns).forEach(btn => {
        const index = parseInt(btn.getAttribute('data-index'));
        const currentQuantity = productsListed[index].quantity;

        if (currentQuantity <= MIN_QUANTITY) {
            btn.disabled = true;
        }
        
        btn.onclick = () => {
            const newQuantity = currentQuantity - 1;
            if (newQuantity >= MIN_QUANTITY) {
                updateQuantity(index, newQuantity);
            }
        };
    });
}

function attachRemoveListeners() {
    let removeBtns = document.getElementsByClassName("remove-btn");
    Array.from(removeBtns).forEach(btn => {
        const index = parseInt(btn.getAttribute('data-index'));
        btn.onclick = () => {
            // Remove the product from the array
            productsListed.splice(index, 1);
            
            // Re-render and update totals
            purchaseSummary(); 
            updateTotals();
        };
    });
}

// Initial setup
purchaseSummary();
updateTotals();


// personal info
function setError(elem, msg) {
  elem.textContent = msg;
  setTimeout(() => {
    elem.textContent = "";
  }, 5000);
}

let personalInfo = document.getElementsByClassName("personal-data");

function validatePersonalData() {
  let isValid = true;

  //name
  if (!/^[a-zA-Z\s]*$/.test(personalInfo[0].value.trim())) {
    setError(
      document.getElementsByClassName("personal-error")[0],
      "Name must not contain special characters or numbers."
    );
    isValid = false;
  } else if (!personalInfo[0].value.trim()) {
    setError(
      document.getElementsByClassName("personal-error")[0],
      "Name must not be empty."
    );
    isValid = false;
  } else if (!personalInfo[0].value.includes(" ")) {
    setError(
      document.getElementsByClassName("personal-error")[0],
      "Full Name must be entered."
    );
    isValid = false;
  }
  //email
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      personalInfo[1].value
    )
  ) {
    setError(
      document.getElementsByClassName("personal-error")[1],
      "Email is invalid."
    );
    isValid = false;
  }

  //phone
  if (
    !/^\+?\d{8,15}$/.test(personalInfo[2].value.trim().replace(/[^\d+]/g, ""))
  ) {
    setError(
      document.getElementsByClassName("personal-error")[2],
      "Phone Number is invalid."
    );
    isValid = false;
  }

  return isValid;
}

// billing and shipping
let billingAndShipping = document.getElementById("sameAddress");
let modes = document.getElementsByClassName("billing-shipping-contents");

billingAndShipping.addEventListener("change", () => {
  if (billingAndShipping.checked) {
    modes[0].classList.remove("d-none");
    modes[1].classList.add("d-none");
  } else {
    modes[0].classList.add("d-none");
    modes[1].classList.remove("d-none");
  }
});

function validateBillingAndShippingData() {
  let isValid = true;
  if (billingAndShipping.checked) {
    let data = document.getElementsByClassName("combined-data");
    let errors = document.getElementsByClassName("combined-error");
    //street address
    if (!data[0].value) {
      setError(errors[0], "Please enter a street address.");
      isValid = false;
    }
    //city
    if (!data[1].value) {
      setError(errors[1], "Please enter a city.");
      isValid = false;
    }
    //zip code
    if (!data[2].value || !/^\d+$/.test(data[2].value)) {
      setError(errors[2], "Please enter a valid zip code.");
      isValid = false;
    }
    //country
    if (!data[3].value) {
      setError(errors[3], "Please select a country.");
      isValid = false;
    }
  } else {
    let billingData = document.getElementsByClassName("billing-data");
    let billingErrors = document.getElementsByClassName("billing-error");
    let shippingData = document.getElementsByClassName("shipping-data");
    let shippingErrors = document.getElementsByClassName("shipping-error");

    // Billing validation
    if (!billingData[0].value) {
      setError(billingErrors[0], "Please enter a street address.");
      isValid = false;
    }
    if (!billingData[1].value) {
      setError(billingErrors[1], "Please enter a city.");
      isValid = false;
    }
    if (!billingData[2].value || !/^\d+$/.test(billingData[2].value)) {
      setError(billingErrors[2], "Please enter a valid zip code.");
      isValid = false;
    }
    if (!billingData[3].value) {
      setError(billingErrors[3], "Please select a country.");
      isValid = false;
    }

    // Shipping validation
    if (!shippingData[0].value) {
      setError(shippingErrors[0], "Please enter a street address.");
      isValid = false;
    }
    if (!shippingData[1].value) {
      setError(shippingErrors[1], "Please enter a city.");
      isValid = false;
    }
    if (!shippingData[2].value || !/^\d+$/.test(shippingData[2].value)) {
      setError(shippingErrors[2], "Please enter a valid zip code.");
      isValid = false;
    }
    if (!shippingData[3].value) {
      setError(shippingErrors[3], "Please select a country.");
      isValid = false;
    }
  }

  return isValid;
}

// payment
let cardNumber = document.getElementById("card-information");
let securityCode = document.getElementById("security-code");
let expDate = document.getElementById("expiration-date");

function validatePaymentData() {
  let isValid = true;
  const cardError = document.getElementsByClassName("card-error")[0];
  const expError = document.getElementsByClassName("exp-error")[0];
  const cvvError = document.getElementsByClassName("cvv-error")[0];

  // Card Number validation (16 digits, only numbers)
  const cleanedCardNum = cardNumber.value.replace(/\s/g, '');
  if (!/^\d{16}$/.test(cleanedCardNum)) {
    setError(cardError, "Card Number must be 16 digits.");
    isValid = false;
  }
  
  // Expiration Date validation (MM-YYYY format and not in the past)
  const expRegex = /^(0[1-9]|1[0-2])-\d{4}$/;
  if (!expRegex.test(expDate.value)) {
    setError(expError, "Incorrect Expiration Date Format (MM-YYYY).");
    isValid = false;
  } else {
      const parts = expDate.value.split('-');
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // 1-indexed month

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
          setError(expError, "Expiration Date cannot be in the past.");
          isValid = false;
      }
  }

  // CVV validation (3 digits, only numbers)
  if (!/^\d{3}$/.test(securityCode.value)) {
    setError(cvvError, "CVV must be 3 digits.");
    isValid = false;
  }

  return isValid;
}

// Card number formatting
cardNumber.addEventListener('input', function(event) {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
    value.replace(/(\d{4}\s){3}/, 'XXXX XXXX XXXX ');
    // Limit to 16 digits
    if (value.length > 16) {
        
        value = value.substring(0, 16);
    }

    // Add spaces for formatting: XXXX XXXX XXXX XXXX
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        formattedValue += value[i];
        if ((i + 1) % 4 === 0 && i !== value.length - 1) {
            formattedValue += ' ';
        }
    }
    
    event.target.value = formattedValue;
});

// Expiration date formatting (already mostly correct, just added digit check)
expDate.addEventListener("input", function (event) {
  let value = event.target.value;
  value = value.replace(/\D/g, ""); // Remove non-digit characters
  
  // Add hyphen automatically after month (MM-YYYY)
  if (value.length > 2) {
    value = value.substring(0, 2) + "-" + value.substring(2, 6);
  }
  // Limit length to MM-YYYY (7 characters max in digits+hyphen)
  if (value.length > 7) {
    value = value.substring(0, 7);
  }

  event.target.value = value;
});

expDate.addEventListener('blur', function(event) {
    // Only check format on blur
    validatePaymentData();
});

// Security code (CVV) formatting
securityCode.addEventListener('input', function(event) {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Limit to 3 digits
    if (value.length > 3) {
        value = value.substring(0, 3);
    }
    
    event.target.value = value;
});


// review and confirm (Step 5)
function populateReviewSection() {
    const reviewContent = document.getElementById("review-content");
    reviewContent.innerHTML = ''; // Clear previous content

    // 1. Checkout Summary
    let summaryHtml = `
        <div class="review-box">
            <h4>Checkout Summary</h4>
            <div class="product-list-review">
    `;
    productsListed.forEach(p => {
        summaryHtml += `<p>${p.productName} (x${p.quantity}): $${(p.price * p.quantity).toFixed(2)}</p>`;
    });
    
    const subtotalValue = productsListed.reduce((sum, a) => (sum += a.price * a.quantity), 0);
    let discountAmount = promoApplied ? subtotalValue * discountRate : 0;
    const finalSubtotal = subtotalValue - discountAmount;
    const tax = 15;
    const totalPriceValue = finalSubtotal + tax;
    
    summaryHtml += `
            </div>
            <p><strong>Subtotal:</strong> $${subtotalValue.toFixed(2)}</p>
    `;
    if (promoApplied) {
        summaryHtml += `<p style="color: green;"><strong>Discount (75%):</strong> -$${discountAmount.toFixed(2)}</p>`;
    }
    summaryHtml += `
            <p><strong>Tax:</strong> $${tax.toFixed(2)}</p>
            <p><strong>Shipping:</strong> $0.00</p>
            <p><strong>Order Total:</strong> <span style="font-size: 20px; color: #435274; font-weight: bold;">$${totalPriceValue.toFixed(2)}</span></p>
        </div>
    `;
    reviewContent.innerHTML += summaryHtml;

    // 2. Personal & Contact Info
    const fullName = document.getElementById("full-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone-number").value;
    
    reviewContent.innerHTML += `
        <div class="review-box">
            <h4>Personal & Contact Info</h4>
            <p><strong>Full Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
        </div>
    `;
    
    // 3. Billing & Shipping Address
    let addressHtml = `
        <div class="review-box">
            <h4>Address Details</h4>
    `;

    if (billingAndShipping.checked) {
        const data = document.getElementsByClassName("combined-data");
        const street = data[0].value;
        const city = data[1].value;
        const zip = data[2].value;
        const countryText = data[3].options[data[3].selectedIndex].text;

        addressHtml += `
            <h5>Billing & Shipping Address:</h5>
            <p>${street}</p>
            <p>${city}, ${zip}, ${countryText}</p>
        `;
    } else {
        // Billing Address
        const billingData = document.getElementsByClassName("billing-data");
        const bStreet = billingData[0].value;
        const bCity = billingData[1].value;
        const bZip = billingData[2].value;
        const bCountryText = billingData[3].options[billingData[3].selectedIndex].text;
        
        // Shipping Address
        const shippingData = document.getElementsByClassName("shipping-data");
        const sStreet = shippingData[0].value;
        const sCity = shippingData[1].value;
        const sZip = shippingData[2].value;
        const sCountryText = shippingData[3].options[shippingData[3].selectedIndex].text;
        
        addressHtml += `
            <div class="d-flex justify-content-between">
                <div class="w-45">
                    <h5>Billing Address:</h5>
                    <p>${bStreet}</p>
                    <p>${bCity}, ${bZip}, ${bCountryText}</p>
                </div>
                <div class="w-45">
                    <h5>Shipping Address:</h5>
                    <p>${sStreet}</p>
                    <p>${sCity}, ${sZip}, ${sCountryText}</p>
                </div>
            </div>
        `;
    }
    
    addressHtml += `</div>`;
    reviewContent.innerHTML += addressHtml;

    // 4. Payment Details
    // Card number and CVV are validated as only digits, so we can display them safely
    // This uses the current formatted value from the input and replaces all but the last 4 digits.
    const obscuredCard = cardNumber.value.replace(/(\d{4}\s){3}/, 'XXXX XXXX XXXX ');
    
    reviewContent.innerHTML += `
        <div class="review-box">
            <h4>💳Payment Details</h4>
            <p><strong>Card Number:</strong> ${obscuredCard}</p>
        </div>
    `;
}

// pagination
let mainSections = document.getElementsByClassName("main-section");
let curSection = 0; // 0-indexed: 0-Checkout, 1-Personal, 2-Address, 3-Payment, 4-Review, 5-Confirmation

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let randomNumber = getRandomIntInclusive(0,1);

const updateButtonVisibility = () => {
  // Always handle prevBtn visibility based on current section
  if (curSection > 0) {
    prevBtn.classList.remove("d-none"); // SHOW on steps 1-4 (index 1-4)
  } else {
    prevBtn.classList.add("d-none"); // HIDE on step 0 (index 0)
  }
  
  if (curSection === mainSections.length - 1) { // Final confirmation page (index 5)
    nextBtn.classList.add("d-none"); // HIDE next button on confirmation page
    if(randomNumber === 0){ // If FAIL (0) - requirement 2
      prevBtn.classList.remove("d-none"); // SHOW back button (to allow retry/review)
    }
    else{ // If SUCCESS (1) - requirement 2
      prevBtn.classList.add("d-none"); // HIDE back button
    }
  } else {
    nextBtn.classList.remove("d-none"); // SHOW next button on all other pages
  }
};

const updateBtnLabels = () => {
  if (curSection === 0) {
    nextBtn.innerText = "Proceed to Personal & Contact Info";
    prevBtn.innerText = "Go Back";
  } else if (curSection === 1) {
    nextBtn.innerText = "Proceed to Billing & Shipping Address";
    prevBtn.innerText = "Go Back";
  } else if (curSection === 2) {
    nextBtn.innerHTML = "Proceed to Payment Details";
    prevBtn.innerText = "Go Back";
  } else if (curSection === 3) {
    nextBtn.innerHTML = "Review & Confirm Order";
    prevBtn.innerText = "Go Back";
  } else if (curSection === 4) {
    nextBtn.innerHTML = "Confirm Order and Pay";
    prevBtn.innerText = "Go Back";
  }
};

const validateData = () => {
  let isValid = true;
  if (curSection === 1) {
    isValid = validatePersonalData();
  } else if (curSection === 2) {
    isValid = validateBillingAndShippingData();
  } else if (curSection === 3) {
    isValid = validatePaymentData();
  }
  // Step 4 (Review) and others have no form validation required
  return isValid;
};

updateButtonVisibility();
updateBtnLabels();

nextBtn.onclick = () => {
  if (productsListed.length === 0 && curSection === 0) {
      alert("Your cart is empty. Please add items to proceed.");
      return;
  }
  
  if (!validateData()) {
    return;
  }
  
  // Before moving to the Review section, populate it
  if (curSection === 3) {
      populateReviewSection();
  }

  // Logic for the final step (Review -> Confirmation)
  if (curSection === mainSections.length - 2) { 
      // Generate random result for confirmation (0=Fail, 1=Success)
      randomNumber = getRandomIntInclusive(0,1); 
      
      const orderTotal = document.getElementById("total-price").textContent;
      const resultHeader = document.getElementById("confimationResult");
      
      // Perform final transition to Confirmation
      mainSections[curSection].classList.add("d-none");
      curSection = curSection + 1;
      mainSections[curSection].classList.remove("d-none");
      
      if(randomNumber === 1){
        resultHeader.textContent = `✅ Order Confirmed! Thank you for your purchase!`;
      }
      else{
        resultHeader.textContent = `Something went wrong! Please try again!`;
      }
      
      updateButtonVisibility(); // Update visibility based on randomNumber
      updateProgress(curSection + 1);
      return;
  }

  
  if (curSection < mainSections.length - 1) { // Stop before the last confirmation section
    mainSections[curSection].classList.add("d-none");
    curSection = curSection + 1;
    mainSections[curSection].classList.remove("d-none");
    updateButtonVisibility();
    updateBtnLabels();
    updateProgress(curSection + 1);
  }
};

prevBtn.onclick = () => {
  if (curSection > 0) {
    mainSections[curSection].classList.add("d-none");
    curSection = curSection - 1;
    mainSections[curSection].classList.remove("d-none");
    updateButtonVisibility();
    updateBtnLabels();
    updateProgress(curSection + 1);
  }
};