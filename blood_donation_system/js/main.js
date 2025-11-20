// ===================================================================
// main.js - BloodLink Việt Nam
// File chính xử lý toàn bộ giao diện & logic người dùng
// Tương thích 100% với tất cả HTML đã cung cấp
// ===================================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("%cBloodLink Việt Nam - Hệ thống hiến máu & cấp cứu", "color: #d32f2f; font-size: 16px; font-weight: bold;");

  // 1. Cập nhật menu người dùng (hiện tên + đăng xuất + link admin nếu là admin)
  updateUserMenu();

  // 2. Cập nhật thống kê trang chủ
  updateHomepageStats();

  // 3. Tự động cập nhật menu khi có thay đổi (ví dụ: đăng nhập từ trang khác)
  const menuObserver = new MutationObserver(updateUserMenu);
  menuObserver.observe(document.body, { childList: true, subtree: true });
});

// ==================== CẬP NHẬT MENU NGƯỜI DÙNG ====================
function updateUserMenu() {
  const menuElement = document.getElementById("user-menu");
  if (!menuElement) return;

  if (isLoggedIn()) {
    const user = getCurrentUser();
    const isAdmin = user.role === "admin";

    menuElement.innerHTML = `
      <span style="margin-right: 15px;">
        Xin chào, <strong>${user.name}</strong> 
        ${user.bloodType ? `(${user.bloodType})` : ""}
      </span>
      <a href="#" onclick="logout(); return false;" style="margin: 0 8px; color:#ffeb3b;">[Đăng xuất]</a>
      ${isAdmin 
        ? `<a href="admin/dashboard.html" style="background:#ffeb3b; color:#d32f2f; padding:6px 12px; border-radius:20px; font-weight:bold;">Quản trị</a>`
        : ""
      }
    `;
  } else {
    menuElement.innerHTML = `
      <a href="login.html">Đăng nhập</a>
      <span style="margin:0 10px;">|</span>
      <a href="register.html">Đăng ký</a>
    `;
  }
}

// ==================== CẬP NHẬT THỐNG KÊ TRANG CHỦ ====================
function updateHomepageStats() {
  const donorsCountEl = document.getElementById("total-donors");
  const requestsCountEl = document.getElementById("total-requests");
  const savedLivesEl = document.getElementById("saved-lives");

  if (!donorsCountEl && !requestsCountEl && !savedLivesEl) return;

  const donors = getDonors();
  const requests = getRescueRequests();
  const pendingRequests = requests.filter(r => r.status === "Đang chờ").length;
  const completedDonations = donors.filter(d => d.status === "Đã hiến").length;

  if (donorsCountEl) donorsCountEl.textContent = donors.length;
  if (requestsCountEl) requestsCountEl.textContent = pendingRequests;
  if (savedLivesEl) savedLivesEl.textContent = completedDonations * 3; // 1 người hiến cứu được ~3 người
}

// ==================== ĐĂNG XUẤT ====================
function logout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem("currentUser");
    alert("Đã đăng xuất thành công!");
    window.location.href = "index.html";
  }
}

// ==================== KIỂM TRA ĐĂNG NHẬP (dùng ở các trang bảo vệ) ====================
function requireLogin() {
  if (!isLoggedIn()) {
    alert("Vui lòng đăng nhập để tiếp tục!");
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// ==================== HIỂN THỊ THÔNG BÁO (toast) ====================
function showToast(message, type = "success", duration = 4000) {
  // Xóa toast cũ
  const oldToast = document.querySelector(".toast-notification");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.className = `toast-notification ${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${type === "error" ? "#d32f2f" : "#1b5e20"};
    color: white;
    padding: 16px 24px;
    border-radius: 50px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    font-weight: bold;
    animation: slideIn 0.4s ease;
    max-width: 90%;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.4s ease forwards";
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

// Thêm animation cho toast
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ==================== XUẤT RA TOÀN CỤC (để HTML gọi được) ====================
window.updateUserMenu = updateUserMenu;
window.logout = logout;
window.requireLogin = requireLogin;
window.showToast = showToast;

// Log khi load xong
console.log("%cmain.js đã load thành công!", "color: #4caf50; font-weight: bold;");