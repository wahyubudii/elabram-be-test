-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255),
    "password" VARCHAR(255),
    "fullname" VARCHAR(255),
    "token" VARCHAR(255),
    "created_at" TIMESTAMP(3) DEFAULT timezone('Asia/Jakarta', now()),
    "updated_at" TIMESTAMP(3) DEFAULT timezone('Asia/Jakarta', now()),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" SERIAL NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "created_by" INTEGER NOT NULL,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT timezone('Asia/Jakarta', now()),

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
