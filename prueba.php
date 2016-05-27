<?php
error_reporting(~E_NOTICE);
set_time_limit (0); 
$address = "0.0.0.0";
$port = 1002;

while(true){ //iniciamos un bucle infinito para que siempre escuche en el puerto
    if(!($sock = socket_create(AF_INET, SOCK_STREAM, 0))){
        $errorcode = socket_last_error();
        $errormsg = socket_strerror($errorcode);     
        die("No se puede crear el socket: [$errorcode] $errormsg \n");
    }
    echo "Socket creado \n";
    if (!socket_set_option($sock, SOL_SOCKET, SO_REUSEADDR, 1)){
        echo socket_strerror(socket_last_error($sock));
        exit;
    } 
    if( !socket_bind($sock, $address , $port) ){
        $errorcode = socket_last_error();
        $errormsg = socket_strerror($errorcode);     
        die("No se puede atar el socket : [$errorcode] $errormsg \n");
    }
    echo "Socket bind OK \n";
    if(!socket_listen ($sock , 10)){
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
    $client =  socket_accept($sock);
    if (socket_accept($sock)!= 0){          
        if(socket_getpeername($client , $address , $port)){
            echo "El cliente $address : $port está conectado. \n";
        }
        $conexion = 1;
    }else{
        $conexion = 0;
    }
    while ($conexion == 1){
        $dbconn = pg_connect("host=localhost dbname=nsx user=db_admin password='12345'")
        or die('Can not connect: ' . \pg_last_error());
        $query = "SELECT  estado, esado2 FROM estado";
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
        }
        } 
    
    }
    

    socket_close($sock);//se cierra el socket de lo contrario no podrán 
} 
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

