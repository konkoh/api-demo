# Member 5 API Demo — Hướng dẫn chạy & kiểm thử trên Postman

> Thư mục này nằm trong **repo nhóm** `Phat-Trien-Du-An-Phan-Mem` (1 source duy nhất từ đầu đến cuối môn). Nghiệp vụ nằm ở `../members/member5_Modules_QA/`, API demo nằm ở `api-demo/` — đúng phạm vi thư mục member5 phụ trách.

API demo cho **toàn bộ phạm vi Member 5** của dự án HTQLLH (EduManage Pro):

| Phân hệ | Mã | Endpoint gốc |
|---|---|---|
| Điểm danh & Chuyên cần | FC-05 | `/api/attendance` |
| Quản lý Học phí | FC-06 | `/api/tuition` |
| Xuất báo cáo Excel/PDF | FC-07 | `/api/export` |
| Nhật ký kiểm toán | — | `/api/audit-logs` |

> **Kiến trúc**: API chỉ là lớp HTTP (controller → service). Toàn bộ **nghiệp vụ nằm ở các module member5** (`members/member5_Modules_QA/src/js/modules/`) — API import trực tiếp `attendanceModule`, `tuitionModule`, `exportModule`, `auditLogger`, không viết lại logic nào.

---

## ⚡ Tóm tắt nhanh (dùng khi thuyết trình)

REST API phạm vi member5 của nhóm mình chạy ở base url `http://localhost:3000/api`, trao đổi dữ liệu bằng JSON, response thống nhất format `{success, message, data}`. API gói trọn 4 phần member5 phụ trách: `/api/attendance` (điểm danh theo lớp/ngày, thống kê chuyên cần, tự gửi thông báo cho phụ huynh khi học sinh vắng không phép, cảnh báo cấm thi khi vắng KPN vượt 20% tổng số tiết theo SRS), `/api/tuition` (tạo thông báo học phí, thanh toán trả góp — đủ tiền thì PAID, thiếu thì PARTIAL, mỗi lần trả sinh 1 số biên lai, có báo cáo công nợ cả lớp), `/api/export` (xuất danh sách lớp ra Excel, biên lai học phí ra PDF) và `/api/audit-logs` (nhật ký lưu vết tập trung mọi thao tác điểm danh + thu tiền). Điểm đặc biệt về kiến trúc: API chỉ là lớp HTTP mỏng, toàn bộ nghiệp vụ import thẳng từ 4 module member5 đã viết (attendanceModule, tuitionModule, exportModule, auditLogger) — nghiệp vụ sửa một chỗ thì API tự ăn theo, và unit test 41/41 chạy trên chính module đó. Dữ liệu demo dạng in-memory có seed sẵn (5 học sinh, 5 ngày điểm danh, học phí đầu năm) nên mở Postman test được ngay; restart server là dữ liệu về mặc định. Lỗi theo chuẩn REST: 400 khi dữ liệu sai, 404 khi không tìm thấy.

*(Bản demo chưa gắn JWT — middleware JWT/RBAC của member4 có sẵn trong dự án, nối vào sau khi hợp nhất backend chung.)*

## 🗓️ Đối chiếu với tiến độ chuyên đề & Design Pattern (Chuyên đề 4)

Tiến độ nhóm hiện tại: **Chuyên đề 4 – Design Pattern (Tuần 5)**. Các phần trong API demo này thuộc các chuyên đề **sắp tới và đúng phạm vi member5** theo `timeline.md` — tức là *chuẩn bị trước phần của mình*, không phải làm vượt phạm vi:

| Thành phần đã làm | Thuộc chuyên đề | Tuần | Người phụ trách theo timeline |
|---|---|---|---|
| `exportModule` (Excel/PDF) + endpoint `/api/export` | **Chuyên đề 5 – Export** | Tuần 6 | Huỳnh Trung Tính (member5) |
| `auditLogger` + endpoint `/api/audit-logs` | **Chuyên đề 7 – Logging** | Tuần 8 | member5 |
| 41 unit tests (`tests/unitTestingSuite.test.js`) | **Chuyên đề 8 – Testing** | Tuần 9 | Huỳnh Trung Tính & cả nhóm |
| `attendanceModule`, `tuitionModule` + API | Nghiệp vụ FC-05/FC-06 (SRS từ Tuần 1) | — | member5 |

Áp dụng đúng các **Pattern của Chuyên đề 4** đang học (theo `BrainStorm/Week5 Pattern .md`):

