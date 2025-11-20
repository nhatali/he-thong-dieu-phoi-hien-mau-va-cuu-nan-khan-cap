// ================================================================
// admin.js – BloodLink Admin Panel 2025
// File JS chung cho tất cả trang admin
// Chức năng: Kiểm tra quyền, cập nhật menu, thống kê realtime, toast đẹp
// ================================================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("%cBloodLink Admin Panel – Đã load admin.js", "color:#d32f2f; font-weight:bold; font-size:14px;");

  // 1. KIỂM TRA QUYỀN ADMIN – BẮT BUỘC
  if (!isLoggedIn() || getCurrentUser().role !== "admin") {
    showToast("Truy cập bị từ chối! Bạn không phải Admin.", "error");
    setTimeout(() => window.location.href = "../login.html", 2000);
    return;
  }

  // 2. CẬP NHẬT MENU ADMIN
  updateAdminMenu();

  // 3. CẬP NHẬT THỐNG KÊ REALTIME (nếu có trên dashboard)
  if (document.getElementById("totalUsers")) loadDashboardStats();

  // 4. Tự động cập nhật mỗi 8 giây (nếu cần)
  setInterval(() => {
    if (document.getElementById("totalUsers")) loadDashboardStats();
  }, 8000);
});

// ==================== CẬP NHẬT MENU ADMIN ====================
function updateAdminMenu() {
  const user = getCurrentUser();
  const menu = document.getElementById("admin-menu");
  if (!menu) return;

  menu.innerHTML = `
    <span style="color:#fff; margin-right:20px;">
      <i class="fas fa-user-shield"></i> Xin chào, <strong>${user.name}</strong>
    </span>
    <a href="dashboard.html" class="btn small primary">
      <i class="fas fa-tachometer-alt"></i> Tổng quan
    </a>
    <a href="donors.html" class="btn small">
      <i class="fas fa-users"></i> Người hiến máu
    </a>
    <a href="rescue.html" class="btn small">
      <i class="fas fa-ambulance"></i> Yêu cầu cứu nạn
    </a>
    <a href="users.html" class="btn small">
      <i class="fas fa-user-friends"></i> Người dùng
    </a>
    <a href="#" onclick="adminLogout()" class="btn small danger">
      <i class="fas fa-sign-out-alt"></i> Đăng xuất
    </a>
  `;
}

// ==================== ĐĂNG XUẤT ADMIN ====================
function adminLogout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi Admin?")) {
    localStorage.removeItem("currentUser");
    showToast("Đã đăng xuất thành công!", "success");
    setTimeout(() => window.location.href = "../index.html", 1500);
  }
}

// ==================== TẢI THỐNG KÊ DASHBOARD ====================
function loadDashboardStats() {
  const users = getUsers();
  const donors = getDonors();
  const requests = getRescueRequests();

  const stats = {
    totalUsers: users.length,
    totalDonors: donors.length,
    pendingRequests: requests.filter(r => r.status === "Đang chờ").length,
    completedDonations: donors.filter(d => d.status === "Đã hiến").length,
    totalBloodBags: donors.filter(d => d.status === "Đã hiến").reduce((a, d) => a + 1, 0) * 350 + " ml"
  };

  // Cập nhật các thẻ có id tương ứng
  Object.keys(stats).forEach(key => {
    const el = document.getElementById(key);
    if (el) el.textContent = stats[key];
  });

  // Cập nhật hoạt động gần đây (nếu có)
  if (document.getElementById("recentActivity")) {
    const recent = [...donors.slice(-5), ...requests.slice(-5)]
      .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
      .map(item => {
        if (item.userId) {
          const user = users.find(u => u.id === item.userId);
          return `<p><i class="fas fa-heart"></i> <strong>${user?.name || 'Ẩn danh'}</strong> hiến máu tại <strong>${item.location}</strong> – ${item.date}</p>`;
        } else {
          return `<p class="urgent"><i class="fas fa-exclamation-triangle"></i> Cần <strong>${item.bloodNeeded}</strong> tại <strong>${item.hospital}</strong> – ${item.timestamp}</p>`;
        }
      }).join("");

    document.getElementById("recentActivity").innerHTML = recent || "<p>Chưa có hoạt động nào.</p>";
  }
}

// ==================== TOAST THÔNG BÁO ĐẸP ====================
function showToast(message, type = "success", duration = 4000) {
  // Xóa toast cũ
  document.querySelectorAll(".admin-toast").forEach(t => t.remove());

  const toast = document.createElement("div");
  toast.className = `admin-toast ${type}`;
  toast.innerHTML = `
    <i class="fas ${type === 'error' ? 'fa-times-circle' : 'fa-check-circle'}"></i>
    <span>${message}</span>
  `;
  toast.style.cssText = `
    position: fixed;
    top: 20px; right: 20px;
    background: ${type === 'error' ? '#d32f2f' : '#1b5e20'};
    color: white;
    padding: 16px 24px;
    border-radius: 50px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: bold;
    animation: slideInRight 0.5s ease;
    min-width: 300px;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOutRight 0.5s ease forwards";
    setTimeout(() => toast.remove(), 500);
  }, duration);
}

// Thêm animation
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideOutRight { to { transform: translateX(100%); opacity: 0; } }
  .urgent { color: #ff1744; font-weight: bold; }
`;
document.head.appendChild(style);

// ==================== XUẤT RA TOÀN CỤC ====================
window.adminLogout = adminLogout;
window.showToast = showToast;
window.loadDashboardStats = loadDashboardStats;

console.log("%cAdmin.js đã sẵn sàng – Chúc Admin làm việc vui vẻ!", "color:#4caf50; font-weight:bold;");