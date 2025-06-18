import bcrypt from "bcryptjs";

const HASH_SALT_ROUNDS = 10

export const hashPassword = async (password) => {
    return bcrypt.hash(password, HASH_SALT_ROUNDS);
};

export const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};