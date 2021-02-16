let store = {
    user: Immutable.Map({ name: "Student" }),
    rovers: Immutable.List([]),
    roverDetail: Immutable.Map(),
    photos: Immutable.List([]),
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// create content
const App = (state) => {
    let { rovers } = state

    return `
        <header>
        ${Greeting(store.user.get("name"))}
        </header>
        <main>
                <section class="rovers">
                    ${store.rovers
            .map(
                (rover) =>
                    `<div onclick="handleRoverDetail('${rover.name.toLowerCase()}')" class="rover">
                    <img src="assets/images/${rover.name.toLowerCase()}.jpg" class="rover-image" alt="${rover.name}">
                    <div class="rover-body">
                        <h3>
                        ${rover.name}
                        </h3>
                        <p>
                        Status: ${rover.status}
                        </p>
                    </div>
                    </div>
                    `
            )
            .join("")}
                </section>
                 <section class="rover-detail">
                 ${roverDetail()}
        </section>
        </main>
        <footer>
                <span>
                Intermediate JavaScript Nanodegree Program - Mars Dashboard Project
                </span>
        </footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', async () => {
    console.log(store);
    const rovers = await getRoversList();
    updateStore(store, { rovers });
    console.log(rovers);
    console.log(store);
})

// ------------------------------------------------------  COMPONENTS

const handleRoverDetail = async (rover) => {
    try {
        const result = await fetch(`rovers/${rover}`);
        const photos = await result.json();
        updateStore(store, { photos: photos.latest_photos });
        updateStore(store, { roverDetail: photos.latest_photos.length > 0 ? photos.latest_photos[0].rover : null });
        console.log(photos);
    } catch (error) {
        console.error(error);
    }
}

const roverDetail = () => {
    if (store.roverDetail.id) {
        return `

        <p><span>Rover: </span>${store.roverDetail.name}</p>
    <p><span>Launch date: </span>${store.roverDetail.launch_date}</p>
				<p><span>Landing date:</span> ${store.roverDetail.landing_date}</p>
                <p><span>Status: </span>${store.roverDetail.status}</p>
                <p><span>Number of photos:</span> ${store.photos.length}</p>

                <div>
                 ${store.photos
                .map(
                    (photo) =>
                        `
                    <img src="${photo.img_src}"/><p>${photo.earth_date}</p>
                    `
                )
                .join("")}
                </div>

    `;
    } else {
        return ``;
    }
}

const getRoversList = async () => {
    try {
        const result = await fetch('/rovers');
        const rovers = await result.json();
        return rovers;
    } catch (error) {
        console.error(error);
    }
}

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
        <h1>Mars Dashboard</h1>
        <h2>Welcome, ${name}!</h2>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate()) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    return data
}