/**
 * Dữ liệu demo FC-05 (logic nằm ở member5 attendanceModule - API chỉ nạp dữ liệu mẫu)
 * HS003 vắng không phép 2/5 buổi (40%) để demo cảnh báo cấm thi (SRS: KPN > 20%)
 */
export const ATTENDANCE_HISTORY = [
  {
    classId: '10A1', date: '2026-10-05',
    records: [
      { studentCode: 'HS001', status: 'PRESENT' },
      { studentCode: 'HS002', status: 'PRESENT' },
      { studentCode: 'HS003', status: 'ABSENT_UNEXCUSED' },
      { studentCode: 'HS004', status: 'LATE', note: 'Đi trễ 10 phút' }
    ]
  },
  {
    classId: '10A1', date: '2026-10-06',
    records: [
      { studentCode: 'HS001', status: 'PRESENT' },
      { studentCode: 'HS002', status: 'LATE' },
      { studentCode: 'HS003', status: 'ABSENT_UNEXCUSED', note: 'Không phép' },
      { studentCode: 'HS004', status: 'PRESENT' }
    ]
  },
  {
    classId: '10A1', date: '2026-10-07',
    records: [
      { studentCode: 'HS001', status: 'PRESENT' },
      { studentCode: 'HS002', status: 'PRESENT' },
      { studentCode: 'HS003', status: 'ABSENT_EXCUSED', note: 'Có đơn xin nghỉ' },
      { studentCode: 'HS004', status: 'PRESENT' }
    ]
  },
  {
    classId: '10A1', date: '2026-10-08',
    records: [
      { studentCode: 'HS001', status: 'PRESENT' },
      { studentCode: 'HS002', status: 'PRESENT' },
      { studentCode: 'HS003', status: 'PRESENT' },
      { studentCode: 'HS004', status: 'PRESENT' }
    ]
  },
  {
    classId: '10A1', date: '2026-10-09',
    records: [
      { studentCode: 'HS001', status: 'LATE' },
      { studentCode: 'HS002', status: 'PRESENT' },
      { studentCode: 'HS003', status: 'PRESENT' },
      { studentCode: 'HS004', status: 'PRESENT' }
    ]
  },
  {
    classId: '10A2', date: '2026-10-09',
    records: [
      { studentCode: 'HS005', status: 'PRESENT' }
    ]
  }
];
