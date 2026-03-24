import PersonalBankingPage from '@/components/personal-banking/PersonalBankingPage';

export function generateMetadata({ params: { locale } }) {
    return {
        title: "Personal Banking | Wegagen Bank",
        description: "Tailored financial solutions designed to empower your future and secure your legacy since 1997.",
    };
}

export default function Page() {
    return (
        <main className="min-h-screen flex flex-col pt-0">
            <div className="flex-grow">
                <PersonalBankingPage />
            </div>
        </main>
    );
}
