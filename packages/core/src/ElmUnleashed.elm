module ElmUnleashed exposing
    ( Module
    , execute
    , newModule
    , withExpect
    , withJson
    , withMethod
    , withPath
    )

import Http
import Json.Encode as E


type RequestBody
    = Json E.Value
    | Empty


type alias Module a =
    { namespace : String
    , url : String
    , method : String
    , body : RequestBody
    , expect : Http.Expect a
    }


newModule : String -> Module ()
newModule namespace =
    { namespace = namespace
    , url = ""
    , method = "GET"
    , body = Empty
    , expect = Http.expectString (\_ -> ())
    }


withPath : String -> Module a -> Module a
withPath path command =
    { command | url = command.url ++ path }


withMethod : String -> Module a -> Module a
withMethod method command =
    { command | method = method }


withExpect : Http.Expect a -> Module () -> Module a
withExpect expect command =
    { url = command.url
    , method = command.method
    , body = command.body
    , expect = expect
    , namespace = command.namespace
    }


withJson : E.Value -> Module a -> Module a
withJson value command =
    { command | body = Json value }


encodeBody : RequestBody -> E.Value
encodeBody body =
    case body of
        Json value ->
            value

        Empty ->
            E.object []


buildBody : Module a -> Http.Body
buildBody command =
    Http.jsonBody <|
        E.object
            [ ( "path", E.string command.url )
            , ( "body", encodeBody command.body )
            , ( "method", E.string command.method )
            ]


execute : Module msg -> Cmd msg
execute command =
    Http.request
        { url = ""
        , method = command.namespace
        , headers = []
        , body = buildBody command
        , expect = command.expect
        , timeout = Nothing
        , tracker = Nothing
        }
