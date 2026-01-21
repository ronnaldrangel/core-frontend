import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/profile-actions";
import { ProfileClient } from "./profile-client";

export default async function AccountPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { data: profile, error } = await getCurrentUser();

    if (error || !profile) {
        redirect("/login");
    }

    return (
        <div className="animate-in fade-in duration-500">
            <ProfileClient profile={profile} directusUrl={process.env.NEXT_PUBLIC_DIRECTUS_URL || ""} />
        </div>
    );
}
