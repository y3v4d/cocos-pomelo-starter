# Cocos Creator 2.4.9 PomeloJS Starter

Project aims to show how to use PomeloJS plugin with Cocos Creator 2.4.9 (plugin itself can work on different versions as well).

## Basic requirements
- NodeJS 16
- Cocos Creator 2.4.9

## Setup
- Clone project using command line or download it through browser
- Extract the project and go into **server** folder
- Type `npm i -d` to install all needed dependencies
- Type `npm i --global pomelo` to globally install PomeloJS
- Inside **server** folder run server using `pomelo start` or `npx pomelo start` command (depending if global NodeJS packages are registered in you **PATH**)
- Open project using Cocos Creator 2.4.9
- Lanuch project and check if it works - with default values in edit boxes it should connect to the server and go to the **channel** scene
- Experiment with the project to learn about Cocos and PomeloJS integration