| Pattern / Nguyên lý | Nơi áp dụng trong API demo |
|---|---|
| **MVC** (Slim Controller) | `controllers/` chỉ nhận request → gọi service → trả response, không chứa nghiệp vụ |
| **Repository** | `attendanceModule`, `tuitionModule` che toàn bộ thao tác dữ liệu (in-memory store) — nghiệp vụ không biết dữ liệu nằm ở đâu; sau này thay store bằng PostgreSQL thì API không phải sửa |
| **Facade** | `exportModule` bọc `exportEngine.js` — 1 cửa vào duy nhất cho FC-07 |
| **DI (Dependency Injection)** | Service nhận phụ thuộc qua import module rõ ràng; dễ thay thế khi hợp nhất backend |
| **DIP** | Nghiệp vụ đứng độc lập, HTTP chỉ là chi tiết — đảo ngược được khi gắn vào backend khác |
| **Singleton** | Store in-memory là thể hiện duy nhất của module (module-level state) |
| Unit of Work | Chưa dùng — demo in-memory 1 thao tác/lần; UoW thật đã có trong backend nhóm (`members/member3_Backend_DB/.../utils/UnitOfWork.js`) |

---

## 1. Chạy API

```bash
# từ thư mục gốc repo
cd api-demo
npm install     # lần đầu chạy
npm start       # hoặc: npm run dev (tự reload khi sửa code)
```

Server chạy tại: **http://localhost:3000** (đổi cổng: `PORT=3005 npm start`)

Kiểm tra nhanh: mở trình duyệt → `http://localhost:3000/api/health`

Chạy unit test của nghiệp vụ (nếu muốn):

```bash
cd ../members/member5_Modules_QA
npm test        # 41/41 PASS
```

> **Lưu ý quan trọng**: dữ liệu lưu **in-memory** (không có CSDL). Mỗi lần restart server, dữ liệu quay về seed ban đầu và số biên lai đếm lại từ `BL-2026-0001`.

## 2. Dữ liệu mẫu (cần biết trước khi test trên Postman)

### 2.1. Học sinh

| Mã HS | Họ tên | Lớp | Phụ huynh | SĐT |
|---|---|---|---|---|
| HS001 | Nguyễn Thị Ánh | 10A1 | Nguyễn Thị Hương | 0901234567 |
| HS002 | Trần Văn Bảo | 10A1 | Trần Văn Hùng | 0907654321 |
| HS003 | Lê Thị Cẩm | 10A1 | Lê Văn Tâm | 0912345678 |
| HS004 | Phạm Hữu Dũng | 10A1 | Phạm Thị Lan | 0922334455 |
| HS005 | Đặng Thị Giang | 10A2 | Đặng Văn Nam | 0933445566 |

### 2.2. Lịch sử điểm danh seed (5 ngày, phục vụ thống kê/cảnh báo)

Lớp **10A1** có điểm danh sẵn các ngày `2026-10-05` → `2026-10-09`.
Điểm nhấn: **HS003 vắng KHÔNG PHÉP 2/5 buổi = 40% > ngưỡng 20%** → sẽ xuất hiện trong cảnh báo cấm thi.

### 2.3. Học phí seed (học kỳ HK1, năm học 2025-2026, hạn mức 5.000.000đ)

| HS | Đã trả | Còn nợ | Trạng thái |
|---|---|---|---|
| HS001 | 5.000.000 | 0 | PAID |
| HS002 | 3.000.000 | 2.000.000 | PARTIAL |
| HS003 | 0 | 5.000.000 | UNPAID |
| HS004 | 5.000.000 | 0 | PAID |
| HS005 | 0 | 5.000.000 | UNPAID |

## 3. Quy ước chung

- **Base URL**: `http://localhost:3000`
- **Header** khi gửi body: `Content-Type: application/json` (Postman: Body → raw → JSON)
- **Format response** luôn là:

```json
{ "success": true, "message": "...", "data": { ... } }
```

- **Mã lỗi HTTP**:

| Mã | Khi nào |
|---|---|
| 200 | Thành công |
| 201 | Tạo mới thành công (điểm danh, thông báo học phí) |
| 400 | Dữ liệu sai (trạng thái điểm danh lạ, tiền âm/trả dư, trùng thông báo...) |
| 404 | Không tồn tại (HS, lớp, endpoint) |
| 500 | Lỗi hệ thống |

## 4. Test trên Postman — từng endpoint

### 4.0. Health check

