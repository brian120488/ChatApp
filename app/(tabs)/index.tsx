import { ChatBubble } from "@/components/ui/ChatBubble";
import { useEffect, useState } from "react";
import { Button, FlatList, SafeAreaView, TextInput } from "react-native";

type Message = {
  message: string;
  isMe: boolean;
};

export default function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const wsUrl = "wss://3xe12c3kog.execute-api.us-east-2.amazonaws.com/production/";

  useEffect(() => {
    console.log("Messages updated:", messages);
    }, [messages]);

  useEffect(() => {
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received:", message);
      setMessages((prev) => [...prev, { ...message, isMe: false }]);
    };

    socket.onclose = () => console.log("Disconnected");

    setWs(socket);

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (ws && input.trim()) {
      ws.send(JSON.stringify({ action: "sendMessage", data: input }));
      setMessages((prev) => [...prev, { message: input, isMe: true }]);
      setInput("");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatBubble isMe={item.isMe}>{item.message}</ChatBubble>}
        keyExtractor={(_, i) => i.toString()}
      />
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type a message"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Send" onPress={sendMessage} />
      
    </SafeAreaView>
  );
}
