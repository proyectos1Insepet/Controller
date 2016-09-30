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

