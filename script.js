// fetch the config.json file from the root of the server
fetch("config.json").then(res => res.json())
    .then(json => {
        // each key represents a category
        for (let category in json) {
            // create a div and header for the category
            let category_div = document.createElement("div")
            let category_head = document.createElement("h2")
            category_head.innerText = category
            category_div.append(category_head)
            document.body.append(category_div)

            // each sub-key represents a service
            for (let service in json[category]) {
                // create a clickable div that opens the service
                let site = document.createElement("div")
                site.className = "site"
                site.addEventListener('click', event => window.open(json[category][service], "_blank"))
                category_div.append(site)

                // create a span with the service's name
                let name = document.createElement("div")
                name.innerText = service
                site.append(name)

                // in small text list the service's status
                let status = document.createElement("small")
                status.innerText = "Fetching status..."
                site.append(status)

                // attempt to fetch the service, force a cache reload, don't follow redirects
                fetch(json[category][service], {"cache": "reload", "redirect": "manual"}).then(res => {
                    // set the color based on the returned status
                    switch (res.status) {
                        case 200:
                            status.innerText = "Online"
                            status.style.color = "Green"
                            break
                        // probably VPN restricted
                        case 403:
                            status.innerText = "Forbidden"
                            status.style.color = "Orange"
                            break
                        case 0:
                            // attempted redirect, normally desired
                            if (res.type == "opaqueredirect") {
                                status.innerText = "Redirected"
                                status.style.color = "Green"
                            }
                            break
                        default:
                            console.log(service, res)
                            status.innerText = "Unknown"
                            status.style.color = "Yellow"
                            break
                    }
                // catch any error loading the service, list in red as unavailable
                }).catch(err => {
                    status.innerText = "Unavailable"
                    status.style.color = "Red"
                })
            }
        }
    })