import { ValidationError } from "./Error.js";

const checkRequiredFields = (data, fields) => {
    for (const field of fields) {
        if (!data[field]) {
            throw new ValidationError(`${field} is required.`);
        }
    }
};

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateRegisterBody = (data) => {
    const { email, password, confirmPassword } = data;
    checkRequiredFields(data, ['firstName', 'lastName', 'email', 'password', 'confirmPassword']);
    if (!isValidEmail(email)) { 
        throw new ValidationError('Invalid email format.');
    }
    if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters long.');
    }
    if (password !== confirmPassword) {
        throw new ValidationError('Passwords do not match.');
    }
    return {email, name: data.name, lastName: data.lastName, password};
};

export const validateLoginBody = (data) => {
    const {email, password} = data;
    checkRequiredFields(data, ['email', 'password']);
    if (!isValidEmail(email)) {
        throw new ValidationError('Invalid email format.');
    }
    return {email, password}
}

export const validateTemplateData = (data) => {
    const {settings, questions, restrictions, tags} = data;
    checkRequiredFields(data, ['settings', 'questions']);
    return { settings, questions, restrictions: restrictions || [], tags: tags || [] };
}

export const isUUID = (str) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  };