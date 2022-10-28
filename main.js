import './style.css'

const myMap = L.map('map').setView([0, 0], 0)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  minZoom: 2,

  //position
  noWrap: true,

  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(myMap)

function generateList() {
  const ul = document.querySelector('.list')
  storeList.forEach((monument) => {
    const li = document.createElement('li')
    const div = document.createElement('div')
    const starDiv = document.createElement('div')
    const a = document.createElement('a')
    const p = document.createElement('p')
    const star = document.createElement('span')

    // make the star element like <span class="material-symbols-outlined">
    // star
    // </span>

    star.classList.add('material-symbols-outlined')

    star.classList.add('star')
    star.textContent = 'star'

    div.classList.add('list-element')
    starDiv.classList.add('star-div')

    a.addEventListener('click', () => {
      flyToStore(monument)
    })
    div.classList.add('monument-item')
    a.innerText = monument.properties.name
    a.href = '#'
    p.innerText = monument.properties.address

    div.appendChild(a)
    div.appendChild(p)
    li.appendChild(div)
    li.appendChild(starDiv)
    ul.appendChild(li)
    starDiv.appendChild(star)
  })
}

generateList()

function makePopupContent(monument) {
  return `
    <div class="card" >
        <h4>${monument.properties.name}</h4>
        <p>${monument.properties.address}</p>
        <div class="img">
            <img src="${monument.properties.image}" alt="${monument.properties.name}">
        </div>
    </div>
  `
}
function onEachFeature(feature, layer) {
  layer.bindPopup(makePopupContent(feature), {
    closeButton: false,
    offset: L.point(0, -8),
  })
}

var myIcon = L.icon({
  iconUrl: 'marker.png',
  iconSize: [30, 40],
})

var favIcon = L.icon({
  iconUrl: 'yellowMarker.png',
  iconSize: [30, 40],
})

const monumentsLayer = L.geoJSON(storeList, {
  onEachFeature: onEachFeature,
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: myIcon })
  },
})
monumentsLayer.addTo(myMap)

function flyToStore(store) {
  const lat = store.geometry.coordinates[1]
  const lng = store.geometry.coordinates[0]
  myMap.flyTo([lat, lng], 14, {
    duration: 3,
  })
  setTimeout(() => {
    L.popup({ closeButton: false, offset: L.point(0, -8) })
      .setLatLng([lat, lng])
      .setContent(makePopupContent(store))
      .openOn(myMap)
  }, 3000)
}

const resetZoom = document.querySelector('.earth-icon')

resetZoom.addEventListener('click', () => {
  myMap.setView([0, 0], 0)
})

const star = document.querySelectorAll('.star')

star.forEach((star) => {
  star.addEventListener('click', () => {
    star.classList.toggle('star-active')

    if (star.classList.contains('star-active')) {
      const monumentLi = star.parentElement.parentElement
      const list = document.querySelector('.list')
      list.insertBefore(monumentLi, list.childNodes[0])

      const monumentName = monumentLi.querySelector('a').innerText

      const monument = storeList.find(
        (monument) => monument.properties.name === monumentName
      )

      const lat = monument.geometry.coordinates[1]
      const lng = monument.geometry.coordinates[0]

      //monument marker
      const monumentMarker = L.marker([lat, lng], { icon: favIcon })
      monumentMarker.addTo(myMap)
    } else {
      const monumentLi = star.parentElement.parentElement
      const list = document.querySelector('.list')
      list.appendChild(monumentLi)

      const monumentName = monumentLi.querySelector('a').innerText

      const monument = storeList.find(
        (monument) => monument.properties.name === monumentName
      )

      const lat = monument.geometry.coordinates[1]
      const lng = monument.geometry.coordinates[0]

      //monument marker
      const monumentMarker = L.marker([lat, lng], { icon: myIcon })
      monumentMarker.addTo(myMap)
    }
  })
})
