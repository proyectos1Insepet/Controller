/*
*********************************************************************************************************
*                                           MUX CODE
*
*                             (c) Copyright 2015; Sistemas Insepet LTDA
*
*               All rights reserved.  Protected by international copyright laws.
*               Knowledge of the source code may NOT be used to develop a similar product.
*               Please help us continue to provide the Embedded community with the finest
*               software available.  Your honesty is greatly appreciated.
*********************************************************************************************************
*/
/*
*********************************************************************************************************
*                                             INCLUDE LIB
*********************************************************************************************************
*/


var sprintf         = require("sprintf").sprintf;
var sp              = require("serialport");
var pg              = require('pg');
/*
*********************************************************************************************************
*                                    DECLARACION DE VARIABLES
*********************************************************************************************************
*/
var port_mux          = '/dev/ttyO4';
var config_port_mux   = {baudrate: 115200, parser: sp.parsers.readline("*")};//9600
var muxport           = new sp.SerialPort(port_mux,config_port_mux,abrir);

     
var conString         = "postgrest://db_admin:12345@localhost:5432/nsx";
/*****************Variables para el flujo***************************/

//variables globales
var x;
var accountant;
var accountant_2;
var identifier;
//1 filtro para saber que tipo de informacion llega #DEFINICIONES
var type_of_reception;

var STATE_STATE=1,STATE_SALESORDER=2,STATE_DISCRIMINATESALE=3,STATE_DISCRIMINATEVALUE=4,STATE_CREDITBASKET=6,STATE__PROD_IDENTI_BASKET=7,
    STATE_SALESORDERBASKE=8,STATE_APPROPRIATIONS=9,STATE_TURN=85,STATE_HANDLEUP=97;
var SALESORDER_STATE=10,SALESODER_SALESORDER=11,SALESORDER_DISCRIMINATESALE=12,SALESORDER_DISCRIMINATEVALUE=13,SALESORDER_CREDITBASKET=14,
    SALESORDER__PROD_IDENTI_BASKET=15,SALESORDER_SALESORDERBASKE=16,SALESORDER_APPROPRIATIONS=17,STATE_PRINTERSETUP=18,
    SALESORDER_PRINTERSETUP=19,SALESORDER_HANDLEUP=98;
var DISCRIMINATESALE_STATE=20,DISCRIMINATESALE_SALESORDER=21,DISCRIMINATESALE_DISCRIMINATESALE=22,DISCRIMINATESALE_DISCRIMINATEVALUE=23,
    DISCRIMINATESALE_CREDITBASKET=24,DISCRIMINATESALE__PROD_IDENTI_BASKET=25,DISCRIMINATESALE_SALESORDERBASKE=26,
    DISCRIMINATESALE_APPROPRIATIONS=27,DISCRIMINATESALE_PRINTERSETUP=28,DISCRIMINATESALE_HANDLEUP=99;
var DISCRIMINATEDVALUE_STATE=29,DISCRIMINATEDVALUE_SALESORDER=30,DISCRIMINATEDVALUE_DISCRIMINATESALE=31,
    DISCRIMINATEDVALUE_DISCRIMINATEDVALUE=32,DISCRIMINATEDVALUE_CREDITBASKET=33,DISCRIMINATEDVALUE__PROD_IDENTI_BASKET=34,
    DISCRIMINATEDVALUE_SALESORDERBASKE=35,DISCRIMINATEDVALUE_APPROPRIATIONS=36,DISCRIMINATEDVALUE_PRINTERSETUP=37,
    DISCRIMINATEDVALUE_HANDLEUP=114;
var CREDITBASKET_STATE=38,CREDITBASKET_SALESORDER=39,CREDITBASKET_DISCRIMINATESALE=40,CREDITBASKET_DISCRIMINATEDVALUE=41,
    CREDITBASKET_CREDITBASKET=42,CREDITBASKET__PROD_IDENTI_BASKET=43,CREDITBASKET_SALESORDERBASKE=44,CREDITBASKET_APPROPRIATIONS=45,
    CREDITBASKET_PRINTERSETUP=46,CREDITBASKET_HANDLEUP=115;
var PROD_IDENTI_BASKET__STATE=47,PROD_IDENTI_BASKET__SALESORDER=48,PROD_IDENTI_BASKET__DISCRIMINATESALE=49,
    PROD_IDENTI_BASKET__DISCRIMINATEDVALUE=50,PROD_IDENTI_BASKET__CREDITBASKET=51,PROD_IDENTI_BASKET__PROD_IDENTI_BASKET=52,
    PROD_IDENTI_BASKET__SALESORDERBASKE=53,PROD_IDENTI_BASKET__APPROPRIATIONS=54,PROD_IDENTI_BASKET__PRINTERSETUP=55,
    PROD_IDENTI_BASKET__HANDLEUP=116;
var TOTAL_ELECTRONIC_TOTAL_ELECTRONIC=56;
var SALESORDERBASKET_STATE=57,SALESORDERBASKET_SALESORDER=58,SALESORDERBASKET_DISCRIMINATESALE=59,SALESORDERBASKET_DISCRIMINATEDVALUE=60,
    SALESORDERBASKET_CREDITBASKET=61,SALESORDERBASKET__PROD_IDENTI_BASKET=62,SALESORDERBASKET_SALESORDERBASKE=63,
    SALESORDERBASKET__APPROPRIATIONS=64,SALESORDERBASKET_PRINTERSETUP=65,SALESORDERBASKET_HANDLEUP=117;
var APPROPRIATIONS_STATE=66,APPROPRIATIONS_SALESORDER=67,APPROPRIATIONS_DISCRIMINATESALE=68,APPROPRIATIONS_DISCRIMINATEDVALUE=69,
    APPROPRIATIONS_CREDITBASKET=70,APPROPRIATIONS__PROD_IDENTI_BASKET=71,APPROPRIATIONS_SALESORDERBASKE=72,APPROPRIATIONS_APPROPRIATIONS=73,
    APPROPRIATIONS_PRINTERSETUP=74,APPROPRIATIONS_HANDLEUP=118;
var PRINTERSETUP_STATE=75,PRINTERSETUP_SALESORDER=76,PRINTERSETUP_DISCRIMINATESALE=77,PRINTERSETUP_DISCRIMINATEDVALUE=78,                    
    PRINTERSETUP_CREDITBASKET=79,PRINTERSETUP__PROD_IDENTI_BASKET=80,PRINTERSETUP_SALESORDERBASKE=81,PRINTERSETUP_APPROPRIATIONS=82,
    PRINTERSETUP_PRINTERSETUP=83,PRINTERSETUP_HANDLEUP=119;
var TURN_STATE=84;
var HANDLEUP_STATE=86,HANDLEUP_SALESORDER=87,HANDLEUP_DISCRIMINATESALE=88,HANDLEUP_DISCRIMINATEDVALUE=89,HANDLEUP_CREDITBASKET=90,
    HANDLEUP__PROD_IDENTI_BASKET=91,HANDLEUP_SALESORDERBASKE=92,HANDLEUP_APPROPRIATIONS=94,HANDLEUP_PRINTERSETUP=95,HANDLEUP_HANDLEUP=96;

//120 SIGUE


var RESET_RESET=5;
//2 filtro para saber en que caso se recoge la informacion
var type_of_reception_2;
var X_STATE=100;
var X_SALESORDER=102;
var X_DISCRIMINATESALE=103;
var X_DISCRIMINATEDVALUE=104;
var X_CREDITBASKET=106;
var X_TOTAL_ELECTRONIC=107;
var X_PROD_IDENTI_BASKET=108;
var X_SALESORDERBASKE=109;
var X_APPROPRIATIONS=110;
var X_PRINTERSETUP=111;
var X_TURN=112;
var X_HANDLEUP=113;


var next_position;//var next_position=9;
var dataOK;

//variables del surtidor trama1
var frame_1 = {
    //fin_venta - estado - credito_canasta
    supplier_position:0,
    state:0,
    type_sale:0,
    preset_type:0,
    preset_value            : new Buffer(8),
    selected_product:0,
    date_hour               : new Buffer(14),
    total_previous_volume   : new Buffer(13),
    total_money_previous    : new Buffer(13),
    previous_PPU            : new Buffer(6),
    volume_sold             : new Buffer(8),
    money_selling           : new Buffer(8),
    PPU_sold                : new Buffer(6),
    type_of_product_sold:0,
    license_plate           : new Buffer(10),
    mileage                 : new Buffer(10),
    identity_card           : new Buffer(10),
    date_Time_sale          : new Buffer(14),
    type_of_vehicle:0,
    type_of_customer_identification:0,
    customer_identification : new Buffer(20), 
    islero_typeid:0,
    isleroid                : new Buffer(20),
    totalvolumeback         : new Buffer(13),    
    totalmoneyback          : new Buffer(13),     
    totalbackPPU            : new Buffer(6),      
    memoria_part1:0,
    plot_number:0,
    reset_good:0,  
    //DISCRIMINAR FORMA DE PAGO(#venta)
    sales_number            : new Buffer(8),
    type_of_payment         : new Buffer(2),
    consultation_sale:0, 
    //Valor discriminado
    discrim_value           : new Buffer(8),
    serial_id               : new Buffer(20),
    //identificacion producto canasta    
    serial_product          : new Buffer(20),
    //Totales electronicos
    total_volume_P1l1       : new Buffer(13),
    total_money_P1l1        : new Buffer(13),
    ppu_P1l1                : new Buffer(6),
    total_volume_P2l1       : new Buffer(13),            
    total_money_P2l1        : new Buffer(13),            
    ppu_P2l1                : new Buffer(6),            
    total_volume_P3l1       : new Buffer(13),            
    total_money_P3l1        : new Buffer(13),            
    ppu_P3l1                : new Buffer(6),            
    total_volume_P4l1       : new Buffer(13),            
    total_money_P4l1        : new Buffer(13),            
    ppu_P4l1                : new Buffer(6),            
    total_volume_P1l2       : new Buffer(13),
    total_money_P1l2        : new Buffer(13),
    ppu_P1l2                : new Buffer(6),
    total_volume_P2l2       : new Buffer(13),     
    total_money_P2l2        : new Buffer(13),           
    ppu_P2l2                : new Buffer(6),            
    total_volume_P3l2       : new Buffer(13),           
    total_money_P3l2        : new Buffer(13),            
    ppu_P3l2                : new Buffer(6),            
    total_volume_P4l2       : new Buffer(13),            
    total_money_P4l2        : new Buffer(13),            
    ppu_P4l2                : new Buffer(6),   
    //fin venta canasta
    serialP1                : new Buffer(20),
    quantityP1              : new Buffer(3),
    total_valueP1           : new Buffer(8),       
    serialP2                : new Buffer(20),
    quantityP2              : new Buffer(3),
    total_valueP2           : new Buffer(8),
    serialP3                : new Buffer(20),
    quantityP3              : new Buffer(3),
    total_valueP3           : new Buffer(8),
    sellout_basket          : new Buffer(9),
    //consignaciones
    consignmentvalue        : new Buffer(10),
    //configuracion impresoras
    printer1:0,
    printer2:0,
    //Turnos
    openclose_turn:0,
    type_of_vendor_ID:0,
    serial_seller           : new Buffer(20),
    password                : new Buffer(4),
    product_type:0
};

var Frame_1ready='3'; //signifca que la trama1 que se envio al mux llego bien

//variables del surtidor trama2
var frame_2 = {
    supplier_position:0,
    state:0,
    type_sale:0,
    preset_type:0,
    preset_value            : new Buffer(8),
    selected_product:0,
    date_hour               : new Buffer(14),
    total_previous_volume   : new Buffer(13),
    total_money_previous    : new Buffer(13),
    previous_PPU            : new Buffer(6),
    volume_sold             : new Buffer(8),
    money_selling           : new Buffer(8),
    PPU_sold                : new Buffer(6),
    type_of_product_sold:0,
    license_plate           : new Buffer(10),
    mileage                 : new Buffer(10),
    identity_card           : new Buffer(10),
    date_Time_sale          : new Buffer(14),
    type_of_vehicle:0,
    type_of_customer_identification:0,
    customer_identification : new Buffer(20),  
    islero_typeid:0,    
    isleroid                : new Buffer(20),
    totalvolumeback         : new Buffer(13),    
    totalmoneyback          : new Buffer(13),     
    totalbackPPU            : new Buffer(6),        
    memoria_part:0,
    plot_number:0,
    reset_good:0, 
    //DISCRIMINAR FORMA DE PAGO(#venta)
    sales_number            : new Buffer(8),
    type_of_payment         : new Buffer(2),
    consultation_sale:0,
    //Valor discriminado
    discrim_value           : new Buffer(8),
    serial_id               : new Buffer(20),
    //identificacion producto canasta
    serial_product          : new Buffer(20),
    //Totales electronicos
    total_volume_P1l1       : new Buffer(13),
    total_money_P1l1        : new Buffer(13),
    ppu_P1l1                : new Buffer(6),
    total_volume_P2l1       : new Buffer(13),            
    total_money_P2l1        : new Buffer(13),            
    ppu_P2l1                : new Buffer(6),            
    total_volume_P3l1       : new Buffer(13),            
    total_money_P3l1        : new Buffer(13),            
    ppu_P3l1                : new Buffer(6),            
    total_volume_P4l1       : new Buffer(13),            
    total_money_P4l1        : new Buffer(13),            
    ppu_P4l1                : new Buffer(6),            
    total_volume_P1l2       : new Buffer(13),
    total_money_P1l2        : new Buffer(13),
    ppu_P1l2                : new Buffer(6),
    total_volume_P2l2       : new Buffer(13),     
    total_money_P2l2        : new Buffer(13),           
    ppu_P2l2                : new Buffer(6),            
    total_volume_P3l2       : new Buffer(13),           
    total_money_P3l2        : new Buffer(13),            
    ppu_P3l2                : new Buffer(6),            
    total_volume_P4l2       : new Buffer(13),            
    total_money_P4l2        : new Buffer(13),            
    ppu_P4l2                : new Buffer(6),
    //fin venta canasta
    serialP1                : new Buffer(20),
    quantityP1              : new Buffer(3),
    total_valueP1           : new Buffer(8),       
    serialP2                : new Buffer(20),
    quantityP2              : new Buffer(3),
    total_valueP2           : new Buffer(8),
    serialP3                : new Buffer(20),
    quantityP3              : new Buffer(3),
    total_valueP3           : new Buffer(8),
    sellout_basket          : new Buffer(9),
    //consignaciones
    consignmentvalue        : new Buffer(10),
    //configuracion impresoras
    printer1:0,
    printer2:0,
    //Turnos
    openclose_turn:0,
    type_of_vendor_ID:0,
    serial_seller           : new Buffer(20),
    password                : new Buffer(4),    
    product_type:0    
};

var Frame_2ready='5';//signifca que la trama que se envio al mux llego bien
var L1_request,L2_request;//guarda en Ascci la posicion qeu solicita una tarea al mux

var FVenta1='1',FVenta2='1',terminototales='0';//variables que me  permiten solicitar totales electronicos una vez terminado los fin venta de las dos posiciones

/*
*********************************************************************************************************
*                                    TOMA DE DATOS PARA RECIBOS
*********************************************************************************************************
*/

/*
*********************************************************************************************************
*                                    function abrir(error)
*
* Description : Abre el puerto serial para la comunicacion con el mux
*               
*********************************************************************************************************
*/
function abrir(error){
   if (error){
       ////('failed to open: '+error);
   } else{
       //corte_ok=0;
       //b_enviada = 'TRUE';
       console.log('open '+port_mux);
       muxport.on('data',rx_data_mux);
       
       //reinicio();
   }
}
/*
*********************************************************************************************************
*                                    abrir_print(error)(error)
*
* Description : Abre el puerto serial para la comunicacion con la impresora
*               
*********************************************************************************************************
*/
function abrir_print(error){
   if (error){
       //('failed to open: '+error);
   } else{
       console.log('open '+port_print);
       
   }
}



/*
*********************************************************************************************************
*                                function rx_data_mux(data)
*
* Description : Se activa cada vez que llega una trama valida del mux y ejecuta el caso segun el comando
*               
*********************************************************************************************************
*/

