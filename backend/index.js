const mongoose = require("mongoose");
let express = require("express");
let cors = require("cors");
let bcrypt =require("bcryptjs");

// var ObjectiD = require("bson-objectid");
const  ObjectID = require('mongodb').ObjectId;
let app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());


let Jwt = require("jsonwebtoken");
const jwtKey = "Bookbus";


let dbconnect = require("./mongodb_user");
let deconnect_bus_detail=require('./Busadder')
let deconnect_MasterList=require('./MasterList')
let dbconnect_Booking=require('./booking')
let dbconnect_wishlist=require('./WishList')

//wishlist


app.post('/wishlist',verifytoken,async(req,res)=>{
  let data=await dbconnect_wishlist();
  let result=await data.insertOne(req.body)
  res.send({'status':200});
})


// Booking station

app.get('/getByid/:_id',async(req,res)=>{
  console.log(req.params._id)
  let data = await dbconnect_Booking();
  let result = await data.find({}).toArray();
  let ans=[]
  for(let i=0;i<result.length;i++)
  {
    if(result[i]._id==req.params._id)
    {
      ans.push(result[i])
    }
  }
  res.send(ans)
})

app.get('/getTicketByid/:_id',verifytoken,async(req,res)=>{
  let id=req.params._id
  let data = await dbconnect_Booking();
  let result = await data.find({}).toArray();
  let ans=[]
  for(let i=0;i<result.length;i++)
  {
    if(result[i]._id==id){
      ans.push(result[i])
    }
  }
  res.send(ans)
})

app.get('/getTicket/:email',verifytoken,async(req,res)=>{
    let data = await dbconnect_Booking();
    let result = await data.find({ useremail: req.params.email }).toArray();
    result.reverse()
    res.send(result)
})

app.patch('/get_Seat',async(req,res)=>{

    let src=req.body.start_station.toUpperCase()
    let dist=req.body.end_station.toUpperCase()
    let date=req.body.date
    let bus_id=req.body.bus_id

    let data = await dbconnect_Booking();
    let Booking =await data.find({bus_id:bus_id , date:date}).toArray();
    let data_bus=await deconnect_bus_detail()
    let busData=await data_bus.find({_id:new ObjectID(bus_id)}).toArray();
    let bus=busData[0].station_data
 
    let srcToDistStation=new Set()
    let count=0;
    let total_distance=0

    for(let i=0;i<bus.length;i++)
    {
        let s=bus[i].station.toUpperCase()
        if(s==src)
        {
           count++;
           srcToDistStation.add(src)
           for(let j=i+1;j<bus.length;j++)
           {
               let s1=bus[j].station.toUpperCase()
               let distanceFromPreviousStation=parseInt(bus[j].Distance_from_Previous_Station)
               if(s1==dist)
               {
                   total_distance+=distanceFromPreviousStation
                   srcToDistStation.add(dist)
                   count+=1;
                   break;
               }
               else
               {
                   total_distance+=distanceFromPreviousStation
                   srcToDistStation.add(s1);
               }
           }
           break;
        }
    }
    
    let countBookingSeat=0
    let seat=new Set()
    if(count==0 || count==1)
    {
        // write some code hare for invalid test case .
    }
    else
    {
         for(let i=0;i<Booking.length;i++)
         {
             let srcStation=Booking[i].src
             let distStation=Booking[i].dist
             if(checkStationIsPresentOrNot(srcStation,distStation,srcToDistStation,bus)==true)
             {
                 countBookingSeat+=parseInt(Booking[i].person.length)
                 let arr=Booking[i].seat_record
                 for(let j=0;j<arr.length;j++)
                 {
                    seat.add(arr[j])
                 }
             }
         }
    }
    let totalSeat=parseInt(busData[0].Total_seat) 
    let ans=[]
    for(let i=1;i<=totalSeat;i++)
    {
        let obj={ isbooked:false}
        if(seat.has(i)==true)
        {
          obj.isbooked=true;
        }
        ans.push(obj)
    }
    let nowAvailable_seat=totalSeat-countBookingSeat;
    res.send({'nowAvailable_seat':nowAvailable_seat,'total_seat':totalSeat,'BookingRecord':ans,'total_distance':total_distance})

})

function checkStationIsPresentOrNot(src,dist,set,bus)
{
  src=src.toUpperCase()
  dist=dist.toUpperCase()
    for(let i=0;i<bus.length;i++)
    {
        let s=bus[i].station.toUpperCase()
        if(s==src)
        {
            for(let j=i;j<bus.length;j++)
            {
                let s1=bus[j].station.toUpperCase()
                if(s1==dist)
                {
                    if(set.has(s1))
                    {
                      return true;
                    }
                    break;
                }
                else
                {
                    if(set.has(s1))
                    {
                      return true;
                    }
                }
            }
            break;
        }
    }
    return -1;
}

app.post('/Booking',verifytoken,async(req,res)=>{
  let data = await dbconnect_Booking();
  let result = await data.insertOne(req.body);
  res.send({'status':200});
})






// MasterList

app.delete('/MasterList/:email',verifytoken,async(req,res)=>{
  let _id=req.body._id
  let data = await deconnect_MasterList();
  await data.deleteOne({_id:new ObjectID(_id)})
  let result = await data.find({ email: req.params.email }).toArray();
  res.send(result)
})

app.get('/MasterList/:email',verifytoken,async(req,res)=>{
  let data = await deconnect_MasterList();
  let result = await data.find({ email: req.params.email }).toArray();
  res.send(result)
})

