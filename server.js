/**
 * Member 5 API - 1 server duy nhất phục vụ toàn bộ phạm vi member5:
 *   FC-05 Điểm danh & Chuyên cần  -> /api/attendance*
 *   FC-06 Quản lý Học phí         -> /api/tuition*
 *   FC-07 Xuất báo cáo            -> /api/export*
 *   Audit Logging                 -> /api/audit-logs
 * Nghiệp vụ import trực tiếp từ modules của member5 (nguồn duy nhất).
 */
import express from 'express';
import cors from 'cors';
import * as AttendanceController from './src/controllers/AttendanceController.js';
import * as TuitionController from './src/controllers/TuitionController.js';
import * as ExportController from './src/controllers/ExportController.js';
import { getAuditLogs } from './src/services/AuditService.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Member 5 API đang chạy (FC-05 + FC-06 + FC-07 + Audit Log)',
    modules: ['attendanceModule', 'tuitionModule', 'exportModule', 'auditLogger'],
    timestamp: new Date().toISOString()
  });
});

// ---------- FC-05: Điểm danh & Chuyên cần ----------
app.get('/api/attendance', AttendanceController.getAttendance);
app.post('/api/attendance', AttendanceController.saveAttendance);
app.get('/api/attendance/statistics', AttendanceController.getStatistics);
app.get('/api/attendance/warnings', AttendanceController.getWarnings);
app.get('/api/attendance/parent-notifications', AttendanceController.getParentNotifications);

// ---------- FC-06: Quản lý Học phí ----------
app.get('/api/tuition', TuitionController.getTuitions);
app.post('/api/tuition/notice', TuitionController.createNotice);
app.post('/api/tuition/pay', TuitionController.pay);
app.get('/api/tuition/debt', TuitionController.getDebtReport);

// ---------- FC-07: Xuất báo cáo ----------
app.get('/api/export/class-list/:classId', ExportController.exportClassList);
app.get('/api/export/tuition-receipt/:studentCode', ExportController.exportTuitionReceipt);

// ---------- Audit Logging (tập trung) ----------
app.get('/api/audit-logs', (req, res) => {
  const logs = getAuditLogs(req.query);
  res.json({ success: true, total: logs.length, data: logs });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  const status = err.name === 'ValidationError' ? 400 : err.name === 'NotFoundError' ? 404 : 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Lỗi hệ thống, vui lòng thử lại sau' : err.message
  });
});

app.listen(PORT, () => {
  console.log('================================================');
  console.log('  MEMBER 5 API DEMO (FC-05 + FC-06 + FC-07 + AUDIT)');
  console.log('  Nghiệp vụ: _read/Phat-Trien-Du-An-Phan-Mem-main/');
  console.log('             members/member5_Modules_QA/src/js/modules/');
  console.log(`  Server: http://localhost:${PORT}`);
  console.log('================================================');
});
