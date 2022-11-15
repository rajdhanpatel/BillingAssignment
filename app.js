const express = require('express');
const app = express();
const port = 3004;
const mysql = require('./connection').con;//now we can run query using mysql 
var data_exporter = require('json2csv').Parser;
const companyID = [];

//configuration
app.set('view engine','ejs');
app.set('views','./view');
//spelling should be exactly same


//get the json data for : total trip created by each company
app.get('/',(req,res)=>{
    mysql.query('select CreatedByCompanyId, count(*) from augtrip group by CreatedByCompanyId',(error,data)=>{
        const json_data = JSON.parse(JSON.stringify(data));
        //console.log(json_data.length);//11
        //console.log(json_data[1]);//{ CreatedByCompanyId: 57, 'count(*)': 7 }
        //console.log(json_data[1]["CreatedByCompanyId"]);//57
        
        let j = 0;
        for(let i of json_data){
            companyID.push(json_data[j]["CreatedByCompanyId"]);
            console.log(companyID[j]);
            j++;
        }
    });
});


// //routing - that will take data from DB and show in tabular format on browser
app.get('/add',(req,res)=>{
    mysql.query('select * from augtrip',function(error,data){
        if(error) throw error;
        else{
            console.log(typeof data);
            //var mysql_data = JSON.parse(JSON.stringify(data));//convert table data in json data and then in obj
            //console.log(mysql_data);//here u get all the patient table data in json fromat
            //console.log(data)//this is normal data(not the json data)
            res.render('index',{title:'Express', augtrip:data});
            for(let i of companyID){
                console.log(companyID[i]);
            }
        }
        
    });
});



//on click the button "Export to CSV" browser tabular data stored in CSV file
app.get('/export',function(request,response,next){
    mysql.query('SELECT * FROM augtrip',function(error,data){
        var mysql_data = JSON.parse(JSON.stringify(data));
        //json to csv

        var file_header = ['TripId','BillTo','ChargedTo','TripCreationTime','ConsignorName','ConsignorId','ConsignorBranchName','ConsignorBranchId','TransporterName','TransporterId','TransporterBranchName','TransporterBranchId','CreatedByCompanyId','CreatedByCompanyName','FeedUniqueId','Origin','Destination','DestinationCity','DriverNumbers','SimCarrier','ATA','TripClosureTime','LocationSource','TrackedLocationSources','LRNumber','InvoiceNumber','VehicleNumber','NoofDays','Rate','TotalCost'];
        


        var json_data = new data_exporter({file_header});
        var csv_data = json_data.parse(mysql_data);
        response.setHeader("Content-Type","text/csv");
        response.setHeader("Content-Disposition","attachment;filename=HIND-CARGO-MOVERS-PVT.LTD_1272.csv");

        response.status(200).end(csv_data);

    });

});



//creating server
app.listen(port,(err)=>{
    if(err) throw err;
    else console.log(`server is running at port ${port}`);
});