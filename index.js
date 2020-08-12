const express = require( "express" );
const shortID = require( "shortid" );
const server = express();

const PORT_NUMBER = 5000;

let users = [ { id : shortID.generate(), name : "Jane Doe", bio : "Not Tarzan's Wife, another Jane" }, { id : shortID.generate(), name : "Super Mario", bio : "Super Mario Bros Nintendo" } ];

server.use( express.json() );


server.get( "/api/users", ( req, res ) =>
{
    users.length === 0 ? res.status( 500 ).json( { errorMessage: "The users information could not be retrieved." } ) : res.status( 200 ).json( users );
} );

server.get( "/api/users/:id", ( req, res ) =>
{
  const user = users.filter( user => user.id === req.params.id );
  user.length === 0 ? res.status( 404 ).json( { message: "The user with the specified ID does not exist." } ) : res.status( 200 ).json( user );
} );

server.post( "/api/users", ( req, res ) =>
{
  const newUser = req.body;

  if( !newUser.name || !newUser.bio )
    res.status( 400 ).json( { errorMessage: "Please provide name and bio for the user." } );
  
  try
  {
    newUser.id = shortID.generate();
    users.push( newUser );
    res.status( 201 ).json( newUser );
  }
  catch( e )
  {
    res.status( 500 ).json( {  errorMessage: "There was an error while saving the user to the database" } );
  }
} );

server.delete( "/api/users/:id", ( req, res ) =>
{
  let userDeleted = null;
  const usersTempArray = [];

  users = users.forEach( user =>
  {
    req.params.id !== user.id ? usersTempArray.push( user ) : userDeleted = user
  } );

  users = usersTempArray;

  if( !userDeleted )
    res.status( 404 ).json( { message: "The user with the specified ID does not exist." } );

  res.status( 200 ). json( userDeleted );
} );

server.put( "/api/users/:id", ( req, res ) =>
{
  if( !req.body.name || !req.body.bio )
    res.status( 400 ).json( { errorMessage: "Please provide name and bio for the user." } );

  let user = users.find( user => user.id === req.params.id );
  if( user )
  {
    Object.assign( user, req.body );
    res.status( 200 ).json( user );
  }
  else
    res.status( 404 ).json( { message : "The user with the specified ID does not exist." } );
} );

server.listen( PORT_NUMBER, () => console.log( "Server Running on Port Number: " + PORT_NUMBER ) );