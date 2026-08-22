export type Artist = {
  handle: string
  name: string
  ig: string
  photo: string
}

export type GalleryShot = {
  src: string
  alt: string
  wide?: boolean
}

export const artists: Artist[] = [
  {
    handle: 'scurvy._.dogg',
    name: 'Scurvy',
    ig: 'https://www.instagram.com/scurvy._.dogg/',
    photo: '/photos/artists/scurvy.png',
  },
  {
    handle: 'doctorleyva',
    name: 'Doctor Leyva',
    ig: 'https://www.instagram.com/doctorleyva/',
    photo: '/photos/artists/doctorleyva.png',
  },
  {
    handle: 'mike.new.760',
    name: 'Mike.new.760',
    ig: 'https://www.instagram.com/mike.new.760/',
    photo: '/photos/artists/mike.png',
  },
  {
    handle: 'jsmoke760',
    name: 'J Smoke',
    ig: 'https://www.instagram.com/jsmoke760/',
    photo: '/photos/artists/jsmoke760.png',
  },
]

export const gallery: GalleryShot[] = [
  { src: '/photos/gallery/live.jpg', alt: "Fo' Deep live with full band", wide: true },
  { src: '/photos/gallery/studio-group.jpg', alt: "Fo' Deep studio session" },
  { src: '/photos/gallery/car-wreck.jpg', alt: "Fo' Deep at the car wreck" },
  { src: '/photos/gallery/cartoon.jpg', alt: "Fo' Deep illustrated" },
  { src: '/photos/gallery/studio-board.jpg', alt: 'In the studio' },
  { src: '/photos/gallery/stage.jpg', alt: 'On stage' },
  { src: '/photos/gallery/parking-lot.jpg', alt: 'Fo Deep crew — Oceanside' },
  { src: '/photos/gallery/hennessy.jpg', alt: 'Fo Deep — 760 life' },
]
