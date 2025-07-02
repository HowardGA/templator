import { 
    createTemplate, 
    createTemplateQuestions, 
    createTemplateRestrictions,
    createTemplateTags,
    getNewestTemplates,
    getSingleTemplate,
    giveLikeToTemplate,
    createCommentTemplate,
    getLikesFromTemplate, getCommentsFromTemplate,
    checkUserLike, removeLikeFromTemplate, createCheckboxQuestions,
    createQuestionOptions
} from "../data/templateRepository.js";
import { validateTemplateData, validateComment } from "../utils/validation.js";
import { sendSuccessResponse } from "../utils/response.js";

export const createFullTemplate = async (templateData) => {
    const { settings, questions, restrictions, tags } = validateTemplateData(templateData);
    const newTemplate = await createTemplate(settings);  
    await Promise.all([
        handleTemplateQuestions(questions, newTemplate.id),
        createTemplateRestrictions(restrictions, newTemplate.id, newTemplate.creatorId),
        createTemplateTags(tags, newTemplate.id)
    ]);
    
    return { newTemplate };
};

export const lastestTemplates = async () => {
    return await getNewestTemplates(10)
};

export const singleTemplate = async (id, currentUserId) => {
    return await getSingleTemplate(id, currentUserId);
}

export const giveLike = async (tempalteId, currentUserId, res) => {
    const alreadyLiked = await checkUserLike(tempalteId, currentUserId);
    if (alreadyLiked) {
        return sendSuccessResponse(res, 200, 'User already liked this template');
    }
    return await giveLikeToTemplate(tempalteId, currentUserId);
}

export const createComment = async (tempalteId, currentUserId, comment) => {
    const validatedComment = await validateComment(comment);
    return await createCommentTemplate(tempalteId, currentUserId, validatedComment.trim());
}

export const getLikes = async (templateId) => {
    return await getLikesFromTemplate(templateId);
};

export const getComments = async (templateId, page, limit) => {
    return await getCommentsFromTemplate(templateId, page, limit);
};

export const removeLike = async (templateId, currentUserId) => {
    return await removeLikeFromTemplate(templateId, currentUserId);
}

export const handleTemplateQuestions = async (questions, templateId) => {
  const checkboxQuestions = questions.filter(q => q.questionType === 'CHECKBOX');
  const normalQuestions = questions.filter(q => q.questionType !== 'CHECKBOX');
  if (normalQuestions.length) {
    await createTemplateQuestions(normalQuestions, templateId);
  }
  for (const q of checkboxQuestions) {
    const newCheckbox = await createCheckboxQuestions(q, templateId)
    await createQuestionOptions(newCheckbox.id, q.options);
  }
};
