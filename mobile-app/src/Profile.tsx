import React, { useState } from "react";
import { Text, View } from "react-native";
import { User, Badge } from "../../shared/contracts";
import { api } from "./api";
import { locate } from "./location";
import { Button, Field, s, date } from "./ui";
export function Profile({
  user,
  badges,
  update,
  logout,
}: {
  user: User;
  badges: Badge[];
  update: (u: User) => void;
  logout: () => void;
}) {
  const [name, N] = useState(user.name),
    [address, A] = useState(user.address),
    [coords, C] = useState({
      latitude: user.latitude,
      longitude: user.longitude,
    }),
    [busy, B] = useState(false),
    [error, E] = useState(""),
    [message, M] = useState("");
  async function save() {
    B(true);
    E("");
    try {
      update(await api("/me", { name, address, ...coords }, "PUT"));
      M("Profile updated.");
    } catch (e: any) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  return (
    <View>
      <Text style={s.title}>Your profile</Text>
      <Text style={[s.muted, { marginBottom: 20 }]}>
        {user.phone} · {user.role}
      </Text>
      <Field label="Full name" value={name} onChangeText={N} />
      <Field label="Address" value={address} onChangeText={A} multiline />
      <Button
        title="Capture current location"
        secondary
        disabled={busy}
        onPress={async () => {
          B(true);
          try {
            C(await locate());
          } catch (e: any) {
            E(e.message);
          } finally {
            B(false);
          }
        }}
      />
      <Text style={s.muted}>
        {coords.latitude?.toFixed(5)}, {coords.longitude?.toFixed(5)}
      </Text>
      <Button title="Save profile" disabled={busy} onPress={save} />
      {error ? <Text style={s.error}>{error}</Text> : null}
      {message ? <Text style={s.success}>{message}</Text> : null}
      {user.role === "customer" ? (
        <>
          <Text style={[s.heading, { marginTop: 25 }]}>Your badges</Text>
          {badges.map((b) => (
            <View
              key={b.id}
              style={[s.card, !b.awarded_at && { opacity: 0.6 }]}
            >
              <Text style={s.heading}>♧ {b.name}</Text>
              <Text style={s.text}>{b.description}</Text>
              <Text style={s.muted}>
                {b.awarded_at
                  ? "Awarded " + date(b.awarded_at)
                  : "Not earned yet"}
              </Text>
            </View>
          ))}
        </>
      ) : null}
      <Button title="Sign out" secondary onPress={logout} />
    </View>
  );
}
