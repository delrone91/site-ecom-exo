import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, Plus } from 'lucide-react';
import { getThreads, getThread, createThread, postMessage } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';

/**
 * Page de support avec threads et chat
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
      // Recharger le thread
      await loadThreadDetail(selectedThread.id);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading fullScreen message="Chargement..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Support client
          </h1>
          <Button
            variant="primary"
            onClick={() => setShowNewThread(!showNewThread)}
          >
            <Plus size={20} />
            Nouvelle demande
          </Button>
        </div>

        {/* Formulaire nouvelle demande */}
        {showNewThread && (
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Nouvelle demande de support
            </h2>
            <div className="space-y-4">
              <Input
                label="Sujet"
                placeholder="Quel est le problème ?"
                value={newThreadData.subject}
                onChange={(e) => setNewThreadData({ ...newThreadData, subject: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 min-h-32"
                  placeholder="Décrivez votre problème en détail..."
                  value={newThreadData.message}
                  onChange={(e) => setNewThreadData({ ...newThreadData, message: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleCreateThread}
                  loading={sending}
                  disabled={sending}
                >
                  Envoyer
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowNewThread(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des threads */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Mes demandes
              </h2>
              {threads.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  Aucune demande de support
                </p>
              ) : (
                <div className="space-y-2">
                  {threads.map((thread) => (
                    <button
                      key={thread.id}
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
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedThread.subject}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedThread.messages?.length || 0} message(s)
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {selectedThread.messages?.map((msg) => {
                    const isSupport = msg.author_user_id === null;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isSupport ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isSupport
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-primary-600 text-white'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.body}</p>
                          <p className={`text-xs mt-2 ${
                            isSupport ? 'text-gray-500' : 'text-primary-100'
                          }`}>
                            {new Date(msg.created_at * 1000).toLocaleString('fr-FR')}
                            {isSupport && ' - Support'}
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
                        placeholder="Votre message..."
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
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle size={64} className="mx-auto mb-4 text-gray-400" />
                  <p>Sélectionnez une conversation ou créez une nouvelle demande</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
