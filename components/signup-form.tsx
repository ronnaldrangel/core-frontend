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
import { Loader2, ArrowRight, User, CheckCheckIcon, CheckCircle2Icon } from "lucide-react"
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

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          {success ? "Revisa tu bandeja de entrada" : "Completa el formulario para registrarte"}
        </p>
      </div>

      <div className="relative overflow-hidden min-h-[300px] flex flex-col justify-center">
        {/* Form Fields Section */}
        <form
          className={cn(
            "flex flex-col gap-6 transition-all duration-500 ease-in-out",
            success ? "opacity-0 invisible scale-95 absolute -translate-x-full" : "opacity-100 visible scale-100"
          )}
          onSubmit={handleRegister}
          {...props}
        >
          <FieldGroup>
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
                placeholder="••••••••"
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
          </FieldGroup>
        </form>

        {/* Success Message Section */}
        <div
          className={cn(
            "transition-all duration-700 ease-out delay-150",
            success
              ? "opacity-100 visible translate-y-0 scale-100"
              : "opacity-0 invisible translate-y-4 scale-95 absolute"
          )}
        >
          <div className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm">
            <div className="flex items-start gap-4">
              <CheckCircle2Icon className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-semibold tracking-tight">
                  Confirma tu email
                </h2>
                <p className="text-xs text-muted-foreground leading-normal">
                  Te has registrado exitosamente. Revisa tu correo para activar tu cuenta antes de que expire en 10 minutos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm">
        ¿Ya tienes una cuenta?{" "}
        <a href="/login" className="underline underline-offset-4 font-medium hover:text-primary transition-colors">
          Inicia sesión
        </a>
      </div>
    </div>
  )
}
