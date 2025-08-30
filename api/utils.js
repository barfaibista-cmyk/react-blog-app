export const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
        console.error('ERROR: JWT_SECRET_KEY is not defined in the .env file or environment variables!');
        throw new Error("JWT_SECRET_KEY is not configured.");
    }
    return secret;
};