app.post('/MasterList/:email',verifytoken,async(req,res)=>{
  let data = await deconnect_MasterList();
  let result = await data.insertOne(req.body);
  res.send({'status':200});
})

app.put('/MasterList/:email',verifytoken,async(req,res)=>{
  let data = await deconnect_MasterList();
  let result = await data.updateOne(
    { _id: new ObjectID(req.body._id) },
    { $set: { name: req.body.name } }
  );
  let ans = await data.find({ email: req.params.email }).toArray();
  res.send(ans)
})


//Bus Detail

app.get('/FirstFiveBus',async(req,res)=>{
  let data=await deconnect_bus_detail()
  let result=await data.find().limit(5).toArray();
  let ans=[]
  for(let i=0;i<result.length;i++)
  {
    let arr=result[i].station_data
    let n=arr.length;
    let total_distance=0
    for(let k=0;k<n;k++)
    {
      total_distance+=parseInt(arr[k].Distance_from_Previous_Station);
    }
    let obj={
      bus_id:result[i]._id,
      bus_name:result[i].bus_name,
      start_station:arr[0].station,
      end_station:arr[n-1].station,
      start_arrived_time:arr[0].arrived_time,
      end_arrive_time:arr[n-1].arrived_time,
      total_distance:total_distance
    }
    ans.push(obj)
  }
  res.send(ans)
})

app.patch('/get_bus',async(req,res)=>{

  start_station=req.body.start_station;
  end_station=req.body.end_station;
  let data=await deconnect_bus_detail();
  let result=await data.find().toArray();
  let ans=[]

  for(let i=0;i<result.length;i++)
  {
    let arr=result[i].station_data
    k=0;
    let x=0;
    let total_distance=0;
    let start_ind=-1;
    let end_ind=-1;
    for(k=0;k<arr.length;k++)
    {
      if(arr[k].station.toUpperCase()==start_station){
        start_ind=k;
        x++;
        break;
      }
    }
    if(x==1)
    {
      for(;k<arr.length;k++)
      {
        if(arr[k].station.toUpperCase()==end_station){
          total_distance+=(parseInt(arr[k].Distance_from_Previous_Station))
          end_ind=k;  x++; break;
        }
        else{
          total_distance+=(parseInt(arr[k].Distance_from_Previous_Station))
        }
      }
      if(x==2)
      {
        let obj={
            bus_id:result[i]._id,
            bus_name:result[i].bus_name,
            start_station:start_station,
            end_station:end_station,
            start_arrived_time:arr[start_ind].arrived_time,
            end_arrive_time:arr[end_ind].arrived_time,
            total_distance:total_distance
        }
        ans.push(obj)
      }
    }
  }
  res.send(ans)
})

app.get('/get_station',async(req,res)=>{
  let data=await deconnect_bus_detail()
  let result=await data.find().toArray();
  ans=new Set()
  for(let i=0;i<result.length;i++)
  {
    for(let j=0;j<result[i].station_data.length;j++)
    {
      ans.add(result[i].station_data[j].station.toUpperCase())
    }
  }
  let vec=Array.from(ans)
  res.send(vec)
})

app.get('/bus_detail/:_id',async(req,res)=>{
  let data=await deconnect_bus_detail()
  let result=await data.find({_id:new ObjectID(req.params._id)}).toArray();
  res.send(result)
})

app.post('/bus_detail',async(req,res)=>{
  let data=await deconnect_bus_detail()
  let result = await data.insertOne(req.body);
  res.send({'message':"added SuccessFully"});
})

//user section
//working
app.get("/",verifytoken, async (req, res) => {
  let data = await dbconnect();
  let result = await data.find().toArray();
  res.send(result);
});
//working
app.get("/usermail/:email", async (req, res) => {
  let data = await dbconnect();
  let result = await data.find({ email: req.params.email }).toArray();
  if (result.length != 0) {
    res.send({ message: true });
  } else {
    res.send({ message: false });
  }
});
//working
app.post("/register", async (req, resp) => {
    let data = await dbconnect();
    let password=req.body.password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    let result = await data.insertOne({
      name:req.body.name,
      email:req.body.email,
      password:passwordHash
    });
    delete req.body.password
    let user=req.body
    if (result.acknowledged) 
    {
        Jwt.sign({ user }, jwtKey, (error, token) => {
            if (error) 
            {
              resp.send({ message: "We find some error" });
            }
            resp.send({ user, auth: token });
        });
    } 
    else 
    {
      resp.send("user no found");
    }
});
//working
app.patch("/login", async (req, resp) => {
  if (req.body.email && req.body.password) 
  {
    let data = await dbconnect();
    let password=req.body.password
    
    let user = await data.findOne({
      email:req.body.email
    });
    if(user==null) resp.send("user no found");
    else
    {
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch==false)
        {
          resp.send("user no found");
        }
        delete user.password
        if (user) {
            Jwt.sign({ user }, jwtKey, (error, token) => {
                if (error) {
                  resp.send({ message: "We find some error" });
                }
                resp.send({ user, auth: token });
            });
        } else {
          resp.send("user no found");
        }
      } 
    }
  else
  {
    resp.send("user not found");
  }
});
//normals
function verifytoken(req, res, next) {
  let token = req.headers["auth"];
  if (token) {
    token = token.split(" ")[1];
    Jwt.verify(token, jwtKey, (error, valid) => {
      if (error) {
        res.status(401).send({ status: "498", mess: "Invalid Token" });
      } else {
        next();
      }
    });
  } else {
    res.status(498).send({ status: 498, mess: "Invalid Token" });
  }
}

app.listen(5000);
