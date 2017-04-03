--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
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
-- Name: limpiar_copia_recibo(); Type: FUNCTION; Schema: public; Owner: db_admin
--

CREATE FUNCTION limpiar_copia_recibo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM copiaderecibo WHERE Pk_IdCopiaRecibo < (SELECT MAX(Pk_IdCopiaRecibo) - 5 FROM copiaderecibo); 
  RETURN NULL;
END;
$$;


ALTER FUNCTION public.limpiar_copia_recibo() OWNER TO db_admin;

--
-- Name: limpiar_historicocanasta(); Type: FUNCTION; Schema: public; Owner: db_admin
--

CREATE FUNCTION limpiar_historicocanasta() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM historicoventacanasta WHERE idventacanasta < (SELECT MAX(idventacanasta) - 1000 FROM historicoventacanasta); 
  RETURN NULL;
END;
$$;


ALTER FUNCTION public.limpiar_historicocanasta() OWNER TO db_admin;

--
-- Name: limpiar_historicoformasdepago(); Type: FUNCTION; Schema: public; Owner: db_admin
--

CREATE FUNCTION limpiar_historicoformasdepago() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM historicoformapago WHERE pkidformapago < (SELECT MAX(pkidformapago) - 1000 FROM historicoformapago); 
  RETURN NULL;
END;
$$;


ALTER FUNCTION public.limpiar_historicoformasdepago() OWNER TO db_admin;

--
-- Name: limpiar_ventas(); Type: FUNCTION; Schema: public; Owner: db_admin
--

CREATE FUNCTION limpiar_ventas() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM venta WHERE Pk_Idventa < (SELECT MAX(Pk_idVenta) - 1000 FROM venta); 
  RETURN NULL;
END;
$$;


ALTER FUNCTION public.limpiar_ventas() OWNER TO db_admin;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: botones; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE botones (
    id_boton integer,
    textoboton character varying(8)
);


ALTER TABLE botones OWNER TO db_admin;

--
-- Name: configuracion; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE configuracion (
    pk_idconfiguracion integer NOT NULL,
    nombre character varying(255),
    descripcion character varying(255),
    valor character varying(255)
);


ALTER TABLE configuracion OWNER TO db_admin;

--
-- Name: configuracion_pk_idconfiguracion_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE configuracion_pk_idconfiguracion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE configuracion_pk_idconfiguracion_seq OWNER TO db_admin;

--
-- Name: configuracion_pk_idconfiguracion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE configuracion_pk_idconfiguracion_seq OWNED BY configuracion.pk_idconfiguracion;


--
-- Name: configuraciondispensador; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE configuraciondispensador (
    pk_idconfiguraciondispen integer NOT NULL,
    nombre character varying(255),
    descripcion character varying(255),
    valor character varying(255),
    activa boolean
);


ALTER TABLE configuraciondispensador OWNER TO db_admin;

--
-- Name: configuraciondispensador_pk_idconfiguraciondispen_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE configuraciondispensador_pk_idconfiguraciondispen_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE configuraciondispensador_pk_idconfiguraciondispen_seq OWNER TO db_admin;

--
-- Name: configuraciondispensador_pk_idconfiguraciondispen_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE configuraciondispensador_pk_idconfiguraciondispen_seq OWNED BY configuraciondispensador.pk_idconfiguraciondispen;


--
-- Name: consignaciones; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE consignaciones (
    pk_idconsignacion integer,
    valorconsignacion integer,
    mensajeconsignacion character varying(60),
    idpos integer,
    confirmacion integer,
    recibe integer
);


ALTER TABLE consignaciones OWNER TO db_admin;

--
-- Name: copiaderecibo; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE copiaderecibo (
    pk_idcopiarecibo integer NOT NULL,
    fk_idventa integer,
    numerocopiasrecibo integer
);


ALTER TABLE copiaderecibo OWNER TO db_admin;

--
-- Name: copiaderecibo_pk_idcopiarecibo_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE copiaderecibo_pk_idcopiarecibo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE copiaderecibo_pk_idcopiarecibo_seq OWNER TO db_admin;

--
-- Name: copiaderecibo_pk_idcopiarecibo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE copiaderecibo_pk_idcopiarecibo_seq OWNED BY copiaderecibo.pk_idcopiarecibo;


--
-- Name: discriminapago; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE discriminapago (
    id_pos integer,
    numeroventa2 character varying(8),
    tipofp character(2),
    ventaconsulta2 integer,
    valordiscriminado character varying(8),
    serialid character varying(20)
);


ALTER TABLE discriminapago OWNER TO db_admin;

--
-- Name: estado; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE estado (
    pk_id_estado integer NOT NULL,
    pos1 integer,
    pos2 integer,
    led integer,
    fp1 integer,
    fp2 integer,
    nsxonline integer,
    bloqueocorte integer
);


ALTER TABLE estado OWNER TO db_admin;

--
-- Name: estado_pk_id_estado_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE estado_pk_id_estado_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE estado_pk_id_estado_seq OWNER TO db_admin;

--
-- Name: estado_pk_id_estado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE estado_pk_id_estado_seq OWNED BY estado.pk_id_estado;


--
-- Name: finventacanasta; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
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


ALTER TABLE finventacanasta OWNER TO db_admin;

--
-- Name: finventacanasta_id_canasta_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE finventacanasta_id_canasta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE finventacanasta_id_canasta_seq OWNER TO db_admin;

--
-- Name: finventacanasta_id_canasta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE finventacanasta_id_canasta_seq OWNED BY finventacanasta.id_canasta;


--
-- Name: finventacanastacredito; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
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


ALTER TABLE finventacanastacredito OWNER TO db_admin;

--
-- Name: finventacanastacredito_id_canasta_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE finventacanastacredito_id_canasta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE finventacanastacredito_id_canasta_seq OWNER TO db_admin;

--
-- Name: finventacanastacredito_id_canasta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE finventacanastacredito_id_canasta_seq OWNED BY finventacanastacredito.id_canasta;


--
-- Name: formadepago; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
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


ALTER TABLE formadepago OWNER TO db_admin;

--
-- Name: formadepago_pkformapago_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE formadepago_pkformapago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE formadepago_pkformapago_seq OWNER TO db_admin;

--
-- Name: formadepago_pkformapago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE formadepago_pkformapago_seq OWNED BY formadepago.pkformapago;


