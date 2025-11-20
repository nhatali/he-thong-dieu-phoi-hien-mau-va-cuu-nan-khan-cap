// utils.js
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function getDonors() {
  return JSON.parse(localStorage.getItem("donors") || "[]");
}

function getRescueRequests() {
  return JSON.parse(localStorage.getItem("rescueRequests") || "[]");
}

function isLoggedIn() {
  return localStorage.getItem("currentUser") !== null;
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function loginUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

function updateUserMenu() {
  const menu = document.getElementById("user-menu");
  if (!menu) return;
  if (isLoggedIn()) {
    const user = getCurrentUser();
    menu.innerHTML = `
      Xin chào, <strong>${user.name}</strong> 
      <a href="login.html" onclick="logout(); return false;">[Đăng xuất]</a>
      ${user.role === 'admin' ? '<a href="admin/dashboard.html">Quản trị</a>' : ''}
    `;
  } else {
    menu.innerHTML = '<a href="login.html">Đăng nhập</a> | <a href="register.html">Đăng ký</a>';
  }
}

function updateStats() {
  const donors = getDonors().length;
  const requests = getRescueRequests().filter(r => r.status === "Đang chờ").length;
  document.getItemById("total-donors").textContent = donors;
  document.getItemById("total-requests").textContent = requests;
  document.getItemById("saved-lives").textContent = Math.floor(donors * 3); // giả định 1 người cứu 3 người
}