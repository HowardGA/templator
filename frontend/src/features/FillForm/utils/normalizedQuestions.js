export const normalizeFormAnswers = (answers = [], answerOptions = []) => {
    const initialAnswers = [];
    for (const ans of answers) {
        initialAnswers.push({
            questionId: ans.question.id,
            questionType: ans.question.questionType,
            stringValue: ans.stringValue,
            textValue: ans.textValue,
            intValue: ans.intValue,
            checkbox: ans.checkbox,
        });
    }
    const checkboxMap = {};
    for (const ao of answerOptions) {
        const qId = ao.question.id;
        if (!checkboxMap[qId]) checkboxMap[qId] = [];
        checkboxMap[qId].push(ao.selectedOption.id);
    }
    for (const [questionId, optionIds] of Object.entries(checkboxMap)) {
        initialAnswers.push({
            questionId,
            questionType: "CHECKBOX",
            optionIds,
        });
    }
    return initialAnswers;
};
