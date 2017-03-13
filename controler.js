/*
*********************************************************************************************************
*                                           MUX CODE
*
*                             (c) Copyright 2016; Sistemas Insepet LTDA
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

//var ds              = require("xmldeserializer");
//var trycatch        = require('trycatch');
var sprintf         = require("sprintf").sprintf;
//var rest_autorizar  = require("request");
//var rest_venta      = require("request");
var sp              = require("serialport");
var sp2             = require("serialport");
var sp3             = require("serialport");
var pg              = require('pg');
//var jonah           = require('jonah');
/*
*********************************************************************************************************
*                                    DECLARACION DE VARIABLES
*********************************************************************************************************
*/
var port_mux          = '/dev/ttyO4';
var config_port_mux   = {baudrate: 115200, parser: sp.parsers.readline("*")};
var muxport           = new sp.SerialPort(port_mux,config_port_mux,abrir);

var port_print          = '/dev/ttyO1';
var config_port_print   = {baudrate: 115200, parser: sp2.parsers.readline("*")};//9600
var printport           = new sp2.SerialPort(port_print,config_port_print);

var port_print2         = '/dev/ttyO2';
var config_port_print2  = {baudrate: 115200, parser: sp3.parsers.readline("*")};
var printport2          = new sp3.SerialPort(port_print2,config_port_print2);
     
var conString         = "postgrest://db_admin:12345@localhost:5432/nsx";
/*****************Variables para el flujo***************************/

//variables globales
var x;
var accountant;
var accountant_2;
var identifier;
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

var RESET_RESET=5;
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


var next_position;
var dataOK;

var frame_1 = {
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

var Frame_1ready='3'; 

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

var EndconfigurationInitial=0;
var tipeofResetL1,tipeofResetL2;
var Frame_2ready='5';
var L1_request,L2_request;
var FVenta1='1',FVenta2='1',terminototales='0';
var L1supplier_positionD;
var requestConfigurationL1,requestConfigurationL2;
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
       //('1error en abrir: '+error);
   } else{
       //('open '+port_mux);
       muxport.on('data',rx_data_mux);
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
var campo1,campo2,campo3,campo4,campo5,campo6,campo9,campo10,campo11;
var copiaL1=0,copiaL2=0; 
       
function abrir_print(error){
    
   if (error){
       //('1error en abrir_print: '+error);
   } else{
       //('open '+port_print);

        pg.connect(conString, function(err, client, done){
            if(err){
                return console.error('2Error de conexion 1', err);
            }else{
                //client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen='%1$s'",numerodecampo ),function(err,result){
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=1;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('3Error de configuraciondispensador', err);
                    }else{
                        campo1=result.rows[0].valor; 
                    }
                }); 
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=2;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('4Error de configuraciondispensador', err);
                    }else{
                        campo2=result.rows[0].valor; 
                    }
                }); 
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=3;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('5Error de configuraciondispensador', err);
                    }else{
                        campo3=result.rows[0].valor;
                    }
                }); 
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=4;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('6Error de configuraciondispensador', err);
                    }else{
                        campo4=result.rows[0].valor; 
                    }
                }); 
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=5;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('7Error de configuraciondispensador', err);
                    }else{
                        campo5=result.rows[0].valor; 
                    }
                });    
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=6;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('8Error de configuraciondispensador', err);
                    }else{
                        campo6=result.rows[0].valor; 
                    }
                });   
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=9;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('9Error de configuraciondispensador', err);
                    }else{
                        campo9=result.rows[0].valor; 
                    }
                });   
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=10;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('10Error de configuraciondispensador', err);
                    }else{
                        campo10=result.rows[0].valor; 
                    }
                });   
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=11;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('11Error de configuraciondispensador', err);
                    }else{
                        campo11=result.rows[0].valor; 
                        /// centrando el enunciado de cada campo
                        var resultado=30-campo1.length;
                        var resultadodividido= resultado /2;
                        var adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo1=adding_spaces + campo1;
                        resultado=30-campo2.length;//
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo2=adding_spaces + campo2;
                        resultado=30-campo3.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo3=adding_spaces + campo3;
                        resultado=30-campo4.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo4=adding_spaces + campo4;
                        resultado=30-campo5.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo5=adding_spaces + campo5;
                        resultado=30-campo6.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo6=adding_spaces + campo6;
                        resultado=30-campo9.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo9=adding_spaces + campo9;
                        resultado=30-campo10.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo10=adding_spaces + campo10;
                        resultado=30-campo11.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo11=adding_spaces + campo11;
                        //Header                               
                        //("campo1=" + campo1);                        
                        //("campo2=" + campo2);
                        //("campo3=" + campo3);
                        //("campo4=" + campo4);
                        //("campo5=" + campo5);
                        //("campo6=" + campo6);
                        //footer
                        //("campo9=" + campo9);
                        //("campo10=" + campo10);
                        //("campo11=" + campo11);   
                       
                        var ano =new Buffer(4);
                        var mes =new Buffer(2);
                        var dia =new Buffer(2);
                        var hora =new Buffer(2);
                        var min =new Buffer(2);
                        var seg =new Buffer(2);       

                        for(x=0;x<=3;x++){
                            ano[x]=frame_1.date_Time_sale[x];
                        }
                        var y=0;
                        for(x=4;x<=5;x++){
                            mes[y]=frame_1.date_Time_sale[x];
                            y++;
                        }  
                        y=0;
                        for(x=6;x<=7;x++){
                            dia[y]=frame_1.date_Time_sale[x];
                            y++;
                        }   
                        y=0;
                        for(x=8;x<=9;x++){
                            hora[y]=frame_1.date_Time_sale[x];
                            y++;
                        }       
                        y=0;
                        for(x=10;x<=11;x++){
                            min[y]=frame_1.date_Time_sale[x];
                            y++;
                        }     
                        y=0;
                        for(x=12;x<=13;x++){
                            seg[y]=frame_1.date_Time_sale[x];
                            y++;
                        }      

                        if(copiaL1==1){
                            printport.write("   ****      COPIA      ****"+'\n\n');                             
                        }
                        printport.write("   ****Recibo sin sistema****"+'\n\n');  
                        printport.write(campo1+'\n');
                        printport.write(campo2+'\n');
                        printport.write(campo3+'\n');
                        printport.write(campo4+'\n');
                        printport.write(campo5+'\n');        
                        printport.write(campo6+'\n\n\n\n');
                        printport.write("Posicion   : 1"+'\n');                                         // 
                        printport.write("Fecha      : "+dia+"/"+mes+"/"+ano+'\n');                      //
                        printport.write("Hora       : "+hora+":"+min+":"+seg+'\n\n\n');                 //
                        frame_1.license_plate3=frame_1.license_plate;
                        for(x=0;x<=9;x++){
                            frame_1.license_plate3=String(frame_1.license_plate3).replace(" ","");
                        }
                        printport.write("Placa      : "+frame_1.license_plate3+'\n');  
                        printport.write("Kilometraje: "+parseFloat(frame_1.mileage)+'\n');              //
                        printport.write("Nit        : "+parseFloat(frame_1.identity_card)+'\n');              //                         
                        switch(frame_1.type_of_product_sold){
                            case '1':
                                printport.write("Producto   : "+buttons[26]+'\n');             //                                 
                            break;
                            case '2':
                                printport.write("Producto   : "+buttons[27]+'\n');             //                                  
                            break;
                            case '3':
                                printport.write("Producto   : "+buttons[28]+'\n');             //                                 
                            break;                            
                            default:
                            
                        }     
                        printport.write("Ppu        : "+parseFloat(frame_1.PPU_sold)+'\n');             //
                        frame_1.volume_sold3=parseFloat(frame_1.volume_sold);
                        frame_1.volume_sold3=frame_1.volume_sold3.toFixed(3);
                        printport.write("Volumen    : G "+frame_1.volume_sold3+'\n');
                        printport.write("Dinero     : $ "+parseFloat(frame_1.money_selling)+'\n\n\n');  //     
                        printport.write(campo9+'\n');
                        printport.write(campo10+'\n');        
                        printport.write(campo11+'\n\n\n\n\n\n\n\n'); 
                        copiaL1=1;                        
                    }
                });                   
            }   
        });  
   }
}

function abrir_print2(error){
    
   if (error){
       //('1error abrir_print2: '+error);
   } else{
       //('open '+port_print2);

        pg.connect(conString, function(err, client, done){
            if(err){
                return console.error('2Error de conexion 1', err);
            }else{
                //client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen='%1$s'",numerodecampo ),function(err,result){
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=1;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('3Error de configuraciondispensador', err);
                    }else{
                        campo1=result.rows[0].valor; 
                    }
                }); 
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=2;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('4Error de configuraciondispensador', err);
                    }else{
                        campo2=result.rows[0].valor; 
                    }
                }); 
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=3;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('5Error de configuraciondispensador', err);
                    }else{
                        campo3=result.rows[0].valor;
                    }
                }); 
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=4;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('6Error de configuraciondispensador', err);
                    }else{
                        campo4=result.rows[0].valor; 
                    }
                }); 
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=5;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('7Error de configuraciondispensador', err);
                    }else{
                        campo5=result.rows[0].valor; 
                    }
                });    
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=6;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('8Error de configuraciondispensador', err);
                    }else{
                        campo6=result.rows[0].valor; 
                    }
                });   
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=9;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('9Error de configuraciondispensador', err);
                    }else{
                        campo9=result.rows[0].valor; 
                    }
                });   
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=10;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('10Error de configuraciondispensador', err);
                    }else{
                        campo10=result.rows[0].valor; 
                    }
                });   
                client.query(sprintf("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen=11;" ),function(err,result){
                    done();
                    if(err){
                        return console.error('11Error de configuraciondispensador', err);
                    }else{
                        campo11=result.rows[0].valor; 
                        /// centrando el enunciado de cada campo
                        var resultado=30-campo1.length;
                        var resultadodividido= resultado /2;
                        var adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo1=adding_spaces + campo1;
                        resultado=30-campo2.length;//
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo2=adding_spaces + campo2;
                        resultado=30-campo3.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo3=adding_spaces + campo3;
                        resultado=30-campo4.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo4=adding_spaces + campo4;
                        resultado=30-campo5.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo5=adding_spaces + campo5;
                        resultado=30-campo6.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo6=adding_spaces + campo6;
                        resultado=30-campo9.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo9=adding_spaces + campo9;
                        resultado=30-campo10.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo10=adding_spaces + campo10;
                        resultado=30-campo11.length;
                        resultadodividido= resultado /2;
                        adding_spaces=" ";
                        for(x=1;x<=resultadodividido;x++){
                            adding_spaces=adding_spaces+" ";
                        }
                        campo11=adding_spaces + campo11;                              
                        //("campo1=" + campo1);                        
                        //("campo2=" + campo2);
                        //("campo3=" + campo3);
                        //("campo4=" + campo4);
                        //("campo5=" + campo5);
                        //("campo6=" + campo6);
                        //("campo9=" + campo9);
                        //("campo10=" + campo10);
                        //("campo11=" + campo11);   
                       
                        var ano =new Buffer(4);
                        var mes =new Buffer(2);
                        var dia =new Buffer(2);
                        var hora =new Buffer(2);
                        var min =new Buffer(2);
                        var seg =new Buffer(2);       

                        for(x=0;x<=3;x++){
                            ano[x]=frame_2.date_Time_sale[x];
                        }
                        var y=0;
                        for(x=4;x<=5;x++){
                            mes[y]=frame_2.date_Time_sale[x];
                            y++;
                        }  
                        y=0;
                        for(x=6;x<=7;x++){
                            dia[y]=frame_2.date_Time_sale[x];
                            y++;
                        }   
                        y=0;
                        for(x=8;x<=9;x++){
                            hora[y]=frame_2.date_Time_sale[x];
                            y++;
                        }       
                        y=0;
                        for(x=10;x<=11;x++){
                            min[y]=frame_2.date_Time_sale[x];
                            y++;
                        }     
                        y=0;
                        for(x=12;x<=13;x++){
                            seg[y]=frame_2.date_Time_sale[x];
                            y++;
                        }       
                        
                        if(copiaL2==1){
                            printport2.write("   ****      COPIA      ****"+'\n\n');                             
                        }                        
                        printport2.write("   ****Recibo sin sistema****"+'\n\n');  
                        printport2.write(campo1+'\n');
                        printport2.write(campo2+'\n');
                        printport2.write(campo3+'\n');
                        printport2.write(campo4+'\n');
                        printport2.write(campo5+'\n');        
                        printport2.write(campo6+'\n\n\n\n');
                        printport2.write("Posicion   : 2"+'\n'); 
                        printport2.write("Fecha      : "+dia+"/"+mes+"/"+ano+'\n');
                        printport2.write("Hora       : "+hora+":"+min+":"+seg+'\n\n\n');
                        frame_2.license_plate4=frame_2.license_plate;
                        for(x=0;x<=9;x++){
                            frame_2.license_plate4=String(frame_2.license_plate4).replace(" ","");
                        }                        
                        printport2.write("Placa      : "+frame_2.license_plate4+'\n');   
                        printport2.write("Kilometraje: "+parseFloat(frame_2.mileage)+'\n');
                        printport2.write("Nit        : "+parseFloat(frame_2.identity_card)+'\n');              //                         
                        switch(frame_2.type_of_product_sold){
                            case '1':
                                printport2.write("Producto   : "+buttons[26]+'\n');             //                                 
                            break;
                            case '2':
                                printport2.write("Producto   : "+buttons[27]+'\n');             //                                  
                            break;
                            case '3':
                                printport2.write("Producto   : "+buttons[28]+'\n');             //                                 
                            break;                            
                            default:
                            
                        }                            
                        printport2.write("Ppu        : "+parseFloat(frame_2.PPU_sold)+'\n');  
                        frame_2.volume_sold4=parseFloat(frame_2.volume_sold);
                        frame_2.volume_sold4=frame_2.volume_sold4.toFixed(3);                        
                        printport2.write("Volumen    : G "+frame_2.volume_sold4+'\n');
                        printport2.write("Dinero     : $ "+parseFloat(frame_2.money_selling)+'\n\n\n');     
                        printport2.write(campo9+'\n');
                        printport2.write(campo10+'\n');        
                        printport2.write(campo11+'\n\n\n\n\n\n\n\n');  
                        copiaL2=1;							
                    }
                });                   
            }   
        });  
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
var ocupadoDATABASEL1canastacontado,ocupadoDATABASEL2canastacontado;
var L1ERROR,L2ERROR,datagiveTotable_creditL1,datagiveTotable_creditL2;

