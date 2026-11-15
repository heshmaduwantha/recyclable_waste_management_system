import React, { useState } from "react";
import { Text, View } from "react-native";
import { api, session } from "./api";
import { locate } from "./location";
import { Button, Field, s } from "./ui";
import { User } from "../../shared/contracts";
export function Auth({ onLogin }: { onLogin: (u: User) => void }) {
  const [register, R] = useState(false),
    [identifier, I] = useState(""),
    [password, P] = useState(""),
    [name, N] = useState(""),
    [phone, H] = useState(""),
    [address, A] = useState(""),
    [busy, B] = useState(false),
    [error, E] = useState(""),
    [coords, C] = useState<any>(null);
  async function login() {
    B(true);
    E("");
    try {
      if (register && !coords)
        throw Error("Capture your collection location first.");
      const d = await api(
        "/auth/" + (register ? "register" : "login"),
        register
          ? { name, phone, password, address, ...coords }
          : { identifier, password },
      );
      await session(d.token);
      onLogin(d.user);
    } catch (e: any) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  return (
    <View>
      <Text style={s.title}>
        {register ? "Create your account" : "Welcome back"}
      </Text>
      <Text style={[s.muted, { marginBottom: 24 }]}>
        {register
          ? "Start recycling from your doorstep."
          : "Sign in to your EcoCollect account."}
      </Text>
      {register ? (
        <>
          <Field label="Full name" value={name} onChangeText={N} />
          <Field
            label="Mobile number"
            value={phone}
            onChangeText={H}
            keyboardType="phone-pad"
            placeholder="0771234567"
          />
          <Field
            label="Collection address"
            value={address}
            onChangeText={A}
            multiline
          />
          <Button
            title={coords ? "✓ Location captured" : "Use current location"}
            secondary
            disabled={busy}
            onPress={async () => {
              B(true);
              try {
                C(await locate());
                E("");
              } catch (e: any) {
                E(e.message);
              } finally {
                B(false);
              }
            }}
          />
        </>
      ) : (
        <Field
          label="Phone or email"
          value={identifier}
          onChangeText={I}
          autoCapitalize="none"
          autoComplete="username"
        />
      )}
      <Field
        label="Password"
        value={password}
        onChangeText={P}
        secureTextEntry
        autoComplete={register ? "new-password" : "current-password"}
      />
      {error ? (
        <Text style={s.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
      <Button
        title={busy ? "Please wait…" : register ? "Create account" : "Sign in"}
        disabled={busy}
        onPress={login}
      />
      <Button
        secondary
        title={
          register ? "Already registered? Sign in" : "Create a customer account"
        }
        disabled={busy}
        onPress={() => {
          R(!register);
          E("");
        }}
      />
    </View>
  );
}
