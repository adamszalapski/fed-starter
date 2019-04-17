# Git clone
I would suggest clone FED gulp starter into `_fed` folder localized into project root.

# Installation

**Ruby**
To install ruby go to official [website](http://rubyinstaller.org/)

**1. sass**

```sh
$ gem install sass
```

**Node.js**
To install node.js go to official [website](http://nodejs.org/)

**1. gulp**

```sh
$ _fed/npm install --global gulp
```

**2. install node and bower dependencies**

```sh
$ _fed/npm install
```
    
### Run app

**Start file watchers**

```sh
$ _fed/gulp or _fed/npm start
```
    
### How should I use this _fed files structure properly?
**The only files you will edit** are config.js and inside `src` folder. There are sub-folders like:
  - `css` has `main.scss` file which gonna be minify and optimized for all supported browsers
  - `js` all scripts will be compile, minify and concat
  - `images` all `image files` in this folder gonna be compressed and optimized

Compiled files will be genarated into `./preview` folder. You can always change destination folder variable **outputPath** in `config.js`

### Feedback
If you have any problems or improvements suggestion feel free to email me szalapski.adam@gmail.com