function rx_data_mux(data){
           
    if((data[0]==='B') && (data[1]==='G') && (data[2]==='E')){                  //encabezado
        accountant=0;        
        for(x=0;x<=data.length;x++){
            accountant++;               
            if (data[x]=='&') {                                                 //separador de posiciones segun protocolo
                break;
            }
        }
        accountant_2=0;
        for(x=accountant;x<=data.length;x++){
            accountant_2++;             
            if (data[x]=='&') {                                    
                break;
            }
        }    
        number_process_rxmux(accountant,accountant_2,identifier=data[4]);   
        sendBBB2vivomux();        
                       
        switch (identifier) {  
            case 'a':     
                frame_1.supplier_position=data[3];  
                positionOne=data[3];
                frame_1.state = data.charCodeAt(6);
                switch (frame_1.state) {
                    case 0x10:
                        statesPhpL1(errorL1);                        
                        //('>>EstadoL1: Error');
                        L1ERROR=1;
                        sendMux(resetforError);
                    break;
                    case 0x16:
                        statesPhpL1(esperaL1);
                        //('>>EstadoL1: Espera');
                        if(requestConfigurationL1==1){
                            TableNumber=1;
                            requestConfigurationL1=0;
                        }
                    break;
                    case 0x19:
                        statesPhpL1(surtiendoL1);
                        //('>>EstadoL1: Surtiendo');                
                    break;
                    case 0x1b:
                        statesPhpL1(finventaceroL1);                                            
                        //('>>EstadoL1: Fin Venta en cero');                          
                    break;
                    case 0x1f:
                        statesPhpL1(LazodesconectadoL1);                                            
                        //('>>EstadoL1: Lazo desconectado');                          
                    break;                      
                    case 0x22:
                        //('>>EstadoL1: Esperando respuesta a peticion venta seleccionada Forma de pago');                
                    break;
                    case 0x23:
                        //('>>EstadoL1: Espera transaccion forma de pago');                
                    break;
                    case 0x27:
                        switch(frame_1.type_sale){
                            case '1':
                                if(datagiveTotable_creditL1==1){
                                    statesPhpL1(idusuariocreditoL1);
                                    //('>>EstadoL1: Esperando respuesta a peticion Identificacion usuario credito'); 
                                }
                            break;
                            case '2':
                                statesPhpL1(transaccionCrecanL1);
                                //('>>EstadoL1: Espera transaccion credito para canasta');
                            break;    
                            case '3':
                                statesPhpL1(procesocalibracionL1);
                                //('>>EstadoL1: Proceso de calibracion');                                        
                            break;
                            default:
                        }
                    break;
                    case 0x28:
                        switch (frame_1.type_sale){
                            case '1':
                                statesPhpL1(idusuariocredito2L1);
                                //('>>EstadoL1: Espera transaccion credito');                                        
                            break;    
                            case '2':
                                statesPhpL1(transaccionCrecan2L1);
                                //('>>EstadoL1: Espera transaccion credito para canasta..');                         
                            break;    
                            case '3':
                                statesPhpL1(procesocalibracion2L1);
                                //('>>EstadoL1: Proceso de calibracion dos....');                                        
                            break;
                            default:
                        }
                    break;
                    case 0x29:
                        //('>>EstadoL1: Esperando respuesta a peticion Calibracion');                
                    break;
                    case 0x32:
                        statesPhpL1(idproductcanastaL1);
                        //('>>EstadoL1: Esperando respuesta a peticion Identificacion producto cansata');                
                    break;
                    case 0x34:
                        if(stateNSXvariableglobal==0){
                            if(frame_1.printer1=='1' || frame_2.printer1=='1'){
                                abrir_print();                                
                            }else{
                                if(frame_1.printer2=='1' || frame_2.printer2=='1'){
                                    abrir_print2();                                  
                                }else{
                                    abrir_print();                                      
                                }                                
                            }
                        }   
                        statesPhpL1(reciboL1);                            
                        //('>>EstadoL1: Recibo de impresion');                        
                    break;   
                    case 0x36:
                        statesPhpL1(esperarespuestaconsignacionL1);
                        //('>>EstadoL1: Esperando respuesta a Peticion consignacion');                
                    break;
                    case 0x38:
                        statesPhpL1(posicionbloqueadaL1);
                        //('>>EstadoL1: Posicion bloqueada y pitando...');                         
                    break;    
                    case 0x39:
                        statesPhpL1(menucanastaL1);
                        //('>>EstadoL1: Entra a menu de canasta');                        
                    break;
                    case 0x3a:
                        statesPhpL1(MuxSolicitaConfL1);
                        requestConfigurationL1=1;
                        //('>>EstadoL1: Mux solicita configuraciones');                          
                    break;    
                    case 0x40:
                        statesPhpL1(pendientedatosTurnL1);
                        //('>>EstadoL1: Pendiente datos turno');                
                    break;    
                    case 0x42:
                        statesPhpL1(turnoaperturacierreL1);
                        //('>>EstadoL1: Espera de respuesta a peticion turno Apertura o Cierre');                             
                    break;    
                    default:
                }
                tipeofResetL1=0;
                dataOK=false;
                if(type_of_reception!=STATE_STATE){
                    tipeofResetL1='a';
                    dataOK=true;  
                }
                number_process2_rxmux(type_of_reception);
                next_position=9;
                frame_1.memoria_part=1;
                
                if(frame_1.state==0x34 || frame_1.state==0x1b || frame_1.state==0x3a){//caso para impresion o finventa cero o configuraciones
                    tipeofResetL1='2';
                    dataOK=true;                     
                }
            break;
            case 'b':                                                           //Fin venta
                FVenta1='1';
                //('___finventaL1___');
                frame_1.supplier_position=data[3];                 
                L1supplier_positionD=data.charCodeAt(3);                  
                frame_1.type_sale=data[6];      
                frame_1.preset_type=data[8];   
                for(x=0;x<=7;x++){
                    frame_1.preset_value[x]=data.charCodeAt(x+10);    
                }
                frame_1.selected_product=data[19]; 
                for(x=0;x<=13;x++){     
                    frame_1.date_hour[x]=data.charCodeAt(x+21);     
                }   
                for(x=0;x<=12;x++){     
                    frame_1.total_previous_volume[x]=data.charCodeAt(x+36);   
                    if(frame_1.total_previous_volume[x]===44){
                        frame_1.total_previous_volume[x]=46;
                    }                       
                } 
                for(x=0;x<=12;x++){     
                    frame_1.total_money_previous[x]=data.charCodeAt(x+50);     
                }
                for(x=0;x<=5;x++){ 
                    frame_1.previous_PPU[x]=data.charCodeAt(x+64);     
                } 
                for(x=0;x<=7;x++){ 
                    frame_1.volume_sold[x]=data.charCodeAt(x+71);
                    if(frame_1.volume_sold[x]===44){
                        frame_1.volume_sold[x]=46;
                    }                    
                }   
                for(x=0;x<=7;x++){ 
                    frame_1.money_selling[x]=data.charCodeAt(x+80);     
                }
                for(x=0;x<=5;x++){      
                    frame_1.PPU_sold[x]=data.charCodeAt(x+89);     
                }      
                frame_1.type_of_product_sold=data[96]; 
                for(x=0;x<=9;x++){  
                    frame_1.license_plate[x]=data.charCodeAt(x+98);     
                }  
                for(x=0;x<=9;x++){  
                    frame_1.mileage[x]=data.charCodeAt(x+109);     
                }  
                for(x=0;x<=9;x++){ 
                    frame_1.identity_card[x]=data.charCodeAt(x+120);     
                } 
                for(x=0;x<=13;x++){    
                    frame_1.date_Time_sale[x]=data.charCodeAt(x+131);     
                } 
                frame_1.type_of_vehicle=data[146];
                frame_1.type_of_customer_identification=data[148];  
                for(x=0;x<=19;x++){      
                    frame_1.customer_identification[x]=data.charCodeAt(x+150);     
                } 
                frame_1.islero_typeid=data[171]; 
                for(x=0;x<=19;x++){    
                    frame_1.isleroid[x]=data.charCodeAt(x+173);     
                } 
                for(x=0;x<=12;x++){     
                    frame_1.totalvolumeback[x]=data.charCodeAt(x+194);  
                    if(frame_1.totalvolumeback[x]===44){
                        frame_1.totalvolumeback[x]=46;
                    }                        
                } 
                for(x=0;x<=12;x++){     
                    frame_1.totalmoneyback[x]=data.charCodeAt(x+208);     
                } 
                for(x=0;x<=4;x++){     
                    frame_1.totalbackPPU[x]=data.charCodeAt(x+223); 
                } 
                /*(frame_1.supplier_position+"-"+frame_1.type_sale+"-"+frame_1.preset_type+"-"+frame_1.preset_value+"-"+frame_1.selected_product
                            +"-"+frame_1.date_hour+"-"+frame_1.total_previous_volume+"-"+frame_1.total_money_previous+"-"+frame_1.previous_PPU
                            +"-"+frame_1.volume_sold+"-"+frame_1.money_selling+"-"+frame_1.PPU_sold+"-"+frame_1.type_of_product_sold+"-"+frame_1.license_plate
                            +"-"+frame_1.mileage+"-"+frame_1.identity_card+"-"+frame_1.date_Time_sale+"-"+frame_1.type_of_customer_identification
                            +"-"+frame_1.customer_identification+"-"+frame_1.islero_typeid+"-"+frame_1.isleroid+"-"+frame_1.totalvolumeback
                            +"-"+frame_1.totalmoneyback+"-"+frame_1.totalbackPPU);*/
                number_process2_rxmux(type_of_reception); 
                muxWriteTablesL1(FinventaL1);
                next_position=230;                    
                tipeofResetL1='2';                
                dataOK=true;                
                frame_1.memoria_part=2;
                FVenta1='0';
                terminototales='1'; 
                copiaL1=0;                
            break;
            case 'd':                                                           //DISCRIMINAR FORMA DE PAGO(#venta) 
                //('___discriminarformadepagoventaL1___');
                frame_1.supplier_position=data[3];  
                L1_request=data.charCodeAt(3);   
                for(x=0;x<=7;x++){        
                    frame_1.sales_number[x]=data.charCodeAt(x+6);     
                } 
                for(x=0;x<=1;x++){ 
                    frame_1.type_of_payment[x]=data.charCodeAt(x+15);     
                } 
                frame_1.consultation_sale=data[18];     
                //(frame_1.supplier_position+"-"+frame_1.sales_number+"-"+frame_1.type_of_payment+"-"+frame_1.consultation_sale);
                number_process2_rxmux(type_of_reception);         
                if(ocupaconsultaDATABASEFPL2!=1){  
                    ocupaconsultaDATABASEFPL1=1;                                 
                    muxWriteTablesL1(discriminarformadepagoventaL1);
                    TableNumber=responseto_requestpayment_tableL1; 
                }
                next_position=21;
                tipeofResetL1='2';                
                dataOK=true;                
                frame_1.memoria_part=2;     
            break;
            case 'e':                                                           //VALOR_DISCRIMINADO
                //('___valordiscriminadoL1___');
                frame_1.supplier_position=data[3];  
                L1_request=data.charCodeAt(3);                  
                for(x=0;x<=7;x++){        
                    frame_1.sales_number[x]=data.charCodeAt(x+6);     
                } 
                for(x=0;x<=1;x++){  
                    frame_1.type_of_payment[x]=data.charCodeAt(x+15);     
                } 
                frame_1.consultation_sale=data[18];    
                for(x=0;x<=7;x++){          
                    frame_1.discrim_value[x]=data.charCodeAt(x+20);     
                } 
                for(x=0;x<=19;x++){      
                    frame_1.serial_id[x]=data.charCodeAt(x+29);     
                } 
                //(frame_1.supplier_position+"-"+frame_1.sales_number+"-"+frame_1.type_of_payment+"-"+frame_1.consultation_sale+"-"+frame_1.discrim_value
                //            +"-"+frame_1.serial_id);
                number_process2_rxmux(type_of_reception);
                muxWriteTablesL1(valordiscriminadoL1);                
                TableNumber =discriminateSale_tableL1; 
                next_position=51;                
                tipeofResetL1='2';                
                dataOK=true;                
                frame_1.memoria_part=2;      
            break;    
            case 'f':                                                           //CREDITO_CANASTA
                //('___creditocanastaL1___');
                for(x=0;x<=19;x++){         
                    frame_1.serial_id[x]='0';     
                }
                frame_1.supplier_position=data[3]; 
                //("Posicion: "+data[3]);
                var L1supplier_positionD=data.charCodeAt(3);   
                L1_request=data.charCodeAt(3);                    
                for(x=0;x<=9;x++){         
                    frame_1.mileage[x]=data.charCodeAt(x+6);     
                } 
                frame_1.type_of_customer_identification=data[17]; 
                for(x=0;x<=19;x++){         
                    frame_1.serial_id[x]=data.charCodeAt(x+19);     
                } 
                frame_1.type_sale =data[40];  
                frame_1.product_type =data[42];  
                /*("Supplier:"+frame_1.supplier_position+" "+"Km:"+frame_1.mileage+" "+"Customer:"+frame_1.type_of_customer_identification+" "+
                            "Serial:"+frame_1.serial_id+" "+"Type:"+frame_1.type_sale+" "+"Product:"+frame_1.product_type);*/
                number_process2_rxmux(type_of_reception);            
                
                switch (frame_1.type_sale){
                    case '1':
                        muxWriteTablesL1(creditocanasta1L1);
                        Tablenumbercredit=creditbasket_tableL1;                        
                    break;
                    case '2':
                        muxWriteTablesL1(creditocanasta2L1);
                        Tablenumbercredit=Cbasket_tableL1;
                    break;
                    case '3':
                        muxWriteTablesL1(creditocanasta3L1);
                        TableNumber=calibration_tableL1;                        
                    break;                    
                    default:
                }
                
                for(x=0;x<=19;x++){
                    frame_1.serial_id[x]='0';
                }
                next_position=45;                
                tipeofResetL1='2';                
                dataOK=true;                
                frame_1.memoria_part=2;                  
            break;   
            case 'g':                                                           //IDENTIFICACIONPRODUCTO_CANASTA
                //('___identificacionproductocanastaL1___');
                frame_1.supplier_position=data[3]; 
                L1_request=data.charCodeAt(3);                   
                for(x=0;x<=19;x++){         
                    frame_1.serial_product[x]=data.charCodeAt(x+6);     
                } 
                //(frame_1.supplier_position+"-"+frame_1.serial_product);
                number_process2_rxmux(type_of_reception);
                muxWriteTablesL1(identificacionproductocanastaL1);
                TableNumber=basket_tableL1;
                next_position=28;                
                tipeofResetL1='2';                
                dataOK=true;                
                frame_1.memoria_part=2; 
            break;            
            case 'h':                                                           //FINVENTACANASTA 
                ocupadoDATABASEL1canastacontado=1;
                    //('___finventacanastaL1___');
                    frame_1.supplier_position=data[3];  
                    frame_1.type_sale=data[6];  
                    for(x=0;x<=19;x++){          
                        frame_1.serialP1[x]=data.charCodeAt(x+8);     
                    } 
                    for(x=0;x<=2;x++){         
                        frame_1.quantityP1[x]=data.charCodeAt(x+29);     
                    } 
                    for(x=0;x<=7;x++){         
                        frame_1.total_valueP1[x]=data.charCodeAt(x+33);     
                    } 
                    for(x=0;x<=19;x++){         
                        frame_1.serialP2[x]=data.charCodeAt(x+42);     
                    } 
                    for(x=0;x<=2;x++){       
                        frame_1.quantityP2[x]=data.charCodeAt(x+63);     
                    } 
                    for(x=0;x<=7;x++){         
                        frame_1.total_valueP2[x]=data.charCodeAt(x+67);     
                    } 
                    for(x=0;x<=19;x++){      
                        frame_1.serialP3[x]=data.charCodeAt(x+76);     
                    } 
                    for(x=0;x<=2;x++){         
                        frame_1.quantityP3 [x]=data.charCodeAt(x+97);     
                    } 
                    for(x=0;x<=7;x++){        
                        frame_1.total_valueP3[x]=data.charCodeAt(x+101);     
                    } 
                    for(x=0;x<=8;x++){        
                        frame_1.sellout_basket[x]=data.charCodeAt(x+110);     
                    } 
                    for(x=0;x<=13;x++){        
                        frame_1.date_hour[x]=data.charCodeAt(x+120);     
                    } 
                    frame_1.type_of_customer_identification=data[135]; 
                    for(x=0;x<=19;x++){       
                        frame_1.customer_identification[x]=data.charCodeAt(x+137);     
                    } 
                    frame_1.islero_typeid=data[158];  
                    for(x=0;x<=19;x++){          
                        frame_1.isleroid[x]=data.charCodeAt(x+160);     
                    } 
                    /*(frame_1.supplier_position+"-"+frame_1.type_sale+"-"+frame_1.serialP1+"-"+frame_1.quantityP1+"-"+frame_1.total_valueP1
                                +"-"+frame_1.serialP2+"-"+frame_1.quantityP2+"-"+frame_1.total_valueP2+"-"+frame_1.serialP3+"-"+frame_1.quantityP3
                                +"-"+frame_1.total_valueP3+"-"+frame_1.sellout_basket+"-"+frame_1.date_hour+"-"+frame_1.type_of_customer_identification
                                +"-"+frame_1.customer_identification+"-"+frame_1.islero_typeid+"-"+frame_1.isleroid);*/
                    switch (frame_1.type_sale){
                        case '1':
                            muxWriteTablesL1(finventacanasta1L1);
                        break;
                        case '2':
                            muxWriteTablesL1(finventacanasta2L1);
                        break;    
                        default:
                    }                    
                number_process2_rxmux(type_of_reception);
                next_position=182;               
                tipeofResetL1='2';                
                dataOK=true;                
                frame_1.memoria_part=2;                 
            break;    
            case 'i':                                                           //CONSIGNACIONES
                //('___consignacionesL1___');
                frame_1.supplier_position=data[3]; 
                var L1supplier_positionD=data.charCodeAt(3);    
                L1_request=data.charCodeAt(3);                  
                for(x=0;x<=9;x++){         
                    frame_1.consignmentvalue[x]=data.charCodeAt(x+6);     
                } 
                //(frame_1.supplier_position+"-"+frame_1.consignmentvalue);
                number_process2_rxmux(type_of_reception);
                muxWriteTablesL1(consignacionesL1);
                Tablenumberconsign=consign_tableL1;                               
                next_position=18;                
                tipeofResetL1='2';                
                dataOK=true;                
                frame_1.memoria_part=2;   
            break;  
            case 'j':                                                           //CONFIGURACIONIMPRESORAS
                //('___configuracionimpresorasL1___');
                frame_1.supplier_position=data[3];  
                frame_1.printer1=data[6];  
                frame_1.printer2=data[8];  
                //(frame_1.supplier_position+"-"+frame_1.printer1+"-"+frame_1.printer2);
                number_process2_rxmux(type_of_reception);   
                muxWriteTablesL1(printerL1);    
                next_position=11;                
                tipeofResetL1='2';                
                dataOK=true;                
                frame_1.memoria_part=2;                   
            break;    
            case 'k':                                                           //TURNOS
                //('___turnosL1___');
                frame_1.supplier_position=data[3];  
                L1_request=data.charCodeAt(3);                    
                frame_1.openclose_turn=data[6]; 
                frame_1.type_of_vendor_ID=data[8];  
                for(x=0;x<=19;x++){          
                    frame_1.serial_seller[x]=data.charCodeAt(x+10);     
                } 
                for(x=0;x<=3;x++){          
                    frame_1.password[x]=data.charCodeAt(x+31);     
                } 
                for(x=0;x<=12;x++){        
                    frame_1.total_volume_P1l1[x]=data.charCodeAt(x+36);     
                } 
                for(x=0;x<=12;x++){          
                    frame_1.total_money_P1l1[x]=data.charCodeAt(x+50);     
                } 
                for(x=0;x<=5;x++){        
                    frame_1.ppu_P1l1[x]=data.charCodeAt(x+64);     
                } 
                for(x=0;x<=12;x++){         
                    frame_1.total_volume_P2l1[x]=data.charCodeAt(x+71);     
                } 
                for(x=0;x<=12;x++){        
                    frame_1.total_money_P2l1[x]=data.charCodeAt(x+85);     
                } 
                for(x=0;x<=5;x++){          
                    frame_1.ppu_P2l1[x]=data.charCodeAt(x+99);     
                } 
                for(x=0;x<=12;x++){        
                    frame_1.total_volume_P3l1[x]=data.charCodeAt(x+106);     
                } 
                for(x=0;x<=12;x++){          
                    frame_1.total_money_P3l1[x]=data.charCodeAt(x+120);     
                } 
                for(x=0;x<=5;x++){         
                    frame_1.ppu_P3l1[x]=data.charCodeAt(x+134);     
                } 
                for(x=0;x<=12;x++){          
                    frame_1.total_volume_P4l1[x]=data.charCodeAt(x+141);     
                } 
                for(x=0;x<=12;x++){         
                    frame_1.total_money_P4l1[x]=data.charCodeAt(x+155);     
                } 
                for(x=0;x<=5;x++){            
                    frame_1.ppu_P4l1[x]=data.charCodeAt(x+169);     
                } 
                for(x=0;x<=12;x++){          
                    frame_1.total_volume_P1l2[x]=data.charCodeAt(x+176);     
                } 
                for(x=0;x<=12;x++){      
                    frame_1.total_money_P1l2[x]=data.charCodeAt(x+190);     
                } 
                for(x=0;x<=5;x++){      
                    frame_1.ppu_P1l2[x]=data.charCodeAt(x+204);     
                } 
                for(x=0;x<=12;x++){          
                    frame_1.total_volume_P2l2[x]=data.charCodeAt(x+211);     
                } 
                for(x=0;x<=12;x++){        
                    frame_1.total_money_P2l2[x]=data.charCodeAt(x+225);     
                } 
                for(x=0;x<=5;x++){           
                    frame_1.ppu_P2l2[x]=data.charCodeAt(x+239);     
                } 
                for(x=0;x<=12;x++){        
                    frame_1.total_volume_P3l2[x]=data.charCodeAt(x+246);     
                } 
                for(x=0;x<=12;x++){         
                    frame_1.total_money_P3l2[x]=data.charCodeAt(x+260);     
                } 
                for(x=0;x<=5;x++){         
                    frame_1.ppu_P3l2[x]=data.charCodeAt(x+274);     
                } 
                for(x=0;x<=12;x++){       
                    frame_1.total_volume_P4l2[x]=data.charCodeAt(x+281);     
                } 
                for(x=0;x<=12;x++){       
                    frame_1.total_money_P4l2[x]=data.charCodeAt(x+295);     
                } 
                for(x=0;x<=5;x++){         
                    frame_1.ppu_P4l2[x]=data.charCodeAt(x+309);     
                } 
                for(x=0;x<=13;x++){          
                    frame_1.date_hour[x]=data.charCodeAt(x+316);     
                } 
                /*(frame_1.supplier_position+"-"+frame_1.openclose_turn+"-"+frame_1.type_of_vendor_ID+"-"+frame_1.serial_seller+"-"+frame_1.password
                            +"-"+frame_1.total_volume_P1l1+"-"+frame_1.total_money_P1l1+"-"+frame_1.ppu_P1l1+"-"+frame_1.total_volume_P2l1+"-"+frame_1.total_money_P2l1
                            +"-"+frame_1.ppu_P2l1+"-"+frame_1.total_volume_P3l1+"-"+frame_1.total_money_P3l1+"-"+frame_1.ppu_P3l1+"-"+frame_1.total_volume_P4l1
                            +"-"+frame_1.total_money_P4l1+"-"+frame_1.ppu_P4l1+"-"+frame_1.total_volume_P1l2+"-"+frame_1.total_money_P1l2+"-"+frame_1.ppu_P1l2
                            +"-"+frame_1.total_volume_P2l2+"-"+frame_1.total_money_P2l2+"-"+frame_1.ppu_P2l2+"-"+frame_1.total_volume_P3l2+"-"+frame_1.total_money_P3l2
                            +"-"+frame_1.ppu_P3l2+"-"+frame_1.total_volume_P4l2+"-"+frame_1.total_money_P4l2+"-"+frame_1.ppu_P4l2+"-"+frame_1.date_hour);*/
                number_process2_rxmux(type_of_reception);
                muxWriteTablesL1(turnosL1);                
                TableNumber=turnopenclose_table;                
                next_position=332;                
                tipeofResetL1='2';                
                dataOK=true;                
                frame_1.memoria_part=2;    
            break;    
            case 'l':                                                           //TOTALES_ELECTRONICOS
                //('___totaleselectronicosL1___');
                frame_1.supplier_position=data[3];  
                for(x=0;x<=12;x++){        
                    frame_1.total_volume_P1l1[x]=data.charCodeAt(x+6);
                    if(frame_1.total_volume_P1l1[x]===44){
                        frame_1.total_volume_P1l1[x]=46;
                    }                      
                } 
                for(x=0;x<=12;x++){          
                    frame_1.total_money_P1l1[x]=data.charCodeAt(x+20);     
                } 
                for(x=0;x<=5;x++){         
                    frame_1.ppu_P1l1[x]=data.charCodeAt(x+34);     
                } 
                for(x=0;x<=12;x++){       
                    frame_1.total_volume_P2l1[x]=data.charCodeAt(x+41);  
                    if(frame_1.total_volume_P2l1[x]===44){
                        frame_1.total_volume_P2l1[x]=46;
                    }                           
                } 
                for(x=0;x<=12;x++){    
                    frame_1.total_money_P2l1[x]=data.charCodeAt(x+55);     
                } 
                for(x=0;x<=5;x++){         
                    frame_1.ppu_P2l1[x]=data.charCodeAt(x+69);     
                } 
                for(x=0;x<=12;x++){        
                    frame_1.total_volume_P3l1[x]=data.charCodeAt(x+76); 
                    if(frame_1.total_volume_P3l1[x]===44){
                        frame_1.total_volume_P3l1[x]=46;
                    }                       
                } 
                for(x=0;x<=12;x++){      
                    frame_1.total_money_P3l1[x]=data.charCodeAt(x+90);     
                } 
                for(x=0;x<=5;x++){        
                    frame_1.ppu_P3l1[x]=data.charCodeAt(x+104);     
                } 
                for(x=0;x<=12;x++){          
                    frame_1.total_volume_P4l1[x]=data.charCodeAt(x+111); 
                    if(frame_1.total_volume_P4l1[x]===44){
                        frame_1.total_volume_P4l1[x]=46;
                    }                     
                } 
                for(x=0;x<=12;x++){  
                    frame_1.total_money_P4l1[x]=data.charCodeAt(x+125);     
                } 
                for(x=0;x<=5;x++){        
                    frame_1.ppu_P4l1[x]=data.charCodeAt(x+139);     
                } 
                for(x=0;x<=12;x++){      
                    frame_1.total_volume_P1l2[x]=data.charCodeAt(x+146); 
                    if(frame_1.total_volume_P1l2[x]===44){
                        frame_1.total_volume_P1l2[x]=46;
                    }                       
                } 
                for(x=0;x<=12;x++){       
                    frame_1.total_money_P1l2[x]=data.charCodeAt(x+160);     
                } 
                for(x=0;x<=5;x++){      
                    frame_1.ppu_P1l2[x]=data.charCodeAt(x+174);     
                } 
                for(x=0;x<=12;x++){          
                    frame_1.total_volume_P2l2[x]=data.charCodeAt(x+181); 
                    if(frame_1.total_volume_P2l2[x]===44){
                        frame_1.total_volume_P2l2[x]=46;
                    }                     
                } 
                for(x=0;x<=12;x++){         
                    frame_1.total_money_P2l2[x]=data.charCodeAt(x+195);     
                } 
                for(x=0;x<=5;x++){        
                    frame_1.ppu_P2l2[x]=data.charCodeAt(x+209);     
                } 
                for(x=0;x<=12;x++){         
                    frame_1.total_volume_P3l2[x]=data.charCodeAt(x+216); 
                    if(frame_1.total_volume_P3l2[x]===44){
                        frame_1.total_volume_P3l2[x]=46;
                    }                        
                } 
                for(x=0;x<=12;x++){   
                    frame_1.total_money_P3l2[x]=data.charCodeAt(x+230);     
                } 
                for(x=0;x<=5;x++){        
                    frame_1.ppu_P3l2[x]=data.charCodeAt(x+244);     
                } 
                for(x=0;x<=12;x++){        
                    frame_1.total_volume_P4l2[x]=data.charCodeAt(x+251);     
                } 
                for(x=0;x<=12;x++){        
                    frame_1.total_money_P4l2[x]=data.charCodeAt(x+265);     
                } 
                for(x=0;x<=5;x++){        
                    frame_1.ppu_P4l2[x]=data.charCodeAt(x+279);     
                } 
                /*(frame_1.supplier_position+"-"+frame_1.total_volume_P1l1+"-"+frame_1.total_money_P1l1+"-"+frame_1.ppu_P1l1+"-"+frame_1.total_volume_P2l1
                            +"-"+frame_1.total_money_P2l1+"-"+frame_1.ppu_P2l1+"-"+frame_1.total_volume_P3l1+"-"+frame_1.total_money_P3l1+"-"+frame_1.ppu_P3l1
                            +"-"+frame_1.total_volume_P4l1+"-"+frame_1.total_money_P4l1+"-"+frame_1.ppu_P4l1+"-"+frame_1.total_volume_P1l2+"-"+frame_1.total_money_P1l2
                            +"-"+frame_1.ppu_P1l2+"-"+frame_1.total_volume_P2l2+"-"+frame_1.total_money_P2l2+"-"+frame_1.ppu_P2l2+"-"+frame_1.total_volume_P3l2
                            +"-"+frame_1.total_money_P3l2+"-"+frame_1.ppu_P3l2+"-"+frame_1.total_volume_P4l2+"-"+frame_1.total_money_P4l2+"-"+frame_1.ppu_P4l2);*/
                number_process2_rxmux(type_of_reception); 
                muxWriteTablesL1(totaleselectronicosL1);                
                next_position=287;   
                tipeofResetL1='1';                   
                dataOK=true;                
                frame_1.memoria_part=2;                  
            break;            
            case 'm':                                                           //SUBE_MANIJA
                //('___subemanijaL1___');
                frame_1.supplier_position=data[3];                 
                var L1supplier_positionD=data.charCodeAt(3);                
                frame_1.preset_type=data[6];  
                for(x=0;x<=7;x++){        
                    frame_1.preset_value[x]=data.charCodeAt(x+8);     
                } 
                frame_1.selected_product=data[17];  
                for(x=0;x<=12;x++){        
                    frame_1.total_previous_volume[x]=data.charCodeAt(x+19); 
                    if(frame_1.total_previous_volume[x]===44){
                        frame_1.total_previous_volume[x]=46;
                    }                      
                } 
                for(x=0;x<=12;x++){       
                    frame_1.total_money_previous[x]=data.charCodeAt(x+33);     
                } 
                for(x=0;x<=5;x++){        
                    frame_1.previous_PPU[x]=data.charCodeAt(x+47);   
                } 
                //(frame_1.supplier_position+"-"+frame_1.preset_type+"-"+frame_1.preset_value+"-"+frame_1.selected_product+"-"+frame_1.total_previous_volume
                //            +"-"+frame_1.total_money_previous+"-"+frame_1.previous_PPU);
                muxWriteTablesL1(subemanijaL1);                

                number_process2_rxmux(type_of_reception);
                next_position=55;                
                tipeofResetL1='2';                
                dataOK=true;                
                frame_1.memoria_part=2;                    
            break;    
        
            case 'c':                                                         
                switch (data[6]) {
                    case '0':                              
                        //('Error envio posicionL1:'+data[3]);
                        switch(frame_1.memoria_part){     
                            case 1:
                                tipeofResetL1='1';                                 
                                dataOK=true;                                  
                            break;
                            case 2:
                                tipeofResetL1='2';                                 
                                dataOK=true;                                  
                            break;
                            default:
                        }
                    break;
                    case '1':                           
                        //('Correcto envio posicionL1:'+data[3]);  
                        frame_1.memoria_part=0;   
                        tipeofResetL1 = Frame_1ready;                         
                        dataOK=true;
                        switch (typeof_request) {
                            case 'P':
                                pg.connect(conString, function(err, client, done){
                                    if(err){
    								    return console.error('1error de conexion 1', err);                                
                                    }else{
                                        client.query(sprintf("UPDATE precios SET disp1=nsx1, disp2=nsx2, disp3=nsx3 WHERE id_pos = 1" ), function(err,result){
                                            done();
                                            if(err){
    								            return console.error('2error de precios', err);                            
                                            }else{
                                            } 
                                        });
                                        client.query(sprintf("UPDATE precios SET disp1='%1$s', disp2='%2$s', disp3='%3$s' WHERE id_pos = 2" ,nsx1l2,nsx2l2,nsx3l2 ), function(err,result){
                                            done();
                                            if(err){
    								            return console.error('3error de precios', err);                            
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
                        switch(TableNumber){
                            case not_readtable:
                                TableNumber=0;                            
                            break;
                            case button_Names_table:
                            break;
                            case turn_table:
                                TableNumber=button_Names_table;   
                            break;
                            case authorizedPpu_table:
                                pg.connect(conString, function(err, client, done){
                                    if(err){
    								    return console.error('4error de conexion 1', err);                                
                                    }else{
                                        client.query(sprintf("UPDATE precios SET disp1=nsx1, disp2=nsx2, disp3=nsx3 WHERE id_pos = 1;" ), function(err,result){
                                            done();
                                            if(err){
    								            return console.error('5error de precios', err);                            
                                            }else{
                                            } 
                                        });
                                        client.query(sprintf("UPDATE precios SET disp1='%1$s', disp2='%2$s', disp3='%3$s' WHERE id_pos = 2;" ,nsx1l2,nsx2l2,nsx3l2 ), function(err,result){
                                            done();
                                            if(err){
    								            return console.error('6error de precios', err);                            
                                            }else{
                                            } 
                                            TableNumber=turn_table;
                                        });
                                    }
                                });                                 
                            break;
                            case initialSettings_table:
                                TableNumber=authorizedPpu_table;                                
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
                frame_2.supplier_position=data[next_position];   
                positionTwo=data[next_position];
                next_position=next_position+3;                
                frame_2.state = data.charCodeAt(next_position); 
                switch (frame_2.state) {
                    case 0x10:
                        statesPhpL2(errorL2);
                        //('>>EstadoL2: Error');   
                        L2ERROR=1;
						sendMux(resetforError);
                    break;
                    case 0x16:
                        statesPhpL2(esperaL2);
                        //('>>EstadoL2: Espera'); 
                        if(requestConfigurationL2==1){
                            TableNumber=1;
                            requestConfigurationL2=0;
                        }                        
                    break;
                    case 0x19:
                        statesPhpL2(surtiendoL2);
                        //('>>EstadoL2: Surtiendo');                
                    break;
                    case 0x1b:
                        statesPhpL2(finventaceroL2);                                 
                        //('>>EstadoL2: Fin Venta en cero');                        
                    break; 
                    case 0x1f:
                        statesPhpL2(LazodesconectadoL2);                                 
                        //('>>EstadoL2: Lazo desconectado');                        
                    break;                     
                    case 0x22:
                        //('>>EstadoL2: Esperando respuesta a peticion venta seleccionada Forma de pago');                
                    break;
                    case 0x23:
                        //('>>EstadoL2: Espera transaccion forma de pago');                
                    break;
                    case 0x27:
                        switch(frame_2.type_sale){
                            case '1':
                                if(datagiveTotable_creditL2==1){
                                    statesPhpL2(idusuariocreditoL2);
                                    //('>>EstadoL2: Esperando respuesta a peticion Identificacion usuario credito');
                                }
                            break;
                            case '2':
                                statesPhpL2(transaccionCrecanL2);
                                //('>>EstadoL2: Espera transaccion credito para canasta');                                        
                            break;    
                            case '3': 
                                statesPhpL2(procesocalibracionL2);
                                //('>>EstadoL2: Proceso de calibracion');                                        
                            break;    
                            default:
                        }
                    break;
                    case 0x28:
                        switch (frame_2.type_sale){
                            case '1':
                                statesPhpL2(idusuariocredito2L2);
                                //('>>EstadoL2: Espera transaccion credito');                                        
                            break;
                            case '2':
                                statesPhpL2(transaccionCrecan2L2);
                                //('>>EstadoL2: Espera transaccion credito para canasta..');                                        
                            break;    
                            case '3':
                                statesPhpL2(procesocalibracion2L2);
                                //('>>EstadoL2: Proceso de calibracion dos....');                                        
                            break;
                            default:
                        }
                    break;
                    case 0x29:
                        //('>>EstadoL2: Esperando respuesta a peticion Calibracion');                
                    break;
                    case 0x32:
                        statesPhpL2(idproductcanastaL2);
                        //('>>EstadoL2: Esperando respuesta a peticion Identificacion producto canasta');                
                    break;
                    case 0x34:
                        if(stateNSXvariableglobal==0 ){
                            if(frame_1.printer2=='1' || frame_2.printer2=='1'){
                                abrir_print2();                                
                            }else{
                                if(frame_1.printer1=='1' || frame_2.printer1=='1'){
                                    abrir_print();                                  
                                }else{
                                    abrir_print2();                                      
                                }                                
                            }                            
                        }                 
                        statesPhpL2(reciboL2);
                        //('>>EstadoL2: Recibo de impresion');
                    break;   
                    case 0x36:
                        statesPhpL2(esperarespuestaconsignacionL2);
                        //('>>EstadoL2: Esperando respuesta a Peticion consignacion');  
                    break;
                    case 0x38:
                        statesPhpL2(posicionbloqueadaL2);
                        //('>>EstadoL2: Posicion bloqueada y pitando...');                         
                    break;                       
                    case 0x39:
                        statesPhpL2(menucanastaL2);
                        //('>>EstadoL2: Entra a menu canasta');                        
                    break;   
                    case 0x3a:
                        statesPhpL2(MuxSolicitaConfL2);
                        requestConfigurationL2=1;                                                
                        //('>>EstadoL2: Mux solicita configuraciones');                         
                    break;    
                    case 0x40:
                        statesPhpL2(pendientedatosTurnL2);
                        //('>>EstadoL2: Pendiente datos turno');                        
                    break;
                    case 0x42:
                        statesPhpL2(turnoaperturacierreL2);
                        //('>>EstadoL2: Espera respuesta a peticion turno Apertura o Cierre');                        
                    break;    
                    default:
                }                                  
                frame_2.memoria_part=1; 
                tipeofResetL2='1';
                
                if(frame_2.state==0x34 || frame_2.state==0x1b || frame_2.state==0x3a){//caso para impresion o caso de finventa cero o configuraciones
                    tipeofResetL1='1';                
                    tipeofResetL2='2';
                    dataOK=true;                     
                }                
            break;   
            case X_SALESORDER:                                                  //X - FINVENTA
                FVenta2='1';
                //('___finventaL2___');
                frame_2.supplier_position=data[next_position];  
                var L2supplier_positionD=data.charCodeAt(next_position);                 
                next_position=next_position+3;
                frame_2.type_sale=data[next_position];  
                next_position=next_position+2;                
                frame_2.preset_type=data[next_position];
                next_position=next_position+2;                
                for(x=0;x<=7;x++){        
                    frame_2.preset_value[x]=data.charCodeAt(x+next_position);    
                }
                next_position=next_position+9;                
                frame_2.selected_product=data[next_position];   
                next_position=next_position+2;                
                for(x=0;x<=13;x++){         
                    frame_2.date_hour[x]=data.charCodeAt(x+next_position);     
                }   
                next_position=next_position+15;                
                for(x=0;x<=12;x++){         
                    frame_2.total_previous_volume[x]=data.charCodeAt(x+next_position); 
                    if(frame_2.total_previous_volume[x]===44){
                        frame_2.total_previous_volume[x]=46;
                    }                       
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){       
                    frame_2.total_money_previous[x]=data.charCodeAt(x+next_position);     
                }
                next_position=next_position+14;                
                for(x=0;x<=5;x++){    
                    frame_2.previous_PPU[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;
                for(x=0;x<=7;x++){     
                    frame_2.volume_sold[x]=data.charCodeAt(x+next_position);
                    if(frame_2.volume_sold[x]===44){
                        frame_2.volume_sold[x]=46;
                    }                      
                }   
                next_position=next_position+9;                
                for(x=0;x<=7;x++){   
                    frame_2.money_selling[x]=data.charCodeAt(x+next_position);     
                }
                next_position=next_position+9;                
                for(x=0;x<=5;x++){     
                    frame_2.PPU_sold[x]=data.charCodeAt(x+next_position);     
                }      
                next_position=next_position+7;                
                frame_2.type_of_product_sold=data[next_position];   
                next_position=next_position+2;                
                for(x=0;x<=9;x++){   
                    frame_2.license_plate[x]=data.charCodeAt(x+next_position);     
                }  
                next_position=next_position+11;                
                for(x=0;x<=9;x++){  
                    frame_2.mileage[x]=data.charCodeAt(x+next_position);     
                }  
                next_position=next_position+11;                
                for(x=0;x<=9;x++){  
                    frame_2.identity_card[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+11;                
                for(x=0;x<=13;x++){     
                    frame_2.date_Time_sale[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+15;                
                frame_2.type_of_vehicle=data[next_position];   
                next_position=next_position+2;                
                frame_2.type_of_customer_identification=data[next_position];
                next_position=next_position+2;                
                for(x=0;x<=19;x++){         
                    frame_2.customer_identification[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+21; 
                frame_2.islero_typeid=data[next_position];    
                next_position=next_position+2;                 
                for(x=0;x<=19;x++){      
                    frame_2.isleroid[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+21;      
                for(x=0;x<=12;x++){     
                    frame_2.totalvolumeback[x]=data.charCodeAt(x+next_position);  
                    if(frame_2.totalvolumeback[x]===44){
                        frame_2.totalvolumeback[x]=46;
                    }                      
                } 
                next_position=next_position+14;                 
                for(x=0;x<=12;x++){     
                    frame_2.totalmoneyback[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;  
                
                next_position=next_position+1;
                for(x=0;x<=4;x++){     
                    frame_2.totalbackPPU[x]=data.charCodeAt(x+next_position);     
                } 
                /*(frame_2.supplier_position+"-"+frame_2.type_sale+"-"+frame_2.preset_type+"-"+frame_2.preset_value+"-"+frame_2.selected_product
                            +"-"+frame_2.date_hour+"-"+frame_2.total_previous_volume+"-"+frame_2.total_money_previous+"-"+frame_2.previous_PPU+"-"+frame_2.volume_sold
                            +"-"+frame_2.money_selling+"-"+frame_2.PPU_sold+"-"+frame_2.type_of_product_sold+"-"+frame_2.license_plate+"-"+frame_2.mileage
                            +"-"+frame_2.identity_card+"-"+frame_2.date_Time_sale+"-"+frame_2.type_of_vehicle+"-"+frame_2.type_of_customer_identification
                            +"-"+frame_2.customer_identification+"-"+frame_2.islero_typeid+"-"+frame_2.isleroid+"-"+frame_2.totalvolumeback+"-"+frame_2.totalmoneyback
                            +"-"+frame_2.totalbackPPU);*/
                muxWriteTablesL2(FinventaL2);
                tipeofResetL2='2';                     
                dataOK=true;                      
                frame_2.memoria_part=2;
                FVenta2='0';
                terminototales='1';
                copiaL2=0;                    
            break;    
            case X_DISCRIMINATESALE:                                            //X - DISCRIMINAR FORMA DE PAGO(#venta)
                //('___discriminarformadepagoL2___');
                frame_2.supplier_position=data[next_position];  
                L2_request=data.charCodeAt(data[next_position]);                    
                next_position=next_position+3;                   
                for(x=0;x<=7;x++){     
                    frame_2.sales_number[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+9;  
                for(x=0;x<=1;x++){      
                    frame_2.type_of_payment[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+3;                  
                frame_2.consultation_sale=data[next_position];  
                //(frame_2.supplier_position+"-"+frame_2.sales_number+"-"+frame_2.type_of_payment+"-"+frame_2.consultation_sale);
                if(ocupaconsultaDATABASEFPL1!=1){
                    ocupaconsultaDATABASEFPL2=1;                                
                    muxWriteTablesL2(discriminarformadepagoventaL2);
                    TableNumber=responseto_requestpayment_tableL2; 
                }
                tipeofResetL2='2';                  
                dataOK=true;   
                frame_2.memoria_part=2; 
            break;
            case X_DISCRIMINATEDVALUE:                                          //X - VALOR_DISCRIMINADO
                //('___valordiscriminadoL2___');
                frame_2.supplier_position=data[next_position];  
                L2_request=data.charCodeAt(data[next_position]);                   
                next_position=next_position+3;              
                for(x=0;x<=7;x++){          
                    frame_2.sales_number[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+9;                  
                for(x=0;x<=1;x++){  
                    frame_2.type_of_payment[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+3;               
                frame_2.consultation_sale=data[next_position];    
                next_position=next_position+2;               
                for(x=0;x<=7;x++){          
                    frame_2.discrim_value[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+9;       
                for(x=0;x<=19;x++){        
                    frame_2.serial_id[x]=data.charCodeAt(x+next_position);     
                } 
                //(frame_2.supplier_position+"-"+frame_2.sales_number+"-"+frame_2.type_of_payment+"-"+frame_2.consultation_sale+"-"+frame_2.discrim_value
                //           +"-"+frame_2.serial_id);
                muxWriteTablesL2(valordiscriminadoL2);
                TableNumber=discriminateSale_tableL2;
                tipeofResetL2='2';                  
                dataOK=true;   
                frame_2.memoria_part=2; 
            break;
            case X_CREDITBASKET:                                                //X - CREDITO_CANASTA
                //('___creditocanastaL2___');
                for(x=0;x<=19;x++){         
                    frame_2.serial_id[x]='0';     
                }
                frame_2.supplier_position=data[next_position];  
                var L2supplier_positionD=data.charCodeAt(next_position); 
                L2_request=data.charCodeAt(data[next_position]);                  
                next_position=next_position+3;                   
                for(x=0;x<=9;x++){        
                    frame_2.mileage[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+11;                   
                frame_2.type_of_customer_identification=data[next_position];  
                next_position=next_position+2;                
                for(x=0;x<=19;x++){         
                    frame_2.serial_id[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+21;                
                frame_2.type_sale =data[next_position]; 
                next_position=next_position+2;                
                frame_2.product_type =data[next_position]; 
                //("Supplier: "+frame_2.supplier_position+" "+"Km: "+frame_2.mileage+" "+"Serial: "+frame_2.serial_id+frame_2.type_of_customer_identification+"-"+frame_2.type_sale+"-"+frame_2.product_type);
                switch (frame_2.type_sale){
                    case '1':
                        muxWriteTablesL2(creditocanasta1L2);
                        Tablenumbercredit=creditbasket_tableL2;                         
                    break;
                    case '2':
                        muxWriteTablesL2(creditocanasta2L2);
                        Tablenumbercredit=Cbasket_tableL2;
                    break;                    
                    case '3':
                        if(frame_2.product_type=='0'){
                           frame_2.product_type='1'; 
                        }                
                        muxWriteTablesL2(creditocanasta3L2);
                        TableNumber=calibration_tableL2;                        
                    break;                    
                    default:
                }
                for(x=0;x<=19;x++){
                    frame_2.serial_id[x]='0';
                }
                tipeofResetL2='2';                  
                dataOK=true;   
                frame_2.memoria_part=2;                 
            break;    
            case X_TOTAL_ELECTRONIC:                                            //X_TOTALES_ELECTRONICOS
                //('___totaleselectronicosL2___');
                frame_2.supplier_position=data[next_position];  
                next_position=next_position+3;                 
                for(x=0;x<=12;x++){         
                    frame_2.total_volume_P1l1[x]=data.charCodeAt(x+next_position);
                    if(frame_2.total_volume_P1l1[x]===44){
                        frame_2.total_volume_P1l1[x]=46;
                    }                       
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){         
                    frame_2.total_money_P1l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          
                    frame_2.ppu_P1l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){        
                    frame_2.total_volume_P2l1[x]=data.charCodeAt(x+next_position); 
                    if(frame_2.total_volume_P2l1[x]===44){
                        frame_2.total_volume_P2l1[x]=46;
                    }                      
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){         
                    frame_2.total_money_P2l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){        
                    frame_2.ppu_P2l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){        
                    frame_2.total_volume_P3l1[x]=data.charCodeAt(x+next_position);
                    if(frame_2.total_volume_P3l1[x]===44){
                        frame_2.total_volume_P3l1[x]=46;
                    }                      
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          
                    frame_2.total_money_P3l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){        
                    frame_2.ppu_P3l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          
                    frame_2.total_volume_P4l1[x]=data.charCodeAt(x+next_position); 
                    if(frame_2.total_volume_P4l1[x]===44){
                        frame_2.total_volume_P4l1[x]=46;
                    }                        
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          
                    frame_2.total_money_P4l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){       
                    frame_2.ppu_P4l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){       
                    frame_2.total_volume_P1l2[x]=data.charCodeAt(x+next_position);
                    if(frame_2.total_volume_P1l2[x]===44){
                        frame_2.total_volume_P1l2[x]=46;
                    }                          
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){
                    frame_2.total_money_P1l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){         
                    frame_2.ppu_P1l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){         
                    frame_2.total_volume_P2l2[x]=data.charCodeAt(x+next_position); 
                    if(frame_2.total_volume_P2l2[x]===44){
                        frame_2.total_volume_P2l2[x]=46;
                    }                      
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){     
                    frame_2.total_money_P2l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){       
                    frame_2.ppu_P2l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){        
                    frame_2.total_volume_P3l2[x]=data.charCodeAt(x+next_position); 
                    if(frame_2.total_volume_P3l2[x]===44){
                        frame_2.total_volume_P3l2[x]=46;
                    }                         
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){        
                    frame_2.total_money_P3l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){        
                    frame_2.ppu_P3l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){       
                    frame_2.total_volume_P4l2[x]=data.charCodeAt(x+next_position);
                    if(frame_2.total_volume_P4l2[x]===44){
                        frame_2.total_volume_P4l2[x]=46;
                    }                      
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){       
                    frame_2.total_money_P4l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){ 
                    frame_2.ppu_P4l2[x]=data.charCodeAt(x+next_position);     
                } 
                /*(frame_2.supplier_position+"-"+frame_2.total_volume_P1l1+"-"+frame_2.total_money_P1l1+"-"+frame_2.ppu_P1l1+"-"+frame_2.total_volume_P2l1
                            +"-"+frame_2.total_money_P2l1+"-"+frame_2.ppu_P2l1+"-"+frame_2.total_volume_P3l1+"-"+frame_2.total_money_P3l1+"-"+frame_2.ppu_P3l1
                            +"-"+frame_2.total_volume_P4l1+"-"+frame_2.total_money_P4l1+"-"+frame_2.ppu_P4l1+"-"+frame_2.total_volume_P1l2+"-"+frame_2.total_money_P1l2
                            +"-"+frame_2.ppu_P1l2+"-"+frame_2.total_volume_P2l2+"-"+frame_2.total_money_P2l2+"-"+frame_2.ppu_P2l2+"-"+frame_2.total_volume_P3l2
                            +"-"+frame_2.total_money_P3l2+"-"+frame_2.ppu_P3l2+"-"+frame_2.total_volume_P4l2+"-"+frame_2.total_money_P4l2+"-"+frame_2.ppu_P4l2);*/
                muxWriteTablesL2(totaleselectronicosL2);                
                tipeofResetL2='2';                  
                dataOK=true;   
                frame_2.memoria_part=2;                 
            break;    
            case X_PROD_IDENTI_BASKET:                                          //X_IDENTIFICACIONPRODUCTO_CANASTA
                //('___identificacioncanastaL2___');
                frame_2.supplier_position=data[next_position];  
                L2_request=data.charCodeAt(data[next_position]);                     
                next_position=next_position+3;                
                for(x=0;x<=19;x++){         
                    frame_2.serial_product[x]=data.charCodeAt(x+next_position);     
                } 
                //(frame_2.supplier_position+"-"+frame_2.serial_product);
                muxWriteTablesL2(identificacionproductocanastaL2);
                TableNumber=basket_tableL2;                
                tipeofResetL2='2';                  
                dataOK=true;   
                frame_2.memoria_part=2;  
            break;    
            case X_SALESORDERBASKE:                                             //X_FINVENTA_CANASTA
                if (ocupadoDATABASEL1canastacontado!=1){
                    //('___finventacanastaL2___');
                    frame_2.supplier_position=data[next_position];
                    next_position=next_position+3;                  
                    frame_2.type_sale=data[next_position];  
                    next_position=next_position+2;                
                    for(x=0;x<=19;x++){       
                        frame_2.serialP1[x]=data.charCodeAt(x+next_position);     
                    } 
                    next_position=next_position+21;                
                    for(x=0;x<=2;x++){         
                        frame_2.quantityP1[x]=data.charCodeAt(x+next_position);     
                    } 
                    next_position=next_position+4;                
                    for(x=0;x<=7;x++){          
                        frame_2.total_valueP1[x]=data.charCodeAt(x+next_position);     
                    } 
                    next_position=next_position+9;                
                    for(x=0;x<=19;x++){          
                        frame_2.serialP2[x]=data.charCodeAt(x+next_position);     
                    } 
                    next_position=next_position+21;                
                    for(x=0;x<=2;x++){    
                        frame_2.quantityP2[x]=data.charCodeAt(x+next_position);     
                    } 
                    next_position=next_position+4;                
                    for(x=0;x<=7;x++){        
                        frame_2.total_valueP2[x]=data.charCodeAt(x+next_position);     
                    } 
                    next_position=next_position+9;                
                    for(x=0;x<=19;x++){         
                        frame_2.serialP3[x]=data.charCodeAt(x+next_position);     
                    } 
                    next_position=next_position+21;                
                    for(x=0;x<=2;x++){          
                        frame_2.quantityP3 [x]=data.charCodeAt(x+next_position);     
                    } 
                    next_position=next_position+4;                
                    for(x=0;x<=7;x++){         
                        frame_2.total_valueP3[x]=data.charCodeAt(x+next_position);     
                    } 
                    next_position=next_position+9;                
                    for(x=0;x<=8;x++){          
                        frame_2.sellout_basket[x]=data.charCodeAt(x+next_position);     
                    } 
                    next_position=next_position+10;                
                    for(x=0;x<=13;x++){         
                        frame_2.date_hour[x]=data.charCodeAt(x+next_position);     
                    } 
                    next_position=next_position+15;                
                    frame_2.type_of_customer_identification=data[next_position];  
                    next_position=next_position+2;                
                    for(x=0;x<=19;x++){         
                        frame_2.customer_identification[x]=data.charCodeAt(x+next_position);     
                    } 
                    next_position=next_position+21;                 
                    frame_2.islero_typeid=data[next_position];  
                    next_position=next_position+2;                 
                    for(x=0;x<=19;x++){       
                        frame_2.isleroid[x]=data.charCodeAt(x+next_position);     
                    } 
                    /*(frame_2.supplier_position+"-"+frame_2.type_sale+"-"+frame_2.serialP1+"-"+frame_2.quantityP1+"-"+frame_2.total_valueP1
                                +"-"+frame_2.serialP2+"-"+frame_2.quantityP2+"-"+frame_2.total_valueP2+"-"+frame_2.serialP3+"-"+frame_2.quantityP3+"-"+frame_2.total_valueP3
                                +"-"+frame_2.sellout_basket+"-"+frame_2.date_hour+"-"+frame_2.type_of_customer_identification+"-"+frame_2.customer_identification
                                +"-"+frame_2.islero_typeid+"-"+frame_2.isleroid);*/
                    switch (frame_2.type_sale){
                        case '1':
                            muxWriteTablesL2(finventacanasta1L2);
                        break;
                        case '2':
                            muxWriteTablesL2(finventacanasta2L2);
                        break;    
                        default:
                    }                    
                }
                tipeofResetL2='2';                  
                dataOK=true;   
                frame_2.memoria_part=2;                  
            break;    
            case X_APPROPRIATIONS:                                              //X_CONSIGNACIONES
                //('___consignacionesL2___');
                frame_2.supplier_position=data[next_position];  
                var L2supplier_positionD=data.charCodeAt(next_position);   
                L2_request=data.charCodeAt(data[next_position]);                  
                next_position=next_position+3;                 
                for(x=0;x<=9;x++){          
                    frame_2.consignmentvalue[x]=data.charCodeAt(x+next_position);     
                } 
                //(frame_2.supplier_position+"-"+frame_2.consignmentvalue);
                muxWriteTablesL2(consignacionesL2);
                Tablenumberconsign=consign_tableL2;                
                tipeofResetL2='2';                  
                dataOK=true;   
                frame_2.memoria_part=2;   
            break;    
            case X_PRINTERSETUP:                                                //CONFIGURACIONIMPRESORAS
                //('___configuracionimpresorasL2___');
                frame_2.supplier_position=data[next_position];  
                next_position=next_position+3;                  
                frame_2.printer1=data[next_position];  
                next_position=next_position+2;                
                frame_2.printer2=data[next_position]; 
                //(frame_2.supplier_position+"-"+frame_2.printer1+"-"+frame_2.printer2);
                muxWriteTablesL2(printerL2); 
                tipeofResetL2='2';                  
                dataOK=true;   
                frame_2.memoria_part=2;  
            break; 
            case X_TURN:                                                        //X_TURNO
                //('___turnoL2___');
                frame_2.supplier_position=data[next_position]; 
                L2_request=data.charCodeAt(data[next_position]);                 
                next_position=next_position+3;                  
                frame_2.openclose_turn=data[next_position];  
                next_position=next_position+2;                
                frame_2.type_of_vendor_ID=data[next_position];  
                next_position=next_position+2;                
                for(x=0;x<=19;x++){         
                    frame_2.serial_seller[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+21;               
                for(x=0;x<=3;x++){        
                    frame_2.password[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+5;               
                for(x=0;x<=12;x++){         
                    frame_2.total_volume_P1l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          
                    frame_2.total_money_P1l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          
                    frame_2.ppu_P1l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){        
                    frame_2.total_volume_P2l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;
                for(x=0;x<=12;x++){       
                    frame_2.total_money_P2l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          
                    frame_2.ppu_P2l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          
                    frame_2.total_volume_P3l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          
                    frame_2.total_money_P3l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){            
                    frame_2.ppu_P3l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          
                    frame_2.total_volume_P4l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){        
                    frame_2.total_money_P4l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          
                    frame_2.ppu_P4l1[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){           
                    frame_2.total_volume_P1l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){         
                    frame_2.total_money_P1l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){         
                    frame_2.ppu_P1l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){         
                    frame_2.total_volume_P2l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){          
                    frame_2.total_money_P2l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){           
                    frame_2.ppu_P2l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){         
                    frame_2.total_volume_P3l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){         
                    frame_2.total_money_P3l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){          
                    frame_2.ppu_P3l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=12;x++){          
                    frame_2.total_volume_P4l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){      
                    frame_2.total_money_P4l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;                
                for(x=0;x<=5;x++){        
                    frame_2.ppu_P4l2[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+7;                
                for(x=0;x<=13;x++){          
                    frame_2.date_hour[x]=data.charCodeAt(x+next_position);     
                } 
                /*(frame_2.supplier_position+"-"+frame_2.openclose_turn+"-"+frame_2.type_of_vendor_ID+"-"+frame_2.serial_seller+"-"+frame_2.password
                            +"-"+frame_2.total_volume_P1l1+"-"+frame_2.total_money_P1l1+"-"+frame_2.ppu_P1l1+"-"+frame_2.total_volume_P2l1+"-"+frame_2.total_money_P2l1
                            +"-"+frame_2.ppu_P2l1+"-"+frame_2.total_volume_P3l1+"-"+frame_2.total_money_P3l1+"-"+frame_2.ppu_P3l1+"-"+frame_2.total_volume_P4l1
                            +"-"+frame_2.total_money_P4l1+"-"+frame_2.ppu_P4l1+"-"+frame_2.total_volume_P1l2+"-"+frame_2.total_money_P1l2+"-"+frame_2.ppu_P1l2
                            +"-"+frame_2.total_volume_P2l2+"-"+frame_2.total_money_P2l2+"-"+frame_2.ppu_P2l2+"-"+frame_2.total_volume_P3l2+"-"+frame_2.total_money_P3l2
                            +"-"+frame_2.ppu_P3l2+"-"+frame_2.total_volume_P4l2+"-"+frame_2.total_money_P4l2+"-"+frame_2.ppu_P4l2+"-"+frame_2.date_hour); */
                muxWriteTablesL2(turnosL2);                 
                TableNumber=turnopenclose_table;  //                    
                tipeofResetL2='2'; 
                dataOK=true;   
                frame_2.memoria_part=2; 
            break;  
            case X_HANDLEUP:                                                    //X_SUBAMANIJA
                //('___subamanijaL2___');
                frame_2.supplier_position=data[next_position];  
                var L2supplier_positionD=data.charCodeAt(next_position);                 
                next_position=next_position+3;                   
                frame_2.preset_type=data[next_position]; 
                next_position=next_position+2;                
                for(x=0;x<=7;x++){         
                    frame_2.preset_value[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+9;                
                frame_2.selected_product=data[next_position];  
                next_position=next_position+2;                
                for(x=0;x<=12;x++){       
                    frame_2.total_previous_volume[x]=data.charCodeAt(x+next_position);
                    if(frame_2.total_previous_volume[x]===44){
                        frame_2.total_previous_volume[x]=46;
                    }                    
                } 
                next_position=next_position+14;                
                for(x=0;x<=12;x++){        
                    frame_2.total_money_previous[x]=data.charCodeAt(x+next_position);     
                } 
                next_position=next_position+14;   
                for(x=0;x<=5;x++){    
                    frame_2.previous_PPU[x]=data.charCodeAt(x+next_position);     
                } 
                //(frame_2.supplier_position+"-"+frame_2.preset_type+"-"+frame_2.preset_value+"-"+frame_2.selected_product+"-"+frame_2.total_previous_volume
                //            +"-"+frame_2.total_money_previous+"-"+frame_2.previous_PPU);
                muxWriteTablesL2(subemanijaL2);                
                tipeofResetL2='2';                  
                dataOK=true;   
                frame_2.memoria_part=2; 
            break;    
        
            case RESET_RESET:
                switch (data[12]) {
                    case '0':                                                 
                        //('Error envio posicionL2:'+data[9]);
                        switch(frame_2.memoria_part){                           
                            case 1:
                                tipeofResetL2='1';                                  
                                dataOK=true;                                  
                            break;
                            case 2:
                                tipeofResetL2='2';                                 
                                dataOK=true;                                  
                            break;
                            default:
                        }
                    break;
                    case '1':                                                   
                        //('Correcto envio posicionL2:'+data[9]);  
                        frame_2.memoria_part=0;
                        tipeofResetL2= Frame_2ready;                        
                        dataOK=true;
                        switch(TableNumber){
                            case not_readtable:
                                TableNumber=0;                             
                            break;
                            default:
                        }                        
                    break;                    
                    default:
                }                    
            break;   
            default:
        }     
		if(ocupadoDATABASEL1canastacontado==1){
			ocupadoDATABASEL1canastacontado=0;
		}        
        if(dataOK==true){                                                     
            if(tipeofResetL1=='1' && tipeofResetL2=='1'){
                muxport.write('MUX'+frame_1.supplier_position+'N;&'+frame_2.supplier_position+'N;&*');
                //("<<MUX"+frame_1.supplier_position+"N;&"+frame_2.supplier_position+"N;&*");   
            }
            if(tipeofResetL1=='1' && tipeofResetL2=='2'){
                muxport.write('MUX'+frame_1.supplier_position+'N;&'+frame_2.supplier_position+'Y;&*');
                //("<<MUX"+frame_1.supplier_position+"N;&"+frame_2.supplier_position+"Y;&*"); 
            }
            if(tipeofResetL1=='2'&&tipeofResetL2=='1'){
                    muxport.write('MUX'+frame_1.supplier_position+'Y;&'+frame_2.supplier_position+'N;&*');
                    //("<<MUX"+frame_1.supplier_position+"Y;&"+frame_2.supplier_position+"N;&*");                   
            }     
            if(tipeofResetL1=='2'&&tipeofResetL2=='2'){
                    muxport.write('MUX'+frame_1.supplier_position+'Y;&'+frame_2.supplier_position+'Y;&*');
                    //("<<MUX"+frame_1.supplier_position+"Y;&"+frame_2.supplier_position+"Y;&*");  
            }   
            
            switch(tipeofResetL1){                                        
                case 'a':
                    muxport.write('MUX'+frame_1.supplier_position+'N;&');                    
                    //("<<MUX"+frame_1.supplier_position+"N;&"); 
                break;
                case Frame_1ready:
                    frame_1.reset_good=true;//                    
                    if(tipeofResetL1==Frame_1ready && tipeofResetL2!=Frame_2ready){              
                        muxport.write('MUX'+frame_1.supplier_position+'N;&');
                        //("<<MUX"+frame_1.supplier_position+"N;&");                        
                    }
                break;    
                default:
                //code
            }
            switch (tipeofResetL2) {                                      
                case '3':
                    muxport.write(frame_2.supplier_position+'Y;&*');
                    //(frame_2.supplier_position+"Y;&*");  
                    TableNumber=turnopenclose_table; 
                break;                    
                case Frame_2ready:
                    frame_2.reset_good=true;
                    if(tipeofResetL1!=Frame_1ready && tipeofResetL2==Frame_2ready){                  
                        muxport.write(frame_2.supplier_position+'N;&*');
                        //(frame_2.supplier_position+"N;&*");                     
                    }
                break;    
                default:
                    // code
            }

            if(frame_1.reset_good==true && frame_2.reset_good==true){           
                dataOK=false;
                frame_1.reset_good=false;
                frame_2.reset_good=false;
                tipeofResetL1='0';
                tipeofResetL2='0';
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
    
    if(accountant==9  && accountant_2==6){     
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
                case 227:
                    type_of_reception=STATE_SALESORDER;                    
                break;
                case 18: 
                    type_of_reception=STATE_DISCRIMINATESALE;                    
                break;
                case 48:
                    type_of_reception=STATE_DISCRIMINATEVALUE;                    
                break;  
                case 42:
                    type_of_reception=STATE_CREDITBASKET;                    
                break;   
                case 25:
                    type_of_reception=STATE__PROD_IDENTI_BASKET;                     
                break;   
                case 179:
                    type_of_reception= STATE_SALESORDERBASKE;                 
                break;
                case 15:
                    type_of_reception= STATE_APPROPRIATIONS;
                break;  
                case 8:
                    type_of_reception= STATE_PRINTERSETUP;
                break;   
                case 329:
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
                case 6:
                    type_of_reception=SALESORDER_STATE; 
                break;
                case 227:
                    type_of_reception=SALESODER_SALESORDER;                    
                break; 
                case 18:
                    type_of_reception=SALESORDER_DISCRIMINATESALE;                    
                break;  
                case 48:
                    type_of_reception=SALESORDER_DISCRIMINATEVALUE;                    
                break; 
                case 40:
                    type_of_reception=SALESORDER_CREDITBASKET;                
                default:
                case 25:
                    type_of_reception=SALESORDER__PROD_IDENTI_BASKET;                    
                break;
                case 179:
                    type_of_reception= SALESORDER_SALESORDERBASKE;                 
                break; 
                case 15:
                    type_of_reception= SALESORDER_APPROPRIATIONS;
                break;
                case 8: 
                    type_of_reception= SALESORDER_PRINTERSETUP;
                break;   
                case 52:
                    type_of_reception=SALESORDER_HANDLEUP;
                break;                  
            }
        break;  
        case 21:
            switch (accountant_2) {
                case 6:
                    type_of_reception=DISCRIMINATESALE_STATE;                    
                break;
                case 227:
                    type_of_reception=DISCRIMINATESALE_SALESORDER;                
                break;
                case 18:
                    type_of_reception=DISCRIMINATESALE_DISCRIMINATESALE;                    
                break;  
                case 48:
                    type_of_reception=DISCRIMINATESALE_DISCRIMINATEVALUE;                    
                break;
                case 40:
                    type_of_reception=DISCRIMINATESALE_CREDITBASKET;                    
                break;   
                case 25:
                    type_of_reception=DISCRIMINATESALE__PROD_IDENTI_BASKET;                    
                break;
                case 179:
                    type_of_reception= DISCRIMINATESALE_SALESORDERBASKE;                 
                break; 
                case 15:
                    type_of_reception= DISCRIMINATESALE_APPROPRIATIONS;
                break;    
                case 8: 
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
                case 6:
                    type_of_reception=DISCRIMINATEDVALUE_STATE;
                break;
                case 227:
                    type_of_reception=DISCRIMINATEDVALUE_SALESORDER;                    
                break;    
                case 18:
                    type_of_reception=DISCRIMINATEDVALUE_DISCRIMINATESALE;                    
                break;    
                case 48:
                    type_of_reception=DISCRIMINATEDVALUE_DISCRIMINATEDVALUE;                    
                break;
                case 40:
                    type_of_reception=DISCRIMINATEDVALUE_CREDITBASKET;                    
                break;  
                case 25:
                    type_of_reception=DISCRIMINATEDVALUE__PROD_IDENTI_BASKET;                     
                break;    
                case 179:
                    type_of_reception= DISCRIMINATEDVALUE_SALESORDERBASKE;                 
                break; 
                case 15:
                    type_of_reception= DISCRIMINATEDVALUE_APPROPRIATIONS;
                break;    
                case 8:
                    type_of_reception= DISCRIMINATEDVALUE_PRINTERSETUP;
                break;    
                case 52:
                    type_of_reception=DISCRIMINATEDVALUE_HANDLEUP;
                break;                  
                default:
            }
        break;   
        case 45:            
            switch (accountant_2) {
                case 6:
                    type_of_reception=CREDITBASKET_STATE;
                break;
                case 227:
                    type_of_reception=CREDITBASKET_SALESORDER;                    
                break;
                case 18:
                    type_of_reception=CREDITBASKET_DISCRIMINATESALE;                    
                break;
                case 48:
                    type_of_reception=CREDITBASKET_DISCRIMINATEDVALUE;                    
                break;
                case 40:
                    type_of_reception=CREDITBASKET_CREDITBASKET;                    
                break; 
                case 25:
                    type_of_reception=CREDITBASKET__PROD_IDENTI_BASKET; 
                break;    
                case 179:
                    type_of_reception= CREDITBASKET_SALESORDERBASKE;                 
                break;     
                case 15:
                    type_of_reception= CREDITBASKET_APPROPRIATIONS;
                break;      
                case 8: 
                    type_of_reception= CREDITBASKET_PRINTERSETUP;
                break;   
                case 52:
                    type_of_reception=CREDITBASKET_HANDLEUP;
                break;                  
                default:                
            }
        break;    
        case 287:            
            switch (accountant_2) {
                case 284:
                    type_of_reception=TOTAL_ELECTRONIC_TOTAL_ELECTRONIC;
                break;
                default:
            }
        break;
        case 28:
            switch (accountant_2) {
                case 6: 
                    type_of_reception=PROD_IDENTI_BASKET__STATE;
                break;  
                case 227:
                    type_of_reception=PROD_IDENTI_BASKET__SALESORDER;  
                break;
                case 18:
                    type_of_reception=PROD_IDENTI_BASKET__DISCRIMINATESALE;                    
                break;
                case 48:
                    type_of_reception=PROD_IDENTI_BASKET__DISCRIMINATEDVALUE;                    
                break;   
                case 40:
                    type_of_reception=PROD_IDENTI_BASKET__CREDITBASKET;                    
                break;
                case 25:
                    type_of_reception=PROD_IDENTI_BASKET__PROD_IDENTI_BASKET;                    
                break;     
                case 179:
                    type_of_reception= PROD_IDENTI_BASKET__SALESORDERBASKE;                 
                break;   
                case 15:
                    type_of_reception= PROD_IDENTI_BASKET__APPROPRIATIONS;
                break;  
                case 8:
                    type_of_reception= PROD_IDENTI_BASKET__PRINTERSETUP;
                break;  
                case 52:
                    type_of_reception=PROD_IDENTI_BASKET__HANDLEUP;
                break;                  
                default:
            }
        break;   
        case 182:
            switch (accountant_2) {
                case 6:
                    type_of_reception=SALESORDERBASKET_STATE;
                break;
                case 227:
                    type_of_reception=SALESORDERBASKET_SALESORDER;  
                break;                
                case 18:
                    type_of_reception=SALESORDERBASKET_DISCRIMINATESALE;                    
                break;  
                case 48:
                    type_of_reception=SALESORDERBASKET_DISCRIMINATEDVALUE;                    
                break;  
                case 40:
                    type_of_reception=SALESORDERBASKET_CREDITBASKET;                    
                break;    
                case 25:
                    type_of_reception=SALESORDERBASKET__PROD_IDENTI_BASKET;                    
                break;
                case 179:
                    type_of_reception= SALESORDERBASKET_SALESORDERBASKE;                 
                break;    
                case 15:
                    type_of_reception= SALESORDERBASKET__APPROPRIATIONS;
                break;    
                case 8: 
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
                case 6:
                    type_of_reception=APPROPRIATIONS_STATE;
                break;
                case 227:
                    type_of_reception=APPROPRIATIONS_SALESORDER;  
                break;                
                case 18:
                    type_of_reception=APPROPRIATIONS_DISCRIMINATESALE;                    
                break;  
                case 48:
                    type_of_reception=APPROPRIATIONS_DISCRIMINATEDVALUE;                    
                break;  
                case 40:
                    type_of_reception=APPROPRIATIONS_CREDITBASKET;                    
                break;    
                case 25:
                    type_of_reception=APPROPRIATIONS__PROD_IDENTI_BASKET;                    
                break;
                case 179:
                    type_of_reception= APPROPRIATIONS_SALESORDERBASKE;                 
                break;   
                case 15:
                    type_of_reception= APPROPRIATIONS_APPROPRIATIONS;
                break;    
                case 8: 
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
                case 6:
                    type_of_reception=PRINTERSETUP_STATE;                
                break;
                case 227:
                    type_of_reception=PRINTERSETUP_SALESORDER;
                break;                
                case 18:
                    type_of_reception=PRINTERSETUP_DISCRIMINATESALE;                    
                break;  
                case 48:
                    type_of_reception=PRINTERSETUP_DISCRIMINATEDVALUE;                    
                break;  
                case 40:
                    type_of_reception=PRINTERSETUP_CREDITBASKET;                    
                break;    
                case 25:
                    type_of_reception=PRINTERSETUP__PROD_IDENTI_BASKET;                    
                break;
                case 179:
                    type_of_reception= PRINTERSETUP_SALESORDERBASKE;                 
                break;   
                case 15:
                    type_of_reception= PRINTERSETUP_APPROPRIATIONS;
                break;                    
                case 8: 
                    type_of_reception= PRINTERSETUP_PRINTERSETUP;
                break;  
                case 52:
                    type_of_reception=PRINTERSETUP_HANDLEUP;
                break;                  
                default:
            }
        case 332:
            switch (accountant_2) {
                case 6:
                    type_of_reception=TURN_STATE;                
                break;
                default:
            }
        break;    
        case 55:
            switch (accountant_2) {
                case 6:
                    type_of_reception=HANDLEUP_STATE;  
                break;
                case 227:
                    type_of_reception=HANDLEUP_SALESORDER;
                break;                
                case 18:
                    type_of_reception=HANDLEUP_DISCRIMINATESALE;                    
                break;  
                case 48:
                    type_of_reception=HANDLEUP_DISCRIMINATEDVALUE;                    
                break;  
                case 40:
                    type_of_reception=HANDLEUP_CREDITBASKET;                    
                break;    
                case 25:
                    type_of_reception=HANDLEUP__PROD_IDENTI_BASKET;                    
                break;
                case 179:
                    type_of_reception=HANDLEUP_SALESORDERBASKE;                 
                break;   
                case 15:
                    type_of_reception=HANDLEUP_APPROPRIATIONS;
                break;                    
                case 8:
                    type_of_reception=HANDLEUP_PRINTERSETUP;
                break;
                case 52:
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

var turno_variableglobal,stateNSX,stateNSXvariableglobal,bloquearsurtidor;
var requests_bge2,typeof_request,confirmation;
var bloqueo,muxbloqueoAB,muxdesbloqueoAB,sendStateSoftwareHardware=0;

function watchful(error){    
    if(EndconfigurationInitial==1){    
    
        if (error){
            //(error);
        }else{
            pg.connect(conString, function(err, client, done){
                if(err){
                    return console.error('1Error de watchful', err);
                }else{
                    client.query("SELECT nsxonline,bloqueocorte FROM estado ;", function(err,result){
                        done();
                        if(err){
                            return console.error('2error de estado', err);
                        }else{
                            stateNSX=result.rows[0].nsxonline;
                            bloquearsurtidor=result.rows[0].bloqueocorte;                            
                            if(stateNSX == 1){
                                stateNSXvariableglobal=stateNSX;
                                //("     Estado NSX = CONECTADO");
                                sendMux(sotware_hardware_comunication);
                            }else{
                                stateNSXvariableglobal=stateNSX;                                 
                                //("     Estado NSX = DESCONECTADO");
                                sendMux(sotware_hardware_comunication);
                            }
                            if(bloquearsurtidor==1 && stateNSXvariableglobal==0){
                                //("     Desbloqueo surtidor" );  
                                sendMux(unlock_mux);  
                                bloquearsurtidor=2;
                                bloqueo='2';                                 
                            }    
                            switch (bloquearsurtidor) {
                                case 1:
                                    //("     Bloqueo surtidorGENESYS" );  
                                    bloqueo='1';
                                break;
                                case 0:
                                    //("     Desbloqueo surtidorGENESYS" );   
                                    bloqueo='0';                                
                                    sendMux(unlock_mux);   
                                break;
                                case 2:
                                    //("     Estado normal del surtidorGENESYS" );   
                                break;                                
                                default:
                                    // code
                            }
                        }      
                    }); 
                    switch (bloqueo) {
                        case '1':
                            if(frame_1.state==0x16 && frame_2.state==0x16){
                                //("Bloqueo LadoA --  Bloqueo LadoB" );                  
                            	bloqueo=0;
                            	muxbloqueoAB=12;
                            	sendMux(blocking_mux);
                            }
                            if(frame_1.state==0x16 && frame_2.state!=0x16){
                                //("Bloqueo LadoA --  ocupado LadoB" );                  
                            	muxbloqueoAB=1;
                            	sendMux(blocking_mux);       	
                            }
                            if(frame_1.state!=0x16 && frame_2.state==0x16){
                                //("ocupado LadoA --  Bloqueo LadoB" );                   
                            	muxbloqueoAB=2;
                            	sendMux(blocking_mux);      	
                            }  
                            if(frame_1.state==0x38 && frame_2.state==0x16){
                                //("Bloqueado LadoA --  Bloqueo LadoB" );                  
                            	bloqueo=0;                
                            	muxbloqueoAB=2;
                            	sendMux(blocking_mux);       	
                            }  
                            if(frame_1.state==0x16 && frame_2.state==0x38){
                                //("Bloqueo LadoA --  Bloqueoado LadoB" );                   
                            	bloqueo=0;                
                            	muxbloqueoAB=1;
                            	sendMux(blocking_mux);       	
                            }     
                        break;
                        case '0':
                            if(frame_1.state==0x38 && frame_2.state==0x38){
                                //("Desbloqueo LadoA --  Desbloqueo LadoB" );                  
                            	bloqueo=0;
                            	muxdesbloqueoAB=12;
                            	sendMux(blocking_mux);
                            }
                            if(frame_1.state==0x38 && frame_2.state!=0x38){
                                //("Desbloqueo LadoA --  ocupado LadoB" );                  
                            	muxdesbloqueoAB=1;
                            	sendMux(blocking_mux);       	
                            }
                            if(frame_1.state!=0x38 && frame_2.state==0x38){
                                //("ocupado LadoA --  Desbloqueo LadoB" );                   
                            	muxdesbloqueoAB=2;
                            	sendMux(blocking_mux);      	
                            }   
                        break;                        
                        default:
                            // code
                    }
                    if((frame_1.state==0x16 && frame_2.state==0x16) || (frame_1.state==0x38 && frame_2.state==0x38) ){
                        if(FVenta1=='0'&&FVenta2=='0'){
                            //("solito totales desde el codigo local");
                            FVenta1='1';
                            FVenta2='1'; 
                            sendMux(totalRequest_mux);
                        }
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
                        client.query("SELECT turnonsx FROM turno ;", function(err,result){
                            done();
                            if(err){
                                return console.error('3error de turno', err);
                            }else{
                                turn=result.rows[0].turnonsx;
                                turnMux=0;                                
                                if(turn == true){
                                //("     Estado del Turno NSX P = Abierto" );
                                    turnMux='1';
                                }else{
                                    //("     Estado del Turno NSX  p = Cerrado" );
                                    turnMux='0';
                                }
                                if(turno_variableglobal!=turnMux){
                                    //("     piden cambio de estado turno");
                                    turno_variableglobal=turnMux;                                
                                    sendMux(totalRequest_mux);
                                }else{
                                    //("     no hay cambio de estado turno");
                                    turno_variableglobal=turnMux;                                
                                    }
                            }      
                        });                
                        client.query("SELECT solicitabge2,tiposolicitud,confirmacion FROM solicitudes;", function(err,result){
                            done();
                            if(err){
                                return console.error('4error de solicitudes', err);
                            }else{
                                requests_bge2=result.rows[0].solicitabge2;
                                if(requests_bge2==undefined || requests_bge2==null) {
                                    //("favor llenar con un valor el item solicitabge2 de la tabla solicitudes");
                                }   
                                else {
                                    //("     *Solicitud de PHP= " +  requests_bge2);
                                }                             
                                typeof_request=result.rows[0].tiposolicitud;
                                //("     *Tipo de informacion solicitada= " +  typeof_request);   
                                confirmation=result.rows[0].confirmacion;
                                //("     *Datos recibidos confirmacion php= " +  confirmation);
                                if(requests_bge2=='1' && confirmation=='0'){
                                    switch (typeof_request) {
                                        case 'T':
                                            //("*******Turno leido del NSX controllerxxxxxx*******");                        
                                            client.query("SELECT turnonsx FROM turno ;", function(err,result){
                                                done();
                                                if(err){
                                                    return console.error('5error de turno', err);
                                                }else{
                                                    turn=result.rows[0].turnonsx;
                                                    turnMux=0;                                
                                                    if(turn == true){
                                                        //("     Estado del Turno NSX = Abierto" );
                                                        turnMux='1';
                                                    }else{
                                                        //("     Estado del Turno NSX = Cerrado" );
                                                        turnMux='0';
                                                    }
                                                    sendMux(totalRequest_mux);                                
                                                }      
                                            });
                                        break;
                                        case 'P':
                                            //("*******Ppu autorizados*******");                        
                                            client.query("SELECT nsx1,nsx2,nsx3 FROM precios WHERE id_pos=1;", function(err,result){
                                                done();
                                                if(err){
                                                    return console.error('6error de precios', err);
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
                                                    return console.error('7error de precios', err);
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
                                            client.query(sprintf("UPDATE solicitudes SET solicitabge2='%1$s',confirmacion='%2$s' ",0,1),function(err,result){
                                                done();
                                                if(err){
                                                    return console.error('8Error de solicitudes', err);
                                                }else{
                                                }
                                            });                             
                                        break;    
                                        default:
                                    } 
                                }                        
                            }      
                        });
                    }                        
                }   
            });
        }  
    }    
}




/*
*********************************************************************************************************
*                                function muxWriteTablesL1()
*
* Description : Escribe los estado insertados al lado uno para el code php
*               
*********************************************************************************************************
*/


var esperaL1=1,surtiendoL1=2,idusuariocreditoL1=3,transaccionCrecanL1=4,procesocalibracionL1=5,idusuariocredito2L1=6,transaccionCrecan2L1=7,
    procesocalibracion2L1=8,idproductcanastaL1=9,reciboL1=10,esperarespuestaconsignacionL1=11,menucanastaL1=12,pendientedatosTurnL1=13,
    turnoaperturacierreL1=14,finventaceroL1=15,MuxSolicitaConfL1=16,LazodesconectadoL1=17,posicionbloqueadaL1=18,errorL1=19;

var statesPhpL1 =function(estadoL1){
    
    pg.connect(conString, function(err, client, done){
        if(err){
            return console.error('1Error de statesphpL1', err);
        }else{
            switch(estadoL1){
	            case errorL1:
	               client.query("UPDATE estado SET pos1=33", function(err,result){
	               done();
	                   if(err){
	                       return console.error('estado 33 para php error de estado', err);                            
	                   }else{
	                   }
	               });                    
	            break;                    
                case esperaL1:                              
                    client.query(sprintf("UPDATE venta_canasta SET lecturacanasta='%1$s' WHERE idposicionc=1" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                        done();
                        if(err){
                            return console.error('2error de venta_canasta', err);                            
                        }else{
                        } 
                    });
                    client.query(sprintf("UPDATE preset SET lecturacupocredito='%1$s' WHERE id_pos=1" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                        done();
                        if(err){
                            return console.error('3error de preset', err);                            
                        }else{
                        } 
                    });                                
                    client.query("UPDATE estado SET pos1=22", function(err,result){
                        done();
                        if(err){
                            return console.error('4error de estado', err);                            
                        }else{
                        } 
                    });
                    client.query(sprintf("UPDATE mensajes SET lecturacalibracion='%1$s' WHERE id_mensaje=1" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                        done();
                        if(err){
                            return console.error('5error de mensajes', err);                            
                        }else{
                        } 
                    });  
                    basketEnablesReadingL1=0;
                    creditEnablesReadingL1=0;  
                    datagiveTotable_creditL1=0;                    
                break;
                case surtiendoL1:
                    client.query("UPDATE estado SET pos1=25", function(err,result){//era 1 hasta el 04/08/2016
                        done();
                        if(err){
                            return console.error('6error de estado', err);                            
                        }else{
                        } 
                    });
                break;    
                case idusuariocreditoL1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",5),function(err,result){
                        done();
                        if(err){
                            return console.error('7Error de estado', err);
                        }else{
                        }
                    });                            
                break;
                case transaccionCrecanL1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",17),function(err,result){
                        done();
                        if(err){
                            return console.error('8Error de estado', err);
                        }else{
                        }
                    });  
                break;
                case procesocalibracionL1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",2),function(err,result){
                        done();
                        if(err){
                            return console.error('9Error de estado', err);
                        }else{
                        }
                    });                    
                break;
                case idusuariocredito2L1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",5),function(err,result){
                        done();
                        if(err){
                            return console.error('10Error de estado', err);
                        }else{
                        }
                    });                  
                break;
                case transaccionCrecan2L1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",17),function(err,result){
                        done();
                        if(err){
                            return console.error('11Error de estado', err);
                        }else{
                        }
                    });                             
                break;    
                case procesocalibracion2L1:
                    client.query("UPDATE estado SET pos1=1", function(err,result){//era 1 hasta el 04/08/2016
                        done();
                        if(err){
                            return console.error('12error de estado', err);                            
                        }else{
                        } 
                    });
                break;
                case idproductcanastaL1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",16),function(err,result){
                        done();
                        if(err){
                            return console.error('13Error de estado', err);
                        }else{
                        }
                    });      
                break;    
                case reciboL1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",9),function(err,result){
                        done();
                        if(err){
                            return console.error('14Error de estado', err);
                        }else{
                        }
                    });
                break;
                case esperarespuestaconsignacionL1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",19),function(err,result){
                        done();
                        if(err){
                            return console.error('15Error de estado', err);
                        }else{
                        }
                    });                        
                break;    
                case menucanastaL1:
                    client.query(sprintf("UPDATE venta_canasta SET lecturacanasta='%1$s' WHERE idposicionc=1" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                        done();
                        if(err){
                            return console.error('16error de venta_canasta', err);                            
                        }else{
                        } 
                    });
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",17),function(err,result){
                        done();
                        if(err){
                            return console.error('17Error de estado', err);
                        }else{
                        }
                    });                                
                    basketEnablesReadingL1=0;                                         
                break;
                case MuxSolicitaConfL1:
                    for(x=0;x<=4;x++){
                        client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",12),function(err,result){
                            done();
                            if(err){
                                return console.error('18Error de estado', err);
                            }else{
                            }
                        });  
                    }
                    contador=2;
                    enable_count=1;
                    count();                     
                    for(x=0;x<=4;x++){                    
                        client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",20),function(err,result){
                            done();
                            if(err){
                                return console.error('19Error de estado', err);
                            }else{
                            }
                        }); 
                    }
                break;    
                case pendientedatosTurnL1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",6),function(err,result){
                        done();
                        if(err){
                            return console.error('20Error de estado', err);
                        }else{
                        }
                    });
                break;    
                case turnoaperturacierreL1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",8),function(err,result){
                        done();
                        if(err){
                            return console.error('21Error de estado', err);
                        }else{
                        }
                    });                       
                break;
                case finventaceroL1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",10),function(err,result){
                        done();
                        if(err){
                            return console.error('22Error de estado', err);
                        }else{
                        }
                    });
                break;   
                case LazodesconectadoL1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",31),function(err,result){
                        done();
                        if(err){
                            return console.error('23Error de estado', err);
                        }else{
                        }
                    });                    
                break;  
                case posicionbloqueadaL1:
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",32),function(err,result){
                        done();
                        if(err){
                            return console.error('24Error de estado', err);
                        }else{
                        }
                    });                    
                break;                   
                default:
            }
            estadoL1=0;
            client.query(sprintf("UPDATE estado SET led = '%1$s' ",1),function(err,result){
                done();
                if(err){
                    return console.error('25Error de estado', err);
                }else{
                }
            });                 
                                  
        }   
    });

};



/*
*********************************************************************************************************
*                                function muxWriteTablesL2()
*
* Description : Escribe los estado insertados al lado dos para el code php
*               
*********************************************************************************************************
*/


var esperaL2=1,surtiendoL2=2,idusuariocreditoL2=3,transaccionCrecanL2=4,procesocalibracionL2=5,idusuariocredito2L2=6,transaccionCrecan2L2=7,
    procesocalibracion2L2=8,idproductcanastaL2=9,reciboL2=10,esperarespuestaconsignacionL2=11,menucanastaL2=12,pendientedatosTurnL2=13,
    turnoaperturacierreL2=14,finventaceroL2=15,MuxSolicitaConfL2=16,LazodesconectadoL2=17,posicionbloqueadaL2=18,errorL2=19;

var statesPhpL2 =function(estadoL2){
    
    pg.connect(conString, function(err, client, done){
        if(err){
            return console.error('1Error de statesphpL2', err);
        }else{
            switch(estadoL2){
	            case errorL2:
	                client.query("UPDATE estado SET pos2=33", function(err,result){//era 1 hasta el 04/08/2016
	                done();
	                   if(err){
	                       return console.error('4error de estado', err);                            
	                   }else{
	                   }
	                });                    
	            break;                
                case esperaL2:
                    client.query(sprintf("UPDATE venta_canasta SET lecturacanasta='%1$s' WHERE idposicionc=2" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                        done();
                        if(err){
                            return console.error('2error de venta_canasta', err);                            
                        }else{
                        } 
                    });
                    client.query(sprintf("UPDATE preset SET lecturacupocredito='%1$s' WHERE id_pos=2" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                        done();
                        if(err){
                            return console.error('3error de preset', err);                            
                        }else{
                        } 
                    });
                    client.query("UPDATE estado SET pos2=22", function(err,result){//era 1 hasta el 04/08/2016
                    done();
                        if(err){
                            return console.error('4error de estado', err);                            
                        }else{
                        } 
                    });
                    client.query(sprintf("UPDATE mensajes SET lecturacalibracion='%1$s' WHERE id_mensaje=2" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                        done();
                        if(err){
                            return console.error('5error de mensajes', err);                            
                        }else{
                        } 
                    });                                
                    basketEnablesReadingL1=0;
                    creditEnablesReadingL2=0;
                    datagiveTotable_creditL2=0;
                break;
                case surtiendoL2:
                    client.query("UPDATE estado SET pos2=25", function(err,result){//era 1 hasta el 04/08/2016
                        done();
                        if(err){
                            return console.error('6error de estado', err);                            
                        }else{
                        } 
                    });                                       
                break;    
                case idusuariocreditoL2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",5),function(err,result){
                        done();
                        if(err){
                            return console.error('7Error de estado', err);
                        }else{
                        }
                    });                                   
                break;
                case transaccionCrecanL2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",17),function(err,result){
                        done();
                        if(err){
                            return console.error('8Error de estado', err);
                        }else{
                        }
                    }); 
                break;
                case procesocalibracionL2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",2),function(err,result){
                        done();
                        if(err){
                            return console.error('9Error de estado', err);
                        }else{
                        }
                    });                    
                break;
                case idusuariocredito2L2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",5),function(err,result){
                        done();
                        if(err){
                            return console.error('10Error de estado', err);
                        }else{
                        }
                    });                  
                break;
                case transaccionCrecan2L2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",17),function(err,result){
                        done();
                        if(err){
                            return console.error('11Error de estado', err);
                        }else{
                        }
                    });                            
                break;    
                case procesocalibracion2L2:
                    client.query("UPDATE estado SET pos2=1", function(err,result){//era 1 hasta el 04/08/2016
                        done();
                        if(err){
                            return console.error('12error de estado', err);                            
                        }else{
                        } 
                    });
                break;
                case idproductcanastaL2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",16),function(err,result){
                        done();
                        if(err){
                            return console.error('13Error de estado', err);
                        }else{
                        }
                    });      
                break;    
                case reciboL2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",9),function(err,result){
                        done();
                        if(err){
                            return console.error('14Error de estado', err);
                        }else{
                        }
                    });
                break;
                case esperarespuestaconsignacionL2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",19),function(err,result){
                        done();
                        if(err){
                            return console.error('15Error de estado', err);
                        }else{
                        }
                    });                        
                break;    
                case menucanastaL2:
                    client.query(sprintf("UPDATE venta_canasta SET lecturacanasta='%1$s' WHERE idposicionc=2" ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                        done();
                        if(err){
                            return console.error('16error de venta_canasta', err);                            
                        }else{
                        } 
                    });
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",17),function(err,result){
                        done();
                        if(err){
                            return console.error('17Error de estado', err);
                        }else{
                        }
                    });                                
                    basketEnablesReadingL2=0;                                         
                break;
                case MuxSolicitaConfL2:
                    for(x=0;x<=4;x++){
                        client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",12),function(err,result){
                            done();
                            if(err){
                                return console.error('18Error de estado', err);
                            }else{
                            }
                        }); 
                    }
                    contador2=2;
                    enable_count2=1;
                    count2();                    
                    for(x=0;x<=4;x++){
                        client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",20),function(err,result){
                            done();
                            if(err){
                                return console.error('19Error de estado', err);
                            }else{
                            }
                        });  
                    }
                break;    
                case pendientedatosTurnL2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",6),function(err,result){
                        done();
                        if(err){
                            return console.error('20Error de estado', err);
                        }else{
                        }
                    });
                break;    
                case turnoaperturacierreL2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",8),function(err,result){
                        done();
                        if(err){
                            return console.error('21Error de estado', err);
                        }else{
                        }
                    });                  
                break;
                case finventaceroL2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",10),function(err,result){
                        done();
                        if(err){
                            return console.error('22Error de estado', err);
                        }else{
                        }
                    });
                break; 
                case LazodesconectadoL2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",31),function(err,result){
                        done();
                        if(err){
                            return console.error('23Error de estado', err);
                        }else{
                        }
                    });                    
                break;    
                case posicionbloqueadaL2:
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",32),function(err,result){
                        done();
                        if(err){
                            return console.error('24Error de estado', err);
                        }else{
                        }
                    });                    
                break;                 
                default:
            }
            estadoL2=0;
            client.query(sprintf("UPDATE estado SET led = '%1$s' ",1),function(err,result){
                done();
                if(err){
                    return console.error('25Error de estado', err);
                }else{
                }
            });                 
                                  
        }   
    });

};

