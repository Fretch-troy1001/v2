import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// We need a client with service role for admin actions
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function confirmUser() {
    const email = 'engineer@gnpd.com';

    console.log(`Attempting to confirm user: ${email}...`);

    // 1. List users to find the ID
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError.message);
        return;
    }

    const user = users?.users.find(u => u.email === email);

    if (!user) {
        console.log(`User ${email} not found. Creating...`);
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password: 'password123',
            email_confirm: true
        });
        if (createError) console.error('Error creating:', createError.message);
        else console.log('User created and confirmed!');
    } else {
        console.log(`User found with ID: ${user.id}. Confirming...`);
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            email_confirm: true
        });
        if (updateError) console.error('Error confirming:', updateError.message);
        else console.log('User confirmed successfully!');
    }
}

confirmUser();