--
-- Name: historicoformapago; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
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


ALTER TABLE historicoformapago OWNER TO db_admin;

--
-- Name: historicoformapago_pkidformapago_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE historicoformapago_pkidformapago_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE historicoformapago_pkidformapago_seq OWNER TO db_admin;

--
-- Name: historicoformapago_pkidformapago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE historicoformapago_pkidformapago_seq OWNED BY historicoformapago.pkidformapago;


--
-- Name: historicoventacanasta; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE historicoventacanasta (
    idventacanasta integer NOT NULL,
    idposicionc integer,
    dineroventa character varying(8)
);


ALTER TABLE historicoventacanasta OWNER TO db_admin;

--
-- Name: historicoventacanasta_idventacanasta_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE historicoventacanasta_idventacanasta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE historicoventacanasta_idventacanasta_seq OWNER TO db_admin;

--
-- Name: historicoventacanasta_idventacanasta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE historicoventacanasta_idventacanasta_seq OWNED BY historicoventacanasta.idventacanasta;


--
-- Name: logos; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE logos (
    id_logo integer,
    nombrelogo character varying(30),
    trama text,
    tramakios text
);


ALTER TABLE logos OWNER TO db_admin;

--
-- Name: mantenimiento; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE mantenimiento (
    idposicion integer,
    grado integer,
    autorizacion integer
);


ALTER TABLE mantenimiento OWNER TO db_admin;

--
-- Name: mapeodispensador; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
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
    tipoimpresora integer,
    impresora integer
);


ALTER TABLE mapeodispensador OWNER TO db_admin;

--
-- Name: mapeodispensador_pk_idposicion_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE mapeodispensador_pk_idposicion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE mapeodispensador_pk_idposicion_seq OWNER TO db_admin;

--
-- Name: mapeodispensador_pk_idposicion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE mapeodispensador_pk_idposicion_seq OWNED BY mapeodispensador.pk_idposicion;


--
-- Name: mensajes; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE mensajes (
    mensaje character varying(60),
    id_mensaje integer,
    lecturacalibracion integer
);


ALTER TABLE mensajes OWNER TO db_admin;

--
-- Name: moneda; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE moneda (
    pk_idmoneda integer NOT NULL,
    unidadmoneda character varying(10),
    descripcion character varying(255),
    activa boolean
);


ALTER TABLE moneda OWNER TO db_admin;

--
-- Name: moneda_pk_idmoneda_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE moneda_pk_idmoneda_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE moneda_pk_idmoneda_seq OWNER TO db_admin;

--
-- Name: moneda_pk_idmoneda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE moneda_pk_idmoneda_seq OWNED BY moneda.pk_idmoneda;


--
-- Name: precios; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
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


ALTER TABLE precios OWNER TO db_admin;

--
-- Name: preset; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
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


ALTER TABLE preset OWNER TO db_admin;

--
-- Name: producto; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE producto (
    pk_idproducto integer NOT NULL,
    nombre character varying(255)
);


ALTER TABLE producto OWNER TO db_admin;

--
-- Name: producto_pk_idproducto_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE producto_pk_idproducto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE producto_pk_idproducto_seq OWNER TO db_admin;

--
-- Name: producto_pk_idproducto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE producto_pk_idproducto_seq OWNED BY producto.pk_idproducto;


--
-- Name: solicitudes; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE solicitudes (
    solicitabge2 integer,
    tiposolicitud character(1),
    confirmacion integer
);


ALTER TABLE solicitudes OWNER TO db_admin;

--
-- Name: tipotransaccion; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE tipotransaccion (
    pk_idtipotransaccion integer NOT NULL,
    nombretransaccion character varying(255)
);


ALTER TABLE tipotransaccion OWNER TO db_admin;

--
-- Name: tipotransaccion_pk_idtipotransaccion_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE tipotransaccion_pk_idtipotransaccion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tipotransaccion_pk_idtipotransaccion_seq OWNER TO db_admin;

--
-- Name: tipotransaccion_pk_idtipotransaccion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE tipotransaccion_pk_idtipotransaccion_seq OWNED BY tipotransaccion.pk_idtipotransaccion;


--
-- Name: totales; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
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


ALTER TABLE totales OWNER TO db_admin;

--
-- Name: totales_pk_id_posicion_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE totales_pk_id_posicion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE totales_pk_id_posicion_seq OWNER TO db_admin;

--
-- Name: totales_pk_id_posicion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE totales_pk_id_posicion_seq OWNED BY totales.pk_id_posicion;


--
-- Name: turno; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE turno (
    usuario character varying(10),
    turno integer,
    turnonsx integer,
    mensajeturno character varying(60),
    habilitalecturaturno integer,
    passwd character varying(8)
);


ALTER TABLE turno OWNER TO db_admin;

--
-- Name: venta; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
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


ALTER TABLE venta OWNER TO db_admin;

--
-- Name: venta_canasta; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
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


ALTER TABLE venta_canasta OWNER TO db_admin;

--
-- Name: venta_canasta_id_canasta_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE venta_canasta_id_canasta_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE venta_canasta_id_canasta_seq OWNER TO db_admin;

--
-- Name: venta_canasta_id_canasta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE venta_canasta_id_canasta_seq OWNED BY venta_canasta.id_canasta;


--
-- Name: venta_pk_idventa_seq; Type: SEQUENCE; Schema: public; Owner: db_admin
--

CREATE SEQUENCE venta_pk_idventa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE venta_pk_idventa_seq OWNER TO db_admin;

--
-- Name: venta_pk_idventa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: db_admin
--

ALTER SEQUENCE venta_pk_idventa_seq OWNED BY venta.pk_idventa;


--
-- Name: verificapago; Type: TABLE; Schema: public; Owner: db_admin; Tablespace: 
--

CREATE TABLE verificapago (
    id_pos integer,
    validacion integer,
    valorventa character varying(8),
    activateclado integer
);


ALTER TABLE verificapago OWNER TO db_admin;

--
-- Name: pk_idconfiguracion; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY configuracion ALTER COLUMN pk_idconfiguracion SET DEFAULT nextval('configuracion_pk_idconfiguracion_seq'::regclass);


