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