/*
*********************************************************************************************************
*                                function muxWriteTablesL1()
*
* Description : Escribe los datos insertados al lado uno para el code php
*               
*********************************************************************************************************
*/


var FinventaL1=1,discriminarformadepagoventaL1=2,valordiscriminadoL1=3,creditocanasta1L1=4,creditocanasta2L1=5,creditocanasta3L1=6,
    identificacionproductocanastaL1=7,finventacanasta1L1=8,finventacanasta2L1=9,consignacionesL1=10,turnosL1=11,totaleselectronicosL1=12,
    subemanijaL1=13,printerL1=14;



var muxWriteTablesL1 =function(WriteCase){
    
    pg.connect(conString, function(err, client, done){
        if(err){
            return console.error('1Error de muxwritetablesL1', err);
        }else{
            switch(WriteCase){
                case FinventaL1:
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
                    //(new Date());
                    client.query(sprintf("INSERT INTO venta (fechainicial,fechafinal,cantidadtotal,valortotal,volumeninicial,volumenfinal,dineroinicial,dinerofinal,valorprogramado,ppu,grado,nombreefectivo,kilometrajecliente,placaefectivo,tipovehiculo,tipopreset,idposicion) VALUES (CURRENT_TIMESTAMP,CURRENT_TIMESTAMP, '%1$f','%2$f','%3$s','%4$f','%5$f','%6$s','%7$s','%8$s','%9$s','%10$s','%11$s','%12$s','%13$s','%14$s','%15$s')",cantidadtotal,valortotal,volumeninicial,volumenfinal,dineroinicial,dinerofinal,valorprogramado,ppu,grado,nombreefectivo,kilometrajecliente,placaefectivo,tipovehiculo,tipopreset,1),function(err,result){                        
                        done();
                        if(err){
                            return console.error('2Error de venta', err);
                        }else{
                        }
                    });
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",4),function(err,result){
                        done();
                        if(err){
                            return console.error('3Error de estado', err);
                        }else{
                        }
                    });   
                    contador=4;
                    enable_count=1;
                    count();                   
                break;
                case discriminarformadepagoventaL1:

                break;    
                case valordiscriminadoL1:
                    switch (frame_1.consultation_sale){
                        case '1':
                            var numeroventaFP;
                            var tipoformadepago     = frame_1.type_of_payment;
                            var valorventa          = salevalueFPL1Comb;
                            var valordiscriminado   = frame_1.discrim_value;
                            var numeroventa         = idultimaventaPass2L1;
                            var ventaconsulta       = frame_1.consultation_sale;
                            var identificadorfp     = frame_1.serial_id;
                            //("valordiscriminado:"+valordiscriminado);
                            //("numeroventa:"+numeroventa);                        
                            client.query(sprintf("INSERT INTO formadepago (tipoformadepago,valorventa,valordiscriminado,numeroventa,ventaconsulta,id_pos,identificadorfp) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s','%6$s','%7$s')",tipoformadepago,valorventa,valordiscriminado,numeroventa,ventaconsulta,1,identificadorfp),function(err,result){                        
                                done();
                                if(err){
                                    return console.error('4Error de formadepago ', err);
                                }else{
                                }
                            });                    
                        break;    
                        case '2':                 
                            var numeroventaFP;
                            var tipoformadepago     = frame_1.type_of_payment;
                            var valorventa          = salevalueFPL1Can;
                            var valordiscriminado   = frame_1.discrim_value;
                            var numeroventa         = idultimaventaPass2L1;
                            var ventaconsulta       = frame_1.consultation_sale;
                            var identificadorfp     = frame_1.serial_id;
                            //("valordiscriminado:"+valordiscriminado);
                            //("numeroventa:"+numeroventa);                        
                            client.query(sprintf("INSERT INTO formadepago (tipoformadepago,valorventa,valordiscriminado,numeroventa,ventaconsulta,id_pos,identificadorfp) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s','%6$s','%7$s')",tipoformadepago,valorventa,valordiscriminado,numeroventa,ventaconsulta,1,identificadorfp),function(err,result){                        
                                done();
                                if(err){
                                    return console.error('4Error de formadepago ', err);
                                }else{
                                }
                            });
                        break;
                        default:
                    }
                break;
                case creditocanasta1L1:
                    var kilometraje = frame_1.mileage;
                    var serial      = frame_1.serial_id;
                    var tipo_venta  = parseFloat(frame_1.type_sale);
                    if(frame_1.product_type=='0'){
                       frame_1.product_type='1'; 
                    }
                    var grado       = frame_1.product_type;
                    client.query(sprintf("UPDATE preset SET  kilometraje='%1$s', serial='%2$s', tipo_venta='%3$s', grado='%4$s' where id_pos = 1" ,kilometraje,serial,tipo_venta,grado ), function(err,result){
                        done();
                        if(err){
        					return console.error('5error de preset', err);                            
                        }else{
                            datagiveTotable_creditL1=1;
                        } 
                    });
                break;
                case creditocanasta2L1:
                    
                break;
                case creditocanasta3L1:
                    if(frame_1.product_type=='0'){
                        frame_1.product_type='1'; 
                    }
                    var grado       = frame_1.product_type;                    
                    client.query(sprintf("UPDATE preset SET grado='%1$s' where id_pos = 1" ,grado ), function(err,result){
                        done();
                        if(err){
        					return console.error('6error de preset', err);                            
                        }else{
                        } 
                    });
                break;                
                case identificacionproductocanastaL1:
                    var serial   = frame_1.serial_product;
                    client.query(sprintf("INSERT INTO venta_canasta (serial,idposicionc,lecturacanasta) VALUES ('%1$s','%2$s','%3$s')",serial,1,0),function(err,result){                        
                        done();
                        if(err){
                            return console.error('7Error de venta_canasta', err);
                        }else{
                        }
                    });                            
                break;    
                case finventacanasta1L1:
                    var serial              = 0;
                    var cantidadvendida     = 0;
                    var valormux            = 0;                    
                    var tipoventacanasta    = frame_1.type_sale;
                    var serial              = frame_1.serialP1;
                    var cantidadvendida     = frame_1.quantityP1;
                    var valormux            = frame_1.total_valueP1;
                    client.query(sprintf("INSERT INTO finventacanasta (tipoventacanasta,cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s','%6$s')",tipoventacanasta,cantidadvendida,valormux,1,1,serial),function(err,result){                        
                        done();
                        if(err){
                            return console.error('8Error de finventacanasta', err);
                        }else{
                        }
                    });
                    var serial              = 0;
                    var cantidadvendida     = 0;
                    var valormux            = 0;
                    var serial              = frame_1.serialP2;
                    var cantidadvendida     = frame_1.quantityP2;
                    var valormux            = frame_1.total_valueP2;
                    client.query(sprintf("INSERT INTO finventacanasta (cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",cantidadvendida,valormux,1,2,serial),function(err,result){                        
                        done();
                        if(err){
                            return console.error('9Error de finventacanasta', err);
                        }else{
                        }
                    });
                    var serial              = 0;
                    var cantidadvendida     = 0;
                    var valormux            = 0;      
                    var serial              = frame_1.serialP3;
                    var cantidadvendida     = frame_1.quantityP3;
                    var valormux            = frame_1.total_valueP3;
                    client.query(sprintf("INSERT INTO finventacanasta (cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",cantidadvendida,valormux,1,3,serial),function(err,result){                        
                        done();
                        if(err){
                            return console.error('10Error de finventacanasta', err);
                        }else{
                        }
                    });
                    for(x=0;x<=8;x++){//4
                        client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",18),function(err,result){
                            done();
                            if(err){
                                return console.error('11Error de estado', err);
                            }else{
                            }
                        });
                    } 
                    contador=5;
                    enable_count=1;
                    count();                    
                break;
                case finventacanasta2L1:
                    var serial              = 0;
                    var cantidadvendida     = 0;
                    var valormux            = 0;                      
                    var tipoventacanasta    = frame_1.type_sale;
                    var serial              = frame_1.serialP1;
                    var cantidadvendida     = frame_1.quantityP1;
                    var valormux            = frame_1.total_valueP1;
                    var tipoidentificacion  = frame_1.type_of_customer_identification;
                    var serialid            = frame_1.serial_id;
                    //("var uno"+tipoidentificacion);
                    //("var dos"+serialid);
                    client.query(sprintf("INSERT INTO finventacanastacredito (tipoventacanasta,cantidadvendida,valormux,idposicionc,id_canasta,serial,tipoidentificacion,serialid) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s','%6$s','%7$s','%8$s')",tipoventacanasta,cantidadvendida,valormux,1,1,serial,tipoidentificacion,serialid),function(err,result){                        
                        done();
                        if(err){
                            return console.error('12Error de finventacanastacredito', err);
                        }else{
                        }
                    });
                    var serial              = 0;
                    var cantidadvendida     = 0;
                    var valormux            = 0;                      
                    var serial              = frame_1.serialP2;
                    var cantidadvendida     = frame_1.quantityP2;
                    var valormux            = frame_1.total_valueP2;
                    client.query(sprintf("INSERT INTO finventacanastacredito (cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",cantidadvendida,valormux,1,2,serial),function(err,result){                        
                        done();
                        if(err){
                            return console.error('13Error de finventacanastacredito', err);
                        }else{
                        }
                    });
                    var serial              = 0;
                    var cantidadvendida     = 0;
                    var valormux            = 0;                      
                    var serial              = frame_1.serialP3;
                    var cantidadvendida     = frame_1.quantityP3;
                    var valormux            = frame_1.total_valueP3;
                    client.query(sprintf("INSERT INTO finventacanastacredito (cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",cantidadvendida,valormux,1,3,serial),function(err,result){                        
                        done();
                        if(err){
                            return console.error('14Error de finventacanastacredito', err);
                        }else{
                        }
                    });
                    for(x=0;x<=8;x++){
                        client.query(sprintf("UPDATE estado SET pos1 = '%1$s' ",30),function(err,result){
                            done();
                            if(err){
                                return console.error('15Error de estado', err);
                            }else{
                            }
                        });
                    }       
                break;    
                case consignacionesL1:
                    var idpos               = frame_1.supplier_position;                         
                    var valorconsignacion   = frame_1.consignmentvalue;
                    client.query(sprintf("UPDATE consignaciones SET valorconsignacion = '%1$s',idpos = '%2$s' ",valorconsignacion,1),function(err,result){
                        done();
                        if(err){
                            return console.error('16Error de consignaciones', err);
                        }else{
                        }
                    });
                break;
                case turnosL1:
                    var usuario     = parseFloat(frame_1.serial_seller);
                    var contrasena  = frame_1.password;
                    client.query(sprintf("UPDATE turno SET usuario ='%1$s', passwd = '%2$s'",usuario,contrasena),function(err,result){
                        done();
                        if(err){
                            return console.error('17Error de turno', err);
                        }else{
                        }
                    });  
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",7),function(err,result){
                        done();
                        if(err){
                            return console.error('18Error de estado', err);
                        }else{
                        }
                    });                        
                break;    
                case totaleselectronicosL1:
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
                    //(new Date());
                    client.query(sprintf("UPDATE totales SET totalmanguera1 ='%1$s', totalmanguera2 = '%2$s' , totalmanguera3 ='%3$s',totalmanguera4 ='%4$s',dineromanguera1 ='%5$s', dineromanguera2 ='%6$s', dineromanguera3 = '%7$s', dineromanguera4='%6$s' WHERE pk_id_posicion=1",totalmanguera1,totalmanguera2,totalmanguera3,totalmanguera4,dineromanguera1,dineromanguera2,dineromanguera3,dineromanguera4),function(err,result){
                        done();
                        if(err){
                            return console.error('19Error de totales', err);
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
                            return console.error('20Error de totales', err);
                        }else{
                        }
                    });                        
                break;
                case subemanijaL1:
                    var tipo_p      = frame_1.preset_type;
                    var valor_p     = frame_1.preset_value;
                    var totalesdin  = parseFloat(frame_1.total_money_previous);
                    var totalesvol  = parseFloat(frame_1.total_previous_volume);
                    var ppu         = frame_1.previous_PPU;
                    var grado       = parseFloat(frame_1.selected_product); 
                    var kilometraje = '0';
                    var serial      = '0'; 
                    var estado      = 23;
                    client.query(sprintf("UPDATE preset SET tipo_p='%2$s', valor_p='%3$s', totalesdin='%4$s', totalesvol='%5$s', ppu='%6$s', grado='%7$s', kilometraje='%8$s', serial='%9$s' where id_pos= '%1$s'   " ,1,tipo_p,valor_p,totalesdin,totalesvol,ppu,grado,kilometraje,serial ), function(err,result){
                        done();
                        if(err){
							return console.error('21error de preset', err);                            
                        }else{
                        } 
                    });
                    client.query(sprintf("UPDATE estado SET pos1 = '%1$s' where pk_id_estado = 1 ",estado),function(err,result){
                        done();
                        if(err){
                            return console.error('22Error de estado', err);
                        }else{
                        }
                    }); 
                    contador=16;
                    enable_count=1;
                    count();                  
                break;   
                case printerL1:
                    client.query(sprintf("UPDATE mapeodispensador SET impresora = '%1$s' where pk_idposicion = 1 ",frame_1.printer1),function(err,result){
                        done();
                        if(err){
                            return console.error('23Error de mapeodispensador', err);
                        }else{
                        }
                    });    
                    client.query(sprintf("UPDATE mapeodispensador SET impresora = '%1$s' where pk_idposicion = 2 ",frame_1.printer2),function(err,result){
                        done();
                        if(err){
                            return console.error('24Error de mapeodispensador', err);
                        }else{
                        }
                    });                       
                break;    
                default:
            }
            WriteCase=0;
            client.query(sprintf("UPDATE estado SET led = '%1$s' ",1),function(err,result){
                done();
                if(err){
                    return console.error('25Error de estado', err);
                }else{
                }
            });                 
                                  
        }   
    });
};




