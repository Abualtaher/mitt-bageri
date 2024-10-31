let iconCart = document.querySelector(".icon-cart");
let cartTab = document.querySelector(".cartTab");
let closeCart = document.querySelector(".close");
let body = document.querySelector("body");
const list = document.querySelector(".listProduct");
let listCartHTML = document.querySelector(".listCart");
let iconCartspan = document.querySelector(".icon-cart span");
let listProducts = [];
let carts = [];

iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

function fetchData() {
  fetch("./data.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      listProducts = data;
      data.forEach((item, key) => {
        let newDiv = document.createElement("div");
        newDiv.classList.add("item");
        newDiv.dataset.id = item.id;
        newDiv.innerHTML = `
          <img
            src="${item.image.desktop}"
            alt="${item.name}"
          />
          <h2>${item.name}</h2>
          <div class="price">$ ${item.price}</div>
          <button class="addCart">Add to Cart</button>
        </div>
      `;
        list.appendChild(newDiv);
        if (localStorage.getItem("cart")) {
          carts = JSON.parse(localStorage.getItem("cart"));
        }
      });
    })
    .catch((error) => console.error("Unable to fetch data:", error));
}
fetchData();

list.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("addCart")) {
    let product_id = positionClick.parentElement.dataset.id;
    addToCart(product_id);
  }
});

const addToCart = (product_id) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (carts.length <= 0) {
    carts = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[positionThisProductInCart].quantity =
      carts[positionThisProductInCart].quantity + 1;
  }
  addCartToHTML();
  addcartToMemory();
};

const addcartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};

const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity = totalQuantity + cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;
      let positionProduct = listProducts.findIndex(
        (value) => value.id == cart.product_id
      );
      let info = listProducts[positionProduct];
      newCart.innerHTML = `
        <div class='image'>
            <img src="${info.image.desktop}" alt=''>
            </div>
            <div class="name">${info.name}</div>

            <div class="totalPrice">$${info.price}</div>
            <div class="quantity">
              <span class="minus"><</span>
              <span>${cart.quantity}</span>
              <span class="plus">></span>
            </div>
            </div>`;
      listCartHTML.appendChild(newCart);
    });
  }
  iconCartspan.innerText = totalQuantity;
};

listCartHTML.addEventListener("clik", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantity(product_id, type);
  }
});

const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex(
    (value) => (value.product_id = product_id)
  );
  if (positionItemInCart >= 0) {
    switch (type) {
      case "pluse":
        carts[positionItemInCart].quantity =
          carts[positionItemInCart].quantity + 1;
        break;
      default:
        let valueChange = carts[positionItemInCart].quantity - 1;
        if (valueChange > 0) {
          carts[positionItemInCart].quantity = valueChange;
        } else {
          carts.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addcartToMemory();
  addCartToHTML();
};

console.log("wisam");
