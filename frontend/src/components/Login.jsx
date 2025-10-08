import { useState } from 'react';
import { registerUser } from '../services/api';

function Login({ onLogin }) {
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nickname.trim()) {
            setError('Please enter a nickname');
            return;
        }

        if (nickname.length < 3) {
            setError('Nickname must be at least 3 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const user = await registerUser(nickname.trim());
            onLogin(user);
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to register. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-6">
                        <span className="text-3xl">💬</span>
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                        Welcome to AI Chat
                    </h1>
                    <p className="text-gray-500">
                        Real-time sentiment analysis
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                            Nickname
                        </label>
                        <input
                            type="text"
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Enter your nickname"
                            maxLength={50}
                            disabled={loading}
                            autoFocus
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Joining...' : 'Join Chat'}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-400 mt-8">
                    Your messages will be analyzed for sentiment
                </p>
            </div>
        </div>
    );
}

export default Login;