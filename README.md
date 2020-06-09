# MMM-LoLeSports

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

This Module displays upcoming matches for eSports leagues. The Data is retrieved from [Pandascore](https://pandascore.co/).
The Module should support all Games that are delivered by Pandascore. I only tested League of Legends so far. No guarantee that it will work the other games as LoL. The free Pandascore-Account allowes up to 1000 requests per Hour.

![alt text](https://github.com/MartinGaiser/MMM-eSports/blob/master/.github/onlyText.jpg "Only Text")
![alt text](https://github.com/MartinGaiser/MMM-eSports/bloc/master/.github/onlyimages.jpg "Only Images")

## Installation
1. Clone this repo into the ```~/MagicMirror/modules```. 
2. Go into the Module direcroty: ```cd MMM-eSports```
3. Run ```npm install```
4. Configure your ```~/MagicMirror/config/config.js```:
    ```js
       {
            module: 'MMM-eSports',
            position: 'top_right',
            config: {
                ...
            }
        }
     ```

## Configuration options

| Option           |Default| Description
|----------------- |-------|-----------
| `apiKey`         |   -   | **Required** To get the API-Key create a free [Pandascore Account](https://pandascore.co/users/sign_up). 
| `league_ids`     |   -   | **Required** You will need to find the leagueIDs of the Leagues you want to display first. To do that use the [GetLeagues](https://developers.pandascore.co/doc/#operation/get_leagues)-Endpoint. Don't forget to supply your Token! 
| `updateInterval` | 60    | Time between requests in seconds. 
| `numberOfGames`  | 10    | The number of Matches that will be displayed (number of rows)
| `language`       | 'en'  | The language, all languages of moment.js are supported
| `timeFormat`     | 12    | Either 12 (pm/am) or 24
| `leagueAsImage`  | false | If true the league icon will be displayed instead of the leagues name
| `teamAsImage`    | false | If true the teams icon will be displayed instead of the teams name


Example Config: 

```js
config: {
    updateInterval: 60,         
    apiKey: "<YOUR-API-KEY>",   
    league_ids: "4197,4302",    
    numberOfGames: 5,           
    language: "en",             
    timeFormat: 12,            
    leagueAsImage: true,        
    teamAsImage: true,          
    size: "80%"                
}
```

### Finding League IDs
Example for finding the ID of League of Legends LEC:
```
https://api.pandascore.co/lol/leagues?search[name]=LEC&token=<yourToken>
```
Rsponse: 
```
[
    {
        "id": 4197,
        "image_url": "https://cdn.pandascore.co/images/league/image/4197/LEC-2019.png",
        "modified_at": "2019-03-03T01:22:54Z",
        "name": "LEC",
        .
        .
        .
    }
]
```
The ID of LEC therefore is: 4197.