function rx_data_mux(data){
    
    if((data[0]==='B') && (data[1]==='G') && (data[2]==='E')){                  //encabezado
        ////('>>'+data);
        ////('>>'+data.length);
     
        accountant=0;        
        for(x=0;x<=data.length;x++){
            accountant++;               
            if (data[x]=='&') {                                                 //separador de posiciones segun protocolo
                ////('>>'+accountant); 
                break;
            }
        }
        accountant_2=0;
        for(x=accountant;x<=data.length;x++){
            accountant_2++;             
            if (data[x]=='&') {                                    
                ////('>>'+accountant_2); 
                break;
            }
        }    
        number_process_rxmux(accountant,accountant_2,identifier=data[4]);   
        
        //se le informa al BBB2 que la comunicacion entre mux y bbb esta activa
        pg.connect(conString, function(err, client, done){//se escribe un uno en la tabla estado para verificar que el programa corre
            if(err){
                return console.error('Error de conexion 1', err);
            }else{
                client.query(sprintf("UPDATE estado SET led = '%1$s' ",1),function(err,result){
                    done();
                    if(err){
                        return console.error('Error de conexion', err);
                    }else{
                        ////('___________________________');      
                        ////('>>Estado del BGE: Vivo');     
                        ////('___________________________');                 
                    }
                });
            }
        });   
                         
        switch (identifier) {   //identificador
            case 'a':     
                //Estado del mux
                ////('___estadoL1___');
                frame_1.supplier_position=data[3];  //posicion surtidor 
                positionOne=data[3];
                frame_1.state = data.charCodeAt(6); //estado
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",frame_1.state),function(err,result){
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });
                ////('>>Posicion surtidorL1:'+frame_1.supplier_position); 
                switch (frame_1.state) {
                    case 0x10:
                        //('>>EstadoL1: Error');                
                    break;
                    case 0x16:
                        pg.connect(conString, function(err, client, done){ 
                            if(err){
                                return console.error('error de conexion 1', err);                                
                            }else{
                                //reseteo la variable que me permite leer una venta canasta                                
                                client.query(sprintf("UPDATE venta_canasta SET lecturacanasta='%1$s' WHERE idposicionc=1" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                                    done();
                                        if(err){
                                    	    return console.error('error de conexion 2', err);                            
                                        }else{
                                        } 
                                });
                                //se le informa al BBB2 que la comunicacion entre mux y bbb esta activa
                                client.query(sprintf("UPDATE estado SET led = '%1$s' ",1),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                        ////('___________________________');      
                                        ////('>>Estado del BGE: Vivo');     
                                        ////('___________________________');                 
                                    }
                                });     
                                client.query(sprintf("UPDATE preset SET lecturacupocredito='%1$s' WHERE id_pos=1" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                                    done();
                                    if(err){
                                        return console.error('error de conexion 2', err);                            
                                    }else{
                                    } 
                                });                                
                                //estado de espera para php
                                client.query("UPDATE estado SET pos1=22", function(err,result){//era 1 hasta el 04/08/2016
                                    done();
                                    if(err){
                                    	return console.error('error de conexion 2', err);                            
                                    }else{
                                    } 
                                });
                            }
                        });                         
                        basketEnablesReadingL1=0;
                        creditEnablesReadingL1=0;                        
                        ////('>>EstadoL1: Espera');
                    break;
                    case 0x19:
                        ////('>>EstadoL1: Surtiendo');                
                    break;
                    case 0x22:
                        ////('>>EstadoL1: Esperando respuesta a peticion venta seleccionada Forma de pago');                
                    break;
                    case 0x23:
                        ////('>>EstadoL1: Espera transaccion forma de pago');                
                    break;
                    case 0x27:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",5),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });                        
                        ////('>>EstadoL1: Esperando respuesta a peticion Identificacion usuario credito');                
                    break;
                    case 0x28:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",5),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });                             
                        ////('>>EstadoL1: Espera transaccion credito');                
                    break;
                    case 0x29:
                        ////('>>EstadoL1: Esperando respuesta a peticion Calibracion');                
                    break;
                    case 0x32:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",16),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });                        
                        ////('>>EstadoL1: Esperando respuesta a peticion Identificacion producto cansata');                
                    break;
                    case 0x34:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",9),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });                          
                        ////('>>EstadoL1: Recibo de impresion');
                    break;   
                    case 0x36:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",19),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });
                        ////('>>EstadoL1: Esperando respuesta a Peticion consignacion');                
                    break;
                    case 0x39:
                        //reseteo la variable que me permite leer una venta canasta
                        pg.connect(conString, function(err, client, done){ 
                            if(err){
                                return console.error('error de conexion 1', err);                                
                            }else{
                                client.query(sprintf("UPDATE venta_canasta SET lecturacanasta='%1$s' WHERE idposicionc=1" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                                done();
                                    if(err){
                                    	return console.error('error de conexion 2', err);                            
                                    }else{
                                    } 
                                });
                                client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",17),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });                                
                            }
                        });                         
                        basketEnablesReadingL1=0;                        
                        ////('>>EstadoL1: Entra a menu de canasta');                        
                    break;
                    case 0x40:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",6),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });
                        ////('>>EstadoL1: Pendiente datos turno');                
                    break;    
                    case 0x42:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",8),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });                        
                        ////('>>EstadoL1: Espera de respuesta a peticion turno Apertura o Cierre');                             
                    break;    
                    case 0x1b:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",10),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });                        
                        ////('>>EstadoL1: Fin Venta en cero');                          
                    break;    
                    default:
                }
                frame_1.plot_number=0;
                dataOK=false;
                if(type_of_reception!=STATE_STATE){
                    frame_1.plot_number='a';
                    dataOK=true;  
                }
                number_process2_rxmux(type_of_reception);
                next_position=9;
                frame_1.memoria_part=1;
                
                if(frame_1.state==0x34 || frame_1.state==0x1b){//caso para impresion o finventa cero
                    frame_1.plot_number='2';
                    dataOK=true;                     
                }
            break;
            case 'b':                                                           //Fin venta
                FVenta1='1';
                ////('___finventaL1___');
                frame_1.supplier_position=data[3];  //posicion surtidor                
                var L1supplier_positionD=data.charCodeAt(3);   //posicion surtidor                
                ////('>>Posicion surtidor:'+frame_1.supplier_position);
                for(x=0;x<=3;x++){
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{
                            client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",4),function(err,result){
                                done();
                                if(err){
                                    return console.error('Error de conexion', err);
                                }else{
                                }
                            });
                        }
                    });            
                }
                frame_1.type_sale=data[6];      //tipo de venta
                ////('>>Tipo de venta:'+frame_1.type_sale);                  
                frame_1.preset_type=data[8];    //tipo de preset seleccionado
                ////('>>Tipo de preset:'+frame_1.preset_type);                  
                for(x=0;x<=7;x++){  //valor preset digitado
                    frame_1.preset_value[x]=data.charCodeAt(x+10);    
                }
                ////('>>Valor del preset:'+frame_1.preset_value);                 
                frame_1.selected_product=data[19]; //tipo de producto seleccionado
                ////('>>Producto seleccionado:'+frame_1.selected_product); 
                for(x=0;x<=13;x++){     //fecha hora sube manija
                    frame_1.date_hour[x]=data.charCodeAt(x+21);     
                }   
                ////('>>Fecha hora s.m:'+frame_1.date_hour);  
                for(x=0;x<=12;x++){     //total volumen anterior
                    frame_1.total_previous_volume[x]=data.charCodeAt(x+36);   
                    if(frame_1.total_previous_volume[x]===44){
                        frame_1.total_previous_volume[x]=46;
                    }                       
                } 
                ////('>>TotaL vol anterior:'+frame_1.total_previous_volume); 
                for(x=0;x<=12;x++){     //total dinero anterior
                    frame_1.total_money_previous[x]=data.charCodeAt(x+50);     
                }
                ////('>>TotaL din anterior:'+frame_1.total_money_previous);   
                for(x=0;x<=5;x++){  //total ppu anterior
                    frame_1.previous_PPU[x]=data.charCodeAt(x+64);     
                } 
                ////('>>TotaL ppu anterior:'+frame_1.previous_PPU);
                for(x=0;x<=7;x++){  //volumen vendido
                    frame_1.volume_sold[x]=data.charCodeAt(x+71);
                    if(frame_1.volume_sold[x]===44){
                        frame_1.volume_sold[x]=46;
                    }                    
                }   
                ////('>>Volumen vendido:'+frame_1.volume_sold); 
                for(x=0;x<=7;x++){  //dinero vendido
                    frame_1.money_selling[x]=data.charCodeAt(x+80);     
                }
                ////('>>Dinero vendido:'+frame_1.money_selling);   
                for(x=0;x<=5;x++){      //ppu vendido
                    frame_1.PPU_sold[x]=data.charCodeAt(x+89);     
                }      
                ////('>>Ppu vendido:'+frame_1.PPU_sold);            
                frame_1.type_of_product_sold=data[96];  //tipo de producto vendido
                ////('>>Tipo producto ven:'+frame_1.type_of_product_sold);   
                for(x=0;x<=9;x++){  //placa
                    frame_1.license_plate[x]=data.charCodeAt(x+98);     
                }  
                ////('>>Placa:'+frame_1.license_plate);
                for(x=0;x<=9;x++){  //kilometraje
                    frame_1.mileage[x]=data.charCodeAt(x+109);     
                }  
                ////('>>Kilometraje:'+frame_1.mileage);    
                for(x=0;x<=9;x++){  //cedula
                    frame_1.identity_card[x]=data.charCodeAt(x+120);     
                } 
                ////('>>Cedula:'+frame_1.identity_card);   
                for(x=0;x<=13;x++){     //fecha/hora fin de venta
                    frame_1.date_Time_sale[x]=data.charCodeAt(x+131);     
                } 
                ////('>>Fecha/hora fin venta:'+frame_1.date_Time_sale);
                frame_1.type_of_vehicle=data[146];  //tipo de vehiculo
                ////('>>Tipo de vehiculo:'+frame_1.type_of_vehicle); 
                frame_1.type_of_customer_identification=data[148];  //tipo de identificacion cliente
                ////('>>Tipo de identificacion cliente:'+frame_1.type_of_customer_identification);                
                for(x=0;x<=19;x++){     //identificacion cliente  
                    frame_1.customer_identification[x]=data.charCodeAt(x+150);     
                } 
                ////('>>Identificacion cliente:'+frame_1.customer_identification); 
                frame_1.islero_typeid=data[171];  //tipo de identificacion islero
                ////('>>Tipo de identificacion islero:'+frame_1.islero_typeid);                 
                for(x=0;x<=19;x++){     //identificacion islero  
                    frame_1.isleroid[x]=data.charCodeAt(x+173);     
                } 
                ////('>>Identificacion islero:'+frame_1.isleroid);     
                for(x=0;x<=12;x++){     //total volumen posterior
                    frame_1.totalvolumeback[x]=data.charCodeAt(x+194);  
                    if(frame_1.totalvolumeback[x]===44){
                        frame_1.totalvolumeback[x]=46;
                    }                        
                } 
                ////('>>Total volumen posterior:'+frame_1.totalvolumeback);  
                for(x=0;x<=12;x++){     //total dinero posterior
                    frame_1.totalmoneyback[x]=data.charCodeAt(x+208);     
                } 
                ////('>>Total dinero posterior:'+frame_1.totalmoneyback);                
                for(x=0;x<=4;x++){     //total ppu posterior ////dato original x<=5
                    frame_1.totalbackPPU[x]=data.charCodeAt(x+223);//222  //se paso a leer solo 5 de 6 datos  
                } 
                ////('>>Total ppu posterior:'+frame_1.totalbackPPU);  
                number_process2_rxmux(type_of_reception); 
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var idposicion      = L1supplier_positionD;
                        var cantidadtotal   = parseFloat(frame_1.volume_sold);
                        var valortotal      = parseFloat(frame_1.money_selling);
                        var volumeninicial  = parseFloat(frame_1.total_previous_volume);
                        var dineroinicial   = parseFloat(frame_1.total_money_previous);
                        var dinerofinal     = parseFloat(frame_1.totalmoneyback);
                        var valorprogramado = parseFloat(frame_1.preset_value); 
                        var volumenfinal    = parseFloat(frame_1.totalvolumeback);
                        var ppu             = parseFloat(frame_1.totalbackPPU);
                        var grado           = frame_1.selected_product; 
                        var nombreefectivo  = parseInt(frame_1.identity_card,10);
                        var kilometrajecliente = frame_1.mileage;
                        var placaefectivo   = frame_1.license_plate;
                        var tipovehiculo    = parseFloat(frame_1.type_of_vehicle);
                        var tipopreset      = frame_1.preset_type;
                        ////(new Date());
                        client.query(sprintf("INSERT INTO venta (fechainicial,fechafinal,cantidadtotal,valortotal,volumeninicial,volumenfinal,dineroinicial,dinerofinal,valorprogramado,ppu,grado,nombreefectivo,kilometrajecliente,placaefectivo,tipovehiculo,tipopreset,idposicion) VALUES (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP, '%1$f','%2$f','%3$s','%4$f','%5$f','%6$s','%7$s','%8$s','%9$s','%10$s','%11$s','%12$s','%13$s','%14$s','%15$s')",cantidadtotal,valortotal,volumeninicial,volumenfinal,dineroinicial,dinerofinal,valorprogramado,ppu,grado,nombreefectivo,kilometrajecliente,placaefectivo,tipovehiculo,tipopreset,1),function(err,result){                        
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });                  
                next_position=230;                    
                frame_1.plot_number='2';                
                dataOK=true;                
                frame_1.memoria_part=2;
                FVenta1='0';
                terminototales='1';                
            break;
            case 'd':                                                           //DISCRIMINAR FORMA DE PAGO(#venta) 
                ////('___discriminarformadepagoventaL1___');
                frame_1.supplier_position=data[3];  //posicion surtidor
                L1_request=data.charCodeAt(3);   //posicion surtidor   
                ////('>>Posicion surtidor:'+frame_1.supplier_position);       
                for(x=0;x<=7;x++){          //numero de venta
                    frame_1.sales_number[x]=data.charCodeAt(x+6);     
                } 
                ////('>>Numero de venta:'+frame_1.sales_number);
                for(x=0;x<=1;x++){  //tipo de forma de pago
                    frame_1.type_of_payment[x]=data.charCodeAt(x+15);     
                } 
                ////('>>Tipo de forma de pago:'+frame_1.type_of_payment); 
                frame_1.consultation_sale=data[18];     //venta consulta
                ////('>>Venta consulta:'+frame_1.consultation_sale);
                number_process2_rxmux(type_of_reception); 
                //var idpos           = L1supplier_positionD;
                //var numeroventa     = frame_1.sales_number;
                //var tipoformadepago = frame_1.type_of_payment;
                //var ventaconsulta   = frame_1.consultation_sale;
                //pg.connect(conString, function(err, client, done){
                //    if(err){
				//		return console.error('error de conexion 1', err);                                
                //    }else{
                //        client.query(sprintf("UPDATE formadepago SET numeroventa='%2$s', tipoformadepago='%3$s', ventaconsulta='%4$s' where id_pos= '%1$s'   " ,1,numeroventa,tipoformadepago,ventaconsulta ), function(err,result){
                //            done();
                //            if(err){
				//				return console.error('error de conexion 2', err);                            
                //            }else{
                //            } 
                //        });       
                //    }
                //});                 
                TableNumber=responseto_requestpayment_tableL1;                   
                next_position=21;
                frame_1.plot_number='2';                
                dataOK=true;                
                frame_1.memoria_part=2;     
            break;
            case 'e':                                                           //VALOR_DISCRIMINADO
                ////('___valordiscriminadoL1___');
                frame_1.supplier_position=data[3];  //posicion surtidor
                L1_request=data.charCodeAt(3);   //posicion surtidor                
                ////('>>Posicion surtidor:'+frame_1.supplier_position);              
                for(x=0;x<=7;x++){          //numero de venta
                    frame_1.sales_number[x]=data.charCodeAt(x+6);     
                } 
                ////('>>Numero de venta:'+frame_1.sales_number); 
                for(x=0;x<=1;x++){  //tipo de forma de pago
                    frame_1.type_of_payment[x]=data.charCodeAt(x+15);     
                } 
                ////('>>Tipo de forma de pago:'+frame_1.type_of_payment); 
                frame_1.consultation_sale=data[18];     //venta consulta
                ////('>>Venta consulta:'+frame_1.consultation_sale); 
                for(x=0;x<=7;x++){          //valor discriminado
                    frame_1.discrim_value[x]=data.charCodeAt(x+20);     
                } 
                ////('>>Valor discriminado:'+frame_1.discrim_value);                 
                for(x=0;x<=19;x++){          //serial id
                    frame_1.serial_id[x]=data.charCodeAt(x+29);     
                } 
                ////('>>Serial id:'+frame_1.serial_id);   
                number_process2_rxmux(type_of_reception);          
                TableNumber =discriminateSale_tableL1; 
                next_position=51;                
                frame_1.plot_number='2';                
                dataOK=true;                
                frame_1.memoria_part=2;      
            break;    
            case 'f':                                                           //CREDITO_CANASTA
                ////('___creditocanastaL1___');
                frame_1.supplier_position=data[3];  //posicion surtidor
                var L1supplier_positionD=data.charCodeAt(3);   //posicion surtidor  
                L1_request=data.charCodeAt(3);   //posicion surtidor                  
                ////('>>Posicion surtidor:'+frame_1.supplier_position);
                for(x=0;x<=9;x++){          //kilometraje
                    frame_1.mileage[x]=data.charCodeAt(x+6);     
                } 
                ////('>>Kilometraje:'+frame_1.mileage);
                frame_1.type_of_customer_identification=data[17];  //tipo de identificacion
                ////('>>Tipo de identificacion:'+frame_1.type_of_customer_identification);                
                for(x=0;x<=19;x++){         //serial identificacion
                    frame_1.serial_id[x]=data.charCodeAt(x+19);     
                } 
                ////('>>Serial ID:'+frame_1.serial_id);
                frame_1.type_sale =data[40];  //tipo venta
                ////('>>Tipo venta:'+frame_1.type_sale );   
                frame_1.product_type =data[42];  //tipo de producto
                ////('>>Tipo de Producto:'+frame_1.product_type);
                number_process2_rxmux(type_of_reception);                
                if (frame_1.product_type=='0'){
                    frame_1.product_type='1';
                }
                var idpos       = L1supplier_positionD;
                var kilometraje = frame_1.mileage;
                var serial      = frame_1.serial_id;
                var tipo_venta  = parseFloat(frame_1.type_sale);
                if(frame_1.product_type=='0'){
                   frame_1.product_type='1'; 
                }
                var grado       = frame_1.product_type;
                pg.connect(conString, function(err, client, done){
                    if(err){
						return console.error('error de conexion 1', err);                                
                    }else{
                        client.query(sprintf("UPDATE preset SET  kilometraje='%1$s', serial='%2$s', tipo_venta='%3$s', grado='%4$s' where id_pos = 1" ,kilometraje,serial,tipo_venta,grado ), function(err,result){
                            done();
                            if(err){
								return console.error('error de conexion 2', err);                            
                            }else{
                                ////("Grado tabla"+grado);
                            } 
                        });
                    }
                });
                Tablenumbercredit=creditbasket_tableL1;                 
                next_position=45;                
                frame_1.plot_number='2';                
                dataOK=true;                
                frame_1.memoria_part=2;                  
            break;   
            case 'g':                                                           //IDENTIFICACIONPRODUCTO_CANASTA
                ////('___identificacionproductocanastaL1___');
                frame_1.supplier_position=data[3];  //posicion surtidor
                L1_request=data.charCodeAt(3);   //posicion surtidor                  
                ////('>>Posicion surtidor:'+frame_1.supplier_position);                
                for(x=0;x<=19;x++){          //serial producto
                    frame_1.serial_product[x]=data.charCodeAt(x+6);     
                } 
                ////('>>Serial producto:'+frame_1.serial_product);                
                number_process2_rxmux(type_of_reception);
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var serial   = frame_1.serial_product;
                        client.query(sprintf("INSERT INTO venta_canasta (serial,idposicionc,lecturacanasta) VALUES ('%1$s','%2$s','%3$s')",serial,1,0),function(err,result){                        
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });                  
                TableNumber=basket_tableL1;
                next_position=28;                
                frame_1.plot_number='2';                
                dataOK=true;                
                frame_1.memoria_part=2; 
            break;            
            case 'h':                                                           //FINVENTACANASTA 
                ////('___finventacanastaL1___');
                frame_1.supplier_position=data[3];  //posicion surtidor
                ////('>>Posicion surtidor:'+frame_1.supplier_position);                 
                frame_1.type_sale=data[6];  //tipo de venta
                ////('>>Tipo de venta:'+frame_1.type_sale);                    
                for(x=0;x<=19;x++){          //serial producto1
                    frame_1.serialP1[x]=data.charCodeAt(x+8);     
                } 
                ////('>>Serial producto1:'+frame_1.serialP1);                 
                for(x=0;x<=2;x++){          //cantidad producto1
                    frame_1.quantityP1[x]=data.charCodeAt(x+29);     
                } 
                ////('>>Cantidad producto1:'+frame_1.quantityP1);                  
                for(x=0;x<=7;x++){          //valor total producto1
                    frame_1.total_valueP1[x]=data.charCodeAt(x+33);     
                } 
                ////('>>Valor total producto1:'+frame_1.total_valueP1);                 
                for(x=0;x<=19;x++){          //serial producto2
                    frame_1.serialP2[x]=data.charCodeAt(x+42);     
                } 
                ////('>>Serial producto2:'+frame_1.serialP2);                   
                for(x=0;x<=2;x++){          //cantidad producto2
                    frame_1.quantityP2[x]=data.charCodeAt(x+63);     
                } 
                ////('>>Cantidad producto2:'+frame_1.quantityP2);                 
                for(x=0;x<=7;x++){          //valor total producto2
                    frame_1.total_valueP2[x]=data.charCodeAt(x+67);     
                } 
                ////('>>Valor total producto2:'+frame_1.total_valueP2);                  
                for(x=0;x<=19;x++){          //serial producto3
                    frame_1.serialP3[x]=data.charCodeAt(x+76);     
                } 
                ////('>>Serial producto3:'+frame_1.serialP3);                 
                for(x=0;x<=2;x++){          //cantidad producto3
                    frame_1.quantityP3 [x]=data.charCodeAt(x+97);     
                } 
                ////('>>Cantidad producto3:'+frame_1.quantityP3 );                 
                for(x=0;x<=7;x++){          //valor total producto3
                    frame_1.total_valueP3[x]=data.charCodeAt(x+101);     
                } 
                ////('>>Valor total producto3:'+frame_1.total_valueP3);                 
                for(x=0;x<=8;x++){          //total venta canasta
                    frame_1.sellout_basket[x]=data.charCodeAt(x+110);     
                } 
                ////('>>Total venta canasta:'+frame_1.sellout_basket);                 
                for(x=0;x<=13;x++){          //fecha hora fin venta
                    frame_1.date_hour[x]=data.charCodeAt(x+120);     
                } 
                ////('>>Fecha hora fin venta:'+frame_1.date_hour);                 
                frame_1.type_of_customer_identification=data[135];  //tipo de identificacion
                ////('>>Tipo de identificacion:'+frame_1.type_of_customer_identification);                  
                for(x=0;x<=19;x++){          //identificacion cliente
                    frame_1.customer_identification[x]=data.charCodeAt(x+137);     
                } 
                ////('>>Identificacion cliente:'+frame_1.customer_identification); 
                frame_1.islero_typeid=data[158];  //tipo de identificacion islero
                ////('>>Tipo de identificacion islero:'+frame_1.islero_typeid);                  
                for(x=0;x<=19;x++){          //identificacion islero
                    frame_1.isleroid[x]=data.charCodeAt(x+160);     
                } 
                ////('>>Identificacion islero:'+frame_1.isleroid);
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var tipoventacanasta    = frame_1.type_sale;
                        var serial              = frame_1.serialP1;
                        var cantidadvendida     = frame_1.quantityP1;
                        var valormux            = frame_1.total_valueP1;
                        client.query(sprintf("INSERT INTO finventacanasta (tipoventacanasta,cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s','%6$s')",tipoventacanasta,cantidadvendida,valormux,1,1,serial),function(err,result){                        
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });                   
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var serial              = frame_1.serialP2;
                        var cantidadvendida     = frame_1.quantityP2;
                        var valormux            = frame_1.total_valueP2;
                        client.query(sprintf("INSERT INTO finventacanasta (cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",cantidadvendida,valormux,1,2,serial),function(err,result){                        
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });                
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var serial              = frame_1.serialP3;
                        var cantidadvendida     = frame_1.quantityP3;
                        var valormux            = frame_1.total_valueP3;
                        client.query(sprintf("INSERT INTO finventacanasta (cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",cantidadvendida,valormux,1,3,serial),function(err,result){                        
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });                            
                //estado de fin venta para diego
                for(x=0;x<=4;x++){
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{
                            client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",18),function(err,result){
                                done();
                                if(err){
                                    return console.error('Error de conexion', err);
                                }else{
                                }
                            });
                        }
                    });                               
                }            
                number_process2_rxmux(type_of_reception);
                next_position=182;//modificar                
                frame_1.plot_number='2';                
                dataOK=true;                
                frame_1.memoria_part=2;                 
            break;    
            case 'i':                                                           //CONSIGNACIONES
                ////('___consignacionesL1___');
                frame_1.supplier_position=data[3];  //posicion surtidor
                var L1supplier_positionD=data.charCodeAt(3);   //posicion surtidor  
                L1_request=data.charCodeAt(3);   //posicion surtidor                
                ////('>>Posicion surtidor:'+frame_1.supplier_position);                   
                for(x=0;x<=9;x++){          //valor consignacion
                    frame_1.consignmentvalue[x]=data.charCodeAt(x+6);     
                } 
                ////('>>Valor consignacion:'+frame_1.consignmentvalue);                   
                number_process2_rxmux(type_of_reception);
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var idpos               = frame_1.supplier_position;                         
                        var valorconsignacion   = frame_1.consignmentvalue;
                        client.query(sprintf("UPDATE consignaciones SET valorconsignacion = '%1$s',idpos = '%2$s' ",valorconsignacion,1),function(err,result){
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });
                Tablenumberconsign=consign_tableL1;               
                //TableNumber=consign_tableL1;                
                next_position=18;                
                frame_1.plot_number='2';                
                dataOK=true;                
                frame_1.memoria_part=2;   
            break;  
            case 'j':                                                           //CONFIGURACIONIMPRESORAS
                ////('___configuracionimpresorasL1___');
                frame_1.supplier_position=data[3];  //posicion surtidor
                ////('>>Posicion surtidor:'+frame_1.supplier_position);                   
                frame_1.printer1=data[6];  //impresora1
                ////('>>Impresora1:'+frame_1.printer1);  
                frame_1.printer2=data[8];  //impresora2
                ////('>>Impresora2:'+frame_1.printer2);
                number_process2_rxmux(type_of_reception);                
                next_position=11;                
                frame_1.plot_number='2';                
                dataOK=true;                
                frame_1.memoria_part=2;                   
            break;    
            case 'k':                                                           //TURNOS
                ////('___turnosL1___');
                frame_1.supplier_position=data[3];  //posicion surtidor
                ////('>>Posicion surtidor:'+frame_1.supplier_position);  
                L1_request=data.charCodeAt(3);   //posicion surtidor                  
                frame_1.openclose_turn=data[6];  //turno. abrir cerrar
                ////('>>Turno. abrir/cerrar:'+frame_1.openclose_turn);  
                frame_1.type_of_vendor_ID=data[8];  //tipo identificacion vendedor
                ////('>>Tipo identificacion vendedor:'+frame_1.type_of_vendor_ID);                    
                for(x=0;x<=19;x++){          //serial vendedor
                    frame_1.serial_seller[x]=data.charCodeAt(x+10);     
                } 
                ////('>>Serial vendedor:'+frame_1.serial_seller);                
                for(x=0;x<=3;x++){          //contraseña
                    frame_1.password[x]=data.charCodeAt(x+31);     
                } 
                ////('>>Contraseña:'+frame_1.password); 
                for(x=0;x<=12;x++){          //total volumen producto1 pos1
                    frame_1.total_volume_P1l1[x]=data.charCodeAt(x+36);     
                } 
                ////('>>Total volumen producto1 pos1:'+frame_1.total_volume_P1l1);                 
                for(x=0;x<=12;x++){          //total dinero producto1 pos1 
                    frame_1.total_money_P1l1[x]=data.charCodeAt(x+50);     
                } 
                ////('>>Total dinero producto1 pos1:'+frame_1.total_money_P1l1);                     
                for(x=0;x<=5;x++){          //ppu producto1 pos1  
                    frame_1.ppu_P1l1[x]=data.charCodeAt(x+64);     
                } 
                ////('>>ppu producto1 pos1:'+frame_1.ppu_P1l1);          
                for(x=0;x<=12;x++){          //total volumen producto2 pos1
                    frame_1.total_volume_P2l1[x]=data.charCodeAt(x+71);     
                } 
                ////('>>Total volumen producto2 pos1:'+frame_1.total_volume_P2l1);                 
                for(x=0;x<=12;x++){          //total dinero producto2 pos1
                    frame_1.total_money_P2l1[x]=data.charCodeAt(x+85);     
                } 
                ////('>>Total dinero producto2 pos1:'+frame_1.total_money_P2l1);                     
                for(x=0;x<=5;x++){          //ppu producto2 pos1  
                    frame_1.ppu_P2l1[x]=data.charCodeAt(x+99);     
                } 
                /////('>>ppu producto2 pos1:'+frame_1.ppu_P2l1);          
                for(x=0;x<=12;x++){          //total volumen producto3 psos1
                    frame_1.total_volume_P3l1[x]=data.charCodeAt(x+106);     
                } 
                ////('>>Total volumen producto3 pos1:'+frame_1.total_volume_P3l1);
                for(x=0;x<=12;x++){          //total dinero producto3 pos1
                    frame_1.total_money_P3l1[x]=data.charCodeAt(x+120);     
                } 
                ////('>>Total dinero producto3 pos1:'+frame_1.total_money_P3l1);                     
                for(x=0;x<=5;x++){          //ppu producto3 pos1   
                    frame_1.ppu_P3l1[x]=data.charCodeAt(x+134);     
                } 
                ////('>>ppu producto3 pos1 :'+frame_1.ppu_P3l1);
                for(x=0;x<=12;x++){          //total volumen producto4 pos1  
                    frame_1.total_volume_P4l1[x]=data.charCodeAt(x+141);     
                } 
                ////('>>Total volumen producto4 pos1:'+frame_1.total_volume_P4l1);
                for(x=0;x<=12;x++){          //total dinero pruducto4 pos1
                    frame_1.total_money_P4l1[x]=data.charCodeAt(x+155);     
                } 
                ////('>>Total dinero pruducto4 pos1:'+frame_1.total_money_P4l1);
                for(x=0;x<=5;x++){          //ppu producto4 pos1   
                    frame_1.ppu_P4l1[x]=data.charCodeAt(x+169);     
                } 
                ////('>>ppu producto4 pos1:'+frame_1.ppu_P4l1);                  
                for(x=0;x<=12;x++){          //total volumen producto1 pos2   
                    frame_1.total_volume_P1l2[x]=data.charCodeAt(x+176);     
                } 
                ////('>>total volumen producto1 pos2:'+frame_1.total_volume_P1l2);
                for(x=0;x<=12;x++){          //total dinero producto1 pos2
                    frame_1.total_money_P1l2[x]=data.charCodeAt(x+190);     
                } 
                ////('>>Total dinero producto1 pos2:'+frame_1.total_money_P1l2);                     
                for(x=0;x<=5;x++){          //ppu producto1 pos2   
                    frame_1.ppu_P1l2[x]=data.charCodeAt(x+204);     
                } 
                ////('>>ppu producto1 pos2:'+frame_1.ppu_P1l2);                  
                for(x=0;x<=12;x++){          //total volumen producto2 pos2  
                    frame_1.total_volume_P2l2[x]=data.charCodeAt(x+211);     
                } 
                ////('>>Total volumen producto2 pos2:'+frame_1.total_volume_P2l2);
                for(x=0;x<=12;x++){          //total dinero producto2 pos2
                    frame_1.total_money_P2l2[x]=data.charCodeAt(x+225);     
                } 
                ////('>>Total dinero producto2 pos2:'+frame_1.total_money_P2l2);   
                for(x=0;x<=5;x++){          //ppu producto2 pos2    
                    frame_1.ppu_P2l2[x]=data.charCodeAt(x+239);     
                } 
                ////('>>ppu producto2 pos2:'+frame_1.ppu_P2l2);                  
                for(x=0;x<=12;x++){          //total volumen producto3 pos2  
                    frame_1.total_volume_P3l2[x]=data.charCodeAt(x+246);     
                } 
                ////('>>Total volumen producto3 pos2:'+frame_1.total_volume_P3l2);
                for(x=0;x<=12;x++){          //total dinero producto3 pos2 
                    frame_1.total_money_P3l2[x]=data.charCodeAt(x+260);     
                } 
                ////('>>Total dinero producto3 pos2:'+frame_1.total_money_P3l2);   
                for(x=0;x<=5;x++){          //ppu producto3 pos2   
                    frame_1.ppu_P3l2[x]=data.charCodeAt(x+274);     
                } 
                ////('>>ppu producto3 pos2:'+frame_1.ppu_P3l2);                    
                for(x=0;x<=12;x++){          //total volumen producto4 pos2  
                    frame_1.total_volume_P4l2[x]=data.charCodeAt(x+281);     
                } 
                ////('>>Total volumen producto4 pos2:'+frame_1.total_volume_P4l2);
                for(x=0;x<=12;x++){          //ppu producto4 pos2  
                    frame_1.total_money_P4l2[x]=data.charCodeAt(x+295);     
                } 
                ////('>>ppu producto4 pos2:'+frame_1.total_money_P4l2);   
                for(x=0;x<=5;x++){          //ppu producto4 pos2   
                    frame_1.ppu_P4l2[x]=data.charCodeAt(x+309);     
                } 
                ////('>>ppu producto4 pos2:'+frame_1.ppu_P4l2);                  
                for(x=0;x<=13;x++){          //fecha / hora turno   
                    frame_1.date_hour[x]=data.charCodeAt(x+316);     
                } 
                ////('>>fecha / hora turno:'+frame_1.date_hour);                  
                number_process2_rxmux(type_of_reception);   
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var usuario     = parseFloat(frame_1.serial_seller);
                        var contraseña  = frame_1.password;
                        client.query(sprintf("UPDATE turno SET usuario ='%1$s', contraseña = '%2$s'",usuario,contraseña),function(err,result){
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });  
                        client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",7),function(err,result){
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });                        
                    }
                });
                ////('>>EstadoL1 7 para BGE2');                  
                TableNumber=turnopenclose_table;                
                next_position=332;                
                frame_1.plot_number='2';                
                dataOK=true;                
                frame_1.memoria_part=2;    
            break;    
            case 'l':                                                           //TOTALES_ELECTRONICOS
                ////('___totaleselectronicosL1___');
                frame_1.supplier_position=data[3];  //posicion surtidor
                ////('>>Posicion surtidor:'+frame_1.supplier_position); 
                for(x=0;x<=12;x++){          //total volumen prod.1_lado1
                    frame_1.total_volume_P1l1[x]=data.charCodeAt(x+6);
                    if(frame_1.total_volume_P1l1[x]===44){
                        frame_1.total_volume_P1l1[x]=46;
                    }                      
                } 
                ////('>>Total volumen prod.1_lado1:'+frame_1.total_volume_P1l1);                 
                for(x=0;x<=12;x++){          //total dinero prod.1 lado1
                    frame_1.total_money_P1l1[x]=data.charCodeAt(x+20);     
                } 
                ////('>>Total dinero prod.1 lado1:'+frame_1.total_money_P1l1);               
                for(x=0;x<=5;x++){          //ppu prod.1 lado1
                    frame_1.ppu_P1l1[x]=data.charCodeAt(x+34);     
                } 
                ////('>>ppu prod.1 lado1:'+frame_1.ppu_P1l1);
                for(x=0;x<=12;x++){          //total volumen pro.2 lado1
                    frame_1.total_volume_P2l1[x]=data.charCodeAt(x+41);  
                    if(frame_1.total_volume_P2l1[x]===44){
                        frame_1.total_volume_P2l1[x]=46;
                    }                           
                } 
                ////('>>Total volumen pro.2 lado1:'+frame_1.total_volume_P2l1);              
                for(x=0;x<=12;x++){          //total dinero prod.2 lado1
                    frame_1.total_money_P2l1[x]=data.charCodeAt(x+55);     
                } 
                ////('>>Total dinero prod.2 lado1:'+frame_1.total_money_P2l1);             
                for(x=0;x<=5;x++){          //ppu prod.2 lado1
                    frame_1.ppu_P2l1[x]=data.charCodeAt(x+69);     
                } 
                ////('>>ppu prod.1 lado1:'+frame_1.ppu_P2l1);            
                for(x=0;x<=12;x++){          //total volumen prod.3 lado1
                    frame_1.total_volume_P3l1[x]=data.charCodeAt(x+76); 
                    if(frame_1.total_volume_P3l1[x]===44){
                        frame_1.total_volume_P3l1[x]=46;
                    }                       
                } 
                ////('>>Total volumen prod.3 lado1:'+frame_1.total_volume_P3l1);              
                for(x=0;x<=12;x++){          //total dinero prod.3 lado1
                    frame_1.total_money_P3l1[x]=data.charCodeAt(x+90);     
                } 
                ////('>>Total dinero prod.3 lado1:'+frame_1.total_money_P3l1);               
                for(x=0;x<=5;x++){          //ppu prod.3 lado1
                    frame_1.ppu_P3l1[x]=data.charCodeAt(x+104);     
                } 
                ////('>>ppu prod.3 lado1:'+frame_1.ppu_P3l1);                
                for(x=0;x<=12;x++){          //total volumen prod.4 lado1
                    frame_1.total_volume_P4l1[x]=data.charCodeAt(x+111); 
                    if(frame_1.total_volume_P4l1[x]===44){
                        frame_1.total_volume_P4l1[x]=46;
                    }                     
                } 
                ////('>>Total volumen prod.4 lado1:'+frame_1.total_volume_P4l1); 
                for(x=0;x<=12;x++){          //total dinero prod.4 lado1
                    frame_1.total_money_P4l1[x]=data.charCodeAt(x+125);     
                } 
                ////('>>Total dinero prod.4 lado1:'+frame_1.total_money_P4l1); 
                for(x=0;x<=5;x++){          //ppu prod.4 lado1
                    frame_1.ppu_P4l1[x]=data.charCodeAt(x+139);     
                } 
                ////('>>ppu prod.4 lado1:'+frame_1.ppu_P4l1);                
                for(x=0;x<=12;x++){          //total volumen prod.1 lado2
                    frame_1.total_volume_P1l2[x]=data.charCodeAt(x+146); 
                    if(frame_1.total_volume_P1l2[x]===44){
                        frame_1.total_volume_P1l2[x]=46;
                    }                       
                } 
                ////('>>Total volumen prod.1 lado2:'+frame_1.total_volume_P1l2);             
                for(x=0;x<=12;x++){          //total dinero prod.1 lado2
                    frame_1.total_money_P1l2[x]=data.charCodeAt(x+160);     
                } 
                ////('>>Total dinero prod.1 lado2:'+frame_1.total_money_P1l2);              
                for(x=0;x<=5;x++){          //ppu prod.1 lado2
                    frame_1.ppu_P1l2[x]=data.charCodeAt(x+174);     
                } 
                ////('>>ppu prod.1 lado2:'+frame_1.ppu_P1l2);             
                for(x=0;x<=12;x++){          //total volumen pro.2 lado2
                    frame_1.total_volume_P2l2[x]=data.charCodeAt(x+181); 
                    if(frame_1.total_volume_P2l2[x]===44){
                        frame_1.total_volume_P2l2[x]=46;
                    }                     
                } 
                ////('>>Total volumen pro.2 lado2:'+frame_1.total_volume_P2l2);              
                for(x=0;x<=12;x++){          //total dinero prod.2 lado2
                    frame_1.total_money_P2l2[x]=data.charCodeAt(x+195);     
                } 
                ////('>>Total dinero prod.2 lado2:'+frame_1.total_money_P2l2);               
                for(x=0;x<=5;x++){          //ppu prod.2 lado2
                    frame_1.ppu_P2l2[x]=data.charCodeAt(x+209);     
                } 
                ////('>>ppu prod.2 lado2:'+frame_1.ppu_P2l2);             
                for(x=0;x<=12;x++){          //total volumen prod.3 lado2
                    frame_1.total_volume_P3l2[x]=data.charCodeAt(x+216); 
                    if(frame_1.total_volume_P3l2[x]===44){
                        frame_1.total_volume_P3l2[x]=46;
                    }                        
                } 
                ////('>>Total volumen prod.3 lado2:'+frame_1.total_volume_P3l2);            
                for(x=0;x<=12;x++){          //total dinero prod.3 lado2
                    frame_1.total_money_P3l2[x]=data.charCodeAt(x+230);     
                } 
                ////('>>Total dinero prod.3 lado2:'+frame_1.total_money_P3l2);              
                for(x=0;x<=5;x++){          //ppu prod.3 lado2
                    frame_1.ppu_P3l2[x]=data.charCodeAt(x+244);     
                } 
                ////('>>ppu prod.3 lado2:'+frame_1.ppu_P3l2);             
                for(x=0;x<=12;x++){          //total volumen prod.4 lado2
                    frame_1.total_volume_P4l2[x]=data.charCodeAt(x+251);     
                } 
                ////('>>Total volumen prod.4 lado2:'+frame_1.total_volume_P4l2);             
                for(x=0;x<=12;x++){          //total dinero prod.4 lado2
                    frame_1.total_money_P4l2[x]=data.charCodeAt(x+265);     
                } 
                ////('>>Total dinero prod.4 lado2:'+frame_1.total_money_P4l2);             
                for(x=0;x<=5;x++){          //ppu prod.4 lado2
                    frame_1.ppu_P4l2[x]=data.charCodeAt(x+279);     
                } 
                ////('>>ppu prod.4 lado2:'+frame_1.ppu_P4l2);    
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var frame_1total_volume_P1l1PAS2=parseFloat(frame_1.total_volume_P1l1);
                        var frame_1total_volume_P2l1PAS2=parseFloat(frame_1.total_volume_P2l1);
                        var frame_1total_volume_P3l1PAS2=parseFloat(frame_1.total_volume_P3l1);
                        var frame_1total_volume_P4l1PAS2=parseFloat(frame_1.total_volume_P4l1);
                        var totalmanguera1   = frame_1total_volume_P1l1PAS2.toFixed(2);
                        var totalmanguera2   = frame_1total_volume_P2l1PAS2.toFixed(2);
                        var totalmanguera3   = frame_1total_volume_P3l1PAS2.toFixed(2);
                        var totalmanguera4   = frame_1total_volume_P4l1PAS2.toFixed(2);
                        var dineromanguera1  = frame_1.total_money_P1l1;
                        var dineromanguera2  = frame_1.total_money_P2l1;
                        var dineromanguera3  = frame_1.total_money_P3l1;
                        var dineromanguera4  = frame_1.total_money_P4l1;
                        ////(new Date());
                        client.query(sprintf("UPDATE totales SET totalmanguera1 ='%1$s', totalmanguera2 = '%2$s' , totalmanguera3 ='%3$s',totalmanguera4 ='%4$s',dineromanguera1 ='%5$s', dineromanguera2 ='%6$s', dineromanguera3 = '%7$s', dineromanguera4='%6$s' WHERE pk_id_posicion=1",totalmanguera1,totalmanguera2,totalmanguera3,totalmanguera4,dineromanguera1,dineromanguera2,dineromanguera3,dineromanguera4),function(err,result){
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                        var frame_1total_volume_P1l2PAS2=parseFloat(frame_1.total_volume_P1l2);
                        var frame_1total_volume_P2l2PAS2=parseFloat(frame_1.total_volume_P2l2);
                        var frame_1total_volume_P3l2PAS2=parseFloat(frame_1.total_volume_P3l2);
                        var frame_1total_volume_P4l2PAS2=parseFloat(frame_1.total_volume_P4l2);
                        totalmanguera1   = frame_1total_volume_P1l2PAS2.toFixed(2);
                        totalmanguera2   = frame_1total_volume_P2l2PAS2.toFixed(2);
                        totalmanguera3   = frame_1total_volume_P3l2PAS2.toFixed(2);
                        totalmanguera4   = frame_1total_volume_P4l2PAS2.toFixed(2);
                        dineromanguera1  = frame_1.total_money_P1l2;
                        dineromanguera2  = frame_1.total_money_P2l2;
                        dineromanguera3  = frame_1.total_money_P3l2;
                        dineromanguera4  = frame_1.total_money_P4l2;                        
                        client.query(sprintf("UPDATE totales SET totalmanguera1 ='%1$s', totalmanguera2 = '%2$s' , totalmanguera3 ='%3$s',totalmanguera4 ='%4$s',dineromanguera1 ='%5$s', dineromanguera2 ='%6$s', dineromanguera3 = '%7$s', dineromanguera4='%6$s' WHERE pk_id_posicion=2",totalmanguera1,totalmanguera2,totalmanguera3,totalmanguera4,dineromanguera1,dineromanguera2,dineromanguera3,dineromanguera4),function(err,result){
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });                        
                    }
                });   
                number_process2_rxmux(type_of_reception);
                next_position=287;                
                frame_1.plot_number='2';                
                dataOK=true;                
                frame_1.memoria_part=2;                  
            break;            
            case 'm':                                                           //SUBE_MANIJA
                ////('___subemanijaL1___');
                frame_1.supplier_position=data[3];  //posicion surtidor                
                var L1supplier_positionD=data.charCodeAt(3);   //posicion surtidor                
                ////('>>Posicion surtidor:'+frame_1.supplier_position); 
                frame_1.preset_type=data[6];  //tipo de preset
                ////('>>Tipo de preset:'+frame_1.preset_type);             
                for(x=0;x<=7;x++){          //valor preset digitado
                    frame_1.preset_value[x]=data.charCodeAt(x+8);     
                } 
                ////('>>Valor preset digitado:'+frame_1.preset_value);                 
                frame_1.selected_product=data[17];  //tipo de producto
                ////('>>Tipo de producto :'+frame_1.selected_product); 
                for(x=0;x<=12;x++){          //total de volumen anterior
                    frame_1.total_previous_volume[x]=data.charCodeAt(x+19); 
                    if(frame_1.total_previous_volume[x]===44){
                        frame_1.total_previous_volume[x]=46;
                    }                      
                } 
                ////('>>Total de volumen anterior:'+frame_1.total_previous_volume);
                for(x=0;x<=12;x++){          //total de dinero anterior
                    frame_1.total_money_previous[x]=data.charCodeAt(x+33);     
                } 
                ////('>>Total de dinero anterior:'+frame_1.total_money_previous); 
                for(x=0;x<=5;x++){        //total ppu posterior ////dato original x<=5
                    frame_1.previous_PPU[x]=data.charCodeAt(x+47);  //47  //se paso a leer solo 5 de 6 datos    
                } 
                ////('>>Total ppu anterior:'+frame_1.previous_PPU);
                
                var idpos       = L1supplier_positionD;
                var tipo_p      = frame_1.preset_type;
                var valor_p     = frame_1.preset_value;
                var totalesdin  = parseFloat(frame_1.total_money_previous);
                var totalesvol  = parseFloat(frame_1.total_previous_volume);
                var ppu         = frame_1.previous_PPU;
                var grado       = parseFloat(frame_1.selected_product); 
                var kilometraje = '0';
                var serial      = '0'; 
                var estado      = 23;
                pg.connect(conString, function(err, client, done){
                    if(err){
						return console.error('error de conexion 1', err);                                
                    }else{
                        client.query(sprintf("UPDATE preset SET tipo_p='%2$s', valor_p='%3$s', totalesdin='%4$s', totalesvol='%5$s', ppu='%6$s', grado='%7$s', kilometraje='%8$s', serial='%9$s' where id_pos= '%1$s'   " ,1,tipo_p,valor_p,totalesdin,totalesvol,ppu,grado,kilometraje,serial ), function(err,result){
                            done();
                            if(err){
								return console.error('error de conexion 2', err);                            
                            }else{
                            } 
                        });
                        for(x=0;x<=4;x++){
                            client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",estado),function(err,result){
                                done();
                                if(err){
                                    return console.error('Error de conexion', err);
                                }else{
                                }
                            }); 
                        }
                    }
                });                            
                number_process2_rxmux(type_of_reception);
                next_position=55;                
                frame_1.plot_number='2';                
                dataOK=true;                
                frame_1.memoria_part=2;                    
            break;    
        
            case 'c':                                                           //Reset local del bbb
                switch (data[6]) {
                    case '0':                               //recibio el mux la trama mal de fin venta
                        ////('Error envio posicionL1:'+data[3]);
                        switch(frame_1.memoria_part){       //pregunta por los ultimos datos enviados en la parte1 de la trama
                            case 1:
                                frame_1.plot_number='1';                                 
                                dataOK=true;                                  
                            break;
                            case 2:
                                frame_1.plot_number='2';                                 
                                dataOK=true;                                  
                            break;
                            default:
                        }
                    break;
                    case '1':                               //recibio el mux la trama bien 
                        ////('Correcto envio posicionL1:'+data[3]);  
                        frame_1.memoria_part=0;   
                        frame_1.plot_number = Frame_1ready;                         
                        dataOK=true;
                        //confirmaciones durante el proceso normal del surtidor
                        switch (typeof_request) {
                            case 'P':
                                pg.connect(conString, function(err, client, done){
                                    if(err){
    								    return console.error('error de conexion 1', err);                                
                                    }else{
                                        client.query(sprintf("UPDATE precios SET disp1=nsx1, disp2=nsx2, disp3=nsx3 WHERE id_pos = 1" ), function(err,result){
                                            done();
                                            if(err){
    								            return console.error('error de conexion 2', err);                            
                                            }else{
                                            } 
                                        });
                                        client.query(sprintf("UPDATE precios SET disp1='%1$s', disp2='%2$s', disp3='%3$s' WHERE id_pos = 2" ,nsx1l2,nsx2l2,nsx3l2 ), function(err,result){
                                            done();
                                            if(err){
    								            return console.error('error de conexion 2', err);                            
                                            }else{
                                            } 
                                            typeof_request=0;
                                        });
                                    }
                                });        
                            break;
                            default:
                            // code
                        }
                        //confirmaciones durante el incio del sistema
                        switch(TableNumber){
                            case not_readtable:
                                TableNumber=0;//permite no volver a leer las dos tablas de configuraciones y ppu porque ya inicio sistema                             
                            break;
                            case button_Names_table:
                                TableNumber=0;//permite no volver a leer las dos tablas de configuraciones y ppu porque ya inicio sistema   
                            break;
                            case turn_table:
                                TableNumber=button_Names_table;   
                            break;
                            case authorizedPpu_table:
                                pg.connect(conString, function(err, client, done){
                                    if(err){
    								    return console.error('error de conexion 1', err);                                
                                    }else{
                                        client.query(sprintf("UPDATE precios SET disp1=nsx1, disp2=nsx2, disp3=nsx3 WHERE id_pos = 1" ), function(err,result){
                                            done();
                                            if(err){
    								            return console.error('error de conexion 2', err);                            
                                            }else{
                                            } 
                                        });
                                        client.query(sprintf("UPDATE precios SET disp1='%1$s', disp2='%2$s', disp3='%3$s' WHERE id_pos = 2" ,nsx1l2,nsx2l2,nsx3l2 ), function(err,result){
                                            done();
                                            if(err){
    								            return console.error('error de conexion 2', err);                            
                                            }else{
                                            } 
                                            TableNumber=turn_table;//envia directamente a leer la tabla de turno para que el mux pueda arrancar
                                            //TableNumber=0;//permite no volver a leer las dos tablas de configuraciones y ppu porque ya inicio sistema                                       
                                            //sendMux(totalRequest_mux);//                                        
                                        });
                                    }
                                });                                 
                            break;
                            case initialSettings_table:
                                TableNumber=authorizedPpu_table;//envia directamente a leer la tabla dos para que el mux pueda arrancar                                
                            break;                            
                            default:
                        }                        
                    break;                    
                    default:
                }
                type_of_reception_2= RESET_RESET;
            break;
            default:
                // code
        }

        switch (type_of_reception_2) {            
            case X_STATE:                                                       //X  - ESTADO
                ////('___estadoL2___');
                frame_2.supplier_position=data[next_position];  //posicion2 surtidor   
                positionTwo=data[next_position];
                next_position=next_position+3;                
                frame_2.state = data.charCodeAt(next_position); //estado2 
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",frame_2.state),function(err,result){
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });
                ////('>>Posicion surtidorL2:'+frame_2.supplier_position);
                switch (frame_2.state) {
                    case 0x10:
                        ////('>>EstadoL2: Error');                
                    break;
                    case 0x16:
                        //reseteo la variable que me permite leer una venta canasta
                        pg.connect(conString, function(err, client, done){ 
                            if(err){
                                return console.error('error de conexion 1', err);                                
                            }else{
                                client.query(sprintf("UPDATE venta_canasta SET lecturacanasta='%1$s' WHERE idposicionc=2" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                                done();
                                    if(err){
                                    	return console.error('error de conexion 2', err);                            
                                    }else{
                                    } 
                                });
                                client.query(sprintf("UPDATE preset SET lecturacupocredito='%1$s' WHERE id_pos=2" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                                    done();
                                    if(err){
                                    	return console.error('error de conexion 2', err);                            
                                    }else{
                                    } 
                                });
                                //estado php
                                client.query("UPDATE estado SET pos2=22", function(err,result){//era 1 hasta el 04/08/2016
                                done();
                                    if(err){
                                    	return console.error('error de conexion 2', err);                            
                                    }else{
                                    } 
                                });                                
                            }
                        });                        
                        basketEnablesReadingL1=0;//variable de lectura canastatabla
                        creditEnablesReadingL2=0;
                        ////('>>EstadoL2: Espera');                
                    break;
                    case 0x19:
                        ////('>>EstadoL2: Surtiendo');                
                    break;
                    case 0x22:
                        ////('>>EstadoL2: Esperando respuesta a peticion venta seleccionada Forma de pago');                
                    break;
                    case 0x23:
                        ////('>>EstadoL2: Espera transaccion forma de pago');                
                    break;
                    case 0x27:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",5),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });                        
                        ////('>>EstadoL2: Esperando respuesta a peticion Identificacion usuario credito');                
                    break;
                    case 0x28:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",5),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });                        
                        ////('>>EstadoL2: Espera transaccion credito');                
                    break;
                    case 0x29:
                        ////('>>EstadoL2: Esperando respuesta a peticion Calibracion');                
                    break;
                    case 0x32:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",16),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });         
                        ////('>>EstadoL2: Esperando respuesta a peticion Identificacion producto canasta');                
                    break;
                    case 0x34:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",9),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });                          
                        ////('>>EstadoL2: Recibo de impresion');                
                    break;   
                    case 0x36:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",19),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });                        
                        ////('>>EstadoL2: Esperando respuesta a Peticion consignacion');  
                    break;
                    case 0x39:
                        //reseteo la variable que me permite leer una venta canasta
                        pg.connect(conString, function(err, client, done){ 
                            if(err){
                                return console.error('error de conexion 1', err);                                
                            }else{
                                client.query(sprintf("UPDATE venta_canasta SET lecturacanasta='%1$s' WHERE idposicionc=2" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                                done();
                                    if(err){
                                    	return console.error('error de conexion 2', err);                            
                                    }else{
                                    } 
                                });
                                client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",17),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });                                
                            }
                        });                        
                        basketEnablesReadingL2=0;//variable de lectura canastatabla                        
                        ////('>>EstadoL2: Entra a menu canasta');                        
                    break;    
                    case 0x40:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",6),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });
                        ////('>>EstadoL2: Pendiente datos turno');                        
                    break;
                    case 0x42:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",8),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });                        
                        ////('>>EstadoL2: Espera respuesta a peticion turno Apertura o Cierre');                        
                    break;    
                    case 0x1b:
                        pg.connect(conString, function(err, client, done){
                            if(err){
                                return console.error('Error de conexion 1', err);
                            }else{
                                client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",10),function(err,result){
                                    done();
                                    if(err){
                                        return console.error('Error de conexion', err);
                                    }else{
                                    }
                                });
                            }
                        });                          
                        //('>>EstadoL2: Fin Venta en cero');                        
                    break;    
                    default:
                }                
                //muxport.write(supplier_position_2);
                //muxport.write('<<N;&*');  
                ////("<<N;&*");                  
                frame_2.memoria_part=1; 
                frame_2.plot_number='1';
                
                if(frame_2.state==0x34 || frame_2.state==0x1b){//caso para impresion o caso de finventa cero
                    frame_1.plot_number='1';                
                    frame_2.plot_number='2';
                    dataOK=true;                     
                }                
            break;   
            case X_SALESORDER:                                                  //X - FINVENTA
                FVenta2='1';
                //('___finventaL2___');
                frame_2.supplier_position=data[next_position];  //posicion2 surtidor  
                var L2supplier_positionD=data.charCodeAt(next_position);   //posicion surtidor                 
                //('>>Posicion surtidor:'+frame_2.supplier_position);
                for(x=0;x<=3;x++){
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{
                            client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",4),function(err,result){
                                done();
                                if(err){
                                    return console.error('Error de conexion', err);
                                }else{
                                }
                            });
                        }
                    });    
                }
                next_position=next_position+3;
                frame_2.type_sale=data[next_position];  //tipo2 de venta 
                //('>>Tipo de venta:'+frame_2.type_sale);   
                next_position=next_position+2;                
                frame_2.preset_type=data[next_position];//tipo2 de preset seleccionado 
                //('>>Tipo de preset:'+frame_2.preset_type); 
                next_position=next_position+2;                
                for(x=0;x<=7;x++){          //valor2 preset digitado 
                    frame_2.preset_value[x]=data.charCodeAt(x+next_position);    
                }
                //('>>Valor del preset:'+frame_2.preset_value);
                next_position=next_position+9;                
                frame_2.selected_product=data[next_position];   //tipo2 de producto seleccionado 
                //('>>Producto seleccionado:'+frame_2.selected_product); 
                next_position=next_position+2;                
                for(x=0;x<=13;x++){         //fecha2 hora sube manija 
                    frame_2.date_hour[x]=data.charCodeAt(x+next_position);     
                }   
                //('>>Fecha hora s.m:'+frame_2.date_hour);  
                next_position=next_position+15;                
                for(x=0;x<=12;x++){         //total2 volumen anterior
                    frame_2.total_previous_volume[x]=data.charCodeAt(x+next_position); 
                    if(frame_2.total_previous_volume[x]===44){
                        frame_2.total_previous_volume[x]=46;
                    }                       
                } 
                //('>>TotaL vol anterior:'+frame_2.total_previous_volume);
                next_position=next_position+14;                
                for(x=0;x<=12;x++){         //total2 dinero anterior 
                    frame_2.total_money_previous[x]=data.charCodeAt(x+next_position);     
                }
                //('>>TotaL din anterior:'+frame_2.total_money_previous);
                next_position=next_position+14;                
                for(x=0;x<=5;x++){      //total2 ppu anterior 
                    frame_2.previous_PPU[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>TotaL ppu anterior:'+frame_2.previous_PPU);
                next_position=next_position+7;
                for(x=0;x<=7;x++){      //volumen2 vendido 
                    frame_2.volume_sold[x]=data.charCodeAt(x+next_position);
                    if(frame_2.volume_sold[x]===44){
                        frame_2.volume_sold[x]=46;
                    }                      
                }   
                //('>>Volumen vendido:'+frame_2.volume_sold);
                next_position=next_position+9;                
                for(x=0;x<=7;x++){      //dinero2 vendido 
                    frame_2.money_selling[x]=data.charCodeAt(x+next_position);     
                }
                //('>>Dinero vendido:'+frame_2.money_selling);  
                next_position=next_position+9;                
                for(x=0;x<=5;x++){      //ppu2 vendido 
                    frame_2.PPU_sold[x]=data.charCodeAt(x+next_position);     
                }      
                //('>>Ppu vendido:'+frame_2.PPU_sold); 
                next_position=next_position+7;                
                frame_2.type_of_product_sold=data[next_position];   //tipo2 de producto vendido 
                //('>>Tipo producto ven:'+frame_2.type_of_product_sold);
                next_position=next_position+2;                
                for(x=0;x<=9;x++){      //placa2 
                    frame_2.license_plate[x]=data.charCodeAt(x+next_position);     
                }  
                //('>>Placa:'+frame_2.license_plate); 
                next_position=next_position+11;                
                for(x=0;x<=9;x++){  //kilometraje2
                    frame_2.mileage[x]=data.charCodeAt(x+next_position);     
                }  
                //('>>Kilometraje:'+frame_2.mileage);
                next_position=next_position+11;                
                for(x=0;x<=9;x++){  //cedula2 
                    frame_2.identity_card[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Cedula:'+frame_2.identity_card);  
                next_position=next_position+11;                
                for(x=0;x<=13;x++){     //fecha/hora2 fin de venta 
                    frame_2.date_Time_sale[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Fecha/hora fin venta:'+frame_2.date_Time_sale);
                next_position=next_position+15;                
                frame_2.type_of_vehicle=data[next_position];    //tipo de vehiculo2 
                //('>>Tipo de vehiculo:'+frame_2.type_of_vehicle);
                next_position=next_position+2;                
                frame_2.type_of_customer_identification=data[next_position];//tipo de identificacion cliente
                //('>>Tipo de identificacion cliente:'+frame_2.type_of_customer_identification);  
                next_position=next_position+2;                
                for(x=0;x<=19;x++){         //identificacion cliente   
                    frame_2.customer_identification[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Identificacion cliente:'+frame_2.customer_identification);  
                next_position=next_position+21; 
                frame_2.islero_typeid=data[next_position];  //tipo de identificacion islero   
                //('>>Tipo de identificacion islero:'+frame_2.islero_typeid); 
                next_position=next_position+2;                 
                for(x=0;x<=19;x++){     //identificacion islero  
                    frame_2.isleroid[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Identificacion islero:'+frame_2.isleroid); 
                next_position=next_position+21;      
                for(x=0;x<=12;x++){     //total volumen posterior
                    frame_2.totalvolumeback[x]=data.charCodeAt(x+next_position);  
                    if(frame_2.totalvolumeback[x]===44){
                        frame_2.totalvolumeback[x]=46;
                    }                      
                } 
                //('>>Total volumen posterior:'+frame_2.totalvolumeback); 
                next_position=next_position+14;                 
                for(x=0;x<=12;x++){     //total dinero posterior
                    frame_2.totalmoneyback[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero posterior:'+frame_2.totalmoneyback); 
                next_position=next_position+14;  
                
                next_position=next_position+1;
                for(x=0;x<=4;x++){     //total ppu posterior ////dato original x<=5
                    frame_2.totalbackPPU[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total ppu posterior:'+frame_2.totalbackPPU); 
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var idposicion      = L2supplier_positionD;
                        var cantidadtotal   = parseFloat(frame_2.volume_sold);
                        var valortotal      = parseFloat(frame_2.money_selling);
                        var volumeninicial  = parseFloat(frame_2.total_previous_volume);
                        var dineroinicial   = parseFloat(frame_2.total_money_previous);
                        var dinerofinal     = parseFloat(frame_2.totalmoneyback);
                        var valorprogramado = parseFloat(frame_2.preset_value); 
                        var volumenfinal    = parseFloat(frame_2.totalvolumeback); 
                        var ppu             = parseFloat(frame_2.totalbackPPU);
                        var grado           = frame_2.selected_product;     
                        var nombreefectivo  = parseInt(frame_2.identity_card,10);
                        var kilometrajecliente = frame_2.mileage;
                        var placaefectivo   = frame_2.license_plate;
                        var tipovehiculo    = parseFloat(frame_2.type_of_vehicle);
                        var tipopreset      = frame_2.preset_type;                  
                        //(new Date());
                        client.query(sprintf("INSERT INTO venta (fechainicial,fechafinal,cantidadtotal,valortotal,volumeninicial,volumenfinal,dineroinicial,dinerofinal,valorprogramado,ppu,grado,nombreefectivo,kilometrajecliente,placaefectivo,tipovehiculo,tipopreset,idposicion) VALUES (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP, '%1$f','%2$f','%3$s','%4$f','%5$f','%6$s','%7$s','%8$s','%9$s','%10$s','%11$s','%12$s','%13$s','%14$s','%15$s')",cantidadtotal,valortotal,volumeninicial,volumenfinal,dineroinicial,dinerofinal,valorprogramado,ppu,grado,nombreefectivo,kilometrajecliente,placaefectivo,tipovehiculo,tipopreset,2),function(err,result){                                                    done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });                    
                frame_2.plot_number='2';                     
                dataOK=true;                      
                frame_2.memoria_part=2;
                FVenta2='0';
                terminototales='1';
            break;    
            case X_DISCRIMINATESALE:                                            //X - DISCRIMINAR FORMA DE PAGO(#venta)
                //('___discriminarformadepagoL2___');
                frame_2.supplier_position=data[next_position];  //posicion2 surtidor
                L2_request=data.charCodeAt(data[next_position]);   //posicion surtidor                 
                next_position=next_position+3;                   
                //('>>Posicion surtidor:'+frame_2.supplier_position);                 
                for(x=0;x<=7;x++){      //numero de venta
                    frame_2.sales_number[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Numero de venta:'+frame_2.sales_number);  
                next_position=next_position+9;  
                for(x=0;x<=1;x++){      //tipo de forma de pago
                    frame_2.type_of_payment[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Tipo de forma de pago:'+frame_2.type_of_payment); 
                next_position=next_position+3;                  
                frame_2.consultation_sale=data[next_position];  //venta consulta
                //('>>Venta consulta:'+frame_2.consultation_sale);  
                //var idpos           = L2supplier_positionD;
                //var numeroventa     = frame_2.sales_number;
                //var tipoformadepago = frame_2.type_of_payment;
                //var ventaconsulta   = frame_2.consultation_sale;
                //pg.connect(conString, function(err, client, done){
                //    if(err){
				//		return console.error('error de conexion 1', err);                                
                //    }else{
                //        client.query(sprintf("UPDATE formadepago SET numeroventa='%2$s', tipoformadepago='%3$s', ventaconsulta='%4$s' where id_pos= '%1$s'   " ,2,numeroventa,tipoformadepago,ventaconsulta ), function(err,result){
                //            done();
                //            if(err){
				//				return console.error('error de conexion 2', err);                            
                //            }else{
                //            } 
                //        });       
                //    }
                //});                   
                TableNumber=responseto_requestpayment_tableL2;                    
                frame_2.plot_number='2';                  
                dataOK=true;   
                frame_2.memoria_part=2; 
            break;
            case X_DISCRIMINATEDVALUE:                                          //X - VALOR_DISCRIMINADO
                //('___valordiscriminadoL2___');
                frame_2.supplier_position=data[next_position];  //posicion2 surtidor
                L2_request=data.charCodeAt(data[next_position]);   //posicion surtidor                
                //('>>Posicion surtidor:'+frame_2.supplier_position);                   
                next_position=next_position+3;              
                for(x=0;x<=7;x++){          //numero de venta
                    frame_2.sales_number[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Numero de venta:'+frame_2.sales_number); 
                next_position=next_position+9;                  
                for(x=0;x<=1;x++){  //tipo de forma de pago
                    frame_2.type_of_payment[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Tipo de forma de pago:'+frame_2.type_of_payment); 
                next_position=next_position+3;               
                frame_2.consultation_sale=data[next_position];     //venta consulta
                //('>>Venta consulta:'+frame_2.consultation_sale); 
                next_position=next_position+2;               
                for(x=0;x<=7;x++){          //valor discriminado
                    frame_2.discrim_value[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Valor discriminado:'+frame_2.discrim_value);   
                next_position=next_position+9;       
                for(x=0;x<=19;x++){          //serial id
                    frame_2.serial_id[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Serial id:'+frame_2.serial_id); 
                TableNumber=discriminateSale_tableL2;
                frame_2.plot_number='2';                  
                dataOK=true;   
                frame_2.memoria_part=2; 
            break;
            case X_CREDITBASKET:                                                //X - CREDITO_CANASTA
                //('___creditocanastaL2___');
                frame_2.supplier_position=data[next_position];  //posicion2 surtidor
                var L2supplier_positionD=data.charCodeAt(next_position);   //posicion surtidor  
                L2_request=data.charCodeAt(data[next_position]);   //posicion surtidor                
                //('>>Posicion surtidor:'+frame_2.supplier_position);
                next_position=next_position+3;                   
                for(x=0;x<=9;x++){          //kilometraje
                    frame_2.mileage[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Kilometraje:'+frame_2.mileage);
                next_position=next_position+11;                   
                frame_2.type_of_customer_identification=data[next_position];  //tipo de identificacion
                //('>>Tipo de identificacion:'+frame_2.type_of_customer_identification);
                next_position=next_position+2;                
                for(x=0;x<=19;x++){         //serial identificacion
                    frame_2.serial_id[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Serial ID:'+frame_2.serial_id);
                next_position=next_position+21;                
                frame_2.type_sale =data[next_position];  //tipo venta
                //('>>Tipo venta:'+frame_2.type_sale ); 
                next_position=next_position+2;                
                frame_2.product_type =data[next_position];  //tipo de producto
                //('>>Tipo de Producto:'+frame_2.product_type);   
                if (frame_2.product_type=='0'){
                    frame_2.product_type='1';
                }
                var idpos       = L2supplier_positionD;
                var kilometraje = frame_2.mileage;
                var serial      = frame_2.serial_id;
                var tipo_venta  = parseFloat(frame_2.type_sale);
                if(frame_2.product_type=='0'){
                   frame_2.product_type='1'; 
                }                
                var grado       = frame_2.product_type;
                pg.connect(conString, function(err, client, done){
                    if(err){
						return console.error('error de conexion 1', err);                                
                    }else{
                        client.query(sprintf("UPDATE preset SET  kilometraje='%1$s', serial='%2$s', tipo_venta='%3$s', grado='%4$s' where id_pos = 2" ,kilometraje,serial,tipo_venta,grado ), function(err,result){

                            done();
                            if(err){
								return console.error('error de conexion 2', err);                            
                            }else{
                            } 
                        });
                    }
                });
                Tablenumbercredit=creditbasket_tableL2;                 
                frame_2.plot_number='2';                  
                dataOK=true;   
                frame_2.memoria_part=2;                 
            break;    
            case X_TOTAL_ELECTRONIC:                                            //X_TOTALES_ELECTRONICOS
                //('___totaleselectronicosL2___');
                frame_2.supplier_position=data[next_position];  //posicion2 surtidor
                //('>>Posicion surtidor:'+frame_2.supplier_position);
                next_position=next_position+3;                 
                for(x=0;x<=12;x++){          //total volumen prod.1_lado1
                    frame_2.total_volume_P1l1[x]=data.charCodeAt(x+next_position);
                    if(frame_2.total_volume_P1l1[x]===44){
                        frame_2.total_volume_P1l1[x]=46;
                    }                       
                } 
                //('>>Total volumen prod.1_lado1:'+frame_2.total_volume_P1l1); 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero prod.1 lado1
                    frame_2.total_money_P1l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero prod.1 lado1:'+frame_2.total_money_P1l1);
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu prod.1 lado1
                    frame_2.ppu_P1l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu prod.1 lado1:'+frame_2.ppu_P1l1);
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen pro.2 lado1
                    frame_2.total_volume_P2l1[x]=data.charCodeAt(x+next_position); 
                    if(frame_2.total_volume_P2l1[x]===44){
                        frame_2.total_volume_P2l1[x]=46;
                    }                      
                } 
                //('>>Total volumen pro.2 lado1:'+frame_2.total_volume_P2l1);  
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero prod.2 lado1
                    frame_2.total_money_P2l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero prod.2 lado1:'+frame_2.total_money_P2l1);    
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu prod.2 lado1
                    frame_2.ppu_P2l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu prod.1 lado1:'+frame_2.ppu_P2l1); 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen prod.3 lado1
                    frame_2.total_volume_P3l1[x]=data.charCodeAt(x+next_position);
                    if(frame_2.total_volume_P3l1[x]===44){
                        frame_2.total_volume_P3l1[x]=46;
                    }                      
                } 
                //('>>Total volumen prod.3 lado1:'+frame_2.total_volume_P3l1);   
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero prod.3 lado1
                    frame_2.total_money_P3l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero prod.3 lado1:'+frame_2.total_money_P3l1);
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu prod.3 lado1
                    frame_2.ppu_P3l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu prod.3 lado1:'+frame_2.ppu_P3l1);  
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen prod.4 lado1
                    frame_2.total_volume_P4l1[x]=data.charCodeAt(x+next_position); 
                    if(frame_2.total_volume_P4l1[x]===44){
                        frame_2.total_volume_P4l1[x]=46;
                    }                        
                } 
                //('>>Total volumen prod.4 lado1:'+frame_2.total_volume_P4l1);
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero prod.4 lado1
                    frame_2.total_money_P4l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero prod.4 lado1:'+frame_2.total_money_P4l1); 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu prod.4 lado1
                    frame_2.ppu_P4l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu prod.4 lado1:'+frame_2.ppu_P4l1);
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen prod.1 lado2
                    frame_2.total_volume_P1l2[x]=data.charCodeAt(x+next_position);
                    if(frame_2.total_volume_P1l2[x]===44){
                        frame_2.total_volume_P1l2[x]=46;
                    }                          
                } 
                //('>>Total volumen prod.1 lado2:'+frame_2.total_volume_P1l2); 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero prod.1 lado2
                    frame_2.total_money_P1l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero prod.1 lado2:'+frame_2.total_money_P1l2); 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu prod.1 lado2
                    frame_2.ppu_P1l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu prod.1 lado2:'+frame_2.ppu_P1l2);
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen pro.2 lado2
                    frame_2.total_volume_P2l2[x]=data.charCodeAt(x+next_position); 
                    if(frame_2.total_volume_P2l2[x]===44){
                        frame_2.total_volume_P2l2[x]=46;
                    }                      
                } 
                //('>>Total volumen pro.2 lado2:'+frame_2.total_volume_P2l2);
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero prod.2 lado2
                    frame_2.total_money_P2l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero prod.2 lado2:'+frame_2.total_money_P2l2);    
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu prod.2 lado2
                    frame_2.ppu_P2l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu prod.2 lado2:'+frame_2.ppu_P2l2); 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen prod.3 lado2
                    frame_2.total_volume_P3l2[x]=data.charCodeAt(x+next_position); 
                    if(frame_2.total_volume_P3l2[x]===44){
                        frame_2.total_volume_P3l2[x]=46;
                    }                         
                } 
                //('>>Total volumen prod.3 lado2:'+frame_2.total_volume_P3l2); 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero prod.3 lado2
                    frame_2.total_money_P3l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero prod.3 lado2:'+frame_2.total_money_P3l2); 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu prod.3 lado2
                    frame_2.ppu_P3l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu prod.3 lado2:'+frame_2.ppu_P3l2);  
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen prod.4 lado2
                    frame_2.total_volume_P4l2[x]=data.charCodeAt(x+next_position);
                    if(frame_2.total_volume_P4l2[x]===44){
                        frame_2.total_volume_P4l2[x]=46;
                    }                      
                } 
                //('>>Total volumen prod.4 lado2:'+frame_2.total_volume_P4l2);  
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero prod.4 lado2
                    frame_2.total_money_P4l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero prod.4 lado2:'+frame_2.total_money_P4l2);  
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu prod.4 lado2
                    frame_2.ppu_P4l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu prod.4 lado2:'+frame_2.ppu_P4l2);
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var totalmanguera1   = parseFloat(frame_2.total_volume_P1l1);
                        var totalmanguera2   = parseFloat(frame_2.total_volume_P2l1);
                        var totalmanguera3   = parseFloat(frame_2.total_volume_P3l1);
                        var totalmanguera4   = parseFloat(frame_2.total_volume_P4l1);
                        var dineromanguera1  = parseFloat(frame_2.total_money_P1l1);
                        var dineromanguera2  = parseFloat(frame_2.total_money_P2l1);
                        var dineromanguera3  = parseFloat(frame_2.total_money_P3l1);
                        var dineromanguera4  = parseFloat(frame_2.total_money_P4l1);
                        //(new Date());
                        client.query(sprintf("UPDATE totales SET totalmanguera1 ='%1$s', totalmanguera2 = '%2$s' , totalmanguera3 ='%3$s',totalmanguera4 ='%4$s',dineromanguera1 ='%5$s', dineromanguera2 ='%6$s', dineromanguera3 = '%7$s', dineromanguera4='%6$s' WHERE pk_id_posicion=1",totalmanguera1,totalmanguera2,totalmanguera3,totalmanguera4,dineromanguera1,dineromanguera2,dineromanguera3,dineromanguera4),function(err,result){
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });                  
                frame_2.plot_number='2';                  
                dataOK=true;   
                frame_2.memoria_part=2;                 
            break;    
            case X_PROD_IDENTI_BASKET:                                          //X_IDENTIFICACIONPRODUCTO_CANASTA
                //('___identificacioncanastaL2___');
                frame_2.supplier_position=data[next_position];  //posicion2 surtidor
                L2_request=data.charCodeAt(data[next_position]);   //posicion surtidor                   
                //('>>Posicion surtidor:'+frame_2.supplier_position); 
                next_position=next_position+3;                
                for(x=0;x<=19;x++){          //serial producto
                    frame_2.serial_product[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Serial producto:'+frame_2.serial_product);
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var serial   = frame_2.serial_product;
                        client.query(sprintf("INSERT INTO venta_canasta (serial,idposicionc,lecturacanasta) VALUES ('%1$s','%2$s','%3$s')",serial,2,0),function(err,result){                        
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });                                  
                TableNumber=basket_tableL2;                
                frame_2.plot_number='2';                  
                dataOK=true;   
                frame_2.memoria_part=2;  
            break;    
            case X_SALESORDERBASKE:                                             //X_FINVENTA_CANASTA
                //('___finventacanastaL2___');
                frame_2.supplier_position=data[next_position];  //posicion2 surtidor
                //('>>Posicion surtidor:'+frame_2.supplier_position); 
                next_position=next_position+3;                  
                frame_2.type_sale=data[next_position];  //tipo de venta
                //('>>Tipo de venta:'+frame_2.type_sale); 
                next_position=next_position+2;                
                for(x=0;x<=19;x++){          //serial producto1
                    frame_2.serialP1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Serial producto1:'+frame_2.serialP1);
                next_position=next_position+21;                
                for(x=0;x<=2;x++){          //cantidad producto1
                    frame_2.quantityP1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Cantidad producto1:'+frame_2.quantityP1);   
                next_position=next_position+4;                
                for(x=0;x<=7;x++){          //valor total producto1
                    frame_2.total_valueP1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Valor total producto1:'+frame_2.total_valueP1);     
                next_position=next_position+9;                
                for(x=0;x<=19;x++){          //serial producto2
                    frame_2.serialP2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Serial producto2:'+frame_2.serialP2); 
                next_position=next_position+21;                
                for(x=0;x<=2;x++){          //cantidad producto2
                    frame_2.quantityP2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Cantidad producto2:'+frame_2.quantityP2); 
                next_position=next_position+4;                
                for(x=0;x<=7;x++){          //valor total producto2
                    frame_2.total_valueP2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Valor total producto2:'+frame_2.total_valueP2); 
                next_position=next_position+9;                
                for(x=0;x<=19;x++){          //serial producto3
                    frame_2.serialP3[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Serial producto3:'+frame_2.serialP3);  
                next_position=next_position+21;                
                for(x=0;x<=2;x++){          //cantidad producto3
                    frame_2.quantityP3 [x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Cantidad producto3:'+frame_2.quantityP3 );   
                next_position=next_position+4;                
                for(x=0;x<=7;x++){          //valor total producto3
                    frame_2.total_valueP3[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Valor total producto3:'+frame_2.total_valueP3); 
                next_position=next_position+9;                
                for(x=0;x<=8;x++){          //total venta canasta
                    frame_2.sellout_basket[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total venta canasta:'+frame_2.sellout_basket);
                next_position=next_position+10;                
                for(x=0;x<=13;x++){          //fecha hora fin venta
                    frame_2.date_hour[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Fecha hora fin venta:'+frame_2.date_hour); 
                next_position=next_position+15;                
                frame_2.type_of_customer_identification=data[next_position];  //tipo de identificacion
                //('>>Tipo de identificacion:'+frame_2.type_of_customer_identification);   
                next_position=next_position+2;                
                for(x=0;x<=19;x++){          //identificacion cliente
                    frame_2.customer_identification[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Identificacion cliente:'+frame_2.customer_identification);  
                next_position=next_position+21;                 
                frame_2.islero_typeid=data[next_position];  //tipo de identificacion islero
                //('>>Tipo de identificacion islero:'+frame_2.islero_typeid);                  
                next_position=next_position+2;                 
                for(x=0;x<=19;x++){          //identificacion islero
                    frame_2.isleroid[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Identificacion islero:'+frame_2.isleroid);

                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var tipoventacanasta    = frame_2.type_sale;
                        var serial              = frame_2.serialP1;
                        var cantidadvendida     = frame_2.quantityP1;
                        var valormux            = frame_2.total_valueP1;
                        client.query(sprintf("INSERT INTO finventacanasta (tipoventacanasta,cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s','%6$s')",tipoventacanasta,cantidadvendida,valormux,2,1,serial),function(err,result){                        
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });                   
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var serial              = frame_2.serialP2;
                        var cantidadvendida     = frame_2.quantityP2;
                        var valormux            = frame_2.total_valueP2;
                        client.query(sprintf("INSERT INTO finventacanasta (cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",cantidadvendida,valormux,2,2,serial),function(err,result){                        
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });                
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var serial              = frame_2.serialP3;
                        var cantidadvendida     = frame_2.quantityP3;
                        var valormux            = frame_2.total_valueP3;
                        client.query(sprintf("INSERT INTO finventacanasta (cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",cantidadvendida,valormux,2,3,serial),function(err,result){                        
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });                            
                //estado de fin venta para diego
                for(x=0;x<=4;x++){
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{
                            client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",18),function(err,result){
                                done();
                                if(err){
                                    return console.error('Error de conexion', err);
                                }else{
                                }
                            });
                        }
                    });                               
                }
                frame_2.plot_number='2';                  
                dataOK=true;   
                frame_2.memoria_part=2;                  
            break;    
            case X_APPROPRIATIONS:                                              //X_CONSIGNACIONES
                //('___consignacionesL2___');
                frame_2.supplier_position=data[next_position];  //posicion2 surtidor
                var L2supplier_positionD=data.charCodeAt(next_position);   //posicion surtidor  
                L2_request=data.charCodeAt(data[next_position]);   //posicion surtidor                
                //('>>Posicion surtidor:'+frame_2.supplier_position);       
                next_position=next_position+3;                 
                for(x=0;x<=9;x++){          //valor consignacion
                    frame_2.consignmentvalue[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Valor consignacion:'+frame_2.consignmentvalue);
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var idpos               = frame_2.supplier_position;                         
                        var valorconsignacion   = frame_2.consignmentvalue;
                        client.query(sprintf("UPDATE consignaciones SET valorconsignacion = '%1$s',idpos = '%2$s' ",valorconsignacion,2),function(err,result){
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });
                Tablenumberconsign=consign_tableL2;
                //TableNumber=consign_tableL2;                
                frame_2.plot_number='2';                  
                dataOK=true;   
                frame_2.memoria_part=2;   
            break;    
            case X_PRINTERSETUP:                                                //CONFIGURACIONIMPRESORAS
                //('___configuracionimpresorasL2___');
                frame_2.supplier_position=data[next_position];  //posicion2 surtidor
                //('>>Posicion surtidor:'+frame_2.supplier_position);   
                next_position=next_position+3;                  
                frame_2.printer1=data[next_position];  //impresora1
                //('>>Impresora1:'+frame_2.printer1); 
                next_position=next_position+2;                
                frame_2.printer2=data[next_position];  //impresora2
                //('>>Impresora2:'+frame_2.printer2); 
                frame_2.plot_number='2';                  
                dataOK=true;   
                frame_2.memoria_part=2;  
            break; 
            case X_TURN:                                                        //X_TURNO
                //('___turnoL2___');
                frame_2.supplier_position=data[next_position];  //posicion2 surtidor
                L2_request=data.charCodeAt(data[next_position]);   //posicion surtidor                
                //('>>Posicion surtidor:'+frame_2.supplier_position);   
                next_position=next_position+3;                  
                frame_2.openclose_turn=data[next_position];  //turno. abrir cerrar
                //('>>Turno. abrir cerrar:'+frame_2.openclose_turn);
                next_position=next_position+2;                
                frame_2.type_of_vendor_ID=data[next_position];  //tipo identificacion vendedor
                //('>>Tipo identificacion vendedor:'+frame_2.type_of_vendor_ID); 
                next_position=next_position+2;                
                for(x=0;x<=19;x++){          //serial vendedor
                    frame_2.serial_seller[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Serial vendedor:'+frame_2.serial_seller);   
                next_position=next_position+21;               
                for(x=0;x<=3;x++){          //contraseña
                    frame_2.password[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Contraseña:'+frame_2.password); 
                next_position=next_position+5;               
                for(x=0;x<=12;x++){          //total volumen producto1 pos1
                    frame_2.total_volume_P1l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total volumen producto1 pos1:'+frame_2.total_volume_P1l1);   
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero producto1 pos1 
                    frame_2.total_money_P1l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero producto1 pos1:'+frame_2.total_money_P1l1); 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu producto1 pos1  
                    frame_2.ppu_P1l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu producto1 pos1:'+frame_2.ppu_P1l1); 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen producto2 pos1
                    frame_2.total_volume_P2l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total volumen producto2 pos1:'+frame_2.total_volume_P2l1);  
                next_position=next_position+14;
                for(x=0;x<=12;x++){          //total dinero producto2 pos1
                    frame_2.total_money_P2l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero producto2 pos1:'+frame_2.total_money_P2l1);   
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu producto2 pos1  
                    frame_2.ppu_P2l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu producto2 pos1:'+frame_2.ppu_P2l1);
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen producto3 psos1
                    frame_2.total_volume_P3l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total volumen producto3 pos1:'+frame_2.total_volume_P3l1);
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero producto3 pos1
                    frame_2.total_money_P3l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero producto3 pos1:'+frame_2.total_money_P3l1);
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu producto3 pos1   
                    frame_2.ppu_P3l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu producto3 pos1 :'+frame_2.ppu_P3l1);
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen producto4 pos1  
                    frame_2.total_volume_P4l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total volumen producto4 pos1:'+frame_2.total_volume_P4l1);
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero pruducto4 pos1
                    frame_2.total_money_P4l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero pruducto4 pos1:'+frame_2.total_money_P4l1);
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu producto4 pos1   
                    frame_2.ppu_P4l1[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu producto4 pos1:'+frame_2.ppu_P4l1);   
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen producto1 pos2   
                    frame_2.total_volume_P1l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>total volumen producto1 pos2:'+frame_2.total_volume_P1l2);
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero producto1 pos2
                    frame_2.total_money_P1l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero producto1 pos2:'+frame_2.total_money_P1l2);   
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu producto1 pos2   
                    frame_2.ppu_P1l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu producto1 pos2:'+frame_2.ppu_P1l2);  
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen producto2 pos2  
                    frame_2.total_volume_P2l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total volumen producto2 pos2:'+frame_2.total_volume_P2l2);
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero producto2 pos2
                    frame_2.total_money_P2l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero producto2 pos2:'+frame_2.total_money_P2l2); 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu producto2 pos2    
                    frame_2.ppu_P2l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu producto2 pos2:'+frame_2.ppu_P2l2);    
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen producto3 pos2  
                    frame_2.total_volume_P3l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total volumen producto3 pos2:'+frame_2.total_volume_P3l2);
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total dinero producto3 pos2 
                    frame_2.total_money_P3l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total dinero producto3 pos2:'+frame_2.total_money_P3l2); 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu producto3 pos2   
                    frame_2.ppu_P3l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu producto3 pos2:'+frame_2.ppu_P3l2);  
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          //total volumen producto4 pos2  
                    frame_2.total_volume_P4l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total volumen producto4 pos2:'+frame_2.total_volume_P4l2);
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //ppu producto4 pos2  
                    frame_2.total_money_P4l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu producto4 pos2:'+frame_2.total_money_P4l2); 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          //ppu producto4 pos2   
                    frame_2.ppu_P4l2[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>ppu producto4 pos2:'+frame_2.ppu_P4l2);    
                next_position=next_position+7;                
                for(x=0;x<=13;x++){          //fecha / hora turno   
                    frame_2.date_hour[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>fecha / hora turno:'+frame_2.date_hour); 
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        var usuario     = parseFloat(frame_2.serial_seller);
                        var contraseña  = frame_2.password;
                        client.query(sprintf("UPDATE turno SET usuario ='%1$s', contraseña = '%2$s'",usuario,contraseña),function(err,result){
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });   
                    }
                }); 
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{
                        client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",7),function(err,result){
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{
                            }
                        });
                    }
                });
                //('>>EstadoL2 7 para BGE2');                  
                TableNumber=turnopenclose_table;                      
                frame_2.plot_number='2';                  
                dataOK=true;   
                frame_2.memoria_part=2; 
            break;  
            case X_HANDLEUP:                                                    //X_SUBAMANIJA
                //('___subamanijaL2___');
                frame_2.supplier_position=data[next_position];  //posicion2 surtidor  
                var L2supplier_positionD=data.charCodeAt(next_position);   //posicion surtidor                 
                //('>>Posicion surtidor:'+frame_2.supplier_position); 
                next_position=next_position+3;                   
                frame_2.preset_type=data[next_position];  //tipo de preset
                //('>>Tipo de preset:'+frame_2.preset_type);
                next_position=next_position+2;                
                for(x=0;x<=7;x++){          //valor preset digitado
                    frame_2.preset_value[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Valor preset digitado:'+frame_2.preset_value);  
                next_position=next_position+9;                
                frame_2.selected_product=data[next_position];  //tipo de producto
                //('>>Tipo de producto :'+frame_2.selected_product);  
                next_position=next_position+2;                
                for(x=0;x<=12;x++){          //total de volumen anterior
                    frame_2.total_previous_volume[x]=data.charCodeAt(x+next_position);
                    if(frame_2.total_previous_volume[x]===44){
                        frame_2.total_previous_volume[x]=46;
                    }                    
                } 
                //('>>Total de volumen anterior:'+frame_2.total_previous_volume);  
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          //total de dinero anterior
                    frame_2.total_money_previous[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total de dinero anterior:'+frame_2.total_money_previous); 
                next_position=next_position+14;   
                
                //next_position=next_position+1;
                for(x=0;x<=5;x++){     //total ppu posterior ////dato original x<=5
                    frame_2.previous_PPU[x]=data.charCodeAt(x+next_position);     
                } 
                //('>>Total ppu anterior:'+frame_2.previous_PPU);
                var idpos       = L2supplier_positionD;
                var tipo_p      = frame_2.preset_type;
                var valor_p     = frame_2.preset_value;
                var totalesdin  = parseFloat(frame_2.total_money_previous);
                var totalesvol  = parseFloat(frame_2.total_previous_volume);
                var ppu         = frame_2.previous_PPU;
                var grado       = parseFloat(frame_2.selected_product); 
                var kilometraje = '0';
                var serial      = '0'; 
                var estado      = 23;
                pg.connect(conString, function(err, client, done){
                    if(err){
						return console.error('error de conexion 1', err);                                
                    }else{
                        client.query(sprintf("UPDATE preset SET tipo_p='%2$s', valor_p='%3$s', totalesdin='%4$s', totalesvol='%5$s', ppu='%6$s', grado='%7$s', kilometraje='%8$s', serial='%9$s' where id_pos= '%1$s'   " ,2,tipo_p,valor_p,totalesdin,totalesvol,ppu,grado,kilometraje,serial ), function(err,result){
                            done();
                            if(err){
								return console.error('error de conexion 2', err);                            
                            }else{
                            } 
                            //TableNumber=0;//permite no volver a leer las dos tablas de configuraciones y ppu porque ya inicio sistema                                       
                        });
                        for(x=0;x<=4;x++){                        
                            client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",estado),function(err,result){
                                done();
                                if(err){
                                    return console.error('Error de conexion', err);
                                }else{
                                }
                            });  
                        }
                    }
                });                            
                frame_2.plot_number='2';                  
                dataOK=true;   
                frame_2.memoria_part=2; 
            break;    
        
            case RESET_RESET:
                switch (data[12]) {
                    case '0':                                                   //recibio el mux la trama mal de fin venta
                        //('Error envio posicionL2:'+data[9]);
                        switch(frame_2.memoria_part){                           //pregunta por los ultimos datos enviados en la parte2 de la trama
                            case 1:
                                frame_2.plot_number='1';                                  
                                dataOK=true;                                  
                            break;
                            case 2:
                                frame_2.plot_number='2';                                 
                                dataOK=true;                                  
                            break;
                            default:
                        }
                    break;
                    case '1':                                                   //recibio el mux la trama bien de fin venta
                        //('Correcto envio posicionL2:'+data[9]);  
                        frame_2.memoria_part=0;
                        frame_2.plot_number= Frame_2ready;                        
                        dataOK=true;
                        switch(TableNumber){
                            case not_readtable:
                                TableNumber=0;//permite no volver a leer las dos tablas de configuraciones y ppu porque ya inicio sistema                             
                            break;
                            default:
                        }                        
                    break;                    
                    default:
                }                    
            break;   
            default:
        }     
                
        if(dataOK==true){                                                       // si hay datos para enviar al MUX
            switch(frame_1.plot_number){                                        //tipo de trama1 a enviar segun el caso del identificador
                case 'a':
                    muxport.write('MUX'+frame_1.supplier_position+'N;&');                    
                    //("<<MUX"+frame_1.supplier_position+"N;&"); 
                break;
                case '1':
                    muxport.write('MUX'+frame_1.supplier_position+'N;&');
                    //("<<MUX"+frame_1.supplier_position+"N;&");                       
                break;   
                case '2':
                    muxport.write('MUX'+frame_1.supplier_position+'Y;&');
                    //("<<MUX"+frame_1.supplier_position+"Y;&");                    
                break;
                case Frame_1ready:
                    frame_1.reset_good=true;//                    
                    if(frame_1.plot_number==Frame_1ready && frame_2.plot_number!=Frame_2ready){// se ejecuta para no enviar datos en caso de reset para las dos tramas enviadas               
                        muxport.write('MUX'+frame_1.supplier_position+'N;&');
                        //("<<MUX"+frame_1.supplier_position+"N;&");                        
                    }
                break;    
                default:
                //code
            }
            switch (frame_2.plot_number) {                                      //tipo de trama2 a enviar segun el caso del identificador
                case '1':
                    muxport.write(frame_2.supplier_position+'N;&*');
                    //(frame_2.supplier_position+"N;&*");                     
                break;
                case '2':
                    muxport.write(frame_2.supplier_position+'Y;&*');
                    //(frame_2.supplier_position+"Y;&*");                     
                break; 
                
                case Frame_2ready:
                    frame_2.reset_good=true;
                    if(frame_1.plot_number!=Frame_1ready && frame_2.plot_number==Frame_2ready){// se ejecuta para no enviar datos ya que las dos tramasque se envian estan bien                    
                        muxport.write(frame_2.supplier_position+'N;&*');
                        //(frame_2.supplier_position+"N;&*");                     
                    }
                break;    
                
                default:
                    // code
            }
            if(frame_1.reset_good==true && frame_2.reset_good==true){           // no llegan mas datos del mux ni se envian del bbb
                dataOK=false;
                frame_1.reset_good=false;
                frame_2.reset_good=false;
                frame_1.plot_number='0';
                frame_2.plot_number='0';
                //("<<No hay datos para enviarL1Yl2*");                 
            }
            
        }   
        
    }
    
}



/*
*********************************************************************************************************
*                                function number_process_rxmux()
*
* Description : Revisa la cantidad de datos recibidos en toda la trama y la distribuye segun sea el caso de recepcion
*               
*********************************************************************************************************
*/

function number_process_rxmux(accountant,accountant_2,identifier){
    
    if(accountant==9  && accountant_2==6){      // ESTADO - ESTADO || RESET - RESET
        if(identifier=='a'){
            type_of_reception=STATE_STATE;
        }
        if(identifier=='c'){
            type_of_reception=RESET_RESET;
        } 
    }
    switch (accountant) {
        case 9:
            switch (accountant_2) {
                case 227:// ESTADO - FINVENTA
                    type_of_reception=STATE_SALESORDER;                    
                break;
                case 18:// ESTADO - DISCRIMINAR FORMA DE PAGO(#venta) 
                    type_of_reception=STATE_DISCRIMINATESALE;                    
                break;
                case 48://ESTADO - VALOR_DISCRIMINADO
                    type_of_reception=STATE_DISCRIMINATEVALUE;                    
                break;  
                case 42://ESTADO - CREDITOCANASTA 
                    type_of_reception=STATE_CREDITBASKET;                    
                break;   
                case 25://ESTADO - IDENTIFICACIONPRODUCTO_CANASTA
                    type_of_reception=STATE__PROD_IDENTI_BASKET;                     
                break;   
                case 179:// ESTADO - FINVENTACANASTA  156
                    type_of_reception= STATE_SALESORDERBASKE;                 
                break;
                case 15://ESTADO - CONSIGNACIONES 
                    type_of_reception= STATE_APPROPRIATIONS;
                break;  
                case 8://ESTADO - CONFIGURACIONIMPRESORAS 
                    type_of_reception= STATE_PRINTERSETUP;
                break;   
                case 329://ESTADO -TURNO
                    type_of_reception= STATE_TURN;                    
                break;
                case 52:
                    type_of_reception=STATE_HANDLEUP;
                break;    
                default:
            }
        break;
        case 230:
            switch (accountant_2) {
                case 6:// FINVENTA - ESTADO
                    type_of_reception=SALESORDER_STATE; 
                break;
                case 227:// FINVENTA - FINVENTA
                    type_of_reception=SALESODER_SALESORDER;                    
                break; 
                case 18:// FINVENTA - DISCRIMINAR FORMA DE PAGO(#venta) 
                    type_of_reception=SALESORDER_DISCRIMINATESALE;                    
                break;  
                case 48://FINVENTA - VALOR_DISCRIMINADO
                    type_of_reception=SALESORDER_DISCRIMINATEVALUE;                    
                break; 
                case 40://FINVENTA - CREDITOCANASTA 
                    type_of_reception=SALESORDER_CREDITBASKET;                
                default:
                case 25://FINVENTA - IDENTIFICACIONPRODUCTO_CANASTA
                    type_of_reception=SALESORDER__PROD_IDENTI_BASKET;                    
                break;
                case 179://FINVENTA - FINVENTACANASTA
                    type_of_reception= SALESORDER_SALESORDERBASKE;                 
                break; 
                case 15://FINVENTA - CONSIGNACIONES 
                    type_of_reception= SALESORDER_APPROPRIATIONS;
                break;
                case 8://FINVENTA - CONFIGURACIONIMPRESORAS 
                    type_of_reception= SALESORDER_PRINTERSETUP;
                break;   
                case 52:
                    type_of_reception=SALESORDER_HANDLEUP;
                break;                  
            }
        break;  
        case 21:
            switch (accountant_2) {
                case 6:// DISCRIMINAR FORMA DE PAGO(#venta) - ESTADO
                    type_of_reception=DISCRIMINATESALE_STATE;                    
                break;
                case 227:// DISCRIMINAR FORMA DE PAGO(#venta) - FINVENTA
                    type_of_reception=DISCRIMINATESALE_SALESORDER;                
                break;
                case 18://DISCRIMINAR FORMA DE PAGO(#venta) - DISCRIMINAR FORMA DE PAGO(#venta)
                    type_of_reception=DISCRIMINATESALE_DISCRIMINATESALE;                    
                break;  
                case 48://DISCRIMINAR FORMA DE PAGO(#venta) - VALOR_DISCRIMINADO
                    type_of_reception=DISCRIMINATESALE_DISCRIMINATEVALUE;                    
                break;
                case 40://DISCRIMINAR FORMA DE PAGO(#venta) - CREDITOCANASTA
                    type_of_reception=DISCRIMINATESALE_CREDITBASKET;                    
                break;   
                case 25://DISCRIMINAR FORMA DE PAGO(#venta) - IDENTIFICACIONPRODUCTO_CANASTA
                    type_of_reception=DISCRIMINATESALE__PROD_IDENTI_BASKET;                    
                break;
                case 179://DISCRIMINAR FORMA DE PAGO(#venta) - FINVENTACANASTA
                    type_of_reception= DISCRIMINATESALE_SALESORDERBASKE;                 
                break; 
                case 15://DISCRIMINAR FORMA DE PAGO(#venta) - CONSIGNACIONES 
                    type_of_reception= DISCRIMINATESALE_APPROPRIATIONS;
                break;    
                case 8://DISCRIMINAR FORMA DE PAGO(#venta) - CONFIGURACIONIMPRESORAS 
                    type_of_reception= DISCRIMINATESALE_PRINTERSETUP;
                break;   
                case 52:
                    type_of_reception=DISCRIMINATESALE_HANDLEUP;
                break;                  
                default:
            }
        break;   
        case 51:
            switch (accountant_2) {
                case 6://VALOR_DISCRIMINADO -  ESTADO
                    type_of_reception=DISCRIMINATEDVALUE_STATE;
                break;
                case 227://VALOR_DISCRIMINADO -  FIN_VENTA
                    type_of_reception=DISCRIMINATEDVALUE_SALESORDER;                    
                break;    
                case 18://VALOR_DISCRIMINADO - DISCRIMINAR FORMA DE PAGO(#venta)
                    type_of_reception=DISCRIMINATEDVALUE_DISCRIMINATESALE;                    
                break;    
                case 48://VALOR_DISCRIMINADO - VALOR_DISCRIMINADO
                    type_of_reception=DISCRIMINATEDVALUE_DISCRIMINATEDVALUE;                    
                break;
                case 40://VALOR_DISCRIMINADO - CREDITOCANASTA
                    type_of_reception=DISCRIMINATEDVALUE_CREDITBASKET;                    
                break;  
                case 25://VALOR_DISCRIMINADO -IDENTIFICACIONPRODUCTO_CANASTA
                    type_of_reception=DISCRIMINATEDVALUE__PROD_IDENTI_BASKET;                     
                break;    
                case 179://VALOR_DISCRIMINADO - FINVENTACANASTA
                    type_of_reception= DISCRIMINATEDVALUE_SALESORDERBASKE;                 
                break; 
                case 15://VALOR_DISCRIMINADO - CONSIGNACIONES 
                    type_of_reception= DISCRIMINATEDVALUE_APPROPRIATIONS;
                break;    
                case 8://VALOR_DISCRIMINADO - CONFIGURACIONIMPRESORAS 
                    type_of_reception= DISCRIMINATEDVALUE_PRINTERSETUP;
                break;    
                case 52:
                    type_of_reception=DISCRIMINATEDVALUE_HANDLEUP;
                break;                  
                default:
            }
        break;   
        case 45:             ///////////////////////43
            switch (accountant_2) {
                case 6://CREDITO_CANASTA - ESTADO
                    type_of_reception=CREDITBASKET_STATE;
                break;
                case 227://CREDITOCANASTA - FINVENTA
                    type_of_reception=CREDITBASKET_SALESORDER;                    
                break;
                case 18://CREDITOCANASTA - DISCRIMINAR FORMA DE PAGO(#venta)
                    type_of_reception=CREDITBASKET_DISCRIMINATESALE;                    
                break;
                case 48://CREDITOCANASTA - VALOR_DISCRIMINADO
                    type_of_reception=CREDITBASKET_DISCRIMINATEDVALUE;                    
                break;
                case 40://CREDITOCANASTA - CREDITOCANASTA
                    type_of_reception=CREDITBASKET_CREDITBASKET;                    
                break; 
                case 25://CREDITOCANASTA - IDENTIFICACIONPRODUCTO_CANASTA
                    type_of_reception=CREDITBASKET__PROD_IDENTI_BASKET; 
                break;    
                case 179://CREDITOCANASTA - FINVENTACANASTA
                    type_of_reception= CREDITBASKET_SALESORDERBASKE;                 
                break;     
                case 15://CREDITOCANASTA - CONSIGNACIONES 
                    type_of_reception= CREDITBASKET_APPROPRIATIONS;
                break;      
                case 8://CREDITOCANASTA - CONFIGURACIONIMPRESORAS 
                    type_of_reception= CREDITBASKET_PRINTERSETUP;
                break;   
                case 52:
                    type_of_reception=CREDITBASKET_HANDLEUP;
                break;                  
                default:                
            }
        break;    
        case 287:            
            switch (accountant_2) {// este solo tiene un caso ya que se solita totales electronicos por ende se da solo la trama= totales_electronicos - totales_electronicos
                case 284://TOTALES_ELECTRONICOS - TOTALES_ELECTRONICOS
                    type_of_reception=TOTAL_ELECTRONIC_TOTAL_ELECTRONIC;
                break;
                default:
            }
        break;
        case 28:
            switch (accountant_2) {
                case 6://IDENTIFICACIONPRODUCTO_CANASTA - ESTADO  
                    type_of_reception=PROD_IDENTI_BASKET__STATE;
                break;  
                case 227://IDENTIFICACIONPRODUCTO_CANASTA - FINVENTA
                    type_of_reception=PROD_IDENTI_BASKET__SALESORDER;  
                break;
                case 18://IDENTIFICACIONPRODUCTO_CANASTA - DISCRIMINAR FORMA DE PAGO(#venta)
                    type_of_reception=PROD_IDENTI_BASKET__DISCRIMINATESALE;                    
                break;
                case 48://IDENTIFICACIONPRODUCTO_CANASTA - VALOR_DISCRIMINADO
                    type_of_reception=PROD_IDENTI_BASKET__DISCRIMINATEDVALUE;                    
                break;   
                case 40://IDENTIFICACIONPRODUCTO_CANASTA - CREDITOCANASTA
                    type_of_reception=PROD_IDENTI_BASKET__CREDITBASKET;                    
                break;
                case 25://IDENTIFICACIONPRODUCTO_CANASTA - IDENTIFICACIONPRODUCTO_CANASTA
                    type_of_reception=PROD_IDENTI_BASKET__PROD_IDENTI_BASKET;                    
                break;     
                case 179://IDENTIFICACIONPRODUCTO_CANASTA - FINVENTACANASTA
                    type_of_reception= PROD_IDENTI_BASKET__SALESORDERBASKE;                 
                break;   
                case 15://IDENTIFICACIONPRODUCTO_CANASTA - CONSIGNACIONES 
                    type_of_reception= PROD_IDENTI_BASKET__APPROPRIATIONS;
                break;  
                case 8://IDENTIFICACIONPRODUCTO_CANASTA - CONFIGURACIONIMPRESORAS 
                    type_of_reception= PROD_IDENTI_BASKET__PRINTERSETUP;
                break;  
                case 52:
                    type_of_reception=PROD_IDENTI_BASKET__HANDLEUP;
                break;                  
                default:
            }
        break;   
        case 182://159
            switch (accountant_2) {//FINVENTACANASTA - ESTADO 
                case 6:
                    type_of_reception=SALESORDERBASKET_STATE;
                break;
                case 227://FINVENTACANASTA - FINVENTA
                    type_of_reception=SALESORDERBASKET_SALESORDER;  
                break;                
                case 18://FINVENTACANASTA - DISCRIMINAR FORMA DE PAGO(#venta)
                    type_of_reception=SALESORDERBASKET_DISCRIMINATESALE;                    
                break;  
                case 48://FINVENTACANASTA - VALOR_DISCRIMINADO
                    type_of_reception=SALESORDERBASKET_DISCRIMINATEDVALUE;                    
                break;  
                case 40://FINVENTACANASTA - CREDITOCANASTA
                    type_of_reception=SALESORDERBASKET_CREDITBASKET;                    
                break;    
                case 25://FINVENTACANASTA - IDENTIFICACIONPRODUCTO_CANASTA
                    type_of_reception=SALESORDERBASKET__PROD_IDENTI_BASKET;                    
                break;
                case 179://FINVENTACANASTA - FINVENTACANASTA
                    type_of_reception= SALESORDERBASKET_SALESORDERBASKE;                 
                break;    
                case 15://FINVENTACANASTA - CONSIGNACIONES 
                    type_of_reception= SALESORDERBASKET__APPROPRIATIONS;
                break;    
                case 8://FINVENTACANASTA - CONFIGURACIONIMPRESORAS 
                    type_of_reception= SALESORDERBASKET_PRINTERSETUP;
                break;     
                case 52:
                    type_of_reception=SALESORDERBASKET_HANDLEUP;
                break;                  
                default:
            }
        break;
        case 18:
            switch (accountant_2) {
                case 6://CONSIGNACIONES - ESTADO
                    type_of_reception=APPROPRIATIONS_STATE;
                break;
                case 227://CONSIGNACIONES - FINVENTA
                    type_of_reception=APPROPRIATIONS_SALESORDER;  
                break;                
                case 18://CONSIGNACIONES - DISCRIMINAR FORMA DE PAGO(#venta)
                    type_of_reception=APPROPRIATIONS_DISCRIMINATESALE;                    
                break;  
                case 48://CONSIGNACIONES - VALOR_DISCRIMINADO
                    type_of_reception=APPROPRIATIONS_DISCRIMINATEDVALUE;                    
                break;  
                case 40://CONSIGNACIONES - CREDITOCANASTA
                    type_of_reception=APPROPRIATIONS_CREDITBASKET;                    
                break;    
                case 25://CONSIGNACIONES - IDENTIFICACIONPRODUCTO_CANASTA
                    type_of_reception=APPROPRIATIONS__PROD_IDENTI_BASKET;                    
                break;
                case 179://CONSIGNACIONES - FINVENTACANASTA
                    type_of_reception= APPROPRIATIONS_SALESORDERBASKE;                 
                break;   
                case 15://CONSIGNACIONES - CONSIGNACIONES 
                    type_of_reception= APPROPRIATIONS_APPROPRIATIONS;
                break;    
                case 8://CONSIGNACIONES - CONFIGURACIONIMPRESORAS 
                    type_of_reception= APPROPRIATIONS_PRINTERSETUP;
                break;       
                case 52:
                    type_of_reception=APPROPRIATIONS_HANDLEUP;
                break;                  
                default:
            }
        break;
        case 11:
            switch (accountant_2) {
                case 6://CONFIGURACIONIMPRESORAS - ESTADO
                    type_of_reception=PRINTERSETUP_STATE;                
                break;
                case 227://CONFIGURACIONIMPRESORAS - FINVENTA
                    type_of_reception=PRINTERSETUP_SALESORDER;
                break;                
                case 18://CONFIGURACIONIMPRESORAS - DISCRIMINAR FORMA DE PAGO(#venta)
                    type_of_reception=PRINTERSETUP_DISCRIMINATESALE;                    
                break;  
                case 48://CONFIGURACIONIMPRESORAS - VALOR_DISCRIMINADO
                    type_of_reception=PRINTERSETUP_DISCRIMINATEDVALUE;                    
                break;  
                case 40://CONFIGURACIONIMPRESORAS - CREDITOCANASTA
                    type_of_reception=PRINTERSETUP_CREDITBASKET;                    
                break;    
                case 25://CONFIGURACIONIMPRESORAS - IDENTIFICACIONPRODUCTO_CANASTA
                    type_of_reception=PRINTERSETUP__PROD_IDENTI_BASKET;                    
                break;
                case 179://CONFIGURACIONIMPRESORAS - FINVENTACANASTA
                    type_of_reception= PRINTERSETUP_SALESORDERBASKE;                 
                break;   
                case 15://CONFIGURACIONIMPRESORAS - CONSIGNACIONES 
                    type_of_reception= PRINTERSETUP_APPROPRIATIONS;
                break;                    
                case 8://CONFIGURACIONIMPRESORAS - CONFIGURACIONIMPRESORAS 
                    type_of_reception= PRINTERSETUP_PRINTERSETUP;
                break;  
                case 52:
                    type_of_reception=PRINTERSETUP_HANDLEUP;
                break;                  
                default:
            }
        case 332:
            switch (accountant_2) {
                case 6://TURNOS - ESTADO
                    type_of_reception=TURN_STATE;                
                break;
                default:
            }
        break;    
        case 55:
            switch (accountant_2) {
                case 6://SUBAMANIJA - ESTADO
                    type_of_reception=HANDLEUP_STATE;  
                break;
                case 227://SUBAMANIJA - FINVENTA
                    type_of_reception=HANDLEUP_SALESORDER;
                break;                
                case 18://SUBAMANIJA - DISCRIMINAR FORMA DE PAGO(#venta)
                    type_of_reception=HANDLEUP_DISCRIMINATESALE;                    
                break;  
                case 48://SUBAMANIJA - VALOR_DISCRIMINADO
                    type_of_reception=HANDLEUP_DISCRIMINATEDVALUE;                    
                break;  
                case 40://SUBAMANIJA - CREDITOCANASTA
                    type_of_reception=HANDLEUP_CREDITBASKET;                    
                break;    
                case 25://SUBAMANIJA - IDENTIFICACIONPRODUCTO_CANASTA
                    type_of_reception=HANDLEUP__PROD_IDENTI_BASKET;                    
                break;
                case 179://SUBAMANIJA - FINVENTACANASTA
                    type_of_reception=HANDLEUP_SALESORDERBASKE;                 
                break;   
                case 15://SUBAMANIJA - CONSIGNACIONES 
                    type_of_reception=HANDLEUP_APPROPRIATIONS;
                break;                    
                case 8://SUBAMANIJA - CONFIGURACIONIMPRESORAS 
                    type_of_reception=HANDLEUP_PRINTERSETUP;
                break;
                case 52://SUBAMANIJA    SUBAMANIJA
                    type_of_reception=HANDLEUP_HANDLEUP;
                break;    
                default:
            }
        break;    
        
        default:
    }
    
    return (type_of_reception);
}


/*
*********************************************************************************************************
*                                function number_process2_rxmux()
*
* Description : Revisa el tipo de trama2 que llego departe del mux para introducirlo a su respectivo caso
*               
*********************************************************************************************************
*/


function number_process2_rxmux(type_of_reception){
    
    if (type_of_reception==STATE_STATE || type_of_reception==SALESORDER_STATE || type_of_reception==DISCRIMINATESALE_STATE || 
        type_of_reception==DISCRIMINATEDVALUE_STATE || type_of_reception==CREDITBASKET_STATE || type_of_reception==PROD_IDENTI_BASKET__STATE || 
        type_of_reception==SALESORDERBASKET_STATE || type_of_reception==APPROPRIATIONS_STATE || type_of_reception==PRINTERSETUP_STATE ||
        type_of_reception==TURN_STATE || type_of_reception==HANDLEUP_STATE){
        type_of_reception_2=X_STATE; 
    }
    if (type_of_reception==STATE_SALESORDER || type_of_reception==SALESODER_SALESORDER || type_of_reception==DISCRIMINATESALE_SALESORDER || 
        type_of_reception==DISCRIMINATEDVALUE_SALESORDER || type_of_reception==CREDITBASKET_SALESORDER || 
        type_of_reception==PROD_IDENTI_BASKET__SALESORDER || type_of_reception==SALESORDERBASKET_SALESORDER || 
        type_of_reception==APPROPRIATIONS_SALESORDER || type_of_reception==PRINTERSETUP_SALESORDER || 
        type_of_reception==HANDLEUP_SALESORDER){
        type_of_reception_2=X_SALESORDER;   
    }
    if (type_of_reception==STATE_DISCRIMINATESALE || type_of_reception==SALESORDER_DISCRIMINATESALE || 
        type_of_reception==DISCRIMINATESALE_DISCRIMINATESALE || type_of_reception==DISCRIMINATEDVALUE_DISCRIMINATESALE || 
        type_of_reception==CREDITBASKET_DISCRIMINATESALE || type_of_reception==PROD_IDENTI_BASKET__DISCRIMINATESALE || 
        type_of_reception==SALESORDERBASKET_DISCRIMINATESALE || type_of_reception==APPROPRIATIONS_DISCRIMINATESALE ||
        type_of_reception==PRINTERSETUP_DISCRIMINATESALE || type_of_reception==HANDLEUP_DISCRIMINATESALE){
        type_of_reception_2=X_DISCRIMINATESALE;     
    }
    if (type_of_reception==STATE_DISCRIMINATEVALUE || type_of_reception==SALESORDER_DISCRIMINATEVALUE || 
        type_of_reception==DISCRIMINATESALE_DISCRIMINATEVALUE || type_of_reception==DISCRIMINATEDVALUE_DISCRIMINATEDVALUE || 
        type_of_reception==CREDITBASKET_DISCRIMINATEDVALUE || type_of_reception==PROD_IDENTI_BASKET__DISCRIMINATEDVALUE || 
        type_of_reception==SALESORDERBASKET_DISCRIMINATEDVALUE || type_of_reception==APPROPRIATIONS_DISCRIMINATEDVALUE || 
        type_of_reception==PRINTERSETUP_DISCRIMINATEDVALUE || type_of_reception==HANDLEUP_DISCRIMINATEDVALUE){
        type_of_reception_2=X_DISCRIMINATEDVALUE;   
    }
    if (type_of_reception==STATE_CREDITBASKET || type_of_reception==SALESORDER_CREDITBASKET || 
        type_of_reception==DISCRIMINATESALE_CREDITBASKET || type_of_reception==DISCRIMINATEDVALUE_CREDITBASKET || 
        type_of_reception==CREDITBASKET_CREDITBASKET || type_of_reception==PROD_IDENTI_BASKET__CREDITBASKET || 
        type_of_reception==SALESORDERBASKET_CREDITBASKET || type_of_reception==APPROPRIATIONS_CREDITBASKET || 
        type_of_reception==PRINTERSETUP_CREDITBASKET || type_of_reception==HANDLEUP_CREDITBASKET){
        type_of_reception_2=X_CREDITBASKET;   
    }   
    if (type_of_reception==STATE__PROD_IDENTI_BASKET || type_of_reception==SALESORDER__PROD_IDENTI_BASKET || 
        type_of_reception==DISCRIMINATESALE__PROD_IDENTI_BASKET || type_of_reception==DISCRIMINATEDVALUE__PROD_IDENTI_BASKET || 
        type_of_reception==CREDITBASKET__PROD_IDENTI_BASKET || type_of_reception==PROD_IDENTI_BASKET__PROD_IDENTI_BASKET ||
        type_of_reception==SALESORDERBASKET__PROD_IDENTI_BASKET || type_of_reception==APPROPRIATIONS__PROD_IDENTI_BASKET ||
        type_of_reception==PRINTERSETUP__PROD_IDENTI_BASKET || type_of_reception==HANDLEUP__PROD_IDENTI_BASKET){
        type_of_reception_2=X_PROD_IDENTI_BASKET;  
    }    
    if (type_of_reception==SALESORDERBASKET_SALESORDERBASKE || type_of_reception==STATE_SALESORDERBASKE || 
        type_of_reception==SALESORDER_SALESORDERBASKE || type_of_reception==DISCRIMINATESALE_SALESORDERBASKE || 
        type_of_reception==DISCRIMINATEDVALUE_SALESORDERBASKE || type_of_reception==CREDITBASKET_SALESORDERBASKE ||
        type_of_reception==PROD_IDENTI_BASKET__SALESORDERBASKE ||type_of_reception==APPROPRIATIONS_SALESORDERBASKE ||
        type_of_reception==PRINTERSETUP_SALESORDERBASKE || type_of_reception==HANDLEUP_SALESORDERBASKE){
        type_of_reception_2=X_SALESORDERBASKE;        
    }    
    if (type_of_reception==APPROPRIATIONS_APPROPRIATIONS || type_of_reception==STATE_APPROPRIATIONS || 
        type_of_reception==SALESORDER_APPROPRIATIONS || type_of_reception==DISCRIMINATESALE_APPROPRIATIONS || 
        type_of_reception==DISCRIMINATEDVALUE_APPROPRIATIONS || type_of_reception==CREDITBASKET_APPROPRIATIONS || 
        type_of_reception==PROD_IDENTI_BASKET__APPROPRIATIONS || type_of_reception==SALESORDERBASKET__APPROPRIATIONS ||
        type_of_reception==PRINTERSETUP_APPROPRIATIONS || type_of_reception==HANDLEUP_APPROPRIATIONS){
        type_of_reception_2=X_APPROPRIATIONS;            
    }    
    if (type_of_reception==PRINTERSETUP_PRINTERSETUP || type_of_reception==STATE_PRINTERSETUP || type_of_reception==SALESORDER_PRINTERSETUP ||
        type_of_reception==DISCRIMINATESALE_PRINTERSETUP || type_of_reception==DISCRIMINATEDVALUE_PRINTERSETUP ||
        type_of_reception==CREDITBASKET_PRINTERSETUP || type_of_reception==PROD_IDENTI_BASKET__PRINTERSETUP ||
        type_of_reception==SALESORDERBASKET_PRINTERSETUP || type_of_reception==APPROPRIATIONS_PRINTERSETUP || 
        type_of_reception==HANDLEUP_PRINTERSETUP){
        type_of_reception_2=X_PRINTERSETUP;        
    }    
    if (type_of_reception==HANDLEUP_HANDLEUP || type_of_reception==STATE_HANDLEUP || type_of_reception==SALESORDER_HANDLEUP || 
        type_of_reception==DISCRIMINATESALE_HANDLEUP || type_of_reception==DISCRIMINATEDVALUE_HANDLEUP || 
        type_of_reception==CREDITBASKET_HANDLEUP || type_of_reception==PROD_IDENTI_BASKET__HANDLEUP || 
        type_of_reception==SALESORDERBASKET_HANDLEUP || type_of_reception==APPROPRIATIONS_HANDLEUP || 
        type_of_reception==PRINTERSETUP_HANDLEUP){
        type_of_reception_2=X_HANDLEUP;
    }    
    if (type_of_reception==TOTAL_ELECTRONIC_TOTAL_ELECTRONIC){
        type_of_reception_2=X_TOTAL_ELECTRONIC;        
    }
    if(type_of_reception==STATE_TURN){
        type_of_reception_2=X_TURN;
    }
    
    return (type_of_reception_2);    
    
}



/*
*********************************************************************************************************
*                                function watchful()
*
* Description : Revisa los estados del Beagle para realizar reintentos o peticiones al MUX
*               
*********************************************************************************************************
*/

var requests_bge2,typeof_request,confirmation;

function watchful(error){
    // Proceso para pedir totales siempre que haya una fin ventaq en cualquiera de las dos posiciones del surtidor
    if(FVenta1=='0'&&FVenta2=='0'){
        //("solito totales desde el codigo local");
        FVenta1='1';
        FVenta2='1'; 
        sendMux(totalRequest_mux);
    }
    //fventa=1,fventa2=1    //
    if(FVenta1=='0'&&FVenta2=='1' && terminototales=='1'){
        //("solito totales desde el codigo local");
        FVenta1='1';
        FVenta2='0'; 
        terminototales='0';
        sendMux(totalRequest_mux);
    }

    if(FVenta1=='1'&&FVenta2=='0'&& terminototales=='1'){
        //("solito totales desde el codigo local");
        FVenta1='0';
        FVenta2='1';
        terminototales='0';
        sendMux(totalRequest_mux);
    }    
    
    if (error){
        //(error);
    }else{
        pg.connect(conString, function(err, client, done){
            if(err){
                return console.error('Error de conexion 1', err);
            }else{ 
                //("*******Solicitud del BGE2*******");
                client.query("SELECT solicitabge2,tiposolicitud,confirmacion FROM solicitudes;", function(err,result){
                    done();
                    if(err){
                        return console.error('error de conexion', err);
                    }else{
                        requests_bge2=result.rows[0].solicitabge2;
                        if(requests_bge2==undefined){
                            //("favor llenar con un valor el item solicitabge2 de la tabla solicitudes");
                        }else{
                            //("Solicitud del bge2?=" +  requests_bge2);
                        }
                        typeof_request=result.rows[0].tiposolicitud;
                        //("Tipo de informacion solicitada=" +  typeof_request);   
                        confirmation=result.rows[0].confirmacion;
                        //("Datos recibidos al bge2=" +  confirmation);                                   
                    }      
                });
                //("_______________________________");                
            }   
        });
    }
    if(requests_bge2=='1' && confirmation=='0'){
        switch (typeof_request) {
            case 'T'://solicita totales electronicos
                if (error){                             //Revisa el estado del tabla turno del nsx para saber cuando lo cambia y enviar la solicitud al mux
                    //(error);
                }else{
                    pg.connect(conString, function(err, client, done){
                    if(err){
                            return console.error('Error de conexion 1', err);
                        }else{  
                            //("*******Turno leido del NSX controllerxxxxxx*******");                        
                            client.query("SELECT turnonsx FROM turno ;", function(err,result){
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    turn=result.rows[0].turnonsx;
                                    turnMux=0;                                
                                    if(turn == true){
                                        //("Estado del Turno NSX = Abierto" );
                                        turnMux='1';
                                    }else{
                                        //("Estado del Turno NSX = Cerrado" );
                                        turnMux='0';
                                    }
                                    sendMux(totalRequest_mux);                                
                                }      
                            });
                        }   
                    });
                }
            break;
            case 'P'://el nsx quiere cambia los PPU's autorizados
                if (error){
                    //(error);
                }else{
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{  
                            //("*******Ppu autorizados*******");                        
                            client.query("SELECT nsx1,nsx2,nsx3 FROM precios WHERE id_pos=1;", function(err,result){
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    nsx1=result.rows[0].nsx1;
                                    //("producto1L1 ppunsx=" + nsx1);
                                    nsx2=result.rows[0].nsx2;
                                    //("producto2L1 ppunsx=" + nsx2);                        
                                    nsx3=result.rows[0].nsx3;                        
                                    //("producto3L1 ppunsx=" + nsx3);
                                }      
                            });
                            client.query("SELECT nsx1,nsx2,nsx3 FROM precios WHERE id_pos=2;", function(err,result){
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    nsx1l2=result.rows[0].nsx1;
                                    //("producto1L2 ppunsx=" + nsx1l2);
                                    nsx2l2=result.rows[0].nsx2;
                                    //("producto2L2 ppunsx=" + nsx2l2);                        
                                    nsx3l2=result.rows[0].nsx3;                        
                                    //("producto3L2 ppunsx=" + nsx3l2);
                                    sendMux(authorizedPpu_mux); 
                                }      
                            });                       
                            //reseteo variables de confirmacion y solicitudes para no volver a pedir cambio de precios                    
                            client.query(sprintf("UPDATE solicitudes SET solicitabge2='%1$s',confirmacion='%2$s' ",0,1),function(err,result){
                                done();
                                if(err){
                                    return console.error('Error de conexion', err);
                                }else{
                                }
                            });                             
                        }   
                    });
                }                  
            break;    
            default:
        } 
    }
            
}


/*
*********************************************************************************************************
*                                function leertablas()
*
* Description : Lee las variables que existen dentro de las tablas insertadas en el beagle
*               
*********************************************************************************************************
*/
var numeromangueras,formatodinero,formatovolumen,ppux10,numerodigitos,unidadmoneda, valor1,valor2,valor3,simboloVOL,vehicle_screen,paymentsale_screen; //variables de configuraciones inciciales
var nsx1,nsx2,nsx3,nsx1l2,nsx2l2,nsx3l2; //variables de ppu autorizados
var turn,turnMux; //variables de turno cuando incia el mux por primera vez nsx
var shift_message,turnCloseOpen;//variables para apertura y cierre de turno
var authorizedMoney,PPUauthorized,creditValidacion;//variables para credito canasta
var positionFP,validationFP,salevalueFP,salevalueFPL1,salevalueFPL2,activekeyboardFP;//variables para forma de pago
var validationConsg,shift_messageConsg,positionConsg;//variables de consignaciones
var validationBasket,nameBasket,valueBasket,quantityBasket;//variables para peticion de producto canasta
var TableNumber=1,Tablenumberconsign=0,Tablenumbercredit=0;
var initialSettings_table=1,authorizedPpu_table=2,turn_table=3,button_Names_table=4,turnopenclose_table=5,not_readtable=6,
    creditbasket_tableL1=7,responseto_requestpayment_tableL1=8,responseto_requestpayment_tableL2=9,creditbasket_tableL2=10,consign_tableL1=11,
    consign_tableL2=12,turn_tablensx=13,basket_tableL1=14,basket_tableL2=15,discriminateSale_tableL1=16,discriminateSale_tableL2=17;//configuraciones iniciales leer , Ppu autorizados,botones,canasta,FORMADEPAGO
    //aperturacierre de turno,creditocanasta,respuseta a peticion de forma de pago
var initialSettings_mux=1,authorizedPpu_mux=2,turnMux_Nsx=3,totalRequest_mux=4,initialbuttons_mux=5,turnopenclose_mux=6,
    creditbasket_mux=7,responseto_requestpayment_mux=8,consign_mux=9,turnnsxbbbmux_mux=10,responseto_requestBasket_mux=11,
    acceptedPayment_mux=12,accepetFP_mux=13; //enviar trama al mux 
var buttons = new Array(114);//buffer para guardar el nombre de todos los botones en la pantalla mux





var creditEnablesReadingL1,creditEnablesReadingL2,basketEnablesReadingL1,basketEnablesReadingL2;


var readTables_credit = function(error){

    switch (Tablenumbercredit) {
        case creditbasket_tableL1:
            if (error){//leo si me permiten leer la tabla e items de creditocupo
                //(error);
            }else{
                if(creditEnablesReadingL1!=1){                
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{ 
                            client.query("SELECT lecturacupocredito FROM preset where id_pos=1;", function(err,result){
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    //("*******BGB2 habilita lectura de credito *******");                        
                                    creditEnablesReadingL1 =result.rows[0].lecturacupocredito;
                                    if(creditEnablesReadingL1 == undefined){
                                        //("(llenar por favor la tabla de preset con item en leturacupocredito)");
                                    }
                                }      
                            });
                        }   
                    });
                }
            }   
            if(creditEnablesReadingL1==1){//si El BGB2 permite leer datos de la tabla turno
                if (error){
                    //(error);
                }else{
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{
                            //("*******Credito Canasta respuestaNSXL1*******");
                            client.query("SELECT autorizado,validacioncredito FROM preset where id_pos=1;", function(err,result){
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    authorizedMoney=result.rows[0].autorizado;
                                    //("cupo dinero autorizado=" +  authorizedMoney);
                                    if(authorizedMoney==undefined){
                                        authorizedMoney='0';
                                    }
                                    creditValidacion=result.rows[0].validacioncredito;                                
                                    //("validacioncredito=" +  creditValidacion);
                                }      
                            });
                            client.query("SELECT mensaje FROM mensajes where id_mensaje=1;", function(err,result){
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    shift_message=result.rows[0].mensaje;                                
                                    if(shift_message==undefined){
                                        shift_message="...";
                                    }                        
                                    //("mensaje a publicar=" +  shift_message);                                
                                }      
                            });         
                            switch (frame_1.product_type){
                                case '0':
                                    client.query("SELECT nsx1 FROM precios WHERE id_pos=1;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('error de conexion', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx1;
                                        //("ppu autorizado nsx1 de precios pos1=" + PPUauthorized);
                                        sendMux(creditbasket_mux);                                            
                                    }      
                                    });                                            
                                break;
                                case '1':
                                    client.query("SELECT nsx1 FROM precios WHERE id_pos=1;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('error de conexion', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx1;
                                        //("ppu autorizado nsx1 de precios pos1=" + PPUauthorized);
                                        sendMux(creditbasket_mux);                                            
                                    }      
                                    });                                            
                                break;
                                case '2':
                                    client.query("SELECT nsx2 FROM precios WHERE id_pos=1;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('error de conexion', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx2;
                                        //("ppu autorizado nsx2 de precios pos1=" + PPUauthorized);
                                        sendMux(creditbasket_mux);                                            
                                    }      
                                    });                                        
                                break;
                                case '3':
                                    client.query("SELECT nsx3 FROM precios WHERE id_pos=1;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('error de conexion', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx3;
                                        //("ppu autorizado nsx3 de precios pos1=" + PPUauthorized);
                                        sendMux(creditbasket_mux);                                            
                                    }      
                                    });                                            
                                break;                                    
                                default:
                            }
                        }   
                    });
                }                
            }
            //("BGB2 Habilita lectura de cupo creditoL1=" + creditEnablesReadingL1);             
        break;
        case creditbasket_tableL2:
            if (error){//leo si me permiten leer la tabla e items de creditocupo
                //(error);
            }else{
                if(creditEnablesReadingL2!=1){                
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{ 
                            client.query("SELECT lecturacupocredito FROM preset where id_pos=2;", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                //("*******BGB2 habilita lectura de credito *******");                        
                                creditEnablesReadingL2 =result.rows[0].lecturacupocredito;
                                if(creditEnablesReadingL2 == undefined){
                                    //("(llenar por favor la tabla de preset con item en leturacupocredito)");
                                }
                            }      
                            });
                        }   
                    });
                }    
            }   
            if(creditEnablesReadingL2==1){//si El BGB2 permite leer datos de la tabla turno
                if (error){
                    //(error);
                }else{
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{
                            //("*******Credito Canasta respuestaNSXL2*******");
                            client.query("SELECT autorizado,validacioncredito FROM preset where id_pos=2;", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                authorizedMoney=result.rows[0].autorizado;
                                //("cupo dinero autorizado=" +  authorizedMoney);
                                if(authorizedMoney==undefined){
                                    authorizedMoney='0';
                                }
                                creditValidacion=result.rows[0].validacioncredito;                                
                                //("validacioncredito=" +  creditValidacion);
                                //leertabla1L2='1';     
                            }      
                            });
                            client.query("SELECT mensaje FROM mensajes where id_mensaje=2;", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                shift_message=result.rows[0].mensaje;                                
                                if(shift_message==undefined){
                                    shift_message="...";
                                }   
                                //shift_message="...";
                                //("mensaje a publicar=" +  shift_message);                                
                            }      
                            });
                            switch (frame_2.product_type){
                                case '0':
                                    client.query("SELECT nsx1 FROM precios WHERE id_pos=2;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('error de conexion', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx1;
                                        //("ppu autorizado nsx1 de precios pos2=" + PPUauthorized);
                                        sendMux(creditbasket_mux);                                                
                                    }
                                    });                                        
                                break;
                                case '1':
                                    client.query("SELECT nsx1 FROM precios WHERE id_pos=2;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('error de conexion', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx1;
                                        //("ppu autorizado nsx1 de precios pos2=" + PPUauthorized);
                                        sendMux(creditbasket_mux);                                                
                                    }
                                    });                                        
                                break;
                                case '2':
                                    client.query("SELECT nsx2 FROM precios WHERE id_pos=2;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('error de conexion', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx2;
                                        //("ppu autorizado nsx2 de precios pos2=" + PPUauthorized);
                                        sendMux(creditbasket_mux);                                            
                                    }      
                                    });                                                 
                                break;
                                case '3':
                                    client.query("SELECT nsx3 FROM precios WHERE id_pos=2;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('error de conexion', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx3;
                                        //("ppu autorizado nsx1 de precios pos2=" + PPUauthorized);
                                        sendMux(creditbasket_mux);                                                
                                    }      
                                    });                                        
                                break;                                    
                                default:
                            }
                        }   
                    });
                }                    
            }                
            //("BGB2 Habilita lectura de cupo creditoL2=" + creditEnablesReadingL2);             
        break;     
        default:
            // code
    }                
            
}



var readTables_consign = function(error){
    
    switch (Tablenumberconsign) {
        case consign_tableL1://tabla de consignaciones
            pg.connect(conString, function(err, client, done){//reseteo la variable al BGB2   ///INICIO CONSIGNACION
                if(err){
                    return console.error('Error de conexion 1', err);
                }else{
                    client.query(sprintf("UPDATE consignaciones SET recibe='%1$s' ",0),function(err,result){
                        done();
                        if(err){
                            return console.error('Error de conexion', err);
                        }else{
                        }
                    });   
                }
            });                              
            if (error){//// LEO CONFIRMACION
                //(error);
            }else{
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{ 
                        //("*******Habilita BGB2 que se puede leer tabla consignaciones*******");
                        client.query("SELECT confirmacion FROM consignaciones;", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                validationConsg=0;
                                validationConsg=result.rows[0].confirmacion;
                                //("validacion=" + validationConsg);
                                if(validationConsg==undefined){
                                    validationConsg='0';
                                }
                            }      
                        });
                    }   
                });
            }
            if(validationConsg==1){//recibo confirmacion del BGG2 para realizar la venta 
                if (error){
                    //(error);
                }else{
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{ 
                            //("*******Respuesta a Consignaciones*******");
                            client.query("SELECT confirmacion,mensajeconsignacion,idpos FROM consignaciones where idpos=1;", function(err,result){
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    validationConsg=0;
                                    shift_messageConsg=0;
                                    positionConsg=0;
                                    validationConsg=result.rows[0].confirmacion;
                                    //("validacion=" + validationConsg);
                                    if(validationConsg==undefined){
                                        validationConsg='0';
                                    }
                                    shift_messageConsg=result.rows[0].mensajeconsignacion;
                                    shift_messageConsg="Consignacion OK";//quemado el mensaje 
                                    //("mensaje a publicar=" + shift_messageConsg);
                                    if(shift_messageConsg==undefined){
                                        shift_messageConsg="...";
                                    }                                 
                                    positionConsg=result.rows[0].idpos;
                                    //("posicion=" + positionConsg); 
                                    sendMux(consign_mux);
                                }      
                            });
                        }   
                    });
                }
                Tablenumberconsign=0;
            }

        break;    
        case consign_tableL2://tabla de consignaciones
            pg.connect(conString, function(err, client, done){//reseteo la variable al BGB2
                if(err){
                    return console.error('Error de conexion 1', err);
                }else{
                    client.query(sprintf("UPDATE consignaciones SET  recibe='%1$s' ",0),function(err,result){
                        done();
                        if(err){
                            return console.error('Error de conexion', err);
                        }else{
                        }
                    });   
                }
            });                    
            if (error){
                //(error);
            }else{
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{ 
                        //("*******Habilita BGB2 que se puede leer tabla consignaciones*******");
                        client.query("SELECT confirmacion FROM consignaciones;", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                validationConsg=0;
                                validationConsg=result.rows[0].confirmacion;
                                //("validacion=" + validationConsg);
                                if(validationConsg==undefined){
                                    validationConsg='0';
                                }
                            }      
                        });
                    }   
                });
            }       
            if(validationConsg==1){//recibo confirmacion del BGG2 para realizar la venta 
                if (error){
                    //(error);
                }else{
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{ 
                            //("*******Respuesta a Consignaciones*******");
                            client.query("SELECT confirmacion,mensajeconsignacion,idpos FROM consignaciones where idpos=2;", function(err,result){
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    validationConsg=0;
                                    shift_messageConsg=0;
                                    positionConsg=0;                                
                                    validationConsg=result.rows[0].confirmacion;
                                    //("validacion=" + validationConsg);
                                    if(validationConsg==undefined){
                                        validationConsg='0';
                                    }
                                    shift_messageConsg=result.rows[0].mensajeconsignacion;
                                    shift_messageConsg="Consignacion OK";//quemado el mensaje                                    
                                    //("mensaje a publicar=" + shift_messageConsg);
                                    if(shift_messageConsg==undefined){
                                        shift_messageConsg="...";
                                    }                                 
                                    positionConsg=result.rows[0].idpos;
                                    //("posicion=" + positionConsg); 
                                    sendMux(consign_mux);
                                }      
                            });
                        }   
                    });
                }
                Tablenumberconsign=0;
            }    
        break;        
        default:
            // code
    }

}


