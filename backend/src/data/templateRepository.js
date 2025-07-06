import prisma from '../prismaClient.js';

export const createTemplateQuestions = async (questions, templateId) => {
  if (!questions.length) return;
  return await prisma.templateQuestion.createMany({
    data: questions.map(q => ({
      templateId,
      questionIndex: q.questionIndex,
      questionType: q.questionType,
      title: q.title,
      description: q.description,
      required: q.required
    }))
  });
};

export const createCheckboxQuestions = async (q, templateId) => {
  return await prisma.templateQuestion.create({
    data: {
      templateId,
      questionIndex: q.questionIndex,
      questionType: q.questionType,
      title: q.title,
      description: q.description,
      required: q.required,
    },
  });
}

export const createQuestionOptions = async (questionId, options) => {
  const cleanedOptions = options
    .map((opt, index) => ({
      questionId,
      optionText: opt.optionText?.trim(),
    }))
    .filter(opt => opt.optionText);
  if (!cleanedOptions.length) return;
  await prisma.questionOption.createMany({
    data: cleanedOptions,
    skipDuplicates: true,
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
      const value = typeof input === 'string' ? input.trim() : input;
      const existing = await prisma.tag.findUnique({
        where: { id: value },
        select: { id: true }
      });

      if (existing) return existing;

      if (typeof value === 'string' && value.length > 0) {
        return await prisma.tag.upsert({
          where: {
            name: input.trim(),
          },
          create: {
            name: input.trim(),
          },
          update: {},
          select: {
            id: true,
          },
        });
      }
      throw new Error('Invalid tag input');
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

export const getSingleTemplate = async (templateId, currentUserId) => {
  return await prisma.template.findUnique({
    where: {
      id: templateId
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
      accessType: true,
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
      },
      likes: {
        where: currentUserId ? { userId: currentUserId } : undefined,
        select: {
          createdAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      },
      comments: {
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        },
        take: 5
      },
      questions: {
        select: {
          id: true,
          title: true,
          description: true,
          questionType: true,
          required: true,
          options: {
            select: {
              id: true,
              optionText: true,
            },
          }
        },
      },
      _count: {
        select: {
          questions: true,
          forms: true,
          likes: true,
          comments: true
        }
      }
    }
  });
};

export const giveLikeToTemplate = async (templateId, currentUserId) => {
  return await prisma.like.create({
    data: {
      templateId,
      userId: currentUserId
    }
  })
};

export const createCommentTemplate = async (templateId, currentUserId, comment) => {
  return await prisma.comment.create({
    data: {
      templateId,
      authorId: currentUserId,
      content: comment
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  })
}

export const getCommentsFromTemplate = async (templateId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { templateId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    }),
    prisma.comment.count({ where: { templateId } })
  ]);

  return {
    data: comments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getLikesFromTemplate = async (templateId) => {
  return await prisma.like.findMany({
    where: {
      templateId
    }
  });
}

export const checkUserLike = async (templateId, userId) => {
  const like = await prisma.like.findUnique({
    where: {
      templateId_userId: {
        templateId,
        userId
      }
    }
  });
  return !!like;
};

export const removeLikeFromTemplate = async (templateId, currentUserId) => {
  return await prisma.like.delete({
    where: {
      templateId_userId: {
        templateId,
        userId: currentUserId
      }
    }
  });
};

export const updateTemplate = async (settings,templateId) => {
  return await prisma.template.update({
    where: { id: templateId },
    data: {
      title: settings.title,
      description: settings.description,
      topicId: settings.topicId,
      imageUrl: settings.imageUrl,
      accessType: settings.accessType,
      displayString1InResults: settings.displayString1InResults,
    }
  });
}

export const clearRelations = async (templateId) => {
  await Promise.all([
    prisma.templateQuestion.deleteMany({ where: { templateId } }),
    prisma.templateRestriction.deleteMany({ where: { templateId } }),
    prisma.templateTag.deleteMany({ where: { templateId } }),
  ]);
}

export const deleteTemplate = async (templateId) => {
  await prisma.template.delete({
    where: { id: templateId }
  });
}

export const restrictedTemplates = async (userId, { take = 10, skip = 0 } = {}) => {
const [templates, totalCount] = await Promise.all([
    prisma.template.findMany({
      where: {
        restrictedUsers: {
          some: {
            userId: userId,
          },
        },
      },
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
            lastName: true,
          },
        },
        topic: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            tag: true,
          },
          take: 3,
        },
        _count: {
          select: {
            forms: true,
          },
        },
      },
    }),
    prisma.template.count({
      where: {
        restrictedUsers: {
          some: {
            userId: userId,
          },
        },
      },
    }),
  ]);

  return {
    data: templates,
    pagination: {
      total: totalCount,
      hasMore: skip + take < totalCount,
      nextPage: skip + take < totalCount ? Math.floor(skip / take) + 2 : null,
    },
  };
};

export const myTemplates = async (userId, { take = 10, skip = 0 } = {}) => {
const [templates, totalCount] = await Promise.all([
    prisma.template.findMany({
      where: {
        creatorId: userId
      },
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
            lastName: true,
          },
        },
        topic: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          select: {
            tag: true,
          },
          take: 3,
        },
        _count: {
          select: {
            forms: true,
          },
        },
      },
    }),
    prisma.template.count({
      where: {
        creatorId: userId,
      },
    }),
  ]);

  return {
    data: templates,
    pagination: {
      total: totalCount,
      hasMore: skip + take < totalCount,
      nextPage: skip + take < totalCount ? Math.floor(skip / take) + 2 : null,
    },
  };
};
