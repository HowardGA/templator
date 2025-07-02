export function validateTemplateData({ formData, user }) {
  const { title, description, topicId, accessType } = formData.settings || {};
  if (!user) {
    return { valid: false, message: 'No user loaded' };
  }
  if (!title?.trim()) {
    return { valid: false, message: 'Template title is required' };
  }
  if (!description?.trim()) {
    return { valid: false, message: 'Template description is required' };
  }
  if (!topicId) {
    return { valid: false, message: 'Topic must be selected' };
  }
  if (!accessType) {
    return { valid: false, message: 'Access type must be selected' };
  }
  if (!formData.questions || formData.questions.length === 0) {
    return { valid: false, message: 'At least one question is required' };
  }
  return { valid: true };
}

export const validateQuestions = (questions) => {
  for (const q of questions) {
    if (!q.title?.trim()) return { valid: false, message: "Titles are required." };
    if (!q.questionType) return { valid: false, message: "All questions must have a type." };

    if (q.questionType === "CHECKBOX") {
      if (!q.options || q.options.length === 0) {
        return { valid: false, message: "Checkbox questions must have at least one option." };
      }
      const hasEmptyLabel = q.options.some(opt => !opt.label?.trim());
      if (hasEmptyLabel) {
        return { valid: false, message: "All checkbox options must have labels." };
      }
    }
  }

  return { valid: true };
};
