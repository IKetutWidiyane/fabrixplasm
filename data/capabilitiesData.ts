export interface CapabilityItemData {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  image: string;
  tags: string[];
}

export const capabilitiesData: CapabilityItemData[] = [
  {
    id: "01",
    name: "CNC MACHINING",
    shortName: "CNC",
    subtitle: "Subtractive High-Precision Milling & Turning",
    description:
      "Computer-controlled multi-axis machining for tight tolerance mechanical components, complex geometric pockets, and aerospace-grade surface finishes.",
    specs: [
      { label: "AXIS", value: "3-AXIS & 5-AXIS SIMULTANEOUS" },
      { label: "TOLERANCE", value: "±0.01 MM (10 MICRONS)" },
      { label: "MAX ENVELOPE", value: "1200 × 800 × 500 MM" },
      { label: "MATERIALS", value: "ALUMINUM, TITANIUM, STEEL, BRASS, PEEK" },
    ],
    image: "https://images.unsplash.com/photo-1565439390234-58cb30cce4b4?q=75&w=1200&auto=format&fit=crop",
    tags: ["5-AXIS", "MILLING", "TURNING", "AEROSPACE"],
  },
  {
    id: "02",
    name: "LASER CUTTING",
    shortName: "LASER",
    subtitle: "High-Speed Fiber Optical Beam Profiling",
    description:
      "Focused 12kW fiber laser cutting with minimal thermal heat-affected zones (HAZ), micro-tabbing capabilities, and burr-free edge precision.",
    specs: [
      { label: "SOURCE", value: "12KW FIBER RESONATOR" },
      { label: "SHEET THICKNESS", value: "0.5 MM – 25 MM" },
      { label: "POSITION ACCURACY", value: "±0.03 MM" },
      { label: "GAS ASSIST", value: "HIGH-PRESSURE N2 / O2" },
    ],
    image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=75&w=1200&auto=format&fit=crop",
    tags: ["FIBER LASER", "SHEET METAL", "NITROGEN", "BURR-FREE"],
  },
  {
    id: "03",
    name: "PLASMA CUTTING",
    shortName: "PLASMA",
    subtitle: "High-Definition Heavy Plate Thermal Severing",
    description:
      "Constricted ionized gas arc at 20,000°C delivering deep penetration cutting for structural steel, armor plates, and heavy architectural frameworks.",
    specs: [
      { label: "CURRENT", value: "400A HIGH-DEFINITION ARC" },
      { label: "SEVERANCE LIMIT", value: "UP TO 80 MM MILD STEEL" },
      { label: "BEVELING", value: "±45° MULTI-AXIS BEVEL HEAD" },
      { label: "BED CAPACITY", value: "3000 × 6000 MM" },
    ],
    image: "https://images.unsplash.com/photo-1505098935706-93da5394beee?q=75&w=1200&auto=format&fit=crop",
    tags: ["HEAVY STEEL", "400A ARC", "BEVEL CUT", "STRUCTURAL"],
  },
  {
    id: "04",
    name: "3D PRINTING",
    shortName: "3D PRINT",
    subtitle: "Industrial Additive Manufacturing & Polymers",
    description:
      "SLA and SLS additive manufacturing for functional end-use prototypes, internal conformal channels, and weight-optimized generative topologies.",
    specs: [
      { label: "TECHNOLOGY", value: "INDUSTRIAL SLS & HIGH-RES SLA" },
      { label: "LAYER HEIGHT", value: "25 – 100 MICRONS" },
      { label: "POLYMERS", value: "PA12 CARBON, RESIN, TPU, ESD-SAFE" },
      { label: "OPTIMIZATION", value: "LATTICE & TOPOLOGY GENERATION" },
    ],
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=75&w=1200&auto=format&fit=crop",
    tags: ["SLS / SLA", "PA12 NYLON", "TOPOLOGY OPTIMIZATION"],
  },
  {
    id: "05",
    name: "PROTOTYPING",
    shortName: "PROTOTYPE",
    subtitle: "Rapid Iterative Engineering & Assembly",
    description:
      "Fast-turnaround functional engineering validation. Converting raw CAD geometries into physical test assemblies within 48 to 72 hours.",
    specs: [
      { label: "TURNAROUND", value: "48 – 72 HOURS EXPRESS" },
      { label: "VALIDATION", value: "CMM INSPECTION & GD&T VERIFIED" },
      { label: "FINISHING", value: "BEAD BLAST, ANODIZE, HEAT TREAT" },
      { label: "INTEGRATION", value: "HARDWARE & FASTENER INSERTION" },
    ],
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=75&w=1200&auto=format&fit=crop",
    tags: ["EXPRESS 48H", "CMM INSPECTED", "FUNCTIONAL ASSEMBLY"],
  },
];

