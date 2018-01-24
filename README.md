# Controller
Archivos para la comunicación entre Beagle-GNESYS, Beagle-MUX

## Preparación

Los archivos y la documentación del proyecto están organizados en un imagen para ser grabados en un uSD. Sin embargo, se puede
generar una instalación a partir de los archivos, aquí se explicará como

### Prerrequisitos


```
* Beagle Bone Black con imagen pregrabada versión 7.5 a 8.5, Debian
* Conexión a internet
```

### Instalación

Los siguientes comandos se deben ejecutar para la preparación del Beagle Bone

```
sudo apt-get update && apt-get install debian-keyring debian-archive-keyring
sudo apt-get update
npm install xmldeserializer -g
npm install trycatch -g
npm install sprintf -g
npm install request -g
npm install exec -g
npm install pg -g
npm install serialport -g
npm install bonescript -g
```

Editar el archivo uBoot.txt con sudo nano /boot/uboot/uEnv.txt y agregar:

```
cape_enable=capemgr.enable_partno=BB-UART1,BB-UART2,BB-UART4,BB-UART5
```
Continuar con los comandos:

```
sudo apt-get install postgresql
sudo apt-get install postgresql-client
sudo apt-get install libapache2-mod-php5 php5 php5-mcrypt
sudo apt-get install php5-pgsql
sudo /etc/init.d/apache2 restart
sed -i -e 's/\r//g' /etc/init.d/servicio_controler
sudo chmod +x /etc/init.d/servicio_controler
sudo update-rc.d servicio_controler defaults
sudo insserv servicio_controler 
sudo apt-get install sysv-rc-conf
sudo  sysv-rc-conf (verifica que el servicio esté instalado)
/usr/sbin/ntpdate -b -s -u ie.pool.ntp.org(actualizar hora)
```

Luego se deben crear los usuarios y la base de datos del Beagle
```
createuser db_admin -W
createuser php_admin -W
createdb nsx
psql nsx
alter user db_admin with password '12345';
psql -U db_admin -W -h localhost nsx < backup.sql *El archivo debe estar en root*
```

## controller.php

El archivo se encarga de la comunicación con GNESYS

### Inicio

Al principio del programa se hacen definiciones básicas y se abre el socket de comunicación via TCP con el GNESYS, el programa se encarga de contestar las preguntas del sistema
el sistema lee estados enviados y pregunta según el estado. Sin pregunta del GNESYS no hay envío de datos del programa

### Ciclo infinito

El el ciclo infinito el programa está en modo 'conexión', responde las preguntas del sistema. Si el sistema se cierra el programa
cierra el socket y vuelve a escucha.


## Controller.js
Se encarga de la comunicación Beagle-MUX, implementa un protocolo pregunta-respuesta permanente, si no hay una pregunta del Beagle
el MUX se reinicia.
El programa javascript escribe en la base de datos la información enviada por el MUX y envía la información que necesita el MUX para configuración
y operación normal.

### Escritura en la base de datos:
```
client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=1;" ),function(err,result){
    done();
    if(err){
        return console.error('3Error de configuraciondispensador', err);
    }else{
        campo1=result.rows[0].valor; 
    }
});

```
### Función de recepción de datos del MUX:
```
function rx_data_mux(data){...}
```
### Función de separación de datos y selección de caso:
```
function number_process_rxmux(accountant,accountant_2,identifier,error){...}
```
### Función para reintentos:
```
function watchful(error){...}
```
### Función para escritura de datos en DB lado1:
```
muxWriteTablesL1()(error){...}
```
### Función para lectura de datos en DB lado1:
```
var readTables_credit = function(error){...}
```

### Función para envío de datos al MUX:
```
var sendMux =function(numeroEnvio,error){...}
El Beagle escribe en le puero serie del MUX con la función muxport.write, ejemplo:
muxport.write("MUX"+positionOne+"H"+";"+ String(f.getFullYear())+month+day+hours+minutes+seconds+";"+String(numerodigitos)+";"+String(formatodinero)+";"+String(formatovolumen)+";"+String(ppux10)+";"+String(numeromangueras)+";"+String(unidadmoneda)+";"+String(simboloVOL)+";"+"192168110100"+";"+valor1+";"+valor2+";"+valor3+";"+vehicle_screen+";"+paymentsale_screen+";"+"&"+positionTwo+"N" + ";"+ "&" +"*");
```

### Función que informa a la DB que el equipo responde
```
var sendBBB2vivomux =function(error){...}
```

## iniciaphp.js

Script para iniciar el servicio php automáticamente, en caso de reinicio del Beagle o bloqueo.

```
exec('service servicio_controler start', function(err, out, code) {..}
```
## servicio_controler

Archivo que crea el daemon del archivo .php, se debe instalar como un servicio de linux para que inicie automáticamente

