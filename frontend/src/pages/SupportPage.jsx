import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, Plus, Headphones, X } from 'lucide-react';
import { getThreads, getThread, createThread, postMessage } from '../services/api';
import Loading from '../components/common/Loading';

/**
 * SupportPage Moderne avec Glassmorphism
 */
const SupportPage = () => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadData, setNewThreadData] = useState({
    subject: '',
    message: '',
  });

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      const data = await getThreads();
      setThreads(data);
    } catch (error) {
      console.error('Erreur lors du chargement des threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadThreadDetail = async (threadId) => {
    try {
      const data = await getThread(threadId);
      setSelectedThread(data);
    } catch (error) {
      console.error('Erreur lors du chargement du thread:', error);
    }
  };

  const handleCreateThread = async () => {
    if (!newThreadData.subject.trim() || !newThreadData.message.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      setSending(true);
      const thread = await createThread(newThreadData.subject, newThreadData.message);
      await loadThreads();
      setShowNewThread(false);
      setNewThreadData({ subject: '', message: '' });
      setSelectedThread(thread);
    } catch (error) {
      console.error('Erreur lors de la création du thread:', error);
      alert('Erreur lors de la création de la demande. Veuillez réessayer.');
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) {
      return;
    }

    try {
      setSending(true);
      await postMessage(selectedThread.id, newMessage);
      setNewMessage('');
      await loadThreadDetail(selectedThread.id);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Chargement..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-accent-50/30 py-24">
      {/* Cercles flottants */}
      <div className="fixed top-40 left-20 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-40 right-20 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Support Client
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              Notre équipe est là pour vous aider
            </p>
          </div>
          <button
            onClick={() => setShowNewThread(!showNewThread)}
            className="group relative px-6 py-3 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:from-primary-600 group-hover:to-accent-600 transition-all duration-300"></div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accent-500 to-primary-500 blur-xl transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2 text-white font-semibold">
              <Plus size={20} />
              Nouvelle demande
            </span>
          </button>
        </div>

        {/* Formulaire nouvelle demande */}
        {showNewThread && (
          <div className="mb-8 backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-8 shadow-glass animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Nouvelle demande de support
              </h2>
              <button
                onClick={() => setShowNewThread(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sujet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Quel est le problème ?"
                  value={newThreadData.subject}
                  onChange={(e) => setNewThreadData({ ...newThreadData, subject: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-gray-800 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-3.5 rounded-xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-gray-800 placeholder-gray-500 min-h-32 resize-none"
                  placeholder="Décrivez votre problème en détail..."
                  value={newThreadData.message}
                  onChange={(e) => setNewThreadData({ ...newThreadData, message: e.target.value })}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateThread}
                  disabled={sending}
                  className="group relative px-8 py-3 rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:from-primary-600 group-hover:to-accent-600 transition-all duration-300"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accent-500 to-primary-500 blur-xl transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2 text-white font-semibold">
                    {sending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Envoyer
                      </>
                    )}
                  </span>
                </button>
                <button
                  onClick={() => setShowNewThread(false)}
                  className="px-8 py-3 rounded-2xl backdrop-blur-xl bg-white/60 border border-white/20 hover:bg-white/80 text-gray-800 font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Liste des threads */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-6 shadow-glass">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl">
                  <Headphones className="text-white" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Mes demandes
                </h2>
              </div>
              {threads.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600">
                    Aucune demande de support
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Créez une nouvelle demande pour commencer
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {threads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => loadThreadDetail(thread.id)}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                        selectedThread?.id === thread.id
                          ? 'bg-gradient-to-r from-primary-50 to-accent-50 border-2 border-primary-400 shadow-glow'
                          : 'bg-white/50 border border-white/20 hover:bg-white/70'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MessageCircle size={20} className={`flex-shrink-0 mt-1 ${
                          selectedThread?.id === thread.id ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 truncate mb-1">
                            {thread.subject}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {thread.messages?.length || 0} message(s)
                          </p>
                          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            !thread.closed
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}>
                            {!thread.closed ? 'Ouvert' : 'Fermé'}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Conversation */}
          <div className="lg:col-span-2">
            {selectedThread ? (
              <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-6 shadow-glass h-[700px] flex flex-col">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                    {selectedThread.subject}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedThread.messages?.length || 0} message(s)
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {selectedThread.messages?.map((msg) => {
                    const isSupport = msg.author_user_id === null;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isSupport ? 'justify-start' : 'justify-end'} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl p-4 shadow-md ${
                            isSupport
                              ? 'bg-white/80 text-gray-800 border border-gray-200'
                              : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                          <p className={`text-xs mt-3 flex items-center gap-2 ${
                            isSupport ? 'text-gray-500' : 'text-white/80'
                          }`}>
                            <span>{new Date(msg.created_at * 1000).toLocaleString('fr-FR')}</span>
                            {isSupport && <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">Support</span>}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Zone d'envoi */}
                {!selectedThread.closed ? (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Votre message..."
                        className="flex-1 px-4 py-3.5 rounded-xl bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all text-gray-800 placeholder-gray-500"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="group relative px-6 py-3.5 rounded-xl overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:from-primary-600 group-hover:to-accent-600 transition-all duration-300"></div>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-accent-500 to-primary-500 blur-lg transition-opacity duration-300"></div>
                        <span className="relative">
                          {sending ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Send size={20} className="text-white" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-center py-4 bg-gray-100/50 rounded-2xl">
                      <p className="text-gray-600 font-medium">Cette conversation est fermée</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-6 shadow-glass h-[700px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="text-primary-600" size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune conversation sélectionnée</h3>
                  <p className="text-gray-600">
                    Sélectionnez une conversation ou créez une nouvelle demande
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
