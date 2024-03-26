// import express from 'express';
// import {createClient} from '@supabase/supabase-js'
// import morgan from 'morgan'
// import bodyParser from "body-parser";
// import * as supabaseClient from "@supabase/supabase-js";
//
// const app = express();
//
//
// // using morgan for logs
// app.use(morgan('combined'));
//
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
//
//
// const supabase = supabaseClient.createClient({
//     apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhaXhwdHVnbGh3ZWNna2RqZndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg1NzE1NjIsImV4cCI6MjAyNDE0NzU2Mn0.DXxU5di4ePTDl6XzEE4fIEoGE5GnDh8cl48U7Si6p_w',
//     project: 'https://paixptuglhwecgkdjfwm.supabase.co'
// });
//
// app.get('/users', async (req, res) => {
//     const {data, error} = await supabase
//         .from('users')
//         .select()
//     res.send(data);
// });
//
// app.get('/users/:id', async (req, res) => {
//     const {data, error} = await supabase
//         .from('users')
//         .select()
//         .is('id', req.params.id)
//     res.send(data);
// });
//
// app.post('/products', async (req, res) => {
//     const {error} = await supabase
//         .from('products')
//         .insert({
//             name: req.body.name,
//             description: req.body.description,
//             price: req.body.price,
//         })
//     if (error) {
//         res.send(error);
//     }
//     res.send("created!!");
// });
//
// app.put('/products/:userid', async (req, res) => {
//     const {error} = await supabase
//         .from('users')
//         .update({
//             name: req.body.name,
//             description: req.body.description,
//             price: req.body.price
//         })
//         .eq('userid', req.params.id)
//     if (error) {
//         res.send(error);
//     }
//     res.send("updated!!");
// });
//
// app.delete('/users/:userid', async (req, res) => {
//     const {error} = await supabase
//         .from('users')
//         .delete()
//         .eq('userid', req.params.id)
//     if (error) {
//         res.send(error);
//     }
//     res.send("deleted!!")
//
// });
//
// app.get('/', (req, res) => {
//     res.send("Hello I am working my friend Supabase <3");
// });
//
// app.get('*', (req, res) => {
//     res.send("Hello again I am working my friend to the moon and behind <3");
// });
//
// app.listen(3000, () => {
//     console.log(`> Ready on http://localhost:3000`);
// });