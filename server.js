const express = require('express');
const SparqlClient = require('sparql-http-client');
const cors = require('cors');
const app = express();
let fetchedData = [];

app.listen(8000, () => {
    console.log('Server is running!');
})

let asyncCall = new Promise(async function (Resolve, Reject) {
    console.log('Data call initiated:');
    const client = new SparqlClient({ endpointUrl: 'http://localhost:3030/dataset' });
    const stream = await client.query.select('PREFIX owl: <http://www.w3.org/2002/07/owl#>\
    select distinct  ?subject ?predicate ?object {\
     ?subject a owl:Class; \
        ?predicate ?object \
      FILTER(!isBlank(?subject))}');

    //console.log('Data stream loaded!');

    stream.on('data', row => {
        //console.log(`${row.subject.value} + ' # ' + ${row.predicate.value} + ' # ' + ${row.object.value}`);
        fetchedData.push({ subject: row.subject.value, predicate: row.predicate.value, object: row.object.value });
    })
    stream.on('end', function () {
        Resolve();
    })

    //Reject(); 
});

app.get("/getdata", async function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    asyncCall.then(function () {
        res.send({
            data: fetchedData,
        })
    });
})

app.use(cors());

