# [arc42.de](https://arc42.de) Website

Live site is hosted by [netlify](https://netlify.com).

## Status

[![Netlify Status](https://api.netlify.com/api/v1/badges/801e5a9f-f256-478f-89fb-84c9d3df710f/deploy-status)](https://app.netlify.com/sites/arc42de-site/deploys)
![](https://badgen.net/uptime-robot/month/m778709372-640fbdf765be9486dbffe066)
![](https://badgen.net/uptime-robot/week/m778709372-640fbdf765be9486dbffe066)

Uptime stats by [UptimeRobot](https://uptimerobot.com).


![GitHub open issues](https://img.shields.io/github/issues/arc42/arc42.de-site)
![GitHub closed issues](https://img.shields.io/github/issues-closed/arc42/arc42.de-site)
![Github issues total](https://badgen.net/github/issues/arc42/arc42.de-site)



# How does it work?

## General
The site is build and created with Jekyll and Markdown. 
It uses the MinimalMistakes template, with a few slight modifications

* home.md is the homepage, it's mapped (via permalink) to "/".


## Local development

> Prequisite: Local build uses a Docker container. You therefore have to have Docker installed. 

1. checkout the repo
2. run the script `_manage-site.sh`

It will start a local jekyll and will serve the generated content on `0.0.0.0:4000`


## Custom css

* The timeline (in `/termine`) is based upon [w3schools](https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_timeline) 
* Some buttons are also based upon w3schools definition.

Custom css is located in `/assets/css`, the required import statement in `/assets/css/main.scss`


## Form support (for "Anmeldung") and Spam protection
We use [formspark.io](formspark.io) as backend provider for our "Anmeldung".

For spam protection within the form, we use [Botpoison](https://botpoison.com/),
see especially their [getting started with HTML](https://botpoison.com/documentation/getting-started/html/) article:

>1.Import the @botpoison/browser script.<br>
>2. Add your public key to the data-botpoison-public-key attribute.<br>
>3. The solution will automatically be attached to the submission (as the _botpoison field).


### 1: Integrate Botpoison script

In `config.yml`, add the following lines:

```
# the botpoison browser script is required for spam-protection in the Anmeldung-Form
# see https://documentation.formspark.io/setup/spam-protection.html#botpoison
head_scripts:
  - https://unpkg.com/@botpoison/browser
```

### 2: Add required info to form

1. Create the Botpoison publik and secret keys, as explained in Botpoison setup guide
2. In your form's settings, select Botpoison under Spam Protection.
3. Copy the secret key, paste it into the Botpoison secret key field in the Formspark form configuration
4. Add the Botpoison public key to the HTML of the form:

```
<form
      method="POST"
      action="https://submit-form.com/your-form-id"
      data-botpoison-public-key="your-botpoison-public-key"
      target="_blank"
>
```

In our concrete case, that looks as follows (file `_pages/anmeldung.md`)

```
<form action="https://submit-form.com/AIKiYyJP"
      data-botpoison-public-key="pk_8e195655-38ed-4eec-a445-a1e0d68a488d">

```



# Credits

## Site theme
Thanx to Michael Rose, creator of the [Minimal-Mistakes Jekyll Theme](https://mademistakes.com),
follow him on [Twitter](https://twitter.com/mmistakes).

## Icons + Images:

* Free images can be found at [Unsplash](https://unsplash.com/)
* I generated the various favicon files with [RealFavIconGenerator](http://realfavicongenerator.net/).


---

## Licenses


### arc42 Template
The arc42 template is licensed under a [CreativeCommons Sharealike International 4.0 License](https://creativecommons.org/licenses/by-sa/4.0/).

You are free to:

* **Share** — copy and redistribute the template in any medium or format
* **Adapt** — remix, transform, and build upon the material for any purpose, even commercially.


### Website Theme: MIT License (MIT)

Copyright (c) 2016ff Michael Rose

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