--
-- Name: pk_idconfiguraciondispen; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY configuraciondispensador ALTER COLUMN pk_idconfiguraciondispen SET DEFAULT nextval('configuraciondispensador_pk_idconfiguraciondispen_seq'::regclass);


--
-- Name: pk_idcopiarecibo; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY copiaderecibo ALTER COLUMN pk_idcopiarecibo SET DEFAULT nextval('copiaderecibo_pk_idcopiarecibo_seq'::regclass);


--
-- Name: pk_id_estado; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY estado ALTER COLUMN pk_id_estado SET DEFAULT nextval('estado_pk_id_estado_seq'::regclass);


--
-- Name: id_canasta; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY finventacanasta ALTER COLUMN id_canasta SET DEFAULT nextval('finventacanasta_id_canasta_seq'::regclass);


--
-- Name: id_canasta; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY finventacanastacredito ALTER COLUMN id_canasta SET DEFAULT nextval('finventacanastacredito_id_canasta_seq'::regclass);


--
-- Name: pkformapago; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY formadepago ALTER COLUMN pkformapago SET DEFAULT nextval('formadepago_pkformapago_seq'::regclass);


--
-- Name: pkidformapago; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY historicoformapago ALTER COLUMN pkidformapago SET DEFAULT nextval('historicoformapago_pkidformapago_seq'::regclass);


--
-- Name: idventacanasta; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY historicoventacanasta ALTER COLUMN idventacanasta SET DEFAULT nextval('historicoventacanasta_idventacanasta_seq'::regclass);


--
-- Name: pk_idposicion; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY mapeodispensador ALTER COLUMN pk_idposicion SET DEFAULT nextval('mapeodispensador_pk_idposicion_seq'::regclass);


--
-- Name: pk_idmoneda; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY moneda ALTER COLUMN pk_idmoneda SET DEFAULT nextval('moneda_pk_idmoneda_seq'::regclass);


--
-- Name: pk_idproducto; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY producto ALTER COLUMN pk_idproducto SET DEFAULT nextval('producto_pk_idproducto_seq'::regclass);


--
-- Name: pk_idtipotransaccion; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY tipotransaccion ALTER COLUMN pk_idtipotransaccion SET DEFAULT nextval('tipotransaccion_pk_idtipotransaccion_seq'::regclass);


--
-- Name: pk_id_posicion; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY totales ALTER COLUMN pk_id_posicion SET DEFAULT nextval('totales_pk_id_posicion_seq'::regclass);


--
-- Name: pk_idventa; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY venta ALTER COLUMN pk_idventa SET DEFAULT nextval('venta_pk_idventa_seq'::regclass);


--
-- Name: id_canasta; Type: DEFAULT; Schema: public; Owner: db_admin
--

ALTER TABLE ONLY venta_canasta ALTER COLUMN id_canasta SET DEFAULT nextval('venta_canasta_id_canasta_seq'::regclass);


--
-- Data for Name: botones; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY botones (id_boton, textoboton) FROM stdin;
40	Placa   
1	Ventas  
2	Turnos  
3	Canasta 
4	Consigna
5	Mtto    
6	C.Recibo
41	Ingrese 
42	  KM    
43	Ingrese 
44	NIT/CC  
45	Formas  
46	de Pago 
82	 Serial 
83	 Vuelva 
84	Pronto  
85	Ingrese 
86	 Venta  
87	Separar 
7	VERSION 
88	Dinero  
89	 Accion 
90	Anulada 
91	Metodos 
92	   ID   
93	Ibutton 
94	Tag     
8	POSICION
9	HORA    
95	Cedula  
96	 Placa  
97	Cod.Bar 
98	        
99	Esperar 
100	Continua
101	Producto
102	Cantidad
103	Precio  
47	T Debito
48	TCR A-Fa
10	FECHA   
49	TCR V-M 
50	BSodexho
51	TCR D-B 
52	Efectivo
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
104	Total   
105	Ingrese 
106	Codigo  
24	Volumen 
25	 Escoja 
26	Producto
27	Extra   
28	Corrient
29	Diesel  
30	        
31	Suba la 
32	 Manija 
33	Espere..
34	        
35	Error de
36	Sistema 
37	Tanqueo 
38	En Curso
39	Ingrese 
107	Calibra 
53	Cheques 
54	BBiomax 
55	BBigPass
56	C Planta
108	Imprimir
109	Escoja  
110	Impreso 
57	C Cheque
58	B Tiempo
59	CConsumo
60	Anticipo
61	BonosOPL
62	ADiamoni
63	Antic RH
64	TSodexho
65	TBigPass
66	Forma 22
67	BCBoliva
68	Forma 23
69	ReteFt C
111	Abrir   
112	Cerrar  
113	Ingrese 
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
114	Clave   
115	
80	        
81	Gracias!
\.


--
-- Data for Name: configuracion; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY configuracion (pk_idconfiguracion, nombre, descripcion, valor) FROM stdin;
\.


--
-- Name: configuracion_pk_idconfiguracion_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('configuracion_pk_idconfiguracion_seq', 1, false);


--
-- Data for Name: configuraciondispensador; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY configuraciondispensador (pk_idconfiguraciondispen, nombre, descripcion, valor, activa) FROM stdin;
24	SimboloVolumen	Simb Volumen	G	t
1	Encabezados	Encabezados	ESTACION DE SERVICIO	t
2	Encabezados	Encabezados	SAN SEBASTIAN	t
3	Encabezados	Encabezados	NIT. 900.072.847-4	t
4	Encabezados	Encabezados	BOGOTA D.C	t
5	Encabezados	Encabezados		t
6	Encabezados	Encabezados	TEL: 350-2648053	t
7	Encabezados	Encabezados		t
8	Encabezados	Encabezados		t
9	Pie	Pie	GRACIAS POR SU COMPRA	t
10	Pie	Pie	VUELVA PRONTO	t
11	Pie	Pie	£	t
25	Preset1	Preset rapido	10000	t
26	Preset2	Preset rapido	20000	t
27	Preset3	Preset rapido	50000	t
\.


--
-- Name: configuraciondispensador_pk_idconfiguraciondispen_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('configuraciondispensador_pk_idconfiguraciondispen_seq', 1, false);


