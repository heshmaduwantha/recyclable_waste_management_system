import React, { useState } from "react";
import { Text, View } from "react-native";
import { User, Wallet } from "../../shared/contracts";
import { api } from "./api";
import { locate } from "./location";
import { Button, Field, s, num, date } from "./ui";
export function RequestPickup({
  user,
  done,
  back,
}: {
  user: User;
  done: () => Promise<void>;
  back: () => void;
}) {
  const [address, A] = useState(user.address),
    [coords, C] = useState({
      latitude: user.latitude,
      longitude: user.longitude,
    }),
    [notes, N] = useState(""),
    [weights, W] = useState<Record<string, string>>({}),
    [error, E] = useState(""),
    [busy, B] = useState(false);
  async function submit() {
    B(true);
    E("");
    try {
      if (coords.latitude === null || coords.longitude === null)
        throw Error("Capture the collection location first.");
      const items = Object.entries(weights)
        .filter(([, w]) => Number(w) > 0)
        .map(([category, w]) => ({ category, estimated_weight: Number(w) }));
      if (!items.length)
        throw Error("Enter the estimated weight for at least one material.");
      await api("/pickups", { address, ...coords, notes, items });
      await done();
      back();
    } catch (e: any) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  return (
    <View>
      <Button title="← Back" secondary onPress={back} />
      <Text style={s.title}>Request a pickup</Text>
      <Text style={[s.muted, { marginBottom: 20 }]}>
        Enter approximate weights. Your picker verifies the collection.
      </Text>
      {["plastic", "glass", "polythene", "metal"].map((c) => (
        <Field
          key={c}
          label={`${c.charAt(0).toUpperCase() + c.slice(1)} (kg)`}
          keyboardType="decimal-pad"
          value={weights[c] || ""}
          onChangeText={(v) => W({ ...weights, [c]: v })}
          placeholder="0.00"
        />
      ))}
      <Field
        label="Collection address"
        value={address}
        onChangeText={A}
        multiline
      />
      <Button
        title="Use current location"
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
      <Text style={s.muted}>
        {coords.latitude?.toFixed(5)}, {coords.longitude?.toFixed(5)} · Confirm
        this is your pickup location.
      </Text>
      <Field
        label="Notes (optional)"
        value={notes}
        onChangeText={N}
        multiline
        maxLength={500}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
      <Button
        title={busy ? "Submitting…" : "Submit pickup request"}
        onPress={submit}
        disabled={busy}
      />
    </View>
  );
}
export function WalletView({ wallet }: { wallet: Wallet | null }) {
  return (
    <View>
      <Text style={s.title}>Your wallet</Text>
      <View style={s.card}>
        <Text style={s.muted}>Eco-points balance</Text>
        <Text style={s.large}>{num(wallet?.balance)}</Text>
        <Text style={s.muted}>
          {num(wallet?.weight)} kg recycled · {wallet?.collections || 0}{" "}
          collections
        </Text>
      </View>
      <Text style={[s.heading, { marginTop: 20 }]}>Transaction history</Text>
      {wallet?.transactions.length ? (
        wallet.transactions.map((t) => (
          <View style={s.card} key={t.id}>
            <View style={s.row}>
              <Text style={s.heading}>Collection reward</Text>
              <Text style={{ color: "#16845b", fontWeight: "700" }}>
                +{num(t.points)}
              </Text>
            </View>
            <Text style={s.muted}>{date(t.created_at)}</Text>
            {t.items.map((i) => (
              <Text key={i.category} style={s.muted}>
                {i.category}: {num(i.actual_weight)} kg × {num(i.rate_snapshot)}{" "}
                points/kg
              </Text>
            ))}
          </View>
        ))
      ) : (
        <Text style={s.empty}>Points appear after a verified collection.</Text>
      )}
    </View>
  );
}
