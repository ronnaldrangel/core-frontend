"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/lib/actions"
import { Loader2, ArrowRight, User } from "lucide-react"
import { toast } from "sonner"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter() // eslint-disable-line @typescript-eslint/no-unused-vars

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await registerUser({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success("¡Cuenta creada! Revisa tu correo.")
      setSuccess(true)
    } catch (err: any) {
      console.error("Register error:", err)
      toast.error("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6 text-center", className)}>
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-green-500/20 p-4 text-green-500">
            <User className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">¡Casi listo!</h2>
          <p className="text-muted-foreground text-sm text-balance">
            Hemos enviado un enlace de verificación a tu correo. Por favor, revísalo para activar tu cuenta.
          </p>
          <Button className="w-full" asChild>
            <a href="/login">Volver al Login</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleRegister} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Completa el formulario para registrarte
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="first-name">Nombre</FieldLabel>
            <Input
              id="first-name"
              type="text"
              placeholder="Juan"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="last-name">Apellido</FieldLabel>
            <Input
              id="last-name"
              type="text"
              placeholder="Pérez"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <PasswordInput
            id="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear Cuenta <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </Field>

        <div className="text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="underline underline-offset-4">
            Inicia sesión
          </a>
        </div>
      </FieldGroup>
    </form>
  )
}
