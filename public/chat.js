const ws = new WebSocket("ws://localhost:8080");

ws.onopen = () => {
  console.log("Connected to server");
};

ws.onmessage = (event) => {
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML += `<p>${event.data}</p>`;
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the latest message
};

function sendMessage() {
  const input = document.getElementById("messageInput");
  if (input.value.trim() !== "") {
    ws.send(input.value);
    input.value = "";
  }
}
