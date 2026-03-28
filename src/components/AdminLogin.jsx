import { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { useTheme } from '../contexts/ThemeContext';

export function AdminLogin({ onLogin, onBack }) {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('admin@skillora.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${
      isDarkMode ? 'bg-[#1F2933]' : 'bg-[#F9FAFB]'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute -top-40 -right-40 size-80 bg-[#2563EB] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-80 bg-[#2563EB] rounded-full blur-3xl" />
      </div>

      <Card className={`w-full max-w-md relative z-10 ${
        isDarkMode ? 'bg-[#2A3642] border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto size-16 bg-[#2563EB] rounded-full flex items-center justify-center mb-2">
            <Shield className="size-8 text-white" />
          </div>
          <CardTitle className={isDarkMode ? 'text-white' : 'text-[#1F2933]'}>
            Admin Login
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Skillora Platform Management Access
          </CardDescription>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${
            isDarkMode ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
          }`}>
            <Lock className="size-3" />
            Authorized Access Only
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                Admin Email
              </Label>
              <div className="relative mt-2">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@skillora.com"
                  className={`pl-10 ${
                    isDarkMode 
                      ? 'bg-[#1F2933] border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-[#1F2933]'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <Label className={isDarkMode ? 'text-gray-300' : 'text-[#1F2933]'}>
                Admin Password
              </Label>
              <div className="relative mt-2">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 ${
                    isDarkMode 
                      ? 'bg-[#1F2933] border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-[#1F2933]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className={`p-3 rounded-lg text-sm ${
              isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-700'
            }`}>
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Email: admin@skillora.com</p>
              <p>Password: admin123</p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
            >
              {isLoading ? 'Authenticating...' : 'Login to Admin Panel'}
            </Button>

            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className={`w-full ${
                isDarkMode 
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-[#1F2933] hover:bg-gray-100'
              }`}
            >
              Back to Home
            </Button>
          </form>

          <div className={`mt-6 pt-4 border-t text-center text-xs ${
            isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-500'
          }`}>
            <p>All admin actions are logged for security audit</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* This file is the Admin Login component used for authenticating admin access to the system.
It is designed for web-based React applications, not a native mobile app.*/