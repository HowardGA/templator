import { 
    createTemplate, 
    createTemplateQuestions, 
    createTemplateRestrictions,
    createTemplateTags,
    getNewestTemplates
} from "../data/templateRepository.js";
import { validateTemplateData } from "../utils/validation.js";

export const createFullTemplate = async (templateData) => {
    const { settings, questions, restrictions, tags } = validateTemplateData(templateData);
    const newTemplate = await createTemplate(settings);  
    await Promise.all([
        createTemplateQuestions(questions, newTemplate.id),
        createTemplateRestrictions(restrictions, newTemplate.id, newTemplate.creatorId),
        createTemplateTags(tags, newTemplate.id)
    ]);
    
    return { newTemplate };
};

export const lastestTemplates = async () => {
    return await getNewestTemplates(10)
};