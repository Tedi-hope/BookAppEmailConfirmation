/*
export const PORT=4444;
export const mongoDBURL='mongodb+srv://root:mongopwd@books-store-mern.dmytm.mongodb.net/books-collection?retryWrites=true&w=majority&appName=Books-Store-MERN';
*/

export const PORT = process.env.PORT || 4444;

export const mongoDBURL = process.env.MONGO_DB_URL || 'mongodb+srv://root:mongopwd@books-store-mern.dmytm.mongodb.net/books-collection';

export const emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL || 'amhopefule07@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'gxsb wobw ixvl bcwd',
};

export const jwtSecret = process.env.JWT_SECRET || 'secretCode@backend';
