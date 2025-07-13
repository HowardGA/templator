import axios from 'axios';

export const salesforceAxios = axios.create({
    baseURL: `${process.env.SALESFORCE_URI}/services/data/${process.env.SALESFORCE_API_VERSION}/`,
    headers: {
        'Authorization': `Bearer ${process.env.SALESFORCE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    }
});