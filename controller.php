<?php
error_reporting(~E_NOTICE);
set_time_limit (0); 
$address = "0.0.0.0";
$port = 1002;
 //Creación del socket
if(!($sock = socket_create(AF_INET, SOCK_STREAM, 0)))
{
    $errorcode = socket_last_error();
    $errormsg = socket_strerror($errorcode);     
    die("No se puede crear el socket: [$errorcode] $errormsg \n");
}
 
echo "Socket creado \n";
 
// Bind the source address
if( !socket_bind($sock, $address , $port) )
{
    $errorcode = socket_last_error();
    $errormsg = socket_strerror($errorcode);
     
    die("No se puede atar el socket : [$errorcode] $errormsg \n");
}
 
echo "Socket bind OK \n";
 
if(!socket_listen ($sock , 10))
{
    $errorcode = socket_last_error();
    $errormsg = socket_strerror($errorcode);
     
    die("Could not listen on socket : [$errorcode] $errormsg \n");
}
 
echo "Socket listen OK \n";
echo "Esperando conexiones entrantes... \n";


function verificar_check($datos,  $size){
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




//start loop to listen for incoming connections
while (true){
    //Accept incoming connection - This is a blocking call
    $client =  socket_accept($sock);     
    //display information about the client who is connected
    if(socket_getpeername($client , $address , $port))
    {
        echo "Client $address : $port is now connected to us. \n";
        $conexion = true;
        echo "$conexion\n";
    }     
    //read data from the incoming socket
     
    while ($conexion){
        $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
        or die('Can not connect: ' . \pg_last_error());
        $query = "SELECT  pos1, pos2 FROM estado WHERE Pk_id_estado = 1";
        $result = pg_query($query) or die('Query error: ' . \pg_last_error()); 
        $row = pg_fetch_row($result);
        $recibe = $row[0];
        $recibe2 = $row[1];
        if($recibe == 16){
            $estado = 255;
        }
        if($recibe == 22){
            $estado = 1;
        }
        if($recibe == 23){
            $estado = 2;
        }
        if($recibe == 25){
            $estado = 3;
        }
        if($recibe == 4){
            $estado = 4;
        }
        if($recibe2 == 22){
            $estado2 = 1;
        }else{
            $estado2 = 2;    
        }
        echo "Estado inicial: $estado\n" ; 
        $input = socket_read($client, 1024); 
        $array = str_split($input); 
        echo "Cadena entrada: $input\n";
        foreach ($array as &$valor) {
            $valor = bin2hex($valor);
        }
        unset($valor);
        $imprime_ar = implode("-",$array);
        echo "Cadena entrada hex: $imprime_ar\n";
        $longitud = strlen($input);
        $CDG = 2;
        if($array[0]==43 && $array[1]==44 && $array[2]==47){
        
        switch ($array[4]){
            case a1:  //Inicia la consulta del NSX
                $ar = array(78, 83, 88, 255,209, $CDG,$estado,$estado2);
                 foreach (range(1, $CDG) as $i){
                    array_push($ar, 1);
                }
                $ar[6+$CDG] = verificar_check($ar, (7+$CDG));
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
            case a2:
                $minuto = 9; //date("i");
                $hora   = 52;//date("h");
                $dia    = 37;//date("d");
                $mes    = 5;//date("m");
                $year   = 22;//date("y");
                $ar = array(78, 83, 88,$array[3], 210, 1, 3,  0,0,0,7,0,0,0,  84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3],$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],$arvol[12],   80,0,0,0,7,0,   72,$minuto,$hora,     70,$dia,$mes,$year );
                $largo = count($ar);                                                
                $ar[$largo] = verificar_check($ar, ($largo +1));
                $dato_a2 = implode("-",$ar);
                echo "Dato A2: $dato_a2\n";
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);                 
                socket_write($client, $envio,$length);
            break;
            
            case a3:
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $query = "SELECT pk_idventa,volumeninicial, volumenfinal, dineroinicial,dinerofinal from venta where pk_idventa = (select max(pk_idventa) from venta)"; 
                $result = pg_query($query) or die('Query error: ' . \pg_last_error()); 
                $row  = pg_fetch_row($result);
                $volumen = $row[2]-$row[1];
                $dinero  = $row[4]-$row[3];
                $idventa = $row[0];
                echo "Id venta:$idventa\n";
                
                $revimp     = strrev($dinero);
                $revcant    = strrev($volumen);
                $revidventa = strrev($idventa);
                echo "Rev Id venta:$revidventa\n";
                
                $stringimp     = sprintf("%0-7s",$revimp);
                $stringcant    = sprintf("%0-7s",$revcant);
                $stringidventa = sprintf("%0-9s",$revidventa);
                
                $arimporte   = str_split($stringimp);
                $arvolumen   = str_split($stringcant);
                $aridventa   = str_split($stringidventa);
                
                echo "Cadena Importe:$stringimp\n";
                echo "Cadena consecutivo:$stringidventa\n";
                
                $ar = array(78, 83, 88, $array[3],211,1,44,    $arimporte[0],$arimporte[1],$arimporte[2],$arimporte[3]+1,$arimporte[4],$arimporte[5],$arimporte[6],    86,$arvolumen[0],$arvolumen[1],$arvolumen[2]+1,$arvolumen[3],$arvolumen[4],$arvolumen[5],$arvolumen[6],    84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3]+1,$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],$arvol[12],    80,0,0,0,7,0,    72,47,10,   70,24,5,16,      80,0,0,0,0,7,0,0,  73,0,    75,0,0,0,0,0,0,0,0,0,0,   $aridventa[0],$aridventa[1],$aridventa[2],$aridventa[3],$aridventa[4],$aridventa[5],$aridventa[6],$aridventa[7],$aridventa[8]);  //Borrar $aridventa para quitar consecutivo de venta
                $largo = count($ar);                                                
                $ar[$largo] = verificar_check($ar, ($largo+1));
                $dato_a3 = implode("-",$ar);
                echo "Dato A3_1: $dato_a3\n";
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                echo "Largo trama: $length\n";
                socket_write($client, $envio,$length);
                $query2 = " UPDATE estado SET pos1 = 22";
                $result2 = pg_query($query2) or die('Query error: ' . \pg_last_error()); 
                pg_free_result($result);
                pg_free_result($result2);
                pg_close($dbconn); // Cerrando la conexión  
            break;
            
            case a4:   
                switch ($array[5]){
                    case 01:
                        $ar = array(78, 83, 88,$array[3],212,3);
                        echo "ingresó\n";
                    break;
                    case 02:
                        $ar = array(78, 83, 88,$array[3],212,3);
                    break;
                }
                $ar[6] = verificar_check($ar,7);
                $dato_a4 = implode("-",$ar);
                echo "Dato A4: $dato_a4\n";
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
            break;
                
            case a5:   // Se envían totales electronicos del dispansador
            $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
            or die('Can not connect: ' . \pg_last_error());
            
            $sql = "SELECT formatodinero FROM mapeodispensador WHERE pk_idposicion = 1";
            $result2 = pg_query($sql)   or die('Query error: ' . \pg_last_error()); 
            $row2 = pg_fetch_row($result2);
            
            $decdin   = $row2[0]; //decimales de dinero en el equipo
            if ($array[3]==1){
                $query = "SELECT totalmanguera1, dineromanguera1,totalmanguera2, dineromanguera2,totalmanguera3, dineromanguera3,totalmanguera4, dineromanguera4 from totales where pk_id_posicion  = 1"; 
                $result  = pg_query($query) or die('Query error: ' . \pg_last_error()); 
                $row  = pg_fetch_row($result);
                //Lee totales electronicos en dinero y volumen de la tabla
                $voltotal1 = $row[0];
                $dintotal1 = $row[1];
                $voltotal2 = $row[2];
                $dintotal2 = $row[3];
                $voltotal3 = $row[4];
                $dintotal3 = $row[5];
                $voltotal4 = $row[6];
                $dintotal4 = $row[7];
                //Formato
                $formatvol1 = sprintf("%01.2f", $voltotal1);
                $formatvol2 = sprintf("%01.2f", $voltotal2);
                $formatvol3 = sprintf("%01.2f", $voltotal3);
                $formatvol4 = sprintf("%01.2f", $voltotal4);
                
                //Invierte la trama para transmitir primero el LSB
                $revdin1 = strrev($dintotal1);
                $revvol1 = strrev($formatvol1);
                $revdin2 = strrev($dintotal2);
                $revvol2 = strrev($formatvol2);
                $revdin3 = strrev($dintotal3);
                $revvol3 = strrev($formatvol3);
                $revdin4 = strrev($dintotal4);
                $revvol4 = strrev($formatvol4);
                
                //Completa la cadena y formatea para envío
                //$padvol= str_pad($dintotal,$decdin,"0", STR_PAD_LEFT);
                $stringdin1 = sprintf("%0-12s",$revdin1);
                $stringvol1 = sprintf("%0-13s",$revvol1);
                $stringdin2 = sprintf("%0-12s",$revdin2);
                $stringvol2 = sprintf("%0-13s",$revvol2);
                $stringdin3 = sprintf("%0-12s",$revdin3);
                $stringvol3 = sprintf("%0-13s",$revvol3);
                $stringdin4 = sprintf("%0-12s",$revdin4);
                $stringvol4 = sprintf("%0-13s",$revvol4);
                
                
                $ardinero1  = str_split($stringdin1);
                $arvol1     = str_split($stringvol1);
                $ardinero2  = str_split($stringdin2);
                $arvol2     = str_split($stringvol2);
                $ardinero3  = str_split($stringdin3);
                $arvol3     = str_split($stringvol3);
                $ardinero4  = str_split($stringdin4);
                $arvol4     = str_split($stringvol4);
            
            
                $ar = array(78, 83,88,$array[3],213,49,$ardinero1[0],$ardinero1[1],$ardinero1[2],$ardinero1[3],$ardinero1[4],$ardinero1[5],$ardinero1[6],$ardinero1[7],$ardinero1[8],$ardinero1[9],$ardinero1[10],$ardinero1[11],$arvol1[0],$arvol1[1],$arvol1[3],$arvol1[4],$arvol1[5],$arvol1[6],$arvol1[7],$arvol1[8],$arvol1[9],$arvol1[10],$arvol1[11],$arvol1[12],    50,$ardinero2[0],$ardinero2[1],$ardinero2[2],$ardinero2[3],$ardinero2[4],$ardinero2[5],$ardinero2[6],$ardinero2[7],$ardinero2[8],$ardinero2[9],$ardinero2[10],$ardinero2[11],$arvol2[0],$arvol2[1],$arvol2[3],$arvol2[4],$arvol2[5],$arvol2[6],$arvol2[7],$arvol2[8],$arvol2[9],$arvol2[10],$arvol2[11],$arvol2[12],     51,$ardinero3[0],$ardinero3[1],$ardinero3[2],$ardinero3[3],$ardinero3[4],$ardinero3[5],$ardinero3[6],$ardinero3[7],$ardinero3[8],$ardinero3[9],$ardinero3[10],$ardinero3[11],$arvol3[0],$arvol3[1],$arvol3[3],$arvol3[4],$arvol3[5],$arvol3[6],$arvol3[7],$arvol3[8],$arvol3[9],$arvol3[10],$arvol3[11],$arvol3[12]);
                $largo = count($ar);                                                
                $ar[$largo] = verificar_check($ar, ($largo+1));
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $imprime = implode("-",$ar);
                $length = strlen($envio);
                socket_write($client, $envio);
                echo "Imprime : $imprime\n";
                } 
            if($array[3]==2){
                $query = "SELECT totalmanguera1, dineromanguera1,totalmanguera2, dineromanguera2,totalmanguera3, dineromanguera3,totalmanguera4, dineromanguera4 from totales where pk_id_posicion  = 2"; 
                $result  = pg_query($query) or die('Query error: ' . \pg_last_error()); 
                $row  = pg_fetch_row($result);
                //Lee totales electronicos en dinero y volumen de la tabla
                $voltotal1 = $row[0];
                $dintotal1 = $row[1];
                $voltotal2 = $row[2];
                $dintotal2 = $row[3];
                $voltotal3 = $row[4];
                $dintotal3 = $row[5];
                $voltotal4 = $row[6];
                $dintotal4 = $row[7];
                //Formato
                $formatvol1 = sprintf("%01.2f", $voltotal1);
                $formatvol2 = sprintf("%01.2f", $voltotal2);
                $formatvol3 = sprintf("%01.2f", $voltotal3);
                $formatvol4 = sprintf("%01.2f", $voltotal4);
                
                //Invierte la trama para transmitir primero el LSB
                $revdin1 = strrev($dintotal1);
                $revvol1 = strrev($formatvol1);
                $revdin2 = strrev($dintotal2);
                $revvol2 = strrev($formatvol2);
                $revdin3 = strrev($dintotal3);
                $revvol3 = strrev($formatvol3);
                $revdin4 = strrev($dintotal4);
                $revvol4 = strrev($formatvol4);
                
                //Completa la cadena y formatea para envío
                //$padvol= str_pad($dintotal,$decdin,"0", STR_PAD_LEFT);
                $stringdin1 = sprintf("%0-12s",$revdin1);
                $stringvol1 = sprintf("%0-13s",$revvol1);
                $stringdin2 = sprintf("%0-12s",$revdin2);
                $stringvol2 = sprintf("%0-13s",$revvol2);
                $stringdin3 = sprintf("%0-12s",$revdin3);
                $stringvol3 = sprintf("%0-13s",$revvol3);
                $stringdin4 = sprintf("%0-12s",$revdin4);
                $stringvol4 = sprintf("%0-13s",$revvol4);
                
                
                $ardinero1  = str_split($stringdin1);
                $arvol1     = str_split($stringvol1);
                $ardinero2  = str_split($stringdin2);
                $arvol2     = str_split($stringvol2);
                $ardinero3  = str_split($stringdin3);
                $arvol3     = str_split($stringvol3);
                $ardinero4  = str_split($stringdin4);
                $arvol4     = str_split($stringvol4);
            
                
                
                
                $ar = array(78, 83,88,$array[3],213,49,$ardinero1[0],$ardinero1[1],$ardinero1[2],$ardinero1[3],$ardinero1[4],$ardinero1[5],$ardinero1[6],$ardinero1[7],$ardinero1[8],$ardinero1[9],$ardinero1[10],$ardinero1[11],$arvol1[0],$arvol1[1],$arvol1[3],$arvol1[4],$arvol1[5],$arvol1[6],$arvol1[7],$arvol1[8],$arvol1[9],$arvol1[10],$arvol1[11],$arvol1[12],    50,$ardinero2[0],$ardinero2[1],$ardinero2[2],$ardinero2[3],$ardinero2[4],$ardinero2[5],$ardinero2[6],$ardinero2[7],$ardinero2[8],$ardinero2[9],$ardinero2[10],$ardinero2[11],$arvol2[0],$arvol2[1],$arvol2[3],$arvol2[4],$arvol2[5],$arvol2[6],$arvol2[7],$arvol2[8],$arvol2[9],$arvol2[10],$arvol2[11],$arvol2[12],     51,$ardinero3[0],$ardinero3[1],$ardinero3[2],$ardinero3[3],$ardinero3[4],$ardinero3[5],$ardinero3[6],$ardinero3[7],$ardinero3[8],$ardinero3[9],$ardinero3[10],$ardinero3[11],$arvol3[0],$arvol3[1],$arvol3[3],$arvol3[4],$arvol3[5],$arvol3[6],$arvol3[7],$arvol3[8],$arvol3[9],$arvol3[10],$arvol3[11],$arvol3[12]);
                $largo = count($ar);                                                
                echo "Largo A5: $largo\n";                
                $ar[$largo] = verificar_check($ar, ($largo +1));
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio);
                echo "Estado : $estado\n";
            }
                pg_free_result($result);
                pg_close($dbconn); // Cerrando la conexión 
            
                break;
            
            case a8:
                $ar = array(78, 83, 88,$array[3],216,3);
                $ar[6] = verificar_check($ar, 7);
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);     
                socket_write($client, $envio,$length); 
                break;
                
            case ab: //Solicita el precio actual del grado
                    $ar = array(78, 83, 88,$array[3],219,$array[5],0,0,0,8,0);
                    $largo = count($ar);   
                    echo "Array 5: $array[5]\n";
                    $ar[$largo] = verificar_check($ar, ($largo +1));
                    foreach ($ar as &$valor) {
                       $valor = chr($valor);
                    }
                    unset($valor);                                          
                    $envio = implode("", $ar);
                    $length = strlen($envio);
                    socket_write($client, $envio);
            break;
            
            case ac:
                $ar = array(78, 83, 88,$array[3],221,3);
                $ar[6] = verificar_check($ar, 7);
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);
                $estado  = 1;
                $estado2 = 1;
                socket_write($client, $envio,$length);
            break;
                
            
            case ad:
                $ar = array(78, 83, 88,$array[3],172,1);
                $ar[6] = verificar_check($ar, 7);
                $dato_ad = implode("-",$ar);
                echo "Dato AD: $dato_ad\n";
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);
                $envio = implode("", $ar);
                $length = strlen($envio);
                $estado = 1;
                socket_write($client, $envio);
                
            break;
                             
                
        }        
    }else{
        $conexion = false;
    }
    }
        
}
