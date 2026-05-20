import LoginCard from '../components/ui/LoginCard.jsx';

export default function Login({ login, error, loading }) {
  return (
    <div className="w-screen h-screen">
      <LoginCard onSubmit={login} loading={loading} error={error} />
    </div>
  );
}

