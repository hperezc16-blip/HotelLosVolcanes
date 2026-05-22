"""
TRADER.AI - MCP Server
Agente de trading con vision de pantalla en tiempo real
"""

import asyncio
import json
import time
import base64
import threading
import webbrowser
from datetime import datetime
from pathlib import Path

try:
    import anthropic
    import mss
    from PIL import Image
    import websockets
    import requests
    import keyboard
    import io
    import tkinter as tk
    import win32gui
except ImportError as e:
    print(f"[ERROR] Dependencia faltante: {e}")
    print("Ejecuta 1_INSTALAR.bat primero")
    input("Presiona Enter para salir...")
    exit(1)

CONFIG_FILE = Path(__file__).parent / "config.json"
DEFAULT_CONFIG = {
    "anthropic_api_key": "",
    "telegram_bot_token": "",
    "telegram_chat_id": "",
    "analysis_interval": 30,
    "risk_per_trade": 1.5,
    "max_daily_loss": 5.0,
    "hotkey_analyze": "ctrl+shift+a",
    "hotkey_stop": "ctrl+shift+s"
}

def load_config():
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, encoding="utf-8") as f:
            cfg = json.load(f)
        for k, v in DEFAULT_CONFIG.items():
            if k not in cfg:
                cfg[k] = v
        return cfg
    return DEFAULT_CONFIG.copy()

def save_config(cfg):
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)

def error_response(msg):
    return {
        "señal": "SIN_DATOS", "activo": "---", "precio_actual": "---",
        "tendencia": "---", "confianza": 0,
        "razon_principal": msg, "analisis": msg,
        "advertencia_emocional": None,
        "entrada_sugerida": "---", "stop_loss": "---", "take_profit": "---",
        "leccion": msg, "plataforma_detectada": "---",
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "fecha": datetime.now().strftime("%Y-%m-%d")
    }


# ── Captura de pantalla ───────────────────────────────────────────────────────
class ScreenCapture:
    def capture_full(self):
        with mss.mss() as sct:
            monitor = sct.monitors[1]
            shot = sct.grab(monitor)
            img = Image.frombytes("RGB", shot.size, shot.bgra, "raw", "BGRX")
            return self._to_b64(img)

    def _to_b64(self, img):
        img.thumbnail((1280, 720), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=80)
        return base64.b64encode(buf.getvalue()).decode()


# ── Analizador ────────────────────────────────────────────────────────────────
class TradingAnalyzer:
    SYSTEM = """Eres TRADER.AI, analista experto de trading.
Analiza la captura de pantalla y responde SOLO con este JSON, sin texto adicional:
{
  "activo": "par o activo detectado",
  "precio_actual": "precio",
  "tendencia": "ALCISTA|BAJISTA|LATERAL",
  "senial": "COMPRAR|VENDER|ESPERAR|PELIGRO|SIN_DATOS",
  "confianza": 80,
  "razon_principal": "razon corta",
  "analisis": "analisis 3-5 oraciones",
  "advertencia_emocional": null,
  "entrada_sugerida": "precio",
  "stop_loss": "precio",
  "take_profit": "precio",
  "leccion": "leccion de trading",
  "plataforma_detectada": "nombre plataforma"
}
Responde SIEMPRE en espanol. SOLO el JSON."""

    def __init__(self, api_key):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.history = []

    def analyze(self, img_b64, context=""):
        resp = self.client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1000,
            system=self.SYSTEM,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": img_b64}},
                    {"type": "text", "text": f"Analiza esta pantalla. Contexto: {context or 'ninguno'}. Solo el JSON."}
                ]
            }]
        )
        raw = resp.content[0].text.strip()
        if "```" in raw:
            for part in raw.split("```"):
                part = part.strip().lstrip("json").strip()
                if part.startswith("{"):
                    raw = part
                    break
        result = json.loads(raw.strip())
        result["timestamp"] = datetime.now().strftime("%H:%M:%S")
        result["fecha"] = datetime.now().strftime("%Y-%m-%d")
        if "senial" in result:
            result["señal"] = result["senial"]
        if "señal" not in result:
            result["señal"] = "SIN_DATOS"
        self.history.append(result)
        hist_file = Path(__file__).parent / "trading_history.json"
        with open(hist_file, "w", encoding="utf-8") as f:
            json.dump(self.history[-500:], f, indent=2, ensure_ascii=False)
        return result

    def tutor(self, question, last=None):
        ctx = f"\nContexto: {json.dumps(last, ensure_ascii=False)}" if last else ""
        resp = self.client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=500,
            system="Eres tutor experto de trading. Responde en espanol, claro y practico. Max 3 parrafos.",
            messages=[{"role": "user", "content": question + ctx}]
        )
        return resp.content[0].text