var turnEnablesReading,insertadatosFP,numeroventa,numeroventaFPpass2;
var valuediscriminatedBbb2,endvaluesaldL1,endvaluesaldL2,idultimaventa,idultimaventaPass2L1,idultimaventaPass2L2;//variables forma de pagodiscriminado

var readTables = function (error){

    switch (TableNumber) {
        case initialSettings_table:
            if (error){
                //(error);
            }else{
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{ 
                        //("*******Configuraciones Iniciales*******");
                        client.query("SELECT numeromangueras,formatodinero,formatovolumen,ppux10,numerodigitos FROM mapeodispensador;", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                numeromangueras=result.rows[0].numeromangueras;
                                //("numeromangueras=" +  numeromangueras);
                                formatodinero=result.rows[0].formatodinero;
                                //("formatodinero=" +  formatodinero);                        
                                formatovolumen=result.rows[0].formatovolumen;                        
                                //("formatovolumen=" +  formatovolumen);                         
                                ppux10=result.rows[0].ppux10;                        
                                //("ppux10=" +  (ppux10)); 
                                numerodigitos=result.rows[0].numerodigitos;                        
                                //("numerodigitos=" +  numerodigitos); 
                            }      
                        });
                        client.query("SELECT unidadmoneda FROM moneda WHERE activa=true", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                unidadmoneda=result.rows[0].unidadmoneda;
                                //("unidadmoneda=" +  unidadmoneda);
                            }      
                        });      
                        client.query("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen = '25'", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                valor1=result.rows[0].valor;
                                //("valorP1=" + valor1);
                            }      
                        });     
                        client.query("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen = '26'", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                valor2=result.rows[0].valor;
                                //("valorP2=" + valor2);
                            }      
                        }); 
                        client.query("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen = '27'", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                valor3=result.rows[0].valor;
                                //("valorP3=" + valor3);
                            }      
                        });                 
                        client.query("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen = '24'", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                simboloVOL=result.rows[0].valor;
                                //("simboloVOL=" + simboloVOL);
                                sendMux(initialSettings_mux);
                            }      
                        });      
                    }   
                });
            }              
        break;
        case authorizedPpu_table:
            if (error){
                //(error);
            }else{
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{  
                        //("*******Ppu autorizados*******");                        
                        client.query("SELECT nsx1,nsx2,nsx3 FROM precios WHERE id_pos=1;", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                nsx1=result.rows[0].nsx1;
                                //("producto1L1 ppunsx=" + nsx1);
                                nsx2=result.rows[0].nsx2;
                                //("producto2L1 ppunsx=" + nsx2);                        
                                nsx3=result.rows[0].nsx3;                        
                                //("producto3L1 ppunsx=" + nsx3);
                            }      
                        });
                        client.query("SELECT nsx1,nsx2,nsx3 FROM precios WHERE id_pos=2;", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                nsx1l2=result.rows[0].nsx1;
                                //("producto1L2 ppunsx=" + nsx1l2);
                                nsx2l2=result.rows[0].nsx2;
                                //("producto2L2 ppunsx=" + nsx2l2);                        
                                nsx3l2=result.rows[0].nsx3;                        
                                //("producto3L2 ppunsx=" + nsx3l2);
                                sendMux(authorizedPpu_mux); 
                            }      
                        });                        
                    }   
                });
            }       
        break; 
        case turn_table:
            if (error){                             //Revisa el estado del tabla turno del nsx para saber cuando lo cambia y enviar la solicitud al mux
                //(error);
            }else{
                pg.connect(conString, function(err, client, done){
                if(err){
                        return console.error('Error de conexion 1', err);
                    }else{  
                        //("*******Turno leido del NSX controller*******");                        
                        client.query("SELECT turnonsx FROM turno ;", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                turn=result.rows[0].turnonsx;
                                turnMux=0;                                
                                if(turn == true){
                                    //("Estado del Turno NSX = Abierto" );
                                    turnMux='1';
                                }else{
                                    //("Estado del Turno NSX = Cerrado" );
                                    turnMux='0';
                                }
                                sendMux(totalRequest_mux);                                
                            }      
                        });
                    }   
                });
            }
        break;
        case button_Names_table:                                                      //leer los nombres de los botones escritos desde el nsx para el mux
            if (error){                             
                //(error);
            }else{
                pg.connect(conString, function(err, client, done){
                if(err){
                        return console.error('Error de conexion 1', err);
                    }else{  
                        var nextbutton,contador=0;
                        for(nextbutton=1;nextbutton<=114;nextbutton++){//113
                            client.query(sprintf("SELECT textoboton FROM botones WHERE id_boton = '%1$s'",nextbutton), function(err,result){                       
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    buttons[contador]=result.rows[0].textoboton;
                                    contador=contador+1;
                                }      
                            });
                        }
                    }   
                });
            }
            if(buttons[113]!=undefined){//112
                for(x=0;x<=113;x++){//112
                    switch(buttons[x].length){
                        case 0:
                            buttons[x] = buttons[x].concat("        "); 
                        break;  
                        case 1:
                            buttons[x] = buttons[x].concat("       "); 
                        break;  
                        case 2:
                            buttons[x] = buttons[x].concat("      ");  
                        break;  
                        case 3:
                            buttons[x] = buttons[x].concat("     ");  
                        break;  
                        case 4:
                            buttons[x] = buttons[x].concat("    "); 
                        break;  
                        case 5:
                            buttons[x] = buttons[x].concat("   "); 
                        break;  
                        case 6:
                            buttons[x] = buttons[x].concat("  ");  
                        break;    
                        case 7:
                            buttons[x] = buttons[x].concat(" ");
                        break;  
                        default:
                    }
                }
                //("*******Nombres de Botones*******");                                           
                for(x=0;x<=113;x++){//112
                    //("Boton:" + buttons[x]);        
                }    
                sendMux(initialbuttons_mux);                
            }  
        break;
        case turnopenclose_table:
            if (error){//leo si me permiten leer la tabla e items de turno
                //(error);
            }else{
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{ 
                        //("*******BGB2 habilita lectura de la tabla turno*******");
                        client.query("SELECT habilitalecturaturno FROM turno;", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                turnEnablesReading =result.rows[0].habilitalecturaturno;
                                if(turnEnablesReading == undefined){
                                    //("(llenar por favor la tabla de turno con item en habilitalecturaturno)");
                                }else{
                                    //("BGB2 habilita lectura de turno=" + turnEnablesReading);
                                }
                            }      
                        });                                
                        if(turnEnablesReading==1){//si El BGB2 permite leer datos de la tabla turno
                            client.query("SELECT mensajeturno,turno FROM turno;", function(err,result){//leo el mensaje y la aceptacion o negacion del islero que se quizo identificar
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    //("*******Aceptado o rechazado apertura de turno*******");                                    
                                    turnCloseOpen=result.rows[0].turno;
                                    //("aceptado o rechazado=" +  turnCloseOpen);                                    
                                    shift_message=result.rows[0].mensajeturno;
                                    if(turnCloseOpen==1){
                                        shift_message="vendedor habilitado";    
                                    }else{
                                        shift_message="vendedor no reconocido";
                                    }                                    
                                    //("mensaje a publicar=" +  shift_message);
                                }      
                            });
                            client.query(sprintf("UPDATE turno SET habilitalecturaturno='%1$s' " ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                                done();
                                if(err){
                                    return console.error('error de conexion 2', err);                            
                                }else{
                                    sendMux(turnopenclose_mux);                                                                                                         
                                } 
                            });
                        }
                    }   
                });
            }   
        break;
        case turn_tablensx:
            if (error){                             //Revisa el estado del tabla turno del nsx para saber cuando lo cambia y enviar la solicitud al mux
                //(error);
            }else{
                pg.connect(conString, function(err, client, done){
                if(err){
                        return console.error('Error de conexion 1', err);
                    }else{  
                        //("*******Turno leido del NSX controller*******");                        
                        client.query("SELECT turnonsx FROM turno ;", function(err,result){
                            done();
                            if(err){
                                return console.error('error de conexion', err);
                            }else{
                                turn=result.rows[0].turnonsx;
                                turnMux=0;                                
                                if(turn == true){
                                    //("Estado del Turno NSX = Abierto" );
                                    turnMux='1';
                                }else{
                                    //("Estado del Turno NSX = Cerrado" );
                                    turnMux='0';
                                }
                                //frame_2.openclose_turn pregunta wilmer                                
                                //turnCloseOpen respuesta de diego
                                //turnMux respuesta leo
                                if(L1_request>0 && L1_request!=undefined){
                                    //cierre lado 1
                                    if(frame_1.openclose_turn=='0' && turnCloseOpen=='0' && turnMux=='0'){
                                        //cerrar turno al mux , reteo lecutra de tabla, finalizo
                                        turnMux='0';
                                        //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        sendMux(turnnsxbbbmux_mux);  
                                    }
                                    if(frame_1.openclose_turn=='0' && turnCloseOpen=='0' && turnMux=='1'){
                                        //no envio nada , reteo lecutra de tabla, finalizo
                                        TableNumber=not_readtable;
                                        L2_request=0;
                                        //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);
                                        //sendMux(turnnsxbbbmux_mux);                                        
                                    }
                                    if(frame_1.openclose_turn=='0' && turnCloseOpen=='1' && turnMux=='0'){
                                        //cerrar turno al mux , reteo lecutra de tabla, finalizo
                                        turnMux='0';
                                        //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        sendMux(turnnsxbbbmux_mux);                                        
                                    }
                                    if(frame_1.openclose_turn=='0' && turnCloseOpen=='1' && turnMux=='1'){
                                        //no envio nada , reteo lecutra de tabla, finalizo
                                        TableNumber=not_readtable;
                                        L2_request=0;                                        
                                        //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        //sendMux(turnnsxbbbmux_mux);                                        
                                    }                                                
                                    //apertura lado2
                                    if(frame_1.openclose_turn=='1' && turnCloseOpen=='0' && turnMux=='0'){
                                        //no envio nada , reteo lecutra de tabla, finalizo
                                        TableNumber=not_readtable;
                                        L2_request=0;                                        
                                        //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        //sendMux(turnnsxbbbmux_mux);                                        
                                    }
                                    if(frame_1.openclose_turn=='1' && turnCloseOpen=='0' && turnMux=='1'){
                                        //no envio nada , reteo lecutra de tabla, finalizo
                                        turnMux='1';
                                        //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        sendMux(turnnsxbbbmux_mux);                                        
                                    }
                                    if(frame_1.openclose_turn=='1' && turnCloseOpen=='1' && turnMux=='0'){
                                        //cerrar turno al mux , reteo lecutra de tabla, finalizo
                                        turnMux='0';
                                        //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        sendMux(turnnsxbbbmux_mux);                                        
                                    }
                                    if(frame_1.openclose_turn=='1' && turnCloseOpen=='1' && turnMux=='1'){
                                        //no envio nada , reteo lecutra de tabla, finalizo
                                        TableNumber=not_readtable;
                                        //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        L2_request=0;                                        
                                        //sendMux(turnnsxbbbmux_mux);                                        
                                    }                     
                                }
                                if(L2_request>0 && L2_request!=undefined){
                                    //cierre lado 2
                                    if(frame_2.openclose_turn=='0' && turnCloseOpen=='0' && turnMux=='0'){
                                        //no envio nada , reteo lecutra de tabla, finalizo
                                        //cerrar turno al mux , reteo lecutra de tabla, finalizo
                                        turnMux='0';
                                        //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        sendMux(turnnsxbbbmux_mux);                                          
                                    }
                                    if(frame_2.openclose_turn=='0' && turnCloseOpen=='0' && turnMux=='1'){
                                        //no envio nada , reteo lecutra de tabla, finalizo
                                        TableNumber=not_readtable;
                                        L2_request=0;                                        
                                        //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        //sendMux(turnnsxbbbmux_mux);                                        
                                    }
                                    if(frame_2.openclose_turn=='0' && turnCloseOpen=='1' && turnMux=='0'){
                                        //cerrar turno al mux , reteo lecutra de tabla, finalizo
                                        turnMux='0';
                                        //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        sendMux(turnnsxbbbmux_mux);                                        
                                    }
                                    if(frame_2.openclose_turn=='0' && turnCloseOpen=='1' && turnMux=='1'){
                                        //no envio nada , reteo lecutra de tabla, finalizo
                                        TableNumber=not_readtable;
                                        L2_request=0;                                        
                                        //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        //sendMux(turnnsxbbbmux_mux);                                        
                                    }                                                
                                    //apertura lado2
                                    if(frame_2.openclose_turn=='1' && turnCloseOpen=='0' && turnMux=='0'){
                                        //no envio nada , reteo lecutra de tabla, finalizo
                                        TableNumber=not_readtable;
                                        L2_request=0;                                        
                                        //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        //sendMux(turnnsxbbbmux_mux);                                        
                                    }
                                    if(frame_2.openclose_turn=='1' && turnCloseOpen=='0' && turnMux=='1'){
                                        //no envio nada , reteo lecutra de tabla, finalizo
                                        turnMux='1';
                                        //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        sendMux(turnnsxbbbmux_mux);                                                               
                                    }
                                    if(frame_2.openclose_turn=='1' && turnCloseOpen=='1' && turnMux=='0'){
                                        //cerrar turno al mux , reteo lecutra de tabla, finalizo
                                        turnMux='0';
                                        //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        sendMux(turnnsxbbbmux_mux);                                        
                                    }
                                    if(frame_2.openclose_turn=='1' && turnCloseOpen=='1' && turnMux=='1'){
                                        //no envio nada , reteo lecutra de tabla, finalizo
                                        TableNumber=not_readtable;
                                        L2_request=0;
                                        //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                        //sendMux(turnnsxbbbmux_mux);                                        
                                    }                                
                                }                                
                            }      
                        });
                    }   
                });
            }            
        break;
        case responseto_requestpayment_tableL1://leer respueta a peticion de venta discriminada en forma de pago
            if (error){
                //(error);
            }else{
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{ 
                        client.query("SELECT valortotal,pk_idventa FROM venta  where pk_idventa = (select max(pk_idventa) FROM venta where idposicion=1);", function(err,result){
                        done();
                        if(err){
                            return console.error('error de conexion', err);
                        }else{
                            //("*******Respuesta a peticion N° venta a discriminar en forma de pago*******");                                
                            idultimaventa=result.rows[0].pk_idventa;
                            idultimaventaPass2L1=idultimaventa;
                            //("Id ultimaventa=" + idultimaventaPass2L1);
                            //positionFP=result.rows[0].idposicion;
                            positionFP='1';
                            //("Pos QUEMADA=" +  positionFP);                                
                            //validationFP=result.rows[0].valortotal;
                            validationFP='1';
                            //("validacion QUEMADA=" +  validationFP);
                            salevalueFPL1=result.rows[0].valortotal;
                            salevalueFP=salevalueFPL1;
                            //("valorventa=" +  salevalueFPL1);   
                            //activekeyboardFP=result.rows[0].activateclado;
                            activekeyboardFP='0';
                            //("activa teclado QUEMADA=" +  activekeyboardFP);                                  
                            //sendMux(responseto_requestpayment_mux);
                            //tablanext='1';
                            client.query(sprintf("SELECT SUM (CAST(valordiscriminado AS INT)) FROM historicoformapago WHERE numeroventa= '%1$s' ",idultimaventaPass2L1),function(err,result){
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    //("*******Historico de forma de pago venta*******");                                
                                    valuediscriminatedBbb2=result.rows[0].sum;
                                    if(valuediscriminatedBbb2== undefined){
                                        valuediscriminatedBbb2="0"; 
                                    }
                                    //("valor discriminado retornado por tabla historico=" + valuediscriminatedBbb2);
                                    salevalueFP=parseInt(salevalueFP,10);
                                    valuediscriminatedBbb2=parseInt(valuediscriminatedBbb2,10);
                                    endvaluesaldL1 = salevalueFP - valuediscriminatedBbb2;
                                    //("valor real;"+salevalueFP);
                                    //("valor discriminado de historico;"+valuediscriminatedBbb2);
                                    //("resultado a mux;"+endvaluesaldL1);
                                    salevalueFP=endvaluesaldL1;
                                    //tablanext='0';
                                    sendMux(responseto_requestpayment_mux);           
                               }
                            });
                        }      
                        });
                    }   
                });
            }      
        break;
        case responseto_requestpayment_tableL2:
            if (error){
                //(error);
            }else{
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{ 
                        client.query("SELECT valortotal,pk_idventa FROM venta where pk_idventa = (select max(pk_idventa) FROM venta where idposicion=2);", function(err,result){
                        done();
                        if(err){
                            return console.error('error de conexion', err);
                        }else{
                            //("*******Respuesta a peticion N° venta a discriminar en forma de pago*******");                                
                            idultimaventa=result.rows[0].pk_idventa;
                            idultimaventaPass2L2=idultimaventa;
                            //("Id ultimaventa=" + idultimaventaPass2L2);
                            //positionFP=result.rows[0].idposicion;
                            positionFP='2';
                            //("Pos QUEMADA=" +  positionFP);                                
                            //validationFP=result.rows[0].valortotal;
                            validationFP='1';
                            //("validacion QUEMADA=" +  validationFP);
                            salevalueFPL2=result.rows[0].valortotal;
                            salevalueFP=salevalueFPL2;
                            //("valorventa=" +  salevalueFPL2);   
                            //activekeyboardFP=result.rows[0].activateclado;
                            activekeyboardFP='0';
                            //("activa teclado QUEMADA=" +  activekeyboardFP);                                  
                            //sendMux(responseto_requestpayment_mux);
                            //tablanext='1';                         
                            client.query(sprintf("SELECT SUM (CAST(valordiscriminado AS INT)) FROM historicoformapago WHERE numeroventa= '%1$s' ",idultimaventaPass2L2),function(err,result){
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    //("*******Historico de forma de pago venta*******");                                
                                    valuediscriminatedBbb2=result.rows[0].sum;
                                    if(valuediscriminatedBbb2== undefined){
                                        valuediscriminatedBbb2="0"; 
                                    }
                                    //("valor discriminado retornado por tabla historico=" + valuediscriminatedBbb2);
                                    salevalueFP=parseInt(salevalueFP,10);
                                    valuediscriminatedBbb2=parseInt(valuediscriminatedBbb2,10);
                                    endvaluesaldL2 = salevalueFP - valuediscriminatedBbb2;
                                    //("valor real;"+salevalueFP);
                                    //("valor discriminado de historico;"+valuediscriminatedBbb2);
                                    //("resultado a mux;"+endvaluesaldL2);
                                    salevalueFP=endvaluesaldL2;
                                    //tablanext='0';
                                    sendMux(responseto_requestpayment_mux);           
                            }
                            });
                        }      
                        });
                    }   
                });
            }              
        break;
        case basket_tableL1:
            if(basketEnablesReadingL1!=1){ 
                if (error){//leo si me permiten leer la tabla e items de creditocupo
                    //(error);
                }else{            
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{ 
                            client.query("SELECT lecturacanasta FROM venta_canasta where idposicionc=1 AND id_canasta = (select max(id_canasta) from venta_canasta);", function(err,result){
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    //("*******BGB2 habilita lectura de canasta *******");                        
                                    basketEnablesReadingL1 =result.rows[0].lecturacanasta;
                                    if(basketEnablesReadingL1 == undefined){
                                        //("(llenar por favor la tabla de venta_canasta con item en leturacanasta)");
                                    }else{
                                        //("habilita lectura de canasta"+basketEnablesReadingL1);
                                    }
                                    if(basketEnablesReadingL1==1){//si El BGB2 permite leer datos de la tabla turno 
                                        //("*******Identificacion de Canasta respuestaNSXL1*******");
                                        client.query("SELECT validacioncanasta,nombre,valor,cantidad FROM venta_canasta where idposicionc=1 AND id_canasta= (select max(id_canasta) from venta_canasta);", function(err,result){
                                        done();
                                        if(err){
                                            return console.error('error de conexion', err);
                                        }else{
                                            validationBasket=result.rows[0].validacioncanasta;
                                            if(validationBasket==undefined){
                                                validationBasket='0';
                                            }                                
                                            //("validacion=" + validationBasket);
                                            validationBasket='1';
                                            //("validacionQUEMADO=" + validationBasket);                                    
                                            nameBasket=result.rows[0].nombre;
                                            if(nameBasket==undefined){
                                                nameBasket="sin nombre";
                                            }                                           
                                            //("nombre del producto=" + nameBasket);
                                            valueBasket=result.rows[0].valor;
                                            if(valueBasket==undefined){
                                                valueBasket='0';
                                            }                                                             
                                            //("valor unitario=" + valueBasket);
                                            quantityBasket=result.rows[0].cantidad;
                                            if(quantityBasket==undefined){
                                                quantityBasket='0';
                                            }                                                  
                                            //("cantidad disponible=" + quantityBasket);                                        
                                            sendMux(responseto_requestBasket_mux);                                    
                                        }      
                                        });
                                    }       
                                }      
                            });
                     
                        }   
                    });
                }
            }   
        break;
        case basket_tableL2:
            if(basketEnablesReadingL2!=1){
                if (error){//leo si me permiten leer la tabla e items de creditocupo
                    //(error);
                }else{            
                    pg.connect(conString, function(err, client, done){
                        if(err){
                            return console.error('Error de conexion 1', err);
                        }else{ 
                            client.query("SELECT lecturacanasta FROM venta_canasta where idposicionc=2 AND id_canasta= (select max(id_canasta) from venta_canasta);", function(err,result){
                                done();
                                if(err){
                                    return console.error('error de conexion', err);
                                }else{
                                    //("*******BGB2 habilita lectura de canasta *******");                        
                                    basketEnablesReadingL2 =result.rows[0].lecturacanasta;
                                    if(basketEnablesReadingL2 === undefined){
                                        basketEnablesReadingL2='0';
                                        //("(llenar por favor la tabla de venta_canasta con item en leturacanasta)");
                                    }else{
                                        //("habilita lectura de canasta"+basketEnablesReadingL2);
                                    }
                                    if(basketEnablesReadingL2==1){//si El BGB2 permite leer datos de la tabla turno 
                                        //("*******Identificacion de Canasta respuestaNSXL2*******");
                                        client.query("SELECT validacioncanasta,nombre,valor,cantidad FROM venta_canasta where idposicionc=2 AND id_canasta= (select max(id_canasta) from venta_canasta);", function(err,result){
                                        done();
                                        if(err){
                                            return console.error('error de conexion', err);
                                        }else{
                                            validationBasket=result.rows[0].validacioncanasta;
                                            if(validationBasket==undefined){
                                                validationBasket='0';
                                            }                                
                                            //("validacion=" + validationBasket);
                                            validationBasket='1';
                                            //("validacionQUEMADO=" + validationBasket);
                                            nameBasket=result.rows[0].nombre;
                                            if(nameBasket==undefined){
                                                nameBasket="sin nombre";
                                            }                                               
                                            //("nombre del producto=" + nameBasket);
                                            valueBasket=result.rows[0].valor;
                                            if(valueBasket==undefined){
                                                valueBasket='0';
                                            }                                                                    
                                            //("valor unitario=" + valueBasket);
                                            quantityBasket=result.rows[0].cantidad;
                                            if(quantityBasket==undefined){
                                                quantityBasket='0';
                                            }                                                     
                                            //("cantidad disponible=" + quantityBasket);                                        
                                            sendMux(responseto_requestBasket_mux);                                    
                                        }      
                                        });
                                    }                                    
                                }      
                            });                            
                        }   
                    });
                }
            }   
        break;        
        case discriminateSale_tableL1:
            var numeroventaFP;
            if (error){//leo el consecutivo o id de la ultima venta
                //(error);
            }else{
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de finventa conexion', err);
                    }else{ 
                        var tipoformadepago     = frame_1.type_of_payment;
                        var valorventa          = salevalueFPL1;
                        var valordiscriminado   = frame_1.discrim_value;
                        var numeroventa         = idultimaventaPass2L1;
                        var ventaconsulta       = frame_1.consultation_sale;
                        //("valordiscriminado:"+valordiscriminado);
                        //("numeroventa:"+numeroventa);                        
                        client.query(sprintf("INSERT INTO formadepago (tipoformadepago,valorventa,valordiscriminado,numeroventa,ventaconsulta,id_pos) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s','%6$s')",tipoformadepago,valorventa,valordiscriminado,numeroventa,ventaconsulta,1),function(err,result){                        
                            done();
                            if(err){
                                return console.error('Error de insercion formadepago ', err);
                            }else{
                                
                            }
                        });
                        client.query("UPDATE estado SET fp1=1", function(err,result){//era 1 hasta el 04/08/2016
                            done();
                            if(err){
                                return console.error('error de conexion 2', err);                            
                            }else{
                                TableNumber=not_readtable;                                
                                sendMux(accepetFP_mux);                                                       
                            } 
                        });
                    }   
                });
            }   
        break;
        case discriminateSale_tableL2:
            if (error){//leo el consecutivo o id de la ultima venta
                //(error);
            }else{
                pg.connect(conString, function(err, client, done){
                    if(err){
                        return console.error('Error de conexion 1', err);
                    }else{ 
                        var tipoformadepago     = frame_2.type_of_payment;
                        var valorventa          = salevalueFPL2;
                        var valordiscriminado   = frame_2.discrim_value;
                        var numeroventa         = idultimaventaPass2L2;
                        var ventaconsulta       = frame_2.consultation_sale;
                        //("valordiscriminado:"+valordiscriminado);
                        //("numeroventa:"+numeroventa);                               
                        client.query(sprintf("INSERT INTO formadepago (tipoformadepago,valorventa,valordiscriminado,numeroventa,ventaconsulta,id_pos) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s','%6$s')",tipoformadepago,valorventa,valordiscriminado,numeroventa,ventaconsulta,2),function(err,result){                        
                            done();
                            if(err){
                                return console.error('Error de conexion', err);
                            }else{

                            }
                        });
                        client.query("UPDATE estado SET fp2=1", function(err,result){//era 1 hasta el 04/08/2016
                            done();
                            if(err){
                                return console.error('error de conexion 2', err);                            
                            }else{
                                TableNumber=not_readtable;                                      
                                sendMux( accepetFP_mux);                                
                            } 
                        });                         
                        
                    }   
                });
            }   
        break;        
        default:
    }

};



