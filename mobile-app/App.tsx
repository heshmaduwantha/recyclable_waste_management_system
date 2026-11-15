import React, { useCallback, useEffect, useState } from "react";
import {
  AppState,
  Text,
  View,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { User, Pickup, Wallet, Badge, Notice } from "../shared/contracts";
import { api, session, onExpired } from "./src/api";
import { Auth } from "./src/Auth";
import { Collection } from "./src/Collection";
import { RequestPickup, WalletView } from "./src/Customer";
import { Profile } from "./src/Profile";
import { registerPush } from "./src/notifications";
import { Button, Status, Empty, Loading, s, num, date } from "./src/ui";
function Main() {
  const [user, U] = useState<User | null>(null),
    [boot, B] = useState(true),
    [tab, T] = useState("Home"),
    [pickups, P] = useState<Pickup[]>([]),
    [wallet, W] = useState<Wallet | null>(null),
    [badges, G] = useState<Badge[]>([]),
    [notices, N] = useState<Notice[]>([]),
    [detail, D] = useState<Pickup | null>(null),
    [request, Q] = useState(false),
    [notifying, V] = useState(false),
    [busy, S] = useState(false),
    [error, E] = useState(""),
    [pushToken, F] = useState<string | null>(null);
  const logout = useCallback(async () => {
    if (pushToken)
      await api("/devices", { token: pushToken }, "DELETE").catch(() => {});
    await session("");
    U(null);
    P([]);
    W(null);
    G([]);
    N([]);
    D(null);
    Q(false);
    V(false);
    F(null);
  }, [pushToken]);
  useEffect(() => {
    onExpired(() => {
      void session("");
      U(null);
      D(null);
      Q(false);
    });
    session()
      .then((t) =>
        t
          ? api<User>("/me").then((u) => {
              U(u);
              T(u.role === "picker" ? "Jobs" : "Home");
            })
          : null,
      )
      .catch(() => session(""))
      .finally(() => B(false));
  }, []);
  const refresh = useCallback(async () => {
    if (!user) return;
    S(true);
    try {
      const [p, n, ...extra] = await Promise.all([
        api<Pickup[]>("/pickups"),
        api<Notice[]>("/notifications"),
        ...(user.role === "customer" ? [api("/wallet"), api("/badges")] : []),
      ]);
      P(p);
      N(n);
      if (extra.length) {
        W(extra[0]);
        G(extra[1]);
      }
      E("");
    } catch (e: any) {
      E(e.message);
      throw e;
    } finally {
      S(false);
    }
  }, [user?.id]);
  useEffect(() => {
    if (!user) return;
    void refresh().catch(() => {});
    const timer = setInterval(() => {
      if (AppState.currentState === "active") void refresh().catch(() => {});
    }, 5000);
    return () => clearInterval(timer);
  }, [refresh, user?.id]);
  useEffect(() => {
    if (user?.role === "picker")
      registerPush()
        .then(F)
        .catch(() => {});
  }, [user?.id]);
  if (boot) return <Loading />;
  const tabs =
    user?.role === "picker"
      ? ["Jobs", "History", "Profile"]
      : ["Home", "History", "Wallet", "Profile"];
  const rows = pickups.filter((p) =>
    tab === "History"
      ? ["completed", "cancelled"].includes(p.status)
      : !["completed", "cancelled"].includes(p.status),
  );
  return (
    <SafeAreaView style={s.root}>
      <StatusBar style="dark" />
      <View style={s.header}>
        <Text style={s.brand}>♻ EcoCollect</Text>
        {user ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => {
              V(!notifying);
              D(null);
              Q(false);
              api("/notifications/read", {})
                .then(() => refresh())
                .catch(() => {});
            }}
          >
            <Text style={{ color: "#16845b", fontWeight: "600" }}>
              Updates{notices.some((n) => !n.is_read) ? " •" : ""}
            </Text>
          </Pressable>
        ) : null}
      </View>
      <ScrollView
        contentContainerStyle={s.body}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          user ? (
            <RefreshControl
              refreshing={busy}
              onRefresh={() => refresh().catch(() => {})}
            />
          ) : undefined
        }
      >
        {!user ? (
          <Auth
            onLogin={(u) => {
              U(u);
              T(u.role === "picker" ? "Jobs" : "Home");
            }}
          />
        ) : user.role === "admin" ? (
          <>
            <Text style={s.title}>Admin account</Text>
            <Text style={s.text}>
              Use the web dashboard to manage requests, pickers, rates and
              badges.
            </Text>
            <Button title="Sign out" onPress={logout} />
          </>
        ) : notifying ? (
          <>
            <Text style={s.title}>Notifications</Text>
            <Button title="← Back" secondary onPress={() => V(false)} />
            {notices.length ? (
              notices.map((n) => (
                <View style={s.card} key={n.id}>
                  <Text style={s.heading}>{n.title}</Text>
                  <Text style={s.text}>{n.message}</Text>
                  <Text style={s.muted}>{date(n.created_at)}</Text>
                </View>
              ))
            ) : (
              <Empty text="You are all caught up." />
            )}
          </>
        ) : detail ? (
          <Collection
            key={detail.id}
            pickup={detail}
            user={user}
            refresh={refresh}
            back={() => D(null)}
          />
        ) : request ? (
          <RequestPickup user={user} done={refresh} back={() => Q(false)} />
        ) : (
          <>
            {error ? (
              <Text style={s.error} accessibilityRole="alert">
                {error}
              </Text>
            ) : null}
            {tab === "Profile" ? (
              <Profile
                key={user.id}
                user={user}
                badges={badges}
                update={U}
                logout={logout}
              />
            ) : tab === "Wallet" ? (
              <WalletView wallet={wallet} />
            ) : (
              <>
                <Text style={s.title}>
                  {tab === "History"
                    ? "Collection history"
                    : user.role === "picker"
                      ? "Assigned collections"
                      : "Let's recycle"}
                </Text>
                {tab === "Home" ? (
                  <>
                    <View style={[s.card, s.row]}>
                      <View>
                        <Text style={s.muted}>Points balance</Text>
                        <Text style={s.large}>{num(wallet?.balance)}</Text>
                      </View>
                      <View>
                        <Text style={s.muted}>Total weight</Text>
                        <Text style={s.large}>{num(wallet?.weight)} kg</Text>
                      </View>
                    </View>
                    <Button
                      title="＋ Request a pickup"
                      onPress={() => Q(true)}
                    />
                    <Text style={[s.heading, { marginTop: 25 }]}>
                      Current pickups
                    </Text>
                  </>
                ) : null}
                {rows.length ? (
                  rows.map((p) => (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Collection ${p.id.slice(0, 8)}`}
                      style={s.card}
                      key={p.id}
                      onPress={() => D(p)}
                    >
                      <Text style={s.heading}>
                        {user.role === "picker"
                          ? p.customer_name
                          : date(p.created_at)}
                      </Text>
                      <Status value={p.status} />
                      <Text style={s.muted}>
                        {p.items
                          .map(
                            (i) =>
                              `${i.category}: ${num(i.estimated_weight)} kg`,
                          )
                          .join(" · ")}
                      </Text>
                      <Text style={s.muted}>{p.address}</Text>
                      <Text style={{ color: "#16845b", marginTop: 10 }}>
                        View details →
                      </Text>
                    </Pressable>
                  ))
                ) : (
                  <Empty
                    text={
                      tab === "History"
                        ? "Completed collections appear here."
                        : user.role === "picker"
                          ? "No assigned collections. New jobs will appear here."
                          : "No current pickups. Request your first collection."
                    }
                  />
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
      {user && user.role !== "admin" ? (
        <View style={s.tabs}>
          {tabs.map((t) => (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t }}
              key={t}
              style={s.tab}
              onPress={() => {
                T(t);
                D(null);
                Q(false);
                V(false);
              }}
            >
              <Text style={[s.tabText, tab === t && s.tabSelected]}>{t}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </SafeAreaView>
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}
