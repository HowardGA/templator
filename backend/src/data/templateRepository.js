import prisma from '../prismaClient.js';
import { isUUID } from '../utils/validation.js';

export const createTemplateQuestions = async (questions, templateId) => {
    if (!questions.length) return;
    return await prisma.templateQuestion.createMany({
        data: questions.map(q => ({
            templateId,
            questionIndex: q.questionIndex,
            questionType: q.questionType,
            title: q.title,
            description: q.description
        }))
    });
};

export const createTemplateRestrictions = async (users, templateId, creatorId) => {
    if (!users.length) return;

    return await prisma.templateRestriction.createMany({
        data: users.map(userId => ({
            templateId,
            userId,
            assignedById: creatorId
        }))
    });
};

export const createTemplate = async (templateData) => {
    return await prisma.template.create({
        data: {
            creatorId: templateData.creatorId,
            title: templateData.title,
            description: templateData.description,
            topicId: templateData.topicId,
            imageUrl: templateData.imageUrl,
            accessType: templateData.accessType,
            displayString1InResults: templateData.displayString1InResults,
        }
    });
};

export const createTemplateTags = async (tagInputs, templateId) => {
    if (!tagInputs.length) return;
    const tags = await Promise.all(
        tagInputs.map(async (input) => {
            if (typeof (isUUID(input))) {
                return { id: input };
            }
            if (typeof input === 'string') {
                const name = input.trim();
                if (!name) throw new Error('Invalid tag name');
                return await prisma.tag.upsert({
                    where: {
                        name: {
                            equals: name,
                            mode: 'insensitive'
                        }
                    },
                    create: { name },
                    update: {},
                    select: { id: true }
                });
            }
        })
    );
    return await prisma.templateTag.createMany({
        data: tags.map(tag => ({
            templateId,
            tagId: tag.id
        })),
        skipDuplicates: true
    });
};