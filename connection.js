const mysql = require('mysql');
const con = mysql.createConnection({
    hostname:'localhost',
    user:'root',
    password:'',
    database:'tripft'
    
});

con.connect((err)=>{
    if(err) throw err;
    else console.log('connection done');
});

module.exports.con = con;