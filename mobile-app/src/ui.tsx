import React from "react";
import {
  Text,
  TextInput,
  Pressable,
  View,
  StyleSheet,
  ActivityIndicator,
  TextInputProps,
} from "react-native";
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      style={[
        s.button,
        secondary && s.secondary,
        disabled && { opacity: 0.45 },
      ]}
      onPress={onPress}
    >
      <Text style={[s.buttonText, secondary && { color: "#16845b" }]}>
        {title}
      </Text>
    </Pressable>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#8a969d"
        style={[
          s.input,
          props.multiline && { minHeight: 80, textAlignVertical: "top" },
        ]}
        {...props}
      />
    </View>
  );
}
export const Status = ({ value }: { value: string }) => (
  <Text style={s.status}>
    {value.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase())}
  </Text>
);
export const Empty = ({ text }: { text: string }) => (
  <Text style={s.empty}>{text}</Text>
);
export const Loading = () => (
  <ActivityIndicator style={{ margin: 30 }} color="#16845b" />
);
export const num = (v: any) =>
  Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
export const date = (v: string) => new Date(v).toLocaleString();
export const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f6f8fa" },
  body: {
    padding: 22,
    maxWidth: 700,
    width: "100%",
    alignSelf: "center",
    paddingBottom: 35,
  },
  brand: { fontSize: 24, fontWeight: "700", color: "#16845b" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#dfe6e9",
    backgroundColor: "white",
  },
  title: {
    fontSize: 29,
    fontWeight: "700",
    color: "#19252d",
    marginBottom: 18,
    letterSpacing: -0.7,
  },
  heading: {
    fontSize: 19,
    fontWeight: "700",
    color: "#19252d",
    marginBottom: 12,
  },
  text: { fontSize: 15, color: "#283740", lineHeight: 23 },
  muted: { fontSize: 13, color: "#64727d", lineHeight: 21 },
  label: { fontSize: 13, fontWeight: "600", color: "#344650", marginBottom: 6 },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#cbd5db",
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 15,
    color: "#19252d",
  },
  button: {
    backgroundColor: "#16845b",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 7,
    minHeight: 47,
  },
  secondary: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#b6cfc3",
  },
  buttonText: { color: "white", fontWeight: "600", fontSize: 15 },
  card: {
    backgroundColor: "white",
    padding: 19,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#dfe6e9",
  },
  error: {
    backgroundColor: "#fce9e8",
    color: "#9b302a",
    padding: 13,
    borderRadius: 8,
    marginVertical: 10,
    lineHeight: 21,
  },
  success: {
    backgroundColor: "#e4f5e9",
    color: "#226338",
    padding: 13,
    borderRadius: 8,
    marginVertical: 10,
    lineHeight: 21,
  },
  status: {
    backgroundColor: "#e5f2ea",
    color: "#18653e",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: "flex-start",
    overflow: "hidden",
    marginVertical: 7,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#dfe6e9",
    paddingBottom: 8,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 10 },
  tabText: { fontSize: 12, color: "#64727d" },
  tabSelected: { color: "#16845b", fontWeight: "700" },
  empty: { padding: 27, textAlign: "center", color: "#64727d", lineHeight: 23 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e3e9ec",
    paddingVertical: 14,
  },
  large: { fontSize: 36, fontWeight: "700", color: "#16845b" },
  photo: { width: 130, height: 110, borderRadius: 9, margin: 5 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#cbd5db",
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: { backgroundColor: "#e4f5e9", borderColor: "#16845b" },
});
