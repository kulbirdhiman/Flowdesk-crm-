CREATE TABLE "CrmRecord" (
  "resource" TEXT NOT NULL,
  "id" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  CONSTRAINT "CrmRecord_pkey" PRIMARY KEY ("resource", "id")
);
CREATE TABLE "CrmFile" (
  "id" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "bucket" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "content" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CrmFile_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CrmFile_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CrmFile_bucket_path_key" ON "CrmFile"("bucket", "path");
CREATE INDEX "CrmFile_ownerId_idx" ON "CrmFile"("ownerId");
