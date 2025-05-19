import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

// Load environment variables from .env
dotenv.config()

// Note: This script doesn't use the standardized createAdminClient() function
// since it needs to be run outside of the Next.js context where cookies are available
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function main() {
  try {
    console.log("Starting to seed admin user...")
    
    // Check if admin user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserByEmail(
      "zulnajmi@srialkhairiah.my"
    )
    
    if (existingUser) {
      console.log("Admin user already exists, updating password...")
      
      // Update the admin user's password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password: "goodBoy#97z!" }
      )
      
      if (updateError) {
        throw updateError
      }
      
      console.log("Admin password updated successfully.")
    } else {
      console.log("Creating new admin user...")
      
      // Create the admin user
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: "zulnajmi@srialkhairiah.my",
        password: "goodBoy#97z!",
        email_confirm: true,
        user_metadata: { 
          role: "admin",
          full_name: "Zul Najmi"
        },
      })
      
      if (createError) {
        throw createError
      }
      
      // Create profile entry
      if (userData?.user) {
        const { error: profileError } = await supabaseAdmin.from("profiles").insert({
          id: userData.user.id,
          email: userData.user.email,
          full_name: "Zul Najmi",
          role: "admin",
        })
        
        if (profileError) {
          console.error("Error creating profile:", profileError)
        }
      }
      
      console.log("Admin user created successfully.")
    }
  } catch (error) {
    console.error("Error seeding admin user:", error)
    process.exit(1)
  }
}

main()
  .catch(console.error)
  .finally(() => {
    console.log("Seed script completed.")
    process.exit(0)
  })
