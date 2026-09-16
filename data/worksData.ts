export interface WorkProject {
  id: string;
  number: string;
  title: string;
  category: string;
  material: string;
  method: string;
  tolerance: string;
  year: string;
  description: string;
  image: string;
  clientSector: string;
  layout: {
    columnSpan: string; // e.g. "col-span-12 lg:col-span-6"
    align: "left" | "right" | "center";
    aspectRatio: string; // e.g. "aspect-[16/10]"
    offsetY?: string; // negative margin for asymmetric overlap
  };
}

// NOTE — IMAGE SOURCES:
// Default: remote Unsplash URLs use `fm=webp&q=70` so the browser receives a
// lightweight WebP directly from the CDN.
// Local (self-hosted) option: run `npm run images:download`, then replace the
// `image` value with a static path, e.g. "/images/works/work-01.webp".
export const worksData: WorkProject[] = [
  {
    id: "work-01",
    number: "01",
    title: "AEROSPACE MONOLITHIC BRACKET",
    category: "AEROSPACE STRUCTURAL",
    material: "TITANIUM TI-6AL-4V",
    method: "5-AXIS SIMULTANEOUS CNC",
    tolerance: "±0.008 MM",
    year: "2026",
    description:
      "Milled from a solid 45kg billet down to a 1.8kg topology-optimized aerospace mount. Stress-relieved with zero vibration chatter across deep pockets.",
    image:
      "/images/works/aero-work1.webp",
    clientSector: "DEFENSE & AVIONICS",
    layout: {
      columnSpan: "lg:col-span-6",
      align: "left",
      aspectRatio: "aspect-[4/3]",
      offsetY: "",
    },
  },
  {
    id: "work-02",
    number: "02",
    title: "HIGH-IMPACT CHASSIS PLATE",
    category: "OFF-ROAD VEHICLE DYNAMICS",
    material: "HARDOX 450 WEAR STEEL",
    method: "400A PLASMA + CNC FORMING",
    tolerance: "±0.25 MM",
    year: "2026",
    description:
      "Heavy-gauge impact armor skid plate cut with robotic multi-axis beveling. Engineered to resist cyclic torsional shock in extreme desert endurance testing.",
    image:
      "/images/works/chasis-work2.webp",
    clientSector: "MOTORSPORT ENGINEERING",
    layout: {
      columnSpan: "lg:col-span-6",
      align: "right",
      aspectRatio: "aspect-[4/3]",
      offsetY: "lg:mt-24",
    },
  },
  {
    id: "work-03",
    number: "03",
    title: "LIQUID-COOLED SENSOR ENCLOSURE",
    category: "AUTONOMOUS NAVIGATION",
    material: "ALUMINUM 6061-T6 ANODIZED",
    method: "CNC TURNING + LASER ENGRAVING",
    tolerance: "±0.012 MM",
    year: "2026",
    description:
      "Hermetically sealed lidar sensor housing with internal helical cooling jackets. Surface treated with Type III Class 2 hard-coat black anodizing.",
    image:
      "/images/works/liquid-work3.webp",
    clientSector: "ROBOTICS & LIDAR",
    layout: {
      columnSpan: "lg:col-span-6",
      align: "left",
      aspectRatio: "aspect-[4/3]",
      offsetY: "lg:mt-12",
    },
  },
  {
    id: "work-04",
    number: "04",
    title: "CONFORMAL TURBINE MANIFOLD",
    category: "ENERGY & THERMAL FLUIDS",
    material: "INCONEL 718 SUPERALLOY",
    method: "DMLS ADDITIVE + POST-MACHINING",
    tolerance: "±0.015 MM",
    year: "2026",
    description:
      "Hybrid additive-manufactured turbine shroud featuring organic internal cooling channels impossible to produce via traditional tooling, finished on 5-axis CNC.",
    image:
      "/images/works/manifold-work4.webp",
    clientSector: "PROPULSION & ENERGY",
    layout: {
      columnSpan: "lg:col-span-6",
      align: "center",
      aspectRatio: "aspect-[4/3]",
      offsetY: "lg:mt-24",
    },
  },
];

