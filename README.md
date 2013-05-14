SassDoc
==========

## Installation
SassDoc is reliant on node, npm, sass and compass

    git clone https://github.com/middric/sassdoc.git
    cd sassdoc
    npm install
    
## Usage
Start SassDoc by running app.js and passing in your configuration JSON:

    node app demoConfig.json
    
## Configuration parameters

**sassDirectory**  
(String) The directory containing your Sass files. This is a relative path from the configuration file location.

**useCompass**  
(Boolean) Whether or not to use Compass

**imports**  
(Array) An array of Sass files to include by default for all components

**externalCSS**  
(Array) An array of URLs for external stylesheets your Sass is reliant on - for example twitter bootstrap or a reset css

## Documentation tags

**@variable**  
Tag defines if this block refers to a variable

**@component**  
Defines if this block refers to a component (default assumption)

**@package**  
The package that this block belongs to

**@name**  
The name of the block

**@description**  
A description of the block

**@usage**  
Any additional Sass/CSS required to display this block in the documentation. For example if documenting a mixin usage might include Sass which implements the mixin on an element defined by markup.

**@import**  
Any additional Sass files required by the block

**@extends**  
The mixins/variables this block extends

**@markup**  
Some example HTML markup of the Sass in use. The tag is _NOT_ required, any text not preceded by a tag is assumed to be markup
