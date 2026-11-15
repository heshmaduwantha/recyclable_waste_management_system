import React, { useState } from "react";
import { Text, View, Image, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Pickup, User } from "../../shared/contracts";
import { api, evidenceSource } from "./api";
import { locate, navigate } from "./location";
import { Button, Field, Status, s, num, date } from "./ui";
export function Collection({
  pickup,
  user,
  refresh,
  back,
}: {
  pickup: Pickup;
  user: User;
  refresh: () => Promise<void>;
  back: () => void;
}) {
  const [p, P] = useState(pickup),
    [busy, B] = useState(false),
    [error, E] = useState(""),
    [message, M] = useState(""),
    [weights, W] = useState<Record<string, string>>({});
  async function update() {
    P(await api("/pickups/" + p.id));
    await refresh();
  }
  async function action(path: string, body: any = {}) {
    B(true);
    E("");
    M("");
    try {
      const r = await api(path, body);
      await update();
      if (r.status === "review_required")
        M(
          "Saved for administrator review. Points will be credited only after approval.",
        );
      else if (r.status === "completed")
        M(`${num(r.earned_points)} eco-points credited.`);
    } catch (e: any) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  async function photo(camera: boolean) {
    B(true);
    E("");
    try {
      if (camera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted)
          throw Error("Allow camera permission to take collection evidence.");
      }
      const result = camera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.65,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.65,
          });
      if (result.canceled) return;
      const asset = result.assets[0];
      const form = new FormData();
      if (Platform.OS === "web") {
        const blob = await (await fetch(asset.uri)).blob();
        form.append("photo", blob, asset.fileName || "collection.jpg");
      } else
        form.append("photo", {
          uri: asset.uri,
          name: asset.fileName || "collection.jpg",
          type: asset.mimeType || "image/jpeg",
        } as any);
      await api(`/pickups/${p.id}/evidence`, form);
      await update();
      M("Photo uploaded.");
    } catch (e: any) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  async function complete() {
    B(true);
    E("");
    try {
      const items = p.items.map((i) => {
        const text = weights[i.category];
        if (!text?.trim())
          throw Error(`Enter a verified weight for ${i.category}.`);
        const weight = Number(text);
        if (!Number.isFinite(weight) || weight < 0)
          throw Error("Enter valid weights.");
        return { category: i.category, weight };
      });
      const gps = await locate();
      const result = await api(`/pickups/${p.id}/complete`, { ...gps, items });
      await update();
      M(
        result.status === "review_required"
          ? "Collection saved for GPS review. No points credited yet."
          : `${num(result.earned_points)} eco-points credited.`,
      );
    } catch (e: any) {
      E(e.message);
    } finally {
      B(false);
    }
  }
  return (
    <View>
      <Button title="← Back to collections" secondary onPress={back} />
      <Text style={[s.title, { marginTop: 18 }]}>Collection details</Text>
      <Status value={p.status} />
      <Text style={s.muted}>
        #{p.id.slice(0, 8)} · {date(p.created_at)}
      </Text>
      <View style={s.card}>
        <Text style={s.heading}>{p.customer_name}</Text>
        <Text style={s.text}>{p.address}</Text>
        <Text style={s.muted}>{p.customer_phone}</Text>
        <Text style={s.muted}>Picker: {p.picker_name || "Not assigned"}</Text>
        {p.notes ? <Text style={s.text}>{p.notes}</Text> : null}
      </View>
      <View style={s.card}>
        {p.items.map((i) => (
          <View key={i.category} style={s.divider}>
            <Text style={s.heading}>
              {i.category.charAt(0).toUpperCase() + i.category.slice(1)}
            </Text>
            <Text style={s.muted}>Estimated: {num(i.estimated_weight)} kg</Text>
            {i.actual_weight !== null ? (
              <Text style={s.text}>
                Verified: {num(i.actual_weight)} kg · {num(i.points)} points
              </Text>
            ) : null}
            {user.role === "picker" && p.status === "in_progress" ? (
              <Field
                label={`${i.category} verified weight (kg)`}
                value={weights[i.category] || ""}
                onChangeText={(v) => W({ ...weights, [i.category]: v })}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            ) : null}
          </View>
        ))}
      </View>
      {p.review_reason ? <Text style={s.error}>{p.review_reason}</Text> : null}
      {p.review_note ? (
        <Text style={s.muted}>Admin review: {p.review_note}</Text>
      ) : null}
      {p.status === "completed" ? (
        <Text style={s.success}>
          {num(p.earned_points)} eco-points credited
        </Text>
      ) : null}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {p.evidence.map((e) => (
          <Image
            key={e.id}
            source={evidenceSource(e.id)}
            style={s.photo}
            accessibilityLabel="Collection photo evidence"
          />
        ))}
      </View>
      {user.role === "picker" ? (
        <>
          <Button
            title="Navigate with Google Maps"
            secondary
            onPress={() =>
              navigate(p.latitude, p.longitude).catch((e) => E(e.message))
            }
          />
          {p.status === "assigned" ? (
            <Button
              title="Start collection"
              disabled={busy}
              onPress={() => action(`/pickups/${p.id}/start`)}
            />
          ) : null}
          {p.status === "in_progress" ? (
            <>
              <Text style={s.muted}>
                Record the weight for each material and upload a JPEG or PNG
                photo. Your current GPS location is verified when you complete
                the job.
              </Text>
              {Platform.OS !== "web" ? (
                <Button
                  title="Take evidence photo"
                  disabled={busy}
                  secondary
                  onPress={() => photo(true)}
                />
              ) : null}
              <Button
                title="Upload collection photo"
                secondary
                disabled={busy || p.evidence.length >= 5}
                onPress={() => photo(false)}
              />
              <Button
                title={busy ? "Saving…" : "Verify location & complete"}
                disabled={busy || !p.evidence.length}
                onPress={complete}
              />
            </>
          ) : null}
        </>
      ) : p.status === "pending" ? (
        <Button
          title="Cancel pickup request"
          secondary
          disabled={busy}
          onPress={() => action(`/pickups/${p.id}/cancel`)}
        />
      ) : null}
      {error ? (
        <Text style={s.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
      {message ? <Text style={s.success}>{message}</Text> : null}
    </View>
  );
}
