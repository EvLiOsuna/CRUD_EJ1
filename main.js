//1. npm i --yes
//npm i mongoose
//agregar todos los modulos con npm

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//CONEXIÓN A LA BASE DE DATOS
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/u3', {useNewUrlParser:true});

//DEFINIR ESQUEMA
const productSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    name:[{
            firstName:{
                required: true,
                type: String
            },
            lastName:{
                required: true,
                type: String
            }
         }],
    password:{
        type: String,
        required: true,
        lowercase: true
     },
    email:{
        type: String,
        required: true,
        match: /.+@.+\..+/,
        lowercase: true
     }
});

//MODELO
const Product = mongoose.model('Product',productSchema,'products');

const User = mongoose.model('User',userSchema,'users');


//-----ROUTER----
//DEFINIR ENDPOINTS
const productRouter = express.Router();
const userRouter = express.Router();

productRouter.post("/",(req, res)=>{
    const product = req.body; //se recibe un JSON en body y se guarda en product
   
    Product.create(product)
    .then(data=>{ //OK
        console.log(data);
        res.status(200);
        res.json({
            code:200,
            msg:"Saved!", 
            detail:data
        });
    })
    .catch(error =>{ //CC algo sale mal
        console.log(error);
        res.status(400);
        res.json({
            code:400,
            msg:"No se pudo insertar",
            detail: error
        });
    });
});

userRouter.post("/",(req, res)=>{
    const user = req.body; //se recibe un JSON en body y se guarda en product
   
    User.create(user)
    .then(data=>{ //OK
        console.log(data);
        res.status(200);
        res.json({
            code:200,
            msg:"Saved!", 
            detail:data
        });
    })
    .catch(error =>{ //CC algo sale mal
        console.log(error);
        res.status(400);
        res.json({
            code:400,
            msg:"No se pudo insertar",
            detail: error
        });
    });
});

//CONSULTA GENERAL
productRouter.get("/",(req, res)=>{
   
    Product.find({})
    .then(products=>{
           res.status(200);
        res.json({
            code:200,
            msg:"Consulta exitosa",
            detail:products
        });
    })
    .catch(error =>{
        res.status(400);
        res.json({
            code:400,
            msg:"Error...",
            detail:error
        });
    });
});

userRouter.get("/",(req, res)=>{
   
    User.find({})
    .then(users=>{
           res.status(200);
        res.json({
            code:200,
            msg:"Consulta exitosa",
            detail:users
        });
    })
    .catch(error =>{
        res.status(400);
        res.json({
            code:400,
            msg:"Error...",
            detail:error
        });
    });
});

//CONSULTA POR ID
productRouter.get("/:id", (req,res)=>{
    const id = req.params.id;
    Product.find({_id:id})
    .then(product=>{
            res.status(200);
            res.json({
                code:200,
                msg:"Exito",
                detail:product
            })
    })
    .catch(error=>{
        res.status(400);
        res.json({
            code:400,
            msg:"Error...",
            detail:error

        });
    });
});

userRouter.get("/:id", (req,res)=>{
    const id = req.params.id;
    User.find({_id:id})
    .then(user=>{
            res.status(200);
            res.json({
                code:200,
                msg:"Exito",
                detail:user
            })
    })
    .catch(error=>{
        res.status(400);
        res.json({
            code:400,
            msg:"Error...",
            detail:error

        });
    });
});

//ELIMINAR
productRouter.delete("/:id", (req,res)=>{
    const {id} = req.params; //destructor
    Product.remove({_id:id})
    .then(data=>{
        res.status(200);
        res.json({
            code:200,
            msg:"Se elimino",
            detail:data
        })
    })
    .catch(error=>{
        res.status(400);
        res.json({
            code:400,
            msg:"no se elimino",
            detail:error
        });
    });
        
});

userRouter.delete("/:id", (req,res)=>{
    const {id} = req.params; //destructor
    User.remove({_id:id})
    .then(data=>{
        res.status(200);
        res.json({
            code:200,
            msg:"Se ha elimininado el registro",
            detail:data
        })
    })
    .catch(error=>{
        res.status(400);
        res.json({
            code:400,
            msg:"No se pudo eliminar",
            detail:error
        });
    });
        
});

productRouter.put("/:id",(req,res)=>{

    const {id} = req.params; //destructor

    Product.update({_id:id},{name:"cuaderno"})
    .then(data=>{
        res.status(200);
        res.json({
            code:200,
            msg:"Se actualizo",
            detail:data

        })
    })
    .catch(error=>{
        res.status(400);
        res.json({
            code:400,
            msg:"Error...",
            detail:error
}); 
    });
});

userRouter.put("/:id",(req,res)=>{

    const {id} = req.params; //destructor

    User.update({_id:id},{password:"holi123"})
    .then(data=>{
        res.status(200);
        res.json({
            code:200,
            msg:"Se ha actualizado correctamente",
            detail:data

        })
    })
    .catch(error=>{
        res.status(400);
        res.json({
            code:400,
            msg:"Error...",
            detail:error
}); 
    });
});

//CONFIGURANDO SERVIDOR EXPRESS
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false})); //para acceder a los queryParams

app.use("/products",productRouter);

app.use("/users",userRouter);

//CONFIGURANDO EL SERVIDOR HTTP
const server = require('http').Server(app);
const port = 3002;

//EJECUTANDO EL SERVIDOR
server.listen(port);
console.log(`Running on port ${port}`);


//instalar nodemon de forma global, npm i -g nodemon 