- **GET** `http://localhost:3000/api/health`
- Kết quả: danh sách 4 module member5 đang phục vụ.

### FC-05 — Điểm danh & Chuyên cần

#### 4.1. Xem điểm danh

- **GET** `http://localhost:3000/api/attendance?classId=10A1&date=2026-10-05`
- Query params (không bắt buộc, có thể kết hợp): `classId`, `date`, `studentCode`
- Ví dụ khác: chỉ xem 1 học sinh: `?studentCode=HS003`

#### 4.2. Lưu điểm danh cả lớp theo ngày ⭐ (endpoint chính FC-05)

- **POST** `http://localhost:3000/api/attendance`
- Body (raw JSON):

```json
{
  "classId": "10A1",
  "date": "2026-10-12",
  "records": [
    { "studentCode": "HS001", "status": "PRESENT" },
    { "studentCode": "HS002", "status": "PRESENT" },
    { "studentCode": "HS003", "status": "ABSENT_UNEXCUSED", "note": "Không phép" },
    { "studentCode": "HS004", "status": "LATE", "note": "Đi trễ 10 phút" }
  ]
}
```

- Response 201: tổng hợp số lượng từng trạng thái + danh sách `parentNotified` (HS vắng không phép được tự gửi thông báo tới phụ huynh).
- **Ghi đè**: điểm danh trùng lớp+ngày+học sinh sẽ cập nhật bản ghi cũ, không nhân đôi.

**4 trạng thái hợp lệ** (sai → 400):

| Trạng thái | Nghĩa |
|---|---|
| `PRESENT` | Có mặt |
| `ABSENT_EXCUSED` | Vắng có phép |
| `ABSENT_UNEXCUSED` | Vắng không phép (→ báo phụ huynh + tính cảnh báo cấm thi) |
| `LATE` | Đi trễ |

#### 4.3. Thống kê chuyên cần

- **GET** `http://localhost:3000/api/attendance/statistics?classId=10A1`
- Trả về từng học sinh: tổng buổi, số buổi từng trạng thái, `absenceRate` (vắng chung), `unexcusedRate` (vắng không phép).

#### 4.4. Cảnh báo cấm thi ⭐

- **GET** `http://localhost:3000/api/attendance/warnings?classId=10A1`
- **Quy tắc (SRS)**: học sinh vắng không phép **> 20% tổng số tiết** → cảnh báo nguy cơ cấm thi.
- Với seed: HS003 (40%) sẽ bị cảnh báo.
- Đổi ngưỡng: `?classId=10A1&threshold=0.5` (50%).

#### 4.5. Thông báo đã gửi phụ huynh

- **GET** `http://localhost:3000/api/attendance/parent-notifications?classId=10A1`

### FC-06 — Quản lý Học phí

#### 4.6. Xem học phí

- **GET** `http://localhost:3000/api/tuition?classId=10A1`
- Query params: `classId`, `studentCode`, `status` (`UNPAID` | `PARTIAL` | `PAID`)

#### 4.7. Tạo thông báo học phí

- **POST** `http://localhost:3000/api/tuition/notice`

```json
{ "studentCode": "HS003", "amountDue": 6000000 }
```

> **Lưu ý**: 5/5 học sinh đều đã có thông báo seed nên request này luôn trả **400 (trùng học kỳ)** — dùng để minh họa việc chặn dữ liệu trùng. Sau khi hợp nhất với backend thật (PostgreSQL), tạo mới sẽ trả 201 cho học sinh chưa có thông báo.

#### 4.8. Thanh toán học phí ⭐

- **POST** `http://localhost:3000/api/tuition/pay`

```json
{ "studentCode": "HS003", "amount": 2000000 }
```

- Lần 1 (trả 2tr/5tr): status `PARTIAL`, sinh biên lai `BL-2026-0001`
- Lần 2 (trả nốt 3tr): status `PAID`, sinh biên lai `BL-2026-0002`
- **Bị chặn 400**: trả khi đã đủ, trả quá số tiền còn nợ, số tiền ≤ 0, HS không tồn tại.

#### 4.9. Báo cáo công nợ

- **GET** `http://localhost:3000/api/tuition/debt?classId=10A1`
- Trả về chi tiết từng HS + `summary` (tổng phải thu / đã thu / còn nợ của lớp).

### FC-07 — Xuất báo cáo

#### 4.10. Xuất danh sách lớp ra Excel

