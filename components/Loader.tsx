interface LoaderProps {
    status: string;
    isLoading: boolean;
}

export default function Loader({ status, isLoading }: LoaderProps) {
    if (status === "loading" || isLoading) {
        return (
            <div className="flex justify-center items-center">
                <div className="animate-spin h-12 w-12 border-4 border-t-4 border-transparent rounded-full bg-gradient-to-r from-blue-700 to-blue-900"></div>
            </div>
        );
    }

    return null;
}