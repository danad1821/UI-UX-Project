const productsListed = [
  {
    productName: "Headphones",
    price: 10,
  },
  {
    productName: "Microwave",
    price: 70,
  },
  {
    productName: "Mini-Fridge",
    price: 100,
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

for (let product of productsListed) {
  let p = document.createElement("div");
  p.innerHTML = `<h4>${product.productName}</h4><p>$${product.price}</p><button type="button" class="remove-btn">Remove</button>`;
  p.className = "product";
  itemsSection.appendChild(p);
}

let subtotal = document.getElementById("subtotal");
subtotal.textContent =
  "$" + productsListed.reduce((sum, a) => (sum += a.price), 0);

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
    nextBtn.innerText = "Proceed to Personal Info";
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
