#!/bin/sh
set -eu
TASK_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
TASK_LOGS="$TASK_ROOT/work/logs"
mkdir -p "$TASK_LOGS"
TASK_PIDS=""
trap '[ -z "$TASK_PIDS" ] || kill $TASK_PIDS 2>/dev/null || true' EXIT INT TERM
# This workspace has its own PostgreSQL instance, independent of installed services.
TASK_PG="$TASK_ROOT/../runtime/postgres"
if [ -d "$TASK_PG" ] && [ -x /Library/PostgreSQL/16/bin/pg_ctl ]; then
 /Library/PostgreSQL/16/bin/pg_ctl -D "$TASK_PG" status >/dev/null 2>&1 || /Library/PostgreSQL/16/bin/pg_ctl -D "$TASK_PG" -l "$TASK_ROOT/../runtime/postgres.log" -o '-p 55432 -h 127.0.0.1 -k /tmp' start
fi
start_service() {
 TASK_PORT="$1"; TASK_DIR="$2"; shift 2
 TASK_CHECK=""
 if [ "$TASK_PORT" = 4000 ]; then TASK_CHECK="/health"; fi
 if curl -fsS "http://localhost:$TASK_PORT$TASK_CHECK" >/dev/null 2>&1; then return; fi
 (cd "$TASK_ROOT/$TASK_DIR" && exec "$@" > "$TASK_LOGS/$TASK_DIR.log" 2>&1) &
 TASK_PIDS="$TASK_PIDS $!"
}
start_service 4000 backend node dist/server.js
start_service 5173 admin-web node node_modules/vite/bin/vite.js --host 0.0.0.0
start_service 8081 mobile-app node node_modules/expo/bin/cli start --go --web --port 8081
printf 'Web: http://localhost:5173\nMobile: http://localhost:8081\nAPI: http://localhost:4000/health\nLogs: %s\n' "$TASK_LOGS"

# Keep service processes owned by this terminal until it is stopped.
wait
