import AuthForm from '@/app/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full">
        <AuthForm type="login" />
      </div>
    </div>
  );
}
