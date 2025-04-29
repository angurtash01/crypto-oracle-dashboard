
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <div className="bg-card rounded-lg p-6 border border-border/40">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">{user.email}</h1>
          <p className="text-muted-foreground mt-1">Account Member</p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-secondary rounded-md">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
            <p>{user.email}</p>
          </div>
          
          <div className="p-4 bg-secondary rounded-md">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h3>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <button className="w-full py-2 px-4 bg-secondary text-foreground rounded-md hover:bg-secondary/80 focus:outline-none">
            Edit Profile
          </button>
          <button 
            onClick={logout}
            className="w-full py-2 px-4 bg-destructive/20 text-destructive rounded-md hover:bg-destructive/30 focus:outline-none"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
