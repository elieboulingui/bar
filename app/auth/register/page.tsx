import AuthForm from '@/app/components/AuthForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full">
        <AuthForm type="register" />
      </div>
    </div>
  );
}
