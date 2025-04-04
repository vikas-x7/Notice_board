import { redirect } from "next/navigation";
import LoginForm from "@/client/auth/components/LoginForm";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getUserHomeRoute } from "@/lib/user-home";

export default async function LoginPage() {
    const user = await getCurrentUser();

    if (user) {
        redirect(getUserHomeRoute(user.role));
    }

    return <LoginForm />;
}
