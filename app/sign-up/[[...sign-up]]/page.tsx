import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <SignUp
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-green-600 hover:bg-green-700',
                        footerActionLink: 'text-green-600 hover:text-green-700'
                    }
                }}
            />
        </div>
    );
}