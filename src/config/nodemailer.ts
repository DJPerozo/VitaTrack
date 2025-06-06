import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

interface emailProps {
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    };
}

const config = (): emailProps => {
    return {
        host: process.env.EMAIL_HOST,
        port: +process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }

    }
}

export const transport = nodemailer.createTransport(config());