--
-- Data for Name: consignaciones; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY consignaciones (pk_idconsignacion, valorconsignacion, mensajeconsignacion, idpos, confirmacion, recibe) FROM stdin;
1	78000	Operacion Incorrecta	1	0	1
\.


--
-- Data for Name: copiaderecibo; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY copiaderecibo (pk_idcopiarecibo, fk_idventa, numerocopiasrecibo) FROM stdin;
\.


--
-- Name: copiaderecibo_pk_idcopiarecibo_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('copiaderecibo_pk_idcopiarecibo_seq', 1, false);


--
-- Data for Name: discriminapago; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY discriminapago (id_pos, numeroventa2, tipofp, ventaconsulta2, valordiscriminado, serialid) FROM stdin;
\.


--
-- Data for Name: estado; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY estado (pk_id_estado, pos1, pos2, led, fp1, fp2, nsxonline, bloqueocorte) FROM stdin;
1	22	22	1	0	0	1	2
\.


--
-- Name: estado_pk_id_estado_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('estado_pk_id_estado_seq', 1, true);


--
-- Data for Name: finventacanasta; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY finventacanasta (id_canasta, idposicionc, validacioncanasta, lecturacanasta, tipoventacanasta, serial, cantidad, cantidadvendida, nombre, valor, valormux) FROM stdin;
\.


--
-- Name: finventacanasta_id_canasta_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('finventacanasta_id_canasta_seq', 1, false);


--
-- Data for Name: finventacanastacredito; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY finventacanastacredito (id_canasta, idposicionc, validacioncanasta, lecturacanasta, tipoventacanasta, serial, cantidad, cantidadvendida, nombre, valor, tipoidentificacion, serialid, valormux) FROM stdin;
\.


--
-- Name: finventacanastacredito_id_canasta_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('finventacanastacredito_id_canasta_seq', 1, false);


--
-- Data for Name: formadepago; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY formadepago (pkformapago, id_pos, numeroventa, tipoformadepago, valorventa, valordiscriminado, identificadorfp, ventaconsulta) FROM stdin;
1	1	1	01	4285	00004185	                   G	1
2	1	1	01	4285	00004185	                   5	1
3	1	1	01	4285	00004185	                   6	1
4	1	1	01	4285	00004185	                   6	1
\.


--
-- Name: formadepago_pkformapago_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('formadepago_pkformapago_seq', 8, true);


--
-- Data for Name: historicoformapago; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY historicoformapago (pkidformapago, id_pos, numeroventa, tipoformadepago, valordiscriminado, ventaconsulta, identificadorfp) FROM stdin;
1	1	1	1	00000100	1	00000000000000000000
2	1	4	2	00004263	1	                 T5H
\.


--
-- Name: historicoformapago_pkidformapago_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('historicoformapago_pkidformapago_seq', 2, true);


--
-- Data for Name: historicoventacanasta; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY historicoventacanasta (idventacanasta, idposicionc, dineroventa) FROM stdin;
1	1	1500
\.


--
-- Name: historicoventacanasta_idventacanasta_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('historicoventacanasta_idventacanasta_seq', 1, true);


--
-- Data for Name: logos; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY logos (id_logo, nombrelogo, trama, tramakios) FROM stdin;
1	Biomax		0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x03,0x07,0x0F,0x1F,0x1F,0x1E,0x3E,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3F,0x3F,0x3F,0x3F,0x3F,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x0F,0x07,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,0xFF,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,0xFC,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xC0,0xE0,0xF0,0xF0,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF0,0x00,0x00,0x00,0x00,0x00,0x00,0xFE,0xFE,0xFE,0xFE,0xFE,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x1E,0x3E,0x7C,0xFC,0xF8,0xF0,0xE0,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x03,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x3F,0x3F,0x3F,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x1C,0x1E,0x1F,0x0F,0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x7F,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFC,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF0,0xFC,0xFE,0x1F,0x0F,0x07,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0xFF,0xFF,0xFF,0xFF,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xC0,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x0F,0x0F,0x0F,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x06,0x00,0x0F,0x0F,0x0F,0x00,0x00,0x01,0x03,0x07,0x0E,0x0E,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x00,0x00,0x01,0x07,0x0F,0x0F,0x0E,0x0C,0x0C,0x0E,0x0F,0x0F,0x0E,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x00,0x00,0x01,0x03,0x07,0x0E,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x00,0x00,0x08,0x08,0x0C,0x0E,0x07,0x03,0x01,0x01,0x01,0x01,0x01,0x07,0x0F,0x0E,0x0C,0x08,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x1D,0x4C,0x33,0x00,0x1B,0x2A,0x00,0xAA,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFC,0xFC,0xFC,0x1C,0x1C,0xDC,0xDC,0xDC,0xDC,0xDC,0xCC,0xFC,0xFC,0xFC,0x38,0x00,0xFC,0xFC,0xFC,0x00,0x00,0xFC,0xFC,0xFC,0x1C,0x1C,0x1C,0x1C,0x1C,0x1C,0x1C,0x1C,0x38,0xF8,0xF0,0xE0,0x0C,0x1C,0xFC,0xF8,0xE0,0x00,0x00,0x00,0x00,0x00,0xFC,0xFC,0x00,0x00,0x00,0x00,0xFC,0xFC,0xFC,0x00,0x00,0xFC,0xFC,0xFC,0x60,0x60,0x60,0x60,0x60,0x60,0x60,0x60,0x60,0xFC,0xFC,0xFC,0x00,0x00,0x0C,0x1C,0x3C,0x78,0xF0,0xE0,0xC0,0xC0,0xC0,0xE0,0xF0,0xF8,0xBC,0x1C,0x0C,0x04,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01
\N	\N	0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x03,0x07,0x0F,0x1F,0x1F,0x1E,0x3E,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3C,0x3F,0x3F,0x3F,0x3F,0x3F,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x1F,0x0F,0x07,0x01,0x00,0x00,0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,0xFF,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,0xFC,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xC0,0xE0,0xF0,0xF0,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF8,0xF0,0x00,0x00,0x00,0x00,0x00,0x00,0xFE,0xFE,0xFE,0xFE,0xFE,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x0E,0x1E,0x3E,0x7C,0xFC,0xF8,0xF0,0xE0,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x03,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x07,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x3F,0x3F,0x3F,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x38,0x1C,0x1E,0x1F,0x0F,0x03,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x7F,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFC,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xF0,0xFC,0xFE,0x1F,0x0F,0x07,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0x03,0xFF,0xFF,0xFF,0xFF,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xE0,0xC0,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x0F,0x0F,0x0F,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x06,0x00,0x0F,0x0F,0x0F,0x00,0x00,0x01,0x03,0x07,0x0E,0x0E,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x00,0x00,0x01,0x07,0x0F,0x0F,0x0E,0x0C,0x0C,0x0E,0x0F,0x0F,0x0E,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x00,0x00,0x01,0x03,0x07,0x0E,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0C,0x0F,0x0F,0x0F,0x00,0x00,0x08,0x08,0x0C,0x0E,0x07,0x03,0x01,0x01,0x01,0x01,0x01,0x07,0x0F,0x0E,0x0C,0x08,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A,0x1B,0x6C,0x0E,0x1B,0x51,0x0E,0x1B,0x4B,0x68,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFC,0xFC,0xFC,0x1C,0x1C,0xDC,0xDC,0xDC,0xDC,0xDC,0xCC,0xFC,0xFC,0xFC,0x38,0x00,0xFC,0xFC,0xFC,0x00,0x00,0xFC,0xFC,0xFC,0x1C,0x1C,0x1C,0x1C,0x1C,0x1C,0x1C,0x1C,0x38,0xF8,0xF0,0xE0,0x0C,0x1C,0xFC,0xF8,0xE0,0x00,0x00,0x00,0x00,0x00,0xFC,0xFC,0x00,0x00,0x00,0x00,0xFC,0xFC,0xFC,0x00,0x00,0xFC,0xFC,0xFC,0x60,0x60,0x60,0x60,0x60,0x60,0x60,0x60,0x60,0xFC,0xFC,0xFC,0x00,0x00,0x0C,0x1C,0x3C,0x78,0xF0,0xE0,0xC0,0xC0,0xC0,0xE0,0xF0,0xF8,0xBC,0x1C,0x0C,0x04,0x00,0x00,0x00,0x00,0x00,0x1B,0x31,0x00,0x0A	\N
\.