/*
*********************************************************************************************************
*                                function muxWriteTablesL1()
*
* Description : Escribe los datos insertados al lado dos para el code php
*               
*********************************************************************************************************
*/


var FinventaL2=1,discriminarformadepagoventaL2=2,valordiscriminadoL2=3,creditocanasta1L2=4,creditocanasta2L2=5,creditocanasta3L2=6,
    identificacionproductocanastaL2=7,finventacanasta1L2=8,finventacanasta2L2=9,consignacionesL2=10,turnosL2=11,totaleselectronicosL2=12,
    subemanijaL2=13,printerL2=14;

var muxWriteTablesL2 =function(WriteCase2){
    
    pg.connect(conString, function(err, client, done){
        if(err){
            return console.error('1Error de muxwritetablesL2', err);
        }else{
            switch(WriteCase2){
                case FinventaL2:
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
                            return console.error('2Error de venta', err);
                        }else{
                        }
                    });
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",4),function(err,result){
                        done();
                        if(err){
                            return console.error('3Error de estado', err);
                        }else{
                        }
                    });   
                    contador2=4;
                    enable_count2=1;
                    count2();                      
                break;
                case discriminarformadepagoventaL2:
                    
                break;    
                case valordiscriminadoL2:
                    switch(frame_2.consultation_sale){
                        case '1':
                            var tipoformadepago     = frame_2.type_of_payment;
                            var valorventa          = salevalueFPL2Comb;
                            var valordiscriminado   = frame_2.discrim_value;
                            var numeroventa         = idultimaventaPass2L2;
                            var ventaconsulta       = frame_2.consultation_sale;
                            var identificadorfp     = frame_2.serial_id;
                            //("valordiscriminado:"+valordiscriminado);
                            //("numeroventa:"+numeroventa);                               
                            client.query(sprintf("INSERT INTO formadepago (tipoformadepago,valorventa,valordiscriminado,numeroventa,ventaconsulta,id_pos,identificadorfp) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s','%6$s','%7$s')",tipoformadepago,valorventa,valordiscriminado,numeroventa,ventaconsulta,2,identificadorfp),function(err,result){                        
                                done();
                                if(err){
                                    return console.error('4Error de formadepago', err);
                                }else{
                                }
                            });         
                        break;
                        case '2':
                            var tipoformadepago     = frame_2.type_of_payment;
                            var valorventa          = salevalueFPL2Can;
                            var valordiscriminado   = frame_2.discrim_value;
                            var numeroventa         = idultimaventaPass2L2;
                            var ventaconsulta       = frame_2.consultation_sale;
                            var identificadorfp     = frame_2.serial_id;
                            //("valordiscriminado:"+valordiscriminado);
                            //("numeroventa:"+numeroventa);                               
                            client.query(sprintf("INSERT INTO formadepago (tipoformadepago,valorventa,valordiscriminado,numeroventa,ventaconsulta,id_pos,identificadorfp) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s','%6$s','%7$s')",tipoformadepago,valorventa,valordiscriminado,numeroventa,ventaconsulta,2,identificadorfp),function(err,result){                        
                                done();
                                if(err){
                                    return console.error('4Error de formadepago', err);
                                }else{
                                }
                            });                                   
                        break;
                        default:
                    }
                break;
                case creditocanasta1L2:
                    var kilometraje = frame_2.mileage;
                    var serial      = frame_2.serial_id;
                    var tipo_venta  = parseFloat(frame_2.type_sale);
                    if(frame_2.product_type=='0'){
                        frame_2.product_type='1'; 
                    }                
                    var grado       = frame_2.product_type;
                    client.query(sprintf("UPDATE preset SET  kilometraje='%1$s', serial='%2$s', tipo_venta='%3$s', grado='%4$s' where id_pos = 2" ,kilometraje,serial,tipo_venta,grado ), function(err,result){
                        done();
                        if(err){
        					return console.error('5error de preset', err);                            
                        }else{
                            datagiveTotable_creditL2=1;
                        } 
                    });
                break;
                case creditocanasta2L2:
                    
                break;
                case creditocanasta3L2:
                    var grado       = frame_2.product_type;                    
                    client.query(sprintf("UPDATE preset SET  grado='%1$s' where id_pos = 2" ,grado ), function(err,result){
                        done();
                        if(err){
        					return console.error('6error de preset', err);                            
                        }else{
                        } 
                    });
                break;                
                case identificacionproductocanastaL2:
                    var serial   = frame_2.serial_product;
                    client.query(sprintf("INSERT INTO venta_canasta (serial,idposicionc,lecturacanasta) VALUES ('%1$s','%2$s','%3$s')",serial,2,0),function(err,result){                        
                        done();
                        if(err){
                            return console.error('7Error de venta_canasta', err);
                        }else{
                        }
                    });                            
                break;    
                case finventacanasta1L2:
                    var serial              = 0;
                    var cantidadvendida     = 0;
                    var valormux            = 0;   
                    var tipoventacanasta    = frame_2.type_sale;
                    var serial              = frame_2.serialP1;
                    var cantidadvendida     = frame_2.quantityP1;
                    var valormux            = frame_2.total_valueP1;
                    client.query(sprintf("INSERT INTO finventacanasta (tipoventacanasta,cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s','%6$s')",tipoventacanasta,cantidadvendida,valormux,2,1,serial),function(err,result){                        
                        done();
                        if(err){
                            return console.error('8Error de finventacanasta', err);
                        }else{
                        }
                    });
                    var serial              = 0;
                    var cantidadvendida     = 0;
                    var valormux            = 0;                       
                    var serial              = frame_2.serialP2;
                    var cantidadvendida     = frame_2.quantityP2;
                    var valormux            = frame_2.total_valueP2;
                    client.query(sprintf("INSERT INTO finventacanasta (cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",cantidadvendida,valormux,2,2,serial),function(err,result){                        
                        done();
                        if(err){
                            return console.error('9Error de finventacanasta', err);
                        }else{
                        }
                    });    
                    var serial              = 0;
                    var cantidadvendida     = 0;
                    var valormux            = 0;                       
                    var serial              = frame_2.serialP3;
                    var cantidadvendida     = frame_2.quantityP3;
                    var valormux            = frame_2.total_valueP3;
                    client.query(sprintf("INSERT INTO finventacanasta (cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",cantidadvendida,valormux,2,3,serial),function(err,result){                        
                        done();
                        if(err){
                            return console.error('10Error de finventacanasta', err);
                        }else{
                        }
                    });                
                    for(x=0;x<=8;x++){
                        client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",18),function(err,result){
                            done();
                            if(err){
                                return console.error('11Error de estado', err);
                            }else{
                            }
                        });
                    } 
                    contador2=5;
                    enable_count2=1;
                    count2();                   
                break;
                case finventacanasta2L2:
                    var serial              = 0;
                    var cantidadvendida     = 0;
                    var valormux            = 0;                     
                    var tipoventacanasta    = frame_2.type_sale;
                    var serial              = frame_2.serialP1;
                    var cantidadvendida     = frame_2.quantityP1;
                    var valormux            = frame_2.total_valueP1;
                    var tipoidentificacion  = frame_2.type_of_customer_identification;
                    var serialid            = frame_2.serial_id;                                
                    client.query(sprintf("INSERT INTO finventacanastacredito (tipoventacanasta,cantidadvendida,valormux,idposicionc,id_canasta,serial,tipoidentificacion,serialid) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s','%6$s','%7$s','%8$s')",tipoventacanasta,cantidadvendida,valormux,2,1,serial,tipoidentificacion,serialid),function(err,result){                        
                        done();
                        if(err){
                            return console.error('12Error de finventacanastacredito', err);
                        }else{
                        }
                    });
                    var serial              = 0;
                    var cantidadvendida     = 0;
                    var valormux            = 0;                     
                    var serial              = frame_2.serialP2;
                    var cantidadvendida     = frame_2.quantityP2;
                    var valormux            = frame_2.total_valueP2;
                    client.query(sprintf("INSERT INTO finventacanastacredito (cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",cantidadvendida,valormux,2,2,serial),function(err,result){                        
                        done();
                        if(err){
                            return console.error('13Error de finventacanastacredito', err);
                        }else{
                        }
                    }); 
                    var serial              = 0;
                    var cantidadvendida     = 0;
                    var valormux            = 0;                     
                    var serial              = frame_2.serialP3;
                    var cantidadvendida     = frame_2.quantityP3;
                    var valormux            = frame_2.total_valueP3;
                    client.query(sprintf("INSERT INTO finventacanastacredito (cantidadvendida,valormux,idposicionc,id_canasta,serial) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",cantidadvendida,valormux,2,3,serial),function(err,result){                        
                        done();
                        if(err){
                            return console.error('14Error de finventacanastacredito', err);
                        }else{
                        }
                    });                   
                    for(x=0;x<=8;x++){
                        client.query(sprintf("UPDATE estado SET pos2 = '%1$s' ",30),function(err,result){
                            done();
                            if(err){
                                return console.error('15Error de estado', err);
                            }else{
                            }
                        });
                    }                                       
                break;    
                case consignacionesL2:
                    var idpos               = frame_2.supplier_position;                         
                    var valorconsignacion   = frame_2.consignmentvalue;
                    client.query(sprintf("UPDATE consignaciones SET valorconsignacion = '%1$s',idpos = '%2$s' ",valorconsignacion,2),function(err,result){
                        done();
                        if(err){
                            return console.error('16Error de consignaciones', err);
                        }else{
                        }
                    });
                break;
                case turnosL2:
                    var usuario     = parseFloat(frame_2.serial_seller);
                    var contrasena  = frame_2.password;
                    client.query(sprintf("UPDATE turno SET usuario ='%1$s', passwd = '%2$s'",usuario,contrasena),function(err,result){
                        done();
                        if(err){
                            return console.error('17Error de turno', err);
                        }else{
                        }
                    });  
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",7),function(err,result){
                        done();
                        if(err){
                            return console.error('18Error de estado', err);
                        }else{
                        }
                    });                        
                break;    
                case totaleselectronicosL2:
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
                            return console.error('19Error de totales', err);
                        }else{
                        }
                    });
                break;
                case subemanijaL2:
                    var tipo_p      = frame_2.preset_type;
                    var valor_p     = frame_2.preset_value;
                    var totalesdin  = parseFloat(frame_2.total_money_previous);
                    var totalesvol  = parseFloat(frame_2.total_previous_volume);
                    var ppu         = frame_2.previous_PPU;
                    var grado       = parseFloat(frame_2.selected_product); 
                    var kilometraje = '0';
                    var serial      = '0'; 
                    var estado      = 23;
                    client.query(sprintf("UPDATE preset SET tipo_p='%2$s', valor_p='%3$s', totalesdin='%4$s', totalesvol='%5$s', ppu='%6$s', grado='%7$s', kilometraje='%8$s', serial='%9$s' where id_pos= '%1$s'   " ,2,tipo_p,valor_p,totalesdin,totalesvol,ppu,grado,kilometraje,serial ), function(err,result){
                        done();
                        if(err){
							return console.error('20error de preset', err);                            
                        }else{
                        }                                        
                    });
                    client.query(sprintf("UPDATE estado SET pos2 = '%1$s' where pk_id_estado = 1 ",estado),function(err,result){
                        done();
                        if(err){
                            return console.error('21Error de estado', err);
                        }else{
                        }
                    });  
                    contador2=16;
                    enable_count2=1;
                    count2();                      
                break;    
                case printerL2:
                    client.query(sprintf("UPDATE mapeodispensador SET impresora = '%1$s' where pk_idposicion = 1 ",frame_2.printer1),function(err,result){
                        done();
                        if(err){
                            return console.error('22Error de mapeodispensador', err);
                        }else{
                        }
                    });    
                    client.query(sprintf("UPDATE mapeodispensador SET impresora = '%1$s' where pk_idposicion = 2 ",frame_2.printer2),function(err,result){
                        done();
                        if(err){
                            return console.error('23Error de mapeodispensador', err);
                        }else{
                        }
                    });                      
                break;    
                default:
            }
            WriteCase2=0;
            client.query(sprintf("UPDATE estado SET led = '%1$s' ",1),function(err,result){
                done();
                if(err){
                    return console.error('24Error de estado', err);
                }else{
                }
            });                 
                                  
        }   
    });
};





