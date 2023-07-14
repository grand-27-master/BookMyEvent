const express=require('express'); // framework
const bodyParser=require('body-parser'); // json parser
const {graphqlHTTP}=require('express-graphql'); // middleware
const { buildSchema }=require('graphql'); // schema
const mongoose=require('mongoose'); // database
const bcrypt=require('bcryptjs'); // hashing
const Event=require('./models/event'); // model
const User=require('./models/user'); // model

const app=express();

app.use(bodyParser.json()); // json parser

// get user by id
const user=userId=>{
    return User.findById(userId).then(user=>{
        return { ...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) };
    }
    ).catch(err=>{
        throw err;
    }
    );
}

// app.get('/',(req,res,next)=>{
//     res.send('Hello from express');
// }
// );

mongoose.connect(`mongodb+srv://vashishth:Qq8dPwn9ezbXiucL
@cluster0.atwro.mongodb.net/?
retryWrites=true&w=majority`).then(()=>{
    app.listen(3000,()=>{
        console.log('Server is running on port 3000'); 
    } 
    );
}).catch(err=>{
    console.log(err);
}
);

const events=['Romantic Cooking','Sailing','All Night Coding']; // dummy data

app.use('/graphql',graphqlHTTP({
    schema:buildSchema(`

        type Event{ 
            _id:ID!
            title:String!
            description:String!
            price:Float!
            date:String!
            creator:User!
        }

        type User{
            _id:ID!
            email:String!
            password:String
            createdEvents:[Event!]
        }

        input UserInput{
            email:String!
            password:String!
        }

        input EventInput{ 
            title:String!
            description:String!
            price:Float!
            date:String!
        }

        type RootQuery{
            events:[Event!]!  
        }

        type RootMutation{
            createEvent(eventInput:EventInput):Event
            createUser(userInput:UserInput):User
        }

        schema{
            query:RootQuery
            mutation:RootMutation
        }
    `),
    rootValue:{
        events:async ()=>{
            // return events;
            try {
                const events = await Event.find().populate('creator');
                return events.map(event => {
                    return { ...event._doc, _id: event._doc._id.toString(), creator: { ...event._doc.creator._doc, _id: event._doc.creator.id } };
                });
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
        ,
        createEvent:async (args)=>{
            // const eventName={
            //     _id:Math.random().toString(),
            //     title:args.eventInput.title,
            //     description:args.eventInput.description,
            //     price:+args.eventInput.price,
            //     date:args.eventInput.date
            // }

            const event=new Event({
                title:args.eventInput.title,
                description:args.eventInput.description,
                price:+args.eventInput.price,
                date:new Date(args.eventInput.date),
                creator:'5f9b6b3b1c9d440000f1b0b5'
            });
            // events.push(eventName);
            try {
                const result_1 = await event.save();
                createdEvent={ ...result_1._doc, password:null, _id: result_1._doc._id.toString() };
                User.findById('5f9b6b3b1c9d440000f1b0b5').then(user => {
                    if (!user) {
                        throw new Error('User not found');
                    }
                    user.createdEvents.push(event);
                    return user.save();
                }).then(result => {
                    console.log(result);
                }).catch(err => {
                    console.log(err);
                    throw err;
                });

                console.log(result_1);
                return createdEvent;
            } catch (err) {
                console.log(err);
                throw err;
            }
            // return eventName;
        },

        createUser:async (args)=>{
            User.findOne({ email: args.userInput.email }).then(user => {
                if (user) {
                    throw new Error('User already exists');
                }return bcrypt.hash(args.userInput.password, 12)
            }).then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            }).then(result => {
                return { ...result._doc, password: null, _id: result.id };
            }).catch(err => {
                throw err;
            });
            try {
                const result_2 = await user.save();
                console.log(result_2);
                return { ...result_2._doc, _id: result_2._doc._id.toString() };
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
    },
    graphiql:true // for testing
}));


// app.listen(3000,()=>{
//     console.log('Server is running on port 3000'); 
// } 
// );