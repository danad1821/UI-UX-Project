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
  for (let product of productsListed) {
    let p = document.createElement("div");
    p.innerHTML = `<h4 class="col-3">${product.productName}</h4>
    <p class="col-3 product-price">$${(
      product.price * product.quantity
    ).toFixed(2)}</p><div class="d-flex align-items-center col-3">
      <button type="button" class="quantity-btn reduce-btn">-</button>
      <p class="product-quantity">${product.quantity}</p>
      <button type="button" class="quantity-btn add-btn">+</button>
    </div>
    <div class="col-3"><button type="button" class="remove-btn ">Remove</button></div>
 `;
    p.className = "product";
    p.classList.add("row");
    itemsSection.appendChild(p);
  }
}

purchaseSummary();

function updateTotals() {
  let subtotal = document.getElementById("subtotal");
  subtotal.textContent =
    "$" + productsListed.reduce((sum, a) => (sum += a.price * a.quantity), 0);

  document.getElementById("total-price").textContent =
    "$" + productsListed.reduce((sum, a) => (sum += a.price * a.quantity), 15);
}

let addBtns = document.getElementsByClassName("add-btn");
let reduceBtns = document.getElementsByClassName("reduce-btn");
const MAX_QUANTITY = 10;
const MIN_QUANTITY = 1;

// --- INITIAL DISABLE CHECK (Good Practice) ---
// Disable all 'Reduce' buttons that start at 1 unit
Array.from(reduceBtns).forEach((btn, index) => {
    let quantityElement = document.getElementsByClassName("product-quantity")[index];
    if (parseInt(quantityElement.textContent) === MIN_QUANTITY) {
        btn.disabled = true;
    }
});

// --- ADD BUTTON LOGIC ---
Array.from(addBtns).forEach((btn, index) => {
    btn.addEventListener("click", () => {
        let quantityElement = document.getElementsByClassName("product-quantity")[index];
        let priceElement = document.getElementsByClassName("product-price")[index];
        let reduceBtn = reduceBtns[index]; // Get the corresponding reduce button

        let currentQuantity = parseInt(quantityElement.textContent);

        // 1. MAX CHECK: Disable the Add button if we hit the limit
        if (currentQuantity >= MAX_QUANTITY) {
            // Already at max, so just return
            return; 
        }

        // --- Calculate New Quantity and Price (Your existing correct logic) ---
        let currentPriceText = priceElement.textContent;
        let currentTotalPrice = parseFloat(currentPriceText.slice(1));
        let unitPrice = currentTotalPrice / currentQuantity;
        let newQuantity = currentQuantity + 1;
        let newTotalPrice = unitPrice * newQuantity;

        // --- Update UI and Data ---
        quantityElement.textContent = newQuantity;
        priceElement.textContent = "$" + newTotalPrice.toFixed(2);
        productsListed[index].quantity = newQuantity;
        updateTotals();

        // 2. DISABLE CHECK: Disable the Add button if the new quantity hits the max
        if (newQuantity >= MAX_QUANTITY) {
            btn.disabled = true;
        }

        // 3. ENABLE CHECK: Ensure the Reduce button is enabled (since newQuantity > 1)
        reduceBtn.disabled = false;
    });
});

// --- REDUCE BUTTON LOGIC ---
Array.from(reduceBtns).forEach((btn, index) => {
    btn.addEventListener("click", () => {
        let quantityElement = document.getElementsByClassName("product-quantity")[index];
        let priceElement = document.getElementsByClassName("product-price")[index];
        let addBtn = addBtns[index]; // Get the corresponding add button

        let currentQuantity = parseInt(quantityElement.textContent);

        // 1. MIN CHECK: Disable the Reduce button if we are at the minimum
        if (currentQuantity <= MIN_QUANTITY) {
            // Already at min, so just return
            return; 
        }
        
        // --- Calculate New Quantity and Price (Your existing correct logic) ---
        let currentPriceText = priceElement.textContent;
        let currentTotalPrice = parseFloat(currentPriceText.slice(1));
        let unitPrice = currentTotalPrice / currentQuantity;
        let newQuantity = currentQuantity - 1;
        let newTotalPrice = unitPrice * newQuantity;

      
        quantityElement.textContent = newQuantity;
        priceElement.textContent = "$" + newTotalPrice.toFixed(2);
        productsListed[index].quantity = newQuantity;
        updateTotals();
        if (newQuantity <= MIN_QUANTITY) {
            btn.disabled = true;
        }

        // 3. ENABLE CHECK: Ensure the Add button is enabled (since newQuantity < 10)
        addBtn.disabled = false;
    });
});

updateTotals();

// pagination
let mainSections = document.getElementsByClassName("main-section");
let curSection = 0;
let nextBtn = document.getElementById("next-btn");
let prevBtn = document.getElementById("prev-btn");

const updateButtonVisibility = () => {
  if (curSection > 0) {
    prevBtn.classList.remove("d-none"); // SHOW
  } else {
    prevBtn.classList.add("d-none"); // HIDE
  }
};

const updateBtnLabels = () => {
  if (curSection === 0) {
    nextBtn.innerText = "Proceed to Personal & Contact Info";
  } else if (curSection === 1) {
    // on personal info
    nextBtn.innerText = "Proceed to Billing Address";
    prevBtn.innerText = "Go Back";
  } else if (curSection === 2) {
    //
    nextBtn.innerHTML = "Proceed to Payment Details";
    prevBtn.innerText = "Go Back";
  } else if (curSection === 3) {
    nextBtn.innerHTML = "Check confirmation details";
    prevBtn.innerText = "Go Back";
  }
};

updateButtonVisibility();
updateBtnLabels();

nextBtn.onclick = () => {
  if (curSection < mainSections.length) {
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