/*
*********************************************************************************************************
*                                function SendMux()
*
* Description : Envia los datos al surtidorMUX
*               
*******************************************************************************************
*/


var entered_value;
var positionOne= new Buffer(1);
var positionTwo= new Buffer(1);
            
            
var sendMux =function(numeroEnvio){
    
    //positionOne[0]=0x01; 
    //positionTwo[0]=0x02;    
    
    switch (numeroEnvio){
        case initialSettings_mux:                                               //Configuraciones iniciales 
            var f = new Date();                                                 //fecha / hora 
            x=0;
            x = f.getMonth()+1;                     //mes
            var month = String(x);
            if(month<=9){
                month= '0'+month;
            }else{
            }
            x=0;
            x = f.getDate();                        //dia
            var day = String(x);
            if (day<=9){
                day='0'+day;
            }else{
            }
            x=0;
            x = f.getHours();                       //hora
            var hours = String(x);
            if (hours<=9){
                hours='0'+hours;
            }else{
            }            
            x=0;
            x = f.getMinutes();                     //minutos
            var minutes = String(x);
            if (minutes<=9){
                minutes='0'+minutes;
            }else{
            }                
            x=0;
            x = f.getSeconds();                     //segundos
            var seconds = String(x);
            if (seconds<=9){
                seconds='0'+seconds;
            }else{
            }                
            completePlot(entered_value=valor1);                                 //preset1
            valor1=return_value;
            completePlot(entered_value=valor2);                                 //preset2
            valor2=return_value;    
            completePlot(entered_value=valor3);                                 //preset3 
            valor3=return_value;      
            vehicle_screen="1";  //variables que ahun no se han leido de la tabla de configuracione iniciales 
            paymentsale_screen='0';
            muxport.write("MUX"+positionOne+"H"+";"+ String(f.getFullYear())+month+day+hours+minutes+seconds+";"+String(numerodigitos)+";"+String(formatodinero)+";"+String(formatovolumen)+";"+String(ppux10)+";"+String(numeromangueras)+";"+String(unidadmoneda)+";"+String(simboloVOL)+";"+"192168110100"+";"+valor1+";"+valor2+";"+valor3+";"+vehicle_screen+";"+paymentsale_screen+";"+"&"+positionTwo+"N" + ";"+ "&" +"*");
            //("MUX"+"1"+"H"+";"+f.getFullYear()+month+day+hours+minutes+seconds+";"+parseInt(numerodigitos,10)+";"+parseInt(formatodinero,10)+";"+parseInt(formatovolumen,10)+";"+parseInt(ppux10,10)+";"+parseInt(numeromangueras,10)+";"+unidadmoneda+";"+parseInt(simboloVOL,10)+";"+"192168110100"+";"+valor1+";"+valor2+";"+valor3+";"+vehicle_screen+";"+paymentsale_screen+";"+"&"+"2N;&"+"*");            
            numeroEnvio='0';
        break;
        case authorizedPpu_mux:                                                 //Ppu autorizados
            muxport.write("MUX"+positionOne+"I"+";"+String('0'+nsx1)+";"+String('0'+nsx2)+";"+String('0'+nsx3)+";"+String('000000')+ ";"+"&"+positionTwo+"I"+";"+String('0'+nsx1l2)+";"+String('0'+nsx2l2)+";"+String('0'+nsx3l2)+";"+String('000000')+";"+"&"+"*");
            //("MUX"+"1"+"I"+";"+"0"+nsx1+";"+"0"+nsx2+";"+"0"+nsx3+";"+"000000"+";"+"&"+"2"+"I"+";"+"0"+nsx1l2+";"+"0"+nsx2l2+";"+"0"+nsx3l2+";"+"000000"+";&"+"*");            
            numeroEnvio='0';            
        break;
        case totalRequest_mux:                                                  //Solicitando totales del equipo
            muxport.write("MUX"+positionOne+"G"+";"+turnMux+";"+"&"+positionTwo+"N;&"+"*");
            //("MUX"+"1"+"G"+";"+turnMux+";"+"&"+"2N;&"+"*"); 
            numeroEnvio='0';  
        break;
        case turnMux_Nsx:                                                       //Cambio de estado Turno 
            if(turn_table == true){                                             //abrir o cerrar turno
                x='1';
            }else{
                x='0';
            }
            muxport.write("MUX"+positionOne+"F"+";"+x+ ";"+"aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff"+";"+"&"+positionTwo+"N;&"+"*");
            //("MUX"+"1"+"F"+";"+x+";"+"aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff"+";"+"&"+"2N;&"+"*");            
            numeroEnvio='0';              
        break;
        case initialbuttons_mux:                                                //nombre de los botones
            muxport.write("MUX"+positionOne+"J"+";"+buttons[0]+";"+buttons[1]+";"+buttons[2]+";"+buttons[3]+";"+buttons[4]+";"+buttons[5]+
            ";"+buttons[6]+";"+buttons[7]+";"+buttons[8]+";"+buttons[9]+";"+buttons[10]+";"+buttons[11]+";"+buttons[12]+";"+buttons[13]+
            ";"+buttons[14]+";"+buttons[15]+";"+buttons[16]+";"+buttons[17]+";"+buttons[18]+";"+buttons[19]+";"+buttons[20]+";"+buttons[21]+
            ";"+buttons[22]+";"+buttons[23]+";"+buttons[24]+";"+buttons[25]+";"+buttons[26]+";"+buttons[27]+";"+buttons[28]+";"+buttons[29]+
            ";"+buttons[30]+";"+buttons[31]+";"+buttons[32]+";"+buttons[33]+";"+buttons[34]+";"+buttons[35]+";"+buttons[36]+";"+buttons[37]+
            ";"+buttons[38]+";"+buttons[39]+";"+buttons[40]+";"+buttons[41]+";"+buttons[42]+";"+buttons[43]+";"+buttons[44]+";"+buttons[45]+
            ";"+buttons[46]+";"+buttons[47]+";"+buttons[48]+";"+buttons[49]+";"+buttons[50]+";"+buttons[51]+";"+buttons[52]+";"+buttons[53]+
            ";"+buttons[54]+";"+buttons[55]+";"+buttons[56]+";"+buttons[57]+";"+buttons[58]+";"+buttons[59]+";"+buttons[60]+";"+buttons[61]+
            ";"+buttons[62]+";"+buttons[63]+";"+buttons[64]+";"+buttons[65]+";"+buttons[66]+";"+buttons[67]+";"+buttons[68]+";"+buttons[69]+
            ";"+buttons[70]+";"+buttons[71]+";"+buttons[72]+";"+buttons[73]+";"+buttons[74]+";"+buttons[75]+";"+buttons[76]+";"+buttons[77]+
            ";"+buttons[78]+";"+buttons[79]+";"+buttons[80]+";"+buttons[81]+";"+buttons[82]+";"+buttons[83]+";"+buttons[84]+";"+buttons[85]+
            ";"+buttons[86]+";"+buttons[87]+";"+buttons[88]+";"+buttons[89]+";"+buttons[90]+";"+buttons[91]+";"+buttons[92]+";"+buttons[93]+
            ";"+buttons[94]+";"+buttons[95]+";"+buttons[96]+";"+buttons[97]+";"+buttons[98]+";"+buttons[99]+";"+buttons[100]+";"+buttons[101]+
            ";"+buttons[102]+";"+buttons[103]+";"+buttons[104]+";"+buttons[105]+";"+buttons[106]+";"+buttons[107]+";"+buttons[108]+";"+
            buttons[109]+";"+buttons[110]+";"+buttons[111]+";"+buttons[112]+";"+buttons[113]+";"+"&"+positionTwo+"N;&"+"*");            
            //("MUX"+"1"+"J"+";"+buttons[0]+";"+buttons[1]+";"+buttons[2]+";"+buttons[3]+";"+buttons[4]+";"+buttons[5]+
                        
            numeroEnvio='0';              
        break;
        case turnopenclose_mux:
            var resultado=60-shift_message.length; //apartir de esta linea hasta las 6 subsiguientes se adicionan los espacios del mensaje
            var adding_spaces=" ";
            for(x=1;x<resultado;x++){
                adding_spaces=adding_spaces+" ";
            }
            shift_message=shift_message+adding_spaces;
            if(L1_request>0 && L1_request!=undefined){
                muxport.write("MUX"+positionOne+"F"+";"+turnCloseOpen+";"+shift_message+";"+"&"+positionTwo+"N;&"+"*");                
                //("MUX"+"1"+"F"+";"+turnCloseOpen+";"+shift_message+";"+"&"+"2N;&"+"*"); 
                //L1_request=0;
            }
            if(L2_request>0 && L2_request!=undefined){
                muxport.write("MUX"+positionOne+"N;&"+positionTwo+"F"+";"+turnCloseOpen+";"+shift_message+";"+"&"+"*");
                //("MUX"+"1N;&"+"2"+"F"+";"+turnCloseOpen+";"+shift_message+";"+"&"+"*"); 
                //L2_request=0;
            }
            TableNumber=turn_tablensx;
            //TableNumber=not_readtable;            
            numeroEnvio='0';     
        break;  
        case turnnsxbbbmux_mux://se envia si se requiere abrir o cerrar turno desde el bbb por proceso turno
            muxport.write("MUX"+positionOne+"G"+";"+turnMux+";"+"&"+positionTwo+"N;&"+"*");
            //("MUX"+"1"+"G"+";"+turnMux+";"+"&"+"2N;&"+"*"); 
            numeroEnvio='0';  
            //TableNumber=turn_tablensx;
            TableNumber=not_readtable;            
        break;    
        case creditbasket_mux:
            var resultado=60-shift_message.length; //apartir de esta linea hasta las 6 subsiguientes se adicionan los espacios del mensaje
            var adding_spaces=" ";
            for(x=1;x<resultado;x++){
                adding_spaces=adding_spaces+" ";
            }
            shift_message=shift_message+adding_spaces;   
            var validation;//validacion del credito venta 
            if(authorizedMoney!=undefined && creditValidacion=='1'){//validacion de cupo si tiene dinero y valida el nsx
                validation='1';
            }else{
                validation='0';                
            }
            var result1 =parseInt(authorizedMoney,10);//organizo datos para el cupo volumen a enviar
            var result2 =parseInt(PPUauthorized,10);
            var result3=result1/result2;
            var authorizedVolume = result3.toFixed(3);            
            completePlot(entered_value=authorizedVolume); 
            authorizedVolume=return_value;
            var authorizedVolume = authorizedVolume.replace(".", ",");
            if(L1_request>0 && L1_request!=undefined){
                muxport.write("MUX"+positionOne+"C"+";"+validation+";"+authorizedVolume+";"+"0"+authorizedMoney+";"+"0"+PPUauthorized+";"+shift_message+";"+"&"+positionTwo+"N;&"+"*");                
                //("MUX"+"1"+"C"+";"+validation+";"+authorizedVolume+";"+"0"+authorizedMoney+";"+"0"+PPUauthorized+";"+shift_message+";"+"&"+"2N;&"+"*"); 
                L1_request=0;
            }
            if(L2_request>0 && L2_request!=undefined){
                muxport.write("MUX"+positionOne+"N;&"+positionTwo+"C"+";"+validation+";"+authorizedVolume+";"+"0"+authorizedMoney+";"+"0"+PPUauthorized+";"+shift_message+";"+"&"+"*");
                //("MUX"+"1N;&"+"2"+"C"+";"+validation+";"+authorizedVolume+";"+"0"+authorizedMoney+";"+"0"+PPUauthorized+";"+shift_message+";"+"&"+"*"); 
                L2_request=0;
            }     
            Tablenumbercredit=0;
            TableNumber=not_readtable;             
            numeroEnvio='0';                
        break;   
        case responseto_requestpayment_mux:
            //endvaluesaldL1,,endvaluesaldL2
            completePlot(entered_value=salevalueFP);                                 
            salevalueFP=return_value;
            salevalueFP =salevalueFP.replace("." , ",");            
            if(L1_request>0 && L1_request!=undefined){
                activekeyboardFP="0";
                muxport.write("MUX"+positionOne+"A"+";"+validationFP+";"+salevalueFP+";"+activekeyboardFP+";"+"&"+positionTwo+"N;&"+"*");                
                //("MUX"+"1"+"A"+";"+validationFP+";"+salevalueFP+";"+activekeyboardFP+";"+"&"+"2N;&"+"*"); 
                L1_request=0;
            }
            if(L2_request>0 && L2_request!=undefined){
                activekeyboardFP="0";                
                muxport.write("MUX"+positionOne+"N;&"+positionTwo+"A"+";"+validationFP+";"+salevalueFP+";"+activekeyboardFP+";"+"&"+"*");
                //("MUX"+"1N;&"+"2"+"A"+";"+validationFP+";"+salevalueFP+";"+activekeyboardFP+";"+"&"+"*"); 
                L2_request=0;
            }        
            TableNumber=not_readtable;             
            numeroEnvio='0';              
        break;   
        case acceptedPayment_mux:
            if(L1_request>0 && L1_request!=undefined){
                muxport.write("MUX"+positionOne+"B"+";"+"1"+";"+"&"+positionTwo+"N;&"+"*");                
                //("MUX"+"1"+"B"+";"+"1"+";"+"&"+"2N;&"+"*");
                L1_request=0;                
            }
            
            if(L2_request>0 && L2_request!=undefined){            
                muxport.write("MUX"+positionOne+"N;&"+positionTwo+"B"+";"+"1"+";"+"&"+"*");
                //("MUX"+"1N;&"+"2"+"B"+";"+"1"+";"+"&"+"*");
                L2_request=0;                
            }
            TableNumber=not_readtable;             
            numeroEnvio='0';            
        break;
        
        case consign_mux:
            var resultado=60-shift_messageConsg.length; //apartir de esta linea hasta las 6 subsiguientes se adicionan los espacios del mensaje
            var adding_spaces=" ";
            for(x=1;x<resultado;x++){
                adding_spaces=adding_spaces+" ";
            }
            shift_messageConsg=shift_messageConsg+adding_spaces;            
            if(L1_request>0 && L1_request!=undefined){
                muxport.write("MUX"+positionOne+"E"+";"+validationConsg+";"+shift_messageConsg+";"+"&"+positionTwo+"N;&"+"*");                
                //("MUX"+"1"+"E"+";"+validationConsg+";"+shift_messageConsg+";"+"&"+"2N;&"+"*");  
                L1_request=0;                
            }
            if(L2_request>0 && L2_request!=undefined){
                muxport.write("MUX"+positionOne+"N;&"+positionTwo+"E"+";"+validationConsg+";"+shift_messageConsg+";"+"&"+"*");
                //("MUX"+"1N;&"+"2"+"E"+";"+validationConsg+";"+shift_messageConsg+";"+"&"+"*"); 
                L2_request=0;               
            }
            Tablenumberconsign=0;
            TableNumber=not_readtable;             
            numeroEnvio='0';    
        break;    
        case responseto_requestBasket_mux:
            var resultado=20-nameBasket.length; //apartir de esta linea hasta las 6 subsiguientes se adicionan los espacios del mensaje
            var adding_spaces=" ";
            for(x=1;x<resultado;x++){
                adding_spaces=adding_spaces+" ";
            }
            nameBasket=nameBasket+adding_spaces;
                    
            for(x=0;x<=7;x++){
                valueBasket =valueBasket.replace(" ", '');
            }
            switch (valueBasket.length) {     
                case 0:
                    valueBasket="00000000"+valueBasket;                    
                break;        
                case 1:
                    valueBasket="0000000"+valueBasket;                    
                break;
                case 2:
                    valueBasket="000000"+valueBasket;                    
                break;                
                case 3:
                    valueBasket="00000"+valueBasket;                    
                break;
                case 4:
                    valueBasket="0000"+valueBasket;
                break;
                case 5:
                    valueBasket="000"+valueBasket;                    
                break;
                case 6:
                    valueBasket="00"+valueBasket;                    
                break;
                case 7:
                    valueBasket="0"+valueBasket;                    
                break;
                default:
            }            
            for(x=0;x<=2;x++){        
                quantityBasket = quantityBasket.replace(" ", '');
            }
            switch (quantityBasket.length) {     
                case 0:
                    quantityBasket="000"+quantityBasket;
                break;        
                case 1:
                    quantityBasket="00"+quantityBasket;
                break;
                case 2:
                    quantityBasket="0"+quantityBasket;
                break;                
                default:
            }                
            if(L1_request>0 && L1_request!=undefined){
                muxport.write("MUX"+positionOne+"D"+";"+validationBasket+";"+nameBasket+";"+valueBasket+";"+quantityBasket+";"+"&"+positionTwo+"N;&"+"*");                
                //("MUX"+"1"+"D"+";"+validationBasket+";"+nameBasket+";"+valueBasket+";"+quantityBasket+";"+"&"+"2N;&"+"*");  
                L1_request=0;
            }
            if(L2_request>0 && L2_request!=undefined){
                muxport.write("MUX"+positionOne+"N;&"+positionTwo+"D"+";"+validationBasket+";"+nameBasket+";"+valueBasket+";"+quantityBasket+";"+"&"+"*");
                //("MUX"+"1N;&"+"2"+"D"+";"+validationBasket+";"+nameBasket+";"+valueBasket+";"+quantityBasket+";"+"&"+"*"); 
                L2_request=0;               
            }            
            TableNumber=not_readtable;             
            numeroEnvio='0';            
        break;

        case accepetFP_mux:
            if(L1_request>0 && L1_request!=undefined){
                muxport.write("MUX"+positionOne+"B"+";"+"1"+";"+"&"+positionTwo+"N;&"+"*");                
                //("MUX"+"1"+"B"+";"+"1"+";"+"&"+"2N;&"+"*");  
                L1_request=0;                                        
                TableNumber=not_readtable;             
                numeroEnvio='0';                
            }
            if(L2_request>0 && L2_request!=undefined){
                muxport.write("MUX"+positionOne+"N;&"+positionTwo+"B"+";"+"1"+";"+"&"+"*");
                //("MUX"+"1N;&"+"2"+"B"+";"+"1"+";"+"&"+"*"); 
                L2_request=0;
                TableNumber=not_readtable;             
                numeroEnvio='0';                
            }            
        break;
        default:
    }
};

