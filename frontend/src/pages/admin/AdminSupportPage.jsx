import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, CheckCircle, X } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

/**
 * Page de gestion du support client (admin)
 */
const AdminSupportPage = () => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      const response = await api.get('/api/admin/support/threads');
      setThreads(response.data.threads);
    } catch (error) {
      console.error('Erreur lors du chargement des threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadThreadDetail = async (threadId) => {
    try {
      const response = await api.get(`/api/support/threads/${threadId}`);
      setSelectedThread(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du thread:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) {
      return;
    }

    try {
      setSending(true);
      await api.post(`/api/admin/support/threads/${selectedThread.id}/reply`, { body: newMessage });
      setNewMessage('');
      // Recharger le thread
      await loadThreadDetail(selectedThread.id);
      await loadThreads();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const handleCloseThread = async (threadId) => {
    if (!confirm('Êtes-vous sûr de vouloir fermer ce fil de discussion ?')) {
      return;
    }

    try {
      await api.post(`/api/admin/support/threads/${threadId}/close`);
      await loadThreads();
      if (selectedThread?.id === threadId) {
        await loadThreadDetail(threadId);
      }
    } catch (error) {
      console.error('Erreur lors de la fermeture du thread:', error);
      alert('Erreur lors de la fermeture du thread');
    }
  };

  if (loading) {
    return <Loading fullScreen message="Chargement..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestion du support client
          </h1>
          <p className="text-gray-600">
            {threads.length} demande(s) de support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des threads */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Toutes les demandes
              </h2>
              {threads.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  Aucune demande de support
                </p>
              ) : (
                <div className="space-y-2">
                  {threads.map((thread) => (
                    <div key={thread.id}>
                      <button
                        onClick={() => loadThreadDetail(thread.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedThread?.id === thread.id
                            ? 'bg-primary-100 border-2 border-primary-600'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <MessageCircle size={18} className="text-primary-600 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate">
                              {thread.subject}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {thread.messages?.length || 0} message(s)
                            </p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                              !thread.closed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {!thread.closed ? 'Ouvert' : 'Fermé'}
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Conversation */}
          <div className="lg:col-span-2">
            {selectedThread ? (
              <Card className="h-[600px] flex flex-col">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {selectedThread.subject}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selectedThread.messages?.length || 0} message(s)
                      </p>
                    </div>
                    {!selectedThread.closed && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCloseThread(selectedThread.id)}
                      >
                        <X size={16} />
                        Fermer le fil
                      </Button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {selectedThread.messages?.map((msg) => {
                    const isSupport = msg.author_user_id === null;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isSupport ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isSupport
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.body}</p>
                          <p className={`text-xs mt-2 ${
                            isSupport ? 'text-primary-100' : 'text-gray-500'
                          }`}>
                            {new Date(msg.created_at * 1000).toLocaleString('fr-FR')}
                            {!isSupport && ` - ${msg.author_name}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Zone d'envoi */}
                {!selectedThread.closed && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Votre réponse..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button
                        variant="primary"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        loading={sending}
                      >
                        <Send size={20} />
                      </Button>
                    </div>
                  </div>
                )}
                {selectedThread.closed && (
                  <div className="border-t border-gray-200 pt-4 text-center text-gray-500">
                    Ce fil de discussion est fermé
                  </div>
                )}
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle size={64} className="mx-auto mb-4 text-gray-400" />
                  <p>Sélectionnez une conversation pour la consulter</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPage;
