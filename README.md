osm_to_mysql_dump
=================
Version 1.0.0


TOC:
====
* [Purpose](README.md#purpose)
* [System requirements](README.md#system-requirements)
* [Quick install](README.md#quick-install)
* [Usage](README.md#usage)
* [Changelog](README.md#changelog)
* [License](README.md#license)
* [Acknowledgments](README.md#acknowledgments)


Purpose:
========
I personally like to know what the data, I use in applications, looks like.
Importing and altering the OSM-Data to GIS into PostgresSQL does not cut it for me, because I personaly find MySql for data exploration easier to use.
I did not find "up-to-date" tools to get the OSM-Format straight into MySql, so I wrote this command-line tool to do the job.


System requirements:
===================
+ __Plattform:__ Node.js >= v6.10.3 should run on previous versions, but is not tested

    *__dependencies:__*
    * [htmlparser2](https://github.com/fb55/htmlparser2)
    * [mysqljs/sqlstring](https://github.com/mysqljs/sqlstring)

+ __Datbase:__ (optional) MySql 5.5.3 or higher. It works without a database, if you just want to save the MySql-output to disk and import it elsewhere.

+ *Recommended:* diskspace on a fast harddrive and a nice chunk of RAM for the database


Install:
========
* Install Node.js (http://nodejs.org/)
* (optionally) Install MySql locally (e.g. from http://www.apachefriends.org)
* Download and unpack the source code to a directory of your choice
* Use ```npm install``` in that directory to install the dependencies
* Create a DB named e.g. 'osm' and import the schema at [./sql/osm_structure.sql](sql/osm_structure.sql) and a MySql-client of your choice
* Get the .osm file you want to import from (http://www.openstreetmap.org) or mirrors there of


USAGE
=====
__Basic:__
```node osm_to_mysql_dump.js YourOSMXML-Document.osm```

Converts and outputs "YourOSMXML-Document.osm" to MySQL and outputs it to the screen.


__Write MySql to file:__

Assuming your OSM-XML-file resides already in the directory you installed osm_to_mysql_dump in. Simply run the command-line:

```node osm_to_mysql_dump.js [infile].osm > [outfile].sql```

You can then import the SQL-file into a MySql-Database with your mysql-native client or something like phpMyAdmin.

e.g. ```mysql -uroot -hlocalhost -pPASSWORD osm < convertedOSM.sql```


__Write MySql directly into the database via '|'-Operator and native client:__

```node osm_to_mysql_dump.js nordrhein-westfalen-latest.osm | mysql -uroot -pYOURPASSHERE -hlocalhost osm```

On a windows-system this would look something like this:

```node e:\gits\osm_to_mysql_dump\osm_to_mysql_dump.js e:\gits\nordrhein-westfalen-latest.osm | E:\xampp\mysql\bin\mysql -uroot -pYOURPASSHERE -hlocalhost osm```


Changelog:
==========
__Version 1.0.0__

+ first release

+ [changelog](changelog.md)


[License](LICENSE):
=======
(The MIT License)

Copyright (c) 2017 by Kai Stephan Koch kai.koch@gmail.com and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


Acknowledgments:
================
This tool is based on a blog-post on [goblor grübelt](http://goblor.de/wp/2009/10/16/openstreetmap-projekt-teil-1-openstreetmap-daten-in-mysql-datenbank-einlesen/)