--
-- Data for Name: mantenimiento; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY mantenimiento (idposicion, grado, autorizacion) FROM stdin;
\.


--
-- Data for Name: mapeodispensador; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY mapeodispensador (pk_idposicion, numeromangueras, formatodinero, formatovolumen, formatoprecio, ppux10, numerodigitos, isla, tipoimpresora, impresora) FROM stdin;
2	1	0	3	0	0	6	1	2	0
1	1	0	3	0	0	6	1	1	1
\.


--
-- Name: mapeodispensador_pk_idposicion_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('mapeodispensador_pk_idposicion_seq', 1, false);


--
-- Data for Name: mensajes; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY mensajes (mensaje, id_mensaje, lecturacalibracion) FROM stdin;
El  vehiculo  placa  MJV663 , ha sido   autorizado	1	0
El  vehiculo  placa         , ha sido   autorizado	2	0
\.


--
-- Data for Name: moneda; Type: TABLE DATA; Schema: public; Owner: db_admin
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
-- Name: moneda_pk_idmoneda_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('moneda_pk_idmoneda_seq', 8, true);


--
-- Data for Name: precios; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY precios (id_pos, nsx1, nsx2, nsx3, disp1, disp2, disp3) FROM stdin;
1	07389	07720	07240	07389	07720	07240
2	07389	07720	07240	07389	07720	07240
\.


--
-- Data for Name: preset; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY preset (id_pos, tipo_p, valor_p, totalesdin, totalesvol, ppu, grado, kilometraje, serial, autorizado, tipo_venta, mensajep, validacioncredito, lecturacupocredito, calibracion) FROM stdin;
1	1 	00010000	3865378	715.2	007389	1	0	 	0990000	1	\N	0	0	1
2	F 	09999900	186368120	26251.46	007240	3	0	0	0	1	Felicidades, tiene cupo	0	0	1
\.


--
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY producto (pk_idproducto, nombre) FROM stdin;
1	PREMIUM
\.


--
-- Name: producto_pk_idproducto_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('producto_pk_idproducto_seq', 1, true);


--
-- Data for Name: solicitudes; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY solicitudes (solicitabge2, tiposolicitud, confirmacion) FROM stdin;
0	T	1
\.


--
-- Data for Name: tipotransaccion; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY tipotransaccion (pk_idtipotransaccion, nombretransaccion) FROM stdin;
\.


--
-- Name: tipotransaccion_pk_idtipotransaccion_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('tipotransaccion_pk_idtipotransaccion_seq', 1, false);


--
-- Data for Name: totales; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY totales (pk_id_posicion, totalmanguera1, totalmanguera2, totalmanguera3, totalmanguera4, dineromanguera1, dineromanguera2, dineromanguera3, dineromanguera4) FROM stdin;
1	716.210000000000036	0	0	0	3872893	0	0	0
2	319.550000000000011	0	0	0	2411031	0	0	0
\.


--
-- Name: totales_pk_id_posicion_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('totales_pk_id_posicion_seq', 3, true);


--
-- Data for Name: turno; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY turno (usuario, turno, turnonsx, mensajeturno, habilitalecturaturno, passwd) FROM stdin;
123456	1	1	Apertura exitosa	1	1234
\.


