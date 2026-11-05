/**
 * Doble de prueba (stub) de la capa de datos @workspace/db.
 *
 * Por qué se aísla esta dependencia:
 * - Las rutas de Express hablan con PostgreSQL a través de Drizzle ORM. En una
 *   prueba unitaria queremos verificar SOLO la lógica de la ruta (validaciones,
 *   códigos HTTP, cálculos), no la base de datos.
 * - Sin el stub, cada prueba necesitaría una base de datos levantada y datos
 *   precargados, lo que la volvería lenta, frágil y dependiente del orden.
 *
 * Cómo funciona: cada consulta (select/insert/update) se resuelve con el
 * siguiente resultado encolado para la tabla consultada. Así cada prueba define
 * exactamente qué "devuelve" la base de datos.
 */
type Row = Record<string, unknown>;

export const queues: Record<string, Row[][]> = {};
export const calls: { op: string; table: string; payload?: unknown }[] = [];

export function enqueue(table: string, ...results: Row[][]) {
  (queues[table] ??= []).push(...results);
}

export function resetDb() {
  for (const k of Object.keys(queues)) delete queues[k];
  calls.length = 0;
}

function makeTable(name: string) {
  return new Proxy({ __table: name } as Record<string, unknown>, {
    get: (t, p) => (p in t ? t[p as string] : `${name}.${String(p)}`),
  });
}

export const usersTable = makeTable("users");
export const roomsTable = makeTable("rooms");
export const reservationsTable = makeTable("reservations");

function chain(op: string, table?: string) {
  const c: Record<string, unknown> = { table };
  const self = () => c;
  for (const m of ["where", "limit", "orderBy", "returning"]) c[m] = self;
  c.from = (t: { __table: string }) => { c.table = t.__table; return c; };
  c.values = (v: unknown) => { calls.push({ op, table: String(c.table), payload: v }); return c; };
  c.set = (v: unknown) => { calls.push({ op, table: String(c.table), payload: v }); return c; };
  c.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) => {
    const q = queues[String(c.table)] ?? [];
    return Promise.resolve(q.shift() ?? []).then(resolve, reject);
  };
  return c;
}

export const db = {
  select: () => chain("select"),
  insert: (t: { __table: string }) => chain("insert", t.__table),
  update: (t: { __table: string }) => chain("update", t.__table),
};
