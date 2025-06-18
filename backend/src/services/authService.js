import { findUserByEmail, createUser } from "../data/userRepository.js";
import { validateRegisterBody, validateLoginBody } from "../utils/validation.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { ConflictError } from "../utils/Error.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

const tokenPayloadObj = (userId, email, role) => {
    return {
        userId,
        email,
        role,
    };
}

export const registerUser = async (userData) => { 
    const {email, firstName, lastName, password}= validateRegisterBody(userData); 
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new ConflictError(`User with email ${email} already exists.`);
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({firstName: firstName, lastName: lastName, email: email, passwordHash: hashedPassword});
    const tokenPayload = tokenPayloadObj(newUser.id, newUser.email, newUser.role);
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const { passwordHash, ...userWithoutHash } = newUser;
    return { user: userWithoutHash, accessToken, refreshToken };
};

export const loginUser = async (credentials) => {
    const {email, password} = validateLoginBody(credentials);
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password.');
    }
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password.');
    }
    const tokenPayload = tokenPayloadObj(user.id, user.email, user.role);
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    const { passwordHash, ...userWithoutHash } = user;
    return { user: userWithoutHash, accessToken, refreshToken};
}