--
-- Data for Name: venta; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY venta (pk_idventa, fechainicial, fechafinal, cantidadtotal, valortotal, fk_idtipotransaccion, serialibutton, identificadorweb, volumeninicial, volumenfinal, placaefectivo, nombreefectivo, dineroinicial, dinerofinal, fk_idproducto, valorprogramado, ppu, idposicion, grado, tipovehiculo, tipopreset, kilometrajecliente) FROM stdin;
1	2017-03-23 14:40:44.895126+00	2017-03-23 14:40:44.895126+00	0.495999999999999996	4285	\N	    610000003AE27C06	\N	711.07000000000005	711.559999999999945	          	0	3834242	3838527	\N	990000	8640	1	1	0	F 	0000000000
2	2017-03-24 16:00:18.494557+00	2017-03-24 16:00:18.494557+00	1.63100000000000001	12051	\N	\N	\N	711.559999999999945	713.190000000000055	       123	0	3838527	3850578	\N	50000	7389	1	1	1	3 	0000000000
3	2017-03-24 16:18:50.943489+00	2017-03-24 16:18:50.943489+00	0.97699999999999998	7219	\N	\N	\N	713.190000000000055	714.169999999999959	          	0	3850578	3857797	\N	30000	7389	1	1	1	2 	0000000000
4	2017-03-24 16:20:59.048737+00	2017-03-24 16:20:59.048737+00	0.576999999999999957	4263	\N	\N	\N	714.169999999999959	714.75	        3T	0	3857797	3862060	\N	20000	7389	1	1	1	1 	0000000000
5	2017-03-24 17:29:30.66109+00	2017-03-24 17:29:30.66109+00	0.44900000000000001	3318	\N	\N	\N	714.75	715.200000000000045	          	0	3862060	3865378	\N	999000	7389	1	1	1	F 	0000000000
6	2017-03-24 17:31:02.316323+00	2017-03-24 17:31:02.316323+00	1.0169999999999999	7515	\N	    610000003AE27C06	\N	715.200000000000045	716.210000000000036	          	0	3865378	3872893	\N	10000	7389	1	1	1	1 	0000000123
\.


--
-- Data for Name: venta_canasta; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY venta_canasta (id_canasta, idposicionc, validacioncanasta, lecturacanasta, tipoventacanasta, serial, cantidad, cantidadvendida, nombre, valor, valormux) FROM stdin;
\.


--
-- Name: venta_canasta_id_canasta_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('venta_canasta_id_canasta_seq', 1, false);


--
-- Name: venta_pk_idventa_seq; Type: SEQUENCE SET; Schema: public; Owner: db_admin
--

SELECT pg_catalog.setval('venta_pk_idventa_seq', 6, true);


--
-- Data for Name: verificapago; Type: TABLE DATA; Schema: public; Owner: db_admin
--

COPY verificapago (id_pos, validacion, valorventa, activateclado) FROM stdin;
1	0	10000	1
\.


--
-- Name: botones_id_boton_key; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY botones
    ADD CONSTRAINT botones_id_boton_key UNIQUE (id_boton);


--
-- Name: configuracion_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY configuracion
    ADD CONSTRAINT configuracion_pkey PRIMARY KEY (pk_idconfiguracion);


--
-- Name: configuraciondispensador_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY configuraciondispensador
    ADD CONSTRAINT configuraciondispensador_pkey PRIMARY KEY (pk_idconfiguraciondispen);


--
-- Name: consignaciones_pk_idconsignacion_key; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY consignaciones
    ADD CONSTRAINT consignaciones_pk_idconsignacion_key UNIQUE (pk_idconsignacion);


--
-- Name: copiaderecibo_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY copiaderecibo
    ADD CONSTRAINT copiaderecibo_pkey PRIMARY KEY (pk_idcopiarecibo);


--
-- Name: estado_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY estado
    ADD CONSTRAINT estado_pkey PRIMARY KEY (pk_id_estado);


--
-- Name: finventacanasta_id_canasta_key; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY finventacanasta
    ADD CONSTRAINT finventacanasta_id_canasta_key UNIQUE (id_canasta);


--
-- Name: finventacanastacredito_id_canasta_key; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY finventacanastacredito
    ADD CONSTRAINT finventacanastacredito_id_canasta_key UNIQUE (id_canasta);


--
-- Name: formadepago_pkformapago_key; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY formadepago
    ADD CONSTRAINT formadepago_pkformapago_key UNIQUE (pkformapago);


--
-- Name: historicoformapago_pkidformapago_key; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY historicoformapago
    ADD CONSTRAINT historicoformapago_pkidformapago_key UNIQUE (pkidformapago);


--
-- Name: historicoventacanasta_idventacanasta_key; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY historicoventacanasta
    ADD CONSTRAINT historicoventacanasta_idventacanasta_key UNIQUE (idventacanasta);


--
-- Name: mapeodispensador_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY mapeodispensador
    ADD CONSTRAINT mapeodispensador_pkey PRIMARY KEY (pk_idposicion);


--
-- Name: moneda_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY moneda
    ADD CONSTRAINT moneda_pkey PRIMARY KEY (pk_idmoneda);


--
-- Name: precios_id_pos_key; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY precios
    ADD CONSTRAINT precios_id_pos_key UNIQUE (id_pos);


--
-- Name: preset_id_pos_key; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY preset
    ADD CONSTRAINT preset_id_pos_key UNIQUE (id_pos);


--
-- Name: producto_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (pk_idproducto);


--
-- Name: tipotransaccion_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY tipotransaccion
    ADD CONSTRAINT tipotransaccion_pkey PRIMARY KEY (pk_idtipotransaccion);


--
-- Name: totales_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY totales
    ADD CONSTRAINT totales_pkey PRIMARY KEY (pk_id_posicion);


--
-- Name: venta_canasta_id_canasta_key; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY venta_canasta
    ADD CONSTRAINT venta_canasta_id_canasta_key UNIQUE (id_canasta);


--
-- Name: venta_pkey; Type: CONSTRAINT; Schema: public; Owner: db_admin; Tablespace: 
--

ALTER TABLE ONLY venta
    ADD CONSTRAINT venta_pkey PRIMARY KEY (pk_idventa);


--
-- Name: limpiar_copia_recibo_trigger; Type: TRIGGER; Schema: public; Owner: db_admin
--

CREATE TRIGGER limpiar_copia_recibo_trigger BEFORE INSERT ON copiaderecibo FOR EACH STATEMENT EXECUTE PROCEDURE limpiar_copia_recibo();


--
-- Name: limpiar_ventas_trigger; Type: TRIGGER; Schema: public; Owner: db_admin
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
-- Name: botones; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE botones FROM PUBLIC;
REVOKE ALL ON TABLE botones FROM db_admin;
GRANT ALL ON TABLE botones TO db_admin;
GRANT ALL ON TABLE botones TO postgres;
GRANT ALL ON TABLE botones TO php_admin;


--
-- Name: configuracion; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE configuracion FROM PUBLIC;
REVOKE ALL ON TABLE configuracion FROM db_admin;
GRANT ALL ON TABLE configuracion TO db_admin;
GRANT ALL ON TABLE configuracion TO postgres;
GRANT ALL ON TABLE configuracion TO php_admin;


