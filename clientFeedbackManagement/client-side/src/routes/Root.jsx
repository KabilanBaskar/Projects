import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MessageSquare, CheckCircle, AlertCircle, Target } from 'lucide-react';

const Root = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => setAnimateStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Sample data for charts
  const barData = [
    { name: 'Jan', positive: 65, negative: 25 },
    { name: 'Feb', positive: 78, negative: 18 },
    { name: 'Mar', positive: 92, negative: 15 },
    { name: 'Apr', positive: 87, negative: 22 },
    { name: 'May', positive: 95, negative: 12 },
  ];

  const pieData = [
    { name: 'Implemented', value: 68, color: '#fbbf24' },
    { name: 'In Progress', value: 22, color: '#f59e0b' },
    { name: 'Pending', value: 10, color: '#374151' },
  ];

  const stats = [
    { icon: MessageSquare, label: 'Total Feedbacks', value: '12,847', color: 'text-yellow-400' },
    { icon: CheckCircle, label: 'Positive Feedbacks', value: '9,234', color: 'text-green-400' },
    { icon: AlertCircle, label: 'Negative Feedbacks', value: '1,892', color: 'text-red-400' },
    { icon: Target, label: 'Implementation Rate', value: '68%', color: 'text-yellow-400' },
    { icon: TrendingUp, label: 'Action Taken Rate', value: '90%', color: 'text-blue-400' },
    { icon: Users, label: 'Active Users', value: '3,456', color: 'text-purple-400' },
  ];

  // Particle animation component
  const ParticleBackground = () => {
    const particles = Array.from({ length: 50 }, (_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-30 animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
        }}
      />
    ));
    return <div className="absolute inset-0 overflow-hidden pointer-events-none">{particles}</div>;
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/90 backdrop-blur-sm border-b border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-8 h-8 text-yellow-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                FeedbackCore
              </span>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 rounded-lg font-medium">
                Login
              </button>
              <button className="px-4 py-2 bg-yellow-400 text-black hover:bg-yellow-500 transition-all duration-300 rounded-lg font-medium shadow-lg hover:shadow-yellow-400/20">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <ParticleBackground />
        
        {/* Animated geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 border-2 border-yellow-400/30 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-400/10 rotate-12 animate-pulse" />
          <div className="absolute bottom-20 left-20 w-24 h-24 border border-yellow-400/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
        </div>

        <div className={`text-center z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
              Built by your
            </span>
            <br />
            <span className="text-white relative">
              thoughts
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" />
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            Transform customer feedback into actionable insights with our cutting-edge analytics platform
          </p>
          <div className="flex justify-center space-x-6">
            <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg shadow-2xl hover:shadow-yellow-400/30 transform hover:scale-105 transition-all duration-300">
              Get Started
            </button>
            <button className="px-8 py-4 border-2 border-yellow-400 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-time insights and comprehensive metrics to drive your business forward
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 transform hover:scale-105 ${
                  animateStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Bar Chart */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 text-yellow-400 mr-3" />
                Feedback Trends
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Bar dataKey="positive" fill="#fbbf24" radius={4} />
                    <Bar dataKey="negative" fill="#ef4444" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Target className="w-6 h-6 text-yellow-400 mr-3" />
                Implementation Status
              </h3>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: entry.color }} />
                    <span className="text-gray-300 text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button className="group relative px-12 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg rounded-full shadow-2xl hover:shadow-yellow-400/40 transform hover:scale-105 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center">
                Show More Analytics
                <TrendingUp className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-semibold text-white">FeedbackCore</span>
            </div>
            <p className="text-gray-400">© 2025 FeedbackCore. Transforming feedback into success.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Root;