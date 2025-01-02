import React, { useState, useEffect } from "react";
import { Github, MapPin, Users, Book } from "lucide-react";

function App() {
  const [username, setUsername] = useState("");

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-8">
      <div className="flex items-center gap-3 mb-8">
        <Github className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold text-white">Gitcard Explorer</h1>
      </div>
      
      <div className="relative w-96">
        <input
          className="w-full bg-gray-800 border-2 border-gray-700 text-white rounded-xl px-6 py-3 
                   placeholder-gray-500 focus:border-purple-500 focus:outline-none
                   transition-all duration-300"
          type="text"
          placeholder="Enter GitHub Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      
      {username && <GithubInfoCard username={username} />}
    </div>
  );
}

function GithubInfoCard({ username }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://api.github.com/users/${username}`);
        
        if (!response.ok) {
          throw new Error(`User not found`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className="mt-8 text-purple-400 text-xl animate-pulse">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-red-400 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-8 w-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl 
                    overflow-hidden border border-gray-700 shadow-xl transform 
                    transition-all duration-300 hover:scale-105">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur" />
        <img
          src={userData.avatar_url}
          alt={userData.name || "GitHub User"}
          className="w-32 h-32 rounded-full mx-auto mt-8 border-4 border-gray-800 
                   shadow-lg transform transition-transform duration-300 hover:scale-110"
        />
      </div>

      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">
          {userData.name || username}
        </h2>
        
        <p className="text-purple-400 mb-6 italic">
          {userData.bio || "No bio available"}
        </p>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <MapPin className="w-5 h-5 text-purple-400" />
            {userData.location || "Location not specified"}
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-300">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-white">{userData.followers}</span> followers
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-300">
            <Book className="w-5 h-5 text-green-400" />
            <span className="font-bold text-white">{userData.public_repos}</span> repositories
          </div>
        </div>

        <a
          href={userData.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 
                     text-white px-6 py-2 rounded-xl font-medium
                     transform transition-all duration-300 hover:scale-105 
                     hover:shadow-lg hover:from-purple-600 hover:to-blue-600"
        >
          View Profile
        </a>
      </div>
    </div>
  );
}

export default App;