--
-- Name: configuracion_pk_idconfiguracion_seq; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON SEQUENCE configuracion_pk_idconfiguracion_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE configuracion_pk_idconfiguracion_seq FROM db_admin;
GRANT ALL ON SEQUENCE configuracion_pk_idconfiguracion_seq TO db_admin;
GRANT ALL ON SEQUENCE configuracion_pk_idconfiguracion_seq TO postgres;


--
-- Name: configuraciondispensador; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE configuraciondispensador FROM PUBLIC;
REVOKE ALL ON TABLE configuraciondispensador FROM db_admin;
GRANT ALL ON TABLE configuraciondispensador TO db_admin;
GRANT ALL ON TABLE configuraciondispensador TO postgres;
GRANT ALL ON TABLE configuraciondispensador TO php_admin;


--
-- Name: configuraciondispensador_pk_idconfiguraciondispen_seq; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON SEQUENCE configuraciondispensador_pk_idconfiguraciondispen_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE configuraciondispensador_pk_idconfiguraciondispen_seq FROM db_admin;
GRANT ALL ON SEQUENCE configuraciondispensador_pk_idconfiguraciondispen_seq TO db_admin;
GRANT ALL ON SEQUENCE configuraciondispensador_pk_idconfiguraciondispen_seq TO postgres;


--
-- Name: consignaciones; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE consignaciones FROM PUBLIC;
REVOKE ALL ON TABLE consignaciones FROM db_admin;
GRANT ALL ON TABLE consignaciones TO db_admin;
GRANT ALL ON TABLE consignaciones TO postgres;


--
-- Name: copiaderecibo; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE copiaderecibo FROM PUBLIC;
REVOKE ALL ON TABLE copiaderecibo FROM db_admin;
GRANT ALL ON TABLE copiaderecibo TO db_admin;
GRANT ALL ON TABLE copiaderecibo TO postgres;
GRANT ALL ON TABLE copiaderecibo TO php_admin;


--
-- Name: copiaderecibo_pk_idcopiarecibo_seq; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON SEQUENCE copiaderecibo_pk_idcopiarecibo_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE copiaderecibo_pk_idcopiarecibo_seq FROM db_admin;
GRANT ALL ON SEQUENCE copiaderecibo_pk_idcopiarecibo_seq TO db_admin;
GRANT ALL ON SEQUENCE copiaderecibo_pk_idcopiarecibo_seq TO postgres;


--
-- Name: discriminapago; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE discriminapago FROM PUBLIC;
REVOKE ALL ON TABLE discriminapago FROM db_admin;
GRANT ALL ON TABLE discriminapago TO db_admin;
GRANT ALL ON TABLE discriminapago TO php_admin;


--
-- Name: estado; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE estado FROM PUBLIC;
REVOKE ALL ON TABLE estado FROM db_admin;
GRANT ALL ON TABLE estado TO db_admin;
GRANT ALL ON TABLE estado TO postgres;
GRANT ALL ON TABLE estado TO php_admin;


--
-- Name: estado_pk_id_estado_seq; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON SEQUENCE estado_pk_id_estado_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE estado_pk_id_estado_seq FROM db_admin;
GRANT ALL ON SEQUENCE estado_pk_id_estado_seq TO db_admin;
GRANT ALL ON SEQUENCE estado_pk_id_estado_seq TO postgres;


--
-- Name: finventacanasta; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE finventacanasta FROM PUBLIC;
REVOKE ALL ON TABLE finventacanasta FROM db_admin;
GRANT ALL ON TABLE finventacanasta TO db_admin;
GRANT ALL ON TABLE finventacanasta TO php_admin;


--
-- Name: finventacanastacredito; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE finventacanastacredito FROM PUBLIC;
REVOKE ALL ON TABLE finventacanastacredito FROM db_admin;
GRANT ALL ON TABLE finventacanastacredito TO db_admin;
GRANT ALL ON TABLE finventacanastacredito TO php_admin;


--
-- Name: formadepago; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE formadepago FROM PUBLIC;
REVOKE ALL ON TABLE formadepago FROM db_admin;
GRANT ALL ON TABLE formadepago TO db_admin;
GRANT ALL ON TABLE formadepago TO php_admin;


--
-- Name: historicoformapago; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE historicoformapago FROM PUBLIC;
REVOKE ALL ON TABLE historicoformapago FROM db_admin;
GRANT ALL ON TABLE historicoformapago TO db_admin;
GRANT ALL ON TABLE historicoformapago TO php_admin;


--
-- Name: historicoformapago_pkidformapago_seq; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON SEQUENCE historicoformapago_pkidformapago_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE historicoformapago_pkidformapago_seq FROM db_admin;
GRANT ALL ON SEQUENCE historicoformapago_pkidformapago_seq TO db_admin;
GRANT ALL ON SEQUENCE historicoformapago_pkidformapago_seq TO php_admin;


--
-- Name: historicoventacanasta; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE historicoventacanasta FROM PUBLIC;
REVOKE ALL ON TABLE historicoventacanasta FROM db_admin;
GRANT ALL ON TABLE historicoventacanasta TO db_admin;
GRANT ALL ON TABLE historicoventacanasta TO php_admin;


--
-- Name: logos; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE logos FROM PUBLIC;
REVOKE ALL ON TABLE logos FROM db_admin;
GRANT ALL ON TABLE logos TO db_admin;
GRANT ALL ON TABLE logos TO postgres;
GRANT ALL ON TABLE logos TO php_admin;


--
-- Name: mantenimiento; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE mantenimiento FROM PUBLIC;
REVOKE ALL ON TABLE mantenimiento FROM db_admin;
GRANT ALL ON TABLE mantenimiento TO db_admin;
GRANT ALL ON TABLE mantenimiento TO php_admin;


--
-- Name: mapeodispensador; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE mapeodispensador FROM PUBLIC;
REVOKE ALL ON TABLE mapeodispensador FROM db_admin;
GRANT ALL ON TABLE mapeodispensador TO db_admin;
GRANT ALL ON TABLE mapeodispensador TO postgres;
GRANT ALL ON TABLE mapeodispensador TO php_admin;