/*
*********************************************************************************************************
*                                function leertablas()
*
* Description : Lee las variables que existen dentro de las tablas insertadas en el beagle
*               
*********************************************************************************************************
*/
var numeromangueras,formatodinero,formatovolumen,ppux10,numerodigitos,unidadmoneda, valor1,valor2,valor3,simboloVOL,vehicle_screen,paymentsale_screen; //variables de configuraciones inciciales
var nsx1,nsx2,nsx3,nsx1l2,nsx2l2,nsx3l2; 
var turn,turnMux; 
var shift_message,turnCloseOpen;
var authorizedMoney,PPUauthorized,creditValidacion;
var positionFP,validationFP,salevalueFP,salevalueFP1,salevalueFPL1,salevalueFPL2,activekeyboardFP,Mixtatotaldin,Mixtatotalcan,Mixtatotaldin2,Mixtatotalcan2;//variables para forma de pago
var validationConsg,shift_messageConsg,positionConsg;
var validationBasket,nameBasket,valueBasket,quantityBasket;
var TableNumber=1,Tablenumberconsign=0,Tablenumbercredit=0;
var initialSettings_table=1,authorizedPpu_table=2,turn_table=3,button_Names_table=4,turnopenclose_table=5,not_readtable=6,
    creditbasket_tableL1=7,responseto_requestpayment_tableL1=8,responseto_requestpayment_tableL2=9,creditbasket_tableL2=10,consign_tableL1=11,
    consign_tableL2=12,turn_tablensx=13,basket_tableL1=14,basket_tableL2=15,discriminateSale_tableL1=16,discriminateSale_tableL2=17,
    calibration_tableL1=18,calibration_tableL2=19,Cbasket_tableL1=20,Cbasket_tableL2=21,sellerData=22;
