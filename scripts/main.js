const productsListed = [
    {
        productName: "Headphones",
        price: 10
    },
    {
        productName: "Microwave",
        price: 70
    },
    {
        productName: "Mini-Fridge",
        price: 100
    },
]



let itemsSection = document.getElementById("items");

for(let product of productsListed){
    let p = document.createElement("div");
    p.innerHTML = `<h4>${product.productName}</h4><p>$${product.price}</p>`;
    p.className = "product";
    itemsSection.appendChild(p);
}

let totalPrice = document.getElementById("total-price");
totalPrice.textContent = "$"+ productsListed.reduce((sum, a) => sum +=a.price, 0);

// pagination

let mainSections = document.getElementsByClassName("main-section");
let curSection = 0;

document.getElementById("next-btn").onclick = ()=>{
    if(curSection<mainSections.length){
        mainSections[curSection].classList.add("d-none");
        curSection++;
        mainSections[curSection].classList.remove("d-none");
    }
}

document.getElementById("prev-btn").onclick = () =>{
    if(curSection>0){
        mainSections[curSection].classList.add("d-none");
        curSection--;
        mainSections[curSection].classList.remove("d-none");
    }
}


