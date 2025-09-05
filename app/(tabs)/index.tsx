import { useEffect, useState } from "react";
import { Button, FlatList, SafeAreaView, Text, TextInput } from "react-native";
type Message = {
  data: string;
};
export default function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const socket = new WebSocket("wss://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev");

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    socket.onclose = () => console.log("Disconnected");

    setWs(socket);

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (ws && input.trim()) {
      ws.send(JSON.stringify({ action: "sendMessage", data: input }));
      setInput("");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item.data}</Text>}
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
