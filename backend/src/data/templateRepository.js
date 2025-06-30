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

export const getNewestTemplates = async ({ take, skip = 0 }) => {
    const [templates, totalCount] = await Promise.all([
        prisma.template.findMany({
            where: { accessType: 'PUBLIC' },
            orderBy: { createdAt: 'desc' },
            take,
            skip,
           select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        topic: {
          select: {
            id: true,
            name: true
          }
        },
        tags: {
          select: {
            tag: true
          },
          take: 3
        },
        _count: {
          select: {
            forms: true
          }
        }
      }
    }),
    prisma.template.count({ where: { accessType: 'PUBLIC' } })
  ]);

  return {
    data: templates,
    pagination: {
      total: totalCount,
      hasMore: skip + take < totalCount,
      nextPage: skip + take < totalCount ? Math.floor(skip / take) + 2 : null
    }
  };
};