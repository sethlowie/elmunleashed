module Main exposing (main)

import Browser
import ElmUnleashed
import Html exposing (Html, text)
import Http
import Json.Encode as E


todoModule : ElmUnleashed.Module ()
todoModule =
    ElmUnleashed.newModule "simple-todo"


getTodos : Cmd Msg
getTodos =
    todoModule
        |> ElmUnleashed.withMethod "GET"
        |> ElmUnleashed.withPath "/todos"
        |> ElmUnleashed.withExpect (Http.expectWhatever GotTodos)
        |> ElmUnleashed.execute


main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { todos : List String
    , newTodo : String
    }


type Msg
    = GotTodos (Result Http.Error ())


init : () -> ( Model, Cmd Msg )
init _ =
    ( { todos = []
      , newTodo = ""
      }
    , getTodos
    )


view : Model -> Html Msg
view model =
    text "Hello, World!"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    ( model, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none
