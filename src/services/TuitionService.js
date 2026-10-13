/**
 * FC-06 service: nghiệp vụ nằm ở member5 tuitionModule; biên lai qua exportModule (FC-07);
 * mọi thao tác ghi về auditLogger tập trung.
 */
import {
  createTuitionNotice as moduleCreateTuitionNotice,
  getTuitions as moduleGetTuitions,
  payTuition as modulePayTuition,
  getDebtReport as moduleGetDebtReport
} from '../../../members/member5_Modules_QA/src/js/modules/tuitionModule.js';
import { logAction, AUDIT_ACTIONS } from '../../../members/member5_Modules_QA/src/js/modules/auditLogger.js';

export function createTuitionNotice(body) {
  const notice = moduleCreateTuitionNotice(body);
  logAction({
    action: AUDIT_ACTIONS.TUITION_PAYMENT,
    actor: 'ke_toan_demo',
    target: `tuition:${notice.studentCode}`,
    detail: `Tạo thông báo học phí ${notice.semester} ${notice.schoolYear}: ${notice.amountDue.toLocaleString('vi-VN')} VND`
  });
  return notice;
}

export function getTuitions(query) {
  return moduleGetTuitions(query);
}

export function payTuition(body) {
  const result = modulePayTuition(body.studentCode, body.amount);
  logAction({
    action: AUDIT_ACTIONS.TUITION_PAYMENT,
    actor: 'ke_toan_demo',
    target: `tuition:${result.studentCode}`,
    detail: `Thanh toán ${body.amount.toLocaleString('vi-VN')} VND, biên lai ${result.receiptNo}`,
    after: { status: result.status, receiptNo: result.receiptNo }
  });
  return result;
}

export function getDebtReport(query) {
  return moduleGetDebtReport(query);
}