/*
*********************************************************************************************************
*                                function completePlot()
*
* Description : Recibe una cadena de datos que luego completa con ceros
*               
*******************************************************************************************
*/

var return_value;

var completePlot =function(entered_value){
    
    var x=0;
    x= String(entered_value);
    switch (x.length) {     
        case 0:
            entered_value='00000000'+entered_value;                    
        break;        
        case 1:
            entered_value='0000000'+entered_value;                    
        break;
        case 2:
            entered_value='000000'+entered_value;                    
        break;                
        case 3:
            entered_value='00000'+entered_value;                    
        break;
        case 4:
            entered_value='0000'+entered_value;
        break;
        case 5:
            entered_value='000'+entered_value;                    
        break;
        case 6:
            entered_value='00'+entered_value;                    
        break;
        case 7:
            entered_value='0'+entered_value;                    
        break;
        default:
    }    
    return_value=entered_value;
    return(return_value);
};




/*
*********************************************************************************************************
*                                    Metodos Principales
*********************************************************************************************************
*/

//muxport.open(abrir);                    //Abre la comunicacion con el mux
//printport.open(abrir_print);            //Abre la comunicacion con el mux

/*
*********************************************************************************************************
*                                    Metodos Principales
*********************************************************************************************************
*/

//muxport.open(abrir);                  //Abre la comunicacion con el mux
//printport.open(abrir_print);          //Abre la comunicacion con el mux
setInterval(watchful,5000);           //5000 Revisa el estado de las banderas
setInterval(readTables_consign, 2000);  //2000 lectura de tablas de consignacion
setInterval(readTables_credit, 1500);   // 3000 lectura de tablas de creditos
setInterval(readTables, 9000);          // 9000




