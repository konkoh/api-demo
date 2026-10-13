import * as TuitionService from '../services/TuitionService.js';

export function getTuitions(req, res) {
  const items = TuitionService.getTuitions(req.query);
  return res.json({ success: true, total: items.length, data: items });
}

export function createNotice(req, res) {
  const notice = TuitionService.createTuitionNotice(req.body);
  return res.status(201).json({
    success: true,
    message: `Đã tạo thông báo học phí ${notice.semester} năm học ${notice.schoolYear} cho học sinh ${notice.studentName}`,
    data: notice
  });
}

export function pay(req, res) {
  const result = TuitionService.payTuition(req.body);
  return res.json({
    success: true,
    message: `Thanh toán thành công - ${result.statusLabel}. Số biên lai: ${result.receiptNo}`,
    data: result
  });
}

export function getDebtReport(req, res) {
  const report = TuitionService.getDebtReport(req.query);
  return res.json({
    success: true,
    message: `Tổng còn nợ: ${report.summary.totalOutstanding.toLocaleString('vi-VN')} VND`,
    data: report
  });
}
