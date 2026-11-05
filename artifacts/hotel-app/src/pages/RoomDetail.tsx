import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useGetRoom, useCreateReservation, getGetRoomQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { axiosInstance } from "@/lib/axios-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { calcStayPrice } from "@/lib/rooms";
import {
  Bed, Users, Wifi, Coffee, CheckCircle2, Calendar,
  CreditCard, ArrowLeft, ArrowRight, Check, Shield, Clock, Utensils, Car,
  Mail, FileText, Loader2, BadgeCheck
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

const schema = z.object({
  fechaEntrada: z.string().min(1, "Seleccione la fecha de llegada"),
  fechaSalida: z.string().min(1, "Seleccione la fecha de salida"),
  notas: z.string().optional(),
}).refine(d => !d.fechaEntrada || !d.fechaSalida || new Date(d.fechaSalida) > new Date(d.fechaEntrada), {
  message: "La fecha de salida debe ser posterior a la de llegada",
  path: ["fechaSalida"]
});

type FormValues = z.infer<typeof schema>;

const TIPO_LABEL: Record<string, string> = { sencilla: "Sencilla", doble: "Doble", suite: "Suite", cabana: "Cabana" };

const AMENITIES_DEFAULT = ["Aire acondicionado", "TV Smart 55\"", "Minibar", "Caja fuerte", "Bano privado", "Secadora de cabello", "Agua caliente 24h", "Vista panoramica"];

const DEFAULT_IMG = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=600&fit=crop";
const DEFAULT_DESCRIPCION = "Una hermosa habitacion disenada para su confort y descanso. Disfrute de vistas espectaculares y un servicio excepcional en Hotel Los Volcanes.";

/** Datos de presentación de la habitación con sus valores por defecto. */
function describeRoom(room: { imageUrl?: string | null; amenidades?: string | null; tipo: string; descripcion?: string | null }) {
  return {
    imgUrl: room.imageUrl || DEFAULT_IMG,
    amenities: room.amenidades ? room.amenidades.split(",").map(a => a.trim()) : AMENITIES_DEFAULT,
    tipoLabel: TIPO_LABEL[room.tipo] || room.tipo,
    descripcion: room.descripcion || DEFAULT_DESCRIPCION,
  };
}

/** Avanza la animación de procesamiento paso a paso. */
async function runProcessingSteps(total: number, onStep: (n: number) => void, delayMs = 900) {
  for (let i = 0; i < total; i++) {
    await new Promise(r => setTimeout(r, delayMs));
    onStep(i + 1);
  }
}

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<"details" | "payment" | "confirm">("details");
  const [confirmedRes, setConfirmedRes] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "invoice">("card");
  const [processingStep, setProcessingStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: room, isLoading } = useGetRoom(
    id || "",
    { query: { enabled: !!id, queryKey: getGetRoomQueryKey(id!) } }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fechaEntrada: "", fechaSalida: "", notas: "" },
  });

  const fechaEntrada = form.watch("fechaEntrada");
  const fechaSalida = form.watch("fechaSalida");

  const { nights, subtotal, impuesto, total } = calcStayPrice(fechaEntrada, fechaSalida, room?.precioNoche);

  const PROCESSING_STEPS = [
    "Verificando datos...",
    "Procesando pago...",
    "Generando factura...",
    "Confirmando reservacion...",
  ];

  const createRes = useCreateReservation({
    mutation: {
      onSuccess: async (data: any) => {
        try {
          const payResp = await axiosInstance.post(`/reservations/${data.id}/pay`, {
            metodoPago: PAYMENT_API[paymentMethod],
          });
          setConfirmedRes({ ...data, ...payResp.data });
        } catch {
          setConfirmedRes(data);
        }
        setIsProcessing(false);
        setStep("confirm");
      },
      onError: (error: any) => {
        setIsProcessing(false);
        setProcessingStep(0);
        toast({
          variant: "destructive",
          title: "Error al reservar",
          description: apiErrorMessage(error, "No se pudo procesar la reservacion."),
        });
      }
    }
  });

  const handleStepDetails = form.handleSubmit(() => {
    if (!user) {
      toast({ title: "Inicie sesion", description: "Debe iniciar sesion para reservar." });
      setLocation("/login");
      return;
    }
    setStep("payment");
  });

  const handleConfirmPayment = async () => {
    if (!room) return;
    setIsProcessing(true);
    setProcessingStep(0);

    await runProcessingSteps(PROCESSING_STEPS.length, setProcessingStep);

    const values = form.getValues();
    createRes.mutate({
      data: {
        habitacionId: room.id,
        fechaEntrada: values.fechaEntrada,
        fechaSalida: values.fechaSalida,
        notas: values.notas,
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 animate-pulse">
        <div className="h-80 bg-muted mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-muted w-2/3" />
            <div className="h-4 bg-muted w-1/4" />
            <div className="h-24 bg-muted mt-8" />
          </div>
          <div className="h-72 bg-muted" />
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl mb-4">Habitacion no encontrada</h2>
        <Button onClick={() => setLocation("/rooms")}>Volver a Habitaciones</Button>
      </div>
    );
  }

  const { imgUrl, amenities, tipoLabel, descripcion } = describeRoom(room);
  const today = new Date().toISOString().split("T")[0];

  if (step === "confirm" && confirmedRes) {
    return (
      <ReservationConfirmed
        reservation={confirmedRes}
        roomName={room.nombre}
        fechaEntrada={form.getValues("fechaEntrada")}
        fechaSalida={form.getValues("fechaSalida")}
        total={total}
        email={user?.email}
        onNavigate={setLocation}
      />
    );
  }

  return (
    <div className="bg-background pb-24">
      {/* Hero */}
      <div className="w-full h-[50vh] min-h-[380px] relative">
        <img src={imgUrl} alt={room.nombre} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button
          onClick={() => history.back()}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
        <div className="absolute bottom-0 left-0 w-full p-8 container mx-auto">
          <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-3 py-1 mb-3 inline-block">
            {tipoLabel}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white">{room.nombre}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* LEFT: Room details */}
          <div className="lg:col-span-3 space-y-10">
            <div className="flex flex-wrap gap-6 text-muted-foreground border-b pb-8">
              <span className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Hasta {room.capacidad} personas</span>
              <span className="flex items-center gap-2"><Bed className="h-5 w-5 text-primary" /> {tipoLabel}</span>
              <span className="flex items-center gap-2"><Wifi className="h-5 w-5 text-primary" /> WiFi Gratis</span>
              <span className="flex items-center gap-2"><Coffee className="h-5 w-5 text-primary" /> Bar & Lounge</span>
              <span className="flex items-center gap-2"><Utensils className="h-5 w-5 text-primary" /> Restaurante</span>
              <span className="flex items-center gap-2"><Car className="h-5 w-5 text-primary" /> Estacionamiento</span>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold mb-4">Descripcion</h2>
              <p className="text-muted-foreground leading-relaxed text-lg font-light">
                {descripcion}
              </p>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-semibold mb-4">Amenidades incluidas</h2>
              <div className="grid grid-cols-2 gap-3">
                {amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted p-5 border-l-4 border-primary">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Politicas de la habitacion</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Check-in: 3:00 PM | Check-out: 12:00 PM</li>
                <li>No se permite fumar en interiores</li>
                <li>Mascotas aceptadas (cargo adicional de Q150/noche)</li>
                <li>Cancelacion gratuita con 48+ horas de anticipacion</li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Booking form */}
          <div className="lg:col-span-2">
            <div className="bg-card border shadow-md sticky top-24">
              <div className="p-6 border-b bg-primary text-white">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-4xl font-bold">Q{room.precioNoche}</span>
                  <span className="text-white/80 text-sm uppercase tracking-wider">por noche</span>
                </div>
              </div>

              {/* STEP INDICATOR */}
              {step === "payment" && (
                <div className="px-6 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">1</div>
                    <div className="flex-1 h-0.5 bg-primary" />
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">2</div>
                    <div className="flex-1 h-0.5 bg-muted" />
                    <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center font-bold">3</div>
                  </div>
                  <p className="text-sm font-semibold text-primary mb-4">Paso 2: Simulacion de pago</p>
                </div>
              )}

              {step === "details" ? (
                <form onSubmit={handleStepDetails} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Llegada</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          min={today}
                          className="pl-10"
                          {...form.register("fechaEntrada")}
                          data-testid="input-check-in"
                        />
                      </div>
                      {form.formState.errors.fechaEntrada && (
                        <p className="text-xs text-destructive">{form.formState.errors.fechaEntrada.message}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground">Salida</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="date"
                          min={fechaEntrada || today}
                          className="pl-10"
                          {...form.register("fechaSalida")}
                          data-testid="input-check-out"
                        />
                      </div>
                      {form.formState.errors.fechaSalida && (
                        <p className="text-xs text-destructive">{form.formState.errors.fechaSalida.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Notas especiales (opcional)</Label>
                    <Textarea
                      placeholder="Llegada tarde, cuna para bebe, alergias..."
                      className="resize-none text-sm"
                      rows={3}
                      {...form.register("notas")}
                      data-testid="input-notes"
                    />
                  </div>

                  {nights > 0 && (
                    <div className="bg-muted p-4 space-y-2 text-sm border">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Q{room.precioNoche} × {nights} noches</span>
                        <span>Q{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>IVA (12%)</span>
                        <span>Q{impuesto.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2 border-t">
                        <span>Total estimado</span>
                        <span className="text-primary">Q{total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white uppercase tracking-wide py-5 gap-2 text-sm font-semibold"
                    disabled={!room.activo}
                    data-testid="button-continue-payment"
                  >
                    {!room.activo ? "No disponible" : "Continuar al pago"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" /> Reservacion segura y sin cargos adicionales
                  </p>
                </form>
              ) : isProcessing ? (
                <ProcessingPanel steps={PROCESSING_STEPS} processingStep={processingStep} total={total} paymentMethod={paymentMethod} />
              ) : (
                <div className="p-6 space-y-4">
                  <p className="text-sm text-muted-foreground font-medium">Seleccione metodo de pago</p>

                  {/* Selector de metodo */}
                  <div className="grid grid-cols-2 gap-3">
                    <PaymentOption selected={paymentMethod === "card"} onSelect={() => setPaymentMethod("card")} icon={CreditCard} title="Tarjeta" subtitle="Credito / Debito" />
                    <PaymentOption selected={paymentMethod === "invoice"} onSelect={() => setPaymentMethod("invoice")} icon={FileText} title="Factura" subtitle="Pago por correo" />
                  </div>

                  {/* Formulario segun metodo */}
                  {paymentMethod === "card" ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nombre en la tarjeta</Label>
                        <Input placeholder="MARIA LOPEZ GARCIA" className="uppercase" data-testid="input-card-name" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Numero de tarjeta</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="4242 4242 4242 4242" className="pl-10" maxLength={19} data-testid="input-card-number" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Vencimiento</Label>
                          <Input placeholder="MM/AA" maxLength={5} data-testid="input-card-expiry" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">CVV</Label>
                          <Input placeholder="123" maxLength={4} type="password" data-testid="input-card-cvv" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded space-y-2">
                      <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                        <Mail className="h-4 w-4" /> Pago por factura electronica
                      </div>
                      <p className="text-xs text-blue-700">Se generara una factura electronica y se enviara a:</p>
                      <p className="font-mono text-sm text-blue-900 font-bold">{user?.email}</p>
                      <p className="text-xs text-blue-600">Tendra 48 horas para realizar el pago. Su reservacion quedara confirmada al acreditarse el pago.</p>
                    </div>
                  )}

                  {/* Resumen */}
                  <div className="bg-muted p-4 text-sm space-y-1 border">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{room.nombre}</span>
                      <span>{nightsLabel(nights)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal + IVA (12%)</span>
                      <span>Q{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-2 border-t">
                      <span>Total a pagar</span>
                      <span className="text-primary">Q{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 rounded flex gap-2">
                    <Shield className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    <span><strong>Sistema educativo:</strong> No se realizara ningun cargo real. Simulacion de pago para demostracion.</span>
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white uppercase tracking-wide py-5 gap-2 font-semibold"
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    data-testid="button-confirm-payment"
                  >
                    {paymentMethod === "card" ? "Confirmar y Pagar" : "Confirmar y Enviar Factura"}
                    <Check className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep("details")}
                    disabled={isProcessing}
                    data-testid="button-back-details"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Regresar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ConfirmedReservation = {
  id?: string;
  metodoPago?: string;
  codigoAutorizacion?: string;
  numeroFactura?: string;
};

function formatLongDate(value: string) {
  return format(parseISO(value), "d 'de' MMMM yyyy", { locale: es });
}

function ReservationConfirmed({ reservation, roomName, fechaEntrada, fechaSalida, total, email, onNavigate }: {
  reservation: ConfirmedReservation;
  roomName: string;
  fechaEntrada: string;
  fechaSalida: string;
  total: number;
  email?: string;
  onNavigate: (path: string) => void;
}) {
  const isFactura = reservation.metodoPago === "factura";
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="bg-card border max-w-lg w-full shadow-lg overflow-hidden">
        {/* Header verde */}
        <div className="bg-green-600 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BadgeCheck className="h-9 w-9 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-1">Pago Aprobado</h1>
          <p className="text-green-100 text-sm">Reservacion confirmada exitosamente</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Codigo de autorizacion */}
          {reservation.codigoAutorizacion && (
            <div className="bg-green-50 border border-green-200 p-3 rounded flex items-center justify-between">
              <span className="text-sm text-green-800 font-medium">Codigo de autorizacion</span>
              <span className="font-mono font-bold text-green-700 text-lg tracking-widest">{reservation.codigoAutorizacion}</span>
            </div>
          )}

          {/* Detalles */}
          <div className="bg-muted rounded p-4 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">No. Reservacion</span>
              <span className="font-mono font-bold text-primary">#{reservation.id?.slice(0, 8).toUpperCase()}</span>
            </div>
            {reservation.numeroFactura && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">No. Factura</span>
                <span className="font-mono font-semibold">{reservation.numeroFactura}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Habitacion</span>
              <span className="font-semibold">{roomName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Llegada</span>
              <span className="font-semibold">{formatLongDate(fechaEntrada)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Salida</span>
              <span className="font-semibold">{formatLongDate(fechaSalida)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Metodo de pago</span>
              <span className="font-semibold capitalize">{isFactura ? "Factura por correo" : "Tarjeta"}</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold">Total pagado</span>
              <span className="font-bold text-lg text-primary">Q{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Factura por correo */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm text-blue-800 flex gap-3">
            <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Factura enviada a su correo</p>
              <p className="text-blue-700">{email}</p>
              <p className="text-xs text-blue-600 mt-1">Revise su bandeja de entrada o carpeta de spam.</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-800">
            <strong>Check-in:</strong> 3:00 PM &nbsp;|&nbsp; <strong>Check-out:</strong> 12:00 PM &nbsp;|&nbsp; Presentese con DPI o pasaporte.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={() => onNavigate("/my-reservations")} className="flex-1 bg-primary text-white" data-testid="button-view-reservations">
              Ver Mis Reservaciones
            </Button>
            <Button variant="outline" onClick={() => onNavigate("/")} className="flex-1">
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

type StepStatus = "done" | "current" | "pending";

function stepStatus(processingStep: number, index: number): StepStatus {
  if (processingStep > index) return "done";
  if (processingStep === index) return "current";
  return "pending";
}

const STEP_TEXT_CLASS: Record<StepStatus, string> = {
  done: "text-green-700",
  current: "text-primary font-medium",
  pending: "text-muted-foreground",
};

function ProcessingStepItem({ label, status }: { label: string; status: StepStatus }) {
  let icon = <div className="h-4 w-4 rounded-full border-2 border-muted shrink-0" />;
  if (status === "done") icon = <Check className="h-4 w-4 text-green-600 shrink-0" />;
  if (status === "current") icon = <Loader2 className="h-4 w-4 text-primary animate-spin shrink-0" />;
  return (
    <div className={`flex items-center gap-3 text-sm p-2 rounded transition-all ${STEP_TEXT_CLASS[status]}`}>
      {icon}
      {label}
    </div>
  );
}

function PaymentOption({ selected, onSelect, icon: Icon, title, subtitle }: {
  selected: boolean;
  onSelect: () => void;
  icon: typeof CreditCard;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`p-3 border-2 rounded text-left transition-all ${selected ? "border-primary bg-primary/5" : "border-muted hover:border-primary/40"}`}
    >
      <Icon className={`h-5 w-5 mb-1 ${selected ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-xs font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </button>
  );
}

type PaymentMethod = "card" | "invoice";
const PAYMENT_API: Record<PaymentMethod, string> = { card: "tarjeta", invoice: "factura" };
const PAYMENT_LABEL: Record<PaymentMethod, string> = { card: "Tarjeta", invoice: "Factura por correo" };

function nightsLabel(nights: number) {
  return `${nights} noche${nights === 1 ? "" : "s"}`;
}

function apiErrorMessage(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return message || fallback;
}

function ProcessingPanel({ steps, processingStep, total, paymentMethod }: {
  steps: string[];
  processingStep: number;
  total: number;
  paymentMethod: PaymentMethod;
}) {
  return (
    <div className="p-8 flex flex-col items-center text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
      <div>
        <p className="font-semibold text-foreground mb-1">Procesando su pago</p>
        <p className="text-sm text-muted-foreground">Por favor no cierre esta ventana</p>
      </div>
      <div className="w-full space-y-2">
        {steps.map((label, i) => (
          <ProcessingStepItem key={label} label={label} status={stepStatus(processingStep, i)} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Q{total.toFixed(2)} — {PAYMENT_LABEL[paymentMethod]}</p>
    </div>
  );
}
