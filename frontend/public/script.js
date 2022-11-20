const rootElement = document.querySelector("#root");

rootElement.insertAdjacentHTML(
  "beforeend",
  `<div class="wrapperleft"></div>
<div class="wrapperright"></div>`
);

const pageElementLeft = document.querySelector(".wrapperleft");
const pageElementRight = document.querySelector(".wrapperright");

let finalOrder = [];

const pizzaComponent = (name, ingredients, price) => `
  <div class="pizza-card pizzaCard-${name}">
  <img src="img/${name}.png" alt="">
  <div class="pizzaInfo">
  <h2>${name}</h2>
  <h3>${ingredients}</h3>
  <h4>${price}</h4><h4>HUF</h4>
  <input type="number" id="${name}" class="pizzaAmount" value="1" min="1">
  <button class="pizzaCard-${name} order">Rendelés</button>
  </div>
  </div>
`;
//
const userComponent = () =>
  `<div class="cart ">
     <div class="orderList">
     <h2 class="orderTitle">Rendelésem:<h2>
     <div class="pizzas"></div>
  </div>
  <div class="total">
  <h2>Total:<h2>
  <h2 class="total-pay">&nbsp0 HUF</h2>
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
pageElementRight.insertAdjacentHTML("beforeend", userComponent());

fetch("/pizzas")
  .then((res) => res.json())
  .then((pizzas) => {
    pizzas.forEach((pizza) =>
      pageElementLeft.insertAdjacentHTML(
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
        let price = currentPizza.querySelector(`h4`).innerText;

        const cartList = document.querySelector(".pizzas");
        const totalPrice = document.querySelector(".total");
        let sum = Number(number) * Number(price);
        cartList.insertAdjacentHTML(
          "beforeend",
          `
         <div class=" cartPizza cart-pizza-${pizzaName}-${number}">
         <h2 class="selected${pizzaName}">${pizzaName} ${number}db&nbsp</h2>
         <h3 class="one-class-pizza-sum">${sum}</h3>
         <h3>&nbsp HUF</h3>
         
         <button class=" cdpb delete-pizza-${pizzaName}-${number}">X</button>
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

            totalSumComponent();
          });
        });
        const totalSumComponent = () => {
          let arr = [];
          document
            .querySelectorAll(".one-class-pizza-sum")
            .forEach((l) => arr.push(Number(l.innerHTML)));

          let totalArr = arr.reduce((p, c) => p + c, 0);

          const empy = document.querySelector(".total-pay");
          empy.remove();

          totalPrice.insertAdjacentHTML(
            "beforeend",
            `<h2 class="total-pay">&nbsp${totalArr}&nbspHUF</h2>`
          );
        };
        totalSumComponent();
      });
    });
  });

rootElement.insertAdjacentHTML(
  "beforeend",
  `
   <div class="alert confirmation-card">
   <div class="order-info">
   
   </div>
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
popUpWinConfOrder.addEventListener("click", () => {
  alert.classList.add("alertOpen");
});

orderButton.addEventListener("click", () => {
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
    price: document.querySelector(".total-pay").innerText,
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