# ── Telegram ──────────────────────────────────────────────────────────────────
class Telegram:
    def __init__(self, token, chat_id):
        self.token = token
        self.chat_id = chat_id
        self.ok = bool(token and chat_id)

    def send(self, a):
        if not self.ok:
            return
        sig = a.get("señal", "")
        msg = f"[{sig}] {a.get('activo')} @ {a.get('precio_actual')}\n{a.get('razon_principal')}\nConfianza: {a.get('confianza')}%"
        try:
            requests.post(f"https://api.telegram.org/bot{self.token}/sendMessage",
                         json={"chat_id": self.chat_id, "text": msg}, timeout=5)
        except:
            pass


# ── WebSocket ────────────────────────────────────────────────────────────────
class WSServer:
    def __init__(self, port=8765):
        self.port = port
        self.clients = set()
        self.last = {}

    async def handler(self, ws):
        self.clients.add(ws)
        try:
            if self.last:
                await ws.send(json.dumps(self.last, ensure_ascii=False))
            async for msg in ws:
                pass
        except:
            pass
        finally:
            self.clients.discard(ws)

    async def broadcast(self, data):
        self.last = data
        if self.clients:
            payload = json.dumps(data, ensure_ascii=False)
            await asyncio.gather(*[c.send(payload) for c in self.clients], return_exceptions=True)

    async def start(self):
        async with websockets.serve(self.handler, "localhost", self.port):
            await asyncio.Future()


# ── Overlay ───────────────────────────────────────────────────────────────────
class Overlay:
    def __init__(self):
        self.root = None
        self.lbl_sig = None
        self.lbl_inf = None
        self._dx = 0
        self._dy = 0

    def create(self):
        try:
            self.root = tk.Tk()
            self.root.title("TRADER.AI")
            self.root.geometry("300x85+10+10")
            self.root.attributes("-topmost", True)
            self.root.attributes("-alpha", 0.93)
            self.root.overrideredirect(True)
            self.root.configure(bg="#06090f")

            bar = tk.Frame(self.root, bg="#0d1117", height=20)
            bar.pack(fill="x")
            bar.pack_propagate(False)
            tk.Label(bar, text="TRADER.AI", bg="#0d1117", fg="#00e5b4",
                     font=("Courier New", 8, "bold")).pack(side="left", padx=6, pady=2)
            close = tk.Label(bar, text="X", bg="#0d1117", fg="#ff3b4e",
                             font=("Courier New", 9, "bold"), cursor="hand2")
            close.pack(side="right", padx=6)
            close.bind("<Button-1>", lambda e: self.root.destroy())
            bar.bind("<Button-1>", self._start_drag)
            bar.bind("<B1-Motion>", self._drag)

            self.lbl_sig = tk.Label(self.root, text="INICIANDO...", bg="#06090f",
                                    fg="#ffca28", font=("Courier New", 14, "bold"))
            self.lbl_sig.pack(pady=(5, 0))
            self.lbl_inf = tk.Label(self.root, text="Ctrl+Shift+A para analizar",
                                    bg="#06090f", fg="#4a5568",
                                    font=("Courier New", 8), wraplength=280)
            self.lbl_inf.pack()
            self.root.mainloop()
        except Exception as e:
            print(f"[Overlay] {e}")

    def update(self, a):
        if not self.root:
            return
        try:
            colors = {"COMPRAR":"#00e5b4","VENDER":"#ff3b4e","ESPERAR":"#ffca28",
                      "PELIGRO":"#ff6d3a","SIN_DATOS":"#4a5568"}
            sig = a.get("señal", "?")
            self.root.after(0, lambda: self.lbl_sig.config(
                text=f"{sig}  {a.get('confianza',0)}%",
                fg=colors.get(sig, "#dde4f0")))
            self.root.after(0, lambda: self.lbl_inf.config(
                text=f"{a.get('activo','')}  {(a.get('razon_principal','') or '')[:38]}",
                fg="#718096"))
        except:
            pass

    def _start_drag(self, e):
        self._dx = e.x; self._dy = e.y

    def _drag(self, e):
        if self.root:
            self.root.geometry(f"+{self.root.winfo_x()+e.x-self._dx}+{self.root.winfo_y()+e.y-self._dy}")


