import * as ExportService from '../services/ExportService.js';

export function exportClassList(req, res) {
  const result = ExportService.exportClassList(req.params.classId);
  return res.json({
    success: true,
    message: `Đã xuất danh sách học sinh: ${result.fileName}`,
    data: result
  });
}

export function exportTuitionReceipt(req, res) {
  const receipt = ExportService.exportTuitionReceipt(req.params.studentCode);
  return res.json({
    success: true,
    message: `Biên lai ${receipt.receiptNo} - ${receipt.title}`,
    data: receipt
  });
}
