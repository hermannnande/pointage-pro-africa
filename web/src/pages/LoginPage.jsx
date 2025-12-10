import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authAPI } from '../services/api';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!identifier || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    dispatch(loginStart());

    try {
      const response = await authAPI.login(identifier, password);
      const { token, user } = response.data;

      dispatch(loginSuccess({ token, user }));
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.error || 'Erreur de connexion'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
            <span className="text-4xl">📍</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pointage Dashboard</h1>
          <p className="text-gray-600">Gestion des présences et des employés</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email, Téléphone ou Code employé
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="input"
                placeholder="Votre identifiant"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Votre mot de passe"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        {/* Info de test */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Compte de test:</p>
          <p className="font-mono bg-white px-3 py-1 rounded mt-2">
            admin@pointage.ci / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

