<?php
//======================================================================
// 					PHP CONTROLLER, INSEPET 2016
// 						Version  06-10-2017
//======================================================================
error_reporting(~E_NOTICE);
set_time_limit (0); 
$consultacierrasocket=0;
$dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
    or die('Can not connect: ' . \pg_last_error());
$query  = "UPDATE solicitudes SET solicitabge2=0;";
$query  = "UPDATE preset SET serial = ' ';";
$result = pg_query($query); 
$impresora ='/dev/ttyO1';
 `stty -F $impresora 115200`; //velocidad de las impresoras y puertos de comunicación

$impresora2 ='/dev/ttyO2';
 `stty -F $impresora2 115200`;


function verificar_check($datos,  $size){ //Funcion para enviar checksum
    $table=array( 
    0, 94,188,226, 97, 63,221,131,194,156,126, 32,163,253, 31, 65,157,195, 33,127,252,162, 64, 30, 95,  1,227,189, 62, 96,130,220,
    35,125,159,193, 66, 28,254,160,225,191, 93,  3,128,222, 60, 98,190,224,  2, 92,223,129, 99, 61,124, 34,192,158, 29, 67,161,255,
    70, 24,250,164, 39,121,155,197,132,218, 56,102,229,187, 89,  7,219,133,103, 57,186,228,  6, 88, 25, 71,165,251,120, 38,196,154,
    101, 59,217,135,  4, 90,184,230,167,249, 27, 69,198,152,122, 36,248,166, 68, 26,153,199, 37,123, 58,100,134,216, 91,  5,231,185,
    140,210, 48,110,237,179, 81, 15, 78, 16,242,172, 47,113,147,205,17, 79,173,243,112, 46,204,146,211,141,111, 49,178,236, 14, 80,
    175,241, 19, 77,206,144,114, 44,109, 51,209,143, 12, 82,176,238,50,108,142,208, 83, 13,239,177,240,174, 76, 18,145,207, 45,115,
    202,148,118, 40,171,245, 23, 73,  8, 86,180,234,105, 55,213,139,87,9,235,181, 54,104,138,212,149,203, 41,119,244,170, 72, 22,
    233,183, 85, 11,136,214, 52,106, 43,117,151,201, 74, 20,246,168,116, 42,200,150, 21, 75,169,247,182,232, 10, 84,215,137,107, 53);
    $checksum = 0;
    for($i = 0;$i<($size-1); $i++){
        $index = ($checksum^($datos[$i]));
        $checksum = $table[$index];
    }    
    return $checksum;
}


