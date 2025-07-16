export const CorsConfig = {
    origin: ['http://localhost:5173', 'https://templator-eta.vercel.app', 'http://localhost:8069'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-type', 'Authorization'],
    credentials: true, 
    preflightContinue: false,
}