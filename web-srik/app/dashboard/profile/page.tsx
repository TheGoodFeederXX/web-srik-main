import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSession } from "@/lib/auth"

export default async function ProfilePage() {
  const session = await getSession()
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>View and manage your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{session?.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>{session?.user.name || "Not set"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            User ID: {session?.user.id}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
