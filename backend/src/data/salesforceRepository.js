import prisma from "../prismaClient.js";

export const getUserStats = async (userID) => {
    const rawTopics = ['Education', 'Surveys & Feedback', 'Quizzes & Assessments']; 
    const rawTags = ['Feedback', 'Questionnaire', 'Internal']; 

    return {
        numTemplatesCreated: 10,
        top3Topics: rawTopics.join(';'),
        avgSubmissionsPerDay: 2.5,
        templateInterests: 'Interested in Advanced Template Creation / Design, Form Analytics & Reporting', 
        mostCommonTags:rawTags.join(';'),
    };
};