const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for admin operations
const supabaseURL = "https://udmfsxzjpgaiofbssinw.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkbWZzeHpqcGdhaW9mYnNzaW53Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzU3MzI5MCwiZXhwIjoyMDYzMTQ5MjkwfQ.edv_jgilO9o-8KaROH94ka0iozmtQyUMQo8ojAwbDXM";
const supabaseAdmin = createClient(supabaseURL, serviceRoleKey);

async function main() {
  try {
    console.log("Starting to seed admin user...");
    
    // Check if admin user already exists
    const { data: existingUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserByEmail(
      "zulnajmi@srialkhairiah.my"
    );
    
    if (getUserError) {
      console.error("Error checking for existing user:", getUserError);
      return;
    }
    
    if (existingUser) {
      console.log("Admin user already exists, updating password...");
      
      // Update the admin user's password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password: "goodBoy#97z!" }
      );
      
      if (updateError) {
        console.error("Error updating user password:", updateError);
        return;
      }
      
      console.log("Admin password updated successfully.");
    } else {
      console.log("Creating new admin user...");
      
      // Create the admin user
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: "zulnajmi@srialkhairiah.my",
        password: "goodBoy#97z!",
        email_confirm: true,
        user_metadata: { 
          role: "admin",
          full_name: "Zul Najmi"
        },
      });
      
      if (createError) {
        console.error("Error creating user:", createError);
        return;
      }
      
      console.log("User created successfully:", userData);
      
      // Create profile entry
      if (userData?.user) {
        const { error: profileError } = await supabaseAdmin.from("profiles").insert({
          id: userData.user.id,
          email: userData.user.email,
          full_name: "Zul Najmi",
          role: "admin",
        });
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
        } else {
          console.log("Profile created successfully");
        }
      }
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

main()
  .catch(console.error)
  .finally(() => {
    console.log("Seed script completed.");
  });
