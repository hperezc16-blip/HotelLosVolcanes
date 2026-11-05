-- Esquema y datos de prueba para ejecutar la coleccion de Postman (local o en el pipeline).
-- Usuarios: admin@hotel.com y maria@example.com, contraseña Admin123!
DROP TABLE IF EXISTS public.reservations, public.rooms, public.users CASCADE;
DROP TYPE IF EXISTS public.estado_reserva, public.rol, public.tipo_habitacion CASCADE;


CREATE TYPE public.estado_reserva AS ENUM (
    'pendiente',
    'confirmada',
    'cancelada',
    'completada'
);

CREATE TYPE public.rol AS ENUM (
    'cliente',
    'admin'
);

CREATE TYPE public.tipo_habitacion AS ENUM (
    'sencilla',
    'doble',
    'suite',
    'cabana'
);

CREATE TABLE public.reservations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    habitacion_id uuid NOT NULL,
    fecha_entrada date NOT NULL,
    fecha_salida date NOT NULL,
    precio_total numeric(10,2) NOT NULL,
    estado public.estado_reserva DEFAULT 'pendiente'::public.estado_reserva NOT NULL,
    estado_pago text DEFAULT 'pendiente'::text NOT NULL,
    notas text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.rooms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    tipo public.tipo_habitacion DEFAULT 'sencilla'::public.tipo_habitacion NOT NULL,
    precio_noche numeric(10,2) NOT NULL,
    capacidad smallint DEFAULT 2 NOT NULL,
    image_url character varying(500),
    amenidades text,
    estado_manual character varying(20),
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    rol public.rol DEFAULT 'cliente'::public.rol NOT NULL,
    telefono character varying(20),
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_cliente_id_users_id_fk FOREIGN KEY (cliente_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_habitacion_id_rooms_id_fk FOREIGN KEY (habitacion_id) REFERENCES public.rooms(id);




INSERT INTO users (nombre, email, password_hash, rol, telefono) VALUES
  ('Administrador', 'admin@hotel.com', '$2b$12$Bv8w3nnEMsGSPcccBcOLD.SSS1E7pEaVF52ep89jQbAlqo10cpNIS', 'admin', '50200000000'),
  ('María López',   'maria@example.com', '$2b$12$Bv8w3nnEMsGSPcccBcOLD.SSS1E7pEaVF52ep89jQbAlqo10cpNIS', 'cliente', '50211111111')
ON CONFLICT (email) DO NOTHING;

INSERT INTO rooms (nombre, descripcion, tipo, precio_noche, capacidad, amenidades)
SELECT * FROM (VALUES
  ('Sencilla Acatenango', 'Habitación sencilla con vista al jardín', 'sencilla'::tipo_habitacion, 350.00, 1, 'WiFi, TV, Baño privado'),
  ('Sencilla Pacaya',     'Habitación sencilla, ideal para viajes de trabajo', 'sencilla'::tipo_habitacion, 380.00, 1, 'WiFi, Escritorio, Baño privado'),
  ('Doble Agua',          'Dos camas matrimoniales con vista al volcán de Agua', 'doble'::tipo_habitacion, 550.00, 4, 'WiFi, TV, Minibar'),
  ('Doble Fuego',         'Cama king y balcón', 'doble'::tipo_habitacion, 600.00, 2, 'WiFi, TV, Balcón'),
  ('Suite Tajumulco',     'Suite con sala, jacuzzi y vista panorámica', 'suite'::tipo_habitacion, 1200.00, 3, 'WiFi, Jacuzzi, Sala, Minibar'),
  ('Cabaña Atitlán',      'Cabaña independiente con chimenea', 'cabana'::tipo_habitacion, 950.00, 5, 'WiFi, Chimenea, Cocineta')
) AS v(nombre, descripcion, tipo, precio_noche, capacidad, amenidades)
WHERE NOT EXISTS (SELECT 1 FROM rooms r WHERE r.nombre = v.nombre);
