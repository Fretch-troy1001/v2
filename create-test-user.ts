import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createTestUser() {
    const email = 'engineer@gnpd.com';
    const password = 'password123';

    console.log(`Attempting to create test user: ${email}...`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log('User already exists. You can use these credentials.');
        } else {
            console.error('Error creating user:', error.message);
        }
    } else {
        console.log('User created successfully!');
        console.log('Email:', email);
        console.log('Password:', password);
    }
}

createTestUser();
