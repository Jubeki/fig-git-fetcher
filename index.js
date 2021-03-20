
// Require necessary libraries
const fetch = require('node-fetch')
const HTMLParser = require('node-html-parser')
const HTMLStrip = require("string-strip-html")

// Parse git command to kebab case
const gitCommand = process.argv.slice(2).join('-')

// Pipeline the git docs of the command
fetch('https://git-scm.com/docs/' + gitCommand)
.then(res => res.text())
.then(webpage => convertToSpec(HTMLParser.parse(webpage)))
.then(spec => console.log(spec))

function convertToSpec(document)
{
    // Get all Options which are on the webpage
    var optionsBody = document.querySelector('#_options').nextElementSibling
    var optionLists = optionsBody.querySelectorAll('dl')

    var spec = '';

    // Sometimes there are multiple lists of options so they need to be merged together
    optionLists.forEach(optionList => {
        spec += convertDataListToSpec(optionList.childNodes)
    })

    return spec;

}

function convertDataListToSpec(datalist)
{
    var spec = ''
    var wasDt = false
    var arg = ''

    datalist.forEach(elem => {

        // Ignore TextNodes
        if(!(elem instanceof HTMLParser.HTMLElement)) {
            return;
        }

        // Option name is inside a dt tag
        if(elem.rawTagName == 'dt') {

            // Add multiple names for one option
            // Example: ["-v", "--verbose"]
            if(!wasDt) {
                wasDt = true
                spec += "{\r\n"
                spec += '    name: ['
            } else {
                spec += ", "
            }

            // Seperate Option and arguments
            var option = elem.innerText.trim().split(" ")
            if(option.length == 1) {
                option = elem.innerText.trim().split("=")
            }

            // Only add argument if necessary
            if(option.length != 1) {
                arg = option[1].trim().replace("&lt;", "").replace("&gt;", "");
            }

            spec += '"' + option[0] + '"'

            return
        }

        // Option description is inside a dd tag
        if(elem.rawTagName == 'dd') {

            // Strip all HTML Tags from the description and remove new lines
            var description = HTMLStrip.stripHtml(elem.innerHTML).result.split('\n').join(" ").replace("  ", " ")

            // Max length is limited to 80 characters
            if(description.length > 80) {
                description = description.substring(0, 77) + "..."
            }

            spec += "],\r\n"
            spec += '    description: "' + description + '",\r\n'

            // Add args if needed
            if(arg != '') {
                spec += '    args: {\r\n'
                spec += '        name: "' + arg + '",\r\n'
                spec += '        isOptional: true,\r\n'
                spec += '    },\r\n'
            }

            spec += "},\r\n"

            arg = ''
            wasDt = false

            return;
        }

        // Should we enter this case then please take a look at the fetched html
        console.log('!!! ERRROR WHILE PARSING !!!')
    })

    return spec
}