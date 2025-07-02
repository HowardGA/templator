import prisma from '../prismaClient.js';

const answerBulking = (answers, formId) => {
  const formAnswers = [];
  const formAnswerOptions = [];
  for (const answer of answers) {
    const { questionId, questionType, value } = answer;
    if (value === undefined || value === null) continue;
    if (questionType === 'CHECKBOX') {
      for (const optionId of value) {
        formAnswerOptions.push({
          formId,
          questionId,
          optionId,
        });
      }
    } else {
      const answerRecord = {
        formId,
        questionId,
      };
      if (questionType === 'SINGLE_LINE_STRING') answerRecord.stringValue = value;
      else if (questionType === 'MULTI_LINE_TEXT') answerRecord.textValue = value;
      else if (questionType === 'NON_NEGATIVE_INTEGER') answerRecord.intValue = value;
      else if (questionType === 'BOOLEAN') answerRecord.checkbox = value;
      formAnswers.push(answerRecord);
    }
  }
  return { formAnswers, formAnswerOptions };
};

export const createFilledForm = async (templateId, fillerUserId, answers) => {
  return await prisma.$transaction(async (tx) => {
    const newForm = await tx.form.create({
      data: {
        templateId,
        fillerUserId,
      },
    });
    const { formAnswers, formAnswerOptions } = answerBulking(answers, newForm.id);
    if (formAnswers.length) {
      await tx.formAnswer.createMany({ data: formAnswers });
    }
    if (formAnswerOptions.length) {
      await tx.formAnswerOption.createMany({ data: formAnswerOptions });
    }
    return newForm;
  });
};
