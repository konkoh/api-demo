/**
 * FC-05 service: nghiệp vụ nằm ở member5 attendanceModule, API chỉ map classId (spec) -> className (module).
 */
import {
  saveDailyAttendance as moduleSaveDailyAttendance,
  getAttendance as moduleGetAttendance,
  getAbsenceStatistics as moduleGetAbsenceStatistics,
  getExamBanWarnings as moduleGetExamBanWarnings,
  getParentNotifications as moduleGetParentNotifications
} from '../../../members/member5_Modules_QA/src/js/modules/attendanceModule.js';
import { logAction, AUDIT_ACTIONS } from '../../../members/member5_Modules_QA/src/js/modules/auditLogger.js';
import { ATTENDANCE_HISTORY } from '../data/seed.js';

export function saveDailyAttendance(body) {
  const result = moduleSaveDailyAttendance({ className: body.classId, date: body.date, records: body.records });

  logAction({
    action: AUDIT_ACTIONS.ATTENDANCE_UPDATE,
    actor: 'gvcn_demo',
    target: `attendance:${result.className}:${result.date}`,
    detail: `Lưu ${result.saved} bản ghi điểm danh (KPN: ${result.counts.ABSENT_UNEXCUSED})`
  });

  return result;
}

export function getAttendance(query) {
  return moduleGetAttendance({ className: query.classId, date: query.date, studentCode: query.studentCode });
}

export function getAbsenceStatistics(query) {
  return moduleGetAbsenceStatistics({ className: query.classId });
}

export function getExamBanWarnings(query) {
  const threshold = query.threshold !== undefined ? Number(query.threshold) : undefined;
  return moduleGetExamBanWarnings({ className: query.classId, threshold });
}

export function getParentNotifications(query) {
  return moduleGetParentNotifications({ className: query.classId, studentCode: query.studentCode });
}

// Seed lịch sử điểm danh demo khi khởi động
for (const session of ATTENDANCE_HISTORY) {
  moduleSaveDailyAttendance({ className: session.classId, date: session.date, records: session.records });
}