- **GET** `http://localhost:3000/api/export/class-list/10A1`
- Trả về object file Excel mô phỏng: `fileName` + các dòng dữ liệu (Mã HS, Họ tên, Giới tính, Phụ huynh...).

#### 4.11. Xuất biên lai học phí ra PDF

- **GET** `http://localhost:3000/api/export/tuition-receipt/HS003`
- Trả về object biên lai mô phỏng: `receiptNo`, `title`, số tiền, trạng thái.
- **404** nếu HS chưa từng thanh toán (chưa có biên lai).

> File Excel/PDF hiện là **mô phỏng** (prototype) theo đúng `exportEngine.js` gốc của member5 — chưa render file nhị phân.

### Audit Logging — Nhật ký tập trung

#### 4.12. Xem nhật ký

- **GET** `http://localhost:3000/api/audit-logs`
- Query params: `action`, `actor`, `limit` (mặc định 50, mới nhất trước).
- Log tự sinh khi: lưu điểm danh (`ATTENDANCE_UPDATE`), tạo thông báo/thanh toán học phí (`TUITION_PAYMENT`). Module còn sẵn các action khác cho sổ điểm (`GRADE_UPDATE`, `GRADEBOOK_LOCK`...) khi hợp nhất backend.
- Ví dụ: `?action=TUITION_PAYMENT&limit=5`

**Điểm nhấn kiến trúc**: vì là 1 server duy nhất, nhật ký **tập trung cả FC-05 lẫn FC-06** tại một nơi — đúng mục tiêu "Centralized Audit Logging" của member5.

## 5. Kịch bản test gợi ý (chạy tuần tự trên Postman)

1. `GET /api/health` — server sống.
2. `GET /api/attendance/warnings?classId=10A1` — thấy HS003 bị cảnh báo (40% > 20%).
3. `POST /api/attendance` ngày 2026-10-12 với HS003 `ABSENT_UNEXCUSED` → 201, `parentNotified: ["HS003"]`.
4. `GET /api/attendance/statistics?classId=10A1` — HS003 giờ 6 buổi, 3 KPN = 50%.
5. `POST /api/tuition/pay` HS003 trả 2.000.000 → `PARTIAL`, biên lai `BL-2026-0001`.
6. `POST /api/tuition/pay` HS003 trả 3.000.000 → `PAID`, biên lai `BL-2026-0002`.
7. `POST /api/tuition/pay` HS003 trả thêm 1.000 → **400** (đã đủ).
8. `GET /api/export/class-list/10A1` — Excel 4 dòng.
9. `GET /api/export/tuition-receipt/HS003` — biên lai mới nhất.
10. `GET /api/audit-logs` — thấy đủ vết: điểm danh + thanh toán.
11. Test lỗi: POST trạng thái `"X"` → **400**; `GET /api/export/tuition-receipt/HS999` → **404**; `GET /api/xyz` → **404**.

> Restart server nếu muốn chạy lại kịch bản từ đầu (dữ liệu + số biên lai reset).

## 6. Cấu trúc mã nguồn

```
Phat-Trien-Du-An-Phan-Mem/
├── members/member5_Modules_QA/        # NGHIỆP VỤ (thuần logic, có 41 unit test)
│   ├── src/js/modules/
│   │   ├── attendanceModule.js        # FC-05
│   │   ├── tuitionModule.js           # FC-06
│   │   ├── exportModule.js            # FC-07 (facade của exportEngine.js)
│   │   ├── auditLogger.js             # audit log tập trung
│   │   └── schoolData.js              # roster học sinh dùng chung
│   └── tests/unitTestingSuite.test.js # npm test → 41/41 PASS
└── api-demo/                          # API demo (lớp HTTP mỏng) — thư mục này
    ├── server.js                      # 1 server duy nhất: mọi route + error handler
    ├── package.json                   # npm start (cổng 3000)
    └── src/
        ├── controllers/               # MVC Slim Controller
        │   ├── AttendanceController.js
        │   ├── TuitionController.js
        │   └── ExportController.js
        ├── services/                  # Lớp mỏng: import module member5 + seed + audit
        │   ├── AttendanceService.js   ← attendanceModule + auditLogger
        │   ├── TuitionService.js      ← tuitionModule + auditLogger
        │   ├── ExportService.js       ← exportModule (+ dữ liệu từ tuitionModule)
        │   └── AuditService.js        ← auditLogger
        └── data/seed.js               # Lịch sử điểm danh demo (5 ngày lớp 10A1)
```
