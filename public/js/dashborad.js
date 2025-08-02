const data = {
  users: [],
  products: [],
};

const toggleMenu = document.querySelector(".toggle-sidebar");
const html = document.querySelector("html");
const usersDataCount = document.querySelector(".users-data");
const productsDataCount = document.querySelectorAll(".products-data");
const themeButton = document.querySelector(".theme-button");
const latestUsersContainer = document.querySelector(".latest-users");
const tableBodyContainer = document.querySelector(".table-body");
const modalScreen = document.querySelector(".modal-screen");
const toast = document.querySelector(".toast");
const toastContent = document.querySelector(".toast-content");
const processTost = document.querySelector(".process");

toggleMenu.addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("open");
});

function getDataFromLocalStorage() {
  const themeUser = JSON.parse(localStorage.getItem("theme"));
  if (themeUser === "dark") {
    changeTheme();
  }
  data.users = JSON.parse(localStorage.getItem("user"));
  data.products = JSON.parse(localStorage.getItem("products"));
  if (data.products) {
    showProducts();
  }
  if (data.users) {
    usersDataCount.innerHTML = data.users.length;

    let indexStart;
    if (data.users.length < 5) {
      indexStart = 0;
    } else {
      indexStart = data.users.length - 5;
    }
    const userShow = data.users.slice(indexStart, data.users.length);
    userShow.forEach((user) => {
      latestUsersContainer.insertAdjacentHTML(
        "beforeend",
        `
        <article>
          <!-- user icon -->
          <span class="icon-card">
            <i class="fa-solid fa-user"></i>
          </span>
          <!-- user data -->
          <div>
            <p class="user-name">${user.name}</p>
            <p class="user-email">${user.email}</p>
          </div>
        </article>
        `
      );
    });
  }
}

function saveUserInLocalStorage() {
  localStorage.setItem("products", JSON.stringify(data.products));
}

function showProducts() {
  tableBodyContainer.innerHTML = "";
  let indexStart;
  if (data.products.length < 5) {
    indexStart = 0;
  } else {
    indexStart = data.products.length - 5;
  }
  const productsRecently = data.products.slice(
    indexStart,
    data.products.length
  );
  productsRecently.forEach((product) => {
    tableBodyContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="tableRow">
            <p class="product-title">${product.title}</p>
            <p class="product-price">${product.price}</p>
            <p class="product-shortName">${product.slug}</p>
            <div class="product-manage">
          <button class="edit-btn" onclick="aditUserModal(${product.id})">
            <!-- Edit icon -->
            <i class="fas fa-edit"></i>
          </button>
          <button class="remove-btn" onclick="showModalBan(${product.id})">
            <!-- Delete fas icon -->
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        `
    );
  });
  productsDataCount.forEach((elem) => {
    elem.innerHTML = data.products.length;
  });
}

function showModalBan(userId) {
  modalScreen.innerHTML = "";
  modalScreen.classList.remove("hidden");
  modalScreen.insertAdjacentHTML(
    "beforeend",
    `
    <div class="modal">
      <i class="ui-border top red"></i>
      <i class="ui-border bottom red"></i>
      <header class="modal-header">
        <h3>حذف محصول</h3>
        <button class="close-modal" onclick="hideModalScreen()">
          <i class="fas fa-times"></i>
        </button>
      </header>
      <main class="modal-content">
        <p class="remove-text">آیا از حذف کردن این محصول اطمینان دارید؟</p>
      </main>
      <footer class="modal-footer">
        <button class="cancel" onclick="hideModalScreen()">انصراف</button>
        <button class="submit" onclick="banUserBtn(${userId})">تائید</button>
      </footer>
    </div>
    `
  );
}

function changeTheme() {
  const iconTheme = themeButton.querySelector("i");
  html.classList.toggle("dark");
  if (html.className.includes("dark")) {
    localStorage.setItem("theme", JSON.stringify("dark"));
    iconTheme.setAttribute("class", "fas fa-sun");
  } else {
    localStorage.setItem("theme", JSON.stringify("light"));
    iconTheme.setAttribute("class", "fas fa-moon");
  }
}

function banUserBtn(userId) {
  const indexBanUser = data.products.findIndex((user) => {
    return user.id === userId;
  });
  data.products.splice(indexBanUser, 1);
  saveUserInLocalStorage();
  hideModalScreen();
  showTostBan();
  showProducts();
}

function showTostBan() {
  toastContent.innerHTML = "اطلاعات محصول با موفقیت حذف شد";
  toast.classList.remove("hidden");
  toast.classList.add("failed");
  toast.classList.remove("success");
  let width = 0;
  const timer = setInterval(function () {
    processTost.style.width = `${width}%`;
    if (width === 270) {
      processTost.style.width = 0;
      toast.classList.add("hidden");
      clearInterval(timer);
    }
    width++;
  }, 10);
}

function showTostAditOrNew() {
  toastContent.innerHTML = "اطلاعات محصول با موفقیت ثبت شد";
  toast.classList.remove("hidden");
  toast.style.display = "flex";
  toast.classList.remove("failed");
  toast.classList.add("success");
  let width = 0;
  const timer = setInterval(function () {
    processTost.style.width = `${width}%`;
    if (width === 270) {
      processTost.style.width = 0;
      toast.classList.add("hidden");
      clearInterval(timer);
    }
    width++;
  }, 10);
}

function aditUserModal(userId) {
  modalScreen.innerHTML = "";
  modalScreen.insertAdjacentHTML(
    "beforeend",
    `
    <div class="modal">
      <header class="modal-header">
        <h3>ویرایش محصول</h3>
        <button class="close-modal" onclick="hideModalScreen()">
          <i class="fas fa-times"></i>
        </button>
      </header>
      <main class="modal-content">
        <input
          type="text"
          class="modal-input"
          placeholder="عنوان محصول را وارد نمائید ..."
          id="product-title"
        />
        <input
          type="text"
          class="modal-input"
          placeholder="قیمت محصول را وارد نمائید ..."
          id="product-price"
        />
        <input
          type="text"
          class="modal-input"
          placeholder="عنوان کوتاه محصول را وارد نمائید ..."
          id="product-shortName"
        />
      </main>
      <footer class="modal-footer">
        <button class="cancel" onclick="hideModalScreen()">انصراف</button>
        <button class="submit" onclick="aditUserData(${userId})">تائید</button>
      </footer>
    </div>
    `
  );
  modalScreen.classList.remove("hidden");
}

function aditUserData(userId) {
  const inputModalNewTitle = document.getElementById("product-title");
  const inputModalNewPrice = document.getElementById("product-price");
  const inputModalNewSlug = document.getElementById("product-shortName");
  const userAdit = data.products.find((user) => {
    return user.id === userId;
  });
  userAdit.title = inputModalNewTitle.value;
  userAdit.price = inputModalNewPrice.value;
  userAdit.slug = inputModalNewSlug.value;
  showProducts();
  saveUserInLocalStorage();
  hideModalScreen();
  showTostAditOrNew();
}

function hideModalScreen() {
  modalScreen.classList.add("hidden");
}

themeButton.addEventListener("click", changeTheme);
