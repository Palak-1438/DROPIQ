"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "@dropiq/ui"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data)
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label>Name</label>
              <Input {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">Name required.</p>}
            </div>
            <div className="space-y-2">
              <label>Email</label>
              <Input {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">Valid email required.</p>}
            </div>
            <div className="space-y-2">
              <label>Password</label>
              <Input type="password" {...register("password")} />
              {errors.password && <p className="text-red-500 text-sm">Min 8 characters required.</p>}
            </div>
            <Button type="submit" className="w-full">Create Account</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
