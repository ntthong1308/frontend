import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const ChatBot = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.post('http://localhost:8080/bot/chat', null, {
        params: { prompt },
        ...config
      });

      const botMessage = { sender: 'bot', text: res.data };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Lỗi khi gửi yêu cầu tới chatbot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Chat với MediBot</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Card className="p-4 shadow chatbot-card">
            <div className="chat-history mb-4" style={{ minHeight: '200px', maxHeight: '400px', overflowY: 'auto' }}>
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'} d-flex align-items-start`}>
                  <img
                    src={msg.sender === 'user'
                      ? 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png'
                      : 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png'}
                    alt={msg.sender}
                    className="chat-avatar me-2"
                    width="36"
                    height="36"
                  />
                  <div>
                    <span className="chat-username">{msg.sender === 'user' ? 'Bạn' : 'MediBot'}</span>
                    <div className="chat-text">
                      {msg.text.split('\n').map((line, idx) => (
                        <p key={idx} style={{ marginBottom: '0.5rem' }}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="chat-bubble bot-bubble d-flex align-items-start">
                  <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" alt="bot" className="chat-avatar me-2" width="36" height="36" />
                  <div>
                    <span className="chat-username">MediBot</span>
                    <div className="chat-text"><Spinner animation="border" size="sm" className="me-2" /> Đang gửi...</div>
                  </div>
                </div>
              )}
            </div>

            <Form onSubmit={handleSubmit} className="d-flex">
              <Form.Control
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                disabled={loading}
                className="me-2"
              />
              <Button type="submit" variant="primary" disabled={loading || !prompt.trim()}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Gửi'}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <style>{`
        .chatbot-card { border-radius: 15px; border: none; }
        .chat-history { background-color: #f8f9fa; border-radius: 10px; padding: 15px; }
        .chat-bubble { margin-bottom: 15px; }
        .chat-avatar { border-radius: 50%; flex-shrink: 0; }
        .chat-username { font-weight: bold; font-size: 0.9rem; color: #6c757d; display: block; margin-bottom: 5px; }
        .chat-text { background-color: white; padding: 10px 15px; border-radius: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); word-wrap: break-word;  white-space: pre-wrap;   max-width: 100%; overflow-wrap: break-word;}
        .user-bubble .chat-text { background-color: #007bff; color: white; }
        .bot-bubble .chat-text { background-color: white; color: #333; }
      `}</style>
    </Container>
  );
};

export default ChatBot;