//inicia ciclo infinito del programa
while (true){
$address = "0.0.0.0";
$port = 1002;
$recupera = 0;
$recupera2 = 0;
$soltotales = 0;
 //Creacion del socket
if(!($sock = socket_create(AF_INET, SOCK_STREAM, 0))){
    $errorcode = socket_last_error();
    $errormsg = socket_strerror($errorcode);     
    die("No se puede crear el socket: [$errorcode] $errormsg \n");
}
 
echo "Socket creado \n";
if (!socket_set_option($sock, SOL_SOCKET, SO_REUSEADDR, 1)) {
    echo socket_strerror(socket_last_error($sock));
    exit;
}

// Ata la dirección y puerto
if( !socket_bind($sock, $address , $port) ){
    $errorcode = socket_last_error();
    $errormsg = socket_strerror($errorcode);
    echo"No se puede atar el socket : [$errorcode] $errormsg \n";
}else{
    echo "Socket bind OK \n";     
} 

if(!socket_listen ($sock , 10)){
    $errorcode = socket_last_error();
    $errormsg = socket_strerror($errorcode);     
    "Could not listen on socket : [$errorcode] $errormsg \n";
}else{
    echo "Socket listen OK \n";
    echo "Esperando conexiones entrantes... \n";
} 
socket_set_option($sock, SOL_SOCKET, SO_RCVTIMEO, array("sec"=>30,"usec"=>0)); //Tiempo de desconexion por no entrada de datos
socket_set_option($sock, SOL_SOCKET, SO_SNDTIMEO, array("sec"=>30,"usec"=>0)); //Tiempo de desconexion por no entrada de datos
$dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'") // conexión a base de datos
or die('Can not connect: ' . \pg_last_error());
if ($consultacierrasocket == 0){
    //$sql1    = "TRUNCATE TABLE solicitudes;";
    //$res1    = pg_query($sql1); 
    $query   = "UPDATE solicitudes SET (solicitabge2,tiposolicitud,confirmacion) = (0,'T',1)";  
	$query  .= "UPDATE estado SET nsxonline = 0;";
    $result  = pg_query($query); 
    pg_free_result($result);
    $consultacierrasocket =1;
}

//Accepta conexiones entrantes
$client =  socket_accept($sock);     
//display information about the client who is connected
if(socket_getpeername($client , $address , $port)){
    echo "Cliente $address : $port esta conectado. \n";
    $conexion = true;
    echo "Estado conexion:$conexion\n";
}else{
	$conexion = false;
}   
$estado_espera =0;
$venta_cero = 0;
$venta_cero2 = 0;
$fpago   = 1;
$fpago2  = 1;
$listo   = 0;
$listo2  = 0;
$fallacanasta  = 0;
$fallacanasta2 = 0;
echo "Conexion: $conexion\n";
pg_close($dbconn); // Cerrando la conexion de la base de datos    
    while ($conexion){  //ciclo mientras hay conexion con nsx
        $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
        or die('Can not connect: ' . \pg_last_error());        
        $query   = "SELECT  pos1, pos2,led,fp1,fp2 FROM estado WHERE Pk_id_estado = 1;";
        $result  = pg_query($query) or die('Query error: ' . \pg_last_error()); 
        $row     = pg_fetch_row($result);
        $recibe  = $row[0];
        $recibe2 = $row[1];
        $led     = $row[2];
        $fp1     = $row[3];
        $fp2     = $row[4];
        
        if($ciclo == 20){  //ciclo para comprobar actividad Beagle-MUX
            $ciclo = 0;
            if($led ==0){
                 $estado_pos = "UPDATE estado SET pos1 = 0, pos2 =0;";
                 $res_pos    = pg_query($estado_pos); 
            }else{
                $estado_led = "UPDATE estado SET led = 0, nsxonline = 1, bloqueocorte =2;";
                $res_led    = pg_query($estado_led);
            }
        }       
        //Estados POS 1
        if($fp1 == 1 && $fpago == 1){ //comprobacion formas de pago
            $estado = 22;
            $fpago  = 0;
        }
        if($fp1 == 0){
            if($controlfpago ==0){ //si no hay forma de pago
                $fpago   = 1;
                if($recibe == 0 || $recibe == 31){
                    $estado = 255;  //inactivo
                }
            if($recibe == 22){ //espera
                if($venta_cero ==1){
                    $estado = 4;
                    $pos1 = 0;
                    $estado_espera =0;
                    if($fallacanasta == 1){
                        $query   = "DELETE FROM venta_canasta;";
                        $query  .= "ALTER SEQUENCE venta_canasta_id_canasta_seq RESTART WITH 1;";
                        $query  .= "DELETE FROM finventacanasta;";
                        $query  .= "DELETE FROM finventacanastacredito;";
                        $query  .= "ALTER SEQUENCE finventacanasta_id_canasta_seq RESTART WITH 1;";
                        $query  .= "ALTER SEQUENCE finventacanastacredito_id_canasta_seq RESTART WITH 1;";
                        $result= pg_query($query) ;
                        $fallacanasta = 0;
                        $credito = 0;
                    }
                }                
                if ($venta_cero == 0){
                    $estado = 1;
                    $pos1 = 0;
                    $estado_espera =0;
                    if($fallacanasta == 1){
                        $query   = "DELETE FROM venta_canasta;";
                        $query  .= "ALTER SEQUENCE venta_canasta_id_canasta_seq RESTART WITH 1;";
                        $query  .= "DELETE FROM finventacanasta;";
                        $query  .= "DELETE FROM finventacanastacredito;";
                        $query  .= "ALTER SEQUENCE finventacanasta_id_canasta_seq RESTART WITH 1;";
                        $query  .= "ALTER SEQUENCE finventacanastacredito_id_canasta_seq RESTART WITH 1;";
                        $result= pg_query($query) ;
                        $fallacanasta = 0;
                        $credito = 0;
                    }
                }
            }            
            if($recibe == 23){ //listo
                $estado = 2;
                $listo = 1;
            }
            if($recibe == 25){ //surtiendo
                if(!$listo || $credito ==1){
                    $estado = 3;    
                    $estado_espera = 0;
                    $pos1 =1;                
                    $venta_cero = 0;
                }
                if($listo && $credito == 0){
                    $estado = 2;
                }
            }
            if($recibe == 4){ //fin venta
                $estado = 4;
            }
            if($recibe == 5){ //preset con identificador
                $estado = 5;
            }
            if($recibe == 6){ //peticion turno
                $estado = 6;
            }
            if($recibe == 7){ //Obteniendo datos turno
                $estado = 7;
            }
            if($recibe == 8){ //Datos turno
                $estado = 8;
            }
            if($recibe == 9){ //Solicitud de copia de Recibo
                $estado = 9;
            }
            if($recibe == 10){ //Fin venta cero
                $estado = 4;
				$venta_ceroef = 1;
            }
            if($recibe == 12){//Configuraciones iniciales
                $estado = 12;
            }
            if($recibe == 16){
                $estado = 16; //venta canasta
            }
            if($recibe == 17){
                $estado = 17;  //venta canasta
            }
            if($recibe == 18){//FIN Venta canasta
                $estado = 18;
            }
            if($recibe == 19){//Consignaciones
                $estado = 19;
            }
            if($recibe == 20){//Configuracion inicial (larga)
                $estado = 20;
            }			          
            if($recibe == 2){//Autorizacion Calibracion
                $estado = 23;
            }
            if($recibe == 1){//Listo calibracion
                $estado = 24;
            }
            if($recibe == 30){ //Credito canasta
                $estado = 25;
            }
            if($recibe == 32){//Posicion bloqueada
                $estado = 32;
            }
            if($recibe == 33){//Posicion en error
                $estado = 0;
            }
            if($recibe == 34){//Estado Tapssi
                $estado = 34;
            }
        }
            if ($controlfpago == 1){
                $estado = 26; 
            }
            if($controlfpago == 2){
                $estado = 27;
            }
        }
        //Estados POS 2  
        if($fp2 == 1 && $fpago2 == 1){
            $estado2 = 22;
            $fpago2  = 0;
        }
        if($fp2 == 0){
            if($controlfpago2 ==0){
            $fpago2  = 1;
            if($recibe2 == 0 || $recibe2 == 31){
                $estado2 = 255;
            }
            if($recibe2 == 22){
                if ($venta_cero2 == 1){
                    $estado2 = 4;
                    $pos2 = 0;
                    $estado_espera2 =0;
                    if($fallacanasta2 == 1){
                        $query   = "DELETE FROM venta_canasta;";
                        $query  .= "ALTER SEQUENCE venta_canasta_id_canasta_seq RESTART WITH 1;";
                        $query  .= "DELETE FROM finventacanasta;";
                        $query  .= "DELETE FROM finventacanastacredito;";
                        $query  .= "ALTER SEQUENCE finventacanasta_id_canasta_seq RESTART WITH 1;";
                        $query  .= "ALTER SEQUENCE finventacanastacredito_id_canasta_seq RESTART WITH 1;";
                        $result= pg_query($query) ;
                        $fallacanasta2 = 0;
                        $credito2 = 0;
                    }
                }
                
                if ($venta_cero2 == 0){
                    $estado2 = 1;
                    $pos2 = 0;
                    $estado_espera2 =0;
                    if($fallacanasta2 == 1){
                        $query   = "DELETE FROM venta_canasta;";
                        $query  .= "ALTER SEQUENCE venta_canasta_id_canasta_seq RESTART WITH 1;";
                        $query  .= "DELETE FROM finventacanasta;";
                        $query  .= "DELETE FROM finventacanastacredito;";
                        $query  .= "ALTER SEQUENCE finventacanasta_id_canasta_seq RESTART WITH 1;";
                        $query  .= "ALTER SEQUENCE finventacanastacredito_id_canasta_seq RESTART WITH 1;";
                        $result= pg_query($query) ;
                        $fallacanasta2 = 0;
                        $credito2 = 0;
                    }
                }
                
            }
            if($recibe2 == 23){
                $estado2 = 2;
                $listo2 = 1;
            }
            if($recibe2 == 25){
                if(!$listo2 || $credito2 ==1){
                    $estado2 = 3;    
                    $estado_espera2 = 0;
                    $pos2 =1;                
                    $venta_cero2 = 0;
                }
                if($listo2 && $credito2 == 0){
                    $estado2 = 2;
                }
            }
            if($recibe2 == 4){
                $estado2 = 4;
            }
            if($recibe2 == 5){
                $estado2 = 5;
            }
            if($recibe2 == 6){
                $estado2 = 6;
            }
            if($recibe2 == 7){
                $estado2 = 7;
            }
            if($recibe2 == 8){
                $estado2 = 8;
            }
            if($recibe2 == 9){
                $estado2 = 9;
            }
            if($recibe2 == 10){
                $estado2 = 4;
				 $venta_cero2ef = 1;
            }
            if($recibe2 == 12){
                $estado2 = 12;
            }
            if($recibe2 == 16){
                $estado2 = 16;
            }
            if($recibe2 == 17){
                $estado2 = 17;
            }
            if($recibe2 == 18){
                $estado2 = 18;
            }
            if($recibe2 == 19){
                $estado2 = 19;
            }
            if($recibe2 == 20){
                $estado2 = 20;
            }
            if($recibe2 == 2){
                $estado2 = 23;
            }
            if($recibe2 == 1){
                $estado2 = 24;
            }
            if($recibe2 == 30){
                $estado2 = 25;
            }
            if($recibe2 == 32){
                $estado2 = 32;
            }
            if($recibe2 == 33){
                $estado2 = 0;
            }
            if($recibe2 == 34){ //Estado Tapssi
                $estado2 = 34;
            }
            } 
            if ($controlfpago2 == 1){
                $estado2 = 26; 
            }
            if($controlfpago2 == 2){
                $estado2 = 27;
            }
           
        }
        $input = socket_read($client, 6144);
        if ($input ==''){//respuesta vacia, cierra el socket
            $conexion   = false;
            $soltotales = 1;
            socket_close($client);
            $query   = "UPDATE estado SET nsxonline = 0;";
            $query  .= "UPDATE solicitudes SET solicitabge2 = 0,confirmacion = 1";
            $result  = pg_query($query) ;
        }
        $array = str_split($input); 
        echo "Cadena entrada: $input\n";
        foreach ($array as &$valor) {
            $valor = bin2hex($valor);
        }
        unset($valor);
        $imprime_ar = implode("-",$array);
        echo "Cadena entrada hex: $imprime_ar\n";        
        $CDG = 2;
        pg_free_result($result);
        pg_close($dbconn); // Cerrando la conexion 
        if($array[0]==43 && $array[1]==44 && $array[2]==47){
        switch ($array[4]){
			//Pregunta por los estados de las posiciones del dispensador o surtidor, es una consulta continua para
			//conocer el estado actual de las caras del equipo
            case a1:  
                $ciclo++;
                if($estado_espera ==1 && $pos1 ==1){
                    $ar = array(78, 83, 88, 255,209,$CDG,$estado_ee,$estado2);                     
                    if($estado == 1){
                        $estado_espera = 0;
                    }
                }
                if($estado_espera2 ==2 && $pos2 ==1){
                    $ar = array(78, 83, 88, 255,209,$CDG,$estado,$estado_ee2);                      
                    if($estado2 == 1){
                        $estado_espera2 = 0;
                    }
                }             
                if($estado_espera ==0 && $estado_espera2 ==0){
                    $ar = array(78, 83, 88, 255,209,$CDG,$estado,$estado2);                     
                }
				if($estado_espera !=0 && $estado_espera2 !=0){
                    $ar = array(78, 83, 88, 255,209,$CDG,$estado_ee,$estado_ee2);                     
                }
                $ar[6+$CDG] = verificar_check($ar, (7+$CDG));
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);                                                                        
                $envio = implode("", $ar);
                $print = implode(" - ", $ar);
                echo "Consulta A1: $print\n";
                $length = strlen($envio);                                                
                $consultacierrasocket=0;
                socket_write($client, $envio,$length);
            break;
            
            case a2: //Envía preset, solicita la programación que se hace al equipo
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $query = "SELECT grado, tipo_p, valor_p, totalesdin, totalesvol,ppu FROM preset WHERE id_pos = $array[3];";
                $result = pg_query($query);
                $query2 = "UPDATE preset SET validacioncredito = 0, autorizado ='0', serial = '0' WHERE id_pos = $array[3];";
                $res    = pg_query($query2);
                $row  = pg_fetch_row($result);
                $minuto = date("i");
                $hora   = date("h");
                $dia    = date("d");
                $mes    = date("m");
                $year   = date("y");
                $preset = $row[2];
                if ($row[1] == 'V' || $row[1] == 'V '){
                    $tipo_preset = 1;
                    $preset      = str_replace(",",".",$preset);
                    echo "Volumen";
                }
                if ($row[1] == 'F' ||$row[1] == 'F '){
                    $tipo_preset = 3;
                    echo "Full";
                }
                if($row[1]=='D'|| $row[1]=='D '){
                    $tipo_preset = 2;
                    echo "Dinero";
                }
                if($row[1]=='1 '||$row[1]=='2 '||$row[1]=='3 '||$row[1]=='1'||$row[1]=='2'||$row[1]=='3'){
                    $tipo_preset = 2;
                    echo "Rapido";
                }
                echo "Tipo Preset:$row[1]; Preset: $tipo_preset";
                if($row[0]==1){
                        $totales = "SELECT dineromanguera1,totalmanguera1 FROM totales WHERE pk_id_posicion = $array[3]";
                        echo "Entra 1 preset\n";
                }
                if($row[0]==2){
                    $totales = "SELECT dineromanguera2,totalmanguera2 FROM totales WHERE pk_id_posicion = $array[3]";
                    echo "Entra 2\n";
                }
                if($row[0]==3){
                    $totales = "SELECT dineromanguera3,totalmanguera3 FROM totales WHERE pk_id_posicion = $array[3]";
                    echo "Entra 3\n";
                }
                if($row[0]==4){
                    $totales = "SELECT dineromanguera4,totalmanguera4 FROM totales WHERE pk_id_posicion = $array[3]";
                    echo "Entra 4\n";
                }
				$searchsale  = "SELECT pk_idventa from venta where pk_idventa = (select max(pk_idventa) from venta where idposicion = $array[3]);";
                $lastsale  = pg_query($searchsale);
                $compsale  = pg_fetch_row($lastsale);
                if($array[3]==1){
                    $idsale1   = $compsale[0];     
                }else{
                    $idsale2   = $compsale[0];
                }
                $restot  = pg_query($totales);
                $rowtot  = pg_fetch_row($restot);
                $ppu       = $row[5];
                $totalvol  = number_format((float)$rowtot[1], 2, '', '');
				$totaldin  = $rowtot[0];
                echo "Volumen enviado:$totalvol\n";
                $revvol    = strrev($totalvol);
                $revdinero = strrev($rowtot[0]);
                $revpreset = strrev(sprintf("%0-7s",$preset));
                $revppu    = strrev($ppu);
                
                $strpreset = sprintf($revpreset);
                $strppu    = sprintf("%0-5s",$revppu);
                
                $stringvol = sprintf("%0-12s",$revvol);
                $stringdin     = sprintf("%0-12s",$revdinero);
                
                $arvol     = str_split($stringvol);
                $ardinero  = str_split($stringdin);
                $arpreset  = str_split($strpreset);
                $arppu     = str_split($strppu);
                if ($tipo_preset ==1){
                    $clave = array_search('.', $arpreset); // $clave = 2;
                    if ($clave == ''){
    
                    }else{
                        $arpreset[$clave] = 46;    
                    }
                }
                
                print_r ($arpreset);
                $ar = array(78, 83, 88,$array[3], 210, $row[0], $tipo_preset,  $arpreset[0],$arpreset[1],$arpreset[2],$arpreset[3],$arpreset[4],$arpreset[5],$arpreset[6],  84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3],$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[2],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],   80,$arppu[0],$arppu[1],$arppu[2],$arppu[3],$arppu[4],   72,$minuto,$hora,     70,$dia,$mes,$year );
                $largo = count($ar);                                                
                $ar[$largo] = verificar_check($ar, ($largo +1));
                $dato_a2 = implode("-",$ar);
                echo "Dato Preset efectivo: $dato_a2\n";
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);                 
                socket_write($client, $envio,$length);
                if($array[3] == 1){
                    $listo = 0;
                    $credito = 0;
                }
                if($array[3] == 2){
                    $listo2 = 0;
                    $credito2 = 0;
                }
                pg_free_result($result);
                pg_close($dbconn); // Cerrando la conexion  
            break;
            
            case a3: //Envia fin venta, Gnesys solicita los datos de fin venta si recibe un estado 4
		        $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
		        or die('Can not connect: ' . \pg_last_error());
		        $minuto = date("i");
		        $hora   = date("h");
	 	        $dia    = date("d");
		        $mes    = date("m");
		        $year   = date("y");
		        echo "C: $credito - V: $venta_cero - POS: $array[3]\n";
		        echo "C2: $credito2 - V2: $venta_cero2 - POS: $array[3]\n";
		        if($credito == 1){
		            if($venta_cero == 0 && $array[3] ==1){
    		            $actualiza   = "UPDATE venta SET  serialibutton = '$serialAlm' where pk_idventa  = (select max(pk_idventa) from venta where idposicion = 1)";
    		            $finv        = pg_query($actualiza);     		            
    		            pg_free_result($finv); 
    		            echo "SERIAL\n"; 
		            }
		        }
		        if($credito2 == 1){
		            if($venta_cero2 == 0 && $array[3] ==2){
    		            $actualiza   = "UPDATE venta SET  serialibutton = '$serialAlm2' where pk_idventa = (select max(pk_idventa) from venta where idposicion = 2)";
    		            $finv        = pg_query($actualiza);    		            
    		            pg_free_result($finv);
    		            echo "SERIAL\n";
		            }
		        }
		        $query       = "SELECT grado,valortotal,cantidadtotal,volumenfinal,dinerofinal, ppu,placaefectivo,tipovehiculo,kilometrajecliente,pk_idventa,nombreefectivo from venta where pk_idventa = (select max(pk_idventa) from venta where idposicion = $array[3]);"; 
		        $result      = pg_query($query); 
		        $row         = pg_fetch_row($result);
		        $grado       = $row[0];
		        $dinero      = $row[1];
		        $num2dec     = $row[2];
		        $volumen     = number_format((float)$num2dec, 3, '', '');
		        $volfinal    = $row[3];
		        $dinfinal    = $row[4];
		        $ppu         = $row[5];   
		        $placa       = $row[6];
		        $tipo_veh    = $row[7];
		        $kilometraje = $row[8];
		        $idventa     = $row[9];
		        $clientefec  = $row[10];		
		        $datvol      = number_format((float)$volfinal, 2, '', '');
				if($array[3] == 1){
		            $rescompsale = ($idventa - $idsale1);
		        }
		        if($array[3] == 2){
		            $rescompsale = ($idventa - $idsale2);
		        }
				if($rescompsale == 0 && $array[3] ==1){
					$venta_ceroef = 1;
				}else{
					$venta_ceroef = 0;
				}
				if($rescompsale == 0 && $array[3] ==2){
					$venta_cero2ef = 1;
				}else{
					$venta_cero2ef = 0;
				}
                echo "Res sale: $rescompsale Venta: $idventa \n";
		 
		        $revimp     = strrev($dinero);
		        $revcant    = strrev($volumen);
		        $revdinero  = strrev($dinfinal);
		        $revvol     = strrev($datvol);
		        $revppu     = strrev($ppu);
		        $revplaca   = strrev($placa);
		        //tipo vehiculo
		        $revkm      = strrev($kilometraje);
		        $revnit     = strrev($clientefec);
		        $revidventa = strrev($idventa);

		        $stringimp     = sprintf("%0-7s",$revimp);
		        $stringcant    = sprintf("%0-7s",$revcant);
		        $stringdin     = sprintf("%0-12s",$revdinero);
		        $stringvol     = sprintf("%0-12s",$revvol);
		        $stringppu     = sprintf("%0-5s",$revppu);
		        $strplaca      = sprintf("%0-7s",$revplaca);
		        $strkm         = sprintf("%0-10s",$revkm);
		        $strnit        = sprintf("%-10s",$revnit);
		        $stringidventa = sprintf("%0-9s",$revidventa);
		
		
		        $arimporte   = str_split($stringimp);
		        $arvolumen   = str_split($stringcant);
		        $ardinero    = str_split($stringdin);
		        $arvol       = str_split($stringvol);
		        $arppu       = str_split($stringppu);
		        $arplaca     = str_split($strplaca);
		        $arkm        = str_split($strkm);
		        $arnit       = str_split($strnit);
		        $aridventa   = str_split($stringidventa);
		        foreach ($arplaca as &$valor) {
			        $valor = ord($valor);
		        }
		        unset($valor);
		        foreach ($arnit as &$valor) {
			        $valor = ord($valor);
		        }
		        unset($valor);

                if (($venta_cero == 1 || $venta_ceroef == 1) && $array[3] ==1){ //Venta cero pos1
                    $qgrado = "SELECT grado FROM preset WHERE id_pos = 1";										
                    $rgrado = pg_query($qgrado);
                    $rowgrado = pg_fetch_row($rgrado);
					if($rowgrado[0]==1){
						$totales  = "SELECT dineromanguera1,totalmanguera1 FROM totales WHERE pk_id_posicion = $array[3];";                    
						echo "Entra 1 fin venta\n";
					}
					if($rowgrado[0]==2){
						$totales = "SELECT dineromanguera2,totalmanguera2 FROM totales WHERE pk_id_posicion = $array[3];";                    
						echo "Entra 2\n";
					}
					if($rowgrado[0]==3){
						$totales = "SELECT dineromanguera3,totalmanguera3 FROM totales WHERE pk_id_posicion = $array[3];";                    
						echo "Entra 3\n";
					}
					if($rowgrado[0]==4){
						$totales = "SELECT dineromanguera4,totalmanguera4 FROM totales WHERE pk_id_posicion = $array[3];";                    
						echo "Entra 4\n";
					}
					$restot     = pg_query($totales);
					$rowtot     = pg_fetch_row($restot);
					$revvol    = strrev(number_format((float)$rowtot[1], 2, '', ''));
					$revdinero = strrev($rowtot[0]);					
					
					$stringvol = sprintf("%0-12s",$revvol);
					$stringdin = sprintf("%0-12s",$revdinero);
					
					$arvol     = str_split($stringvol);
					$ardinero  = str_split($stringdin);

                    $ar = array(78, 83, 88, 1,211,$rowgrado[0],68,0,0,0,0,0,0,0,    86,0,0,0,0,0,0,0,    84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3],$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[2],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],    80,$arppu[0],$arppu[1],$arppu[2],$arppu[3],$arppu[4],    72,$minuto,$hora,   70,$dia,$mes,$year,      80,$arplaca[0],$arplaca[1],$arplaca[2],$arplaca[3],$arplaca[4],$arplaca[5],$arplaca[6],  73,$tipo_veh,    75,$arkm[0],$arkm[1],$arkm[2],$arkm[3],$arkm[4],$arkm[5],$arkm[6],$arkm[7],$arkm[8],$arkm[9],   $aridventa[0],$aridventa[1],$aridventa[2],$aridventa[3],$aridventa[4],$aridventa[5],$aridventa[6],$aridventa[7],$aridventa[8],$arnit[0],$arnit[1],$arnit[2],$arnit[3],$arnit[4],$arnit[5],$arnit[6],$arnit[7],$arnit[8],$arnit[9]);  //Borrar $aridventa para quitar consecutivo de venta
                    pg_free_result($rgrado);
                }
                if (($venta_cero2 == 1 || $venta_cero2ef == 1) && $array[3] ==2){ //venta cero pos2
                    $qgrado = "SELECT grado FROM preset WHERE id_pos = 2";
                    $rgrado = pg_query($qgrado);
                    $rowgrado = pg_fetch_row($rgrado);
					if($rowgrado[0]==1){
						$totales  = "SELECT dineromanguera1,totalmanguera1 FROM totales WHERE pk_id_posicion = $array[3];";                    
						echo "Entra 1 fin venta L2\n";
					}
					if($rowgrado[0]==2){
						$totales = "SELECT dineromanguera2,totalmanguera2 FROM totales WHERE pk_id_posicion = $array[3];";                    
						echo "Entra 2\n";
					}
					if($rowgrado[0]==3){
						$totales = "SELECT dineromanguera3,totalmanguera3 FROM totales WHERE pk_id_posicion = $array[3];";                    
						echo "Entra 3\n";
					}
					if($rowgrado[0]==4){
						$totales = "SELECT dineromanguera4,totalmanguera4 FROM totales WHERE pk_id_posicion = $array[3];";                    
						echo "Entra 4\n";
					}
					$restot     = pg_query($totales);
					$rowtot     = pg_fetch_row($restot);
					$revvol    = strrev(number_format((float)$rowtot[1], 2, '', ''));
					$revdinero = strrev($rowtot[0]);					
					
					$stringvol = sprintf("%0-12s",$revvol);
					$stringdin = sprintf("%0-12s",$revdinero);
					
					$arvol     = str_split($stringvol);
					$ardinero  = str_split($stringdin);
                    $ar = array(78, 83, 88, 2,211,$rowgrado[0],68,0,0,0,0,0,0,0,    86,0,0,0,0,0,0,0,    84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3],$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[2],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],    80,$arppu[0],$arppu[1],$arppu[2],$arppu[3],$arppu[4],    72,$minuto,$hora,   70,$dia,$mes,$year,      80,$arplaca[0],$arplaca[1],$arplaca[2],$arplaca[3],$arplaca[4],$arplaca[5],$arplaca[6],  73,$tipo_veh,    75,$arkm[0],$arkm[1],$arkm[2],$arkm[3],$arkm[4],$arkm[5],$arkm[6],$arkm[7],$arkm[8],$arkm[9],   $aridventa[0],$aridventa[1],$aridventa[2],$aridventa[3],$aridventa[4],$aridventa[5],$aridventa[6],$aridventa[7],$aridventa[8],$arnit[0],$arnit[1],$arnit[2],$arnit[3],$arnit[4],$arnit[5],$arnit[6],$arnit[7],$arnit[8],$arnit[9]);  //Borrar $aridventa para quitar consecutivo de venta
                    pg_free_result($rgrado);
                }

                if(($venta_cero == 0 && $venta_ceroef == 0) && $array[3] ==1){ // venta normal
                    $ar = array(78, 83, 88, $array[3],211,$grado,68,$arimporte[0],$arimporte[1],$arimporte[2],$arimporte[3],$arimporte[4],$arimporte[5],$arimporte[6],    86,$arvolumen[0],$arvolumen[1],$arvolumen[2],$arvolumen[3],$arvolumen[4],$arvolumen[5],$arvolumen[6],    84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3],$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[2],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],    80,$arppu[0],$arppu[1],$arppu[2],$arppu[3],$arppu[4],    72,$minuto,$hora,   70,$dia,$mes,$year,      80,$arplaca[0],$arplaca[1],$arplaca[2],$arplaca[3],$arplaca[4],$arplaca[5],$arplaca[6],  73,$tipo_veh,    75,$arkm[0],$arkm[1],$arkm[2],$arkm[3],$arkm[4],$arkm[5],$arkm[6],$arkm[7],$arkm[8],$arkm[9],   $aridventa[0],$aridventa[1],$aridventa[2],$aridventa[3],$aridventa[4],$aridventa[5],$aridventa[6],$aridventa[7],$aridventa[8],$arnit[0],$arnit[1],$arnit[2],$arnit[3],$arnit[4],$arnit[5],$arnit[6],$arnit[7],$arnit[8],$arnit[9]);  //Borrar $aridventa para quitar consecutivo de venta
                }
				if(($venta_cero2 == 0 && $venta_cero2ef == 0) && $array[3] ==2){ // venta normal
                    $ar = array(78, 83, 88, $array[3],211,$grado,68,$arimporte[0],$arimporte[1],$arimporte[2],$arimporte[3],$arimporte[4],$arimporte[5],$arimporte[6],    86,$arvolumen[0],$arvolumen[1],$arvolumen[2],$arvolumen[3],$arvolumen[4],$arvolumen[5],$arvolumen[6],    84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3],$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[2],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],    80,$arppu[0],$arppu[1],$arppu[2],$arppu[3],$arppu[4],    72,$minuto,$hora,   70,$dia,$mes,$year,      80,$arplaca[0],$arplaca[1],$arplaca[2],$arplaca[3],$arplaca[4],$arplaca[5],$arplaca[6],  73,$tipo_veh,    75,$arkm[0],$arkm[1],$arkm[2],$arkm[3],$arkm[4],$arkm[5],$arkm[6],$arkm[7],$arkm[8],$arkm[9],   $aridventa[0],$aridventa[1],$aridventa[2],$aridventa[3],$aridventa[4],$aridventa[5],$aridventa[6],$aridventa[7],$aridventa[8],$arnit[0],$arnit[1],$arnit[2],$arnit[3],$arnit[4],$arnit[5],$arnit[6],$arnit[7],$arnit[8],$arnit[9]);  //Borrar $aridventa para quitar consecutivo de venta
                }
                echo "Venta cero:$venta_cero, $venta_ceroef, $venta_cero2, $venta_cero2ef \n";
               
		        $largo = count($ar);                                                
		        $ar[$largo] = verificar_check($ar, ($largo+1));
		        $dato_a3 = implode("-",$ar);
		        echo "Dato Fin venta: $dato_a3";
		        foreach ($ar as &$valor) {
			        $valor = chr($valor);
		        }
		        unset($valor);                                          
		        $envio = implode("", $ar);
		        $length = strlen($envio);
		        socket_write($client, $envio,$length);	
		        $limpia_credito  = "UPDATE preset SET validacioncredito = 0 WHERE id_pos = $array[3];";
		        $limpia_credito .= "UPDATE preset SET serial = ' ' WHERE id_pos = $array[3];";
		        $reslimpia      = pg_query($limpia_credito);
		        pg_free_result($result);
		        pg_free_result($reslimpia);
		        pg_close($dbconn); // Cerrando la conexión  
		        $venta_cero  = 0;
		        $venta_cero2 = 0;
		        $venta_ceroef  = 0;
		        $venta_cero2ef = 0;
		        if($array[3] == 1){
                    $serialAlm = ' ';    
                }
                if($array[3] == 2){
                    $serialAlm2 = ' ';    
                }
            break;
            
            case a4:   //Casos de reset, Gnesys responde con diversos reset segun el proceso, para negarlo o para confirmarlo
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $error = hexdec($array[5]);

                echo "Caso reset:$error; $array[5]\n";
                switch ($error){
                    case 1: //Gnesys recibio los datos de A2
                        $ar    = array(78, 83, 88,$array[3],212,3);
                        $cupo  = "UPDATE preset SET lecturacupocredito = 1 WHERE id_pos =$array[3]; "; 
                        $rcupo = pg_query($cupo);
                    break;
                    
                    case 2: //Gnesys no recibio los datos de programacion
                        $ar = array(78, 83, 88,$array[3],212,3);
                    break;
                    case 3: //Cancelado por PC, no aprobo la solicitud
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $mensaje  = "UPDATE turno SET mensajeturno = 'Cancelado por PC', turno = 0;"; 
                            $mensaje .= "UPDATE preset SET lecturacupocredito = 1, validacioncredito =0;"; 
                            $result2 = pg_query($mensaje);
                            sleep(2);
                        }else{
                            $mensaje = "UPDATE turno SET mensajeturno = 'Cancelado por PC', turno = 0;"; 
                            $mensaje .= "UPDATE preset SET lecturacupocredito = 1, validacioncredito =0;";
                            $result2 = pg_query($mensaje);
                            sleep(2);
                        }
                        $query  = "UPDATE turno SET habilitalecturaturno = 1;";
                        $result = pg_query($query);
                    break;
                    case 4: //realizo apertura de turno, actualiza mensaje en pantalla
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $mensaje = "UPDATE turno SET mensajeturno = 'Apertura exitosa', turno = 1, turnonsx = 1;"; 
                            $result2 = pg_query($mensaje);
                        }else{
                            $mensaje = "UPDATE turno SET mensajeturno = 'Apertura exitosa', turno = 1, turnonsx = 1;"; 
                            $result2 = pg_query($mensaje);
                        }
                        $query  ="UPDATE turno SET habilitalecturaturno = 1;";
                        $result = pg_query($query);
                    break;
                    case 5: //envio el usuario o la clave incorrecta
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $mensaje = "UPDATE turno SET mensajeturno = 'Usuario o clave incorrecta',turno = 0";  
                            $result2 = pg_query($mensaje);
                        }else{
                            $mensaje = "UPDATE turno SET mensajeturno = 'Usuario o clave incorrecta',turno = 0"; 
                            $result2 = pg_query($mensaje);
                        }
                        $query  ="UPDATE turno SET habilitalecturaturno = 1;";
                        $result  = pg_query($query);
                    break;
                    case 6: //el usuario no es valido para abrir turno
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $mensaje = "UPDATE turno SET mensajeturno = 'Usuario no valido',turno = 0"; 
                            $result2 = pg_query($mensaje);
                        }else{
                            $mensaje = "UPDATE turno SET mensajeturno = 'Usuario no valido',turno = 0"; 
                            $result2 = pg_query($mensaje);
                        }
                        $query  ="UPDATE turno SET habilitalecturaturno = 1;";
                        $result = pg_query($query);
                    break;
                    case 7: //error en el Gnesys
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $mensaje = "UPDATE turno SET mensajeturno = 'Error de operacion'"; 
                        }else{
                            $mensaje = "UPDATE turno SET mensajeturno = 'Error de operacion'"; 
                        }
                        $result2 = pg_query($mensaje);
                    break;
                    case 8: //venta en proceso
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $mensaje = "UPDATE turno SET mensajeturno = 'Venta en proceso'"; 
                        }else{
                            $mensaje = "UPDATE turno SET mensajeturno = 'Venta en proceso'"; 
                        }
                        $result2 = pg_query($mensaje);
                    break;
                    case 9: //están solicitando cambio de turno
                        $ar = array(78, 83, 88,$array[3],212,3);
                        $query  ="UPDATE turno SET habilitalecturaturno = 1;";
                        $result = pg_query($query);
                    break;
                    case 10 ://cierre correcto
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                           $mensaje  = "UPDATE turno SET mensajeturno = 'Cierre OK', turno = 1, turnonsx = 0;";
                           $result2 = pg_query($mensaje);
                        }else{
                           $mensaje  = "UPDATE turno SET mensajeturno = 'Cierre OK', turno = 1, turnonsx = 0;";
                           $result2 = pg_query($mensaje);
                        }
                        $query     ="UPDATE turno SET habilitalecturaturno = 1;";
                        $result    = pg_query($query);
                        $mensaje1  = "DELETE FROM consignaciones;";
                        $mensaje2  = "INSERT INTO consignaciones values (1,0,'0',0,0);";
                        $res1      = pg_query($mensaje1);
                        $res2      = pg_query($mensaje2);
                        
                    break;
                    case 11: //confirmación consignación
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $mensaje  = "UPDATE consignaciones SET  confirmacion = 1;";
                            $result2  = pg_query($mensaje);                            
                        }else{
                            $mensaje = "UPDATE consignaciones SET  confirmacion = 1;"; 
                            $result2 = pg_query($mensaje);                            
                        }
                    break;
                }
                $ar[6] = verificar_check($ar,7);
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
            break;
                
            case a5:   // Se envian totales electronicos del dispensador
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $posicion = hexdec($array[3]);
                $sql = "SELECT numeromangueras FROM mapeodispensador WHERE pk_idposicion = $posicion";
                $result = pg_query($sql)   or die('Query error: ' . \pg_last_error()); 
                $sql1 = "UPDATE solicitudes SET solicitabge2 = 0,confirmacion = 1";
                $res = pg_query($sql1); 
                $row = pg_fetch_row($result);
                $manguera = $row[0]; //numero de mangueras
                echo "Posicion: $posicion\n";
                echo "Mangueras: $manguera\n";
                if($manguera == 1){
                    echo "Manguera 1";
                    $query = "SELECT totalmanguera1, dineromanguera1 from totales where pk_id_posicion  = $array[3]"; 
                    $result  = pg_query($query) or die('Query error: ' . \pg_last_error()); 
                    $row  = pg_fetch_row($result);
                    //Lee totales electronicos en dinero y volumen de la tabla
                    $voltotal1 = $row[0];
                    $dintotal1 = $row[1];
                    //Formato
                    $formatvol1 = sprintf("%01.2f", $voltotal1);
                    //Invierte la trama para transmitir primero el LSB
                    $revdin1 = strrev($dintotal1);
                    $revvol1 = strrev($formatvol1);
                    //Completa la cadena y formatea para envío
                    $stringdin1 = sprintf("%0-12s",$revdin1);
                    $stringvol1 = sprintf("%0-13s",$revvol1);
                    
                    $ardinero1  = str_split($stringdin1);
                    $arvol1     = str_split($stringvol1);
                    $ar = array(78, 83,88,$array[3],213,49,$ardinero1[0],$ardinero1[1],$ardinero1[2],$ardinero1[3],$ardinero1[4],$ardinero1[5],$ardinero1[6],$ardinero1[7],$ardinero1[8],$ardinero1[9],$ardinero1[10],$ardinero1[11],$arvol1[0],$arvol1[1],$arvol1[3],$arvol1[4],$arvol1[5],$arvol1[6],$arvol1[7],$arvol1[8],$arvol1[9],$arvol1[10],$arvol1[11],$arvol1[12]);
                }
                if($manguera == 2){
                    
                    $query = "SELECT totalmanguera1, dineromanguera1,totalmanguera2, dineromanguera2 from totales where pk_id_posicion  = $array[3]"; 
                    $result  = pg_query($query); 
                    $row  = pg_fetch_row($result);
                    //Lee totales electronicos en dinero y volumen de la tabla
                    $voltotal1 = $row[0];
                    $dintotal1 = $row[1];
                    $voltotal2 = $row[2];
                    $dintotal2 = $row[3];
                    echo "Totales: $voltotal1; $dintotal1 ; $voltotal2; $dintotal2\n";
                    //Formato
                    $formatvol1 = sprintf("%01.2f", $voltotal1);
                    $formatvol2 = sprintf("%01.2f", $voltotal2);
					$revdin1 = strrev($dintotal1);
                    $revvol1 = strrev($formatvol1);
					$revdin2 = strrev($dintotal2);
                    $revvol2 = strrev($formatvol2);
                    //Invierte la t rama para tran cadena y formatea para envío
                    $stringdin1 = sprintf("%0-12s",$revdin1);
                    $stringvol1 = sprintf("%0-13s",$revvol1);
                    $stringdin2 = sprintf("%0-12s",$revdin2);
                    $stringvol2 = sprintf("%0-13s",$revvol2);
                    echo "Cadena totales: $stringvol1; $stringvol2\n";
                    $ardinero1  = str_split($stringdin1);
                    $arvol1     = str_split($stringvol1);
                    $ardinero2  = str_split($stringdin2);
                    $arvol2     = str_split($stringvol2);         
                    print_r($arvol1);
                    $ar = array(78, 83,88,$array[3],213,49,$ardinero1[0],$ardinero1[1],$ardinero1[2],$ardinero1[3],$ardinero1[4],$ardinero1[5],$ardinero1[6],$ardinero1[7],$ardinero1[8],$ardinero1[9],$ardinero1[10],$ardinero1[11],$arvol1[0],$arvol1[1],$arvol1[3],$arvol1[4],$arvol1[5],$arvol1[6],$arvol1[7],$arvol1[8],$arvol1[9],$arvol1[10],$arvol1[11],$arvol1[12],  50,$ardinero2[0],$ardinero2[1],$ardinero2[2],$ardinero2[3],$ardinero2[4],$ardinero2[5],$ardinero2[6],$ardinero2[7],$ardinero2[8],$ardinero2[9],$ardinero2[10],$ardinero2[11],$arvol2[0],$arvol2[1],$arvol2[3],$arvol2[4],$arvol2[5],$arvol2[6],$arvol2[7],$arvol2[8],$arvol2[9],$arvol2[10],$arvol2[11],$arvol2[12]);
                    print_r($ar);
                }
                if($manguera == 3){
                    echo "Manguera 3\n";
                    $query = "SELECT totalmanguera1, dineromanguera1,totalmanguera2, dineromanguera2, totalmanguera3, dineromanguera3 from totales where pk_id_posicion  = $array[3]"; 
                    $result  = pg_query($query) or die('Query error: ' . \pg_last_error()); 
                    $row  = pg_fetch_row($result);
                    //Lee totales electronicos en dinero y volumen de la tabla
                    $voltotal1 = $row[0];
                    $dintotal1 = $row[1];
                    $voltotal2 = $row[2];
                    $dintotal2 = $row[3];
                    $voltotal3 = $row[4];
                    $dintotal3 = $row[5];
                    //Formato
                    $formatvol1 = sprintf("%01.2f", $voltotal1);
                    $formatvol2 = sprintf("%01.2f", $voltotal2);
                    $formatvol3 = sprintf("%01.2f", $voltotal3);
                    //Invierte la trama para transmitir primero el LSB
                    $revdin1 = strrev($dintotal1);
                    $revvol1 = strrev($formatvol1);
                    $revdin2 = strrev($dintotal2);
                    $revvol2 = strrev($formatvol2);
                    $revdin3 = strrev($dintotal3);
                    $revvol3 = strrev($formatvol3);
                    //Completa la cadena y formatea para envío
                    $stringdin1 = sprintf("%0-12s",$revdin1);
                    $stringvol1 = sprintf("%0-13s",$revvol1);
                    $stringdin2 = sprintf("%0-12s",$revdin2);
                    $stringvol2 = sprintf("%0-13s",$revvol2);
                    $stringdin3 = sprintf("%0-12s",$revdin3);
                    $stringvol3 = sprintf("%0-13s",$revvol3);
                    
                    $ardinero1  = str_split($stringdin1);
                    $arvol1     = str_split($stringvol1);
                    $ardinero2  = str_split($stringdin2);
                    $arvol2     = str_split($stringvol2);   
                    $ardinero3  = str_split($stringdin3);
                    $arvol3     = str_split($stringvol3);
                    $ar = array(78,83,88,$array[3],213,49,$ardinero1[0],$ardinero1[1],$ardinero1[2],$ardinero1[3],$ardinero1[4],$ardinero1[5],$ardinero1[6],$ardinero1[7],$ardinero1[8],$ardinero1[9],$ardinero1[10],$ardinero1[11],$arvol1[0],$arvol1[1],$arvol1[3],$arvol1[4],$arvol1[5],$arvol1[6],$arvol1[7],$arvol1[8],$arvol1[9],$arvol1[10],$arvol1[11],$arvol1[12],  50,$ardinero2[0],$ardinero2[1],$ardinero2[2],$ardinero2[3],$ardinero2[4],$ardinero2[5],$ardinero2[6],$ardinero2[7],$ardinero2[8],$ardinero2[9],$ardinero2[10],$ardinero2[11],$arvol2[0],$arvol2[1],$arvol2[3],$arvol2[4],$arvol2[5],$arvol2[6],$arvol2[7],$arvol2[8],$arvol2[9],$arvol2[10],$arvol2[11],$arvol2[12],   51,$ardinero3[0],$ardinero3[1],$ardinero3[2],$ardinero3[3],$ardinero3[4],$ardinero3[5],$ardinero3[6],$ardinero3[7],$ardinero3[8],$ardinero3[9],$ardinero3[10],$ardinero3[11],$arvol3[0],$arvol3[1],$arvol3[3],$arvol3[4],$arvol3[5],$arvol3[6],$arvol3[7],$arvol3[8],$arvol3[9],$arvol3[10],$arvol3[11],$arvol3[12]);
                }
                $largo = count($ar);                                                
                $ar[$largo] = verificar_check($ar, ($largo+1));
                foreach ($ar as &$valor){
                    $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $imprime = implode("-",$ar);
                $length = strlen($envio);
                
                echo "Envio totales: $imprime\n";
                print_r($ardinero1);
                print_r($arvol1);
                print_r($ardinero2);
                print_r($arvol2);
                print_r($ardinero3);
                print_r($arvol3);
                pg_free_result($result);
                pg_free_result($res);
                pg_close($dbconn); // Cerrando la conexión    
                print_r(ar);
                socket_write($client, $envio);
            break;
                
            case a6: //preset cliente ibutton, tag o similar
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $query   = "SELECT grado, tipo_p, valor_p, totalesdin, totalesvol,ppu, kilometraje, serial, lecturacupocredito,validacioncredito FROM preset WHERE id_pos = $array[3];"; 
                $result  = pg_query($query);
                $row  = pg_fetch_row($result);
                echo "Tipo Preset:$row[1]";
                if($row[0]==1){
                    $totales  = "SELECT dineromanguera1,totalmanguera1 FROM totales WHERE pk_id_posicion = $array[3];";                    
                    echo "Entra 1 Credito\n";
                }
                if($row[0]==2){
                    $totales = "SELECT dineromanguera2,totalmanguera2 FROM totales WHERE pk_id_posicion = $array[3];";                    
                    echo "Entra 2\n";
                }
                if($row[0]==3){
                    $totales = "SELECT dineromanguera3,totalmanguera3 FROM totales WHERE pk_id_posicion = $array[3];";                    
                    echo "Entra 3\n";
                }
                if($row[0]==4){
                    $totales = "SELECT dineromanguera4,totalmanguera4 FROM totales WHERE pk_id_posicion = $array[3];";                    
                    echo "Entra 4\n";
                }
                $restot     = pg_query($totales);
                $rowtot     = pg_fetch_row($restot);
				$upmensajes = "UPDATE mensajes SET mensaje = ' ' WHERE id_mensaje = $array[3];";
				$resmen     = pg_query($upmensajes);
                $minuto = date("i");
                $hora   = date("h");
                $dia    = date("d");
                $mes    = date("m");
                $year   = date("y");
                $ppu    = $row[5];
                $kilometraje = $row[6];
                echo "Lectura Credito: Serial = $row[7], Validacion $row[9]";
            
                $revvol    = strrev(number_format((float)$rowtot[1], 2, '', ''));
                $revdinero = strrev($rowtot[0]);
                if($array[3] == 1){
                    $serialAlm = $row[7];    
                }
                if($array[3] == 2){
                    $serialAlm2 = $row[7];    
                }
                $idcliente = strrev($row[7]);
                $preset    = "990000";
                $revpreset = strrev($preset);
                $revppu = strrev($ppu);
            
                $stringvol = sprintf("%0-12s",$revvol);
                $stringdin = sprintf("%0-12s",$revdinero);
                $strpreset = sprintf("%0-7s",$revpreset);
                $strppu    = sprintf("%0-5s",$revppu);
                $strid     = sprintf("%-16s",$idcliente);
            
                $arvol     = str_split($stringvol);
                $ardinero  = str_split($stringdin);
                $arpreset  = str_split($strpreset);
                $arppu     = str_split($strppu);
                $arkm      = str_split($kilometraje);
                $serial    = str_split($strid);
                foreach ($serial as &$valor) {
                   $valor = ord($valor);
                }
                unset($valor);
                $ar = array(78, 83, 88,$array[3], 214, $row[0], 2,  $arpreset[0],$arpreset[1],$arpreset[2],$arpreset[3],$arpreset[4],$arpreset[5],$arpreset[6],  84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3],$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[2],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],   80,$arppu[0],$arppu[1],$arppu[2],$arppu[3],$arppu[4],   72,$minuto,$hora,     70,$dia,$mes,$year, 73,$serial[0],$serial[1],$serial[2],$serial[3],$serial[4],$serial[5],$serial[6],$serial[7],$serial[8],$serial[9],$serial[10],$serial[11],$serial[12],$serial[13],$serial[14],$serial[15], 75,$arkm[9],$arkm[8],$arkm[7],$arkm[6],$arkm[5],$arkm[4],$arkm[3],$arkm[2],$arkm[1],$arkm[0]);
                $largo = count($ar);  
                $ar[$largo] = verificar_check($ar, ($largo +1));
                echo "Largo A6: $largo\n";
                $dato_a6 = implode("-",$ar);
                echo "Dato preset credito: $dato_a6\n";
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);                 
                socket_write($client, $envio,$length);                    
            break;
            
            case a7: //envio de cantidad autorizada a cliente
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $autoriza    = array();
                $grado       = $array[5];
                $tipo_preset = $array[6];
                $autoriza[6] = hexdec($array[7]);
                $autoriza[5] = hexdec($array[8]);
                $autoriza[4] = hexdec($array[9]);
                $autoriza[3] = hexdec($array[10]);
                $autoriza[2] = hexdec($array[11]);
                $autoriza[1] = hexdec($array[12]);
                $autoriza[0] = hexdec($array[13]);
                $autorizado  = strrev(implode("",$autoriza));
                echo "Autorizacion: $autorizado\n";
                $mensj         = substr($input,15);
                $mensajePlaca  = substr($mensj,0,-10);
                $finmensj   = "El  vehiculo  placa  $mensajePlaca, ha sido   autorizado";
                $query      = "UPDATE preset SET autorizado ='$autorizado', validacioncredito = 1 WHERE id_pos =$array[3]; ";                
                $qmen		= "UPDATE mensajes SET mensaje = '$finmensj' WHERE id_mensaje = $array[3];";
                $qmen2  	= "UPDATE preset SET serial = ' ' WHERE id_pos = $array[3];";
                $result 	= pg_query($query);
				$result2	= pg_query($query);
                $res        = pg_query($qmen);
				$res2       = pg_query($qmen2);
                if (!$result) {
                    $ACK = 4;  
                }else{
                    $ACK = 3;
                }
                $ar = array(78, 83, 88,$array[3],215,$ACK);
                $ar[6] = verificar_check($ar, 7);
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);     
                socket_write($client, $envio,$length); 
            break;
            
            case a8: //cambio de precios, Gnesys envía los precios de los productos para que el MUX los procese y programe el equipo
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $precio     = array(5);
                $estadolec  = "SELECT lecturacupocredito, validacioncredito FROM preset WHERE id_pos =$array[3]; ";
                $qestadolec = pg_query($estadolec);
                $row        = pg_fetch_row($qestadolec);
                echo "Lectura Credito:$row[0] Validacion :$row[1] ;\n ";
                $precio [0] = hex2bin($array[10]);
                $precio [1] = hex2bin($array[9]);
                $precio [2] = hex2bin($array[8]);
                $precio [3] = hex2bin($array[7]);
                $precio [4] = hex2bin($array[6]);
                $precio_db  = implode("", $precio);
                echo "Precio Recibido: $precio_db\n";
                $cambio_precio  = "TRUNCATE TABLE solicitudes;";
                $cambio_precio .= "INSERT INTO solicitudes VALUES (1,'P',0);";
                $inserta_sol    =  pg_query($cambio_precio); 
                if($array[3] == 1){
                    if ($array[5]== 1){
                        $query = "UPDATE precios SET nsx1 = '$precio_db' WHERE id_pos = 1"; 
                        $result  = pg_query($query);
                        if (!$result) {
                            $ACK = 4;  
                        }else{
                            $ACK = 3;
                        }
                    }
                    if ($array[5]== 2){
                        $query = "UPDATE precios SET nsx2 = '$precio_db' WHERE id_pos = 1"; 
                        $result  = pg_query($query);
                        if (!$result) {
                            $ACK = 4;  
                        }else{
                            $ACK = 3;
                        }
                    }
                    if ($array[5]== 3){
                        $query = "UPDATE precios SET nsx3 = '$precio_db' WHERE id_pos = 1"; 
                        $result  = pg_query($query);
                        if (!$result) {
                            $ACK = 4;  
                        }else{
                            $ACK = 3;
                        }
                    }
                }
                if($array[3] == 2){
                    if ($array[5]== 1){
                        $query = "UPDATE precios SET nsx1 = '$precio_db' WHERE id_pos = 2"; 
                        $result  = pg_query($query);
                        if (!$result) {
                            $ACK = 4;  
                        }else{
                            $ACK = 3;
                        }
                    }
                    if ($array[5]== 2){
                        $query = "UPDATE precios SET nsx2 = '$precio_db' WHERE id_pos = 2"; 
                        $result  = pg_query($query);
                        if (!$result) {
                            $ACK = 4;  
                        }else{
                            $ACK = 3;
                        }
                    }
                    if ($array[5]== 3){
                        $query = "UPDATE precios SET nsx3 = '$precio_db' WHERE id_pos = 2"; 
                        $result  = pg_query($query);
                        if (!$result) {
                            $ACK = 4;  
                        }else{
                            $ACK = 3;
                        }
                    }
                }                                
                $ar = array(78, 83, 88,$array[3],216,$ACK);
                $ar[6] = verificar_check($ar, 7);
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);     
                socket_write($client, $envio,$length); 
                $lectura ="UPDATE preset SET lecturacupocredito = 1 WHERE id_pos = $array[3];";
                pg_query($lectura);
                pg_close($dbconn); // Cerrando la conexión   
                break;
            
            case aa: // envio de datos de turno, usuario y contraseña
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $query   = "SELECT usuario, passwd, turnonsx FROM turno;";
                $result  = pg_query($query);
                $row     = pg_fetch_row($result);
                $usuario = $row[0];
                $pass    = $row[1];
                $turno   = $row[2];
                echo "Usuario: $usuario Clave: $pass Turno: $turno\n";
                $revuss  = strrev($usuario);
                $revpass = strrev($pass);
                $struss  = sprintf("%-10s",$revuss);
                $strpass = sprintf("%-8s",$revpass);
                $aruss   = str_split($struss);
                foreach ($aruss as &$valor) {
                    $valor = bin2hex($valor);
                }
                unset($valor);
                $arpass  = str_split($strpass);
                foreach ($arpass as &$valor) {
                    $valor = bin2hex($valor);
                }
                unset($valor);
                if ($turno == 0){
                    $envio_turno = 1;
                }
                if ($turno == 1){
                    $envio_turno = 0;
                }
                echo "Turno: $turno, Turno2: $envio_turno\n";
                $ar = array(78, 83, 88,$array[3],218,$envio_turno, 67,$aruss[0],$aruss[1],$aruss[2],$aruss[3],$aruss[4],$aruss[5],$aruss[6],$aruss[7],$aruss[8],$aruss[9],  80,$arpass[0],$arpass[1],$arpass[2],$arpass[3],$arpass[4],$arpass[5],$arpass[6],$arpass[7]);
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo +1));
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);     
                socket_write($client, $envio,$length);
            break;
                
            case ab: //Solicita el precio actual del grado
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $query  = "SELECT disp1, disp2, disp3 FROM precios WHERE id_pos = $array[3]";
                $result = pg_query($query);
                $row    = pg_fetch_row($result);
                $precio1 = str_split($row[0]);
                $precio2 = str_split($row[1]);
                $precio3 = str_split($row[2]);                
                if($array[5] == 1){
                    $ar = array(78, 83, 88,$array[3],219,$array[5],$precio1[0],$precio1[1],$precio1[2],$precio1[3],$precio1[4]);
                }
                if($array[5] == 2){
                    $ar = array(78, 83, 88,$array[3],219,$array[5],$precio2[0],$precio2[1],$precio2[2],$precio2[3],$precio2[4]);
                }
                if($array[5] == 3){
                    $ar = array(78, 83, 88,$array[3],219,$array[5],$precio3[0],$precio3[1],$precio3[2],$precio3[3],$precio3[4]);
                }
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo +1));
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                echo "Array AB: $ar\n";
                $length = strlen($envio);
                socket_write($client, $envio,$length);
            break;
            
            case ac: //impresion,Gnesys envía esta consulta seguida de los datos que va a imprimir
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $sql         = "SELECT tipoimpresora, impresora FROM mapeodispensador where pk_idposicion = $array[3]";
                $print       = pg_query($sql);
                $fila        = pg_fetch_row($print);
                if($array[3] == 1){
                        $controlfpago = 0;
                }
                if($array[3] == 2){
                        $controlfpago2 =0;
                }
                echo "Fila: $fila[0]\n";
                if ($fila[0] == 2){
                    $query       = "SELECT tramakios FROM logos WHERE id_logo = 1";
                    echo "Kiosko";
                }
                if ($fila[0] == 1){
                    $query       = "SELECT trama FROM logos WHERE id_logo = 1";
                }
                if ($credito ==1){
                    $creditolec   = "UPDATE preset SET validacioncredito =0, lecturacupocredito =1;"; 
                    $rcred        = pg_query($creditolec);
                    $credito = 0;
                }
                
                $result      = pg_query($query);
                $logo        = pg_fetch_row($result);
                $strlogo     = str_replace(",","",$logo[0]);
                $substrlogo  = chunk_split($strlogo,4," ");
                $arlogo      = explode(" ",$substrlogo);
                foreach ($arlogo as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);
                $f_logo = implode("",$arlogo);
                if($array[3] == 1 && $fila[1] ==1){
                    $f = fopen("$impresora","r+");
                }
                if($array[3] == 2 && $fila[1] ==1){
                    $f = fopen("$impresora2","r+");
                }
                if($array[3] == 1 && $fila[1] ==0){
                    $f = fopen("$impresora2","r+");
                }
                if($array[3] == 2 && $fila[1] ==0){
                    $f = fopen("$impresora","r+");
                }
                if(!$f) {
                    echo "Error al abrir\n";
                    exit;
                }
                $impresion = substr($input,8);
                echo "Recibo: \n";
                echo "$impresion";

                if ($fila[0] == 1){
                    $impresion   = bin2hex($impresion);
                    $impresion   = str_replace("0a","",$impresion);
                    $impresion   = hex2bin($impresion);
                }
                /*fwrite($f,$f_logo);
                fwrite($f,chr(0x0A));
                fwrite($f,chr(0x0A));
                fwrite($f,chr(0x0A));
                fwrite($f,chr(0x0A));     //Descomentar para logo
                fwrite($f,chr(0x1B));
                fwrite($f,chr(0x6C));
                fwrite($f,chr(0x01));
                fwrite($f,chr(0x1B));
                fwrite($f,chr(0x51));
                fwrite($f,chr(0x01));*/

                
                fwrite($f, $impresion);
                $ar = array(78, 83, 88,$array[3],220,3);
                $ar[6] = verificar_check($ar, 7);
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                fclose($f);
            break;
                
            
            case ad://
                $ar = array(78, 83, 88,$array[3],221,3);
                $ar[6] = verificar_check($ar, 7);
                $dato_ad = implode("-",$ar);
                echo "Dato AD: $dato_ad\n";
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
            break;
            
            case ae:// bloqueo turno
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $sql = "UPDATE turno SET turno = 0, mensajeturno= 'Operacion Incorrecta', habilitalecturaturno =0;";
                $resultado = pg_query($sql); 
                if (!$resultado) {
                    $ACK = 4;  
                }else{
                    $ACK = 3;
                }
                echo "ACK: $ACK\n";
                $cambio_turno = hex2bin($array[5]); 
                $ar = array(78, 83, 88,$array[3],222,$ACK);
                $ar[6] = verificar_check($ar, 7);
                $dato_ad = implode("-",$ar);
                echo "Dato AE: $dato_ad\n";
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                $resultado = pg_query($sql);
            break;
            
            case af://
                $ar = array(78, 83, 88,$array[3],223,3);
                $ar[6] = verificar_check($ar, 7);
                $dato_ad = implode("-",$ar);
                echo "Dato AF: $dato_ad\n";
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
            break;
            
            case b0://
                $ar = array(78, 83, 88,$array[3],224,   80,0,0,0,0,0,0,0);
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo +1));
                foreach ($ar as &$valor) {
                       $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
            break;
            
			
            case b1:
				//apertura de turno, Gnesys envía las configuraciones del equipo que se ingresaron el la interfaz gráfica de la
				//aplicacion
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $vturno  = hex2bin($array[5]); 
				$larray  = count($array);
                $turno   = "UPDATE turno SET turnonsx = $vturno; ";
                $prt1        = strpos($input,'C1');
                $prt2        = strpos($input,'C2');
                $prt3        = strpos($input,'C3');
                $length      = strlen($input);
                $preset1     = substr($input,($prt1+2),($prt2-($prt1+2)));
                $preset2     = substr($input,($prt2+2),($prt3-($prt2+2)));
                $preset3     = substr($input,($prt3+2),(($length-2)-($prt3+2)));
                
                
                $presetr  = "UPDATE configuraciondispensador SET valor = $preset1 WHERE pk_idconfiguraciondispen = 25;";
                $presetr .= "UPDATE configuraciondispensador SET valor = $preset2 WHERE pk_idconfiguraciondispen = 26;";
                $presetr .= "UPDATE configuraciondispensador SET valor = $preset3 WHERE pk_idconfiguraciondispen = 27;";
                
                $updatepr = pg_query($presetr);
                
                $numerodigitos  = hex2bin($array[6]);
                $formatodinero  = hex2bin($array[7]);
                $formatovolumen = hex2bin($array[8]);
                $formatoprecio  = hex2bin($array[9]);
                $ppux10         = hex2bin($array[36]);
				$tipoimp        = hex2bin($array[$larray-2]); 
                if ($array[3] == 1){
                    $config  = "UPDATE mapeodispensador SET numerodigitos = $numerodigitos , formatodinero = $formatodinero, formatovolumen = $formatovolumen , formatoprecio = $formatoprecio , ppux10 = $ppux10, tipoimpresora = $tipoimp  WHERE pk_idposicion = $array[3]";
                    $resultado = pg_query($config);
                }
                if ($array[3] ==2){
                    $config  = "UPDATE mapeodispensador SET numerodigitos = $numerodigitos , formatodinero = $formatodinero, formatovolumen = $formatovolumen , formatoprecio = $formatoprecio , ppux10 = $ppux10, tipoimpresora = $tipoimp  WHERE pk_idposicion = $array[3]";
                    $resultado = pg_query($config);
                }
                $rturno  = pg_query($turno);
                $ar = array(78, 83, 88,$array[3],225, 3);
                $ar[6] = verificar_check($ar, 7);
                $dato_ad = implode("-",$ar);
                echo "Dato B1: $dato_ad\n";
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);
                pg_free_result($rturno);    
                pg_free_result($resultado);    
                socket_write($client, $envio,$length);
            break;
            
            case b2:
                $ar = array(78, 83, 88,$array[3],226, 3);
                $ar[6] = verificar_check($ar, 7);
                $dato_ad = implode("-",$ar);
                echo "Dato B2: $dato_ad\n";
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
            break;
            
            case b3:// venta canasta, envia datos para ver en pantalla
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $query         = "SELECT serial from venta_canasta WHERE id_canasta = (SELECT MAX(id_canasta) FROM venta_canasta);"; 
                $result        = pg_query($query); 
                $row           = pg_fetch_row($result);
                $strserial     = sprintf("%-20s",$row[0]);
                echo "Serial canasta: $strserial";
                $arcanasta = str_split($strserial);
                foreach ($arcanasta as &$valor) {
                       $valor = bin2hex($valor);
                }
                unset($valor);  
                $ar =array(78,83,88,$array[3],227,$arcanasta[0],$arcanasta[1],$arcanasta[2],$arcanasta[3],$arcanasta[4],$arcanasta[5],$arcanasta[6],$arcanasta[7],$arcanasta[8],$arcanasta[9],$arcanasta[10],$arcanasta[11],$arcanasta[12],$arcanasta[13],$arcanasta[14],$arcanasta[15],$arcanasta[16],$arcanasta[17],$arcanasta[18],$arcanasta[19]);
                $largo         = count($ar);
                print_r($ar);
                $ar[$largo]    = verificar_check($ar, ($largo +1));
                foreach ($ar as &$valor) {
                       $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                echo "Dato enviado:$envio\n";
                $length = strlen($envio);
                echo"$length\n";
                socket_write($client, $envio,$length);
            break;
            
            case b4:
				//venta canasta, datos en pantalla, Se reciben los datos de los productos, nombre y precio si están en existencia, si no lo hay o no
				//existe se informa en pantalla al usuario
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                if($array[3] ==1){
                    $fallacanasta  = 1;
                }
                if($array[3] ==2){
                    $fallacanasta2 = 1;
                }
                for($x=0; $x<19; $x++){
                    $resultadoar[$x] = hex2bin($array[$x+6]);                        
                }                                      
                for($x=0; $x<8; $x++){
                    $valorar[$x] = hex2bin($array[$x+27]);
                }
                
                for($x=0; $x<3; $x++){
                    $cantidad_ar[$x] = hex2bin($array[$x+36]);
                }
                $resultado = implode("",$resultadoar);
                $cantidad = implode("",$cantidad_ar);
                $resulvalor = implode("",$valorar);
                echo " Canasta: $resultado, $cantidad, $resulvalor\n";
                $query = "UPDATE venta_canasta SET nombre = '$resultado',valor ='$resulvalor',cantidad ='$cantidad',lecturacanasta = 1 WHERE id_canasta= (SELECT MAX(id_canasta) FROM venta_canasta);";
                $result2= pg_query($query);
                if($array[3] == 1){
                    $autorizacanasta = 1;
                }
                if($array[3] == 2){
                    $autorizacanasta2 = 1;
                }
                $ar =array(78,83,88,$array[3],228,3);
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo +1));
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio    = implode("", $ar);
                $length   = strlen($envio);
                socket_write($client, $envio,$length);
                pg_free_result($result2);               
                pg_close($dbconn); // Cerrando la conexión 
            break;
            
            case b5:// envia venta canasta a NSX
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $sql            = "SELECT COUNT(*) FROM finventacanasta WHERE cantidadvendida !='000';";
                $ventacanasta   = "SELECT SUM (CAST(valormux AS INT)) FROM finventacanasta WHERE cantidadvendida !='000';";
                $result   = pg_query($sql);
                $res      = pg_query($ventacanasta);
                $row      = pg_fetch_row($result);
                $suma     = pg_fetch_row($res);
                $guarda   = "INSERT INTO historicoventacanasta (idposicionc,dineroventa)VALUES ($array[3],'$suma[0]');";
                $resventa = pg_query($guarda);                
                echo "Guarda Canasta";
                $ar = array(78,83,88,$array[3],229);
                $ar[] = $row[0];
                for($x=0; $x<$row[0];$x++){
                    $consulta = "SELECT serial,cantidadvendida FROM finventacanasta WHERE id_canasta = ($row[0]-$x)";
                    $res       = pg_query($consulta);  
                    $row2      = pg_fetch_row($res);
                    $strserial = sprintf("%-20s",$row2[0]);
                    $strcanv   = sprintf("%-3s",$row2[1]);
                    $subar1 = str_split($strserial);
                    $subar2 = str_split($strcanv);
                    foreach ($subar1 as &$valor) {
                       $valor = bin2hex($valor);
                    }
                    unset($valor); 
                    foreach ($subar2 as &$valor) {
                      $valor = bin2hex($valor);
                    }
                    unset($valor); 
                    $array  = array_merge_recursive($ar,$subar1,$subar2);
                    $ar     = $array;
                }
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo +1));
                print_r($ar);
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                pg_free_result($result);
                pg_close($dbconn); // Cerrando la conexión 
                
            break;
            
            case b6: //fin venta canasta
                if($array[5]==3){
                    $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                    or die('Can not connect: ' . \pg_last_error());
                    $query   = "DELETE FROM venta_canasta;";
                    $query  .= "ALTER SEQUENCE venta_canasta_id_canasta_seq RESTART WITH 1;";
                    $query  .= "DELETE FROM finventacanasta;";
                    $query  .= "ALTER SEQUENCE finventacanasta_id_canasta_seq RESTART WITH 1;";
                    $result= pg_query($sql) ;
                    $resultado = pg_query($query);
                }
                if (!$result) {
                    $ACK = 4;  
                }else{
                    $ACK = 3;
                }
                $ACK =3;
                $ar = array(78,83,88,$array[3],230,$ACK);
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo +1));
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                pg_free_result($result);
                pg_free_result($resultado);
                pg_close($dbconn); // Cerrando la conexión 
            break;      
            
            case b7:  //envía valor de la consignacion al NSX
                $ar = array(78,83,88,$array[3],231);
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $conf     = "UPDATE consignaciones SET confirmacion = 0, mensajeconsignacion = 'Operacion Incorrecta';";  
                $res      = pg_query($conf);
                $sql      = "SELECT valorconsignacion FROM consignaciones;";
                $result   = pg_query($sql);
                if(!$result){
                    $confirma  = "UPDATE consignaciones SET confirmacion = 0;";
                    $confirma .= "UPDATE consignaciones SET mensajeconsignacion = 'Consignacion no realizada, Intente nuevamente Caso B7';";
                    $up        = pg_query($confirma);
                }
                $row    = pg_fetch_row($result);
                $consignacion = sprintf("%-8s",$row[0]);
                $subar = str_split($consignacion);
                foreach ($subar as &$valor) {
                      $valor = bin2hex($valor);
                }
                unset($valor);
                $array  = array_merge_recursive($ar,$subar);
                $ar = $array;
                //-----Leo
                $confir = "SELECT recibe FROM consignaciones;";
                $borra  = pg_query($confir);
                $rborra = pg_fetch_row($borra);
                if($rborra[0] == 0){                    
                    $ACK =3;
                    $conf     = "UPDATE consignaciones SET recibe = 1;";  
                    $res      = pg_query($conf);
                }else{                    
                    $ACK = 4;
                }
                $ar[] = $ACK;
                $largo = count($ar);
                $ar[] = verificar_check($ar, ($largo +1));
                echo "Envio Consigna:";
                print_r($ar);
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);                
                pg_free_result($borra);
                socket_write($client, $envio,$length);
                pg_close($dbconn); // Cerrando la conexión 
            break;
            
            case b8:  //recuperacion discriminada
                $id    = substr($input,5);
                $idnsx = substr($id,0,-1);
                echo "Entrada: $input\n";
                echo "Venta NSX: $idnsx\n";
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $sql       = "select  MAX(pk_idventa) from venta where idposicion = $array[3]";
                $result    = pg_query($sql) ;
                $max_venta = pg_fetch_row($result);
                $ventas = $max_venta[0]-$idnsx;
                if($ventas > 0){
                    if ($array[3] == 1){
                        $query     = "UPDATE estado SET pos1 = 4";
                        $resultado = pg_query($query);
                        $recupera  = 1;
                    }
                    if ($array[3] ==2){
                        $query     = "UPDATE estado SET pos2 = 4";
                        $resultado = pg_query($query);
                        $recupera2  = 1;
                    }
                }
                if($ventas == 0){
                    if ($array[3] == 1){
                        $query     = "UPDATE estado SET pos1 = 22";
                        $resultado = pg_query($query);
                        $recupera  = 0;
                    }
                    if ($array[3] ==2){
                        $query     = "UPDATE estado SET pos2 = 22";
                        $resultado = pg_query($query);
                        $recupera2  = 0;
                    }
                }
                if ($ventas <0){
                    if ($array[3] == 1){
                        $query2     = "ALTER SEQUENCE venta_pk_idventa_seq RESTART WITH $idnsx;";
                        $query2    .= "INSERT INTO venta (cantidadtotal,valortotal,idposicion) VALUES(0,0,$array[3]);";
                        $resultado2 = pg_query($query2);
                        $recupera  = 0;
                    }
                    if ($array[3] ==2){
                        $query2     = "ALTER SEQUENCE venta_pk_idventa_seq RESTART WITH $idnsx;";
                        $query2    .= "INSERT INTO venta (cantidadtotal,valortotal,idposicion) VALUES(0,0,$array[3]);";
                        $resultado2 = pg_query($query2);
                        $recupera2  = 0;
                    }
                    
                }
                echo "Ventas: $ventas\n";
                $ar    = array(78,83,88,$array[3],232,$ventas);
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo +1));
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                pg_close($dbconn); // Cerrando la conexión 
            break;
            
            case b9:  //configuracion larga, Gnesys envía la información de configuración de las pantallas, los textos de todos los
				//botones
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $consecutivo1 = "select max(pk_idventa) from venta where idposicion = 1";
                $consecutivo2 = "select max(pk_idventa) from venta where idposicion = 2";
                $beaglep     = substr($input,5,9);
                $beagleimp   = substr($input,14,9);
                $nbotones    = substr($input,23,3);
                echo "Cantidad Botones : $nbotones\n";
                $botones     = substr($input,26,($nbotones*8));
                $chunk_boton = chunk_split($botones,8, "~");
                $array_btn   = explode("~",$chunk_boton);
                $length      = strlen($input);
                
                
                /*Encabezados*/
                $pstr1       = strpos($input,'E1');
                $pstr2       = strpos($input,'E2');
                $pstr3       = strpos($input,'E3');
                $pstr4       = strpos($input,'E4');
                $pstr5       = strpos($input,'E5');
                $pstr6       = strpos($input,'E6');
                $pstr7       = strpos($input,'E7');
                $pstr8       = strpos($input,'E8');
                
                /*Footer*/
                $pstr9       = strpos($input,'F1');
                $pstr10      = strpos($input,'F2');
                $pstr11      = strpos($input,'F3');
                
                
                $encabezado1 = substr($input,($pstr1+2),($pstr2-($pstr1+2)));
                $encabezado2 = substr($input,($pstr2+2),($pstr3-($pstr2+2)));
                $encabezado3 = substr($input,($pstr3+2),($pstr4-($pstr3+2)));
                $encabezado4 = substr($input,($pstr4+2),($pstr5-($pstr4+2)));
                $encabezado5 = substr($input,($pstr5+2),($pstr6-($pstr5+2)));
                $encabezado6 = substr($input,($pstr6+2),($pstr7-($pstr6+2)));
                $encabezado7 = substr($input,($pstr7+2),($pstr8-($pstr7+2)));
                $encabezado8 = substr($input,($pstr8+2),($pstr9-($pstr8+2)));
                
                $footer1     = substr($input,($pstr9+2),($pstr10-($pstr9+2)));
                $footer2     = substr($input,($pstr10+2),($pstr11-($pstr10+2)));
                $footer3     = substr($input,($pstr11+2),($length-($pstr11+2)));
                
                echo "Encabezados: $encabezado1,$encabezado2,$encabezado3,$encabezado4,$encabezado5,$encabezado6,$encabezado7,$encabezado8 \n";
                echo "Pie: $footer1,$footer2,$footer3 ";
                
                $data_encabezado  = "UPDATE configuraciondispensador SET (nombre,descripcion,valor,activa) = ('Encabezados','Encabezados','$encabezado1','1') WHERE pk_idconfiguraciondispen=1;";
                $data_encabezado .= "UPDATE configuraciondispensador SET (nombre,descripcion,valor,activa) = ('Encabezados','Encabezados','$encabezado2','1') WHERE pk_idconfiguraciondispen=2;";
                $data_encabezado .= "UPDATE configuraciondispensador SET (nombre,descripcion,valor,activa) = ('Encabezados','Encabezados','$encabezado3','1') WHERE pk_idconfiguraciondispen=3;";
                $data_encabezado .= "UPDATE configuraciondispensador SET (nombre,descripcion,valor,activa) = ('Encabezados','Encabezados','$encabezado4','1') WHERE pk_idconfiguraciondispen=4;";
                $data_encabezado .= "UPDATE configuraciondispensador SET (nombre,descripcion,valor,activa) = ('Encabezados','Encabezados','$encabezado5','1') WHERE pk_idconfiguraciondispen=5;";
                $data_encabezado .= "UPDATE configuraciondispensador SET (nombre,descripcion,valor,activa) = ('Encabezados','Encabezados','$encabezado6','1') WHERE pk_idconfiguraciondispen=6;";
                $data_encabezado .= "UPDATE configuraciondispensador SET (nombre,descripcion,valor,activa) = ('Encabezados','Encabezados','$encabezado7','1') WHERE pk_idconfiguraciondispen=7;";
                $data_encabezado .= "UPDATE configuraciondispensador SET (nombre,descripcion,valor,activa) = ('Encabezados','Encabezados','$encabezado8','1') WHERE pk_idconfiguraciondispen=8;";
                $rqencabezado     = pg_query($data_encabezado);
                
                $data_pie         = "UPDATE configuraciondispensador SET (nombre,descripcion,valor,activa) = ('Pie','Pie','$footer1','1') WHERE pk_idconfiguraciondispen=9;";
                $data_pie        .= "UPDATE configuraciondispensador SET (nombre,descripcion,valor,activa) = ('Pie','Pie','$footer2','1') WHERE pk_idconfiguraciondispen=10;";
                //Estan enviando último dato mal
                //$data_pie        .= "UPDATE configuraciondispensador SET (nombre,descripcion,valor,activa) = ('Pie','Pie','$footer3','1') WHERE pk_idconfiguraciondispen=11;";
                $rqpie            = pg_query($data_pie);
                $i = 1;
                foreach($array_btn as $v){
                    $update = "UPDATE botones SET textoboton = '$v' WHERE id_boton = $i";
                    $result    = pg_query($update);
                    if(!$result){
                        $ACK = 4;
                    }else{
                        $ACK = 3;
                    }
                    $i++;
                }
                unset($v);
                /*Productos*/
                $prod1       = strpos($input,'B1');
                $prod2       = strpos($input,'B2');
                $prod3       = strpos($input,'B3');
				//$prod4       = strpos($input,'B4');
                $finprod     = strpos($input,'A1');
                
                $producto1   = substr($input,($prod1+2),($prod2-($prod1+2)));
                $producto2   = substr($input,($prod2+2),($prod3-($prod2+2)));
                $producto3   = substr($input,($prod3+2),($finprod-($prod3+2)));
				
                
                echo "Productos : $producto1 , $producto2, $producto3, $producto4, fin \n ";
                $productos  ="UPDATE botones SET textoboton = '$producto1' WHERE id_boton = 27;";
                $productos .="UPDATE botones SET textoboton = '$producto2' WHERE id_boton = 28;";
                $productos .="UPDATE botones SET textoboton = '$producto3' WHERE id_boton = 29;";
                
                $rprod      = pg_query($productos);
                
                $ar    = array(78,83,88,$array[3],233,$ACK);
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo +1));
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);  
                if($array[3] ==1){
                    $espera = "UPDATE estado SET pos1 = 22";    
                }else{
                    $espera = "UPDATE estado SET pos2 = 22";    
                }
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                pg_free_result($result);
                pg_close($dbconn); // Cerrando la conexión 
            break;
            
            case ba: //mensajes en pantalla
                echo "Caso Mensaje\n";
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $mensaje   = substr($input,5);
                $mensaje2  = substr($mensaje,0,-1);
                $cupo      = "UPDATE preset SET validacioncredito =0, lecturacupocredito =1;";
                $sql       = "UPDATE mensajes SET mensaje ='$mensaje2', lecturacalibracion=1  WHERE id_mensaje =$array[3];";
                $res       = pg_query($cupo) ;
                $result    = pg_query($sql) ;
                $ar = array(78, 83, 88,$array[3],234,3);
                $ar[6] = verificar_check($ar,7);
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                $estado_espera = 0;
            break;
            case bb: //estado crédito espera
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
				$searchsale  = "SELECT pk_idventa from venta where pk_idventa = (select max(pk_idventa) from venta where idposicion = $array[3]);";
                $lastsale  = pg_query($searchsale);
                $compsale  = pg_fetch_row($lastsale);
                if($array[3]==1){
                    $idsale1   = $compsale[0];     
                }else{
                    $idsale2   = $compsale[0];
                }
                if($array[3] ==1){
                    $estado_ee = 21;
                    $estado_espera = 1;
                    $pos1 = 1;
                    $venta_cero =1;
                    $credito = 1;
                }
                if($array[3] ==2){
                    $estado_ee2 = 21;
                    $estado_espera2 = 2;
                    $pos2 = 1;
                    $venta_cero2 =1;
                    $credito2 = 1;
                } 
                echo "Venta 1 = $venta_cero:: Venta 2 = $venta_cero2\n";
                $sql    = "UPDATE preset SET serial = ' ' WHERE id_pos = $array[3];";
				$result = pg_query($sql) ;
                pg_close($dbconn); // Cerrando la conexión 
            break;
            
            case bc: 
				//forma de pago, se
				//envia una solicitud de forma de pago al sistema, se envía el valor a discriminar de la venta
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                if ($array[3] == 1){
                    $fpago        = 0;
                    $controlfpago = 1;
                    $actfp  = "UPDATE estado SET fp1 = 0;";
                    $resact = pg_query($actfp);
                }
                if ($array[3] == 2){
                    $fpago2        = 0;
                    $controlfpago2 = 1;
                    $actfp  = "UPDATE estado SET fp2 = 0;";
                    $resact = pg_query($actfp);
                }
                $fpago     = "SELECT ventaconsulta,tipoformadepago,valordiscriminado, numeroventa, identificadorfp FROM formadepago WHERE pkformapago = (SELECT MAX(pkformapago) FROM formadepago WHERE id_pos =$array[3]);";
                $rfpago    = pg_query($fpago);
                $datos     = pg_fetch_row($rfpago); 
                $identificadorfp = $datos[4];
                $stringid  = sprintf("%-20s",$identificadorfp);
                $disfp     = $datos[2]*100;

                echo "Discriminado ajustado:$disfp";
                $stringaj  = sprintf("%8s",$disfp);
                
                $arvdiscr  = str_split($stringaj);
                $aridforma = str_split($stringid);
                foreach ($arvdiscr as &$valor) {
                      $valor = bin2hex($valor);
                }
                unset($valor);
                foreach ($aridforma as &$valor) {
                      $valor = ord($valor);
                }
                unset($valor);
                print_r($aridforma);
                $ar = array(78, 83, 88,$array[3],236,$datos[0],$arvdiscr[0],$arvdiscr[1],$arvdiscr[2],$arvdiscr[3],$arvdiscr[4],$arvdiscr[5],$arvdiscr[6],$arvdiscr[7],$datos[1],$aridforma[0],$aridforma[1],$aridforma[2],$aridforma[3],$aridforma[4],$aridforma[5],$aridforma[6],$aridforma[7],$aridforma[8],$aridforma[9],$aridforma[10],$aridforma[11],$aridforma[12],$aridforma[13],$aridforma[14],$aridforma[15],$aridforma[16],$aridforma[17],$aridforma[18],$aridforma[19]);
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo+1));
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);  
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                pg_close($dbconn); // Cerrando la conexión 
                $resetFP = 0;
            break;
            
            case bd: //calibracion
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $mantenimiento   = "UPDATE mensajes SET mensaje = ' ' WHERE id_mensaje = $array[3];";
                $mantenimiento  .= "SELECT grado FROM preset WHERE id_pos = $array[3];";
                $res           = pg_query($mantenimiento);
                $respuesta     = pg_fetch_row($res);
                $ar = array(78, 83, 88,$array[3],237,$respuesta[0]);
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo+1));
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);  
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                pg_close($dbconn); // Cerrando la conexión 
            break;
            
            case be: //autoriza calibracion   
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $mantenimiento = "UPDATE preset SET calibracion = $array[5] WHERE id_pos = $array[3];";
                $res           = pg_query($mantenimiento);
                if (!$res) {
                    $ACK = 4;  
                }else{
                    $ACK = 3;
                }
                $ar    = array(78, 83, 88,$array[3],238,$ACK);
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo+1));
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);  
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                pg_close($dbconn); // Cerrando la conexión 
            break; 
            
            case bf: //preset calibracion, envía al sistema el preset de la calibración a realizar
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $query = "SELECT grado, tipo_p, valor_p, totalesdin, totalesvol,ppu FROM preset WHERE id_pos = $array[3];";
                $result = pg_query($query);
                $query2 = "UPDATE preset SET validacioncredito = 0, autorizado ='0', serial = '0' WHERE id_pos = $array[3];";
                $res    = pg_query($query2);
                $row  = pg_fetch_row($result);
                $minuto = date("i");
                $hora   = date("h");
                $dia    = date("d");
                $mes    = date("m");
                $year   = date("y");
                $preset = $row[2];
                if ($row[1] == 'V' || $row[1] == 'V '){
                    $tipo_preset = 1;
                    $preset      = str_replace(",",".",$preset);
                    echo "Volumen";
                }
                if ($row[1] == 'F' ||$row[1] == 'F '){
                    $tipo_preset = 3;
                    echo "Full";
                }
                if($row[1] =='D'|| $row[1] =='D '){
                    $tipo_preset = 2;
                    echo "Dinero";
                }
                if($row[1]=='1 '||$row[1]=='2 '||$row[1]=='3 '||$row[1]=='1'||$row[1]=='2'||$row[1]=='3'){
                    $tipo_preset = 2;
                    echo "Rapido";
                }
                if($row[0]==1){
                        $totales = "SELECT dineromanguera1,totalmanguera1 FROM totales WHERE pk_id_posicion = $array[3]";
                        echo "Entra 1 calibracion\n";
                }
                if($row[0]==2){
                    $totales = "SELECT dineromanguera2,totalmanguera2 FROM totales WHERE pk_id_posicion = $array[3]";
                    echo "Entra 2\n";
                }
                if($row[0]==3){
                    $totales = "SELECT dineromanguera3,totalmanguera3 FROM totales WHERE pk_id_posicion = $array[3]";
                    echo "Entra 3\n";
                }
                if($row[0]==4){
                    $totales = "SELECT dineromanguera4,totalmanguera4 FROM totales WHERE pk_id_posicion = $array[3]";
                    echo "Entra 4\n";
                }
                $restot  = pg_query($totales);
                $rowtot  = pg_fetch_row($restot);
                echo "Tipo Preset:$row[1]; Preset: $tipo_preset";
                $ppu       = $row[5];
                $totalvol  = number_format((float)$rowtot[1], 2, '', '');
                echo "Volumen enviado:$totalvol\n";
                $revvol    = strrev($totalvol);
                $revdinero = strrev($rowtot[0]);
                $revpreset = strrev(sprintf("%0-7s",$preset));
                $revppu    = strrev($ppu);
                
                $strpreset = sprintf($revpreset);
                $strppu    = sprintf("%0-5s",$revppu);
                echo "PPU : $strppu\n";
                $stringvol = sprintf("%0-12s",$revvol);
                $stringdin     = sprintf("%0-12s",$revdinero);
                
                $arvol     = str_split($stringvol);
                $ardinero  = str_split($stringdin);
                $arpreset  = str_split($strpreset);
                $arppu     = str_split($strppu);
                if ($tipo_preset ==1){
                    $clave = array_search('.', $arpreset); // $clave = 2;
                    if ($clave == ''){
    
                    }else{
                        $arpreset[$clave] = 46;    
                    }
                }
                print_r ($arpreset);
                $ar = array(78, 83, 88,$array[3], 239, $row[0], $tipo_preset,  $arpreset[0],$arpreset[1],$arpreset[2],$arpreset[3],$arpreset[4],$arpreset[5],$arpreset[6],  84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3],$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[2],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],   80,$arppu[0],$arppu[1],$arppu[2],$arppu[3],$arppu[4],   72,$minuto,$hora,     70,$dia,$mes,$year );
                $largo       = count($ar);                                                
                $ar[$largo]  = verificar_check($ar, ($largo +1));
                $calibracion = implode("-",$ar);
                echo "Dato Preset calibracion: $calibracion\n";
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);                 
                socket_write($client, $envio,$length);
                pg_free_result($result);
                pg_close($dbconn); // Cerrando la conexión  
            break;
            
            case c1: //fin venta canasta crédito
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $sql            = "SELECT COUNT(*) FROM finventacanastacredito WHERE cantidadvendida !='000';";
                $ventacanasta   = "SELECT SUM (CAST(valormux AS INT)) FROM finventacanastacredito WHERE cantidadvendida !='000';";
                $serialcanasta  = "SELECT serialid FROM finventacanastacredito WHERE id_canasta = 1;";
                $result = pg_query($sql);
                $res    = pg_query($ventacanasta);
                $res2   = pg_query($serialcanasta);
                $row    = pg_fetch_row($result);
                $suma   = pg_fetch_row($res);
                $fid    = pg_fetch_row($res2);
                $ar = array(78,83,88,$array[3],241);
                $ar[] = $row[0];
                $idcliente = $fid[0];
                $strserial = substr($idcliente,-16);
                $serial    = str_split($strserial);
                print_r($serial);
                foreach ($serial as &$valor) {
                   $valor = ord($valor);
                }
                unset($valor);
                $array  = array_merge_recursive($ar,$serial);
                $ar     = $array;
                print_r($ar);
                for($x=0; $x<$row[0];$x++){
                    $consulta = "SELECT serial,cantidadvendida FROM finventacanastacredito WHERE id_canasta = ($row[0]-$x)";
                    $res       = pg_query($consulta);  
                    $row2      = pg_fetch_row($res);
                    $strserial = sprintf("%-20s",$row2[0]);
                    $strcanv   = sprintf("%-3s",$row2[1]);
                    $subar1 = str_split($strserial);
                    $subar2 = str_split($strcanv);
                    foreach ($subar1 as &$valor) {
                       $valor = bin2hex($valor);
                    }
                    unset($valor); 
                    foreach ($subar2 as &$valor) {
                      $valor = bin2hex($valor);
                    }
                    unset($valor); 
                    $array  = array_merge_recursive($ar,$subar1,$subar2);
                    $ar     = $array;
                }
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo +1));
                print_r($ar);
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                pg_free_result($result);
                pg_close($dbconn); // Cerrando la conexión 
            break;
            
            case c2: //borra temporales canasta
                if($array[5]==3){
                    $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                    or die('Can not connect: ' . \pg_last_error());
                    $query   = "DELETE FROM venta_canasta;";
                    $query  .= "ALTER SEQUENCE venta_canasta_id_canasta_seq RESTART WITH 1;";
                    $query  .= "DELETE FROM finventacanastacredito;";
                    $query  .= "ALTER SEQUENCE finventacanastacredito_id_canasta_seq RESTART WITH 1;";
                    $result= pg_query($sql) ;
                    $resultado = pg_query($query);
                }
                if (!$result) {
                    $ACK = 4;  
                }else{
                    $ACK = 3;
                }
                $ACK =3;
                $ar = array(78,83,88,$array[3],242,$ACK);
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo +1));
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                pg_free_result($result);
                pg_free_result($resultado);
                pg_close($dbconn); // Cerrando la conexión 
            break;      
            
            case c3: //forma de pago
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $resetFP = $resetFP+1;
                if($array[5]==3 && $controlfpago !=2 && $array[3] == 1){
                    $fpago     = "SELECT ventaconsulta,tipoformadepago,valordiscriminado, numeroventa, identificadorfp FROM formadepago WHERE pkformapago = (SELECT MAX(pkformapago) FROM formadepago WHERE id_pos =$array[3]);";
                    $rfpago    = pg_query($fpago);
                    $datos     = pg_fetch_row($rfpago); 
                    $identificadorfp = $datos[4];
                    $stringid  = sprintf("%-20s",$identificadorfp);
                    $hispago   = "INSERT INTO historicoformapago (ventaconsulta,tipoformadepago,valordiscriminado,id_pos,numeroventa,identificadorfp) VALUES ($datos[0],$datos[1],'$datos[2]',$array[3],$datos[3],'$stringid');";
                    $rhispago  = pg_query($hispago);
                    $controlfpago = 2;
                    $actfp  = "UPDATE estado SET  fp1 = 0;";
                    $resact = pg_query($actfp);
                }
                if($array[5]==3 && $controlfpago2 !=2 && $array[3] == 2){
                    $fpago     = "SELECT ventaconsulta,tipoformadepago,valordiscriminado, numeroventa, identificadorfp FROM formadepago WHERE pkformapago = (SELECT MAX(pkformapago) FROM formadepago WHERE id_pos =$array[3]);";
                    $rfpago    = pg_query($fpago);
                    $datos     = pg_fetch_row($rfpago); 
                    $identificadorfp = $datos[4];
                    $stringid  = sprintf("%-20s",$identificadorfp);
                    $hispago   = "INSERT INTO historicoformapago (ventaconsulta,tipoformadepago,valordiscriminado,id_pos,numeroventa,identificadorfp) VALUES ($datos[0],$datos[1],'$datos[2]',$array[3],$datos[3],'$stringid');";
                    $rhispago  = pg_query($hispago);
                    $controlfpago2 = 2;
                    $actfp  = "UPDATE estado SET  fp2 = 0;";
                    $resact = pg_query($actfp);
                }
                if($array[5]==4){
                    $fpago     = "DELETE FROM formadepago WHERE pkformapago = (SELECT MAX(pkformapago) FROM formadepago WHERE id_pos =$array[3]);";
                    $rfpago    = pg_query($fpago);
                    if($array[3] == 1){
                        $controlfpago = 0;
                        $actfp  = "UPDATE estado SET  fp1 = 0;";
                        $resact = pg_query($actfp);
                    }
                    if($array[3] == 2){
                        $controlfpago2 = 0;
                        $actfp  = "UPDATE estado SET  fp2 = 0;";
                        $resact = pg_query($actfp);
                    }
                }
                if($resetFP == 40){
                    if($array[3] == 1){
                        $controlfpago = 0;
                        $actfp  = "UPDATE estado SET   fp1 = 0;";
                        $resact = pg_query($actfp);
                        $resetFP = 0;
                    }
                    if($array[3] == 2){
                        $controlfpago2 = 0;
                        $actfp  = "UPDATE estado SET   fp2 = 0;";
                        $resact = pg_query($actfp);
                        $resetFP = 0;
                    }
                    
                }
                echo "Reset1: $resetFP\n";
                $ACK = 3;
                $ar = array(78,83,88,$array[3],243,$ACK);
                $largo = count($ar);   
                $ar[$largo] = verificar_check($ar, ($largo +1));
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                pg_close($dbconn); // Cerrando la conexion
                break;
                                   
            case c5: //bloqueo corte
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $query     = "UPDATE estado SET bloqueocorte =1;";
                $resultado = pg_query($query);
                $ACK =3;
                $ar        = array(78,83,88,$array[3],245,$ACK);
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                pg_close($dbconn); // Cerrando la conexión 
            break;
            
            case c6: //desbloqueo corte
                $dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $query     = "UPDATE estado SET bloqueocorte =0;";
                $resultado = pg_query($query);
                $ACK =3;
                $ar        = array(78,83,88,$array[3],246,$ACK);
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
                pg_close($dbconn); // Cerrando la conexión 
            break;
        }        
    }    
    }
	$dbconn = pg_connect("host=localhost dbname=nsx user=php_admin password='12345'")
	or die('Can not connect: ' . \pg_last_error());	
	if($soltotales ==1){
	    $solicitud   = "UPDATE solicitudes SET solicitabge2 = 0, confirmacion = 1;";
	    $rsolicitud  = pg_query($solicitud);
	    pg_close($dbconn); // Cerrando la conexión 
	}
}
