var driver = require("./../database");
exports.getData = async (req,res,next)=>{
    const session = driver.session();
    const query = `MATCH (n:people{id:$id}) return n`;
    const params = {
        id:`${req.body.id}`
    }
    var data = [];
    session.run(query,params).then((results)=>{
        results.records.forEach((record)=>{
            record._fields.forEach((el)=>{
                data.push(el.properties)
            })
        })
        return data
    }).then((data)=>res.send(data)).catch(err=>console.log(err))

}