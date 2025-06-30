import prisma from "../prismaClient.js";

export const createTag = async (name) => {
    return await prisma.tag.create({
        data: { name }
    })
}

export const existingTag = async (name) => {
    return await prisma.tag.findUnique({
        where: { name },
    });
};

export const fetchTags = async () => {
    return await prisma.tag.findMany({
        select: {
            id: true,
            name: true,
        },
    }).then(topics =>
        topics.map(topic => ({
            value: topic.id,
            label: topic.name,
        })
    ));
}