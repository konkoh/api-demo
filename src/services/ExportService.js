/**
 * FC-07 service: xuất báo cáo qua member5 exportModule, dữ liệu lấy từ attendance/tuition module.
 */
import {
  exportClassListToExcel,
  exportLatestReceiptToPDF,
  exportGradeBookToExcel
} from '../../../_read/Phat-Trien-Du-An-Phan-Mem-main/members/member5_Modules_QA/src/js/modules/exportModule.js';
import { getTuitions } from '../../../_read/Phat-Trien-Du-An-Phan-Mem-main/members/member5_Modules_QA/src/js/modules/tuitionModule.js';

export function exportClassList(classId) {
  return exportClassListToExcel(classId);
}

export function exportGradeBook(classId, subjectName, gradeData) {
  return exportGradeBookToExcel(classId, subjectName, gradeData);
}

/** Biên lai học phí mới nhất của học sinh (dữ liệu từ FC-06) */
export function exportTuitionReceipt(studentCode) {
  const records = getTuitions({ studentCode });
  if (records.length === 0) {
    const err = new Error(`Không tìm thấy thông báo học phí của học sinh: ${studentCode}`);
    err.name = 'NotFoundError';
    throw err;
  }
  const receipt = exportLatestReceiptToPDF(records[0]);
  return { ...receipt, tuition: records[0] };
}
