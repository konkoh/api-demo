import * as AttendanceService from '../services/AttendanceService.js';

export function getAttendance(req, res) {
  const records = AttendanceService.getAttendance(req.query);
  return res.json({ success: true, total: records.length, data: records });
}

export function saveAttendance(req, res) {
  const result = AttendanceService.saveDailyAttendance(req.body);
  return res.status(201).json({
    success: true,
    message: `Lưu điểm danh lớp ${result.className} ngày ${result.date} thành công (${result.saved} học sinh)`,
    data: result
  });
}

export function getStatistics(req, res) {
  const report = AttendanceService.getAbsenceStatistics(req.query);
  return res.json({ success: true, total: report.length, data: report });
}

export function getWarnings(req, res) {
  const warnings = AttendanceService.getExamBanWarnings(req.query);
  return res.json({
    success: true,
    total: warnings.length,
    message: warnings.length > 0 ? `Có ${warnings.length} học sinh nguy cơ cấm thi` : 'Không có học sinh nào vượt ngưỡng vắng học',
    data: warnings
  });
}

export function getParentNotifications(req, res) {
  const items = AttendanceService.getParentNotifications(req.query);
  return res.json({ success: true, total: items.length, data: items });
}
