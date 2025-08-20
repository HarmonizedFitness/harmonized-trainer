"use client";
import { useEffect, useState } from "react";

type Assignment = {
  id: string; client_id: string; template_id?: string | null;
  name?: string | null; notes?: string | null; status: string;
  due_at?: string | null; workout_id?: string | null;
};

export default function AssignmentsTest() {
  const [clientId, setClientId] = useState("");
  const [templateId, setTemplateId] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [notes, setNotes] = useState("");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/assignments").then(r => r.json()).then(setAssignments);
    fetch("/api/clients").then(r => r.json()).then(setClients).catch(()=>{});
    fetch("/api/templates").then(r => r.json()).then(setTemplates).catch(()=>{});
  }, []);

  async function createAssignment() {
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        template_id: templateId || undefined,
        name: name || undefined,
        notes: notes || undefined,
        due_at: dueAt || undefined,
      })
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error?.message ?? JSON.stringify(data)); return; }
    setAssignments(a => [data, ...a]);
  }

  async function startAssignment(id: string) {
    const res = await fetch(`/api/assignments/${id}/start`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) { alert(data.error ?? "start failed"); return; }
    setAssignments(a => a.map(x => x.id === id ? { ...x, workout_id: data.workout_id, status: "in_progress" } : x));
  }

  async function completeAssignment(id: string) {
    const res = await fetch(`/api/assignments/${id}/complete`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) { alert(data.error ?? "complete failed"); return; }
    setAssignments(a => a.map(x => x.id === id ? { ...x, status: "completed" } : x));
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Assignments (Test)</h1>

      <div className="space-y-2 border rounded-lg p-4">
        <div className="grid grid-cols-2 gap-2">
          <select className="border p-2 rounded" value={clientId} onChange={e=>setClientId(e.target.value)}>
            <option value="">Select client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name ?? c.email}</option>)}
          </select>

          <select className="border p-2 rounded" value={templateId ?? ""} onChange={e=>setTemplateId(e.target.value || undefined)}>
            <option value="">(Optional) Template</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <input className="border p-2 rounded col-span-2" placeholder="(Optional) Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="border p-2 rounded" type="datetime-local" value={dueAt} onChange={e=>setDueAt(e.target.value)} />
          <input className="border p-2 rounded" placeholder="(Optional) Notes" value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>
        <button className="px-3 py-2 bg-black text-white rounded" onClick={createAssignment} disabled={!clientId}>Create assignment</button>
      </div>

      <ul className="space-y-3">
        {assignments.map(a => (
          <li key={a.id} className="border rounded p-3 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium">{a.name ?? "(no name)"} • <span className="text-sm">{a.status}</span></div>
              <div className="text-sm">client: {a.client_id} {a.template_id ? `• template: ${a.template_id}` : ""}</div>
              {a.workout_id && <div className="text-sm">workout: {a.workout_id}</div>}
            </div>
            <div className="flex gap-2">
              <button className="px-2 py-1 border rounded" onClick={()=>startAssignment(a.id)}>Start</button>
              <button className="px-2 py-1 border rounded" onClick={()=>completeAssignment(a.id)}>Complete</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
