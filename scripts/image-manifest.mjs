/**
 * Image manifest for `npm run images:download`.
 *
 * Lists every remote photo used by the site plus the local `.webp` file it
 * should be downloaded/resized/optimized into. After running the script, point
 * the `image` / `imagePreview` fields in `data/*.ts` to these static paths.
 */
export default [
  // ---- SELECTED WORKS (uniform 4:3, renders ~700px wide @2x retina) ----
  {
    id: "works/work-01",
    src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=75&w=1600&auto=format&fit=crop",
    dest: "public/images/works/work-01.webp",
    width: 1280,
    height: 960,
  },
  {
    id: "works/work-02",
    src: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=75&w=1600&auto=format&fit=crop",
    dest: "public/images/works/work-02.webp",
    width: 1280,
    height: 960,
  },
  {
    id: "works/work-03",
    src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=75&w=1600&auto=format&fit=crop",
    dest: "public/images/works/work-03.webp",
    width: 1280,
    height: 960,
  },
  {
    id: "works/work-04",
    src: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?q=75&w=1600&auto=format&fit=crop",
    dest: "public/images/works/work-04.webp",
    width: 1280,
    height: 960,
  },

  // ---- CAPABILITIES (small thumbnails for hover preview + mobile accordion) ----
  {
    id: "capabilities/cnc-machining",
    src: "https://images.unsplash.com/photo-1565439390234-58cb30cce4b4?q=75&w=1600&auto=format&fit=crop",
    dest: "public/images/capabilities/cnc-machining-preview.webp",
    width: 800,
    height: 500,
  },
  {
    id: "capabilities/laser-cutting",
    src: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=75&w=1600&auto=format&fit=crop",
    dest: "public/images/capabilities/laser-cutting-preview.webp",
    width: 800,
    height: 500,
  },
  {
    id: "capabilities/plasma-cutting",
    src: "https://images.unsplash.com/photo-1505098935706-93da5394beee?q=75&w=1600&auto=format&fit=crop",
    dest: "public/images/capabilities/plasma-cutting-preview.webp",
    width: 800,
    height: 500,
  },
  {
    id: "capabilities/3d-printing",
    src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=75&w=1600&auto=format&fit=crop",
    dest: "public/images/capabilities/3d-printing-preview.webp",
    width: 800,
    height: 500,
  },
  {
    id: "capabilities/prototyping",
    src: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=75&w=1600&auto=format&fit=crop",
    dest: "public/images/capabilities/prototyping-preview.webp",
    width: 800,
    height: 500,
  },
];