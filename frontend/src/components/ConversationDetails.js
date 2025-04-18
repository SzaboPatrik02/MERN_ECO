import { useState, useEffect } from 'react'
import { useConversationsContext } from '../hooks/useConversationsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom';

import moment from 'moment'

const ConversationDetails = ({ conversation }) => {
  const { dispatch } = useConversationsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [replyContent, setReplyContent] = useState('');

  const [users, setUsers] = useState([]);
  const [showAllMessages, setShowAllMessages] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        console.log("Felhasználók betöltve:", data);

        if (response.ok) {
          setUsers(data);
        } else {
          console.error("Hiba a felhasználók lekérdezésekor:", data.error);
        }
      } catch (error) {
        console.error('Hálózati hiba:', error);
      }
    };

    fetchUsers();
  }, [user]);

  const handleMemberClick = (memberId) => {
    navigate(`/user/${memberId}`);
  }

  const handleMarkAsRead = async () => {
    if (!user) return

    const response = await fetch(`/api/conversations/${conversation._id}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      dispatch({ type: 'MARK_AS_READ', payload: conversation._id })
    }
  }

  const handleDelete = async () => {
    if (!user) {
      return
    }

    const response = await fetch('/api/conversations/' + conversation._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_CONVERSATION', payload: json })
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()

    if (!user || !replyContent.trim()) {
      return;
    }

    const newMessage = {
      content: replyContent,
      creator_id: user.user_id,
    };

    const response = await fetch('/api/conversations/' + conversation._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({
        conversation_id: conversation._id,
        messages: [...conversation.messages, newMessage]
      })
    });

    const json = await response.json();

    if (response.ok) {
      setReplyContent('');
      //setReplyingToMessage(null);
      dispatch({ type: 'UPDATE_CONVERSATION', payload: json });
    }
  };

  const otherParticipantId = conversation.participants.find(id => id !== user.user_id)
  const otherParticipant = users.find(u => u._id === otherParticipantId)

  return (
    <div className="conversation-item">
      
        <h3
          className="conversation-partner"
          onClick={() => otherParticipant && handleMemberClick(otherParticipant._id)}
        >
          {otherParticipant?.username || 'Ismeretlen'}</h3>
        <div className="conversation-actions">
          <button className="toggle-view-btn" onClick={() => {
            setShowAllMessages(!showAllMessages);
            handleMarkAsRead();
          }}>
            {showAllMessages ? 'Vissza' : 'Teljes beszélgetés'}
          </button>
          <button className="delete-btn" onClick={handleDelete}>Törlés</button>
        </div>
      

      <div className="messages-container">
        {showAllMessages ? (
          <div className="all-messages">
            {conversation.messages.map((message, index) => (
              
              <div
                key={index}
                className={`message-row ${message.creator_id?.toString() === user._id?.toString() ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  <div className="message-meta">
                    <span className="message-sender">
                      {users.find(u => u._id === message.creator_id)?.username || 'Ismeretlen'}
                    </span>
                    <span className="message-time">
                      {moment(message.timestamp).format('HH:mm')}
                    </span>
                  </div>
                  <p className="message-text">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="last-message">
            {conversation.messages.length > 0 && (
              <div className={`message-row ${conversation.messages[conversation.messages.length - 1].creator_id === user._id ? 'sent' : 'received'}`}>
                <div className="message-content">
                  <div className="message-meta">
                    <span className="message-sender">
                      {users.find(u => u._id === conversation.messages[conversation.messages.length - 1].creator_id)?.username || 'Ismeretlen'}
                    </span>
                    <span className="message-time">
                      {moment(conversation.messages[conversation.messages.length - 1].timestamp).format('HH:mm')}
                    </span>
                  </div>
                  <p className="message-text">{conversation.messages[conversation.messages.length - 1].content}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleReply} className="reply-form">
        <input
          type="text"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Írj üzenetet..."
          required
        />
        <button type="submit" disabled={!replyContent.trim()}>Küldés</button>
      </form>
    </div>
  );
}



export default ConversationDetails