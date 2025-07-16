import _ from 'lodash';
const { countBy } = _;
import prisma from '../prismaClient.js';

const aggregateNumberTypeAnswers = (formAnswers) => {
  const aggregatedResults = [];
  const nums = formAnswers.map(v => v.intValue).filter(v => typeof v === 'number' && v !== null);

  if (nums.length > 0) {
    const sum = nums.reduce((a, b) => a + b, 0);
    aggregatedResults.push(
      { type: 'average', valueNumber: sum / nums.length },
      { type: 'min', valueNumber: Math.min(...nums) },
      { type: 'max', valueNumber: Math.max(...nums) }
    );
  }
  return aggregatedResults;
};

const aggregateTextTypeAnswers = (formAnswers) => {
  const aggregatedResults = [];
  const textValues = formAnswers.map(v => v.textValue || v.stringValue).filter(Boolean); 

  if (textValues.length > 0) {
    const freqMap = countBy(textValues);
    const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);

    aggregatedResults.push(
      ...sorted.slice(0, 3).map(([text]) => ({
        type: 'most_common',
        valueText: text,
      }))
    );
  }
  return aggregatedResults;
};

const aggregateCheckboxTypeAnswers = (formAnswers) => {
  const aggregatedResults = [];
  let checkedCount = 0;
  let uncheckedCount = 0;

  formAnswers.forEach(v => {
    if (v.checkbox === true) {
      checkedCount++;
    } else if (v.checkbox === false) {
      uncheckedCount++;
    }
  });

  const totalAnswers = checkedCount + uncheckedCount;
  if (totalAnswers > 0) {
    aggregatedResults.push(
      { type: 'checked_count', valueNumber: checkedCount },
      { type: 'unchecked_count', valueNumber: uncheckedCount },
      { type: 'checked_percentage', valueNumber: (checkedCount / totalAnswers) * 100 }
    );
  }
  return aggregatedResults;
};


export const getTemplatesForOdooUser = async (userId) => {
  const templates = await prisma.template.findMany({
    where: { creatorId: userId },
    include: {
      creator: { select: { email: true } },
      questions: {
        include: {
          formAnswers: true,
        },
      },
    },
  });

  return templates.map(template => ({
    id: template.id,
    title: template.title,
    creator: { email: template.creator.email },
    questions: template.questions.map(q => {
      const formAnswers = q.formAnswers;
      let aggregatedResults = [];

      switch (q.questionType) {
        case 'number':
        case 'NON_NEGATIVE_INTEGER':
          aggregatedResults = aggregateNumberTypeAnswers(formAnswers);
          break;
        case 'text':
        case 'SINGLE_LINE_STRING':
        case 'MULTI_LINE_TEXT':
          aggregatedResults = aggregateTextTypeAnswers(formAnswers);
          break;
        case 'CHECKBOX':
          aggregatedResults = aggregateCheckboxTypeAnswers(formAnswers);
          break;
        default:
          break;
      }

      return {
        title: q.title,
        questionType: q.questionType,
        numAnswers: formAnswers.length, 
        aggregatedResults,
      };
    }),
  }));
};