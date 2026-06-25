"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@dropiq/ui"

export default function VerifyEmailPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Verify Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
             <p className="text-center text-gray-500">
               Please check your email to verify your account.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