--
-- Name: mapeodispensador_pk_idposicion_seq; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON SEQUENCE mapeodispensador_pk_idposicion_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE mapeodispensador_pk_idposicion_seq FROM db_admin;
GRANT ALL ON SEQUENCE mapeodispensador_pk_idposicion_seq TO db_admin;
GRANT ALL ON SEQUENCE mapeodispensador_pk_idposicion_seq TO postgres;


--
-- Name: mensajes; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE mensajes FROM PUBLIC;
REVOKE ALL ON TABLE mensajes FROM db_admin;
GRANT ALL ON TABLE mensajes TO db_admin;
GRANT ALL ON TABLE mensajes TO postgres;
GRANT ALL ON TABLE mensajes TO php_admin;


--
-- Name: moneda; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE moneda FROM PUBLIC;
REVOKE ALL ON TABLE moneda FROM db_admin;
GRANT ALL ON TABLE moneda TO db_admin;
GRANT ALL ON TABLE moneda TO postgres;
GRANT ALL ON TABLE moneda TO php_admin;


--
-- Name: moneda_pk_idmoneda_seq; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON SEQUENCE moneda_pk_idmoneda_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE moneda_pk_idmoneda_seq FROM db_admin;
GRANT ALL ON SEQUENCE moneda_pk_idmoneda_seq TO db_admin;
GRANT ALL ON SEQUENCE moneda_pk_idmoneda_seq TO postgres;


--
-- Name: precios; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE precios FROM PUBLIC;
REVOKE ALL ON TABLE precios FROM db_admin;
GRANT ALL ON TABLE precios TO db_admin;
GRANT ALL ON TABLE precios TO postgres;
GRANT ALL ON TABLE precios TO php_admin;


--
-- Name: preset; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE preset FROM PUBLIC;
REVOKE ALL ON TABLE preset FROM db_admin;
GRANT ALL ON TABLE preset TO db_admin;
GRANT ALL ON TABLE preset TO postgres;
GRANT ALL ON TABLE preset TO php_admin;


--
-- Name: producto; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE producto FROM PUBLIC;
REVOKE ALL ON TABLE producto FROM db_admin;
GRANT ALL ON TABLE producto TO db_admin;
GRANT ALL ON TABLE producto TO postgres;
GRANT ALL ON TABLE producto TO php_admin;


--
-- Name: producto_pk_idproducto_seq; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON SEQUENCE producto_pk_idproducto_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE producto_pk_idproducto_seq FROM db_admin;
GRANT ALL ON SEQUENCE producto_pk_idproducto_seq TO db_admin;
GRANT ALL ON SEQUENCE producto_pk_idproducto_seq TO postgres;


--
-- Name: solicitudes; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE solicitudes FROM PUBLIC;
REVOKE ALL ON TABLE solicitudes FROM db_admin;
GRANT ALL ON TABLE solicitudes TO db_admin;
GRANT ALL ON TABLE solicitudes TO postgres;
GRANT ALL ON TABLE solicitudes TO php_admin;


--
-- Name: tipotransaccion; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE tipotransaccion FROM PUBLIC;
REVOKE ALL ON TABLE tipotransaccion FROM db_admin;
GRANT ALL ON TABLE tipotransaccion TO db_admin;
GRANT ALL ON TABLE tipotransaccion TO postgres;


--
-- Name: tipotransaccion_pk_idtipotransaccion_seq; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON SEQUENCE tipotransaccion_pk_idtipotransaccion_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE tipotransaccion_pk_idtipotransaccion_seq FROM db_admin;
GRANT ALL ON SEQUENCE tipotransaccion_pk_idtipotransaccion_seq TO db_admin;
GRANT ALL ON SEQUENCE tipotransaccion_pk_idtipotransaccion_seq TO postgres;


--
-- Name: totales; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE totales FROM PUBLIC;
REVOKE ALL ON TABLE totales FROM db_admin;
GRANT ALL ON TABLE totales TO db_admin;
GRANT ALL ON TABLE totales TO postgres;
GRANT ALL ON TABLE totales TO php_admin;


--
-- Name: totales_pk_id_posicion_seq; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON SEQUENCE totales_pk_id_posicion_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE totales_pk_id_posicion_seq FROM db_admin;
GRANT ALL ON SEQUENCE totales_pk_id_posicion_seq TO db_admin;
GRANT ALL ON SEQUENCE totales_pk_id_posicion_seq TO postgres;


--
-- Name: turno; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE turno FROM PUBLIC;
REVOKE ALL ON TABLE turno FROM db_admin;
GRANT ALL ON TABLE turno TO db_admin;
GRANT ALL ON TABLE turno TO postgres;
GRANT ALL ON TABLE turno TO php_admin;


--
-- Name: venta; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE venta FROM PUBLIC;
REVOKE ALL ON TABLE venta FROM db_admin;
GRANT ALL ON TABLE venta TO db_admin;
GRANT ALL ON TABLE venta TO postgres;
GRANT ALL ON TABLE venta TO php_admin;


--
-- Name: venta_canasta; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE venta_canasta FROM PUBLIC;
REVOKE ALL ON TABLE venta_canasta FROM db_admin;
GRANT ALL ON TABLE venta_canasta TO db_admin;
GRANT ALL ON TABLE venta_canasta TO php_admin;


--
-- Name: venta_canasta_id_canasta_seq; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON SEQUENCE venta_canasta_id_canasta_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE venta_canasta_id_canasta_seq FROM db_admin;
GRANT ALL ON SEQUENCE venta_canasta_id_canasta_seq TO db_admin;
GRANT ALL ON SEQUENCE venta_canasta_id_canasta_seq TO php_admin;


--
-- Name: venta_pk_idventa_seq; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON SEQUENCE venta_pk_idventa_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE venta_pk_idventa_seq FROM db_admin;
GRANT ALL ON SEQUENCE venta_pk_idventa_seq TO db_admin;
GRANT ALL ON SEQUENCE venta_pk_idventa_seq TO postgres;


--
-- Name: verificapago; Type: ACL; Schema: public; Owner: db_admin
--

REVOKE ALL ON TABLE verificapago FROM PUBLIC;
REVOKE ALL ON TABLE verificapago FROM db_admin;
GRANT ALL ON TABLE verificapago TO db_admin;
GRANT ALL ON TABLE verificapago TO php_admin;


--
-- PostgreSQL database dump complete
--

