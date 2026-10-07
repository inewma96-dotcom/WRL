CREATE TABLE "Pledge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "address" TEXT,
    "location" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "church" TEXT,
    "congregation" TEXT,
    "pledgeAmount" REAL NOT NULL,
    "paymentSchedule" TEXT NOT NULL,
    "scheduleDetails" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "signedName" TEXT NOT NULL,
    "pledgeDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
