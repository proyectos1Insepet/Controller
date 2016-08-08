CREATE TABLE ConfiguracionDispensador(
	pk_idconfiguraciondispen SERIAl UNIQUE PRIMARY KEY,
	nombre VARCHAR (255),
	descripcion VARCHAR (255),
	valor VARCHAR (255),
	activa  boolean
	);
	
CREATE TABLE Configuracion(
	Pk_IdConfiguracion SERIAl PRIMARY KEY,
	nombre VARCHAR (255),
	descripcion VARCHAR (255),
	valor VARCHAR (255)
	);
	
CREATE TABLE producto(
	pk_idproducto SERIAL PRIMARY KEY,
	nombre VARCHAR(255)
);

CREATE TABLE tipotransaccion(
	Pk_idTipoTransaccion SERIAL PRIMARY KEY,
	NombreTransaccion VARCHAR (255)
);

CREATE TABLE moneda(
	Pk_idMoneda SERIAL PRIMARY KEY,
	UnidadMoneda VARCHAR (10),
	descripcion VARCHAR (255)
);


CREATE TABLE mapeodispensador(
	Pk_idPosicion SERIAL PRIMARY KEY,
	NumeroMangueras INT,
	FormatoDinero INT,
	FormatoVolumen INT,
	FormatoPrecio INT,
	PpuX10 INT,
	NumeroDigitos INT,
	Isla INT,
	TipoImpresora INT
);



CREATE TABLE venta(
	Pk_IdVenta SERIAL PRIMARY KEY,
	FechaInicial timestamp with time zone,
	FechaFinal timestamp with time zone,
	CantidadTotal FLOAT,
	ValorTotal FLOAT,
	Fk_IdTipoTransaccion INT,	
	SerialIbutton  VARCHAR (255),
	IdentificadorWeb VARCHAR (255),
	VolumenInicial FLOAT,
	VolumenFinal FLOAT,
	PlacaEfectivo VARCHAR (255),
	NombreEfectivo VARCHAR (255),
	KilometrajeCliente VARCHAR (255),
	DineroInicial FLOAT,
	DineroFinal FLOAT,
	Fk_IdProducto INT,
	ValorProgramado FLOAT
);

CREATE TABLE copiaderecibo(	
	Pk_IdCopiaRecibo SERIAL PRIMARY KEY,
	Fk_IdVenta INT,
	NumeroCopiasRecibo INT

);

CREATE FUNCTION limpiar_ventas() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM venta WHERE Pk_Idventa < (SELECT MAX(Pk_idVenta) - 1000 FROM venta); 
  RETURN NULL;
END;
$$;

CREATE TRIGGER limpiar_ventas_trigger
BEFORE INSERT ON venta
EXECUTE PROCEDURE limpiar_ventas();



CREATE FUNCTION limpiar_copia_recibo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM copiaderecibo WHERE Pk_IdCopiaRecibo < (SELECT MAX(Pk_IdCopiaRecibo) - 5 FROM copiaderecibo); 
  RETURN NULL;
END;
$$;

CREATE TRIGGER limpiar_copia_recibo_trigger
BEFORE INSERT ON copiaderecibo
EXECUTE PROCEDURE limpiar_copia_recibo();


INSERT INTO copiaderecibo (Fk_IdVenta,NumeroCopiasRecibo) VALUES (1,5);


--------Permiso de tabla--------------
GRANT ALL PRIVILEGES ON estado TO db_admin;

----------TABLAS PARA DISPENSADOR-BEAGLE------------------

CREATE TABLE estado(
    Pk_id_estado SERIAL PRIMARY KEY,
    pos1 INT,
    pos2 INT,
	led  INT
);

CREATE TABLE totales(
    Pk_id_posicion SERIAL UNIQUE PRIMARY KEY,
    TotalManguera1  FLOAT,
    TotalManguera2  FLOAT,
    TotalManguera3  FLOAT,
    TotalManguera4  FLOAT,
    DineroManguera1 FLOAT,
    DineroManguera2 FLOAT,
    DineroManguera3 FLOAT,
    DineroManguera4 FLOAT
);

CREATE TABLE venta_canasta(
    id_canasta SERIAL UNIQUE,
    serial  VARCHAR(20),
    cantidad VARCHAR(3),
    cantidadvendida VARCHAR(3),
    nombre VARCHAR (20),
    valor  VARCHAR(8)
);

CREATE TABLE precios(
    id_pos INT UNIQUE,
    nsx1 VARCHAR(5),
    nsx2 VARCHAR(5),
    nsx3 VARCHAR(5),
    disp1 VARCHAR(5),
    disp2 VARCHAR(5),
    disp3 VARCHAR(5)    
);

CREATE TABLE preset(
    id_pos INT UNIQUE,
    grado INT,
    tipo_p  INT,
    valor_p VARCHAR(8),
    totalesdin VARCHAR (12),
    totalesvol VARCHAR (12),
    ppu VARCHAR(6),
    kilometraje VARCHAR(10),    
    serial VARCHAR(20),
    tipo_venta CHAR(1),
    autorizado VARCHAR(7),
	validacioncredito INT,
	lecturacupocredito INT,
    mensajep VARCHAR(60)
);

CREATE TABLE mensajes(
	mensaje VARCHAR(60)
);

CREATE TABLE turno(
    usuario VARCHAR(10),
    contraseña VARCHAR(8),
    turno INT,
    turnonsx INT,
	habilitalecturaturno INT,
    mensajeturno VARCHAR(60)
);

CREATE TABLE consignaciones(
    pk_idconsignacion INT UNIQUE,
    valorconsignacion INT,
    mensajeconsignacion VARCHAR (60),
    confirmacion INT,
    idpos INT
);

CREATE TABLE logos(
    id_logo INT,
    nombrelogo VARCHAR(30),
    trama TEXT, 
    tramakios TEXT
);

CREATE TABLE botones(
    id_boton INT UNIQUE,
    textoboton VARCHAR (8)
);

CREATE TABLE solicitudes(
     solicitabge2 INT,
     tiposolicitud CHAR (1),
     confirmacion INT
);

CREATE TABLE formadepago(
    id_pos INT,
    numeroventa VARCHAR(8),
    tipoformadepago VARCHAR(3),
    ventaconsulta VARCHAR(3)
);

CREATE TABLE verificapago(
    id_pos INT,
    validacion INT,
    valorventa VARCHAR(8),
    activateclado INT 
);

CREATE TABLE discriminapago(
    id_pos INT,
    numeroventa2 VARCHAR (8),
    tipofp CHAR (2),
    ventaconsulta2 INT,
    valordiscriminado VARCHAR (8),
    serialid VARCHAR (20)
);


CREATE FUNCTION limpiar_ventas() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM venta WHERE id_venta < (SELECT MAX(id_venta) - 1000 FROM venta); 
  RETURN NULL;
END;
$$;