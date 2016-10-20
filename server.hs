import Happstack.Lite

fileServing :: ServerPart Response
fileServing = serveDirectory EnableBrowsing ["index.html"] "./"

myApp :: ServerPart Response
myApp = fileServing

main :: IO ()
main = do
    putStrLn "Haskell web server started on port 8000!"

    serve Nothing myApp
