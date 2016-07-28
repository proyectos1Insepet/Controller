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
$dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
    or die('Can not connect: ' . \pg_last_error());
$sql   = "TRUNCATE TABLE solicitudes"; 
$res = pg_query($sql); 
$query = "INSERT INTO solicitudes (solicitabge2) VALUES(0)"; 
$result = pg_query($query); 
$impresora ='/dev/ttyO1';
 `stty -F $impresora 19200`;

 


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
    $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
    or die('Can not connect: ' . \pg_last_error());
    $sql1    = "TRUNCATE TABLE solicitudes";
    $res1    = pg_query($sql1); 
    $query   = "INSERT INTO solicitudes (solicitabge2,tiposolicitud,confirmacion) VALUES(1,'T',0)"; 
    $result  = pg_query($query); 
    pg_free_result($result);
    pg_close($dbconn); // Cerrando la conexión  
    //Accept incoming connection - This is a blocking call
    $client =  socket_accept($sock);     
    //display information about the client who is connected
    if(socket_getpeername($client , $address , $port))
    {
        echo "Cliente $address : $port está conectado. \n";
        $conexion = true;
        echo "Estado conexión:$conexion\n";
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
        //Estados POS 1
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
        if($recibe == 5){
            $estado = 5;
        }
        if($recibe == 6){
            $estado = 6;
        }
        if($recibe == 7){
            $estado = 7;
        }
        if($recibe == 8){
            $estado = 8;
        }
        if($recibe == 9){
            $estado = 9;
        }
        if($recibe == 12){
            $estado = 12;
        }
        if($recibe == 16){
            $estado = 16;
        }
        if($recibe == 17){
            $estado = 17;
        }
        if($recibe == 18){
            $estado = 18;
        }
        if($recibe == 19){
            $estado = 19;
        }
        if($recibe == 20){
            $estado = 20;
        }
        //Estados POS 2                                
        if($recibe2 == 22){
            $estado2 = 1;
        }
        if($recibe2 == 23){
            $estado2 = 2;
        }
        if($recibe2 == 25){
            $estado2 = 3;
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
        $input = socket_read($client, 2048); 
        $array = str_split($input); 
        echo "Cadena entrada: $input\n";
        foreach ($array as &$valor) {
            $valor = bin2hex($valor);
        }
        unset($valor);
        $imprime_ar = implode("-",$array);
        echo "Cadena entrada hex: $imprime_ar\n";        
        $CDG = 2;
        if($array[0]==43 && $array[1]==44 && $array[2]==47){
        
        switch ($array[4]){
            case a1:  //Inicia la consulta del NSX
                $ar = array(78, 83, 88, 255,209,$CDG,$estado,$estado2);                
                $ar[6+$CDG] = verificar_check($ar, (7+$CDG));
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);                                                                        
                $envio = implode("", $ar);
                $print = implode(":-:", $ar);
                echo "Salida: $print\n";
                $length = strlen($envio);                                                
                socket_write($client, $envio,$length);  
                pg_free_result($result);
                pg_close($dbconn); // Cerrando la conexión    
            break;
            
            case a2:
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $query = "SELECT grado, tipo_p, valor_p, totalesdin, totalesvol,ppu FROM preset"; 
                $result = pg_query($query); 
                $row  = pg_fetch_row($result);
                $minuto = date("i");
                $hora   = date("h");
                $dia    = date("d");
                $mes    = date("m");
                $year   = date("y");
                echo "Tipo Preset:$row[1]";
                if ($row[1] == V){
                    $tipo_preset = 1;
                }
                if ($row[1] == F){
                    $tipo_preset = 3;
                }
                if($row[1]==D){
                    $tipo_preset = 2;
                }
                else{
                    $tipo_preset = $row[1];
                }
                echo "Tipo Preset:$row[1]; Preset: $tipo_preset";
                $preset    = $row[2];
                $ppu       = $row[5];
                $revvol    = strrev(number_format((float)$row[4], 2, '', ''));
                $revdinero = strrev($row[3]);
                $revpreset = strrev($preset);
                $revppu    = strrev($ppu);
                
                $strpreset = sprintf("%0-7s",$revpreset);
                $strppu    = sprintf("%0-5s",$revppu);
                $stringvol = sprintf("%0-12s",$revvol);
                $stringdin     = sprintf("%0-12s",$revdinero);
                
                $arvol     = str_split($stringvol);
                $ardinero    = str_split($stringdin);
                $arpreset  = str_split($strpreset);
                $arppu     = str_split($strppu);
                $ar = array(78, 83, 88,$array[3], 210, $row[0], $tipo_preset,  $arpreset[0],$arpreset[1],$arpreset[2],$arpreset[3],$arpreset[4],$arpreset[5],$arpreset[6],  84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3],$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[2],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],   80,$arppu[0],$arppu[1],$arppu[2],$arppu[3],$arppu[4],   72,$minuto,$hora,     70,$dia,$mes,$year );
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
                pg_free_result($result);
                pg_close($dbconn); // Cerrando la conexión  
            break;
            
            case a3:
                $minuto = date("i");
                $hora   = date("h");
                $dia    = date("d");
                $mes    = date("m");
                $year   = date("y");
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $consulta    = "SELECT kilometraje, serial, tipo_venta FROM preset WHERE id_pos = $array[3] AND serial IS NOT NULL";
                $res         = pg_query($consulta);
                $row         = pg_fetch_row($result);
                $actualiza   = "UPDATE venta SET kilometrajecliente = $row[0], serialibutton = $row[1], fk_idtipotransaccion = $row[2] where pk_idventa = (select max(pk_idventa) from venta where idposicion = $array[3])";
                $finv        = pg_query($actualiza);
                pg_free_result($res);
                pg_free_result($finv);
                if($recupera == 0){
                    $query = "SELECT pk_idventa,volumeninicial, volumenfinal, dineroinicial,dinerofinal, ppu,valorprogramado,kilometrajecliente,grado,nombreefectivo,placaefectivo,tipovehiculo,cantidadtotal from venta where pk_idventa = (select max(pk_idventa) from venta where idposicion = $array[3]);"; 
                    $res         = pg_query($sql); 
                    $result      = pg_query($query); 
                    $row         = pg_fetch_row($result);
                    $num2dec     = $row[12];
                    $volumen     = number_format((float)$num2dec, 3, '', '');
                    $dinero      = $row[4]-$row[3];
                    $idventa     = $row[0];
                    $ppu         = $row[5];   
                    $preset      = $row[6];
                    $kilometraje = $row[7];
                    $grado       = $row[8]; 
                    $placa       = $row[10];
                    $revimp      = strrev($dinero);
                    $revcant    = strrev($volumen);
                    $revidventa = strrev($idventa);
                    $revppu     = strrev($ppu);
                    $revpreset  = strrev($preset);   
                    $revkm      = strrev($kilometraje);
                    $revdinero  = strrev($row[4]);
                    $revvol     = strrev(number_format((float)$row[2], 2, '', ''));
                    $revplaca   = strrev($placa);
                
                    $stringimp     = sprintf("%0-7s",$revimp);
                    $stringcant    = sprintf("%0-7s",$revcant);
                    $stringdin     = sprintf("%0-12s",$revdinero);
                    $stringvol     = sprintf("%0-12s",$revvol);
                    $stringidventa = sprintf("%0-9s",$revidventa);
                    $stringppu     = sprintf("%0-5s",$revppu);
                    $strpreset     = sprintf("%0-6s",$revpreset);
                    $strkm         = sprintf("%0-10s",$revkm);
                    $strplaca      = sprintf("%0-7s",$revplaca);
                    echo "Importe: $stringimp; Cantidad:$stringcant; Venta: $stringidventa; PPU: $stringppu; Preset: $strpreset; Placa: $strplaca; Tipo Venta: $row[11]\n";
                
                    $arimporte   = str_split($stringimp);
                    $arvolumen   = str_split($stringcant);
                    $ardinero    = str_split($stringdin);
                    $arvol       = str_split($stringvol);
                    $aridventa   = str_split($stringidventa);
                    $arppu       = str_split($stringppu);
                    $arpreset    = str_split($strpreset); 
                    $arkm        = str_split($strkm);
                    $arplaca     = str_split($strplaca);
                    foreach ($arplaca as &$valor) {
                        $valor = ord($valor);
                    }
                    unset($valor);
                    $ar = array(78, 83, 88, $array[3],211,$grado,68,$arimporte[0],$arimporte[1],$arimporte[2],$arimporte[3],$arimporte[4],$arimporte[5],$arimporte[6],    86,$arvolumen[0],$arvolumen[1],$arvolumen[2],$arvolumen[3],$arvolumen[4],$arvolumen[5],$arvolumen[6],    84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3],$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[2],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],    80,$arppu[0],$arppu[1],$arppu[2],$arppu[3],$arppu[4],    72,$minuto,$hora,   70,$dia,$mes,$year,      80,$arplaca[0],$arplaca[1],$arplaca[2],$arplaca[3],$arplaca[4],$arplaca[5],$arplaca[6],  73,$row[11],    75,$arkm[0],$arkm[1],$arkm[2],$arkm[3],$arkm[4],$arkm[5],$arkm[6],$arkm[7],$arkm[8],$arkm[9],   $aridventa[0],$aridventa[1],$aridventa[2],$aridventa[3],$aridventa[4],$aridventa[5],$aridventa[6],$aridventa[7],$aridventa[8]);  //Borrar $aridventa para quitar consecutivo de venta
                    $largo = count($ar);                                                
                    $ar[$largo] = verificar_check($ar, ($largo+1));
                    $dato_a3 = implode("-",$ar);
                    foreach ($ar as &$valor) {
                        $valor = chr($valor);
                    }
                    unset($valor);                                          
                    $envio = implode("", $ar);
                    $length = strlen($envio);
                    socket_write($client, $envio,$length);
                }
                if ($recupera == 1){
                    $query = "SELECT pk_idventa,volumeninicial, volumenfinal, dineroinicial,dinerofinal, ppu,valorprogramado,kilometrajecliente,grado,nombreefectivo,placaefectivo,tipovehiculo,cantidadtotal from venta where pk_idventa = ($idnsx+1);"; 
                    $result      = pg_query($query); 
                    $row         = pg_fetch_row($result);
                    $num2dec     = $row[12];
                    $volumen     = number_format((float)$num2dec, 3, '', '');
                    $dinero      = $row[4]-$row[3];
                    $idventa     = $row[0];
                    $ppu         = $row[5];   
                    $preset      = $row[6];
                    $kilometraje = $row[7];
                    $grado       = $row[8]; 
                    $placa       = $row[10];
                    $revimp      = strrev($dinero);
                    $revcant    = strrev($volumen);
                    $revidventa = strrev($idventa);
                    $revppu     = strrev($ppu);
                    $revpreset  = strrev($preset);   
                    $revkm      = strrev($kilometraje);
                    $revdinero  = strrev($row[4]);
                    $revvol     = strrev(number_format((float)$row[2], 2, '', ''));
                    $revplaca   = strrev($placa);
                
                    $stringimp     = sprintf("%0-7s",$revimp);
                    $stringcant    = sprintf("%0-7s",$revcant);
                    $stringdin     = sprintf("%0-12s",$revdinero);
                    $stringvol     = sprintf("%0-12s",$revvol);
                    $stringidventa = sprintf("%0-9s",$revidventa);
                    $stringppu     = sprintf("%0-5s",$revppu);
                    $strpreset     = sprintf("%0-6s",$revpreset);
                    $strkm         = sprintf("%0-10s",$revkm);
                    $strplaca      = sprintf("%0-7s",$revplaca);
                    echo "Importe: $stringimp; Cantidad:$stringcant; Venta: $stringidventa; PPU: $stringppu; Preset: $strpreset; Placa: $strplaca; Tipo Venta: $row[11]\n";
                
                    $arimporte   = str_split($stringimp);
                    $arvolumen   = str_split($stringcant);
                    $ardinero    = str_split($stringdin);
                    $arvol       = str_split($stringvol);
                    $aridventa   = str_split($stringidventa);
                    $arppu       = str_split($stringppu);
                    $arpreset    = str_split($strpreset); 
                    $arkm        = str_split($strkm);
                    $arplaca     = str_split($strplaca);
                    foreach ($arplaca as &$valor) {
                        $valor = ord($valor);
                    }
                    unset($valor);
                    $ar = array(78, 83, 88, $array[3],211,$grado,68,$arimporte[0],$arimporte[1],$arimporte[2],$arimporte[3],$arimporte[4],$arimporte[5],$arimporte[6],    86,$arvolumen[0],$arvolumen[1],$arvolumen[2],$arvolumen[3],$arvolumen[4],$arvolumen[5],$arvolumen[6],    84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3],$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[2],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],    80,$arppu[0],$arppu[1],$arppu[2],$arppu[3],$arppu[4],    72,$minuto,$hora,   70,$dia,$mes,$year,      80,$arplaca[0],$arplaca[1],$arplaca[2],$arplaca[3],$arplaca[4],$arplaca[5],$arplaca[6],  73,$row[11],    75,$arkm[0],$arkm[1],$arkm[2],$arkm[3],$arkm[4],$arkm[5],$arkm[6],$arkm[7],$arkm[8],$arkm[9],   $aridventa[0],$aridventa[1],$aridventa[2],$aridventa[3],$aridventa[4],$aridventa[5],$aridventa[6],$aridventa[7],$aridventa[8]);  //Borrar $aridventa para quitar consecutivo de venta
                    $largo = count($ar);                                                
                    $ar[$largo] = verificar_check($ar, ($largo+1));
                    $dato_a3 = implode("-",$ar);
                    foreach ($ar as &$valor) {
                        $valor = chr($valor);
                    }
                    unset($valor);                                          
                    $envio = implode("", $ar);
                    $length = strlen($envio);
                    socket_write($client, $envio,$length);
                    if ($array[3] == 01){
                        $query     = "UPDATE estado SET pos1 = 22";
                        $resultado = pg_query($query);
                        $recupera  = 0;
                    }
                    if ($array[3] ==02){
                        $query     = "UPDATE estado SET pos2 = 22";
                        $resultado = pg_query($query);
                        $recupera  = 0;
                    }
                }
                pg_free_result($sql);
                pg_free_result($result);
                pg_close($dbconn); // Cerrando la conexión  
            break;
            
            case a4:   
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                echo "Caso A4: $array[5]\n";
                switch ($array[5]){
                    case 1:
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1){
                            $sql = "UPDATE estado set pos1 = 25";
                        }else{
                            $sql = "UPDATE estado set pos2 = 25";
                        }
                        
                        $resultado = pg_query($sql);
                    break;
                    case 2:
                        $ar = array(78, 83, 88,$array[3],212,3);
                    break;
                    case 3:
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $query = " UPDATE estado SET pos1 = 22"; //Cancelado por PC 
                            $mensaje = "UPDATE turno SET mensajeturno = 'Cancelado por PC', turno = 0"; 
                        }else{
                            $query = " UPDATE estado SET pos2 = 22"; // 3.
                            $mensaje = "UPDATE turno SET mensajeturno = 'Cancelado por PC', turno = 0"; 
                        }
                        $result = pg_query($query);
                        $result2 = pg_query($mensaje);
                    break;
                    case 4:
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $query = " UPDATE estado SET pos1 = 22"; //Cancelado por PC 
                            $mensaje = "UPDATE turno SET mensajeturno = 'Apertura exitosa', turno = 1"; 
                        }else{
                            $query = " UPDATE estado SET pos2 = 22"; // 3.
                            $mensaje = "UPDATE turno SET mensajeturno = 'Apertura exitosa', turno = 1"; 
                        }
                        $result = pg_query($query);
                        $result2 = pg_query($mensaje);
                    break;
                    case 5:
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $query   = "UPDATE estado SET pos1 = 22"; // Usuario contraseña invalida
                            $mensaje = "UPDATE turno SET mensajeturno = 'Usuario o contraseña invalido', turno = 0";  
                        }else{
                            $query = " UPDATE estado SET pos2 = 22"; // Usuario contraseña invalida
                            $mensaje = "UPDATE turno SET mensajeturno = 'Usuario o contraseña invalido', turno = 0";  
                        }
                        $result  = pg_query($query);
                        $result2 = pg_query($mensaje);
                    break;
                    case 6:
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $query = " UPDATE estado SET pos1 = 22"; //Cancelado por PC 
                            $mensaje = "UPDATE turno SET mensajeturno = 'Islero Invalido', turno = 0"; 
                        }else{
                            $query = " UPDATE estado SET pos2 = 22"; // 3.
                            $mensaje = "UPDATE turno SET mensajeturno = 'Islero invalido', turno = 0"; 
                        }
                        $result = pg_query($query);
                        $result2 = pg_query($mensaje);
                    break;
                    case 7:
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $query = " UPDATE estado SET pos1 = 22"; //Cancelado por PC 
                            $mensaje = "UPDATE turno SET mensajeturno = 'Error de operacion', turno = 0"; 
                        }else{
                            $query = " UPDATE estado SET pos2 = 22"; // 3.
                            $mensaje = "UPDATE turno SET mensajeturno = 'Error de operacion', turno = 0"; 
                        }
                        $result = pg_query($query);
                        $result2 = pg_query($mensaje);
                    break;
                    case 8:
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $query = " UPDATE estado SET pos1 = 22"; //Cancelado por PC 
                            $mensaje = "UPDATE turno SET mensajeturno = 'Venta en proceso', turno = 0"; 
                        }else{
                            $query = " UPDATE estado SET pos2 = 22"; // 3.
                            $mensaje = "UPDATE turno SET mensajeturno = 'Venta en proceso', turno = 0"; 
                        }
                        $result = pg_query($query);
                        $result2 = pg_query($mensaje);
                    break;
                    case 9:
                        $ar = array(78, 83, 88,$array[3],212,3);
                        if($array[3]==1 ){
                            $query = " UPDATE estado SET pos1 = 22"; // 
                            $mensaje = "UPDATE turno SET mensajeturno = 'Configuracion OK', turno = 0"; 
                        }else{
                           $query = " UPDATE estado SET pos2 = 22"; // 
                           $mensaje = "UPDATE turno SET mensajeturno = 'Configuracion OK', turno = 0"; 
                        }
                        $result = pg_query($query);
                        $result2 = pg_query($mensaje);
                    break;
                    default :
                        if($array[3]==1 ){
                           $query = "UPDATE estado SET pos1 = 22"; // Cierre OK
                           $mensaje = "UPDATE turno SET mensajeturno = 'Cierre OK', turno = 1";
                        }else{
                           $query = "UPDATE estado SET pos2 = 22"; 
                           $mensaje = "UPDATE turno SET mensajeturno = 'Cierre OK', turno = 1";
                        }
                        $result = pg_query($query);
                        $result2 = pg_query($mensaje);
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
                
            case a5:   // Se envían totales electronicos del dispensador
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
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
                    $result  = pg_query($query) or die('Query error: ' . \pg_last_error()); 
                    $row  = pg_fetch_row($result);
                    //Lee totales electronicos en dinero y volumen de la tabla
                    $voltotal1 = $row[0];
                    $dintotal1 = $row[1];
                    $voltotal2 = $row[2];
                    $dintotal2 = $row[3];
                    //Formato
                    $formatvol1 = sprintf("%01.2f", $voltotal1);
                    $formatvol2 = sprintf("%01.2f", $voltotal2);
                    //Invierte la trama para transmitir primero el LSB
                    $revdin1 = strrev($dintotal1);
                    $revvol1 = strrev($formatvol1);
                    $revdin2 = strrev($dintotal2);
                    $revvol2 = strrev($formatvol2);
                    //Completa la cadena y formatea para envío
                    $stringdin1 = sprintf("%0-12s",$revdin1);
                    $stringvol1 = sprintf("%0-13s",$revvol1);
                    $stringdin2 = sprintf("%0-12s",$revdin2);
                    $stringvol2 = sprintf("%0-13s",$revvol2);
                    
                    $ardinero1  = str_split($stringdin1);
                    $arvol1     = str_split($stringvol1);
                    $ardinero2  = str_split($stringdin2);
                    $arvol2     = str_split($stringvol2);                    
                    $ar = array(78, 83,88,$array[3],213,49,$ardinero1[0],$ardinero1[1],$ardinero1[2],$ardinero1[3],$ardinero1[4],$ardinero1[5],$ardinero1[6],$ardinero1[7],$ardinero1[8],$ardinero1[9],$ardinero1[10],$ardinero1[11],$arvol1[0],$arvol1[1],$arvol1[3],$arvol1[4],$arvol1[5],$arvol1[6],$arvol1[7],$arvol1[8],$arvol1[9],$arvol1[10],$arvol1[11],$arvol1[12],  50,$ardinero2[0],$ardinero2[1],$ardinero2[2],$ardinero2[3],$ardinero2[4],$ardinero2[5],$ardinero2[6],$ardinero2[7],$ardinero2[8],$ardinero2[9],$ardinero2[10],$ardinero2[11],$arvol2[0],$arvol2[1],$arvol2[3],$arvol2[4],$arvol2[5],$arvol2[6],$arvol2[7],$arvol2[8],$arvol2[9],$arvol2[10],$arvol2[11],$arvol2[12]);
                }
                if($manguera == 3){
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
                    $ar = array(78, 83,88,$array[3],213,49,$ardinero1[0],$ardinero1[1],$ardinero1[2],$ardinero1[3],$ardinero1[4],$ardinero1[5],$ardinero1[6],$ardinero1[7],$ardinero1[8],$ardinero1[9],$ardinero1[10],$ardinero1[11],$arvol1[0],$arvol1[1],$arvol1[3],$arvol1[4],$arvol1[5],$arvol1[6],$arvol1[7],$arvol1[8],$arvol1[9],$arvol1[10],$arvol1[11],$arvol1[12],  50,$ardinero2[0],$ardinero2[1],$ardinero2[2],$ardinero2[3],$ardinero2[4],$ardinero2[5],$ardinero2[6],$ardinero2[7],$ardinero2[8],$ardinero2[9],$ardinero2[10],$ardinero2[11],$arvol2[0],$arvol2[1],$arvol2[3],$arvol2[4],$arvol2[5],$arvol2[6],$arvol2[7],$arvol2[8],$arvol2[9],$arvol2[10],$arvol2[11],$arvol2[12],   51,$ardinero3[0],$ardinero3[1],$ardinero3[2],$ardinero3[3],$ardinero3[4],$ardinero3[5],$ardinero3[6],$ardinero3[7],$ardinero3[8],$ardinero3[9],$ardinero3[10],$ardinero3[11],$arvol3[0],$arvol3[1],$arvol3[3],$arvol3[4],$arvol3[5],$arvol3[6],$arvol3[7],$arvol3[8],$arvol3[9],$arvol3[10],$arvol3[11],$arvol3[12]);
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
                socket_write($client, $envio);
                echo "Imprime : $imprime\n";
                pg_free_result($result);
                pg_free_result($res);
                pg_close($dbconn); // Cerrando la conexión         
                //$padvol= str_pad($dintotal,$decdin,"0", STR_PAD_LEFT);
            break;
                
            case a6:
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $query = "SELECT grado, tipo_p, valor_p, totalesdin, totalesvol,ppu, kilometraje, serial FROM preset"; 
                $result = pg_query($query);
                $row  = pg_fetch_row($result);
                echo "Tipo Preset:$row[1]";
                if ($row[1] == 'V'){
                    $tipo_preset = 1;
                }
                if ($row[1] == 'F'){
                    $tipo_preset = 3;
                }
                if($row[1]=='D'){
                    $tipo_preset = 2;
                }
                $minuto = date("i");
                $hora   = date("h");
                $dia    = date("d");
                $mes    = date("m");
                $year   = date("y");
                $preset = $row[2];
                $ppu    = $row[5];
                $kilometraje = $row[6];
                
                $revvol    = strrev(number_format((float)$row[4], 2, '', ''));
                $revdinero = strrev($row[3]);
                $idcliente = strrev($row[7]);
                $revpreset = strrev($preset);
                $revppu = strrev($ppu);
                
                $stringvol = sprintf("%0-12s",$revvol);
                $stringdin     = sprintf("%0-12s",$revdinero);
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
                $ar = array(78, 83, 88,$array[3], 214, $row[0], $row[1],  $arpreset[0],$arpreset[1],$arpreset[2],$arpreset[3],$arpreset[4],$arpreset[5],$arpreset[6],  84,$ardinero[0],$ardinero[1],$ardinero[2],$ardinero[3],$ardinero[4],$ardinero[5],$ardinero[6],$ardinero[7],$ardinero[8],$ardinero[9],$ardinero[10],$ardinero[11],$arvol[0],$arvol[1],$arvol[2],$arvol[3],$arvol[4],$arvol[5],$arvol[6],$arvol[7],$arvol[8],$arvol[9],$arvol[10],$arvol[11],   80,$arppu[0],$arppu[1],$arppu[2],$arppu[3],$arppu[4],   72,$minuto,$hora,     70,$dia,$mes,$year, 73,$serial[0],$serial[1],$serial[2],$serial[3],$serial[4],$serial[5],$serial[6],$serial[7],$serial[8],$serial[9],$serial[10],$serial[11],$serial[12],$serial[13],$serial[14],$serial[15], 75,$arkm[0],$arkm[1],$arkm[2],$arkm[3],$arkm[4],$arkm[5],$arkm[6],$arkm[7],$arkm[8],$arkm[9]);
                $largo = count($ar);  
                
                $ar[$largo] = verificar_check($ar, ($largo +1));
                echo "Largo A6: $largo\n";
                $dato_a6 = implode("-",$ar);
                echo "Dato A6: $dato_a6\n";
                foreach ($ar as &$valor) {
                    $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);                 
                socket_write($client, $envio,$length);
            break;
            
            case a7:
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
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
                $query = "UPDATE preset SET grado ='$grado', tipo_p ='$tipo_preset', autorizado ='$autorizado';"; 
                $result = pg_query($query);
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
            
            case a8:
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $cprecio    = "TRUNCATE TABLE solicitudes;";
                $cprecio   .= "INSERT INTO solicitudes VALUES(1,'P',0);";
                $rprecio    = pg_query($cprecio);
                $precio     = array(5);
                $precio [0] = hex2bin($array[10]);
                $precio [1] = hex2bin($array[9]);
                $precio [2] = hex2bin($array[8]);
                $precio [3] = hex2bin($array[7]);
                $precio [4] = hex2bin($array[6]);
                $precio_db  = implode("", $precio);
                echo "Precio BD: $precio_db\n";
                if($array[3] == 1){
                    if ($array[5]== 1){
                        $query = "UPDATE precios SET nsx1 = '$precio_db' WHERE id_pos = $array[3]"; 
                        $result  = pg_query($query);
                        if (!$result) {
                            $ACK = 4;  
                        }else{
                            $ACK = 3;
                        }
                    }
                    if ($array[5]== 2){
                        $query = "UPDATE precios SET nsx2 = '$precio_db' WHERE id_pos = $array[3]"; 
                        $result  = pg_query($query);
                        if (!$result) {
                            $ACK = 4;  
                        }else{
                            $ACK = 3;
                        }
                    }
                    if ($array[5]== 3){
                        $query = "UPDATE precios SET nsx3 = '$precio_db' WHERE id_pos = $array[3]"; 
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
                        $query = "UPDATE precios SET nsx1 = '$precio_db' WHERE id_pos = $array[3]"; 
                        $result  = pg_query($query);
                        if (!$result) {
                            $ACK = 4;  
                        }else{
                            $ACK = 3;
                        }
                    }
                    if ($array[5]== 2){
                        $query = "UPDATE precios SET nsx2 = '$precio_db' WHERE id_pos = $array[3]"; 
                        $result  = pg_query($query);
                        if (!$result) {
                            $ACK = 4;  
                        }else{
                            $ACK = 3;
                        }
                    }
                    if ($array[5]== 3){
                        $query = "UPDATE precios SET nsx3 = '$precio_db' WHERE id_pos = $array[3]"; 
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
                $compara    = "SELECT nsx1,disp1 FROM precios;";
                $rcompara   = pg_query($compara);
                $fcompara   = pg_fetch_row($rcompara);
                if($fcompara[0] == $fcompara[1]){
                    $solicitud  = "UPDATE solicitudes SET solicitabge2=0, confirmacion = 1;";
                    $rsolicitud = pg_query($solicitud);
                }
                pg_free_result($result);
                pg_close($dbconn); // Cerrando la conexión   
                break;
            
            case aa:
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $query   = "SELECT usuario, contraseña, turno FROM turno";
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
                $ar = array(78, 83, 88,$array[3],218,0, 67,$aruss[0],$aruss[1],$aruss[2],$aruss[3],$aruss[4],$aruss[5],$aruss[6],$aruss[7],$aruss[8],$aruss[9],  80,$arpass[0],$arpass[1],$arpass[2],$arpass[3],$arpass[4],$arpass[5],$arpass[6],$arpass[7]);
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
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
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
                echo "Array 5: $array[5]\n";
                $ar[$largo] = verificar_check($ar, ($largo +1));
                foreach ($ar as &$valor) {
                   $valor = chr($valor);
                }
                unset($valor);                                          
                $envio = implode("", $ar);
                $length = strlen($envio);
                socket_write($client, $envio,$length);
            break;
            
            case ac:
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $sql         = "SELECT tipoimpresora FROM mapeodispensador where pk_idposicion = $array[3]";
                $print       = pg_query($sql);
                $fila        = pg_fetch_row($print);
                echo "Fila: $fila[0]\n";
                if ($fila[0] == 1){
                    $query       = "SELECT tramakios FROM logos WHERE id_logo = 1";
                    echo "Kiosko";
                }
                if ($fila[0] == 2){
                    $query       = "SELECT trama FROM logos WHERE id_logo = 2";
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
                $f = fopen("$impresora","r+");
                if(!$f) {
                    echo "Error al abrir\n";
                    exit;
                }
                $impresion = substr($input,7);
                echo "Recibo: \n";
                echo "$impresion";
                fwrite($f,$f_logo);
                fwrite($f,chr(0x0A));
                fwrite($f,chr(0x0A));
                fwrite($f,chr(0x0A));
                fwrite($f,chr(0x0A));
                fwrite($f,chr(0x1B));
                fwrite($f,chr(0x6C));
                fwrite($f,chr(0x01));
                fwrite($f,chr(0x1B));
                fwrite($f,chr(0x51));
                fwrite($f,chr(0x01));
                
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
                
            
            case ad:
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
            
            case ae:
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                if ($array[5] ==00){
                    $turnonsx=0;
                }else{
                    $turnonsx=1;
                }
                //$sql = "UPDATE estado SET pos2 = 7";
                $resultado = pg_query($sql); 
                if (!$resultado) {
                    $ACK = 4;  
                }else{
                    $ACK = 3;
                }
                echo "ACK: $ACK\n";
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
                $row     = pg_fetch_row($result);
            break;
            
            case af:
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
            
            case b0:
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
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $turno   = "UPDATE turno SET turnonsx = $array[5]";
                if ($array[3] == 1){
                    $config  = "UPDATE mapeodispensador SET numerodigitos = $array[6], formatodinero =$array[7], formatovolumen = $array[8], formatoprecio = $array[9], ppux10 = chr$array[36] WHERE pk_idposicion = $array[3]";
                    $resultado = pg_query($config);
                }
                if ($array[3] ==2){
                    $config  = "UPDATE mapeodispensador SET numerodigitos = $array[6], formatodinero = $array[7], formatovolumen = $array[8], formatoprecio = $array[9], ppux10 = $array[36] WHERE pk_idposicion = $array[3]";
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
            
            case b3:
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
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $sql = "UPDATE estado SET pos1 = 17";
                $result= pg_query($sql) ;
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
                $query = "UPDATE venta_canasta SET nombre = '$resultado', valor ='$resulvalor', cantidad = '$cantidad' WHERE id_canasta= (SELECT MAX(id_canasta) FROM venta_canasta) ";
                $result2= pg_query($query);
                
                $ar =array(78,83,88,$array[3],228,3);
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
                pg_free_result($result2);                
                pg_close($dbconn); // Cerrando la conexión 
            break;
            
             case b5:
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $sql    = "SELECT COUNT(*) FROM venta_canasta WHERE nombre !='Cod no tiene precio';";
                $result = pg_query($sql);
                $row    = pg_fetch_row($result);
                $ar = array(78,83,88,$array[3],229);
                $ar[] = $row[0];
                
                for($x=0; $x<$row[0];$x++){
                    $consulta = "SELECT serial,cantidadvendida FROM venta_canasta WHERE id_canasta = ($row[0]-$x)";
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
            
            case b6:
                if($array[5]==3){
                    $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                    or die('Can not connect: ' . \pg_last_error());
                    $sql = "UPDATE estado SET pos1 = 22";
                    $query = "DELETE FROM venta_canasta";
                    $result= pg_query($sql) ;
                    $resultado = pg_query($query);
                }
                if (!$result) {
                    $ACK = 4;  
                }else{
                    $ACK = 3;
                }
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
            
            case b7:
                $ar = array(78,83,88,$array[3],231);
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $sql    = "SELECT valorconsignacion FROM consignaciones";
                $result = pg_query($sql) ;
                $row    = pg_fetch_row($result);
                $consignacion = sprintf("%-8s",$row[0]);
                $subar = str_split($consignacion);
                foreach ($subar as &$valor) {
                      $valor = bin2hex($valor);
                }
                unset($valor);
                $array  = array_merge_recursive($ar,$subar);
                $ar = $array;
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
            
            case b8:
                $id    = substr($input,5);
                $idnsx = substr($id,0,-1);
                echo "Entrada: $input\n";
                echo "Venta NSX: $idnsx\n";
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
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
                        $recupera  = 1;
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
                        $recupera  = 0;
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
            
            case b9:
                $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
                or die('Can not connect: ' . \pg_last_error());
                $consecutivo1 = "select max(pk_idventa) from venta where idposicion = 1";
                $consecutivo2 = "select max(pk_idventa) from venta where idposicion = 2";
                $beaglep     = substr($input,5,9);
                $beagleimp   = substr($input,14,9);
                echo "ENTRADA TRAMA: $input\n";
                echo "Consecutivo par: $beaglep\n";
                echo "Consecutivo impar: $beagleimp\n";
                $nbotones    = substr($input,23,3);
                echo "Cantidad Botones : $nbotones\n";
                $botones     = substr($input,26,($nbotones*8));
                $chunk_boton = chunk_split($botones,8, "~");
                $array_btn   = explode("~",$chunk_boton);
                
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
                $length      = strlen($input);
                
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
                $data_pie        .= "UPDATE configuraciondispensador SET (nombre,descripcion,valor,activa) = ('Pie','Pie','$footer3','1') WHERE pk_idconfiguraciondispen=11;";
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
        }        
    }else{
        $conexion = false;
    }
    }
        
}
