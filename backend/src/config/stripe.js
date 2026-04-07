import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const PRICE_IDS = {
    pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    premium_monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
};

export const TIER_LIMITS = {
    free: { monthlyLimit: 4 },
    pro: { monthlyLimit: 75 },
    premium: { monthlyLimit: 300 },
};

export default stripe;