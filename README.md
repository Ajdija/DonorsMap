## Task
Create app that will provide a bridge between patients and donors.
* Index page should load a map.
* User can search his home location.
* Donors can tap/click on it. On clicking it should open a form to fill with: First Name, Last Name, Contact Number, Email Address and Blood Group
* All the form fields should be validated. Ex. proper telephone number is +xx xxx xxxx xxx or 00xx xxx xxxx xxx.
* When form is submitted success message should be shown. Message should contain unique private link that can be used to edit the form data.
* Patient can see donor pin on map and can click/tap on them. On clicking popup should appear with Donor data.
* Donor pins should be lazy loaded.
* The app should be real time. No page reload needed if pin is deleted/updated.

## Design
Please see Design.pdf

## Screenshots
Homepage View

![Screenshot](https://cloud.githubusercontent.com/assets/7486241/19486258/1b7c8aca-955e-11e6-8fef-9198700061d5.png)

Create Donor Pin popup 

![Screenshot](https://cloud.githubusercontent.com/assets/7486241/19486498/f082bc1c-955e-11e6-8178-c9292cdb4370.png)

Confimation with edit donor pin link

![Screenshot](https://cloud.githubusercontent.com/assets/7486241/19486260/1b855650-955e-11e6-9683-f09e9da81555.png)

Edit donor pin subpage

![Screenshot](https://cloud.githubusercontent.com/assets/7486241/19486471/d752dc2c-955e-11e6-847a-2430e8acc53e.png)

Full width Homepage view with Donor pin information popup

![Screenshot](https://cloud.githubusercontent.com/assets/7486241/19486248/0feb7a18-955e-11e6-82d0-883541382a42.png)


## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
  * Node v5 IS NOT SUPPORTED AT THIS TIME!
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Ruby - [Download & Install Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process.
Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ npm install -g grunt-cli
```

* Sass - You're going to use [Sass](http://sass-lang.com/) to compile CSS during your grunt task.
Make sure you have ruby installed, and then install Sass using gem install:

```bash
$ gem install sass
```

```bash
$ npm install -g grunt-cli
```

* Gulp - (Optional) You may use Gulp for Live Reload, Linting, and SASS or LESS.

```bash
$ npm install gulp -g
```

## Installing application

```bash
$ npm install
```

## Running application

```bash
$ npm start
```


## You may also need to do

Depending on your local development environment you may need to run one or more of below commands.

```bash
sudo gem install -n /usr/local/bin sass
npm install -g yo
npm install grunt-contrib-sass --save-dev
npm update -g npm
npm update -g bower
npm update -g grunt-cli
npm cache clean
bower cache clean
bower update
```

## How to test application
Testing server
It executes all server related tests.
Especially have a look at donorpin.server.model.tests.js that tests Mongoose donor pin model.
```bash
grunt test:server
```

Testing client
It executes all client related tests.
```bash
grunt test:client
```


## Assessment acomplished goals
* Index page loads a map
* User can navigate to preferred location
* Donor can create a "donor pin" using popup form
* Donor pin can be edited or deleted using generated link provided on creation
* All donor pin fields are validated. Available bloog groups are A, B, AB, 0.
* Lazy loading of donor pins
* Web sockets
* Pin all information displayed on click

## Improvements
* Add different language support (for this purpose I do not validate first and last name)
* Consider only using Mongo 3.x WiredTiger - it is 3 to 7 times faster on save
* Prettify the website layout. Consider moving the search to more convinient place
* Improve test coverage

## Author notes
Thank you for reading that long readme file. Hope it serves well it's purpose.
Mateusz Grzesiukiewicz

## Side note
You can also build the docker file using the following commands in app/ directory:

```bash
docker-compose build
docker run -t -i app_web
```
However I bumped into some mongo local container problems so I do not recommend choosing this one.
