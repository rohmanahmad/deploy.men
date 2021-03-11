```txt
  ____             _               __  __             
 |  _ \  ___ _ __ | | ___  _   _  |  \/  | __ _ _ __  
 | | | |/ _ \ '_ \| |/ _ \| | | | | |\/| |/ _` | '_ \ 
 | |_| |  __/ |_) | | (_) | |_| |_| |  | | (_| | | | |
 |____/ \___| .__/|_|\___/ \__, (_)_|  |_|\__,_|_| |_|
            |_|            |___/          @rohmanahmad
```
## What iS Deploy.Man
Deploy.Man is a tool for help you deploying your app into your server with rsync technology.


## WorkFlow
- Deploy.Man will executing the pre-deployment command before your app upload into server.
- Then your app will send into your server with rsync technology.
- Deploy.Man will executing the after-deployment command after your app has been uploaded.


## Configuration
Your Configuration file placed in bin folder with .json extension
```json
{
    "projects": [
        {
            "name": "tes-1",
            "path": "/Users/PATH_TO_FOLDER/tes-1",
            "included_files": [
                "public/index.html",
                "public/bundle.*",
                "public/assets"
            ],
            "excluded_files": [
                "data"
            ]
        },
        {
            "name": "tes-2",
            "path": "/Users/PATH_TO_FOLDER/tes-2",
            "included_files": [
                "index.html",
                "bundle.*",
                "assets"
            ],
            "excluded_files": [
                "data"
            ]
        }
    ],
    "servers": [
        {
            "ip": "127.0.0.1",
            "port": "22",
            "usernames": [
                "deploy",
                "staging",
                "...etc"
            ],
            "paths": [
                "/home/PATH_TO_DESTINATION_FOLDER/tes1",
                "/home/PATH_TO_DESTINATION_FOLDER/tes2",
                "...etc"
            ]
        }
    ],
    "commands": {
        "before": [
            "npm run build",
            "npm run build-staging",
            "npm run build-test"
        ],
        "after": [
            "mv {PATH} /tmp/tes",
            "rm {PATH}",
            "cp {PATH} /tmp/tes2",
            "...whatever command"
        ]
    }
}
```

## Running Deploy.Man App
### Calling Application
```sh
$ cd bin
$ ./deploy.man-{version}
```
### Choosing Project
```sh
? Select Project To be Deploy? (Use arrow keys)
❯ r10-frontend(/Users/rohmanahmad/Projects/office/r10-frontend) 
  r10-api(/Users/rohmanahmad/Projects/office/r10-api)
```
### Choosing Server Destination
```sh
? Select Destination Server? (Use arrow keys)
❯ 127.0.0.1:22 
  127.0.0.2:22 
```
### Choosing Server User
```sh
? Select Username of the Server? (Use arrow keys)
❯ deploy 
  rohmanahmad 
  standartuser
```
### Choosing Server Path
```sh
? Select Path in the Server? (Use arrow keys)
❯ /tmp/tes 
  /home/deploy/tes 
  /home/developer/tes
```
### Selecting Pre-deployment Commands
```sh
? Select Command Before Deploying To Server? (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ npm run build
 ◯ npm run build-staging
 ◯ npm run build-test
```
### Selecting After deployment Commands
```sh
? Select Command After Deploying To Server? (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ mv {PATH} /tmp/tes
 ◯ rm {PATH}
 ◯ cp {PATH} /tmp/tes2
```

### Go