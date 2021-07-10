const express = require('express')
const SparqlClient = require('sparql-http-client')
const cors = require('cors')
const app = express()
let fetchedData = []
app.listen(8000, () => {
    console.log('Server started!')
})

/* async function asyncCall() {
    console.log('Data call initiated:');
    const client = new SparqlClient({ endpointUrl: 'http://localhost:3030/dataset' })
    const stream = await client.query.select('PREFIX owl: <http://www.w3.org/2002/07/owl#>\
    select distinct  ?subject ?predicate ?object {\
     ?subject a owl:Class; \
        ?predicate ?object \
      FILTER(!isBlank(?subject))}')
    console.log('Data loaded:');

    var fetchedData = []
    stream.on('data', quad => {
        //console.log(`${quad.subject.value} + ' # ' + ${quad.predicate.value} + ' # ' + ${quad.object.value}`)
        fetchedData.push({ subject: quad.subject.value, predicate: quad.subject.predicate, object: quad.subject.object })
    })
    return fetchedData
}

app.route('/api/cats').get((req, res) => {
    data = asyncCall();
    console.log(data)
    res.send({
        data: data,
    })
})

app.get("/getdata", async function (req, res) {
    // var data = await pullData();
    // var filteredData = await filterByYear(data);
    // res.json(filteredData);
    data = await asyncCall();
    console.log(data)
    res.send({
        data: data,
    })
}) */
let asyncCall = new Promise(async function (Resolve, Reject) {
    console.log('Data call initiated:');
    const client = new SparqlClient({ endpointUrl: 'http://localhost:3030/dataset' })
    const stream = await client.query.select('PREFIX owl: <http://www.w3.org/2002/07/owl#>\
    select distinct  ?subject ?predicate ?object {\
     ?subject a owl:Class; \
        ?predicate ?object \
      FILTER(!isBlank(?subject))}')
    console.log('Data loaded:');

    stream.on('data', quad => {
        //console.log(`${quad.subject.value} + ' # ' + ${quad.predicate.value} + ' # ' + ${quad.object.value}`)
        fetchedData.push({ subject: quad.subject.value, predicate: quad.predicate.value, object: quad.object.value })
    })
    stream.on('end', function () {
        Resolve(); // when successful
    })
    //return fetchedData

    //myReject();  // when error
});


app.route('/api/cats').get((req, res) => {
    data = asyncCall();
    console.log(data)
    res.send({
        data: data,
    })
})

app.get("/getdata", async function (req, res) {
 res.header('Access-Control-Allow-Origin', '*');	
    asyncCall.then(function () {
        res.send({
            data: fetchedData,
        })
    });
})

app.use(cors())