var initialSettings_mux=1,authorizedPpu_mux=2,turnMux_Nsx=3,totalRequest_mux=4,initialbuttons_mux=5,turnopenclose_mux=6,
    creditbasket_mux=7,responseto_requestpayment_mux=8,consign_mux=9,turnnsxbbbmux_mux=10,responseto_requestBasket_mux=11,
    acceptedPayment_mux=12,accepetFP_mux=13,accepetcalibration_mux=14,Cbasket_mux=15,blocking_mux=16,unlock_mux=17,datosvendedor_mux=18,
    sotware_hardware_comunication=19,resetforError=20; 
var buttons = new Array(114);
var validationCalibration;




var creditEnablesReadingL1,creditEnablesReadingL2,basketEnablesReadingL1,basketEnablesReadingL2;


var readTables_credit = function(error){

    if (error){
        //(error);
    }else{
        pg.connect(conString, function(err, client, done){
            if(err){
                return console.error('1Error de readtables_credit', err);
        }else{ 
            switch (Tablenumbercredit) {
                case creditbasket_tableL1:
                    if(creditEnablesReadingL1!=1){                
                        client.query("SELECT lecturacupocredito FROM preset where id_pos=1;", function(err,result){
                            done();
                            if(err){
                                return console.error('2error de preset', err);
                            }else{                      
                                creditEnablesReadingL1 =result.rows[0].lecturacupocredito;
                                if(creditEnablesReadingL1==undefined || creditEnablesReadingL1==null) {
                                  //("(llenar por favor la tabla de preset con item en leturacupocredito)");
                                }                                
                            }      
                        });
                    }
                    if(creditEnablesReadingL1==1){
                        //("*******Credito Canasta respuestaNSXL1*******");
                        client.query("SELECT autorizado,validacioncredito FROM preset where id_pos=1;", function(err,result){
                            done();
                            if(err){
                                return console.error('3error de preset', err);
                            }else{
                                authorizedMoney=result.rows[0].autorizado;
                                //("cupo dinero autorizado=" +  authorizedMoney);
                                if(authorizedMoney==undefined || authorizedMoney==null) {
                                    authorizedMoney='0';
                                }                                
                                creditValidacion=result.rows[0].validacioncredito;                                
                                //("validacioncredito=" +  creditValidacion);
                            }      
                        });
                        client.query("SELECT mensaje FROM mensajes where id_mensaje=1;", function(err,result){
                            done();
                            if(err){
                                return console.error('4error de mensajes', err);
                            }else{
                                shift_message=result.rows[0].mensaje;                                
                                if(shift_message==undefined || shift_message==null) {
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
                                    return console.error('5error de precios', err);
                                }else{
                                    PPUauthorized=result.rows[0].nsx1;
                                    //("ppu autorizado nsx1 de precios pos1=" + PPUauthorized);
                                    Tablenumbercredit=0;
                                    sendMux(creditbasket_mux);                                            
                                }      
                                });                                            
                            break;
                            case '1':
                                client.query("SELECT nsx1 FROM precios WHERE id_pos=1;", function(err,result){
                                done();
                                if(err){
                                    return console.error('6error de precios', err);
                                }else{
                                    PPUauthorized=result.rows[0].nsx1;
                                    //("ppu autorizado nsx1 de precios pos1=" + PPUauthorized);
                                    Tablenumbercredit=0;
                                    sendMux(creditbasket_mux);                                            
                                }      
                                });                                            
                            break;
                            case '2':
                                client.query("SELECT nsx2 FROM precios WHERE id_pos=1;", function(err,result){
                                done();
                                if(err){
                                    return console.error('7error de precios', err);
                                }else{
                                    PPUauthorized=result.rows[0].nsx2;
                                    //("ppu autorizado nsx2 de precios pos1=" + PPUauthorized);
                                    Tablenumbercredit=0;
                                    sendMux(creditbasket_mux);                                            
                                }      
                                });                                        
                            break;
                            case '3':
                                client.query("SELECT nsx3 FROM precios WHERE id_pos=1;", function(err,result){
                                done();
                                if(err){
                                    return console.error('8error de precios', err);
                                }else{
                                    PPUauthorized=result.rows[0].nsx3;
                                    //("ppu autorizado nsx3 de precios pos1=" + PPUauthorized);
                                    Tablenumbercredit=0;
                                    sendMux(creditbasket_mux);                                            
                                }      
                                });                                            
                            break;                                    
                            default:
                            }
                        }
                        //("PHP Habilita lectura de cupo creditoL1=" + creditEnablesReadingL1);             
                    break;
                    case creditbasket_tableL2:
                        if(creditEnablesReadingL2!=1){                
                            client.query("SELECT lecturacupocredito FROM preset where id_pos=2;", function(err,result){
                            done();
                            if(err){
                                return console.error('9error de preset', err);
                            }else{                        
                                creditEnablesReadingL2 =result.rows[0].lecturacupocredito;
                                if(creditEnablesReadingL2==undefined || creditEnablesReadingL2==null) {
                                    //("(llenar por favor la tabla de preset con item en leturacupocredito)");
                                }                                   
                            }      
                            });
                        }   
                        if(creditEnablesReadingL2==1){
                            //("*******Credito Canasta respuestaNSXL2*******");
                            client.query("SELECT autorizado,validacioncredito FROM preset where id_pos=2;", function(err,result){
                            done();
                            if(err){
                                return console.error('10error de preset', err);
                            }else{
                                authorizedMoney=result.rows[0].autorizado;
                                //("cupo dinero autorizado=" +  authorizedMoney);
                                if(authorizedMoney==undefined || authorizedMoney==null) {
                                    authorizedMoney='0';
                                }                                   
                                creditValidacion=result.rows[0].validacioncredito;                                
                                //("validacioncredito=" +  creditValidacion);    
                            }      
                            });
                            client.query("SELECT mensaje FROM mensajes where id_mensaje=2;", function(err,result){
                                done();
                                if(err){
                                    return console.error('11error de mensajes', err);
                                }else{
                                    shift_message=result.rows[0].mensaje;                                
                                    if(shift_message==undefined || shift_message==null) {
                                        shift_message="...";
                                    }                                     
                                    //("mensaje a publicar=" +  shift_message);                                
                                }      
                            });
                            switch (frame_2.product_type){
                                case '0':
                                    client.query("SELECT nsx1 FROM precios WHERE id_pos=2;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('12error de precios', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx1;
                                        //("ppu autorizado nsx1 de precios pos2=" + PPUauthorized);
                                        Tablenumbercredit=0;
                                        sendMux(creditbasket_mux);                                                
                                    }
                                    });                                        
                                break;
                                case '1':
                                    client.query("SELECT nsx1 FROM precios WHERE id_pos=2;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('13error de precios', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx1;
                                        //("ppu autorizado nsx1 de precios pos2=" + PPUauthorized);
                                        Tablenumbercredit=0;
                                        sendMux(creditbasket_mux);                                                
                                    }
                                    });                                        
                                break;
                                case '2':
                                    client.query("SELECT nsx2 FROM precios WHERE id_pos=2;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('14error de precios', err);
                                        }else{
                                        PPUauthorized=result.rows[0].nsx2;
                                        //("ppu autorizado nsx2 de precios pos2=" + PPUauthorized);
                                        Tablenumbercredit=0;
                                        sendMux(creditbasket_mux);                                            
                                    }      
                                    });                                                 
                                break;
                                case '3':
                                    client.query("SELECT nsx3 FROM precios WHERE id_pos=2;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('15error de precios', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx3;
                                        //("ppu autorizado nsx1 de precios pos2=" + PPUauthorized);
                                        Tablenumbercredit=0;
                                        sendMux(creditbasket_mux);                                                
                                    }      
                                    });                                        
                                break;                                    
                                default:
                            }
                        }                
                        //("PHP Habilita lectura de cupo creditoL2=" + creditEnablesReadingL2);             
                    break;     
                    case Cbasket_tableL1:
                        sendMux(Cbasket_mux);            
                    break;
                    case Cbasket_tableL2:
                        sendMux(Cbasket_mux);            
                    break;        
                    default:
                    // code
                }
            }
            client.query("SELECT nsx3 FROM precios WHERE id_pos=2;", function(err,result){
            done();
                if(err){
                    return console.error('16error de precios', err);
                }else{
                }      
            });             
        
        });
    }
}



var readTables_consign = function(error){
    
    if (error){
        //(error);
    }else{
        pg.connect(conString, function(err, client, done){
            if(err){
                return console.error('1Error de readtables_consign', err);
            }else{ 
                switch (Tablenumberconsign) {
                    case consign_tableL1:
                        client.query(sprintf("UPDATE consignaciones SET recibe='%1$s' ",0),function(err,result){
                            done();
                            if(err){
                                return console.error('2Error de consignaciones', err);
                            }else{
                            }
                        });   
                        client.query("SELECT confirmacion FROM consignaciones;", function(err,result){
                            done();
                            if(err){
                                return console.error('3error de consignaciones', err);
                            }else{
                                validationConsg=0;
                                validationConsg=result.rows[0].confirmacion;
                                //("validacion Consignacion L1=" + validationConsg);
                                if(validationConsg==undefined || validationConsg==null) {
                                    validationConsg='0';
                                }                                    
                            }      
                        });
                        if(validationConsg==1){
                            //("*******Respuesta a Consignaciones*******");
                            client.query("SELECT confirmacion,mensajeconsignacion,idpos FROM consignaciones where idpos=1;", function(err,result){
                                done();
                                if(err){
                                    return console.error('4error de consignaciones', err);
                                }else{
                                    validationConsg=0;
                                    shift_messageConsg=0;
                                    positionConsg=0;
                                    validationConsg=result.rows[0].confirmacion;
                                    //("validacionConsignacion L1=" + validationConsg);
                                    if(validationConsg==undefined || validationConsg==null) {
                                        validationConsg='0';
                                    }                                     
                                    shift_messageConsg=result.rows[0].mensajeconsignacion;
                                    shift_messageConsg="Consignacion OK";//quemado el mensaje 
                                    //("mensaje a publicar=" + shift_messageConsg);
                                    if(shift_messageConsg==undefined || shift_messageConsg==null) {
                                        shift_messageConsg="...";
                                    }                                      
                                    positionConsg=result.rows[0].idpos;
                                    //("posicion=" + positionConsg); 
                                    sendMux(consign_mux);
                                }      
                            });
                            Tablenumberconsign=0;
                        }
                    break;    
                    case consign_tableL2:
                        client.query(sprintf("UPDATE consignaciones SET  recibe='%1$s' ",0),function(err,result){
                            done();
                            if(err){
                                return console.error('5Error de consignaciones', err);
                            }else{
                            }
                        });   
                        client.query("SELECT confirmacion FROM consignaciones;", function(err,result){
                            done();
                            if(err){
                                return console.error('6error de consignaciones', err);
                            }else{
                                validationConsg=0;
                                validationConsg=result.rows[0].confirmacion;
                                //("validacion Consignacion L2=" + validationConsg);
                                if(validationConsg==undefined || validationConsg==null) {
                                    validationConsg='0';
                                }                                   
                            }      
                        });
                        if(validationConsg==1){ 
                            //("*******Respuesta a Consignaciones*******");
                            client.query("SELECT confirmacion,mensajeconsignacion,idpos FROM consignaciones where idpos=2;", function(err,result){
                                done();
                                if(err){
                                    return console.error('7error de consignaciones', err);
                                }else{
                                    validationConsg=0;
                                    shift_messageConsg=0;
                                    positionConsg=0;                                
                                    validationConsg=result.rows[0].confirmacion;
                                    //("validacion Consignacion L2=" + validationConsg);
                                    if(validationConsg==undefined || validationConsg==null) {
                                        validationConsg='0';
                                    }                                       
                                    shift_messageConsg=result.rows[0].mensajeconsignacion;
                                    shift_messageConsg="Consignacion OK";                                  
                                    //("mensaje a publicar=" + shift_messageConsg);
                                    if(shift_messageConsg==undefined || shift_messageConsg==undefined) {
                                        shift_messageConsg="...";
                                    }                                       
                                    positionConsg=result.rows[0].idpos;
                                    //("posicion=" + positionConsg); 
                                    sendMux(consign_mux);
                                }      
                            });
                            Tablenumberconsign=0;
                        }    
                    break;        
                    default:
                        // code
                }
                client.query("SELECT confirmacion,mensajeconsignacion,idpos FROM consignaciones where idpos=2;", function(err,result){
                    done();
                    if(err){
                        return console.error('8error de consignaciones', err);
                    }else{
                    }      
                });                
            }   
        });
    }    
}


var turnEnablesReading,numeroventa;
var valuediscriminatedBbb1,valuediscriminatedBbb2,endvaluesaldL1,endvaluesaldL2,idultimaventa,idultimaventaPass2L1,idultimaventaPass2L2,vendedorserial,vendedorcontrasena;
var readcalibrationL1,readcalibrationL2;
var ocupaconsultaDATABASEFPL1,ocupaconsultaDATABASEFPL2;
var salevalueFPL1Comb,salevalueFPL1Can,salevalueFPL1Mixcomb,salevalueFPL1Mixcan,salevalueFPL2Comb,salevalueFPL2Can,salevalueFPL2Mixcomb,salevalueFPL2Mixcan;
var SALEVALUEFPL1,SALEVALUEFPL2;

