Common Source Code
------------------

Common source is shared typescript classes between client and server. Browserify will scoop up these classes if the client code ultimately depends on it. Server code will scoop dependencies naturally through NodeJS require().