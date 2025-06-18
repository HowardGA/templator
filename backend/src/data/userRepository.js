import prisma from "../prismaClient.js";

export const findUserByEmail = async (email) => { 
    return prisma.user.findUnique({
        where: { email },
    });
};

export const createUser = async (userData) => { 
    return prisma.user.create({
        data: userData,
        select: { 
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isBlocked: true,
            preferredLanguage: true,
            preferredTheme: true,
            version: true,
            createdAt: true,
            updatedAt: true,
        }
    });
};
