import { useState } from "react";
import VisionPage from "@/pages/VisionPage";
import RequerimientosPage from "@/pages/RequerimientosPage";
import BacklogPage from "@/pages/BacklogPage";
import ArquitecturaPage from "@/pages/ArquitecturaPage";
import ModeloDatosPage from "@/pages/ModeloDatosPage";
import UIUXPage from "@/pages/UIUXPage";
import ScrumPage from "@/pages/ScrumPage";
import DevOpsPage from "@/pages/DevOpsPage";
import AzureGuiePage from "@/pages/AzureGuiePage";

const sections = [
  { id: "portada", label: "Portada", icon: "🏨", shortLabel: "Portada" },
  { id: "vision", label: "4.1 Visión del Producto", icon: "📋", shortLabel: "Visión" },
  { id: "requerimientos", label: "4.2 Requerimientos", icon: "📝", shortLabel: "Req." },
  { id: "backlog", label: "4.3 Product Backlog", icon: "📊", shortLabel: "Backlog" },
  { id: "arquitectura", label: "4.4 Arquitectura", icon: "🏗️", shortLabel: "Arq." },
  { id: "datos", label: "4.4.3 Modelo de Datos", icon: "🗄️", shortLabel: "Datos" },
  { id: "uiux", label: "4.5 UI/UX", icon: "🎨", shortLabel: "UI/UX" },
  { id: "scrum", label: "4.6 Scrum", icon: "⚡", shortLabel: "Scrum" },
  { id: "devops", label: "4.6.3 DevOps CI/CD", icon: "🔄", shortLabel: "DevOps" },
];

function CoverPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 py-12">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
          Universidad Mariano Gálvez de Guatemala
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Sistema de Reservas
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary">
          para Hotel o Casa Rural
        </h2>
        <p className="text-muted-foreground mt-3">
          Facultad de Ingeniería en Sistemas de Información — Ingeniería de Software
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl w-full space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Estudiante</div>
            <div className="font-semibold">Hazel Ruvi Pérez Cárcamo</div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Carné</div>
            <div className="font-mono font-semibold">0900-21-13727</div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Correo Institucional</div>
            <div className="font-semibold text-primary text-xs">hperezc16@miumg.edu.gt</div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Fase</div>
            <div className="font-semibold">Fase I — Trabajo Individual</div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Modalidad</div>
            <div className="font-semibold">Sprint 0 — Planificación</div>
          </div>
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Fecha</div>
            <div className="font-semibold">Abril 2025</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full">
        {[
          { num: "8", label: "Entregables", color: "bg-blue-50 border-blue-200 text-blue-700" },
          { num: "15", label: "Historias de Usuario", color: "bg-green-50 border-green-200 text-green-700" },
          { num: "5", label: "Épicas", color: "bg-orange-50 border-orange-200 text-orange-700" },
          { num: "110", label: "Story Points", color: "bg-purple-50 border-purple-200 text-purple-700" },
        ].map((stat) => (
          <div key={stat.label} className={`border rounded-xl p-4 text-center ${stat.color}`}>
            <div className="text-3xl font-bold">{stat.num}</div>
            <div className="text-xs font-semibold mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl w-full">
        <h3 className="font-bold text-center mb-4 text-muted-foreground uppercase text-xs tracking-wider">Tabla de Contenidos — Entregables Fase I</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { num: "4.1", name: "Documento de Visión del Producto", pts: "1.5 pts" },
            { num: "4.2", name: "Requerimientos (HU + No Funcionales)", pts: "2.0 pts" },
            { num: "4.3", name: "Product Backlog Priorizado y Estimado", pts: "1.0 pt" },
            { num: "4.4", name: "Diseño de Arquitectura + Stack Tecnológico", pts: "3.0 pts" },
            { num: "4.4.3", name: "Modelo de Datos (ER + Diccionario)", pts: "inc." },
            { num: "4.5", name: "Diseño UI/UX — Wireframes y Flujos", pts: "3.0 pts" },
            { num: "4.6", name: "Planificación Scrum (DoR, DoD, Sprints)", pts: "0.5 pts" },
            { num: "4.6.3", name: "Estrategia DevOps (Branching + CI/CD)", pts: "2.0 pts" },
          ].map((item) => (
            <div key={item.num} className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-primary">{item.num}</span>
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-xs font-semibold text-muted-foreground ml-2 shrink-0">{item.pts}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-3 pr-2">
          <div className="font-bold text-sm">Total: <span className="text-primary">15.0 pts</span> <span className="text-muted-foreground text-xs">(incluye 5 pts del examen final)</span></div>
        </div>
      </div>
    </div>
  );
}

function PrintAllPages() {
  return (
    <div className="print-all-pages space-y-0">
      <div className="print-page">
        <CoverPage />
      </div>
      <div className="print-page print-break">
        <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border">4.1 Visión del Producto</h2>
        <VisionPage />
      </div>
      <div className="print-page print-break">
        <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border">4.2 Requerimientos del Sistema</h2>
        <RequerimientosPage />
      </div>
      <div className="print-page print-break">
        <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border">4.3 Product Backlog</h2>
        <BacklogPage />
      </div>
      <div className="print-page print-break">
        <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border">4.4 Diseño de Arquitectura de Software</h2>
        <ArquitecturaPage />
      </div>
      <div className="print-page print-break">
        <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border">4.4.3 Modelo de Datos</h2>
        <ModeloDatosPage />
      </div>
      <div className="print-page print-break">
        <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border">4.5 Diseño de UI/UX</h2>
        <UIUXPage />
      </div>
      <div className="print-page print-break">
        <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border">4.6 Planificación Scrum</h2>
        <ScrumPage />
      </div>
      <div className="print-page print-break">
        <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border">4.6.3 Estrategia de DevOps</h2>
        <DevOpsPage />
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("portada");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handleExportPDF = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 500);
  };

  const renderPage = () => {
    if (active === "azure") return <AzureGuiePage />;
    switch (active) {
      case "vision": return <VisionPage />;
      case "requerimientos": return <RequerimientosPage />;
      case "backlog": return <BacklogPage />;
      case "arquitectura": return <ArquitecturaPage />;
      case "datos": return <ModeloDatosPage />;
      case "uiux": return <UIUXPage />;
      case "scrum": return <ScrumPage />;
      case "devops": return <DevOpsPage />;
      default: return <CoverPage />;
    }
  };

  const activeSection = [...sections, { id: "azure", label: "Guía Azure DevOps", icon: "☁️", shortLabel: "Azure" }].find(s => s.id === active);

  if (isPrintMode) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <PrintAllPages />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-sidebar text-sidebar-foreground border-b border-sidebar-border sticky top-0 z-50 shadow-md no-print">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              ☰
            </button>
            <div>
              <div className="font-bold text-sm leading-tight">Sistema de Reservas Hotel</div>
              <div className="text-sidebar-foreground/60 text-xs">Fase I — Ingeniería de Software | UMG</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  active === s.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                {s.icon} {s.shortLabel}
              </button>
            ))}
            <button
              onClick={() => setActive("azure")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                active === "azure"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              ☁️ Azure
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              📄 Exportar PDF
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-sidebar border-t border-sidebar-border p-2 grid grid-cols-3 gap-1">
            {[...sections, { id: "azure", label: "Guía Azure", icon: "☁️", shortLabel: "Azure" }].map((s) => (
              <button
                key={s.id}
                onClick={() => { setActive(s.id); setMobileOpen(false); }}
                className={`px-2 py-2 rounded-lg text-xs font-semibold text-center transition-colors ${
                  active === s.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
                }`}
              >
                <div>{s.icon}</div>
                <div>{s.shortLabel}</div>
              </button>
            ))}
            <button
              onClick={() => { handleExportPDF(); setMobileOpen(false); }}
              className="px-2 py-2 rounded-lg text-xs font-semibold text-center bg-green-600 text-white"
            >
              <div>📄</div>
              <div>PDF</div>
            </button>
          </div>
        )}
      </header>

      {active !== "portada" && (
        <div className="bg-muted/30 border-b border-border px-6 py-2 text-xs text-muted-foreground flex items-center gap-2 no-print">
          <button onClick={() => setActive("portada")} className="hover:text-primary transition-colors">Portada</button>
          <span>›</span>
          <span className="text-foreground font-medium">{activeSection?.label}</span>
        </div>
      )}

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {renderPage()}
      </main>

      <footer className="bg-sidebar text-sidebar-foreground/60 text-xs text-center py-3 border-t border-sidebar-border no-print">
        Universidad Mariano Gálvez de Guatemala — Ingeniería de Software — Fase I — 2025 |
        Sistema de Reservas para Hotel o Casa Rural | Hazel Ruvi Pérez Cárcamo — 0900-21-13727
      </footer>
    </div>
  );
}
