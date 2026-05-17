# 🇯🇵 日本語 (J-Custom Deck) - Nền tảng Học Tiếng Nhật Cá Nhân Hóa

Một ứng dụng web full-stack hỗ trợ học tiếng Nhật (từ vựng, Kanji, ngữ pháp) thông qua các bộ dữ liệu cá nhân hóa (JSON). Ứng dụng tích hợp cơ chế Gamification tăng áp lực học tập và cung cấp trang phân tích thống kê chi tiết tiến độ.

---

## 🛠️ Cấu Trúc Dự Án (Tech Stack)

* **Backend:** Java Spring Boot 3.x, Spring Data JPA, Spring Security (đã mở CORS).
* **Frontend:** React 19, Vite, Tailwind CSS v4, Custom premium animations.
* **Database:** MySQL (chạy qua MAMP hoặc local), mã hóa `utf8mb4` hỗ trợ hoàn toàn Kanji/tiếng Nhật.

---

## 🚀 Hướng Dẫn Chạy Chi Tiết (Step-by-Step Setup)

> [!IMPORTANT]
> Dự án gồm hai phần Frontend và Backend nằm trong hai thư mục riêng biệt. Không chạy lệnh trực tiếp ở thư mục gốc nếu không có chỉ dẫn.

### Bước 1: Thiết Lập Database (MySQL)

1. **Khởi động MySQL:** Bật **MAMP** trên máy tính của bạn và đảm bảo MySQL Server đã chạy (mặc định port `3306`).
2. **Tạo Database & Cấu trúc bảng:**
   * Mở phpMyAdmin (hoặc MySQL Workbench / DBeaver).
   * Import file database schema đã được tối ưu hóa tiếng Nhật tại:
     👉 [db_schema.sql](./db_schema.sql)

---

### Bước 2: Chạy Backend (Spring Boot)

1. Mở Terminal mới và di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Cấu hình kết nối MySQL (nếu cần thiết, cấu hình mặc định là `root / root` cho MAMP):
   * File cấu hình: `backend/src/main/resources/application.properties`
3. Khởi động Backend:
   ```bash
   ./mvnw spring-boot:run
   ```
   * Server sẽ chạy tại: **`http://localhost:8080`**

---

### Bước 3: Chạy Frontend (React)

1. Mở một cửa sổ Terminal mới (hoặc tab mới) và di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```
2. Cài đặt các thư viện/dependencies (chỉ cần chạy lần đầu tiên):
   ```bash
   npm install
   ```
3. Khởi chạy môi trường phát triển:
   ```bash
   npm run dev
   ```
   * Ứng dụng sẽ chạy tại: **`http://localhost:5173`**

---

## 📝 Định Dạng Dữ Liệu Import (JSON Schema)

Bạn có thể tạo các bộ thẻ tùy chỉnh bằng file JSON theo cấu trúc chuẩn sau:

```json
{
  "title": "Tên bộ học tập",
  "description": "Mô tả ngắn gọn",
  "cards": [
    {
      "prompt": "Từ tiếng Nhật (Hiragana/Kanji/Cấu trúc)",
      "answer": "Nghĩa tiếng Việt",
      "hint": "Gợi ý / Ví dụ",
      "type": "VOCAB" 
    }
  ]
}
```
* **Lưu ý ở trường `type`:** Nhận một trong các giá trị: `VOCAB` (Từ vựng), `KANJI` (Chữ Hán), `GRAMMAR` (Ngữ pháp).

---

## 🏆 Các Tính Năng Đã Hoàn Thiện

1. **Giao diện Minimalist Zen Premium:** Thiết kế tối giản tinh tế, hiệu ứng di chuột (card-hover lift), glassmorphism navbar.
2. **Bộ Xáo Trộn Đề Thông Minh:** Thứ tự các câu hỏi sẽ tự động xáo trộn hoàn toàn ngẫu nhiên ở mỗi lượt chơi mới.
3. **Chế Độ Thiên Tài (Genius Mode):** Giới hạn thời gian 10 giây mỗi câu, tự động phân phối ngẫu nhiên giữa Trắc nghiệm (MCQ) và Tự luận (Typing) một cách mượt mà.
4. **Phân Tích Tiến Độ (統計):**
   * **🔥 Streak System:** Đếm số ngày học liên tục được đồng bộ hóa chuẩn thời gian thực từ Database.
   * **🎯 Chỉ số chính xác (Accuracy):** Tính phần trăm trả lời đúng trên toàn bộ hệ thống.
   * **⚠ Điểm yếu (Weak Points):** Tự động lọc ra top 10 từ/cụm từ hay bị trả lời sai nhiều nhất để hỗ trợ ôn tập.
   * **📜 Lịch sử phiên học:** Lưu vết và review chi tiết từng câu trả lời đúng/sai của từng lượt chơi trước đó.
