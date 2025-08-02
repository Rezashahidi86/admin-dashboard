const data = {
  users: [],
  products: [],
};

const tableUserContainer = document.querySelector(".table-body");
const usersDataCount = document.querySelector(".products-data");
const html = document.querySelector("html");
const toggleMenu = document.querySelector(".toggle-sidebar");
const themeButton = document.querySelector(".theme-button");
const sectionAddUser = document.querySelector(".section-link");
const modalScreen = document.querySelector(".modal-screen");
const paginationContainer = document.querySelector(".pagination");
const toast = document.querySelector(".toast");
const processTost = document.querySelector(".process");
const toastContent = document.querySelector(".toast-content");
let page = 1;
let usersOrProductsInPage = 5;
let pageArray = [];

toggleMenu.addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("open");
});

function getDataFromLocalStorage() {
  const themeUser = JSON.parse(localStorage.getItem("theme"));
  if (themeUser === "dark") {
    changeTheme();
  }
  const userLocal = JSON.parse(localStorage.getItem("products"));
  if (userLocal) {
    data.products = userLocal;
  }
  createSliderPages();
  pagesHandler(page);
}

function saveUserInLocalStorage() {
  localStorage.setItem("products", JSON.stringify(data.products));
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

function showScreenAddUser() {
  modalScreen.classList.remove("hidden");
  modalScreen.innerHTML = "";
  modalScreen.insertAdjacentHTML(
    "beforeend",
    `
    <div class="modal">
       <header class="modal-header">
        <h3>ایجاد محصول</h3>
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
        <button class="submit" onclick="addUserInData()">تائید</button>
      </footer>
    </div>
    `
  );
}

function userCount() {
  usersDataCount.innerHTML = data.products.length;
}

function hideModalScreen() {
  modalScreen.classList.add("hidden");
}

function showUserInScreen(userPage) {
  tableUserContainer.innerHTML = "";
  userPage.forEach((user) => {
    tableUserContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="tableRow">
          <p class="product-title">${user.title}</p>
          <p class="product-price">${user.price}</p>
          <p class="product-shortName">${user.slug}</p>
          <div class="product-manage">
            <button class="edit-btn" class="edit-btn" onclick="aditUserModal(${user.id})">
              <!-- Edit icon -->
              <i class="fas fa-edit"></i>
            </button>
            <button class="remove-btn" onclick="showModalBan(${user.id})">
              <!-- Delete fas icon -->
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `
    );
  });
  saveUserInLocalStorage();
  userCount();
}

function banUserBtn(userId) {
  const indexBanUser = data.products.findIndex((user) => {
    return user.id === userId;
  });
  data.products.splice(indexBanUser, 1);
  pagesHandler(page);
  saveUserInLocalStorage();
  hideModalScreen();
  showTostBan();
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
  pagesHandler(page);
  saveUserInLocalStorage();
  hideModalScreen();
  showTostAditOrNew();
}

function addUserInData() {
  const inputModaltitle = document.getElementById("product-title");
  const inputModalprice = document.getElementById("product-price");
  const inputModalslug = document.getElementById("product-shortName");
  let idProduct;
  if (data.products.length === 0){
    idProduct = 1
  } else{
    idProduct = data.products[data.products.length-1].id+1
  }
  const newUser = {
    id: idProduct,
    title: inputModaltitle.value,
    price: inputModalprice.value,
    slug: inputModalslug.value,
  };
  data.products.push(newUser);
  hideModalScreen();
  createSliderPages();
  pagesHandler(pageArray.length);
  showTostAditOrNew();
}


function createSliderPages() {
  paginationContainer.innerHTML = "";
  pageArray = [];
  let slider = Math.ceil(data.products.length / usersOrProductsInPage);
  if (!slider) {
    slider++;
  }
  for (let i = 0; i < slider; i++) {
    paginationContainer.insertAdjacentHTML(
      "beforeend",
      `
      <span tabindex="${i + 1}" class="page " onclick="pagesHandler(${
        i + 1
      })">${i + 1}</span>
      `
    );
    pageArray.push(i + 1);
  }
}

function pagesHandler(pageNumber) {
  createSliderPages();
  let allPages = paginationContainer.querySelectorAll(".page");
  allPages.forEach((page) => {
    if (+page.innerHTML === pageNumber) {
      page.setAttribute("class", "page active");
    } else {
      page.classList.remove("active");
    }
  });

  page = pageNumber;
  let indexStart = (page - 1) * usersOrProductsInPage;
  let indexEnd = page * usersOrProductsInPage;
  if (indexEnd > data.products.length) {
    indexEnd === data.products.length;
  }
  let showInformationInpage = data.products.slice(indexStart, indexEnd);
  showUserInScreen(showInformationInpage);
}

function showTostAditOrNew() {
  toastContent.innerHTML = "اطلاعات محصول با موفقیت ثبت شد";
  toast.classList.remove("hidden");
  toast.style.display = "flex"
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

themeButton.addEventListener("click", changeTheme);
sectionAddUser.addEventListener("click", showScreenAddUser);
