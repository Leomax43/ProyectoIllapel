import LoginCard from '../components/ui/LoginCard.jsx';

export default function Login({ login, error, loading }) {
  return (
    <div className="">
      <LoginCard onSubmit={login} loading={loading} error={error} />
    </div>
  );
}