# ── Agente principal ──────────────────────────────────────────────────────────
class TradingAgent:
    def __init__(self):
        self.cfg = load_config()
        self.capture = ScreenCapture()
        self.analyzer = None
        self.telegram = None
        self.overlay = Overlay()
        self.ws = WSServer()
        self.running = False
        self.last = {}
        self.loop = None

    def init(self):
        key = self.cfg.get("anthropic_api_key", "")
        if not key or key == "PEGA_AQUI_TU_API_KEY":
            return False
        self.analyzer = TradingAnalyzer(key)
        self.telegram = Telegram(
            self.cfg.get("telegram_bot_token", ""),
            self.cfg.get("telegram_chat_id", "")
        )
        return True

    def analyze_now(self, ctx=""):
        print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Capturando pantalla...")
        try:
            img = self.capture.capture_full()
            print("Analizando con IA...")
            r = self.analyzer.analyze(img, ctx)
            self.last = r
            self._print(r)
            self.overlay.update(r)
            if self.telegram:
                self.telegram.send(r)
            if self.loop:
                asyncio.run_coroutine_threadsafe(self.ws.broadcast(r), self.loop)
            return r
        except Exception as e:
            err_str = str(e)
            if "credit balance" in err_str.lower():
                print("\n[!] Creditos insuficientes.")
                print("    Ve a: platform.claude.com/settings/billing")
                print("    Los creditos pueden tardar 5-10 min en activarse tras el pago.\n")
                r = error_response("Creditos insuficientes - espera 5-10 min y vuelve a intentar")
            else:
                print(f"[ERROR] {e}")
                r = error_response(f"Error: {str(e)[:80]}")
            if self.loop:
                asyncio.run_coroutine_threadsafe(self.ws.broadcast(r), self.loop)
            return r

    def _print(self, r):
        sig = r.get("señal", "?")
        C = {"COMPRAR":"\033[92m","VENDER":"\033[91m","ESPERAR":"\033[93m","PELIGRO":"\033[95m"}
        c = C.get(sig, ""); E = "\033[0m"
        print("\n" + "-"*52)
        print(f"\033[1m {r.get('activo','?')}  @  {r.get('precio_actual','?')}{E}")
        print(f" Tendencia: {r.get('tendencia','?')}")
        print(f"{c}\033[1m SENAL: {sig}  ({r.get('confianza',0)}%){E}")
        print(f" {r.get('razon_principal','')}")
        print(f"\n {r.get('analisis','')}")
        if r.get("advertencia_emocional") and r.get("advertencia_emocional") != "null":
            print(f"\n ALERTA: {r['advertencia_emocional']}")
        if r.get("entrada_sugerida") and r.get("entrada_sugerida") != "---":
            print(f"\n Entrada:{r.get('entrada_sugerida')}  SL:{r.get('stop_loss')}  TP:{r.get('take_profit')}")
        print(f"\n Leccion: {r.get('leccion','')}")
        print("-"*52)

    def auto_loop(self):
        interval = self.cfg.get("analysis_interval", 30)
        print(f"[AUTO] Analisis cada {interval}s — Ctrl+Shift+A para analisis inmediato")
        while self.running:
            self.analyze_now()
            for _ in range(interval):
                if not self.running:
                    break
                time.sleep(1)

    def start(self):
        print("\n" + "="*52)
        print("  TRADER.AI - Agente de Trading con IA")
        print("  Binance, TradingView, MT4/5, Bybit...")
        print("="*52 + "\n")

        if not self.init():
            print("[!] API Key no configurada.")
            key = input("Pega tu API Key aqui: ").strip()
            if key and key.startswith("sk-"):
                self.cfg["anthropic_api_key"] = key
                save_config(self.cfg)
                if not self.init():
                    input("Error. Enter para salir.")
                    return
            else:
                input("Enter para salir.")
                return

        self.running = True
        threading.Thread(target=self.overlay.create, daemon=True).start()

        def run_ws():
            self.loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self.loop)
            self.loop.run_until_complete(self.ws.start())
        threading.Thread(target=run_ws, daemon=True).start()
        time.sleep(0.5)

        try:
            keyboard.add_hotkey(self.cfg.get("hotkey_analyze","ctrl+shift+a"),
                lambda: threading.Thread(target=self.analyze_now, daemon=True).start())
            keyboard.add_hotkey(self.cfg.get("hotkey_stop","ctrl+shift+s"), self.stop)
        except Exception as e:
            print(f"[Hotkeys] {e}")

        dash = Path(__file__).parent / "dashboard.html"
        webbrowser.open(f"file:///{dash.resolve()}")

        threading.Thread(target=self.auto_loop, daemon=True).start()

        print("\nTRADER.AI activo!")
        print("  Ctrl+Shift+A = Analizar ahora")
        print("  Ctrl+Shift+S = Detener")
        print("  Escribe preguntas al tutor:\n")

        while self.running:
            try:
                q = input("Tutor> ").strip()
                if q.lower() in ("exit","salir","quit"):
                    self.stop(); break
                if q:
                    print(f"\n{self.analyzer.tutor(q, self.last)}\n")
            except (EOFError, KeyboardInterrupt):
                self.stop(); break

    def stop(self):
        self.running = False
        print("\n[INFO] TRADER.AI detenido.")


if __name__ == "__main__":
    TradingAgent().start()
