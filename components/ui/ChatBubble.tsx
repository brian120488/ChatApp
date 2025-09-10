import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type BubbleProps = {
  children: ReactNode;
  isMe?: boolean;
};

export function ChatBubble({ children, isMe = false }: BubbleProps) {
  return (
    <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 16,
    marginVertical: 4,
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#0078fe",
  },
  theirBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5ea",
  },
  text: {
    fontSize: 16,
    color: "white",
  },
});
