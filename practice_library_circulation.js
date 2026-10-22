"use strict";

const circulationLogs = [
  {
    logId: "LOG001",
    studentCode: "B25DTCN192",
    bookIsbn: "978-604-01-1234-1",
    status: "BORROWING",
    borrowDate: "2026-09-10",
    dueDate: "2026-09-24",
    returnDate: null,
    overdueDays: 0,
    fineAmount: 0,
    isSettled: false,
  },
  {
    logId: "LOG002",
    studentCode: "B25DTCN045",
    bookIsbn: "978-604-01-5678-9",
    status: "RETURNED",
    borrowDate: "2026-08-01",
    dueDate: "2026-08-15",
    returnDate: "2026-08-15",
    overdueDays: 0,
    fineAmount: 0,
    isSettled: true,
  },
  {
    logId: "LOG003",
    studentCode: "B25DTCN310",
    bookIsbn: "978-604-01-9999-0",
    status: "BORROWING",
    borrowDate: "2026-10-01",
    dueDate: "2026-10-15",
    returnDate: null,
    overdueDays: 0,
    fineAmount: 0,
    isSettled: false,
  },
];

const newLoan = {
  logId: "LOG004",
  studentCode: "B25DTCN101",
  bookIsbn: "978-604-02-8888-2",
  status: "BORROWING",
  borrowDate: "2026-10-22",
  dueDate: "2026-11-05",
  returnDate: null,
  overdueDays: 0,
  fineAmount: 0,
  isSettled: false,
};
circulationLogs.push(newLoan);

const processReturn = (logId, isLost, actualReturnDate) => {
  const transaction = circulationLogs.find((item) => item.logId === logId);
  if (!transaction || transaction.status !== "BORROWING") {
    return;
  }

  transaction.returnDate = actualReturnDate;

  if (isLost) {
    transaction.status = "LOST";
    transaction.fineAmount = 200000;
  } else {
    transaction.status = "RETURNED";
    const dueTime = new Date(transaction.dueDate).getTime();
    const returnTime = new Date(actualReturnDate).getTime();
    const diffDays = Math.ceil((returnTime - dueTime) / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      transaction.overdueDays = diffDays;
      transaction.fineAmount = diffDays * 5000;
    } else {
      transaction.overdueDays = 0;
      transaction.fineAmount = 0;
    }
  }

  transaction.isSettled = true;
};

processReturn("LOG001", false, "2026-09-28");
processReturn("LOG003", true, "2026-10-22");

const targetDate = new Date("2026-10-22");
for (let i = circulationLogs.length - 1; i >= 0; i--) {
  const record = circulationLogs[i];
  if (record.status === "RETURNED" && record.isSettled && record.returnDate) {
    const returnTime = new Date(record.returnDate).getTime();
    const daysSinceReturn =
      (targetDate.getTime() - returnTime) / (1000 * 60 * 60 * 24);
    if (daysSinceReturn > 30) {
      circulationLogs.splice(i, 1);
    }
  }
}

let activeBorrowCount = 0;
let totalFinesCollected = 0;
let lostBookCount = 0;
let returnedCount = 0;

for (const log of circulationLogs) {
  if (log.status === "BORROWING") {
    activeBorrowCount++;
  } else if (log.status === "RETURNED") {
    returnedCount++;
  } else if (log.status === "LOST") {
    lostBookCount++;
  }
  totalFinesCollected += log.fineAmount;
}

console.log(
  "========================================================================================================",
);
console.log(
  "|                             BÁO CÁO NHẬT KÝ LƯU CHUYỂN & MƯỢN TRẢ ẤN BẢN                              |",
);
console.log(
  "========================================================================================================",
);
console.log(
  "| Mã GD  | Mã Sinh Viên | Mã ISBN           | Trạng Thái  | Quá Hạn | Tiền Phạt (VND) | Quyết Toán   |",
);
console.log(
  "--------------------------------------------------------------------------------------------------------",
);

for (const log of circulationLogs) {
  const id = log.logId.padEnd(6, " ");
  const student = log.studentCode.padEnd(12, " ");
  const isbn = log.bookIsbn.padEnd(17, " ");
  const status = log.status.padEnd(11, " ");
  const overdue = (log.overdueDays + " ngày").padStart(7, " ");
  const fine = log.fineAmount.toLocaleString("vi-VN").padStart(15, " ");
  const settled = (log.isSettled ? "Đã xong" : "Chưa").padEnd(12, " ");

  console.log(
    `| ${id} | ${student} | ${isbn} | ${status} | ${overdue} | ${fine} | ${settled} |`,
  );
}

console.log(
  "--------------------------------------------------------------------------------------------------------",
);
console.log(`Số giao dịch đang mượn (BORROWING) : ${activeBorrowCount}`);
console.log(`Số ấn bản đã trả (RETURNED)        : ${returnedCount}`);
console.log(`Số ấn bản làm mất (LOST)           : ${lostBookCount}`);
console.log(
  `Tổng tiền phạt thu được            : ${totalFinesCollected.toLocaleString("vi-VN")} VND`,
);
console.log(
  "========================================================================================================",
);
