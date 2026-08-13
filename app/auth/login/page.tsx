import AuthForm from '@/app/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full">
        <AuthForm type="login" />
      </div>
    </div>
  );
}
