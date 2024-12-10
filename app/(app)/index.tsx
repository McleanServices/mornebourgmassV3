import { useAuth } from '../../context/auth';
import HomeScreen from '../../assets/screens/Main/Home';

export default function Index() {
  const { session } = useAuth();

  if (!session) return null;

  return <HomeScreen />;
}