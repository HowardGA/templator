import prisma from "../prismaClient.js";

export const fetchAllTopics = async () => {
  return await prisma.topic.findMany({
    select: {
      id: true,
      name: true,
    },
  }).then(topics => 
    topics.map(topic => ({
      value: topic.id, 
      label: topic.name, 
    }))
  );
};