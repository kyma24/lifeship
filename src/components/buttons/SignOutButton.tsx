import { signOut } from "@/utils/backend/auth";

const SignOutButton = () => {
    const handleSignout = async () => {
        await signOut();
    }

    return (
        <button
            className="flex w-fit px-2 justify-center items-center bg-red-700"
            onClick={handleSignout}
        >
            <p className="font-dongle text-2xl font-bold">
                sign out
            </p>
        </button>
    );
};

export default SignOutButton;