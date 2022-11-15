const rootElement = document.querySelector("#root");

rootElement.insertAdjacentHTML("beforeend", `<div class="wrapper"></div>`);

const pageElement = document.querySelector(".wrapper");

let finalOrder = [];

const pizzaComponent = (name, ingredients, price) => `
  <div class="pizza-card pizzaCard-${name}">
  <img src="img/${name}.png" alt="">
  <div class="pizzaInfo">
  <h2>${name}</h2>
  <h3>${ingredients}</h3>
  <h4>${price} HUF</h4>
  <input type="number" id="${name}" class="pizzaAmount" min="1" />
  <button class="pizzaCard-${name} order">Rendelés</button>
  </div>
  </div>
`;

const userComponent = () =>
  `<div class="cart">
  <div class="orderList">
  <h2 class="orderTitle">Rendelésem:<h2>
        <div class="pizzas"></div>
        </div>
        <form id="add-data">
          <input type="text" name="name" id="name" placeholder="Név:" />
          <input type="text" name="zip" id="zip" placeholder="Irányítószám:"  />
          <input type="text" name="city" id="city" placeholder="Város:" />
          <input type="text" name="street" id="street" placeholder="Utca:" />
          <input type="text" name="houseNumber" id="houseNumber" placeholder="Házszám:" />
          <input type="tel" name="phoneNumber" id="phoneNumber" placeholder="Telefonszám:" />
          <input type="button" value="Küldés" class="pre-order-button"/>
          </form>
          </div>`;
pageElement.insertAdjacentHTML("beforeend", userComponent());

fetch("/pizzas")
  .then((res) => res.json())
  .then((pizzas) => {
    pizzas.map((pizza) =>
      pageElement.insertAdjacentHTML(
        "beforeend",
        pizzaComponent(pizza.name, pizza.ingredients, pizza.price)
      )
    );

    const cardButtons = document.querySelectorAll(".order");
    cardButtons.forEach((cardButton) => {
      cardButton.addEventListener("click", function (event) {
        const className = event.target.classList[0]; //pizzaCard-Hawaii
        let currentPizza = document.querySelector(`.${className}`);

        let pizzaName = currentPizza.querySelector("h2").innerText;
        let number = currentPizza.querySelector(`input`).value;

        const cartList = document.querySelector(".pizzas");

        cartList.insertAdjacentHTML(
          "beforeend",
          `
      <div class="cart-pizza-${pizzaName}-${number}">
        <h2 class="selected${pizzaName}">${number}db ${pizzaName}</h2>
        <button class="delete-pizza-${pizzaName}-${number}">X</button>
      </div>`
        );
        //kinyírni a forEachet és az Allt
        const deleteBtnPizza = document.querySelectorAll(
          `.delete-pizza-${pizzaName}-${number}`
        );
        deleteBtnPizza.forEach((button) => {
          button.addEventListener("click", () => {
            const deleteFunction = document.querySelector(
              `.cart-pizza-${pizzaName}-${number}`
            );
            deleteFunction.remove();
          });
        });
      });
    });
  });

rootElement.insertAdjacentHTML(
  "beforeend",
  `
   <div class="alert confirmation-card">
      <h2>
        Köszönjük a rendelést! 
      </h2>
      <div class= "finalorderlist">
      </div>
      <button class="orderbutton conf">  
      Megrendel!
      </button>
      <button class="cancelbutton conf">
      Mégse
      </button>
  </div>
  `
);

let alert = rootElement.querySelector(".alert");
let orderButton = rootElement.querySelector(".orderbutton");
let cancelbutton = rootElement.querySelector(".cancelbutton");

const popUpWinConfOrder = rootElement.querySelector(".pre-order-button");
popUpWinConfOrder.addEventListener("click", function () {
  alert.classList.add("alertOpen");
});

orderButton.addEventListener("click", function () {
  alert.classList.remove("alertOpen");

  let order = document.querySelectorAll(".pizzas>div>h2");

  order.forEach((el) => {
    finalOrder.push(el.innerText);
  });

  const sendData = {
    name: document.querySelector("#name").value,
    zip: document.querySelector("#zip").value,
    city: document.querySelector("#city").value,
    street: document.querySelector("#street").value,
    houseNumber: document.querySelector("#houseNumber").value,
    phoneNumber: document.querySelector("#phoneNumber").value,
    order: finalOrder,
    date: new Date(),
  };
  fetch(`/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sendData),
  })
    .then((res) => res.json())
    .then((resJson) => location.reload());
});
cancelbutton.addEventListener("click", function () {
  alert.classList.remove("alertOpen");
});
