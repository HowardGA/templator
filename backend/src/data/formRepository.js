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

export const myForms = async (userId, { take = 10, skip = 0 } = {}) => {
  const [forms, totalCount] = await Promise.all([
    prisma.form.findMany({
      where: {
        fillerUserId: userId,
      },
      orderBy: {
        submittedAt: 'desc',
      },
      take,
      skip,
      select: {
        id: true,
        submittedAt: true,
        updatedAt: true,
        version: true,
        template: {
          select: {
            id: true,
            title: true,
            topic: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            answers: true,
            answerOptions: true,
          },
        },
      },
    }),
    prisma.form.count({
      where: {
        fillerUserId: userId,
      },
    }),
  ]);
  return {
    data: forms,
    pagination: {
      total: totalCount,
      hasMore: skip + take < totalCount,
      nextPage: skip + take < totalCount ? Math.floor(skip / take) + 2 : null,
    },
  };
};

export const singleForm = (formId) => {
  return prisma.form.findFirst({
    where: {
      id: formId,
    },
    include: {
      filler: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      template: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
      answers: {
        include: {
          question: {
            select: {
              id: true,
              title: true,
              questionType: true,
            },
          },
        },
      },
      answerOptions: {
        include: {
          question: {
            select: {
              id: true,
              title: true,
            },
          },
          selectedOption: {
            select: {
              id: true,
              optionText: true,
            },
          },
        },
      },
    },
  });
};
