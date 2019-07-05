# IGDB Reader made with React and Node

App creata a scopo creativo. Fatta per studiare le logiche di React e quelle di Node. 
In questa repository c'è sia React che Node. 

È stato pubblicata su Heroku utilizzando una sola App. 

Si ringrazia Mars per la dettagliata spiegazione su come raggiungere questo obiettivo.
🔥 [Progetto di Mars](https://github.com/mars/heroku-cra-node)
⚛️ [Demo Funzionante](https://react-games-feed.herokuapp.com/)

## Struttura
La struttura si basa su due progetti npm, il backend server e il frontend UI. Ci sono due `package.json` configs e, in caso vogliate replicare in locale questo esempio, due cartelle in cui effettuare `npm commands`.

1. [**Node Server**](server/): [`./package.json`](package.json)
2. [**React UI**](react-ui/): [`react-ui/package.json`](react-ui/package.json)
      * generato tramite [create-react-app](https://github.com/facebookincubator/create-react-app)
      * deployed via `build` script nel [`./package.json`](package.json) del server Node.
      * module cache configurati da `cacheDirectories`

## Demo

[La demo](https://react-games-feed.herokuapp.com/): esegue delle chiamate API da React a Node. Node si occuperà poi di effettuare le chiamate a IGDB. 

Node non si occuperà di nient'altro al di fuori di mostrare la versione build di React. Tutte le chiamate non programmate da Node mostreranno la base di React. 

### Ringraziamenti

🔥 [Mars](https://github.com/mars/heroku-cra-node)
    Per la sua guida su come tenere node e react nello stesso progetto Github e nella stessa App Heroku.

🔥 [Hidran Arias](https://www.linkedin.com/in/hidran/) Per il suo fantastico corso su React.

🔥 [Microsoft - Visual Studio Code](https://code.visualstudio.com/) Per aver fatto uno dei migliori IDE mai provati