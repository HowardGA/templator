import { createFilledForm } from "../data/formRepository.js";
import { validateFormData } from "../utils/validation.js";

export const createForm = async ({formData}) => {
    const {templateId, fillerUserId, answers} = validateFormData(formData);
    return await createFilledForm(templateId, fillerUserId, answers);
}