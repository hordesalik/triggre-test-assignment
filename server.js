import StaticServer from 'static-server';
const PORT = 3030;
const server = new StaticServer({
    rootPath: '.',            // required, the root of the server file tree
    port: PORT,               // required, the port to listen
});

server.start(() => {
    console.log(`Static Server is running on port ${PORT}`);
});
