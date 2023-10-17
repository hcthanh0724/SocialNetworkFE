import React, { useEffect, useState } from 'react';

const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function Chat() {
    const [username, setUsername] = useState('');
    const [websocket, setWebsocket] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (websocket) {
            websocket.onmessage = onMessageReceived;

            // Tell your username to the server
            websocket.send(JSON.stringify({ sender: username, type: 'JOIN' }));
        }
    }, [websocket]);

    function connect(event) {
        event.preventDefault();

        const name = document.querySelector('#name').value.trim();
        if (name) {
            setUsername(name);
            setConnecting(true);

            const socket = new WebSocket('ws://localhost:8080/ws');
            setWebsocket(socket);

            socket.onopen = onConnected;
            socket.onerror = onError;
        }
    }

    function onConnected() {
        setConnecting(false);
    }

    function onError(error) {
        console.error(error);
        setConnecting(false);
    }

    function sendMessage(event) {
        event.preventDefault();

        const messageInput = document.querySelector('#message');
        const messageContent = messageInput.value.trim();
        if (messageContent && websocket) {
            const chatMessage = {
                sender: username,
                content: messageInput.value,
                type: 'CHAT'
            };
            websocket.send(JSON.stringify(chatMessage));
            messageInput.value = '';
        }
    }

    function onMessageReceived(event) {
        const message = JSON.parse(event.data);
        setMessages(prevMessages => [...prevMessages, message]);
    }

    function getAvatarColor(messageSender) {
        let hash = 0;
        for (let i = 0; i < messageSender.length; i++) {
            hash = 31 * hash + messageSender.charCodeAt(i);
        }
        const index = Math.abs(hash % colors.length);
        return colors[index];
    }

    return (
        <div>
            {username ? (
                <div id="chat-page">
                    <ul id="messageArea">
                        {messages.map((message, index) => (
                            <li key={index}
                                className={message.type === 'JOIN' || message.type === 'LEAVE' ? 'event-message' : 'chat-message'}
                            >
                                {message.type !== 'JOIN' && message.type !== 'LEAVE' && (
                                    <>
                                        <i style={{ backgroundColor: getAvatarColor(message.sender) }}>
                                            {message.sender[0]}
                                        </i>
                                        <span>{message.sender}</span>
                                    </>
                                )}
                                <p>{message.content}</p>
                            </li>
                        ))}
                    </ul>
                    <form id="messageForm" onSubmit={sendMessage}>
                        <input type="text" id="message" autoComplete="off" />
                        <button type="submit">Send</button>
                    </form>
                </div>
            ) : (
                <div id="username-page">
                    <form id="usernameForm" onSubmit={connect}>
                        <input type="text" id="name" autoComplete="off" />
                        <button type="submit">Enter Chat</button>
                    </form>
                </div>
            )}
            {connecting && <div className="connecting">Connecting...</div>}
        </div>
    );
}

export default Chat;