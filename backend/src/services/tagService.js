import { createTag, existingTag } from "../data/tagRepository.js";
import { ValidationError } from "../utils/Error.js";

export const createTagService = async(tag) => {
    const {name} = tag;
    if (!name)
        throw new ValidationError('Name needed to create tag.');
    const doesTagExist = await existingTag(name);
    if (doesTagExist) 
        throw new ConflictError('Tag already exists.');
    return await createTag(name.trim());
};