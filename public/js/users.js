//* Cms -> Content Management System

const data = {
  users: [],
  products: [],
};
const tableUserContainer = document.querySelector(".table-body");
const usersDataCount = document.querySelector(".users-data");
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

function getDataFromLocalStorage() {
  const themeUser = JSON.parse(localStorage.getItem("theme"));
  if (themeUser === "dark") {
    changeTheme();
  }
  const userLocal = JSON.parse(localStorage.getItem("user"));
  if (userLocal) {
    data.users = userLocal;
  }
  createSliderPages();
  pagesHandler(page);
}

function saveUserInLocalStorage() {
  localStorage.setItem("user", JSON.stringify(data.users));
}

function hideModalScreen() {
  modalScreen.classList.add("hidden");
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
        <h3>اخراج کاربر</h3>
        <button class="close-modal" onclick="hideModalScreen()">
          <i class="fas fa-times"></i>
        </button>
      </header>
      <main class="modal-content">
        <p class="remove-text">آیا از اخراج(بن) کردن این کاربر اطمینان دارید؟</p>
      </main>
      <footer class="modal-footer">
        <button class="cancel" onclick="hideModalScreen()">انصراف</button>
        <button class="submit" onclick="banUserBtn(${userId})">تائید</button>
      </footer>
    </div>
    `
  );
}

function banUserBtn(userId) {
  const indexBanUser = data.users.findIndex((user) => {
    return user.id === userId;
  });
  data.users.splice(indexBanUser, 1);
  pagesHandler(page);
  saveUserInLocalStorage();
  hideModalScreen();
  showTostBan();
}

function aditUserData(userId) {
  const inputModalNewName = document.getElementById("user-fullName");
  const inputModalNewUserName = document.getElementById("user-username");
  const inputModalNewEmail = document.getElementById("user-email");
  const inputModalNewPassword = document.getElementById("user-password");
  const userAdit = data.users.find((user) => {
    return user.id === userId;
  });
  userAdit.name = inputModalNewName.value;
  userAdit.username = inputModalNewUserName.value;
  userAdit.email = inputModalNewEmail.value;
  userAdit.password = inputModalNewPassword.value;
  pagesHandler(page);
  saveUserInLocalStorage();
  hideModalScreen();
  showTostAditOrNew();
}

function aditUserModal(userId) {
  modalScreen.innerHTML = "";
  modalScreen.insertAdjacentHTML(
    "beforeend",
    `
    <div class="modal">
      <header class="modal-header">
        <h3>ویرایش اطلاعات کاربر</h3>
        <button class="close-modal" onclick="hideModalScreen()">
          <i class="fas fa-times"></i>
        </button>
      </header>
      <main class="modal-content">
        <input
          type="text"
          class="modal-input"
          placeholder="نام و نام خانوادگی را وارد نمائید ..."
          id="user-fullName"
        />
        <input
          type="text"
          class="modal-input"
          id="user-username"
          placeholder="نام کاربری را وارد نمائید ..."
        />
        <input
          type="email"
          class="modal-input"
          id="user-email"
          placeholder="ایمیل را وارد نمائید ..."
        />
        <input
          type="password"
          class="modal-input"
          id="user-password"
          placeholder="رمز عبور را وارد نمائید ..."
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

function showUserInScreen(userPage) {
  tableUserContainer.innerHTML = "";
  userPage.forEach((user) => {
    tableUserContainer.insertAdjacentHTML(
      "beforeend",
      `
      <div class="tableRow">
        <p class="user-fullName">${user.name}</p>
        <p class="user-username">${user.username}</p>
        <p class="user-email">${user.email}</p>
        <p class="user-password">${user.password}</p>
        <div class="product-manage">
          <button class="edit-btn" onclick="aditUserModal(${user.id})">
            <!-- Edit icon -->
            <i class="fas fa-edit"></i>
          </button>
          <button class="remove-btn" onclick="showModalBan(${user.id})">
            <!-- Ban icon -->
            <i class="fas fa-ban"></i>
          </button>
        </div>
      </div>
      `
    );
  });
  saveUserInLocalStorage();
  userCount();
}

function createSliderPages() {
  paginationContainer.innerHTML = "";
  pageArray = [];
  let slider = Math.ceil(data.users.length / usersOrProductsInPage);
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
  if (indexEnd > data.users.length) {
    indexEnd === data.users.length;
  }
  let showInformationInpage = data.users.slice(indexStart, indexEnd);
  showUserInScreen(showInformationInpage);
}

function addUserInData() {
  const inputModalName = document.getElementById("user-fullName");
  const inputModalUserName = document.getElementById("user-username");
  const inputModalEmail = document.getElementById("user-email");
  const inputModalPassword = document.getElementById("user-password");
  let idProduct;
  if (data.users.length === 0) {
    idProduct = 1;
  } else {
    idProduct = data.users[data.users.length - 1].id + 1;
  }
  const newUser = {
    id: idProduct,
    name: inputModalName.value,
    username: inputModalUserName.value,
    email: inputModalEmail.value,
    password: inputModalPassword.value,
  };
  data.users.push(newUser);
  hideModalScreen();
  createSliderPages();
  pagesHandler(pageArray.length);
  showTostAditOrNew();
}

function userCount() {
  usersDataCount.innerHTML = data.users.length;
}

function showScreenAddUser() {
  modalScreen.classList.remove("hidden");
  modalScreen.innerHTML = "";
  modalScreen.insertAdjacentHTML(
    "beforeend",
    `
    <div class="modal">
      <header class="modal-header">
        <h3>اضافه کردن اطلاعات کاربر جدید</h3>
        <button class="close-modal" onclick="hideModalScreen()">
          <i class="fas fa-times"></i>
        </button>
      </header>
      <main class="modal-content">
        <input
          type="text"
          class="modal-input"
          placeholder="نام و نام خانوادگی را وارد نمائید ..."
          id="user-fullName"
        />
        <input
          type="text"
          class="modal-input"
          id="user-username"
          placeholder="نام کاربری را وارد نمائید ..."
        />
        <input
          type="email"
          class="modal-input"
          id="user-email"
          placeholder="ایمیل را وارد نمائید ..."
        />
        <input
          type="password"
          class="modal-input"
          id="user-password"
          placeholder="رمز عبور را وارد نمائید ..."
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

function showTostAditOrNew() {
  toastContent.innerHTML = "اطلاعات کاربر با موفقیت ثبت شد";
  toast.classList.remove("hidden");
  toast.classList.remove("failed");
  toast.classList.add("success");
  let width = 5;
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
  toastContent.innerHTML = "اطلاعات کاربر با موفقیت حذف شد";
  toast.classList.remove("hidden");
  toast.classList.add("failed");
  toast.classList.remove("success");
  let width = 5;
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
