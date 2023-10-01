
let dbconnect_sendMessage=require('../sendMessage')

const sendMessage =async(req,resp)=>{
    let data=await dbconnect_sendMessage();
    let result=await data.insertOne(req.body)
    if(result.acknowledged==true)
    {
        return resp.send({'status':200});
    }
    else
    {
        return resp.send({'status':498})
    }
}

module.exports=sendMessage