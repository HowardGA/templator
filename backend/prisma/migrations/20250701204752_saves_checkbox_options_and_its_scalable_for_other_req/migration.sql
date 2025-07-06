/*
  Warnings:

  - You are about to drop the column `display_checkbox1_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_checkbox2_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_checkbox3_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_checkbox4_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_int1_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_int2_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_int3_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_int4_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_string1_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_string2_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_string3_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_string4_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_text1_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_text2_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_text3_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `display_text4_in_results` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the `forms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "forms" DROP CONSTRAINT "forms_filler_user_id_fkey";

-- DropForeignKey
ALTER TABLE "forms" DROP CONSTRAINT "forms_template_id_fkey";

-- AlterTable
ALTER TABLE "template_questions" ADD COLUMN     "showInResults" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "templates" DROP COLUMN "display_checkbox1_in_results",
DROP COLUMN "display_checkbox2_in_results",
DROP COLUMN "display_checkbox3_in_results",
DROP COLUMN "display_checkbox4_in_results",
DROP COLUMN "display_int1_in_results",
DROP COLUMN "display_int2_in_results",
DROP COLUMN "display_int3_in_results",
DROP COLUMN "display_int4_in_results",
DROP COLUMN "display_string1_in_results",
DROP COLUMN "display_string2_in_results",
DROP COLUMN "display_string3_in_results",
DROP COLUMN "display_string4_in_results",
DROP COLUMN "display_text1_in_results",
DROP COLUMN "display_text2_in_results",
DROP COLUMN "display_text3_in_results",
DROP COLUMN "display_text4_in_results";

-- DropTable
DROP TABLE "forms";

-- CreateTable
CREATE TABLE "question_options" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionText" VARCHAR(100) NOT NULL,

    CONSTRAINT "question_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_answer_options" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "filler_user_id" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormAnswer" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "stringValue" VARCHAR(500),
    "textValue" TEXT,
    "intValue" INTEGER,
    "checkbox" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "form_answer_options_formId_questionId_optionId_key" ON "form_answer_options"("formId", "questionId", "optionId");

-- AddForeignKey
ALTER TABLE "question_options" ADD CONSTRAINT "question_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "template_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_answer_options" ADD CONSTRAINT "form_answer_options_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_answer_options" ADD CONSTRAINT "form_answer_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "template_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_answer_options" ADD CONSTRAINT "form_answer_options_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "question_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_filler_user_id_fkey" FOREIGN KEY ("filler_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormAnswer" ADD CONSTRAINT "FormAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "template_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
