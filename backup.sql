--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: limpiar_copia_recibo(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION limpiar_copia_recibo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM copiaderecibo WHERE Pk_IdCopiaRecibo < (SELECT MAX(Pk_IdCopiaRecibo) - 5 FROM copiaderecibo); 
  RETURN NULL;
END;
$$;


ALTER FUNCTION public.limpiar_copia_recibo() OWNER TO postgres;

--
-- Name: limpiar_historicocanasta(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION limpiar_historicocanasta() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM historicoventacanasta WHERE idventacanasta < (SELECT MAX(idventacanasta) - 1000 FROM historicoventacanasta); 
  RETURN NULL;
END;
$$;


ALTER FUNCTION public.limpiar_historicocanasta() OWNER TO postgres;

--
-- Name: limpiar_historicoformasdepago(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION limpiar_historicoformasdepago() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM historicoformapago WHERE pkidformapago < (SELECT MAX(pkidformapago) - 1000 FROM historicoformapago); 
  RETURN NULL;
END;
$$;


ALTER FUNCTION public.limpiar_historicoformasdepago() OWNER TO postgres;

--
-- Name: limpiar_ventas(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION limpiar_ventas() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM venta WHERE Pk_Idventa < (SELECT MAX(Pk_idVenta) - 1000 FROM venta); 
  RETURN NULL;
END;
$$;


ALTER FUNCTION public.limpiar_ventas() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: botones; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE botones (
    id_boton integer,
    textoboton character varying(8)
);


ALTER TABLE public.botones OWNER TO postgres;

--
-- Name: configuracion; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE configuracion (
    pk_idconfiguracion integer NOT NULL,
    nombre character varying(255),
    descripcion character varying(255),
    valor character varying(255)
);


ALTER TABLE public.configuracion OWNER TO postgres;

--
-- Name: configuracion_pk_idconfiguracion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE configuracion_pk_idconfiguracion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.configuracion_pk_idconfiguracion_seq OWNER TO postgres;

--
-- Name: configuracion_pk_idconfiguracion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE configuracion_pk_idconfiguracion_seq OWNED BY configuracion.pk_idconfiguracion;


--
-- Name: configuraciondispensador; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE configuraciondispensador (
    pk_idconfiguraciondispen integer NOT NULL,
    nombre character varying(255),
    descripcion character varying(255),
    valor character varying(255),
    activa boolean
);


ALTER TABLE public.configuraciondispensador OWNER TO postgres;

--
-- Name: configuraciondispensador_pk_idconfiguraciondispen_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE configuraciondispensador_pk_idconfiguraciondispen_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.configuraciondispensador_pk_idconfiguraciondispen_seq OWNER TO postgres;

--
-- Name: configuraciondispensador_pk_idconfiguraciondispen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE configuraciondispensador_pk_idconfiguraciondispen_seq OWNED BY configuraciondispensador.pk_idconfiguraciondispen;


--
-- Name: consignaciones; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE consignaciones (
    pk_idconsignacion integer,
    valorconsignacion integer,
    mensajeconsignacion character varying(60),
    idpos integer,
    confirmacion integer,
    recibe integer
);


ALTER TABLE public.consignaciones OWNER TO postgres;

--
-- Name: copiaderecibo; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE copiaderecibo (
    pk_idcopiarecibo integer NOT NULL,
    fk_idventa integer,
    numerocopiasrecibo integer
);


ALTER TABLE public.copiaderecibo OWNER TO postgres;

--
-- Name: copiaderecibo_pk_idcopiarecibo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE copiaderecibo_pk_idcopiarecibo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.copiaderecibo_pk_idcopiarecibo_seq OWNER TO postgres;

--
-- Name: copiaderecibo_pk_idcopiarecibo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE copiaderecibo_pk_idcopiarecibo_seq OWNED BY copiaderecibo.pk_idcopiarecibo;


--
-- Name: discriminapago; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE discriminapago (
    id_pos integer,
    numeroventa2 character varying(8),
    tipofp character(2),
    ventaconsulta2 integer,
    valordiscriminado character varying(8),
    serialid character varying(20)
);


ALTER TABLE public.discriminapago OWNER TO postgres;

--
-- Name: estado; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE estado (
    pk_id_estado integer NOT NULL,
    pos1 integer,
    pos2 integer,
    led integer,
    fp1 integer,
    fp2 integer
);


ALTER TABLE public.estado OWNER TO postgres;

--
-- Name: estado_pk_id_estado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE estado_pk_id_estado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.estado_pk_id_estado_seq OWNER TO postgres;

--
-- Name: estado_pk_id_estado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE estado_pk_id_estado_seq OWNED BY estado.pk_id_estado;


--
-- Name: finventacanasta; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE finventacanasta (
    id_canasta integer NOT NULL,
    idposicionc integer,
    validacioncanasta integer,
    lecturacanasta integer,
    tipoventacanasta integer,
    serial character varying(20),
    cantidad character varying(3),
    cantidadvendida character varying(3),
    nombre character varying(20),
    valor character varying(8),
    valormux character varying(8)
);


ALTER TABLE public.finventacanasta OWNER TO postgres;

--
-- Name: finventacanasta_id_canasta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE finventacanasta_id_canasta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.finventacanasta_id_canasta_seq OWNER TO postgres;

--
-- Name: finventacanasta_id_canasta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE finventacanasta_id_canasta_seq OWNED BY finventacanasta.id_canasta;


--
-- Name: finventacanastacredito; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE finventacanastacredito (
    id_canasta integer NOT NULL,
    idposicionc integer,
    validacioncanasta integer,
    lecturacanasta integer,
    tipoventacanasta integer,
    serial character varying(20),
    cantidad character varying(3),
    cantidadvendida character varying(3),
    nombre character varying(20),
    valor character varying(8),
    tipoidentificacion character varying(2),
    serialid character varying(20),
    valormux character varying(8)
);


ALTER TABLE public.finventacanastacredito OWNER TO postgres;

--
-- Name: finventacanastacredito_id_canasta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE finventacanastacredito_id_canasta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.finventacanastacredito_id_canasta_seq OWNER TO postgres;

--
-- Name: finventacanastacredito_id_canasta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE finventacanastacredito_id_canasta_seq OWNED BY finventacanastacredito.id_canasta;


--
-- Name: formadepago; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE formadepago (
    pkformapago integer NOT NULL,
    id_pos integer,
    numeroventa character varying(8),
    tipoformadepago character varying(3),
    valorventa character varying(8),
    valordiscriminado character varying(8),
    identificadorfp character varying(20),
    ventaconsulta character varying(3)
);


ALTER TABLE public.formadepago OWNER TO postgres;

--
-- Name: formadepago_pkformapago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE formadepago_pkformapago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.formadepago_pkformapago_seq OWNER TO postgres;

--
-- Name: formadepago_pkformapago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE formadepago_pkformapago_seq OWNED BY formadepago.pkformapago;


--
-- Name: historicoformapago; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE historicoformapago (
    pkidformapago integer NOT NULL,
    id_pos integer,
    numeroventa character varying(8),
    tipoformadepago character varying(3),
    valordiscriminado character varying(8),
    ventaconsulta character varying(3),
    identificadorfp character varying(20)
);


ALTER TABLE public.historicoformapago OWNER TO postgres;

--
-- Name: historicoformapago_pkidformapago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE historicoformapago_pkidformapago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.historicoformapago_pkidformapago_seq OWNER TO postgres;

--
-- Name: historicoformapago_pkidformapago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE historicoformapago_pkidformapago_seq OWNED BY historicoformapago.pkidformapago;


--
-- Name: historicoventacanasta; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE historicoventacanasta (
    idventacanasta integer NOT NULL,
    idposicionc integer,
    dineroventa character varying(8)
);


ALTER TABLE public.historicoventacanasta OWNER TO postgres;

--
-- Name: historicoventacanasta_idventacanasta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE historicoventacanasta_idventacanasta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.historicoventacanasta_idventacanasta_seq OWNER TO postgres;

--
-- Name: historicoventacanasta_idventacanasta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE historicoventacanasta_idventacanasta_seq OWNED BY historicoventacanasta.idventacanasta;


--
-- Name: logos; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE logos (
    id_logo integer,
    nombrelogo character varying(30),
    trama text,
    tramakios text
);


ALTER TABLE public.logos OWNER TO postgres;

--
-- Name: mantenimiento; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE mantenimiento (
    idposicion integer,
    grado integer,
    autorizacion integer
);


ALTER TABLE public.mantenimiento OWNER TO postgres;

--
-- Name: mapeodispensador; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE mapeodispensador (
    pk_idposicion integer NOT NULL,
    numeromangueras integer,
    formatodinero integer,
    formatovolumen integer,
    formatoprecio integer,
    ppux10 integer,
    numerodigitos integer,
    isla integer,
    tipoimpresora integer
);


ALTER TABLE public.mapeodispensador OWNER TO postgres;

--
-- Name: mapeodispensador_pk_idposicion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE mapeodispensador_pk_idposicion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mapeodispensador_pk_idposicion_seq OWNER TO postgres;

--
-- Name: mapeodispensador_pk_idposicion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE mapeodispensador_pk_idposicion_seq OWNED BY mapeodispensador.pk_idposicion;


--
-- Name: mensajes; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE mensajes (
    mensaje character varying(60),
    id_mensaje integer,
    lecturacalibracion integer
);


ALTER TABLE public.mensajes OWNER TO postgres;

--
-- Name: moneda; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE moneda (
    pk_idmoneda integer NOT NULL,
    unidadmoneda character varying(10),
    descripcion character varying(255),
    activa boolean
);


ALTER TABLE public.moneda OWNER TO postgres;

--
-- Name: moneda_pk_idmoneda_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE moneda_pk_idmoneda_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moneda_pk_idmoneda_seq OWNER TO postgres;

--
-- Name: moneda_pk_idmoneda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE moneda_pk_idmoneda_seq OWNED BY moneda.pk_idmoneda;


--
-- Name: precios; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE precios (
    id_pos integer,
    nsx1 character varying(5),
    nsx2 character varying(5),
    nsx3 character varying(5),
    disp1 character varying(5),
    disp2 character varying(5),
    disp3 character varying(5)
);


ALTER TABLE public.precios OWNER TO postgres;

--
-- Name: preset; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE preset (
    id_pos integer,
    tipo_p character(2),
    valor_p character varying(8),
    totalesdin character varying(12),
    totalesvol character varying(12),
    ppu character varying(6),
    grado integer,
    kilometraje character varying(10),
    serial character varying(20),
    autorizado character varying(7),
    tipo_venta character(1),
    mensajep character varying(60),
    validacioncredito integer,
    lecturacupocredito integer,
    calibracion integer
);


ALTER TABLE public.preset OWNER TO postgres;

--
-- Name: producto; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE producto (
    pk_idproducto integer NOT NULL,
    nombre character varying(255)
);


ALTER TABLE public.producto OWNER TO postgres;

--
-- Name: producto_pk_idproducto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE producto_pk_idproducto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.producto_pk_idproducto_seq OWNER TO postgres;

--
-- Name: producto_pk_idproducto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE producto_pk_idproducto_seq OWNED BY producto.pk_idproducto;


--
-- Name: solicitudes; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE solicitudes (
    solicitabge2 integer,
    tiposolicitud character(1),
    confirmacion integer
);


ALTER TABLE public.solicitudes OWNER TO postgres;

--
-- Name: tipotransaccion; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE tipotransaccion (
    pk_idtipotransaccion integer NOT NULL,
    nombretransaccion character varying(255)
);


ALTER TABLE public.tipotransaccion OWNER TO postgres;

--
-- Name: tipotransaccion_pk_idtipotransaccion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE tipotransaccion_pk_idtipotransaccion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tipotransaccion_pk_idtipotransaccion_seq OWNER TO postgres;

--
-- Name: tipotransaccion_pk_idtipotransaccion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE tipotransaccion_pk_idtipotransaccion_seq OWNED BY tipotransaccion.pk_idtipotransaccion;


--
-- Name: totales; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE totales (
    pk_id_posicion integer NOT NULL,
    totalmanguera1 double precision,
    totalmanguera2 double precision,
    totalmanguera3 double precision,
    totalmanguera4 double precision,
    dineromanguera1 double precision,
    dineromanguera2 double precision,
    dineromanguera3 double precision,
    dineromanguera4 double precision
);


ALTER TABLE public.totales OWNER TO postgres;

--
-- Name: totales_pk_id_posicion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE totales_pk_id_posicion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.totales_pk_id_posicion_seq OWNER TO postgres;

--
-- Name: totales_pk_id_posicion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE totales_pk_id_posicion_seq OWNED BY totales.pk_id_posicion;


--
-- Name: turno; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE turno (
    usuario character varying(10),
    "contraseña" character varying(8),
    turno integer,
    turnonsx integer,
    mensajeturno character varying(60),
    habilitalecturaturno integer
);


ALTER TABLE public.turno OWNER TO postgres;

--
-- Name: venta; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE venta (
    pk_idventa integer NOT NULL,
    fechainicial timestamp with time zone,
    fechafinal timestamp with time zone,
    cantidadtotal double precision,
    valortotal double precision,
    fk_idtipotransaccion integer,
    serialibutton character varying(255),
    identificadorweb character varying(255),
    volumeninicial double precision,
    volumenfinal double precision,
    placaefectivo character varying(255),
    nombreefectivo character varying(255),
    dineroinicial double precision,
    dinerofinal double precision,
    fk_idproducto integer,
    valorprogramado double precision,
    ppu character varying(7),
    idposicion integer,
    grado integer,
    tipovehiculo integer,
    tipopreset character(2),
    kilometrajecliente character varying(20)
);


ALTER TABLE public.venta OWNER TO postgres;

--
-- Name: venta_canasta; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE venta_canasta (
    id_canasta integer NOT NULL,
    idposicionc integer,
    validacioncanasta integer,
    lecturacanasta integer,
    tipoventacanasta integer,
    serial character varying(20),
    cantidad character varying(3),
    cantidadvendida character varying(3),
    nombre character varying(20),
    valor character varying(8),
    valormux character varying(8)
);


ALTER TABLE public.venta_canasta OWNER TO postgres;

--
-- Name: venta_canasta_id_canasta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE venta_canasta_id_canasta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.venta_canasta_id_canasta_seq OWNER TO postgres;

--
-- Name: venta_canasta_id_canasta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE venta_canasta_id_canasta_seq OWNED BY venta_canasta.id_canasta;


--
-- Name: venta_pk_idventa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE venta_pk_idventa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.venta_pk_idventa_seq OWNER TO postgres;

--
-- Name: venta_pk_idventa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE venta_pk_idventa_seq OWNED BY venta.pk_idventa;


--
-- Name: verificapago; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE verificapago (
    id_pos integer,
    validacion integer,
    valorventa character varying(8),
    activateclado integer
);


ALTER TABLE public.verificapago OWNER TO postgres;

--
-- Name: pk_idconfiguracion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY configuracion ALTER COLUMN pk_idconfiguracion SET DEFAULT nextval('configuracion_pk_idconfiguracion_seq'::regclass);


--
-- Name: pk_idconfiguraciondispen; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY configuraciondispensador ALTER COLUMN pk_idconfiguraciondispen SET DEFAULT nextval('configuraciondispensador_pk_idconfiguraciondispen_seq'::regclass);


--
-- Name: pk_idcopiarecibo; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY copiaderecibo ALTER COLUMN pk_idcopiarecibo SET DEFAULT nextval('copiaderecibo_pk_idcopiarecibo_seq'::regclass);


--
-- Name: pk_id_estado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY estado ALTER COLUMN pk_id_estado SET DEFAULT nextval('estado_pk_id_estado_seq'::regclass);


--
-- Name: id_canasta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY finventacanasta ALTER COLUMN id_canasta SET DEFAULT nextval('finventacanasta_id_canasta_seq'::regclass);


--
-- Name: id_canasta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY finventacanastacredito ALTER COLUMN id_canasta SET DEFAULT nextval('finventacanastacredito_id_canasta_seq'::regclass);


--
-- Name: pkformapago; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY formadepago ALTER COLUMN pkformapago SET DEFAULT nextval('formadepago_pkformapago_seq'::regclass);


--
-- Name: pkidformapago; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY historicoformapago ALTER COLUMN pkidformapago SET DEFAULT nextval('historicoformapago_pkidformapago_seq'::regclass);


--
-- Name: idventacanasta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY historicoventacanasta ALTER COLUMN idventacanasta SET DEFAULT nextval('historicoventacanasta_idventacanasta_seq'::regclass);


--
-- Name: pk_idposicion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY mapeodispensador ALTER COLUMN pk_idposicion SET DEFAULT nextval('mapeodispensador_pk_idposicion_seq'::regclass);


--
-- Name: pk_idmoneda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY moneda ALTER COLUMN pk_idmoneda SET DEFAULT nextval('moneda_pk_idmoneda_seq'::regclass);


--
-- Name: pk_idproducto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY producto ALTER COLUMN pk_idproducto SET DEFAULT nextval('producto_pk_idproducto_seq'::regclass);


--
-- Name: pk_idtipotransaccion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY tipotransaccion ALTER COLUMN pk_idtipotransaccion SET DEFAULT nextval('tipotransaccion_pk_idtipotransaccion_seq'::regclass);


--
-- Name: pk_id_posicion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY totales ALTER COLUMN pk_id_posicion SET DEFAULT nextval('totales_pk_id_posicion_seq'::regclass);


--
-- Name: pk_idventa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY venta ALTER COLUMN pk_idventa SET DEFAULT nextval('venta_pk_idventa_seq'::regclass);


--
-- Name: id_canasta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY venta_canasta ALTER COLUMN id_canasta SET DEFAULT nextval('venta_canasta_id_canasta_seq'::regclass);


--
-- Data for Name: botones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY botones (id_boton, textoboton) FROM stdin;
1	Ventas  
2	Turnos  
3	Canasta 
4	Consigna
5	Mtto    
6	C.Recibo
7	VERSION 
8	POSICION
9	HORA    
10	FECHA   
11	DIREC IP
12	DIGITOS 
13	Contado 
14	Credito 
15	Dinero  
16	Volumen 
17	Lleno   
18	Error de
19	Surtidor
20	Corte   
21	Ingrese 
22	Dinero  
23	Ingrese 
24	Volumen 
25	 Escoja 
26	Producto
31	Suba la 
32	 Manija 
33	Espere..
34	        
35	Error de
36	Sistema 
37	Tanqueo 
38	En Curso
39	Ingrese 
27	CORRIENT
28	DIESEL  
29	 
30	 
99	Esperar 
100	Continua
101	Producto
102	Cantidad
103	Precio  
104	Total   
105	Ingrese 
106	Codigo  
107	Calibra 
108	Imprimir
109	Escoja  
110	Impreso 
111	Abrir   
112	Cerrar  
113	Ingrese 
114	Clave   
115	
40	Placa   
41	Ingrese 
42	  KM    
43	Ingrese 
44	NIT/CC  
45	Formas  
46	de Pago 
47	T Debito
48	TCR V-M 
49	TCR D-B 
50	TCR A-Fa
51	BSodexho
52	Efectivo
53	Cheques 
54	BBigPass
55	C Cheque
56	BBiomax 
57	C Planta
58	B Tiempo
59	CConsumo
60	BonosOPL
61	Antic RH
62	Anticipo
63	ADiamoni
64	TSodexho
65	TBigPass
66	BCBoliva
67	ReteFt C
68	Forma 22
69	Forma 23
70	Forma 24
71	F. Pago 
72	 Preset 
73	Tipo de 
74	Vehiculo
75	Liviano 
76	        
77	Moto    
78	        
79	Pesado  
80	        
81	Gracias!
82	 Serial 
83	 Vuelva 
84	Pronto  
85	Ingrese 
86	 Venta  
87	Separar 
88	Dinero  
89	 Accion 
90	Anulada 
91	Metodos 
92	   ID   
93	Ibutton 
94	   Tag  
95	 Cedula 
96	 Placa  
97	Cod.Bar 
98	        
\.


--
-- Data for Name: configuracion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY configuracion (pk_idconfiguracion, nombre, descripcion, valor) FROM stdin;
\.


--
-- Name: configuracion_pk_idconfiguracion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('configuracion_pk_idconfiguracion_seq', 1, false);


--
-- Data for Name: configuraciondispensador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY configuraciondispensador (pk_idconfiguraciondispen, nombre, descripcion, valor, activa) FROM stdin;
24	SimboloVolumen	Simb Volumen	G	t
1	Encabezados	Encabezados	ESTACION DE SERVICIO	t
2	Encabezados	Encabezados	BIOMAX PRIMAVERA	t
3	Encabezados	Encabezados	NIT. 900.072.847-4	t
4	Encabezados	Encabezados	BOGOTA D.C	t
5	Encabezados	Encabezados		t
6	Encabezados	Encabezados	TEL: 2403105	t
7	Encabezados	Encabezados		t
8	Encabezados	Encabezados		t
9	Pie	Pie	GRACIAS POR SU COMPRA	t
10	Pie	Pie	VUELVA PRONTO	t
11	Pie	Pie	U	t
25	Preset1	Preset rapido	10000	t
26	Preset2	Preset rapido	20000	t
27	Preset3	Preset rapido	30000	t
\.


--
-- Name: configuraciondispensador_pk_idconfiguraciondispen_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('configuraciondispensador_pk_idconfiguraciondispen_seq', 1, false);


--
-- Data for Name: consignaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY consignaciones (pk_idconsignacion, valorconsignacion, mensajeconsignacion, idpos, confirmacion, recibe) FROM stdin;
1	200000	Operacion Incorrecta	2	0	1
\.


--
-- Data for Name: copiaderecibo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY copiaderecibo (pk_idcopiarecibo, fk_idventa, numerocopiasrecibo) FROM stdin;
\.


--
-- Name: copiaderecibo_pk_idcopiarecibo_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('copiaderecibo_pk_idcopiarecibo_seq', 1, false);


--
-- Data for Name: discriminapago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY discriminapago (id_pos, numeroventa2, tipofp, ventaconsulta2, valordiscriminado, serialid) FROM stdin;
\.


--
-- Data for Name: estado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY estado (pk_id_estado, pos1, pos2, led, fp1, fp2) FROM stdin;
1	0	0	0	0	0
\.


--
-- Name: estado_pk_id_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('estado_pk_id_estado_seq', 1, true);


--
-- Data for Name: finventacanasta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY finventacanasta (id_canasta, idposicionc, validacioncanasta, lecturacanasta, tipoventacanasta, serial, cantidad, cantidadvendida, nombre, valor, valormux) FROM stdin;
\.


--
-- Name: finventacanasta_id_canasta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('finventacanasta_id_canasta_seq', 1, false);


--
-- Data for Name: finventacanastacredito; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY finventacanastacredito (id_canasta, idposicionc, validacioncanasta, lecturacanasta, tipoventacanasta, serial, cantidad, cantidadvendida, nombre, valor, tipoidentificacion, serialid, valormux) FROM stdin;
1	1	\N	\N	2	                 321	\N	001	\N	\N	1	    07000000C413AF02	00015000
2	1	\N	\N	\N	00000000000000000000	\N	000	\N	\N	\N	\N	00000000
3	1	\N	\N	\N	00000000000000000000	\N	000	\N	\N	\N	\N	00000000
\.


--
-- Name: finventacanastacredito_id_canasta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('finventacanastacredito_id_canasta_seq', 1, false);


--
-- Data for Name: formadepago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY formadepago (pkformapago, id_pos, numeroventa, tipoformadepago, valorventa, valordiscriminado, identificadorfp, ventaconsulta) FROM stdin;
1	1	305	01	11915	00004000	0000000000000SDDDKUU	1
2	1	305	01	11915	00010000	00000000000000000JJJ	1
3	1	313	01	2377	00001000	00000000000000000TYY	1
4	1	313	01	2377	00002000	0000000000000000KKIO	1
5	1	313	01	2377	00001000	00000000000000000III	1
6	1	313	01	2377	00001000	0000000000000000000K	1
7	1	316	01	2852	00001000	00000000000000000JII	1
8	1	316	01	2852	00001000	0000000000000000KISL	1
9	1	316	01	2852	00001000	0000000000000000000S	1
10	1	316	01	2852	00001000	00000000000000000KIO	1
11	1	316	01	2852	00001000	0000000000000000YUYU	1
12	1	316	01	2852	00001000	00000000000000000KSG	1
13	1	316	01	2852	00000100	00000000000000000KIO	1
14	1	316	01	2852	00000100	00000000000000000KIO	1
15	1	316	01	2852	00000100	0000000000000000000K	1
16	2	315	01	1197	00000100	00000000000000000KIO	1
17	1	316	01	2852	00000100	00000000000000000KI8	1
18	1	316	01	2852	00000100	00000000000000000KI8	1
19	1	316	01	2852	00000100	00000000000000000KI8	1
20	1	316	01	2852	00000100	0000000000000000098O	1
21	1	316	03	2852	00000100	00000000000000000UY7	1
22	1	316	04	2852	00000100	0000000000000000WER2	1
23	1	316	04	2852	00000100	00000000000000000SW2	1
24	1	316	03	2852	00000100	00000000000000000SW2	1
25	1	316	04	2852	00000100	00000000000000000SW2	1
26	1	316	04	2852	00000100	00000000000000000SW2	1
\.


--
-- Name: formadepago_pkformapago_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('formadepago_pkformapago_seq', 26, true);


--
-- Data for Name: historicoformapago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY historicoformapago (pkidformapago, id_pos, numeroventa, tipoformadepago, valordiscriminado, ventaconsulta, identificadorfp) FROM stdin;
1	1	316	1	00000100	1	00000000000000000KI8
2	1	316	1	00000100	1	0000000000000000098O
3	1	316	3	00000100	1	00000000000000000UY7
4	1	316	4	00000100	1	0000000000000000WER2
5	1	316	4	00000100	1	00000000000000000SW2
6	1	316	3	00000100	1	00000000000000000SW2
7	1	316	4	00000100	1	00000000000000000SW2
8	1	316	4	00000100	1	00000000000000000SW2
\.


--
-- Name: historicoformapago_pkidformapago_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('historicoformapago_pkidformapago_seq', 8, true);


--
-- Data for Name: historicoventacanasta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY historicoventacanasta (idventacanasta, idposicionc, dineroventa) FROM stdin;
\.


--
-- Name: historicoventacanasta_idventacanasta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('historicoventacanasta_idventacanasta_seq', 1, false);


--
-- Data for Name: logos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY logos (id_logo, nombrelogo, trama, tramakios) FROM stdin;
1	Biomax		0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x03,0x07,0x0F,0x1F,0x1F,0x1E,0x3E,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3F,0x3F,0x3F,0x3F,0x3F,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x0F,0x07,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,0xFF,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,0xFC,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xC0,0xE0,0xF0,0xF0,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF0,0x00,0x00,0x00,0x00,0x00,0x00,0xFE,0xFE,0xFE,0xFE,0xFE,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x1E,0x3E,0x7C,0xFC,0xF8,0xF0,0xE0,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x03,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x3F,0x3F,0x3F,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x1C,0x1E,0x1F,0x0F,0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x7F,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFC,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF0,0xFC,0xFE,0x1F,0x0F,0x07,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0xFF,0xFF,0xFF,0xFF,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xC0,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x0F,0x0F,0x0F,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x06,0x00,0x0F,0x0F,0x0F,0x00,0x00,0x01,0x03,0x07,0x0E,0x0E,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x00,0x00,0x01,0x07,0x0F,0x0F,0x0E,0x0C,0x0C,0x0E,0x0F,0x0F,0x0E,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x00,0x00,0x01,0x03,0x07,0x0E,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x00,0x00,0x08,0x08,0x0C,0x0E,0x07,0x03,0x01,0x01,0x01,0x01,0x01,0x07,0x0F,0x0E,0x0C,0x08,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFC,0xFC,0xFC,0x1C,0x1C,0xDC,0xDC,0xDC,0xDC,0xDC,0xCC,0xFC,0xFC,0xFC,0x38,0x00,0xFC,0xFC,0xFC,0x00,0x00,0xFC,0xFC,0xFC,0x1C,0x1C,0x1C,0x1C,0x1C,0x1C,0x1C,0x1C,0x38,0xF8,0xF0,0xE0,0x0C,0x1C,0xFC,0xF8,0xE0,0x00,0x00,0x00,0x00,0x00,0xFC,0xFC,0x00,0x00,0x00,0x00,0xFC,0xFC,0xFC,0x00,0x00,0xFC,0xFC,0xFC,0x60,0x60,0x60,0x60,0x60,0x60,0x60,0x60,0x60,0xFC,0xFC,0xFC,0x00,0x00,0x0C,0x1C,0x3C,0x78,0xF0,0xE0,0xC0,0xC0,0xC0,0xE0,0xF0,0xF8,0xBC,0x1C,0x0C,0x04,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01
\N	\N	0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x03,0x07,0x0F,0x1F,0x1F,0x1E,0x3E,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3F,0x3F,0x3F,0x3F,0x3F,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x0F,0x07,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,0xFF,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,0xFC,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xC0,0xE0,0xF0,0xF0,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF0,0x00,0x00,0x00,0x00,0x00,0x00,0xFE,0xFE,0xFE,0xFE,0xFE,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x1E,0x3E,0x7C,0xFC,0xF8,0xF0,0xE0,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x03,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x3F,0x3F,0x3F,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x1C,0x1E,0x1F,0x0F,0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x7F,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFC,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF0,0xFC,0xFE,0x1F,0x0F,0x07,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0xFF,0xFF,0xFF,0xFF,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xC0,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x0F,0x0F,0x0F,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x06,0x00,0x0F,0x0F,0x0F,0x00,0x00,0x01,0x03,0x07,0x0E,0x0E,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x00,0x00,0x01,0x07,0x0F,0x0F,0x0E,0x0C,0x0C,0x0E,0x0F,0x0F,0x0E,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x00,0x00,0x01,0x03,0x07,0x0E,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x00,0x00,0x08,0x08,0x0C,0x0E,0x07,0x03,0x01,0x01,0x01,0x01,0x01,0x07,0x0F,0x0E,0x0C,0x08,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFC,0xFC,0xFC,0x1C,0x1C,0xDC,0xDC,0xDC,0xDC,0xDC,0xCC,0xFC,0xFC,0xFC,0x38,0x00,0xFC,0xFC,0xFC,0x00,0x00,0xFC,0xFC,0xFC,0x1C,0x1C,0x1C,0x1C,0x1C,0x1C,0x1C,0x1C,0x38,0xF8,0xF0,0xE0,0x0C,0x1C,0xFC,0xF8,0xE0,0x00,0x00,0x00,0x00,0x00,0xFC,0xFC,0x00,0x00,0x00,0x00,0xFC,0xFC,0xFC,0x00,0x00,0xFC,0xFC,0xFC,0x60,0x60,0x60,0x60,0x60,0x60,0x60,0x60,0x60,0xFC,0xFC,0xFC,0x00,0x00,0x0C,0x1C,0x3C,0x78,0xF0,0xE0,0xC0,0xC0,0xC0,0xE0,0xF0,0xF8,0xBC,0x1C,0x0C,0x04,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A	\N
\.


--
-- Data for Name: mantenimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY mantenimiento (idposicion, grado, autorizacion) FROM stdin;
\.


--
-- Data for Name: mapeodispensador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY mapeodispensador (pk_idposicion, numeromangueras, formatodinero, formatovolumen, formatoprecio, ppux10, numerodigitos, isla, tipoimpresora) FROM stdin;
1	2	0	3	0	0	6	1	2
2	2	0	3	0	1	6	1	2
\.


--
-- Name: mapeodispensador_pk_idposicion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('mapeodispensador_pk_idposicion_seq', 1, false);


--
-- Data for Name: mensajes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY mensajes (mensaje, id_mensaje, lecturacalibracion) FROM stdin;
Calibracion no autorizada	1	0
El  vehiculo  placa  TITO123, ha sido   autorizado	2	0
\.


--
-- Data for Name: moneda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY moneda (pk_idmoneda, unidadmoneda, descripcion, activa) FROM stdin;
1	$	COP	t
2	Q	GTQ	f
3	C$	NIO	f
4	S/.	PEH	f
5	G	HTG	f
6	€	EUR	f
7	¥	JPY	f
8	¢	CRC	f
\.


--
-- Name: moneda_pk_idmoneda_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('moneda_pk_idmoneda_seq', 8, true);


--
-- Data for Name: precios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY precios (id_pos, nsx1, nsx2, nsx3, disp1, disp2, disp3) FROM stdin;
1	06423	06960	00000	06423	06960	00000
2	08030	06960	00000	08030	06960	00000
\.


--
-- Data for Name: preset; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY preset (id_pos, tipo_p, valor_p, totalesdin, totalesvol, ppu, grado, kilometraje, serial, autorizado, tipo_venta, mensajep, validacioncredito, lecturacupocredito, calibracion) FROM stdin;
1	F 	00999900	1087891	321.32	006423	1	0	0	0	1	\N	0	0	0
2	F 	00007490	674368	103.83	008030	1	0	0	0007490	1	Felicidades, tiene cupo	0	0	1
\.


--
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY producto (pk_idproducto, nombre) FROM stdin;
1	PREMIUM
\.


--
-- Name: producto_pk_idproducto_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('producto_pk_idproducto_seq', 1, true);


--
-- Data for Name: solicitudes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY solicitudes (solicitabge2, tiposolicitud, confirmacion) FROM stdin;
1	T	0
\.


--
-- Data for Name: tipotransaccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY tipotransaccion (pk_idtipotransaccion, nombretransaccion) FROM stdin;
\.


--
-- Name: tipotransaccion_pk_idtipotransaccion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('tipotransaccion_pk_idtipotransaccion_seq', 1, false);


--
-- Data for Name: totales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY totales (pk_id_posicion, totalmanguera1, totalmanguera2, totalmanguera3, totalmanguera4, dineromanguera1, dineromanguera2, dineromanguera3, dineromanguera4) FROM stdin;
1	321.660000000000025	0	0	0	1090056	0	0	0
2	103.829999999999998	0	0	0	674368	0	0	0
\.


--
-- Name: totales_pk_id_posicion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('totales_pk_id_posicion_seq', 3, true);


--
-- Data for Name: turno; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY turno (usuario, "contraseña", turno, turnonsx, mensajeturno, habilitalecturaturno) FROM stdin;
123	0123	0	1	Cancelado por PC	1
\.


--
-- Data for Name: venta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY venta (pk_idventa, fechainicial, fechafinal, cantidadtotal, valortotal, fk_idtipotransaccion, serialibutton, identificadorweb, volumeninicial, volumenfinal, placaefectivo, nombreefectivo, dineroinicial, dinerofinal, fk_idproducto, valorprogramado, ppu, idposicion, grado, tipovehiculo, tipopreset, kilometrajecliente) FROM stdin;
225	2016-06-27 18:02:53.471775+00	2016-06-27 18:02:53.471775+00	0.978999999999999981	2448	1	\N	\N	1361.29999999999995	1362.26999999999998	          	0	20642126	20644574	\N	123	2500	1	1	1	V 	\N
226	2016-06-27 18:03:41.074909+00	2016-06-27 18:03:41.074909+00	1.15900000000000003	2898	1	\N	\N	1362.26999999999998	1363.43000000000006	          	0	20644574	20647472	\N	10800	2500	1	1	1	D 	\N
227	2016-06-28 13:05:58.586204+00	2016-06-28 13:05:58.586204+00	0.331000000000000016	828	1	\N	\N	1363.43000000000006	1363.75999999999999	          	0	20647472	20648300	\N	999900	2500	1	1	5	F 	\N
228	2016-06-29 16:19:01.556756+00	2016-06-29 16:19:01.556756+00	0.783000000000000029	1958	1	\N	\N	1365.33999999999992	1366.13000000000011	          	0	20660300	20662258	\N	5000	2500	1	1	1	2 	\N
229	2016-06-29 16:19:01.779707+00	2016-06-29 16:19:01.779707+00	0.783000000000000029	1958	1	\N	\N	1365.33999999999992	1366.13000000000011	          	0	20660300	20662258	\N	5000	2500	1	1	1	2 	\N
230	2016-06-29 16:19:02.344806+00	2016-06-29 16:19:02.344806+00	0.783000000000000029	1958	1	\N	\N	1365.33999999999992	1366.13000000000011	          	0	20660300	20662258	\N	5000	2500	1	1	1	2 	\N
231	2016-08-30 14:30:49.904185+00	2016-08-30 14:30:49.904185+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
232	2016-08-30 14:30:50.652633+00	2016-08-30 14:30:50.652633+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
233	2016-08-30 14:30:51.580085+00	2016-08-30 14:30:51.580085+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
234	2016-08-30 14:30:52.675161+00	2016-08-30 14:30:52.675161+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
235	2016-08-30 14:30:53.599578+00	2016-08-30 14:30:53.599578+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
236	2016-08-30 14:30:54.772133+00	2016-08-30 14:30:54.772133+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
237	2016-08-30 14:30:55.768399+00	2016-08-30 14:30:55.768399+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
238	2016-08-30 14:30:57.329022+00	2016-08-30 14:30:57.329022+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
239	2016-08-30 14:30:58.05534+00	2016-08-30 14:30:58.05534+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
240	2016-08-30 14:30:59.159944+00	2016-08-30 14:30:59.159944+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
241	2016-08-30 14:30:59.89232+00	2016-08-30 14:30:59.89232+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
242	2016-08-30 14:31:01.1012+00	2016-08-30 14:31:01.1012+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
243	2016-08-30 14:31:02.070235+00	2016-08-30 14:31:02.070235+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
244	2016-08-30 14:31:04.196885+00	2016-08-30 14:31:04.196885+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
245	2016-08-30 14:31:05.952112+00	2016-08-30 14:31:05.952112+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
246	2016-08-30 14:31:06.607589+00	2016-08-30 14:31:06.607589+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
247	2016-08-30 14:31:07.527682+00	2016-08-30 14:31:07.527682+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
248	2016-08-30 14:31:08.607077+00	2016-08-30 14:31:08.607077+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
249	2016-08-30 14:31:09.266045+00	2016-08-30 14:31:09.266045+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
250	2016-08-30 14:31:10.999646+00	2016-08-30 14:31:10.999646+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
251	2016-08-30 14:31:11.815224+00	2016-08-30 14:31:11.815224+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
252	2016-08-30 14:31:20.554312+00	2016-08-30 14:31:20.554312+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
253	2016-08-30 14:31:27.182927+00	2016-08-30 14:31:27.182927+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
254	2016-08-30 14:31:28.16561+00	2016-08-30 14:31:28.16561+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
255	2016-08-30 14:31:29.085348+00	2016-08-30 14:31:29.085348+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
256	2016-08-30 14:31:44.67863+00	2016-08-30 14:31:44.67863+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
257	2016-08-30 14:31:45.379737+00	2016-08-30 14:31:45.379737+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
258	2016-08-30 14:31:55.577085+00	2016-08-30 14:31:55.577085+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
259	2016-08-30 14:31:57.591492+00	2016-08-30 14:31:57.591492+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
260	2016-08-30 14:32:12.319055+00	2016-08-30 14:32:12.319055+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
261	2016-08-30 14:32:13.00387+00	2016-08-30 14:32:13.00387+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
262	2016-08-30 14:32:13.581884+00	2016-08-30 14:32:13.581884+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
263	2016-08-30 14:32:15.79575+00	2016-08-30 14:32:15.79575+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
264	2016-08-30 14:32:16.994839+00	2016-08-30 14:32:16.994839+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
265	2016-08-30 14:32:17.108582+00	2016-08-30 14:32:17.108582+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
266	2016-08-30 14:32:17.787833+00	2016-08-30 14:32:17.787833+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
267	2016-08-30 14:32:18.039064+00	2016-08-30 14:32:18.039064+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
268	2016-08-30 14:32:18.278029+00	2016-08-30 14:32:18.278029+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
269	2016-08-30 14:32:25.729008+00	2016-08-30 14:32:25.729008+00	0.152999999999999997	1213	\N	\N	\N	95.0400000000000063	95.1899999999999977	          	0	604167	605380	\N	10000	7930	2	1	1	1 	0000000000
270	2016-08-30 14:37:26.708794+00	2016-08-30 14:37:26.708794+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
271	2016-08-30 14:37:28.823873+00	2016-08-30 14:37:28.823873+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
272	2016-08-30 14:37:28.854223+00	2016-08-30 14:37:28.854223+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
283	2016-08-30 14:37:47.534872+00	2016-08-30 14:37:47.534872+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
273	2016-08-30 14:37:33.655922+00	2016-08-30 14:37:33.655922+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
274	2016-08-30 14:37:42.386462+00	2016-08-30 14:37:42.386462+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
275	2016-08-30 14:37:43.444311+00	2016-08-30 14:37:43.444311+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
276	2016-08-30 14:37:43.651164+00	2016-08-30 14:37:43.651164+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
277	2016-08-30 14:37:43.667834+00	2016-08-30 14:37:43.667834+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
278	2016-08-30 14:37:43.752018+00	2016-08-30 14:37:43.752018+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
279	2016-08-30 14:37:44.402313+00	2016-08-30 14:37:44.402313+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
280	2016-08-30 14:37:44.62416+00	2016-08-30 14:37:44.62416+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
281	2016-08-30 14:37:46.901659+00	2016-08-30 14:37:46.901659+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
282	2016-08-30 14:37:47.493359+00	2016-08-30 14:37:47.493359+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
284	2016-08-30 14:37:49.507777+00	2016-08-30 14:37:49.507777+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
285	2016-08-30 14:37:51.040422+00	2016-08-30 14:37:51.040422+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
286	2016-08-30 14:37:52.72315+00	2016-08-30 14:37:52.72315+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
287	2016-08-30 14:37:53.459978+00	2016-08-30 14:37:53.459978+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
288	2016-08-30 14:37:55.583678+00	2016-08-30 14:37:55.583678+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
289	2016-08-30 14:38:21.759349+00	2016-08-30 14:38:21.759349+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
290	2016-08-30 14:38:23.634415+00	2016-08-30 14:38:23.634415+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
291	2016-08-30 14:38:24.015209+00	2016-08-30 14:38:24.015209+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
292	2016-08-30 14:38:25.47376+00	2016-08-30 14:38:25.47376+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
293	2016-08-30 14:38:28.276242+00	2016-08-30 14:38:28.276242+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
294	2016-08-30 14:38:29.516192+00	2016-08-30 14:38:29.516192+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
295	2016-08-30 14:38:29.712964+00	2016-08-30 14:38:29.712964+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
296	2016-08-30 14:38:32.708176+00	2016-08-30 14:38:32.708176+00	0.148999999999999994	1182	\N	\N	\N	95.1899999999999977	95.3400000000000034	          	0	605380	606562	\N	10000	7930	2	1	1	1 	0000000000
297	2016-08-30 14:44:51.292059+00	2016-08-30 14:44:51.292059+00	0.544000000000000039	3494	\N	\N	\N	315.649999999999977	316.199999999999989	          	0	1051484	1054978	\N	999900	6423	1	1	3	F 	0000000000
298	2016-08-30 14:44:54.141715+00	2016-08-30 14:44:54.141715+00	0.544000000000000039	3494	\N	\N	\N	315.649999999999977	316.199999999999989	          	0	1051484	1054978	\N	999900	6423	1	1	3	F 	0000000000
299	2016-08-30 14:47:01.925645+00	2016-08-30 14:47:01.925645+00	0.381000000000000005	3021	\N	    07000000C413AF02	\N	95.3400000000000034	95.7199999999999989	      NHJJ	0	606562	609583	\N	999900	7930	2	1	3	F 	0000000002
300	2016-08-30 15:09:43.902107+00	2016-08-30 15:09:43.902107+00	0.548000000000000043	3520	\N	\N	\N	316.199999999999989	316.75	          	0	1054978	1058498	\N	999000	6423	1	1	0	F 	0000000000
305	2016-08-30 17:19:03.357254+00	2016-08-30 17:19:03.357254+00	1.85499999999999998	11915	\N	\N	\N	318.649999999999977	320.509999999999991	          	0	1070747	1082662	\N	999000	6423	1	1	0	F 	0000000000
306	2016-08-30 17:21:41.518488+00	2016-08-30 17:21:41.518488+00	1.73999999999999999	13798	\N	\N	\N	95.7199999999999989	97.4599999999999937	          	0	609583	623381	\N	999000	7930	2	1	0	F 	0000000000
301	2016-08-30 16:20:15.237997+00	2016-08-30 16:20:15.237997+00	0.180999999999999994	1163	\N	\N	\N	316.75	316.930000000000007	          	0	1058498	1059661	\N	999000	6423	1	1	0	F 	0000000000
302	2016-08-30 16:26:43.323529+00	2016-08-30 16:26:43.323529+00	0.537000000000000033	3449	\N	\N	\N	316.930000000000007	317.45999999999998	          	0	1059661	1063110	\N	999000	6423	1	1	0	F 	0000000000
303	2016-08-30 16:27:25.555971+00	2016-08-30 16:27:25.555971+00	0.354999999999999982	2280	\N	\N	\N	317.45999999999998	317.819999999999993	          	0	1063110	1065390	\N	999000	6423	1	1	0	F 	0000000000
304	2016-08-30 16:29:18.507625+00	2016-08-30 16:29:18.507625+00	0.833999999999999964	5357	\N	\N	\N	317.819999999999993	318.649999999999977	          	0	1065390	1070747	\N	999000	6423	1	1	0	F 	0000000000
307	2016-08-30 18:22:43.040954+00	2016-08-30 18:22:43.040954+00	0.135000000000000009	1071	\N	    07000000C413AF02	\N	97.4599999999999937	97.5999999999999943	         Y	0	623381	624452	\N	10000	7930	2	1	1	1 	0000000001
308	2016-08-30 18:24:10.816078+00	2016-08-30 18:24:10.816078+00	0.501000000000000001	3973	\N	\N	\N	97.5999999999999943	98.0999999999999943	          	0	624452	628425	\N	7390	7930	2	1	1	F 	0000000004
309	2016-08-30 18:31:06.150871+00	2016-08-30 18:31:06.150871+00	0.184999999999999998	1467	\N	\N	\N	98.0999999999999943	98.2800000000000011	          	0	628425	629892	\N	999000	7930	2	1	1	F 	0000000000
310	2016-08-30 18:40:24.489408+00	2016-08-30 18:40:24.489408+00	0.132000000000000006	1047	\N	\N	\N	98.2800000000000011	98.4200000000000017	         5	0	629892	630939	\N	10000	7930	2	1	1	1 	0000000000
311	2016-08-30 18:46:13.724497+00	2016-08-30 18:46:13.724497+00	0.163000000000000006	1293	\N	\N	\N	98.4200000000000017	98.5799999999999983	          	0	630939	632232	\N	10000	7930	2	1	1	1 	0000000000
312	2016-08-30 18:48:27.33793+00	2016-08-30 18:48:27.33793+00	0.236999999999999988	1879	\N	\N	\N	98.5799999999999983	98.8199999999999932	          	0	632232	634111	\N	10000	7930	2	1	1	1 	0000000000
315	2016-08-30 18:51:56.59159+00	2016-08-30 18:51:56.59159+00	0.150999999999999995	1197	\N	\N	\N	98.8799999999999955	99.0300000000000011	         F	0	634619	635816	\N	10000	7930	2	1	1	1 	0000000000
313	2016-08-30 18:48:47.066527+00	2016-08-30 18:48:47.066527+00	0.369999999999999996	2377	\N	\N	\N	320.509999999999991	320.879999999999995	       HHH	0	1082662	1085039	\N	999900	6423	1	1	3	F 	0000000000
314	2016-08-30 18:50:39.898302+00	2016-08-30 18:50:39.898302+00	0.0640000000000000013	508	\N	\N	\N	98.8199999999999932	98.8799999999999955	         H	0	634111	634619	\N	10000	7930	2	1	1	1 	0000000000
316	2016-08-30 18:58:05.089378+00	2016-08-30 18:58:05.089378+00	0.444000000000000006	2852	\N	\N	\N	320.879999999999995	321.319999999999993	        HL	0	1085039	1087891	\N	999900	6423	1	1	3	F 	0000000000
317	2016-08-30 21:21:09.715285+00	2016-08-30 21:21:09.715285+00	0.0320000000000000007	257	\N	\N	\N	99.0300000000000011	99.0600000000000023	          	0	635816	636073	\N	7490	8030	2	1	1	F 	0000000008
318	2016-08-31 14:14:44.771963+00	2016-08-31 14:14:44.771963+00	1.90300000000000002	15281	\N	\N	\N	99.0600000000000023	100.969999999999999	    PRU345	0	636073	651354	\N	10000	8030	2	1	1	1 	0000000000
319	2016-08-31 14:17:06.303619+00	2016-08-31 14:17:06.303619+00	0.492999999999999994	3959	\N	\N	\N	100.969999999999999	101.459999999999994	       JFJ	0	651354	655313	\N	10000	8030	2	1	1	1 	0000000000
320	2016-08-31 14:21:19.775369+00	2016-08-31 14:21:19.775369+00	0.235999999999999988	1895	\N	\N	\N	101.459999999999994	101.689999999999998	         L	0	655313	657208	\N	10000	8030	2	1	1	1 	0000000000
321	2016-08-31 14:22:16.196265+00	2016-08-31 14:22:16.196265+00	0.0560000000000000012	450	\N	\N	\N	101.689999999999998	101.75	         D	0	657208	657658	\N	10000	8030	2	1	1	1 	0000000000
322	2016-08-31 14:28:36.590416+00	2016-08-31 14:28:36.590416+00	0.213999999999999996	1718	\N	\N	\N	101.75	101.959999999999994	         G	0	657658	659376	\N	10000	8030	2	1	1	1 	0000000000
323	2016-08-31 14:30:16.292389+00	2016-08-31 14:30:16.292389+00	0.0899999999999999967	723	\N	\N	\N	101.959999999999994	102.049999999999997	         I	0	659376	660099	\N	10000	8030	2	1	1	1 	0000000000
324	2016-08-31 14:33:07.040778+00	2016-08-31 14:33:07.040778+00	0.0410000000000000017	329	\N	\N	\N	102.049999999999997	102.099999999999994	         E	0	660099	660428	\N	10000	8030	2	1	1	1 	0000000000
325	2016-08-31 14:34:44.753731+00	2016-08-31 14:34:44.753731+00	0.148999999999999994	1196	\N	\N	\N	102.099999999999994	102.239999999999995	         R	0	660428	661624	\N	10000	8030	2	1	1	1 	0000000000
326	2016-08-31 14:43:44.11881+00	2016-08-31 14:43:44.11881+00	0.162000000000000005	1301	\N	\N	\N	102.239999999999995	102.409999999999997	     LISTO	0	661624	662925	\N	10000	8030	2	1	1	1 	0000000000
327	2016-08-31 16:46:54.924509+00	2016-08-31 16:46:54.924509+00	0.194000000000000006	1558	\N	\N	\N	102.409999999999997	102.599999999999994	          	0	662925	664483	\N	10000	8030	2	1	1	1 	0000000000
328	2016-08-31 17:08:02.65385+00	2016-08-31 17:08:02.65385+00	0.233000000000000013	1871	\N	\N	\N	102.599999999999994	102.829999999999998	         K	0	664483	666354	\N	10000	8030	2	1	1	1 	0000000000
329	2016-08-31 17:58:43.387404+00	2016-08-31 17:58:43.387404+00	0.337000000000000022	2165	\N	\N	\N	321.319999999999993	321.660000000000025	      YUYY	0	1087891	1090056	\N	999900	6423	1	1	3	F 	0000000000
330	2016-08-31 19:42:50.244432+00	2016-08-31 19:42:50.244432+00	0.997999999999999998	8014	\N	\N	\N	102.829999999999998	103.829999999999998	          	0	666354	674368	\N	999000	8030	2	1	1	F 	0000000000
\.


--
-- Data for Name: venta_canasta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY venta_canasta (id_canasta, idposicionc, validacioncanasta, lecturacanasta, tipoventacanasta, serial, cantidad, cantidadvendida, nombre, valor, valormux) FROM stdin;
\.


--
-- Name: venta_canasta_id_canasta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('venta_canasta_id_canasta_seq', 1, false);


--
-- Name: venta_pk_idventa_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('venta_pk_idventa_seq', 330, true);


--
-- Data for Name: verificapago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY verificapago (id_pos, validacion, valorventa, activateclado) FROM stdin;
1	0	10000	1
\.


--
-- Name: botones_id_boton_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY botones
    ADD CONSTRAINT botones_id_boton_key UNIQUE (id_boton);


--
-- Name: configuracion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY configuracion
    ADD CONSTRAINT configuracion_pkey PRIMARY KEY (pk_idconfiguracion);


--
-- Name: configuraciondispensador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY configuraciondispensador
    ADD CONSTRAINT configuraciondispensador_pkey PRIMARY KEY (pk_idconfiguraciondispen);


--
-- Name: consignaciones_pk_idconsignacion_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY consignaciones
    ADD CONSTRAINT consignaciones_pk_idconsignacion_key UNIQUE (pk_idconsignacion);


--
-- Name: copiaderecibo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY copiaderecibo
    ADD CONSTRAINT copiaderecibo_pkey PRIMARY KEY (pk_idcopiarecibo);


--
-- Name: estado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (pk_id_estado);


--
-- Name: finventacanasta_id_canasta_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY finventacanasta
    ADD CONSTRAINT finventacanasta_id_canasta_key UNIQUE (id_canasta);


--
-- Name: finventacanastacredito_id_canasta_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY finventacanastacredito
    ADD CONSTRAINT finventacanastacredito_id_canasta_key UNIQUE (id_canasta);


--
-- Name: formadepago_pkformapago_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY formadepago
    ADD CONSTRAINT formadepago_pkformapago_key UNIQUE (pkformapago);


--
-- Name: historicoformapago_pkidformapago_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY historicoformapago
    ADD CONSTRAINT historicoformapago_pkidformapago_key UNIQUE (pkidformapago);


--
-- Name: historicoventacanasta_idventacanasta_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY historicoventacanasta
    ADD CONSTRAINT historicoventacanasta_idventacanasta_key UNIQUE (idventacanasta);


--
-- Name: mapeodispensador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY mapeodispensador
    ADD CONSTRAINT mapeodispensador_pkey PRIMARY KEY (pk_idposicion);


--
-- Name: moneda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY moneda
    ADD CONSTRAINT moneda_pkey PRIMARY KEY (pk_idmoneda);


--
-- Name: precios_id_pos_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY precios
    ADD CONSTRAINT precios_id_pos_key UNIQUE (id_pos);


--
-- Name: preset_id_pos_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY preset
    ADD CONSTRAINT preset_id_pos_key UNIQUE (id_pos);


--
-- Name: producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (pk_idproducto);


--
-- Name: tipotransaccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY tipotransaccion
    ADD CONSTRAINT tipotransaccion_pkey PRIMARY KEY (pk_idtipotransaccion);


--
-- Name: totales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY totales
    ADD CONSTRAINT totales_pkey PRIMARY KEY (pk_id_posicion);


--
-- Name: venta_canasta_id_canasta_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY venta_canasta
    ADD CONSTRAINT venta_canasta_id_canasta_key UNIQUE (id_canasta);


--
-- Name: venta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY venta
    ADD CONSTRAINT venta_pkey PRIMARY KEY (pk_idventa);


--
-- Name: limpiar_copia_recibo_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER limpiar_copia_recibo_trigger BEFORE INSERT ON copiaderecibo FOR EACH STATEMENT EXECUTE PROCEDURE limpiar_copia_recibo();


--
-- Name: limpiar_ventas_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER limpiar_ventas_trigger BEFORE INSERT ON venta FOR EACH STATEMENT EXECUTE PROCEDURE limpiar_ventas();


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: botones; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE botones FROM PUBLIC;
REVOKE ALL ON TABLE botones FROM postgres;
GRANT ALL ON TABLE botones TO postgres;
GRANT ALL ON TABLE botones TO db_admin;


--
-- Name: configuracion; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE configuracion FROM PUBLIC;
REVOKE ALL ON TABLE configuracion FROM postgres;
GRANT ALL ON TABLE configuracion TO postgres;
GRANT ALL ON TABLE configuracion TO db_admin;


--
-- Name: configuracion_pk_idconfiguracion_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE configuracion_pk_idconfiguracion_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE configuracion_pk_idconfiguracion_seq FROM postgres;
GRANT ALL ON SEQUENCE configuracion_pk_idconfiguracion_seq TO postgres;
GRANT ALL ON SEQUENCE configuracion_pk_idconfiguracion_seq TO db_admin;


--
-- Name: configuraciondispensador; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE configuraciondispensador FROM PUBLIC;
REVOKE ALL ON TABLE configuraciondispensador FROM postgres;
GRANT ALL ON TABLE configuraciondispensador TO postgres;
GRANT ALL ON TABLE configuraciondispensador TO db_admin;


--
-- Name: configuraciondispensador_pk_idconfiguraciondispen_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE configuraciondispensador_pk_idconfiguraciondispen_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE configuraciondispensador_pk_idconfiguraciondispen_seq FROM postgres;
GRANT ALL ON SEQUENCE configuraciondispensador_pk_idconfiguraciondispen_seq TO postgres;
GRANT ALL ON SEQUENCE configuraciondispensador_pk_idconfiguraciondispen_seq TO db_admin;


--
-- Name: consignaciones; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE consignaciones FROM PUBLIC;
REVOKE ALL ON TABLE consignaciones FROM postgres;
GRANT ALL ON TABLE consignaciones TO postgres;
GRANT ALL ON TABLE consignaciones TO db_admin;


--
-- Name: copiaderecibo; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE copiaderecibo FROM PUBLIC;
REVOKE ALL ON TABLE copiaderecibo FROM postgres;
GRANT ALL ON TABLE copiaderecibo TO postgres;
GRANT ALL ON TABLE copiaderecibo TO db_admin;


--
-- Name: copiaderecibo_pk_idcopiarecibo_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE copiaderecibo_pk_idcopiarecibo_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE copiaderecibo_pk_idcopiarecibo_seq FROM postgres;
GRANT ALL ON SEQUENCE copiaderecibo_pk_idcopiarecibo_seq TO postgres;
GRANT ALL ON SEQUENCE copiaderecibo_pk_idcopiarecibo_seq TO db_admin;


--
-- Name: estado; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE estado FROM PUBLIC;
REVOKE ALL ON TABLE estado FROM postgres;
GRANT ALL ON TABLE estado TO postgres;
GRANT ALL ON TABLE estado TO db_admin;


--
-- Name: estado_pk_id_estado_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE estado_pk_id_estado_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE estado_pk_id_estado_seq FROM postgres;
GRANT ALL ON SEQUENCE estado_pk_id_estado_seq TO postgres;
GRANT ALL ON SEQUENCE estado_pk_id_estado_seq TO db_admin;


--
-- Name: logos; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE logos FROM PUBLIC;
REVOKE ALL ON TABLE logos FROM postgres;
GRANT ALL ON TABLE logos TO postgres;
GRANT ALL ON TABLE logos TO db_admin;


--
-- Name: mapeodispensador; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE mapeodispensador FROM PUBLIC;
REVOKE ALL ON TABLE mapeodispensador FROM postgres;
GRANT ALL ON TABLE mapeodispensador TO postgres;
GRANT ALL ON TABLE mapeodispensador TO db_admin;


--
-- Name: mapeodispensador_pk_idposicion_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE mapeodispensador_pk_idposicion_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE mapeodispensador_pk_idposicion_seq FROM postgres;
GRANT ALL ON SEQUENCE mapeodispensador_pk_idposicion_seq TO postgres;
GRANT ALL ON SEQUENCE mapeodispensador_pk_idposicion_seq TO db_admin;


--
-- Name: mensajes; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE mensajes FROM PUBLIC;
REVOKE ALL ON TABLE mensajes FROM postgres;
GRANT ALL ON TABLE mensajes TO postgres;
GRANT ALL ON TABLE mensajes TO db_admin;


--
-- Name: moneda; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE moneda FROM PUBLIC;
REVOKE ALL ON TABLE moneda FROM postgres;
GRANT ALL ON TABLE moneda TO postgres;
GRANT ALL ON TABLE moneda TO db_admin;


--
-- Name: moneda_pk_idmoneda_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE moneda_pk_idmoneda_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE moneda_pk_idmoneda_seq FROM postgres;
GRANT ALL ON SEQUENCE moneda_pk_idmoneda_seq TO postgres;
GRANT ALL ON SEQUENCE moneda_pk_idmoneda_seq TO db_admin;


--
-- Name: precios; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE precios FROM PUBLIC;
REVOKE ALL ON TABLE precios FROM postgres;
GRANT ALL ON TABLE precios TO postgres;
GRANT ALL ON TABLE precios TO db_admin;


--
-- Name: preset; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE preset FROM PUBLIC;
REVOKE ALL ON TABLE preset FROM postgres;
GRANT ALL ON TABLE preset TO postgres;
GRANT ALL ON TABLE preset TO db_admin;


--
-- Name: producto; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE producto FROM PUBLIC;
REVOKE ALL ON TABLE producto FROM postgres;
GRANT ALL ON TABLE producto TO postgres;
GRANT ALL ON TABLE producto TO db_admin;


--
-- Name: producto_pk_idproducto_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE producto_pk_idproducto_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE producto_pk_idproducto_seq FROM postgres;
GRANT ALL ON SEQUENCE producto_pk_idproducto_seq TO postgres;
GRANT ALL ON SEQUENCE producto_pk_idproducto_seq TO db_admin;


--
-- Name: solicitudes; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE solicitudes FROM PUBLIC;
REVOKE ALL ON TABLE solicitudes FROM postgres;
GRANT ALL ON TABLE solicitudes TO postgres;
GRANT ALL ON TABLE solicitudes TO db_admin;


--
-- Name: tipotransaccion; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE tipotransaccion FROM PUBLIC;
REVOKE ALL ON TABLE tipotransaccion FROM postgres;
GRANT ALL ON TABLE tipotransaccion TO postgres;
GRANT ALL ON TABLE tipotransaccion TO db_admin;


--
-- Name: tipotransaccion_pk_idtipotransaccion_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE tipotransaccion_pk_idtipotransaccion_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE tipotransaccion_pk_idtipotransaccion_seq FROM postgres;
GRANT ALL ON SEQUENCE tipotransaccion_pk_idtipotransaccion_seq TO postgres;
GRANT ALL ON SEQUENCE tipotransaccion_pk_idtipotransaccion_seq TO db_admin;


--
-- Name: totales; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE totales FROM PUBLIC;
REVOKE ALL ON TABLE totales FROM postgres;
GRANT ALL ON TABLE totales TO postgres;
GRANT ALL ON TABLE totales TO db_admin;


--
-- Name: totales_pk_id_posicion_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE totales_pk_id_posicion_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE totales_pk_id_posicion_seq FROM postgres;
GRANT ALL ON SEQUENCE totales_pk_id_posicion_seq TO postgres;
GRANT ALL ON SEQUENCE totales_pk_id_posicion_seq TO db_admin;


--
-- Name: turno; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE turno FROM PUBLIC;
REVOKE ALL ON TABLE turno FROM postgres;
GRANT ALL ON TABLE turno TO postgres;
GRANT ALL ON TABLE turno TO db_admin;


--
-- Name: venta; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE venta FROM PUBLIC;
REVOKE ALL ON TABLE venta FROM postgres;
GRANT ALL ON TABLE venta TO postgres;
GRANT ALL ON TABLE venta TO db_admin;


--
-- Name: venta_pk_idventa_seq; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON SEQUENCE venta_pk_idventa_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE venta_pk_idventa_seq FROM postgres;
GRANT ALL ON SEQUENCE venta_pk_idventa_seq TO postgres;
GRANT ALL ON SEQUENCE venta_pk_idventa_seq TO db_admin;


--
-- PostgreSQL database dump complete
--