var readTables = function (error){

    if (error){
        //(error);
    }else{
        pg.connect(conString, function(err, client, done){
            if(err){
                return console.error('1Error de readtables', err);
            }else{
                switch (TableNumber) {
                    case initialSettings_table:
                        //("*******Configuraciones Iniciales*******");
                        client.query("SELECT numeromangueras,formatodinero,formatovolumen,ppux10,numerodigitos FROM mapeodispensador;", function(err,result){
                            done();
                            if(err){
                                return console.error('2error de mapeodispensador', err);
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
                                return console.error('3error de moneda', err);
                            }else{
                                unidadmoneda=result.rows[0].unidadmoneda;
                                //("unidadmoneda=" +  unidadmoneda);
                            }      
                        });      
                        client.query("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen = '25'", function(err,result){
                            done();
                            if(err){
                                return console.error('4error de configuraciondispensador', err);
                            }else{
                                valor1=result.rows[0].valor;
                                //("valorP1=" + valor1);
                            }      
                        });     
                        client.query("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen = '26'", function(err,result){
                            done();
                            if(err){
                                return console.error('5error de configuraciondispensador', err);
                            }else{
                                valor2=result.rows[0].valor;
                                //("valorP2=" + valor2);
                            }      
                        }); 
                        client.query("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen = '27'", function(err,result){
                            done();
                            if(err){
                                return console.error('6error de configuraciondispensador', err);
                            }else{
                                valor3=result.rows[0].valor;
                                //("valorP3=" + valor3);
                            }      
                        });                 
                        client.query("SELECT valor FROM configuraciondispensador WHERE pk_idconfiguraciondispen = '24'", function(err,result){
                            done();
                            if(err){
                                return console.error('7error de configuraciondispensador', err);
                            }else{
                                simboloVOL=result.rows[0].valor;
                                //("simboloVOL=" + simboloVOL);
                            }      
                        });
                        client.query("SELECT impresora FROM mapeodispensador WHERE pk_idposicion = '1'", function(err,result){
                            done();
                            if(err){
                                return console.error('8error de mapeodispensador', err);
                            }else{
                                frame_1.printer1=result.rows[0].impresora;
                                frame_2.printer1=frame_1.printer1;
                                //("impresora 1 estado=" + frame_1.printer1);
                            }      
                        });  
                        client.query("SELECT impresora FROM mapeodispensador WHERE pk_idposicion = '2'", function(err,result){
                            done();
                            if(err){
                                return console.error('9error de mapeodispensador', err);
                            }else{
                                frame_1.printer2=result.rows[0].impresora;
                                frame_2.printer2=frame_1.printer2;
                                //("impresora 2 estado=" + frame_1.printer2);
                                sendMux(initialSettings_mux);
                            }      
                        });                        
                    break;
                    case authorizedPpu_table:
                        //("*******Ppu autorizados*******");                        
                        client.query("SELECT nsx1,nsx2,nsx3 FROM precios WHERE id_pos=1;", function(err,result){
                            done();
                            if(err){
                                return console.error('10error de precios', err);
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
                                return console.error('11error de precios', err);
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
                    break; 
                    case turn_table:
                        //("*******Turno leido del NSX controller*******");                        
                        client.query("SELECT turnonsx FROM turno ;", function(err,result){
                            done();
                            if(err){
                                return console.error('12error de turno', err);
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
                    break;
                    case button_Names_table:                                                      
                        var nextbutton,contador=0;
                        for(nextbutton=1;nextbutton<=114;nextbutton++){//113
                            client.query(sprintf("SELECT textoboton FROM botones WHERE id_boton = '%1$s'",nextbutton), function(err,result){                       
                                done();
                                if(err){
                                    return console.error('13error de botones', err);
                                }else{
                                    buttons[contador]=result.rows[0].textoboton;
                                    contador=contador+1;
                                }      
                            });
                        }
                        if(buttons[113]!=undefined){
                            for(x=0;x<=113;x++){
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
                            for(x=0;x<=113;x++){
                                //("Boton:" + buttons[x]);        
                            }    
                            sendMux(initialbuttons_mux);                
                        }  
                    break;
                    case turnopenclose_table:
                        //("*******BGB2 habilita lectura de la tabla turno*******");
                        client.query("SELECT habilitalecturaturno FROM turno;", function(err,result){
                            done();
                            if(err){
                                return console.error('14error de turno', err);
                            }else{
                                turnEnablesReading =result.rows[0].habilitalecturaturno;
                                if(turnEnablesReading==undefined || turnEnablesReading==null) {
                                    //("(llenar por favor la tabla de turno con item en habilitalecturaturno)");
                                }  
                                else {
                                    //("BGB2 habilita lectura de turno=" + turnEnablesReading);
                                }                                    
                            }      
                        });                                
                        if(turnEnablesReading==1){
                            client.query("SELECT mensajeturno,turno FROM turno;", function(err,result){
                                done();
                                if(err){
                                    return console.error('15error de turno', err);
                                }else{
                                    //("*******Aceptado o rechazado apertura de turno*******");                                    
                                    turnCloseOpen=result.rows[0].turno;
                                    //("aceptado o rechazado=" +  turnCloseOpen);                                    
                                    shift_message=result.rows[0].mensajeturno;                                 
                                    //("mensaje a publicar=" +  shift_message);
                                }      
                            });
                            client.query(sprintf("UPDATE turno SET habilitalecturaturno='%1$s' " ,0 ), function(err,result){//era 1 hasta el 04/08/2016
                                done();
                                if(err){
                                    return console.error('16error de turno', err);                            
                                }else{
                                    turnEnablesReading=0;								
                                    sendMux(turnopenclose_mux);                                                                                                         
                                } 
                            });
                        }
                    break;
                    case turn_tablensx:
                        //("*******Turno leido del NSX controller*******");                        
                        client.query("SELECT turnonsx FROM turno ;", function(err,result){
                            done();
                            if(err){
                                return console.error('17error de turno', err);
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
                                if(L1_request>0 && L1_request!=undefined){                                 
                                    if(frame_1.openclose_turn=='0'){
                                        if(turnCloseOpen=='0'){
                                            if(turnMux=='0'){
                                                turnMux='0';
                                                L1_request=1;                                          
                                                //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux); 
                                                sendMux(turnnsxbbbmux_mux);                                                  
                                            }
                                            if(turnMux=='1'){
                                                TableNumber=not_readtable;
                                                L1_request=0;
                                                //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                                
                                            }  
                                        }
                                        if(turnCloseOpen=='1'){
                                            if(turnMux=='0'){
                                                turnMux='0';
                                                L1_request=1;                                          
                                                //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);   
                                                sendMux(turnnsxbbbmux_mux);                                                
                                            }
                                            if(turnMux=='1'){
                                                TableNumber=not_readtable;
                                                L1_request=0;                                        
                                                //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                                  
                                            }                                            
                                        }                                        
                                    }                              
                                    if(frame_1.openclose_turn=='1'){
                                        if(turnCloseOpen=='0'){
                                            if(turnMux=='0'){
                                                TableNumber=not_readtable;
                                                L1_request=0;                                        
                                                //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                                
                                            }
                                            if(turnMux=='1'){
                                                turnMux='1';
                                                L1_request=1;                                          
                                                //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                                sendMux(turnnsxbbbmux_mux);                                              
                                            }  
                                        }
                                        if(turnCloseOpen=='1'){
                                            if(turnMux=='0'){
                                                turnMux='0';
                                                L1_request=1;                                          
                                                //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                                sendMux(turnnsxbbbmux_mux);                                                     
                                            }
                                            if(turnMux=='1'){
                                                TableNumber=not_readtable;
                                                //("wili"+frame_1.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                                L1_request=0;                                                      
                                            }                                            
                                        }                                           
                                    }                                    
                                }
                                if(L2_request>0 && L2_request!=undefined){                                  
                                    if(frame_2.openclose_turn=='0'){
                                        if(turnCloseOpen=='0'){
                                            if(turnMux=='0'){
                                                turnMux='0';
                                                L2_request=1;                                         
                                                //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                                sendMux(turnnsxbbbmux_mux);                                                   
                                            }
                                            if(turnMux=='1'){
                                                TableNumber=not_readtable;
                                                L2_request=0;                                        
                                                //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                                 
                                            }  
                                        }
                                        if(turnCloseOpen=='1'){
                                            if(turnMux=='0'){
                                                turnMux='0';
                                                L2_request=1;                                        
                                                //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                                sendMux(turnnsxbbbmux_mux);                                                     
                                            }
                                            if(turnMux=='1'){
                                                TableNumber=not_readtable;
                                                L2_request=0;                                        
                                                //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                                
                                            }                                            
                                        }                                        
                                    }                                 
                                    if(frame_2.openclose_turn=='1'){
                                        if(turnCloseOpen=='0'){
                                            if(turnMux=='0'){
                                                TableNumber=not_readtable;
                                                L2_request=0;                                        
                                                //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                                
                                            }
                                            if(turnMux=='1'){
                                                turnMux='1';
                                                L2_request=1;                                        
                                                //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                                sendMux(turnnsxbbbmux_mux);                                              
                                            }  
                                        }
                                        if(turnCloseOpen=='1'){
                                            if(turnMux=='0'){
                                                turnMux='0';
                                                L2_request=1;                                        
                                                //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                        
                                                sendMux(turnnsxbbbmux_mux);                                                         
                                            }
                                            if(turnMux=='1'){
                                                TableNumber=not_readtable;
                                                L2_request=0;
                                                //("wili"+frame_2.openclose_turn+"diego"+turnCloseOpen+"leo"+turnMux);                                                   
                                            }                                            
                                        }                                           
                                    }    
                                }                                
                            }      
                        });
                    break;
                    case sellerData:
                        client.query("SELECT usuario,passwd FROM turno);", function(err,result){
                        done();
                        if(err){
                            return console.error('18error de turno', err);
                        }else{
                            //("*******Datos del vendedor, serial y contrase񡪪*****");                                
                            vendedorserial=result.rows[0].usuario;
                            //("vendedor serial=" + vendedorserial);
                            vendedorcontrasena=result.rows[0].passwd;
                            //("vendedor contrase񡽢 + vendedorcontrasena);
                            sendMux(datosvendedor_mux);                            
                        }      
                        });                         
                    break;    
                    case responseto_requestpayment_tableL1:
                        switch (frame_1.consultation_sale){
                            case '1':
                                client.query("SELECT valortotal,pk_idventa FROM venta  where pk_idventa = (select max(pk_idventa) FROM venta where idposicion=1);", function(err,result){
                                done();
                                if(err){
                                    return console.error('19error de venta', err);
                                }else{
                                    //("*******Respuesta a peticion NРventa a discriminar en forma de pagoL1*******");                                
                                    idultimaventaPass2L1=result.rows[0].pk_idventa;
                                    //("Id ultimaventa=" + idultimaventaPass2L1);
                                    positionFP='1';
                                    //("Pos QUEMADA=" +  positionFP);                                
                                    validationFP='1';
                                    //("validacion QUEMADA=" +  validationFP);
                                    salevalueFPL1Comb=result.rows[0].valortotal;
                                    salevalueFP1=salevalueFPL1Comb;
                                    //("valorventa=" +  salevalueFP1);   
                                    activekeyboardFP='1';
                                    //("activa teclado QUEMADA=" +  activekeyboardFP);                                  
                                    client.query(sprintf("SELECT SUM (CAST(valordiscriminado AS INT)) FROM historicoformapago WHERE numeroventa= '%1$s' AND id_pos = 1;",idultimaventaPass2L1),function(err,result){
                                        done();
                                        if(err){
                                            return console.error('20error de historicoformapago', err);
                                        }else{
                                            //("*******Historico de forma de pago ventaL1*******");                                
                                            valuediscriminatedBbb1=result.rows[0].sum;
                                            if(valuediscriminatedBbb1==undefined || valuediscriminatedBbb1==null) {
                                                valuediscriminatedBbb1="0"; 
                                            }                                            
                                            //("valor discriminado retornado por tabla historico=" + valuediscriminatedBbb1);
                                            salevalueFP1=parseInt(salevalueFP1,10);
                                            valuediscriminatedBbb1=parseInt(valuediscriminatedBbb1,10);
                                            endvaluesaldL1 = salevalueFP1 - valuediscriminatedBbb1;
                                            //("valor real;"+salevalueFP1);
                                            //("valor discriminado de historico;"+valuediscriminatedBbb1);
                                            //("resultado a mux;"+endvaluesaldL1);
                                            SALEVALUEFPL1=endvaluesaldL1;
                                            ocupaconsultaDATABASEFPL1=0;                                                  
                                            sendMux(responseto_requestpayment_mux);           
                                        }
                                    });
                                }      
                                });
                            break;
                            case '2':
                                client.query("SELECT dineroventa,idventacanasta FROM historicoventacanasta where idventacanasta = (select max(idventacanasta) FROM historicoventacanasta where idposicionc=1);", function(err,result){
                                done();
                                if(err){
                                    return console.error('21error de historicoventacanasta', err);
                                }else{
                                    //("*******Respuesta a peticion NРventa a discriminar en forma de pago canasta*******");                                
                                    idultimaventa=result.rows[0].idventacanasta;
                                    if(idultimaventa==undefined || idultimaventa==null) {
                                        //("llenar con valor la tabla de historicoventacanasta para columna idventacansta");
                                        idultimaventa='0';
                                    }                                         
                                    idultimaventaPass2L1=idultimaventa;
                                    //("Id ultimaventa=" + idultimaventaPass2L1);
                                    positionFP='1';
                                    //("Pos QUEMADA=" +  positionFP);                                
                                    validationFP='1';
                                    //("validacion QUEMADA=" +  validationFP);
                                    salevalueFPL1Can=result.rows[0].dineroventa;
                                    salevalueFP=salevalueFPL1Can;
                                    //("valorventa=" +  salevalueFP);   
                                    activekeyboardFP='1';
                                    //("activa teclado QUEMADA=" +  activekeyboardFP);                                  
                                    client.query(sprintf("SELECT SUM (CAST(valordiscriminado AS INT)) FROM historicoformapago WHERE numeroventa= '%1$s' ",idultimaventaPass2L1),function(err,result){
                                        done();
                                        if(err){
                                            return console.error('22error de historicoformapago', err);
                                        }else{
                                            //("*******Historico de forma de pago ventacanastaL1*******");                                
                                            valuediscriminatedBbb2=result.rows[0].sum;
                                            if(valuediscriminatedBbb2==undefined || valuediscriminatedBbb2==null) {
                                                valuediscriminatedBbb2="0"; 
                                            }                                            
                                            //("valor discriminado retornado por tabla historico=" + valuediscriminatedBbb2);
                                            salevalueFP=parseInt(salevalueFP,10);
                                            valuediscriminatedBbb2=parseInt(valuediscriminatedBbb2,10);
                                            endvaluesaldL1 = salevalueFP - valuediscriminatedBbb2;
                                            //("valor real;"+salevalueFP);
                                            //("valor discriminado de historico;"+valuediscriminatedBbb2);
                                            //("resultado a mux;"+endvaluesaldL1);
                                            SALEVALUEFPL1=endvaluesaldL1;
                                            ocupaconsultaDATABASEFPL1=0;                                              
                                            sendMux(responseto_requestpayment_mux);           
                                        }
                                    });
                                }      
                                });                                
                            break;
                            case '3':
                                salevalueFPL1Mixcomb=0;
                                salevalueFPL1Mixcan=0;
                                client.query("SELECT valortotal,pk_idventa FROM venta  where pk_idventa = (select max(pk_idventa) FROM venta where idposicion=1);", function(err,result){
                                done();
                                if(err){
                                    return console.error('23error de venta', err);
                                }else{
                                    //("*******Respuesta a peticion NРventa a discriminar en forma de pago*******");                                
                                    idultimaventa=result.rows[0].pk_idventa;
                                    idultimaventaPass2L1=idultimaventa;
                                    //("Id ultimaventa combustible=" + idultimaventaPass2L1);
                                    salevalueFPL1Mixcomb=result.rows[0].valortotal;
                                    Mixtatotaldin=salevalueFPL1Mixcomb;
                                    //("valorventa combustible=" +  Mixtatotaldin);   
                                }      
                                });     
                                client.query("SELECT dineroventa,idventacanasta FROM historicoventacanasta where idventacanasta = (select max(idventacanasta) FROM historicoventacanasta where idposicionc=1);", function(err,result){
                                done();
                                if(err){
                                    return console.error('24error de historicoventacanasta', err);
                                }else{
                                    //("*******Respuesta a peticion NРventa a discriminar en forma de pago canasta*******");                                
                                    idultimaventa=result.rows[0].idventacanasta;
                                    if(idultimaventa==undefined || idultimaventa==null) {
                                        //("llenar con valor la tabla de historicoventacanasta para columna idventacansta");
                                        idultimaventa='0'; 
                                    }                                        
                                    idultimaventaPass2L1=idultimaventa;
                                    //("Id ultimaventa canasta=" + idultimaventaPass2L1);
                                    salevalueFPL1Mixcan=result.rows[0].dineroventa;
                                    Mixtatotalcan=salevalueFPL1Mixcan;
                                    //("valorventa canasta=" +  Mixtatotalcan);                                     
                                    salevalueFP=parseInt(Mixtatotaldin,10)+parseInt(Mixtatotalcan,10);
                                    //("TOTAL DE COMBUSTIBLE Y CANASTA="+salevalueFP);
                                    positionFP='1';
                                    //("Pos QUEMADA=" +  positionFP);                                 
                                    validationFP='1';
                                    //("validacion QUEMADA=" +  validationFP);
                                    activekeyboardFP='1';
                                    //("activa teclado QUEMADA=" +  activekeyboardFP);  
                                    var tipoformadepago     = frame_1.type_of_payment;
                                    var valorventa          = salevalueFP;
                                    var valordiscriminado   = valorventa;
                                    var ventaconsulta       = frame_1.consultation_sale;
                                    //("valordiscriminado:"+valordiscriminado);
                                    //("numeroventa:"+numeroventa);                        
                                    client.query(sprintf("INSERT INTO formadepago (tipoformadepago,valorventa,valordiscriminado,ventaconsulta,id_pos) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",tipoformadepago,valorventa,valordiscriminado,ventaconsulta,1),function(err,result){                        
                                        done();
                                        if(err){
                                            return console.error('25Error de formadepago', err);
                                        }else{
                                        }
                                    });    
                                    client.query("UPDATE estado SET fp1=1", function(err,result){
                                        done();
                                        if(err){
                                            return console.error('26error de estado', err);                            
                                        }else{                                                   
                                        } 
                                    });       
                                    ocupaconsultaDATABASEFPL1=0;                                      
                                    sendMux(responseto_requestpayment_mux);                                     
                                }      
                                }); 
                            break;    
                            default:
                        }
                    break;
                    case responseto_requestpayment_tableL2:
                        switch(frame_2.consultation_sale){
                            case '1':
                                client.query("SELECT valortotal,pk_idventa FROM venta where pk_idventa = (select max(pk_idventa) FROM venta where idposicion=2);", function(err,result){
                                done();
                                if(err){
                                    return console.error('27error de venta', err);
                                }else{
                                    //("*******Respuesta a peticion NРventa a discriminar en forma de pagoL2*******");                                
                                    idultimaventa=result.rows[0].pk_idventa;
                                    idultimaventaPass2L2=idultimaventa;
                                    //("Id ultimaventa=" + idultimaventaPass2L2);
                                    positionFP='2';
                                    //("Pos QUEMADA=" +  positionFP);                                
                                    validationFP='1';
                                    //("validacion QUEMADA=" +  validationFP);
                                    salevalueFPL2Comb=result.rows[0].valortotal;
                                    salevalueFP=salevalueFPL2Comb;
                                    //("valorventa=" +  salevalueFPL2Comb);   
                                    activekeyboardFP='1';
                                    //("activa teclado QUEMADA=" +  activekeyboardFP);                                                         
                                    client.query(sprintf("SELECT SUM (CAST(valordiscriminado AS INT)) FROM historicoformapago WHERE numeroventa= '%1$s' AND id_pos = 2; ",idultimaventaPass2L2),function(err,result){
                                        done();
                                        if(err){
                                            return console.error('28error de historicoformapago', err);
                                        }else{
                                            //("*******Historico de forma de pago ventaL2*******");                                
                                            valuediscriminatedBbb2=result.rows[0].sum;
                                            if(valuediscriminatedBbb2==undefined || valuediscriminatedBbb2==null) {
                                                valuediscriminatedBbb2="0"; 
                                            }                                             
                                            //("valor discriminado retornado por tabla historico=" + valuediscriminatedBbb2);
                                            salevalueFP=parseInt(salevalueFP,10);
                                            valuediscriminatedBbb2=parseInt(valuediscriminatedBbb2,10);
                                            endvaluesaldL2 = salevalueFP - valuediscriminatedBbb2;
                                            //("valor real;"+salevalueFP);
                                            //("valor discriminado de historico;"+valuediscriminatedBbb2);
                                            //("resultado a mux;"+endvaluesaldL2);
                                            SALEVALUEFPL2=endvaluesaldL2;
                                            ocupaconsultaDATABASEFPL2=0;                                                  
                                            sendMux(responseto_requestpayment_mux);           
                                        }
                                    });
                                }      
                                });   
                            break;    
                            case '2':
                                client.query("SELECT dineroventa,idventacanasta FROM historicoventacanasta where idventacanasta = (select max(idventacanasta) FROM historicoventacanasta where idposicionc=2);", function(err,result){
                                done();                                
                                if(err){
                                    return console.error('29error de historicoventacanasta', err);
                                }else{
                                    //("*******Respuesta a peticion NРventa a discriminar en forma de pagoL2*******");                                
                                    idultimaventa=result.rows[0].idventacanasta;
                                    if(idultimaventa==undefined || idultimaventa==null) {
                                        //("llenar con valor la tabla de historicoventacanasta para columna idventacansta");
                                        idultimaventa='0';
                                    }                                      
                                    idultimaventaPass2L2=idultimaventa;
                                    //("Id ultimaventa=" + idultimaventaPass2L2);
                                    positionFP='2';
                                    //("Pos QUEMADA=" +  positionFP);                                
                                    validationFP='1';
                                    //("validacion QUEMADA=" +  validationFP);
                                    salevalueFPL2Can=result.rows[0].dineroventa;
                                    salevalueFP=salevalueFPL2Can;
                                    //("valorventa=" +  salevalueFPL2Can);   
                                    activekeyboardFP='1';
                                    //("activa teclado QUEMADA=" +  activekeyboardFP);                                  
                                    client.query(sprintf("SELECT SUM (CAST(valordiscriminado AS INT)) FROM historicoformapago WHERE numeroventa= '%1$s' ",idultimaventaPass2L1),function(err,result){
                                        if(err){
                                            return console.error('30error de historicoformapago', err);
                                        }else{
                                            //("*******Historico de forma de pago ventaL2*******");                                
                                            valuediscriminatedBbb2=result.rows[0].sum;
                                            if(valuediscriminatedBbb2==undefined || valuediscriminatedBbb2==null) {
                                                valuediscriminatedBbb2="0";
                                            }                                               
                                            //("valor discriminado retornado por tabla historico=" + valuediscriminatedBbb2);
                                            salevalueFP=parseInt(salevalueFP,10);
                                            valuediscriminatedBbb2=parseInt(valuediscriminatedBbb2,10);
                                            endvaluesaldL2 = salevalueFP - valuediscriminatedBbb2;
                                            //("valor real;"+salevalueFP);
                                            //("valor discriminado de historico;"+valuediscriminatedBbb2);
                                            //("resultado a mux;"+endvaluesaldL2);
                                            SALEVALUEFPL2=endvaluesaldL2;
                                            ocupaconsultaDATABASEFPL2=0;                                              
                                            sendMux(responseto_requestpayment_mux);           
                                    }
                                    });
                                }      
                                });                                
                            break;
                            case '3':
                                salevalueFPL2Mixcomb=0;
                                salevalueFPL2Mixcan=0;
                                client.query("SELECT valortotal,pk_idventa FROM venta where pk_idventa = (select max(pk_idventa) FROM venta where idposicion=2);", function(err,result){
                                done();
                                if(err){
                                    return console.error('31error de venta', err);
                                }else{
                                    //("*******Respuesta a peticion NРventa a discriminar en forma de pago*******");                                
                                    idultimaventa=result.rows[0].pk_idventa;
                                    idultimaventaPass2L2=idultimaventa;
                                    //("Id ultimaventa combustible=" + idultimaventaPass2L2);
                                    salevalueFPL2Mixcomb=result.rows[0].valortotal;
                                    Mixtatotaldin2=salevalueFPL2Mixcomb;
                                    //("valorventa combustible=" +  Mixtatotaldin2);   
                                }      
                                });     
                                client.query("SELECT dineroventa,idventacanasta FROM historicoventacanasta where idventacanasta = (select max(idventacanasta) FROM historicoventacanasta where idposicionc=2);", function(err,result){
                                done();   
                                if(err){
                                    return console.error('32error de historicoventacanasta', err);
                                }else{
                                    //("*******Respuesta a peticion NРventa a discriminar en forma de pago canasta*******");                                
                                    idultimaventa=result.rows[0].idventacanasta;
                                    if(idultimaventa==undefined || idultimaventa==null) {
                                        //("llenar con valor la tabla de historicoventacanasta para columna idventacansta");
                                        idultimaventa='0';
                                    }                                    
                                    idultimaventaPass2L2=idultimaventa;
                                    //("Id ultimaventa canasta=" + idultimaventaPass2L2);
                                    salevalueFPL2Mixcan=result.rows[0].dineroventa;
                                    Mixtatotalcan2=salevalueFPL2Mixcan;
                                    //("valorventa canasta=" +  Mixtatotalcan2);                                   
                                    salevalueFP=parseInt(Mixtatotaldin2,10)+parseInt(Mixtatotalcan2,10);
                                    //("TOTAL DE COMBUSTIBLE Y CANASTA="+salevalueFP);
                                    positionFP='1';
                                    //("Pos QUEMADA=" +  positionFP);                                 
                                    validationFP='1';
                                    //("validacion QUEMADA=" +  validationFP);
                                    activekeyboardFP='1';
                                    //("activa teclado QUEMADA=" +  activekeyboardFP);  
                                    var tipoformadepago     = frame_2.type_of_payment;
                                    var valorventa          = salevalueFP;
                                    var valordiscriminado   = valorventa;
                                    var ventaconsulta       = frame_2.consultation_sale;
                                    //("valordiscriminado:"+valordiscriminado);
                                    //("numeroventa:"+numeroventa);                        
                                    client.query(sprintf("INSERT INTO formadepago (tipoformadepago,valorventa,valordiscriminado,ventaconsulta,id_pos) VALUES ('%1$s','%2$s','%3$s','%4$s','%5$s')",tipoformadepago,valorventa,valordiscriminado,ventaconsulta,2),function(err,result){                        
                                        done();
                                        if(err){
                                            return console.error('33Error de formadepago', err);
                                        }else{
                                        }
                                    });    
                                    client.query("UPDATE estado SET fp2=1", function(err,result){
                                        done();
                                        if(err){
                                            return console.error('34error estado', err);                            
                                        }else{                              
                                        } 
                                    });                                     
                                    sendMux(responseto_requestpayment_mux);  
                                    ocupaconsultaDATABASEFPL2=0;                                      
                                }      
                                }); 
                            break;                             
                            default:
                        }
                    break;
                    case basket_tableL1:
                        if(basketEnablesReadingL1!=1){ 
                            client.query("SELECT lecturacanasta FROM venta_canasta where idposicionc=1 AND id_canasta = (select max(id_canasta) from venta_canasta);", function(err,result){
                                done();
                                if(err){
                                    return console.error('35error de venta_canasta', err);
                                }else{
                                    //("*******BGB2 habilita lectura de canasta *******");                        
                                    if(isNaN(result.rows[0].lecturacanasta)==true){
                                        basketEnablesReadingL1='0';
                                        //("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");                                             
                                    }else{
                                        basketEnablesReadingL1 =result.rows[0].lecturacanasta;
                                        //("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"+basketEnablesReadingL1);                                         
                                    }
                                    if(basketEnablesReadingL1==undefined || basketEnablesReadingL1==null) {
                                        //("(llenar por favor la tabla de venta_canasta con item en leturacanasta)");
                                    }
                                    else {
                                        //("habilita lectura de canasta"+basketEnablesReadingL1);
                                    }                                      
                                    if(basketEnablesReadingL1==1){
                                        //("*******Identificacion de Canasta respuestaNSXL1*******");
                                        client.query("SELECT validacioncanasta,nombre,valor,cantidad FROM venta_canasta where idposicionc=1 AND id_canasta= (select max(id_canasta) from venta_canasta);", function(err,result){
                                        done();
                                        if(err){
                                            return console.error('36error de venta_canasta', err);
                                        }else{
                                            validationBasket=result.rows[0].validacioncanasta;
                                            if(validationBasket==undefined || validationBasket==null) {
                                                validationBasket='0';
                                            }                                            
                                            //("validacion=" + validationBasket);
                                            validationBasket='1';
                                            //("validacionQUEMADO=" + validationBasket);                                    
                                            nameBasket=result.rows[0].nombre;
                                            if(nameBasket==undefined || nameBasket==null) {
                                                nameBasket="sin nombre";
                                            }                                                 
                                            //("nombre del producto=" + nameBasket);
                                            valueBasket=result.rows[0].valor;
                                            if(valueBasket==undefined || valueBasket==null) {
                                                valueBasket='0';
                                            }                                              
                                            //("valor unitario=" + valueBasket);
                                            quantityBasket=result.rows[0].cantidad;
                                            if(quantityBasket==undefined || quantityBasket==null) {
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
                    break;
                    case basket_tableL2:
                        if(basketEnablesReadingL2!=1){
                            client.query("SELECT lecturacanasta FROM venta_canasta where idposicionc=2 AND id_canasta= (select max(id_canasta) from venta_canasta);", function(err,result){
                                done();
                                if(err){
                                    return console.error('37error de venta_canasta', err);
                                }else{
                                    //("*******BGB2 habilita lectura de canasta *******");                        
                                    if(isNaN(result.rows[0].lecturacanasta)==true){
                                        basketEnablesReadingL2='0';
                                        //("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");                                             
                                    }else{
                                        basketEnablesReadingL2 =result.rows[0].lecturacanasta;
                                        //("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"+basketEnablesReadingL2);                                         
                                    }                                   
                                    if(basketEnablesReadingL2==undefined || basketEnablesReadingL2==null) {
                                        //("(llenar por favor la tabla de venta_canasta con item en leturacanasta)");
                                    }
                                    else {
                                        //("habilita lectura de canasta"+basketEnablesReadingL2);
                                    }                                     
                                    if(basketEnablesReadingL2==1){
                                        //("*******Identificacion de Canasta respuestaNSXL2*******");
                                        client.query("SELECT validacioncanasta,nombre,valor,cantidad FROM venta_canasta where idposicionc=2 AND id_canasta= (select max(id_canasta) from venta_canasta);", function(err,result){
                                        done();
                                        if(err){
                                            return console.error('38error de venta_canasta', err);
                                        }else{
                                            validationBasket=result.rows[0].validacioncanasta;
                                            if(validationBasket==undefined || validationBasket==null) {
                                                validationBasket='0';
                                            }                                             
                                            //("validacion=" + validationBasket);
                                            validationBasket='1';
                                            //("validacionQUEMADO=" + validationBasket);
                                            nameBasket=result.rows[0].nombre;
                                            if(nameBasket==undefined || nameBasket==null) {
                                                nameBasket="sin nombre";
                                            }                                              
                                            //("nombre del producto=" + nameBasket);
                                            valueBasket=result.rows[0].valor;
                                            if(valueBasket==undefined || valueBasket==null) {
                                                valueBasket='0';
                                            }                                              
                                            //("valor unitario=" + valueBasket);
                                            quantityBasket=result.rows[0].cantidad;
                                            if(quantityBasket==undefined || quantityBasket==null) {
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
                    break;        
                    case discriminateSale_tableL1:
                        client.query("UPDATE estado SET fp1=1", function(err,result){//era 1 hasta el 04/08/2016
                            done();
                            if(err){
                                return console.error('39error de estado', err);                            
                            }else{
                                TableNumber=not_readtable;                                
                                sendMux(accepetFP_mux);                                                       
                            } 
                        });
                    break;
                    case discriminateSale_tableL2:
                        client.query("UPDATE estado SET fp2=1", function(err,result){//era 1 hasta el 04/08/2016
                            done();
                            if(err){
                                return console.error('40error de estado', err);                            
                            }else{
                                TableNumber=not_readtable;                                      
                                sendMux( accepetFP_mux);                                
                            } 
                        });                         
                    break;
                    case calibration_tableL1:
                        //("*******Calibracion respuestaNSXL1*******");
                        client.query("SELECT lecturacalibracion FROM mensajes where id_mensaje=1;", function(err,result){
                            done();
                            if(err){
                                return console.error('41error de mensajes', err);
                            }else{
                                readcalibrationL1=result.rows[0].lecturacalibracion;                                
                                if(readcalibrationL1==undefined || readcalibrationL1==null) {
                                    readcalibrationL1="0";
                                }                                      
                                //("Permiso de leer tablas de calibracion=" + readcalibrationL1);                                
                            }      
                        });                           
                        if(readcalibrationL1=='1'){
                            client.query("SELECT calibracion FROM preset where id_pos=1;", function(err,result){
                                done();
                                if(err){
                                    return console.error('42error de preset', err);
                                }else{
                                    //("*******BGB2 habilita calibracion *******");                        
                                    validationCalibration =result.rows[0].calibracion;
                                    if(validationCalibration==undefined || validationCalibration==null) {
                                        //("(llenar por favor la tabla de preset con item en leturacupocredito)");
                                    }
                                    else {
                                        //("habilitan calibracion:"+validationCalibration);
                                    }                                      
                                }      
                            });          
                            client.query("SELECT mensaje FROM mensajes where id_mensaje=1;", function(err,result){
                                done();
                                if(err){
                                    return console.error('43error de mensajes', err);
                                }else{
                                    shift_message=result.rows[0].mensaje;                                
                                    if(shift_message==undefined || shift_message==null) {
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
                                        return console.error('44error de precios', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx1;
                                        //("ppu autorizado nsx1 de precios pos1=" + PPUauthorized);
                                        TableNumber=not_readtable;                                           
                                        sendMux( accepetcalibration_mux);                                     
                                    }      
                                    });                                            
                                break;
                                case '1':
                                    client.query("SELECT nsx1 FROM precios WHERE id_pos=1;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('45error de precios', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx1;
                                        //("ppu autorizado nsx1 de precios pos1=" + PPUauthorized);
                                        TableNumber=not_readtable;                                           
                                        sendMux( accepetcalibration_mux);                                       
                                    }      
                                    });                                            
                                break;
                                case '2':
                                    client.query("SELECT nsx2 FROM precios WHERE id_pos=1;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('46error de precios', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx2;
                                        //("ppu autorizado nsx2 de precios pos1=" + PPUauthorized);
                                        TableNumber=not_readtable;                                           
                                        sendMux( accepetcalibration_mux);                                            
                                    }      
                                    });                                        
                                break;
                                case '3':
                                    client.query("SELECT nsx3 FROM precios WHERE id_pos=1;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('47error de precios', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx3;
                                        //("ppu autorizado nsx3 de precios pos1=" + PPUauthorized);
                                        TableNumber=not_readtable;                                           
                                        sendMux( accepetcalibration_mux);                                                
                                    }      
                                    });                                            
                                break;                                    
                                default:
                            }                            
                        }
                    break;    
                    case calibration_tableL2:
                        //("*******Calibracion respuestaNSXL2*******");
                        client.query("SELECT lecturacalibracion FROM mensajes where id_mensaje=2;", function(err,result){
                            done();
                            if(err){
                                return console.error('48error de mensajes', err);
                            }else{
                                readcalibrationL2=result.rows[0].lecturacalibracion;                                
                                if(readcalibrationL2==undefined || readcalibrationL2==null) {
                                    readcalibrationL2="...";
                                }                                 
                                //("Permite leer tablas calibracion=" + readcalibrationL2);                                
                            }      
                        });                        
                        if(readcalibrationL2=='1'){
                            client.query("SELECT calibracion FROM preset where id_pos=2;", function(err,result){
                                done();
                                if(err){
                                    return console.error('49error de preset', err);
                                }else{
                                    //("*******BGB2 habilita calibracion *******");                        
                                    validationCalibration =result.rows[0].calibracion;
                                    if(validationCalibration==undefined || validationCalibration==null) {
                                        //("(llenar por favor la tabla de preset con item en leturacupocredito)");
                                    }
                                    else {
                                        //("habilitan calibracion:"+validationCalibration);
                                    }                                     
                                }      
                            });
                            client.query("SELECT mensaje FROM mensajes where id_mensaje=2;", function(err,result){
                                done();
                                if(err){
                                    return console.error('50error de mensajes', err);
                                }else{
                                    shift_message=result.rows[0].mensaje;                                
                                    if(shift_message==undefined || shift_message==null) {
                                        shift_message="...";
                                    }                                        
                                    //("mensaje a publicar=" +  shift_message);                                
                                }      
                            });                           
                            switch (frame_2.product_type){
                                case '0':
                                    client.query("SELECT nsx1 FROM precios WHERE id_pos=2;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('51error de precios', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx1;
                                        //("ppu autorizado nsx1 de precios pos2=" + PPUauthorized);
                                        TableNumber=not_readtable;                                           
                                        sendMux( accepetcalibration_mux);                                         
                                    }
                                    });                                        
                                break;
                                case '1':
                                    client.query("SELECT nsx1 FROM precios WHERE id_pos=2;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('52error de precios', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx1;
                                        //("ppu autorizado nsx1 de precios pos2=" + PPUauthorized);
                                        TableNumber=not_readtable;                                           
                                        sendMux( accepetcalibration_mux);                                         
                                    }
                                    });                                        
                                break;
                                case '2':
                                    client.query("SELECT nsx2 FROM precios WHERE id_pos=2;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('53error de precios', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx2;
                                        //("ppu autorizado nsx2 de precios pos2=" + PPUauthorized);
                                        TableNumber=not_readtable;                                           
                                        sendMux( accepetcalibration_mux);                                     
                                    }      
                                    });                                                 
                                break;
                                case '3':
                                    client.query("SELECT nsx3 FROM precios WHERE id_pos=2;", function(err,result){
                                    done();
                                    if(err){
                                        return console.error('54error de precios', err);
                                    }else{
                                        PPUauthorized=result.rows[0].nsx3;
                                        //("ppu autorizado nsx1 de precios pos2=" + PPUauthorized);
                                        TableNumber=not_readtable;                                           
                                        sendMux( accepetcalibration_mux);                                         
                                    }      
                                    });                                        
                                break;                                    
                                default:
                            }                            
                        }
                    break;        
                    default:
                }
                client.query("SELECT nsx3 FROM precios WHERE id_pos=2;", function(err,result){
                done();
                if(err){
                    return console.error('55error de precios', err);
                }else{
                }      
                });                                
            }   
        });
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


var entered_value,entered_value1;
var positionOne= new Buffer(1);
var positionTwo= new Buffer(1);
            
            
var sendMux =function(numeroEnvio){
    switch (numeroEnvio){
        case initialSettings_mux:                                                
            var f = new Date();                                               
            x=0;
            x = f.getMonth()+1;                   
            var month = String(x);
            if(month<=9){
                month= '0'+month;
            }else{
            }
            x=0;
            x = f.getDate();                    
            var day = String(x);
            if (day<=9){
                day='0'+day;
            }else{
            }
            x=0;
            x = f.getHours();                 
            var hours = String(x);
            if (hours<=9){
                hours='0'+hours;
            }else{
            }            
            x=0;
            x = f.getMinutes();            
            var minutes = String(x);
            if (minutes<=9){
                minutes='0'+minutes;
            }else{
            }                
            x=0;
            x = f.getSeconds();                 
            var seconds = String(x);
            if (seconds<=9){
                seconds='0'+seconds;
            }else{
            }                
            completePlot(entered_value=valor1);                              
            valor1=return_value;
            completePlot(entered_value=valor2);                                
            valor2=return_value;    
            completePlot(entered_value=valor3);                             
            valor3=return_value;      
            vehicle_screen="1";  
            paymentsale_screen='0';
            muxport.write("MUX"+positionOne+"H"+";"+ String(f.getFullYear())+month+day+hours+minutes+seconds+";"+String(numerodigitos)+";"+String(formatodinero)+";"+String(formatovolumen)+";"+String(ppux10)+";"+String(numeromangueras)+";"+String(unidadmoneda)+";"+String(simboloVOL)+";"+"192168110100"+";"+valor1+";"+valor2+";"+valor3+";"+vehicle_screen+";"+paymentsale_screen+";"+"&"+positionTwo+"N" + ";"+ "&" +"*");
            //("MUX"+"1"+"H"+";"+f.getFullYear()+month+day+hours+minutes+seconds+";"+parseInt(numerodigitos,10)+";"+parseInt(formatodinero,10)+";"+parseInt(formatovolumen,10)+";"+parseInt(ppux10,10)+";"+parseInt(numeromangueras,10)+";"+unidadmoneda+";"+parseInt(simboloVOL,10)+";"+"192168110100"+";"+valor1+";"+valor2+";"+valor3+";"+vehicle_screen+";"+paymentsale_screen+";"+"&"+"2N;&"+"*");            
            numeroEnvio='0';
        break;
        case authorizedPpu_mux:                                                 
            muxport.write("MUX"+positionOne+"I"+";"+String('0'+nsx1)+";"+String('0'+nsx2)+";"+String('0'+nsx3)+";"+String('000000')+ ";"+"&"+positionTwo+"I"+";"+String('0'+nsx1l2)+";"+String('0'+nsx2l2)+";"+String('0'+nsx3l2)+";"+String('000000')+";"+"&"+"*");
            //("MUX"+"1"+"I"+";"+"0"+nsx1+";"+"0"+nsx2+";"+"0"+nsx3+";"+"000000"+";"+"&"+"2"+"I"+";"+"0"+nsx1l2+";"+"0"+nsx2l2+";"+"0"+nsx3l2+";"+"000000"+";&"+"*");            
            numeroEnvio='0';            
        break;
        case totalRequest_mux:                                                  
            muxport.write("MUX"+positionOne+"G"+";"+turnMux+";"+"&"+positionTwo+"N;&"+"*");
            //("MUX"+"1"+"G"+";"+turnMux+";"+"&"+"2N;&"+"*"); 
            numeroEnvio='0';  
        break;
        case turnMux_Nsx:                                                     
            if(turn_table == true){                                            
                x='1';
            }else{
                x='0';
            }
            muxport.write("MUX"+positionOne+"F"+";"+x+ ";"+"aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff"+";"+"&"+positionTwo+"N;&"+"*");
            //("MUX"+"1"+"F"+";"+x+";"+"aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffff"+";"+"&"+"2N;&"+"*");            
            numeroEnvio='0';              
        break;
        case initialbuttons_mux:                                              
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
            /*("MUX"+"1"+"J"+";"+buttons[0]+";"+buttons[1]+";"+buttons[2]+";"+buttons[3]+";"+buttons[4]+";"+buttons[5]+
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
            buttons[109]+";"+buttons[110]+";"+buttons[111]+";"+buttons[112]+";"+buttons[113]+";"+"&"+"2N;&"+"*");*/             
            numeroEnvio='0'; 
            
            EndconfigurationInitial=1;
            TableNumber=0;
        break;
        case turnopenclose_mux:
            var resultado=60-shift_message.length; 
            var adding_spaces=" ";
            for(x=1;x<resultado;x++){
                adding_spaces=adding_spaces+" ";
            }
            shift_message=shift_message+adding_spaces;
            if(L1_request>0 && L1_request!=undefined){
                muxport.write("MUX"+positionOne+"F"+";"+turnCloseOpen+";"+shift_message+";"+"&"+positionTwo+"N;&"+"*");                
                //("MUX"+"1"+"F"+";"+turnCloseOpen+";"+shift_message+";"+"&"+"2N;&"+"*"); 
            }
            if(L2_request>0 && L2_request!=undefined){
                muxport.write("MUX"+positionOne+"N;&"+positionTwo+"F"+";"+turnCloseOpen+";"+shift_message+";"+"&"+"*");
                //("MUX"+"1N;&"+"2"+"F"+";"+turnCloseOpen+";"+shift_message+";"+"&"+"*"); 
            }
            TableNumber=turn_tablensx;          
            numeroEnvio='0';     
        break;  
        case turnnsxbbbmux_mux:
            if(L1_request>0 && L1_request!=undefined){
                muxport.write("MUX"+positionOne+"G"+";"+turnMux+";"+"&"+positionTwo+"N;&"+"*");
                //("MUX"+"1"+"G"+";"+turnMux+";"+"&"+"2N;&"+"*"); 
                numeroEnvio='0';  
            }
            if(L2_request>0 && L2_request!=undefined){
                muxport.write("MUX"+positionOne+"N;&"+positionTwo+"G"+";"+turnMux+";"+"&"+"*");
                //("MUX"+"1N;&"+"2"+"G"+";"+turnMux+";"+"&"+"*"); 
                numeroEnvio='0';                 
            }        
            TableNumber=sellerData;           
            numeroEnvio='0';  
        break;   
        case datosvendedor_mux:
            //("primer variable"+vendedorserial);
            //("segunda variable"+vendedorcontrasena);            
            var resultado=20-vendedorserial.length; 
            var adding_spaces=" ";
            for(x=1;x<resultado;x++){
                adding_spaces=adding_spaces+" ";
            }
            vendedorserial=vendedorserial+adding_spaces; 
            var resultado=4-vendedorcontrasena.length; 
            var adding_spaces=" ";
            for(x=1;x<resultado;x++){
                adding_spaces=adding_spaces+" ";
            }
            vendedorcontrasena=vendedorcontrasena+adding_spaces;             
            //("primer variable"+vendedorserial);
            //("segunda variable"+vendedorcontrasena);
            if(L1_request>0 && L1_request!=undefined){
                muxport.write("MUX"+positionOne+"O"+";"+"c"+";"+vendedorserial+";"+vendedorcontrasena+";"+"&"+positionTwo+"N;&"+"*");
                //("MUX"+"1"+"O"+";"+"c"+";"+vendedorserial+";"+vendedorcontrasena+";"+"&"+"2N;&"+"*"); 
                numeroEnvio='0';  
                L1_request=0;
            }
            if(L2_request>0 && L2_request!=undefined){
                muxport.write("MUX"+positionOne+"N;&"+positionTwo+"O"+";"+"c"+";"+vendedorserial+";"+vendedorcontrasena+";"+"&"+"*");
                //("MUX"+"1N;&"+"2"+"O"+";"+"c"+";"+vendedorserial+";"+vendedorcontrasena+";"+"&"+"*"); 
                numeroEnvio='0';                 
                L2_request=0;
            }              
            TableNumber=not_readtable; 
            numeroEnvio='0';             
        break;
        case creditbasket_mux:
            var resultado=60-shift_message.length; 
            var adding_spaces=" ";
            for(x=1;x<resultado;x++){
                adding_spaces=adding_spaces+" ";
            }
            shift_message=shift_message+adding_spaces;   
            var validation;
            if(authorizedMoney!=undefined && creditValidacion=='1'){
                validation='1';
            }else{
                validation='0';
            }
            if(creditValidacion=='0' || creditValidacion==null){
                authorizedMoney='0000000';
            }
            var result1 =parseInt(authorizedMoney,10);
            var result2 =parseInt(PPUauthorized,10);
            var result3=result1/result2;
            var authorizedVolume = result3.toFixed(2);            
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
            if(stateNSXvariableglobal==0){
                validationFP='0';                    
            }            
            if(L1_request>0 && L1_request!=undefined){
                //("valor de venta1"+SALEVALUEFPL1);                
                completePlot(entered_value=SALEVALUEFPL1);
                SALEVALUEFPL1=return_value;
                //("valor de venta"+SALEVALUEFPL1);
                activekeyboardFP='1';
                muxport.write("MUX"+positionOne+"A"+";"+validationFP+";"+SALEVALUEFPL1+";"+activekeyboardFP+";"+"&"+positionTwo+"N;&"+"*");                
                //("MUX"+"1"+"A"+";"+validationFP+";"+SALEVALUEFPL1+";"+activekeyboardFP+";"+"&"+"2N;&"+"*"); 
                L1_request=0;
            }
            if(L2_request>0 && L2_request!=undefined){
                completePlot(entered_value=SALEVALUEFPL2); 
                SALEVALUEFPL2=return_value;
                //("valor de venta"+SALEVALUEFPL2);                
                activekeyboardFP='1';                
                muxport.write("MUX"+positionOne+"N;&"+positionTwo+"A"+";"+validationFP+";"+SALEVALUEFPL2+";"+activekeyboardFP+";"+"&"+"*");
                //("MUX"+"1N;&"+"2"+"A"+";"+validationFP+";"+SALEVALUEFPL2+";"+activekeyboardFP+";"+"&"+"*"); 
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
            var resultado=60-shift_messageConsg.length; 
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
            var resultado=20-nameBasket.length; 
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
        case accepetcalibration_mux:
            validation=validationCalibration;
            //("validacioncalibracion"+validation);
            var resultado=60-shift_message.length; 
            var adding_spaces=" ";
            for(x=1;x<resultado;x++){
                adding_spaces=adding_spaces+" ";
            }
            shift_message=shift_message+adding_spaces;
            //("mensaje"+shift_message);
            authorizedMoney="0999000";
            var result1 =parseInt(authorizedMoney,10);
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
            TableNumber=not_readtable;             
            numeroEnvio='0';            
        break;
        case Cbasket_mux:
            validation= '1';
            authorizedVolume= "00000000";
            authorizedMoney= "9999000";
            PPUauthorized= "00000";
            shift_message="Proceso de credito para canasta...";
            var resultado=60-shift_message.length; 
            var adding_spaces=" ";
            for(x=1;x<resultado;x++){
                adding_spaces=adding_spaces+" ";
            }
            shift_message=shift_message+adding_spaces;
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
            numeroEnvio='0';            
        break;  
        case blocking_mux:
            switch(muxbloqueoAB){
                case 12:
                    muxport.write("MUX"+positionOne+"M"+";"+"1"+";"+"&"+positionTwo+"M"+";"+"1"+";"+"&"+"*");
                    //("MUX"+"1M;1;&"+"2"+"M"+";"+"1"+";"+"&"+"*");                     
                break;
                case 1:
                    muxport.write("MUX"+positionOne+"M"+";"+"1"+";"+"&"+positionTwo+"N;&"+"*");
                    //("MUX"+"1M;1;&"+"2N;&"+"*");                      
                break;
                case 2:
                    muxport.write("MUX"+positionOne+"N;&"+positionTwo+"M"+";"+"1"+";"+"&"+"*");
                    //("MUX"+"1N;&"+"2"+"M"+";"+"1"+";"+"&"+"*");                      
                break;                
                default:
            }
            muxbloqueoAB=0;
            TableNumber=not_readtable;             
            numeroEnvio='0';              
        break;  
        case unlock_mux:
            switch(muxdesbloqueoAB){
                case 12:
                    muxport.write("MUX"+positionOne+"M"+";"+"0"+";"+"&"+positionTwo+"M"+";"+"0"+";"+"&"+"*");
                    //("MUX"+"1M;0;&"+"2"+"M"+";"+"0"+";"+"&"+"*");                    
                break;
                case 1:
                    muxport.write("MUX"+positionOne+"M"+";"+"0"+";"+"&"+positionTwo+"N;&"+"*");
                    //("MUX"+"1M;0;&"+"2N;&"+"*");                      
                break;
                case 2:
                    muxport.write("MUX"+positionOne+"N;&"+positionTwo+"M"+";"+"0"+";"+"&"+"*");
                    //("MUX"+"1N;&"+"2"+"M"+";"+"0"+";"+"&"+"*");                      
                break;                
                default:                
            }
            muxdesbloqueoAB=0;
            TableNumber=not_readtable;             
            numeroEnvio='0';                  
        break;    
        case sotware_hardware_comunication:
            //("enviando....................");
            if(stateNSXvariableglobal==1 && sendStateSoftwareHardware==1){
                muxport.write("MUX"+positionOne+"P"+";"+"1"+";"+"&"+positionTwo+"N;&"+"*");
                //("MUX"+"1P;1;&"+"2N;&"+"*");
                sendStateSoftwareHardware=0;
            }
            if(stateNSXvariableglobal==0 && sendStateSoftwareHardware==0){
                muxport.write("MUX"+positionOne+"P"+";"+"0"+";"+"&"+positionTwo+"N;&"+"*");
                //("MUX"+"1P;0;&"+"2N;&"+"*");  
                sendStateSoftwareHardware=1;
            }  
        break; 
	    case resetforError:
	       if(L1ERROR>0 && L1ERROR!=undefined){
	           muxport.write("MUX"+positionOne+"Y"+";"+"&"+positionTwo+"N;&"+"*");                
	           //("MUX"+"1"+"Y"+";"+"&"+"2N;&"+"*");
	                ////("dasfdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
	           L1ERROR=0;
	           L1_request=0;
	       }
	       if(L2ERROR>0 && L2ERROR!=undefined){
	            muxport.write("MUX"+positionOne+"N;&"+positionTwo+"Y"+";"+"&"+"*");
	            //("MUX"+"1N;&"+"2"+"Y"+";"+"&"+"*");
	            L2ERROR=0;
	            L2_request=0;
	       }
	       numeroEnvio='0';            
	    break;            
        default:
    }
};


/*
*********************************************************************************************************
*                                function sendBBB2vivomux()
*
* Description : Informa al BBB2 que el mux esta activo
*               
*******************************************************************************************
*/
var sendBBB2vivomux =function(){
    
    pg.connect(conString, function(err, client, done){
        if(err){
            return console.error('1Error de sendbbb2vivomux', err);
        }else{
            client.query(sprintf("UPDATE estado SET led = '%1$s' ",1),function(err,result){
                done();
                if(err){
                    return console.error('2Error de vivoestadomux', err);
                }else{    
                    //('>>Estado del BGE: Vivo');                    
                }
            });                                       
        }   
    });
};



var stateMux = function(error){
    if (error){
        //(error);
    }else{
        pg.connect(conString, function(err, client, done){
            if(err){
                return console.error('Error stateMUX', err);
            }else{ 
                client.query("SELECT led FROM estado ;", function(err,result){
                    done();
                    if(err){
                        return console.error('Error al leer stateMUX led', err);
                    }else{
                        var say=result.rows[0].led;
                        //(">>Dato columna led............... " + say);
                        if(frame_1.state==0x16 && frame_2.state==0x16){
                            //("Envia a mux informacion del estado del gnesys.................");
                            if(stateNSXvariableglobal==1){
                                sendStateSoftwareHardware=1;                            
                                sendMux(sotware_hardware_comunication);                                
                            }
                            if(stateNSXvariableglobal==0){
                                sendStateSoftwareHardware=0;                            
                                sendMux(sotware_hardware_comunication);                                
                            }                            
                        }
                    } 
                });                
            }   
        });
    } 
}
/*
*********************************************************************************************************
*                                function completePlot()
*
* Description : Recibe una cadena de datos que luego ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------completa con ceros
*               
*******************************************************************************************
*/

var return_value,return_value1;

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
*                                function count()
*
* Description : Es un contador que retarda el proceso que se requiere
*               
*******************************************************************************************
*/
var contador,enable_count;

function count(){
	if(enable_count==1){
		//("contandoL1...");		
	     contador=contador-1;
	    if(contador==0){
	        //("!deja de contarL1b);
	    	enable_count=0;	        
	    }else{
	        count();
	    }
	}
}

var contador2,enable_count2;

function count2(){
	if(enable_count2==1){
		//("contandoL2...");		
	     contador2=contador2-1;
	    if(contador2==0){
	        //("!deja de contarL2b);
	    	enable_count2=0;	        
	    }else{
	        count2();
	    }
	}
}



/*
*********************************************************************************************************
*                                    Metodos Principales
*********************************************************************************************************
*/

setInterval(watchful,1000);           
setInterval(readTables_consign, 2000); 
setInterval(readTables_credit, 1500);   
setInterval(readTables, 5000);      
setInterval(count, 5000);           
setInterval(count2, 5000);   
setInterval(stateMux,30000);

//2017-03-13



