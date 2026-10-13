/**
 * Audit Logging service: đọc nhật ký tập trung của member5 auditLogger
 */
import { getAuditLogs as moduleGetAuditLogs } from '../../../_read/Phat-Trien-Du-An-Phan-Mem-main/members/member5_Modules_QA/src/js/modules/auditLogger.js';

export function getAuditLogs(query) {
  return moduleGetAuditLogs({
    action: query.action,
    actor: query.actor,
    limit: query.limit !== undefined ? Number(query.limit) : undefined
  });
}
