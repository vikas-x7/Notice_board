import { redirect } from "next/navigation";
import RegisterForm from "@/client/auth/components/RegisterForm";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getUserHomeRoute } from "@/lib/user-home";

export default async function RegisterPage() {
    const user = await getCurrentUser();

    if (user) {
        redirect(getUserHomeRoute(user.role));
    }

    return <RegisterForm />;
}
